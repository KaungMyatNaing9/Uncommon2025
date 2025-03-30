import { Image, StyleSheet, Platform, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors, { Colors as ColorsPalette } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import PixelBackground from '../../assets/images/project/pixelBackground.png';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const navigateToAnalyze = () => {
    router.navigate('/analyze');
  };

  return (
    <ImageBackground source={PixelBackground} style={styles.backgroundImage}>
    <ParallaxScrollView
      headerBackgroundColor={{ light: ColorsPalette.primary, dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to MediCura</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.introContainer}>
        <ThemedText>
          Your personal medical document analyzer. Upload your lab results or physician notes to get simple explanations and actionable health insights.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.featureContainer}>
        <ThemedView style={styles.featureHeaderContainer}>
          <IconSymbol size={24} name="flask.fill" color={theme.primary} />
          <ThemedText type="subtitle">Smart Medical Analysis</ThemedText>
        </ThemedView>
        <ThemedText>
          Upload your medical documents and receive easy-to-understand explanations, with medical terms simplified and clear recommendations.
        </ThemedText>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={navigateToAnalyze}
        >
          <ThemedText style={{ color: theme.buttonText }}>Start Analyzing</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.featureContainer}>
        <ThemedView style={styles.featureHeaderContainer}>
          <IconSymbol size={24} name="heart.text.square.fill" color={theme.primary} />
          <ThemedText type="subtitle">Health Insights</ThemedText>
        </ThemedView>
        <ThemedText>
          Get personalized health predictions with risk assessments and actionable prevention measures. Our analysis helps you understand potential health concerns in plain language.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.featureContainer}>
        <ThemedView style={styles.featureHeaderContainer}>
          <IconSymbol size={24} name="book.fill" color={theme.primary} />
          <ThemedText type="subtitle">Medical Dictionary</ThemedText>
        </ThemedView>
        <ThemedText>
          Never struggle with understanding medical terminology again. MediCura explains complex medical terms in simple language anyone can understand.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.disclaimerContainer}>
        <ThemedText style={styles.disclaimer}>
          Note: MediCura provides informational content only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for medical advice.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  introContainer: {
    marginBottom: 24,
  },
  featureContainer: {
    gap: 12,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
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
    marginTop: 8,
  },
  disclaimerContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  disclaimer: {
    fontSize: 12,
    fontStyle: 'italic',
    opacity: 0.7,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', 
    justifyContent: 'center',
  },
});
