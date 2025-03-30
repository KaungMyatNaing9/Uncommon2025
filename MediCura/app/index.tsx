import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the debug page to diagnose routing issues
  return <Redirect href="/debug" />;
} 