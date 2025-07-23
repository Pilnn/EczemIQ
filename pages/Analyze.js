import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const AnalyzePage = ({ probabilities, onScanAgain }) => {
  // Disease labels mapping
  const diseaseLabels = [
    'Eczema',
    'Warts Molluscum and other Viral Infections',
    'Melanoma',
    'Atopic Dermatitis',
    'Basal Cell Carcinoma (BCC)',
    'Melanocytic Nevi (NV)',
    'Benign Keratosis-like Lesions (BKL)',
    'Psoriasis pictures Lichen Planus and related diseases',
    'Seborrheic Keratoses and other Benign Tumors',
    'Tinea Ringworm Candidiasis and other Fungal Infections'
  ];

  // Process probabilities to get top 3
  const getTop3Predictions = () => {
    if (!probabilities || probabilities.length === 0) {
      return [];
    }

    // Convert Float32Array to regular array and create objects with index
    const probabilityArray = Array.from(probabilities);
    const predictions = probabilityArray.map((prob, index) => ({
      index,
      probability: prob,
      name: diseaseLabels[index],
    }));

    // Sort by probability (descending) and take top 3
    const top3 = predictions
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3);
    console.log(top3);
    return top3;
  };

  const top3Predictions = getTop3Predictions();

  // Format current date as string
  const dateString = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Determine severity based on the condition type (you can customize this logic)
  const getSeverity = (conditionName, confidence) => {
    const severeConditions = ['Melanoma', 'Basal Cell Carcinoma (BCC)'];
    const moderateConditions = ['Psoriasis pictures Lichen Planus and related diseases', 'Atopic Dermatitis'];
    
    if (severeConditions.includes(conditionName)) {
      return confidence > 0.7 ? 'High' : 'Moderate';
    } else if (moderateConditions.includes(conditionName)) {
      return 'Moderate';
    }
    return 'Low to Moderate';
  };

  // Get condition-specific recommendations
  const getRecommendations = (topCondition) => {
    if (!topCondition) return null;
    
    const recommendations = {
      'Eczema': {
        keyFindings: [
          'Redness and inflammation detected',
          'Dry, scaly patches identified',
          'Pattern consistent with eczema',
          'No signs of infection present'
        ],
        nextSteps: [
          'Consult with a dermatologist for professional diagnosis',
          'Apply fragrance-free moisturizer twice daily',
          'Avoid known triggers (harsh soaps, certain fabrics)',
          'Consider over-the-counter hydrocortisone cream',
          'Track symptoms and potential triggers'
        ]
      },
      'Melanoma': {
        keyFindings: [
          'Irregular pigmentation detected',
          'Asymmetric features observed',
          'Border irregularity noted',
          'Requires immediate medical evaluation'
        ],
        nextSteps: [
          'Schedule an urgent dermatologist appointment',
          'Avoid sun exposure on the affected area',
          'Document any changes in size or color',
          'Do not attempt self-treatment',
          'Prepare medical history for consultation'
        ]
      },
      // Add more condition-specific recommendations as needed
      default: {
        keyFindings: [
          'Skin abnormality detected',
          'Further evaluation recommended',
          'Pattern requires professional assessment',
          'Monitor for changes'
        ],
        nextSteps: [
          'Consult with a dermatologist for accurate diagnosis',
          'Keep the area clean and dry',
          'Avoid scratching or irritating the area',
          'Document any changes with photos',
          'Note any associated symptoms'
        ]
      }
    };
    
    return recommendations[topCondition] || recommendations.default;
  };

  const topConditionName = top3Predictions[0]?.name;
  const recommendations = getRecommendations(topConditionName);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.analyzeContainer}>
        <View style={styles.analyzeHeader}>
          <Text style={styles.analyzeTitle}>Analysis Results</Text>
          <Text style={styles.analyzeDate}>{dateString}</Text>
        </View>

        {top3Predictions && top3Predictions.length > 0 ? (
          top3Predictions.map((prediction, idx) => (
            <View key={idx} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>
                  {idx === 0 ? 'Most Likely' : `Possibility #${idx + 1}`}
                </Text>
                <View style={[
                  styles.confidenceBadge,
                  prediction.probability > 0.7 ? styles.highConfidence :
                  prediction.probability > 0.3 ? styles.mediumConfidence :
                  styles.lowConfidence
                ]}>
                  <Text style={styles.confidenceText}>
                    {(prediction.probability * 100).toFixed(1)}% Confidence
                  </Text>
                </View>
              </View>
              <Text style={[
                styles.conditionName,
                idx === 0 ? styles.primaryCondition : styles.secondaryCondition
              ]}>
                {prediction.name}
              </Text>
              {idx === 0 && (
                <Text style={styles.severityText}>
                  Severity: {getSeverity(prediction.name, prediction.probability)}
                </Text>
              )}
            </View>
          ))
        ) : (
          <View style={styles.resultCard}>
            <Text style={styles.conditionName}>No results found</Text>
          </View>
        )}

        {recommendations && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Key Findings</Text>
              <Text style={styles.cardText}>
                {recommendations.keyFindings.map((finding, idx) => 
                  `• ${finding}${idx < recommendations.keyFindings.length - 1 ? '\n' : ''}`
                ).join('')}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Recommended Next Steps</Text>
              <Text style={styles.cardText}>
                {recommendations.nextSteps.map((step, idx) => 
                  `${idx + 1}. ${step}${idx < recommendations.nextSteps.length - 1 ? '\n' : ''}`
                ).join('')}
              </Text>
            </View>
          </>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>⚠️ Important Notice</Text>
          <Text style={styles.cardText}>
            This analysis is for informational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider for accurate diagnosis and treatment.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>When to See a Doctor</Text>
          <Text style={styles.cardText}>
            Seek medical attention if you experience:
            {'\n'}• Rapid changes in size, color, or shape
            {'\n'}• Bleeding, oozing, or crusting
            {'\n'}• Persistent itching or pain
            {'\n'}• Signs of infection (pus, warmth, red streaks)
            {'\n'}• Any concerns about your skin condition
          </Text>
        </View>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Save Results</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={onScanAgain}
        >
          <Text style={styles.secondaryButtonText}>Scan Again</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  analyzeContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  analyzeHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  analyzeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  analyzeDate: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  resultCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  confidenceBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  highConfidence: {
    backgroundColor: '#dc2626',
  },
  mediumConfidence: {
    backgroundColor: '#f59e0b',
  },
  lowConfidence: {
    backgroundColor: '#dcfce7',
  },
  confidenceText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  conditionName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  primaryCondition: {
    color: '#dc2626',
  },
  secondaryCondition: {
    color: '#6b7280',
  },
  severityText: {
    fontSize: 16,
    color: '#f59e0b',
    fontWeight: '500',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AnalyzePage;