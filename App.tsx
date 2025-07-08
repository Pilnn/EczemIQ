import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';

// Import your page components
import WelcomePage from './pages/WelcomePage';
import HomePage from './pages/HomePage';
import ScanPage from './pages/ScanPage';
import AnalyzePage from './pages/Analyze';
import BottomNavigation from './components/NavBar';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<string>('welcome');
  const [activeTab, setActiveTab] = useState<string>('home');

  const handleLogin = (): void => {
    setCurrentScreen('main');
    setActiveTab('home');
  };

  const handleImageCaptured = (): void => {
    setActiveTab('analyze');
  };

  const handleTabPress = (tabId: string): void => {
    setActiveTab(tabId);
  };

  if (currentScreen === 'welcome') {
    return <WelcomePage onLogin={handleLogin} />;
  }

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'scan':
        return <ScanPage onImageCaptured={handleImageCaptured} />;
      case 'analyze':
        return <AnalyzePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <View style={styles.appContainer}>
      {renderCurrentPage()}
      <BottomNavigation activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
});

export default App;