# MediCura - Medical Document Analysis App

MediCura is a mobile application designed to help patients better understand their medical test results and physician notes by providing clear, easy-to-understand analysis and actionable recommendations.

## Features

- **Document Upload**: Upload medical test results or physician notes in PDF or image format.
- **Simplified Analysis**: Get plain language explanations of your medical documents, with medical terms clarified for easy understanding.
- **Actionable Recommendations**: Receive practical advice and lifestyle suggestions based on your medical documents.
- **User-Friendly Interface**: Intuitive design makes it easy to navigate and understand your health information.
- **Privacy-Focused**: Your medical data is processed securely and is not stored.

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npx expo start
   ```

3. Run the app on your preferred platform:
   - iOS simulator
   - Android emulator
   - Expo Go app on a physical device
   - Web browser

## Technology Stack

- React Native
- Expo
- OpenAI API for medical document analysis

## How It Works

1. **Upload**: Users upload their medical documents (lab results, physician notes, etc.).
2. **Processing**: The app analyzes the document using OpenAI's API.
3. **Analysis**: The app provides a simplified explanation of the medical information.
4. **Recommendations**: Users receive practical health advice and next steps.

## Important Note

MediCura provides information for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## Development

This project uses Expo and React Native. The file structure follows a standard Expo Router setup with tab-based navigation:

- `/app/(tabs)`: Contains the main tab screens of the application
- `/components`: Reusable UI components
- `/constants`: Application constants like colors and theme settings
- `/assets`: Images and other static assets

## License

This project is licensed under the MIT License - see the LICENSE file for details.
