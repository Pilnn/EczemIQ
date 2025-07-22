import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const AnalyzePage = ({ top3 }) => {
  // top3 = [
  //   { name: 'Atopic Dermatitis (Eczema)', confidence: 0.85, severity: 'Moderate' },
  //   { name: 'Psoriasis', confidence: 0.1, severity: 'Mild' },
  //   { name: 'Contact Dermatitis', confidence: 0.05, severity: 'Mild' },
  // ];

  // Format current date as string
  const dateString = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.analyzeContainer}>
        <View style={styles.analyzeHeader}>
          <Text style={styles.analyzeTitle}>Analysis Results</Text>
          <Text style={styles.analyzeDate}>{dateString}</Text>
        </View>

        {top3 && top3.length > 0 ? (
          top3.map(({ name, confidence, severity }, idx) => (
            <View key={idx} style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Detected Condition #{idx + 1}</Text>
                <View style={styles.confidenceBadge}>
                  <Text style={styles.confidenceText}>
                    {(confidence * 100).toFixed(1)}% Confidence
                  </Text>
                </View>
              </View>
              <Text style={styles.conditionName}>{name}</Text>
              {severity ? (
                <Text style={styles.severityText}>Severity: {severity}</Text>
              ) : null}
            </View>
          ))
        ) : (
          <View style={styles.resultCard}>
            <Text style={styles.conditionName}>No results found</Text>
          </View>
        )}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Key Findings</Text>
          <Text style={styles.cardText}>
            • Redness and inflammation detected
            {'\n'}• Dry, scaly patches identified
            {'\n'}• Pattern consistent with eczema
            {'\n'}• No signs of infection present
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recommended Next Steps</Text>
          <Text style={styles.cardText}>
            1. Consult with a dermatologist for professional diagnosis
            {'\n'}2. Apply fragrance-free moisturizer twice daily
            {'\n'}3. Avoid known triggers (harsh soaps, certain fabrics)
            {'\n'}4. Consider over-the-counter hydrocortisone cream
            {'\n'}5. Track symptoms and potential triggers
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>When to See a Doctor</Text>
          <Text style={styles.cardText}>
            Seek medical attention if you experience:
            {'\n'}• Severe itching that interferes with sleep
            {'\n'}• Signs of infection (pus, warmth, red streaks)
            {'\n'}• Symptoms that don't improve with treatment
            {'\n'}• Widespread rash covering large areas
          </Text>
        </View>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Save Results</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton}>
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
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  confidenceBadge: {
    backgroundColor: '#dcfce7',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  confidenceText: {
    fontSize: 14,
    color: '#166534',
    fontWeight: '500',
  },
  conditionName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 8,
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
    marginBottom: 8,
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
