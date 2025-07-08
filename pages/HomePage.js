import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';

const HomePage = () => (
  <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={styles.homeContainer}>
      <View style={styles.homeHeader}>
        <Text style={styles.homeTitle}>Welcome to eczemIQ</Text>
        <Text style={styles.homeSubtitle}>AI-powered skin health analysis</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What is eczemIQ?</Text>
        <Text style={styles.cardText}>
          eczemIQ is an advanced AI-powered application that helps you identify and understand 
          various skin conditions, particularly eczema. Using state-of-the-art machine learning 
          technology, we analyze photos of your skin to provide instant insights and 
          personalized recommendations.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Understanding Eczema</Text>
        <Text style={styles.cardText}>
          Eczema, also known as atopic dermatitis, is a common skin condition that causes 
          inflammation, redness, and itching. It affects millions of people worldwide and 
          can appear at any age, though it's most common in children.
        </Text>
        <Text style={styles.cardText}>
          Common symptoms include:
          {'\n'}• Dry, sensitive skin
          {'\n'}• Red, inflamed skin
          {'\n'}• Itching that may be severe
          {'\n'}• Dark colored patches of skin
          {'\n'}• Rough, leathery patches
          {'\n'}• Oozing or crusting
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>How eczemIQ Helps</Text>
        <Text style={styles.cardText}>
          Our AI technology analyzes skin images to detect potential signs of eczema and 
          other skin conditions. We provide personalized insights, severity assessments, 
          and actionable recommendations to help you manage your skin health effectively.
        </Text>
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ⚠️ Important: eczemIQ is for informational purposes only and should not replace 
          professional medical advice. Always consult with a healthcare provider for proper 
          diagnosis and treatment.
        </Text>
      </View>
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  homeContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  homeHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  homeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  homeSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
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
  disclaimer: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
});

export default HomePage;