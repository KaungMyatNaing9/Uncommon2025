import { registerRootComponent } from 'expo';
import { Text, View, StyleSheet, SafeAreaView, Button } from 'react-native';
import { useState } from 'react';
import Constants from 'expo-constants';

function App() {
  const [count, setCount] = useState(0);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>MediCura Test App</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>Basic Test Page</Text>
        <Text style={styles.message}>
          If you can see this bright screen with a blue header, your app is rendering correctly.
        </Text>
        
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>Counter: {count}</Text>
          <Button 
            title="Increment Counter" 
            onPress={() => setCount(count + 1)} 
            color="#2196F3"
          />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            App Version: {Constants.expoConfig?.version || 'unknown'}
          </Text>
          <Text style={styles.infoText}>
            Platform: {Constants.platform?.ios ? 'iOS' : 'Android'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEB3B', // Bright yellow background
  },
  header: {
    backgroundColor: '#2196F3', // Blue header
    padding: 16,
    paddingTop: Constants.statusBarHeight + 10,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    color: '#000',
  },
  counterContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  counterText: {
    fontSize: 22,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 15,
    borderRadius: 8,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  }
});

// Register the app as the main component
registerRootComponent(App); 