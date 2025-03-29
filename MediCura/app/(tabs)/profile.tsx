import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>
          Manage your personal health information
        </Text>
      </View>
      
      <View style={styles.content}>
        <View style={[styles.placeholder, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.placeholderText, { color: theme.text }]}>
            Profile functionality will be implemented in future updates.
          </Text>
        </View>
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
    justifyContent: 'center',
  },
  placeholder: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 