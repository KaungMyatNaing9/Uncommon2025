import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors, { Colors as ColorsPalette } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import axios from 'axios';
import { OPENAI_API_KEY, OCR_API_KEY } from '@env';
import PixelBackground from '../../assets/images/project/pixelBackground.png';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { PacmanLoader } from '@/components/PacmanLoader';
import BarChartWithError from '@/components/GraphComponent'; 
import string from '@/constants/strings';
import RangeIndicator from '@/components/RangeIndicator';


type DocumentAsset = {
  name: string;
  uri: string;
  mimeType?: string;
  size?: number;
};

type AnalysisResult = {
  analysis: string;
  terminology: Record<string, string>;
  predictions: Array<{
    disease: string;
    probability: number;
    prevention: string;
    specialistType?: string;
  }>;
  keyFeatures: Array<{
    name: string;
    resultValue: number;
    minPossibleValue: number;
    maxPossibleValue: number;
    minOptimalValue: number;
    maxOptimalValue: number;
    normalizedResultValue: number;
    normalizedMinOptimalValue: number;
    normalizedMaxOptimalValue: number;
  }>;
};

export default function AnalyzeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  // Load the pixel font
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });
  
  const [document, setDocument] = useState<DocumentAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Display a loading screen while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) {
        return;
      }

      setDocument(result.assets[0]);
      setResult(null);
      setError(null);
    } catch (err) {
      console.error('Error picking document:', err);
      setError('Failed to pick document. Please try again.');
    }
  };

  const extractTextFromDocument = async (document: DocumentAsset): Promise<string> => {
    try {
      // Read the file as base64
      const base64String = await FileSystem.readAsStringAsync(document.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Create formatted base64 string
      const formattedBase64 = `data:${document.mimeType};base64,${base64String}`;
  
      const formData = new FormData();
      formData.append('base64image', formattedBase64);
      formData.append('apikey', `${OCR_API_KEY}`);
      formData.append('language', 'eng');
      formData.append('filetype', document.mimeType?.includes('pdf') ? 'pdf' : 'image');
  
      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      const text = result?.ParsedResults?.[0]?.ParsedText;
  
      console.log('--> OCR result:', text);
  
      if (!text) throw new Error('No text parsed from OCR.');
  
      return text;
  
    } catch (error) {
      console.error('Error extracting text from document:', error);
  
      // Optional fallback mock content
      // Return a structured error message
      throw new Error(
        'Failed to extract text from the document. Please ensure the file is clear and supported.'
      );
    }
  };
  

  const analyzeWithOpenAI = async (text: string): Promise<AnalysisResult> => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4-turbo',
          messages: [
            {
              role: 'system',
              content: string.prompt
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.5
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
          }
        }
      );
      const responseData = response.data.choices[0].message.content;
      console.log('--> GPT result:', responseData);
      return JSON.parse(responseData);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw new Error('Failed to analyze the document with AI. Please try again.');
    }
  };

  const analyzeDocument = async () => {
    if (!document) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Extract text from the document
      const extractedText = await extractTextFromDocument(document);
      
      // Analyze with OpenAI
      const analysisResult = await analyzeWithOpenAI(extractedText);
      
      setResult(analysisResult);
    } catch (error) {
      console.error('Error analyzing document:', error);
      setError('Failed to analyze the document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format the probability as a percentage
  const formatProbability = (probability: number): string => {
    return `${Math.round(probability * 100)}%`;
  };

  return (
    <ImageBackground source={PixelBackground} style={styles.backgroundImage}>
      <SafeAreaView style={[styles.container]}>
        <View style={styles.header}>
          <Text style={styles.pixelTitle}>Medical Analysis</Text>
          <Text style={styles.pixelSubtitle}>
            Upload your medical test results or physician notes for easy-to-understand analysis
          </Text>
        </View>
        
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <TouchableOpacity 
            style={[styles.uploadBox, { backgroundColor: theme.milk30, borderColor: theme.border }]} 
            onPress={pickDocument}
          >
            <IconSymbol size={40} name="flask.fill" color={theme.primary} />
            <Text style={styles.pixelUploadText}>
              {document ? 'Change Document' : 'Upload Document'}
            </Text>
            {document && (
              <Text style={[styles.documentName, { color: theme.milk }]} numberOfLines={1}>
                {document.name}
              </Text>
            )}
          </TouchableOpacity>
          
          {document && !result && !loading && !error && (
            <TouchableOpacity 
              style={[styles.analyzeButton, { backgroundColor: theme.primary }]}
              onPress={analyzeDocument}
            >
              <Text style={styles.pixelButtonText}>Analyze Document</Text>
            </TouchableOpacity>
          )}
          
          {loading && (
            <View style={styles.loadingContainer}>
              <PacmanLoader />
              <Text style={[styles.loadingText, { color: theme.text }]}>
                Analyzing your document...
              </Text>
            </View>
          )}
          
          {error && (
            <View style={[styles.errorContainer, { borderColor: ColorsPalette.danger }]}>
              <Text style={[styles.errorText, { color: ColorsPalette.danger }]}>{error}</Text>
              <TouchableOpacity 
                style={[styles.retryButton, { backgroundColor: ColorsPalette.danger }]}
                onPress={pickDocument}
              >
                <Text style={styles.pixelButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {result && (
            <View style={styles.resultsContainer}>
              {/* Analysis Section */}
              <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={styles.pixelSectionTitle}>Your Results Explained:</Text>
                <Text style={[styles.sectionContent, { color: theme.text }]}>{result.analysis}</Text>
              </View>
              
              {/* Medical Terminology Section */}
              {Object.keys(result.terminology).length > 0 && (
                <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={styles.pixelSectionTitle}>Medical Terms Explained:</Text>
                  {Object.entries(result.terminology).map(([term, explanation], index) => (
                    <View key={index} style={styles.termContainer}>
                      <Text style={[styles.termText, { color: theme.primary }]}>{term}:</Text>
                      <Text style={[styles.explanationText, { color: theme.text }]}>{explanation}</Text>
                    </View>
                  ))}
                </View>
              )}
              
              {/* Disease Predictions Section */}
              {result.predictions.length > 0 && (
                <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={styles.pixelSectionTitle}>Potential Health Considerations:</Text>
                  <Text style={[styles.disclaimerSmall, { color: ColorsPalette.muted }]}>
                    These are possibilities based on your results, not definitive diagnoses.
                  </Text>
                  
                  {result.predictions.map((prediction, index) => (
                    <View key={index} style={styles.predictionContainer}>
                      <View style={styles.predictionHeader}>
                        <Text style={[styles.diseaseName, { color: theme.text }]}>{prediction.disease}</Text>
                        <View 
                          style={[
                            styles.probabilityBadge,
                            { 
                              backgroundColor: prediction.probability > 0.7 
                                ? ColorsPalette.danger 
                                : prediction.probability > 0.4 
                                  ? ColorsPalette.warning 
                                  : ColorsPalette.success
                            }
                          ]}
                        >
                          <Text style={styles.probabilityText}>{formatProbability(prediction.probability)}</Text>
                        </View>
                      </View>
                      
                      <Text style={[styles.preventionText, { color: theme.text }]}>
                        {prediction.prevention}
                      </Text>
                      
                      {prediction.specialistType && (
                        <Text style={[styles.specialistText, { color: theme.primary }]}>
                          Consider consulting: {prediction.specialistType}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Key Features Section */}
              {result.keyFeatures && result.keyFeatures.length > 0 && (
                <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <BarChartWithError
                      data={result.keyFeatures.map(feature => ({
                        label: feature.name,
                        value: feature.normalizedResultValue,
                        min: feature.normalizedMinOptimalValue,
                        max: feature.normalizedMaxOptimalValue,
                      }))}
                    />
                </View>
              )}

              {result.keyFeatures.map((feature, index) => (
                <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <RangeIndicator
                    key={index}
                    label={feature.name}
                    value={feature.resultValue}
                    segments={[
                      { from: feature.minPossibleValue, to: feature.minOptimalValue, color: 'red' },
                      { from: feature.minOptimalValue, to: feature.maxOptimalValue, color: 'lightgreen' },
                      { from: feature.maxOptimalValue, to: feature.maxPossibleValue, color: 'red' },
                    ]}
                  />
                  </View>
              ))}

              
              <Text style={styles.pixelDisclaimer}>
                Important: This analysis is for informational purposes only.
              </Text>
              
              <TouchableOpacity 
                style={[styles.newAnalysisButton, { backgroundColor: theme.secondary }]}
                onPress={pickDocument}
              >
                <Text style={styles.pixelButtonText}>Upload New Document</Text>
              </TouchableOpacity>
              
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  pixelTitle: {
    fontFamily: 'PressStart2P_400Regular',
    color: 'white',
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pixelSubtitle: {
    fontFamily: 'PressStart2P_400Regular',
    color: 'white',
    fontSize: 10,
    lineHeight: 16, 
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  pixelUploadText: {
    fontFamily: 'PressStart2P_400Regular',
    color: 'white',
    fontSize: 12,
    marginTop: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  pixelButtonText: {
    fontFamily: 'PressStart2P_400Regular',
    color: 'white',
    fontSize: 12,
  },
  pixelSectionTitle: {
    fontFamily: 'PressStart2P_400Regular',
    color: '#4C8BFF',
    fontSize: 14,
    marginBottom: 10,
  },
  pixelDisclaimer: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 8,
    lineHeight: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
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
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  documentName: {
    marginTop: 8,
    fontSize: 14,
  },
  analyzeButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  resultsContainer: {
    marginTop: 10,
  },
  section: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  termContainer: {
    marginBottom: 12,
  },
  termText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  explanationText: {
    fontSize: 15,
    lineHeight: 22,
  },
  predictionContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  predictionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  probabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginLeft: 8,
  },
  probabilityText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  preventionText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  specialistText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  disclaimerSmall: {
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  newAnalysisButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
  },
}); 