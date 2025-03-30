/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

export const Colors = {
  primary: '#4E73DF',
  secondary: '#36B9CC',
  success: '#1CC88A',
  danger: '#E74A3B',
  warning: '#F6C23E',
  info: '#36B9CC',
  light: '#F8F9FC',
  dark: '#5A5C69',
  white: '#FFFFFF',
  milk30: '#ffffff2b',
  background: '#F8F9FC',
  text: '#5A5C69',
  border: '#E3E6F0',
  muted: '#B7B9CC',
  shadow: 'rgba(0, 0, 0, 0.05)',
};

export default {
  light: {
    text: Colors.text,
    background: Colors.background,
    primary: Colors.primary,
    secondary: Colors.secondary,
    border: Colors.border,
    buttonText: Colors.white,
    card: Colors.white,
    notification: Colors.danger,
    milk: Colors.white,
    milk30: Colors.milk30,
  },
  dark: {
    text: Colors.light,
    background: '#1A202C',
    primary: Colors.primary,
    secondary: Colors.secondary,
    border: '#2D3748',
    buttonText: Colors.white,
    card: '#2D3748',
    notification: Colors.danger,
    milk: Colors.white,
    milk30: Colors.milk30, 
  },
};
