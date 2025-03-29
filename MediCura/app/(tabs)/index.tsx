import { Image, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors, { Colors as ColorsPalette } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  const navigateToDocuments = () => {
    router.navigate('/documents');
  };

  return (
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
          Your personal medical document analyzer. Upload your lab results or physician notes to get simple explanations and helpful recommendations.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.featureContainer}>
        <ThemedView style={styles.featureHeaderContainer}>
          <IconSymbol size={24} name="doc.text.fill" color={theme.primary} />
          <ThemedText type="subtitle">Document Analysis</ThemedText>
        </ThemedView>
        <ThemedText>
          Upload your medical test results or physician notes and get a clear explanation in simple language. No more confusion about medical terms.
        </ThemedText>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.primary }]}
          onPress={navigateToDocuments}
        >
          <ThemedText style={{ color: theme.buttonText }}>Upload Document</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.featureContainer}>
        <ThemedView style={styles.featureHeaderContainer}>
          <IconSymbol size={24} name="list.bullet.clipboard" color={theme.primary} />
          <ThemedText type="subtitle">Personalized Recommendations</ThemedText>
        </ThemedView>
        <ThemedText>
          Receive practical advice and suggestions based on your medical documents. MediCura provides supportive, non-alarming guidance for your health journey.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.featureContainer}>
        <ThemedView style={styles.featureHeaderContainer}>
          <IconSymbol size={24} name="lock.shield" color={theme.primary} />
          <ThemedText type="subtitle">Privacy and Security</ThemedText>
        </ThemedView>
        <ThemedText>
          Your medical data is important. MediCura processes your documents securely and doesn't store sensitive information. Your privacy is our priority.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.disclaimerContainer}>
        <ThemedText style={styles.disclaimer}>
          Note: MediCura provides informational content only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
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
});
