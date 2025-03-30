# MediCura - Medical Document Analysis App

MediCura is a mobile application designed to help patients better understand their medical test results and physician notes by providing clear, easy-to-understand analysis and actionable recommendations. The app features a retro pixel art aesthetic with AI-powered assistance.

## Features

- **Document Upload**: Upload medical test results or physician notes in PDF or image format for AI analysis
- **Health Chat**: Talk directly with Dr. Careo, an AI health assistant, for personalized guidance
- **Emergency Assistance**: Get immediate voice guidance for medical emergencies through a voice call feature
- **Simplified Analysis**: Get plain language explanations of medical documents with complex terms clarified
- **Actionable Recommendations**: Receive practical advice based on your medical information
- **Privacy-Focused**: Your medical data is processed securely and is not stored

## Prerequisites

Before running the app, you'll need:

1. **Node.js and npm** (latest stable version recommended)
2. **Expo CLI**: Install globally with `npm install -g expo-cli`
3. **Expo Go app** on your physical device (iOS or Android) for testing
4. **API Keys**:
   - **OpenAI API Key**: Used for medical document analysis, chat, and emergency assistance
   - **OCR.space API Key**: Used for extracting text from images and PDFs

## API Setup

### OpenAI API
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to the API section
4. Create a new API key
5. Copy your API key for use in the app

### OCR.space API
1. Go to [OCR.space](https://ocr.space/ocrapi)
2. Register for a free API key
3. Copy your API key for use in the app

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/MediCura.git
   cd MediCura
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   OCR_API_KEY=your_ocr_api_key_here
   ```

4. Install the font used for the pixel art aesthetic:
   ```bash
   npx expo install expo-font @expo-google-fonts/press-start-2p
   ```

## Running the App

1. Start the development server:
   ```bash
   npx expo start
   ```

2. Run the app on your preferred platform:
   - **iOS simulator**: Press `i` in the terminal or click "Run on iOS simulator" in the Expo Developer Tools
   - **Android emulator**: Press `a` in the terminal or click "Run on Android device/emulator"
   - **Physical device**: Scan the QR code with the Expo Go app (iOS: Camera app, Android: Expo Go app)
   - **Web browser**: Press `w` in the terminal or click "Run in web browser"

## Troubleshooting

- If you encounter issues with the API keys, ensure they are correctly set in the `.env` file
- Make sure the Expo environment has access to the environment variables by restarting the server
- For microphone or audio issues in the Emergency feature, ensure you've granted the necessary permissions
- If fonts aren't loading, try running `expo install expo-font` and restart the development server

## Technology Stack

- **React Native**: For cross-platform mobile development
- **Expo**: For rapid development and easy deployment
- **OpenAI API**: Powers the AI-assisted medical analysis, chat, and emergency guidance
- **OCR.space API**: For text extraction from documents
- **Expo Speech & Audio**: For voice interactions in the Emergency feature

## How It Works

1. **Upload**: Users upload their medical documents
2. **Processing**: The app extracts text using OCR and analyzes it with OpenAI's API
3. **Analysis**: The app provides a simplified explanation of the medical information
4. **Recommendations**: Users receive practical health advice and next steps

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

