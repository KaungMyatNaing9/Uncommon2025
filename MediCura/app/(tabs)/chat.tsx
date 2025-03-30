import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Image, ImageBackground, Text } from 'react-native';
import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import * as Haptics from 'expo-haptics';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';
import PixelBackground from '../../assets/images/project/pixelBackground.png';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

// Message types for the chat
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  // Load the pixel font
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });
  
  // State for messages and input
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello, this is Dr. House and I am here to help you with your health concerns.",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Reference to the FlatList to automatically scroll to bottom
  const flatListRef = useRef<FlatList>(null);

  // Display a loading screen while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Function to call OpenAI API
  const analyzeWithOpenAI = async (userInput: string, messageHistory: Message[]): Promise<string> => {
    try {
      // Convert message history to OpenAI format
      const formattedMessages = messageHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));
      
      // Add system message to guide the AI behavior
      const apiMessages = [
        {
          role: 'system',
          content: `You are a compassionate AI health assistant named Dr. Careo. Your user may be distressed or unwell.

          Key principles:
          1. Keep your responses brief and easy to understand
          2. Ask no more than ONE short, simple follow-up question at a time
          3. Prioritize the user's comfort - they may be feeling unwell
          4. Use simple, non-technical language
          5. Be reassuring and calm in your tone
          
          Information sharing:
          - Provide concise, helpful information
          - Don't overwhelm with details
          - Highlight what's most important first
          - Suggest professional medical help when appropriate, but don't alarm unnecessarily
          - Make the conclusion after 2 at best just 3 questions
          
          Remember: Someone who is unwell needs clear, simple communication and compassionate support.`
        },
        ...formattedMessages,
        {
          role: 'user',
          content: userInput
        }
      ];
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo',
          messages: apiMessages,
          temperature: 0.6  // Slightly lower temperature for more focused responses
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
        }
      );

      const responseData = response.data.choices[0].message.content;
      return responseData;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw new Error('Failed to get a response from AI. Please try again.');
    }
  };

  // Send a message and get AI response
  const sendMessage = async () => {
    if (inputText.trim() === '') return;
    
    // Create new user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // More aggressive scroll to bottom after sending
    flatListRef.current?.scrollToEnd({ animated: true });
    
    // Light haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Start loading state
    setIsLoading(true);
    
    try {
      // Get all previous messages for context
      const messageHistory = [...messages];
      
      // Call OpenAI API to get the response with message history
      const aiResponse = await analyzeWithOpenAI(userMessage.text, messageHistory);
      
      // Create new AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      
      // Add AI message to chat
      setMessages(prev => [...prev, aiMessage]);
      
      // Ensure we scroll to the bottom after receiving AI response
      flatListRef.current?.scrollToEnd({ animated: true });
      // Second scroll after a small delay to ensure it works
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I\'m having trouble responding right now. Please try again later.',
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Scroll to bottom with error message
      flatListRef.current?.scrollToEnd({ animated: true });
    } finally {
      setIsLoading(false);
    }
  };

  // Render a chat message
  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageRow}>
      {item.sender === 'ai' && (
        <Image 
          source={require('@/assets/images/project/doctor.png')} 
          style={styles.avatar} 
        />
      )}
      
      <View style={[
        styles.messageBubble, 
        item.sender === 'user' 
          ? [styles.userBubble, { backgroundColor: theme.primary }] 
          : [styles.aiBubble, { backgroundColor: theme.card, borderColor: theme.border }]
      ]}>
        <ThemedText style={[
          styles.messageText, 
          item.sender === 'user' ? { color: '#FFFFFF' } : { color: theme.text }
        ]}>
          {item.text}
        </ThemedText>
        <ThemedText style={[styles.timestamp, item.sender === 'user' ? { color: '#FFFFFF', opacity: 0.7 } : { color: theme.text, opacity: 0.5 }]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </ThemedText>
      </View>
      
      {item.sender === 'user' && (
        <Image 
          source={require('@/assets/images/project/patient.png')} 
          style={styles.avatar} 
        />
      )}
    </View>
  );

  return (
    <ImageBackground source={PixelBackground} style={styles.backgroundImage}>
      <SafeAreaView style={[styles.container]} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.pixelTitle}>Health Assistant</Text>
          <Text style={styles.pixelSubtitle}>
            Chat with the AI about your health questions
          </Text>
        </View>
        
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          style={{ flex: 1 }} // Allow FlatList to take available space
          showsVerticalScrollIndicator={true}
          maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
          automaticallyAdjustKeyboardInsets={true}
          ListFooterComponent={<View style={{ height: 120 }} />} // Add space at bottom for visibility
        />
        
        {isLoading && (
          <View style={[styles.loadingContainer, { backgroundColor: theme.card }]}>
            <ActivityIndicator size="small" color={theme.primary} />
            <ThemedText style={styles.loadingText}>AI is typing...</ThemedText>
          </View>
        )}
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 85}
          style={styles.inputContainer}
        >
          <View style={[styles.inputWrapper, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Type your message here..."
              placeholderTextColor={theme.text ? `${theme.text}80` : '#99999980'}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity 
              style={[styles.sendButton, { backgroundColor: theme.primary }]}
              onPress={sendMessage}
              disabled={inputText.trim() === '' || isLoading}
            >
              <IconSymbol name="arrow.up.circle.fill" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  pixelTitle: {
    fontFamily: 'PressStart2P_400Regular',
    color: 'white',
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pixelSubtitle: {
    fontFamily: 'PressStart2P_400Regular',
    color: 'white',
    fontSize: 10,
    lineHeight: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  pixelDisclaimer: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    lineHeight: 14,
    color: 'white',
    opacity: 0.8,
    marginTop: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  messageList: {
    padding: 16,
    paddingBottom: 20,
    paddingTop: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 8,
  },
  messageBubble: {
    borderRadius: 18,
    padding: 12,
    maxWidth: '70%', // Reduced to make space for avatars
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
    marginLeft: 'auto',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    marginRight: 'auto',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
    opacity: 0.8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 16,
    padding: 8,
    marginLeft: 16,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 14,
    marginLeft: 8,
    opacity: 0.7,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 8,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
    justifyContent: 'center',
  },
});
