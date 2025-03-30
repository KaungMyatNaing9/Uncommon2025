import { Image, StyleSheet, Platform, TouchableOpacity, ImageBackground, View, Text } from 'react-native';
import { router } from 'expo-router';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors, { Colors as ColorsPalette } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import PixelBackground from '../../assets/images/project/pixelBackground.png';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  // Load the font
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  const navigateToAnalyze = () => {
    router.navigate('/analyze');
  };

  const navigateToChat = () => {
    router.navigate('/chat');
  };

  const navigateToEmergency = () => {
    router.navigate('/emergency');
  };

  // Display a loading screen while fonts are loading
  if (!fontsLoaded) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </ThemedView>
    );
  }

  return (
    <ImageBackground source={PixelBackground} style={styles.backgroundImage}>
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#5E8FB9', dark: '#324B61' }}
      headerImage={
        <View style={styles.headerImageContainer}>
          <Image
            source={require('@/assets/images/project/doctor3.png')}
            style={styles.reactLogo}
            resizeMode="contain"
          />
        </View>
      }>
      <ThemedView style={[styles.contentContainer, { backgroundColor: 'rgba(0, 0, 0, 0.65)' }]}>
        <ThemedView style={styles.titleContainer}>
          <Text style={styles.pixelTitle}>Welcome to MediCura</Text>
          <HelloWave />
        </ThemedView>

        <ThemedView style={styles.introContainer}>
          <Text style={styles.pixelText}>
            Your personal health companion with AI-powered features to help you understand, manage, and respond to medical concerns.
          </Text>
        </ThemedView>

        <ThemedView style={styles.featureContainer}>
          <ThemedView style={styles.featureHeaderContainer}>
            <IconSymbol size={28} name="flask.fill" color="#6ECAFF" />
            <Text style={styles.pixelFeatureTitle}>Medical Document Analysis</Text>
          </ThemedView>
          <Text style={styles.pixelText}>
            Upload lab results or doctor's notes to get clear explanations in simple language. Our AI translates complex medical terms into actionable insights.
          </Text>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#4C8BFF' }]}
            onPress={navigateToAnalyze}
          >
            <Text style={styles.pixelButtonText}>Analyze Documents</Text>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.featureContainer}>
          <ThemedView style={styles.featureHeaderContainer}>
            <IconSymbol size={28} name="message.fill" color="#6ECAFF" />
            <Text style={styles.pixelFeatureTitle}>Chat with Dr. Careo</Text>
          </ThemedView>
          <Text style={styles.pixelText}>
            Have health questions? Chat with our AI doctor for personalized guidance and information. Get compassionate, easy-to-understand answers to your medical concerns.
          </Text>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#4C8BFF' }]}
            onPress={navigateToChat}
          >
            <Text style={styles.pixelButtonText}>Start Chat</Text>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.featureContainer}>
          <ThemedView style={styles.featureHeaderContainer}>
            <IconSymbol size={28} name="exclamationmark.circle.fill" color="#FF5757" />
            <Text style={styles.pixelFeatureTitle}>Emergency Assistance</Text>
          </ThemedView>
          <Text style={styles.pixelText}>
            In urgent situations, get immediate guidance from Dr. Careo via voice call. Receive step-by-step instructions for both medical emergencies and mental health crises.
          </Text>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#FF5757' }]}
            onPress={navigateToEmergency}
          >
            <Text style={styles.pixelButtonText}>Emergency Help</Text>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.disclaimerContainer}>
          <Text style={styles.pixelDisclaimer}>
            Note: MediCura provides informational content only and is not a substitute for professional medical advice.
          </Text>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  pixelTitle: {
    fontFamily: 'PressStart2P_400Regular',
    color: 'white',
    fontSize: 18,
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pixelFeatureTitle: {
    fontFamily: 'PressStart2P_400Regular',
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  pixelText: {
    fontFamily: 'PressStart2P_400Regular',
    color: 'white',
    fontSize: 10,
    lineHeight: 18,
    marginVertical: 8,
  },
  pixelButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    color: 'white',
    fontSize: 12,
  },
  pixelDisclaimer: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    lineHeight: 14,
    fontStyle: 'italic',
    opacity: 0.8,
    color: 'white',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  contentContainer: {
    padding: 20,
    borderRadius: 15,
    marginTop: -20,
  },
  introContainer: {
    marginBottom: 24,
  },
  featureContainer: {
    gap: 12,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderLeftWidth: 3,
    borderLeftColor: '#4C8BFF',
  },
  featureHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  disclaimerContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  reactLogo: {
    height: 200,
    width: '100%',
  },
  headerImageContainer: {
    width: '100%',
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 64,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
    justifyContent: 'center',
  },
});
