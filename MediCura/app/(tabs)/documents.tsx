import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { IconSymbol } from '@/components/ui/IconSymbol';
import Colors, { Colors as ColorsPalette } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type DocumentAsset = {
  name: string;
  uri: string;
  mimeType?: string;
  size?: number;
};

export default function DocumentsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  
  const [document, setDocument] = useState<DocumentAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);

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
      setAnalysis(null);
      setRecommendation(null);
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  const analyzeDocument = async () => {
    if (!document) return;
    
    setLoading(true);
    
    try {
      // In a real implementation, you would:
      // 1. Read the file (for PDF, extract text using a PDF parser)
      // 2. Send the text to OpenAI API
      // 3. Process the response
      
      // This is a mock implementation for demonstration
      // In a real app, you'd integrate with OpenAI API here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating API call
      
      // Mock response
      setAnalysis(
        "Your cholesterol levels are slightly elevated compared to normal ranges. Your LDL (bad cholesterol) is 145 mg/dL, which is above the recommended level of under 100 mg/dL. Your HDL (good cholesterol) is 45 mg/dL, which is in the acceptable range but could be higher for optimal heart health. Your triglycerides are within normal limits at 120 mg/dL."
      );
      
      setRecommendation(
        "Based on your elevated LDL cholesterol, consider incorporating more heart-healthy foods into your diet, such as fruits, vegetables, whole grains, and foods rich in omega-3 fatty acids like fish. Regular exercise, at least 150 minutes of moderate activity per week, can also help improve your cholesterol levels. Limiting saturated fats and trans fats can be beneficial. Consider discussing with your healthcare provider about whether medication might be appropriate if lifestyle changes alone don't sufficiently lower your cholesterol. Remember, this information is meant to be educational and should not replace professional medical advice."
      );
      
    } catch (error) {
      console.error('Error analyzing document:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Medical Documents</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>
          Upload your medical test results or physician notes for analysis
        </Text>
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity 
          style={[styles.uploadBox, { borderColor: theme.border }]} 
          onPress={pickDocument}
        >
          <IconSymbol size={40} name="arrow.up.doc.fill" color={theme.primary} />
          <Text style={[styles.uploadText, { color: theme.text }]}>
            {document ? 'Change Document' : 'Upload Document'}
          </Text>
          {document && (
            <Text style={[styles.documentName, { color: theme.text }]} numberOfLines={1}>
              {document.name}
            </Text>
          )}
        </TouchableOpacity>
        
        {document && !analysis && !loading && (
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
        
        {analysis && recommendation && (
          <View style={styles.resultsContainer}>
            <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.primary }]}>Analysis:</Text>
              <Text style={[styles.sectionContent, { color: theme.text }]}>{analysis}</Text>
            </View>
            
            <View style={[styles.section, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.primary }]}>Recommendation:</Text>
              <Text style={[styles.sectionContent, { color: theme.text }]}>{recommendation}</Text>
            </View>
            
            <Text style={[styles.disclaimer, { color: ColorsPalette.muted }]}>
              Please note: This analysis is for informational purposes only and is not a substitute for professional medical advice.
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