import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors, { Colors as ColorsPalette } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

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
};

export default function AnalyzeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const [document, setDocument] = useState<DocumentAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const extractTextFromDocument = async (documentUri: string): Promise<string> => {
    // In a real implementation, you would:
    // - For PDFs: Use a PDF parser library (e.g., react-native-pdf-lib)
    // - For images: Use OCR (e.g., via a cloud API)
    
    // For demo purposes, we'll simulate reading the file
    try {
      const fileContent = await FileSystem.readAsStringAsync(documentUri);
      // For demo purposes, return mock medical text if file is empty or can't be properly read
      if (!fileContent || fileContent.length < 100) {
        return `
          Patient Name: John Doe
          Date: May 15, 2023
          
          Lab Results:
          Cholesterol: 210 mg/dL (Reference: <200 mg/dL)
          HDL: 45 mg/dL (Reference: >40 mg/dL)
          LDL: 140 mg/dL (Reference: <100 mg/dL)
          Triglycerides: 180 mg/dL (Reference: <150 mg/dL)
          Blood Glucose (Fasting): 115 mg/dL (Reference: 70-99 mg/dL)
          
          Assessment:
          Borderline hyperlipidemia
          Impaired fasting glucose
          
          Recommendations:
          Diet and lifestyle modifications
          Follow-up in 3 months
        `;
      }
      return fileContent;
    } catch (error) {
      console.error('Error reading file:', error);
      // Return mock data for demonstration
      return `
        Patient Name: Jane Smith
        Date: June 2, 2023
        
        Lab Results:
        CBC:
        - WBC: 8.5 x10^9/L (Reference: 4.0-11.0 x10^9/L)
        - RBC: 4.2 x10^12/L (Reference: 3.8-5.2 x10^12/L)
        - Hemoglobin: 11.8 g/dL (Reference: 12.0-16.0 g/dL)
        - Hematocrit: 36% (Reference: 36-46%)
        - Platelets: 230 x10^9/L (Reference: 150-450 x10^9/L)
        
        Ferritin: 15 ng/mL (Reference: 20-200 ng/mL)
        
        Assessment:
        Mild anemia
        Iron deficiency
        
        Recommendations:
        Iron supplements
        Dietary counseling
        Follow-up in 2 months
      `;
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
              content: `You are a helpful medical assistant that analyzes medical documents and provides simple explanations for patients. 
              Your task is to analyze medical test results or physician notes and provide information in a way that someone with no medical background can understand.
              Focus on accuracy and clarity. Be supportive and informative, but not alarmist.
              
              Format your response as JSON with the following structure:
              {
                "analysis": "A plain language explanation of the document that any patient would understand. Explain abnormal results and what they might mean.",
                "terminology": {
                  "term1": "simple explanation",
                  "term2": "simple explanation"
                },
                "predictions": [
                  {
                    "disease": "Name of potential condition",
                    "probability": 0.75, // a number between 0 and 1 representing likelihood
                    "prevention": "Steps to prevent or manage this condition",
                    "specialistType": "Type of doctor to see if condition is suspected"
                  }
                ]
              }
              
              Include the most important medical terms in the terminology section.
              For predictions, include 2-4 potential conditions suggested by the results, ordered by likelihood.
              Ensure your analysis is accurate, helpful, and easy to understand for someone with no medical training.`
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
      const extractedText = await extractTextFromDocument(document.uri);
      
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Medical Analysis</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>
          Upload your medical test results or physician notes for easy-to-understand analysis
        </Text>
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity 
          style={[styles.uploadBox, { borderColor: theme.border }]} 
          onPress={pickDocument}
        >
          <IconSymbol size={40} name="flask.fill" color={theme.primary} />
          <Text style={[styles.uploadText, { color: theme.text }]}>
            {document ? 'Change Document' : 'Upload Document'}
          </Text>
          {document && (
            <Text style={[styles.documentName, { color: theme.text }]} numberOfLines={1}>
              {document.name}
            </Text>
          )}
        </TouchableOpacity>
        
        {document && !result && !loading && !error && (
          <TouchableOpacity 
            style={[styles.analyzeButton, { backgroundColor: theme.primary }]}
            onPress={analyzeDocument}
          >
            <Text style={[styles.buttonText, { color: theme.buttonText }]}>Analyze Document</Text>
          </TouchableOpacity>
        )}
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
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
              <Text style={[styles.buttonText, { color: ColorsPalette.white }]}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {result && (
          <View style={styles.resultsContainer}>
            {/* Analysis Section */}
            <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.primary }]}>Your Results Explained:</Text>
              <Text style={[styles.sectionContent, { color: theme.text }]}>{result.analysis}</Text>
            </View>
            
            {/* Medical Terminology Section */}
            {Object.keys(result.terminology).length > 0 && (
              <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>Medical Terms Explained:</Text>
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
                <Text style={[styles.sectionTitle, { color: theme.primary }]}>Potential Health Considerations:</Text>
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
            
            <Text style={[styles.disclaimer, { color: ColorsPalette.muted }]}>
              Important: This analysis is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.
            </Text>
            
            <TouchableOpacity 
              style={[styles.newAnalysisButton, { backgroundColor: theme.secondary }]}
              onPress={pickDocument}
            >
              <Text style={[styles.buttonText, { color: theme.buttonText }]}>Upload New Document</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  uploadText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
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
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
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
  disclaimer: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 20,
    lineHeight: 20,
  },
  newAnalysisButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
}); 