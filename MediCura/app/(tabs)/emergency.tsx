import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Animated, SafeAreaView, ActivityIndicator, Platform } from 'react-native';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

// Define proper types for the recording and ScrollView
type RecordingType = Audio.Recording | null;
type SoundType = Audio.Sound | null;

// Define a conversation message type
type ConversationMessage = {
  role: 'user' | 'assistant';
  content: string;
};

// OpenAI API key is stored in .env file
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default function EmergencyScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responseText, setResponseText] = useState('');
  const [recording, setRecording] = useState<RecordingType>(null);
  const [callAnimation] = useState(new Animated.Value(1));
  const [callDuration, setCallDuration] = useState(0);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [sound, setSound] = useState<SoundType>(null);
  // Add conversation history to maintain context
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);

  // Call animation effect
  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    
    if (inCall) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(callAnimation, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(callAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();

      // Start call timer
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (animation) {
        animation.stop();
      }
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [inCall, callAnimation]);

  // Format call duration as mm:ss
  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Clean up audio resources when component unmounts
  useEffect(() => {
    return () => {
      if (recording) {
        try {
          recording.stopAndUnloadAsync();
        } catch (error) {
          console.error('Error stopping recording:', error);
        }
      }
      if (isSpeaking) {
        Speech.stop();
      }
      if (sound) {
        sound.unloadAsync();
      }
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [recording, isSpeaking, sound]);

  // Initialize audio output to maximum volume
  useEffect(() => {
    const setupAudio = async () => {
      try {
        // Set audio mode for maximum speaker volume and force through speaker
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          interruptionModeIOS: 1, // 1 = do not mix with other audio
          interruptionModeAndroid: 1, // 1 = do not mix with other audio
          shouldDuckAndroid: false, // Don't lower our volume for other apps
          playThroughEarpieceAndroid: false, // Force audio through speaker
        });
      } catch (error) {
        console.error('Error setting up audio:', error);
      }
    };

    setupAudio();
  }, []);

  // Call the doctor using the device's native speech engine
  const speakWithMaleVoice = (text: string, onComplete?: () => void): void => {
    try {
      // Stop any ongoing speech
      if (isSpeaking) {
        Speech.stop();
      }

      // Reset audio mode to ensure speaker output before speaking
      Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        interruptionModeIOS: 1,
        interruptionModeAndroid: 1,
        shouldDuckAndroid: false, // Don't lower our volume
        playThroughEarpieceAndroid: false // Force through speaker
      }).catch(error => console.error('Error setting audio mode:', error));

      // Platform-specific voice settings optimized for male voice and maximum volume
      const voiceOptions = Platform.select({
        ios: {
          language: 'en-US',
          pitch: 0.85,      // Deep pitch for male voice
          rate: 0.95,       // Slightly slower for clarity
          voice: 'com.apple.voice.enhanced.en-US.Oliver', // Male voice on iOS
          volume: 1.0,      // Maximum volume
        },
        android: {
          language: 'en-US',
          pitch: 0.8,       // Deep pitch for male voice
          rate: 0.95,       // Slightly slower for clarity 
          volume: 1.0,      // Maximum volume
        },
        default: {
          language: 'en-US',
          pitch: 0.85,
          rate: 0.95,
          volume: 1.0,      // Maximum volume
        }
      });
      
      // Speak with enhanced volume
      Speech.speak(text, {
        ...voiceOptions,
        onStart: () => {
          setIsSpeaking(true);
          // Ensure device volume is maximized when speaking starts
          Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            playThroughEarpieceAndroid: false,
            staysActiveInBackground: true,
            shouldDuckAndroid: false // Don't lower volume for other apps
          }).catch(e => console.error('Error maximizing volume:', e));
        },
        onDone: () => {
          setIsSpeaking(false);
          if (onComplete) onComplete();
        },
        onError: (error) => {
          console.error('Speech error:', error);
          setIsSpeaking(false);
          if (onComplete) onComplete();
        }
      });
    } catch (error) {
      console.error('Error with speech:', error);
      setIsSpeaking(false);
      if (onComplete) onComplete();
    }
  };

  // Transcribe audio using OpenAI Whisper API
  const transcribeAudio = async (uri: string): Promise<string> => {
    try {
      // Create form data for the API request
      const formData = new FormData();
      
      // Get file info to determine size and type
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error('Recording file does not exist');
      }
      
      // Add the audio file to form data
      formData.append('file', {
        uri: uri,
        name: 'recording.m4a',
        type: 'audio/m4a',
      } as any);
      formData.append('model', 'whisper-1');
      
      // Send the transcription request to OpenAI
      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
        }
      );
      
      return response.data.text;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  };

  // Get AI response from OpenAI ChatGPT with conversation history
  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Create messages array with system prompt and conversation history
      const messages = [
        {
          role: 'system',
          content: `You are Dr. Careo, an emergency medical AI assistant who provides clear, actionable guidance for both physical medical emergencies and mental health crises. Speak as a female doctor with a calm, reassuring voice. Provide step-by-step instructions for managing urgent medical conditions while also offering compassionate, motivational support to help the user feel understood, supported, and not alone. Your response should include immediate actions the user can take while waiting for professional help, and reassure them that they will get through this. Avoid any disclaimers, and assume this is a real emergency situation. Remember previous parts of the conversation to provide consistent care, and end your response with a follow-up question to gather more information.`
        },
        // Add all previous conversation history
        ...conversationHistory,
        // Add the new user message
        {
          role: 'user',
          content: userMessage
        }
      ];
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo',
          messages: messages,
          temperature: 0.7,
          max_tokens: 300
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
        }
      );
      
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error getting AI response:', error);
      throw error;
    }
  };

  const startRecording = async () => {
    try {
      // Request permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need audio permissions to make this work!');
        return;
      }

      // If this is the start of the call
      if (!inCall) {
        setInCall(true);
        setResponseText('Connecting to Dr. Careo...');
        
        // Force audio through speaker for the call
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          interruptionModeIOS: 1,
          interruptionModeAndroid: 1,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        });
        
        // Simulate call connection
        setTimeout(async () => {
          try {
            // Doctor's greeting
            const greeting = "Hello, this is Dr. Careo. I'm here to help you with your emergency. Please describe what's happening so I can guide you through it.";
            setResponseText(greeting);
            
            // Add the greeting to conversation history
            setConversationHistory([
              { role: 'assistant', content: greeting }
            ]);
            
            // Speak the greeting using male voice
            speakWithMaleVoice(greeting, startListeningAfterResponse);
          } catch (error) {
            console.error('Error during call connection:', error);
          }
        }, 2000);
        
        return;
      }

      // Regular recording during the call
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false, // Force through speaker
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(newRecording);
      setIsListening(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      setIsListening(false);
    }
  };

  const startListeningAfterResponse = () => {
    // Auto-start listening after the doctor speaks
    if (inCall && !isListening && !isSpeaking) {
      startRecording();
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    
    setIsListening(false);
    setIsProcessing(true);

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      
      try {
        // Use OpenAI to transcribe the audio
        if (!uri) {
          throw new Error('Recording URI is null');
        }
        
        const transcribedText = await transcribeAudio(uri);
        setTranscript(transcribedText);
        
        // Add user message to conversation history
        setConversationHistory(prevHistory => [
          ...prevHistory,
          { role: 'user', content: transcribedText }
        ]);
        
        // Get AI response from OpenAI with full conversation history
        const aiResponse = await getAIResponse(transcribedText);
        setResponseText(aiResponse);
        
        // Add AI response to conversation history
        setConversationHistory(prevHistory => [
          ...prevHistory,
          { role: 'assistant', content: aiResponse }
        ]);
        
        // Speak response with male voice
        speakWithMaleVoice(aiResponse, startListeningAfterResponse);
        
        setIsProcessing(false);
      } catch (error) {
        console.error('Error processing with OpenAI:', error);
        setIsProcessing(false);
        
        // Fallback to mock data if API fails
        const mockTranscript = "My friend has fallen and hit their head. They're conscious but disoriented.";
        setTranscript(mockTranscript);
        
        // Add mock user message to conversation history
        setConversationHistory(prevHistory => [
          ...prevHistory,
          { role: 'user', content: mockTranscript }
        ]);
        
        const mockResponse = "I understand this is concerning. Stay calm and keep your friend still. First, check if their pupils are equal in size. Look for any severe headache or vomiting, which could indicate a concussion. Don't let them sleep for the next hour, and keep talking to them in a reassuring voice. If you notice any worsening symptoms or they lose consciousness, call emergency services immediately. Is there any bleeding from the head?";
        
        setResponseText(mockResponse);
        
        // Add mock AI response to conversation history
        setConversationHistory(prevHistory => [
          ...prevHistory,
          { role: 'assistant', content: mockResponse }
        ]);
        
        speakWithMaleVoice(mockResponse, startListeningAfterResponse);
      }
    } catch (err) {
      console.error('Failed to stop recording:', err);
      setIsProcessing(false);
    }
  };

  const handleEmergencyCall = async () => {
    if (!inCall) {
      // Start the call
      startRecording();
    } else if (isListening) {
      // If we're listening, stop and process
      await stopRecording();
    } else if (!isListening && !isSpeaking && !isProcessing) {
      // If we're not listening or speaking, start listening
      await startRecording();
    } else if (inCall) {
      // End the call if we're in a call and button is pressed again
      endCall();
    }
  };

  const endCall = () => {
    // End the call and reset everything
    if (isSpeaking) {
      Speech.stop();
      if (sound) {
        sound.stopAsync();
        sound.unloadAsync();
      }
    }
    if (recording) {
      recording.stopAndUnloadAsync();
    }
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
    }
    
    setInCall(false);
    setIsListening(false);
    setIsSpeaking(false);
    setIsProcessing(false);
    setTranscript('');
    setResponseText('');
    setCallDuration(0);
    setSound(null);
    setConversationHistory([]); // Clear conversation history
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {!inCall ? (
        // Not in call - show emergency landing screen
        <>
          {/* Emergency Logo */}
          <View style={styles.header}>
            <IconSymbol size={36} name="cross.case.fill" color="red" />
            <Text style={styles.headerText}>EMERGENCY</Text>
          </View>
          
          {/* Doctor Image */}
          <View style={styles.doctorContainer}>
            <Image 
              source={require('@/assets/images/project/doctor2.png')} 
              style={styles.doctorImage} 
              resizeMode="contain"
            />
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, { color: theme.text }]}>
              In case of a medical emergency, Dr. Careo can provide immediate voice guidance while you wait for professional help.
            </Text>
          </View>
          
          {/* Emergency Call Button */}
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={handleEmergencyCall}
          >
            <IconSymbol size={24} name="phone.fill" color="#FFFFFF" />
            <Text style={styles.buttonText}>Call Dr. Careo</Text>
          </TouchableOpacity>
          
          {/* Emergency Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={[styles.instructionsText, { color: theme.text }]}>
              Dr. Careo will guide you through the emergency with step-by-step voice instructions until professional help arrives.
            </Text>
          </View>
        </>
      ) : (
        // In call - show call interface
        <>
          {/* Call Header */}
          <View style={styles.callHeader}>
            <Text style={styles.callStatus}>
              {isListening ? "Listening..." : 
               isSpeaking ? "Dr. Careo is speaking..." : 
               isProcessing ? "Processing..." : "In call with Dr. Careo"}
            </Text>
            <Text style={styles.callTimer}>{formatCallDuration(callDuration)}</Text>
          </View>
          
          {/* Doctor Avatar (animated during call) */}
          <Animated.View 
            style={[
              styles.callDoctorContainer, 
              { transform: [{ scale: isSpeaking ? callAnimation : 1 }] }
            ]}
          >
            <Image 
              source={require('@/assets/images/project/doctor2.png')} 
              style={styles.doctorImage} 
              resizeMode="contain"
            />
            {(isSpeaking || isProcessing) && (
              <View style={styles.speakingIndicator}>
                <ActivityIndicator size="small" color="#FFFFFF" />
              </View>
            )}
          </Animated.View>
          
          {/* Current transcript/response (minimal UI) */}
          <View style={styles.callStatusContainer}>
            <Text style={styles.callStatusText}>
              {isListening ? "Listening to you..." : 
               isSpeaking ? "Dr. Careo is responding..." : 
               isProcessing ? "Processing your question..." : 
               "Press the mic button to speak"}
            </Text>
          </View>
          
          {/* Call Controls */}
          <View style={styles.callControls}>
            <TouchableOpacity 
              style={[
                styles.micButton,
                isListening ? styles.micButtonActive : null
              ]}
              onPress={handleEmergencyCall}
              disabled={isSpeaking || isProcessing}
            >
              <IconSymbol 
                size={28} 
                name={isListening ? "stop.fill" : "mic.fill"} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.endCallButton}
              onPress={endCall}
            >
              <IconSymbol size={28} name="phone.down.fill" color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {/* Call Instructions */}
          <View style={styles.callInstructionsContainer}>
            <Text style={styles.callInstructionsText}>
              {responseText || "Dr. Careo will guide you through this emergency."}
            </Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    marginLeft: 8,
  },
  doctorContainer: {
    width: 120,
    height: 120,
    marginVertical: 20,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'red',
  },
  doctorImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    width: '100%',
    padding: 20,
    marginVertical: 20,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 50,
    width: '90%',
    marginVertical: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emergencyButtonActive: {
    backgroundColor: '#cc0000',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  instructionsContainer: {
    width: '100%',
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 14,
    textAlign: 'center',
  },
  
  // Call screen styles
  callHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  callStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  callTimer: {
    fontSize: 16,
    color: '#666',
  },
  callDoctorContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    margin: 30,
    borderWidth: 3,
    borderColor: 'red',
    overflow: 'hidden',
    position: 'relative',
  },
  speakingIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,0,0,0.7)',
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callStatusContainer: {
    padding: 16,
    alignItems: 'center',
  },
  callStatusText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 40,
    width: '100%',
  },
  micButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  micButtonActive: {
    backgroundColor: '#48c',
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  callInstructionsContainer: {
    width: '90%',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 10,
    marginBottom: 16,
  },
  callInstructionsText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
}); 