import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors, { Colors as ColorsPalette } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function EmergencyScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Emergency</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>
          Quick access to emergency services and information
        </Text>
      </View>
      
      <View style={styles.content}>
        <TouchableOpacity style={[styles.emergencyButton, { backgroundColor: ColorsPalette.danger }]}>
          <IconSymbol size={36} name="phone.fill" color={ColorsPalette.white} />
          <Text style={[styles.emergencyButtonText, { color: ColorsPalette.white }]}>
            Call Emergency Services
          </Text>
        </TouchableOpacity>
        
        <View style={[styles.infoSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.infoTitle, { color: theme.text }]}>
            In Case of Medical Emergency
          </Text>
          <Text style={[styles.infoText, { color: theme.text }]}>
            • Call your local emergency number immediately{'\n'}
            • Provide your location and describe the situation{'\n'}
            • Follow the dispatcher's instructions{'\n'}
            • If possible, have someone ready to meet emergency responders{'\n'}
            • Bring your medical information and medication list if available
          </Text>
        </View>
        
        <Text style={[styles.disclaimer, { color: theme.text, opacity: 0.7 }]}>
          Note: This screen is for informational purposes. In a real emergency, always call your local emergency services number.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  emergencyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  infoSection: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
  },
  disclaimer: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
}); 