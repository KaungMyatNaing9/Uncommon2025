import React from 'react';
import { Text, View, StyleSheet, SafeAreaView, StatusBar, AppRegistry } from 'react-native';

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        <Text style={styles.title}>MediCura Test</Text>
        <Text style={styles.subtitle}>This is a basic test page</Text>
        <Text style={styles.message}>
          If you can see this page, React Native rendering is working correctly.
          There may be an issue with expo-router configuration.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

// Register the app component
AppRegistry.registerComponent('medicura', () => App);

export default App; 