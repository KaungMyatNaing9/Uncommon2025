import { Text, View, StyleSheet, Button } from 'react-native';
import { Stack } from 'expo-router';

export default function DebugScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Debug Screen' }} />
      
      <Text style={styles.title}>Debug Screen</Text>
      <Text style={styles.text}>If you can see this screen, expo-router is working!</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Go to Home" 
          onPress={() => console.log('Home button pressed')} 
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Go to Analyze" 
          onPress={() => console.log('Analyze button pressed')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
}); 