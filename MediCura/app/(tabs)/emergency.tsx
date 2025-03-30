import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, SafeAreaView } from 'react-native';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import Svg, { Rect, Circle, Line } from 'react-native-svg';

export default function EmergencyScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [isCalling, setIsCalling] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  // Animation for the emergency button
  React.useEffect(() => {
    if (isCalling) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isCalling]);

  const handleEmergencyCall = async () => {
    setIsCalling(true);
    try {
      // Request audio permissions
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need audio permissions to make this work!');
        return;
      }

      // TODO: Implement AI voice agent integration
      // This is where we'll add the OpenAI voice agent or custom audio implementation
      
      // For now, we'll just show a placeholder message
      alert('Emergency call initiated. Connecting to Dr. Careo...');
    } catch (error) {
      console.error('Error initiating emergency call:', error);
      alert('Failed to initiate emergency call. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Emergency Logo */}
      <View style={styles.logoContainer}>
        <IconSymbol size={64} name="cross.case.fill" color={theme.primary} />
        <Text style={[styles.emergencyText, { color: theme.text }]}>EMERGENCY</Text>
      </View>

      {/* Pixel Art Doctor Avatar */}
      <View style={styles.avatarContainer}>
        <Svg width="150" height="150" viewBox="0 0 150 150">
          {/* Head */}
          <Rect x="50" y="30" width="50" height="50" fill="#FFE4C4"/>
          
          {/* Face */}
          <Circle cx="65" cy="45" r="3" fill="#000"/>
          <Circle cx="85" cy="45" r="3" fill="#000"/>
          <Rect x="65" y="60" width="20" height="5" fill="#000"/>
          
          {/* Hair */}
          <Rect x="45" y="30" width="60" height="10" fill="#4A4A4A"/>
          
          {/* Body */}
          <Rect x="40" y="80" width="70" height="60" fill="#FFFFFF"/>
          
          {/* Coat */}
          <Rect x="35" y="80" width="80" height="20" fill="#4A4A4A"/>
          
          {/* Arms */}
          <Rect x="35" y="90" width="15" height="40" fill="#4A4A4A"/>
          <Rect x="100" y="90" width="15" height="40" fill="#4A4A4A"/>
          
          {/* Legs */}
          <Rect x="50" y="140" width="15" height="10" fill="#4A4A4A"/>
          <Rect x="85" y="140" width="15" height="10" fill="#4A4A4A"/>
          
          {/* Stethoscope */}
          <Circle cx="120" cy="45" r="10" fill="#4A4A4A" opacity="0.5"/>
          <Line x1="120" y1="45" x2="100" y2="45" stroke="#4A4A4A" strokeWidth="2"/>
        </Svg>
      </View>

      {/* Emergency Call Button */}
      <Animated.View style={[styles.buttonContainer, { transform: [{ scale: pulseAnim }] }]}>
        <TouchableOpacity
          style={[styles.emergencyButton, { backgroundColor: theme.primary }]}
          onPress={handleEmergencyCall}
        >
          <IconSymbol size={32} name="phone.fill" color="#FFFFFF" />
          <Text style={styles.buttonText}>Call Dr. Careo</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Emergency Instructions */}
      <View style={[styles.instructionsContainer, { borderColor: theme.primary }]}>
        <Text style={[styles.instructionsTitle, { color: theme.text }]}>
          Emergency Instructions
        </Text>
        <Text style={[styles.instructionsText, { color: theme.text }]}>
          • Stay calm and describe the situation clearly{'\n'}
          • Follow Dr. Careo's instructions carefully{'\n'}
          • Keep the patient comfortable and safe{'\n'}
          • Have emergency numbers ready
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  emergencyText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    fontFamily: 'PressStart2P-Regular',
  },
  avatarContainer: {
    width: 150,
    height: 150,
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    marginVertical: 30,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    fontFamily: 'PressStart2P-Regular',
  },
  instructionsContainer: {
    width: '100%',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'PressStart2P-Regular',
  },
  instructionsText: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'PressStart2P-Regular',
  },
}); 