import * as Font from 'expo-font';

export const loadFonts = async () => {
  await Font.loadAsync({
    'PressStart2P-Regular': require('../assets/fonts/PressStart2P-Regular.ttf'),
  });
};

export const fonts = {
  pixel: 'PressStart2P-Regular',
}; 