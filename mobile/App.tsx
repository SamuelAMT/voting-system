import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  Alert,
  StatusBar
} from 'react-native';

import { FeatureList } from './src/components/FeatureList';
import { AddFeatureModal } from './src/components/AddFeatureModal';
import { Header } from './src/components/Header';
import { apiService } from './src/services/api';
import { Feature } from './src/types/Feature';

const App = (): React.JSX.Element => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchFeatures = async (isRefresh: boolean = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const response = await apiService.getFeatures();
      setFeatures(response.data);
    } catch (error: any) {
      console.error('Error fetching features:', error);
      Alert.alert(
        'Error',
        'Failed to load features. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleFeatureAdded = (newFeature: Feature) => {
    setFeatures(prev => [newFeature, ...prev]);
    setShowAddModal(false);
    Alert.alert('Success', 'Feature suggestion added successfully!');
  };

  const handleVoteSuccess = (featureId: number) => {
    setFeatures(prev => prev.map(feature => 
      feature.id === featureId 
        ? { ...feature, votes: feature.votes + 1 }
        : feature
    ).sort((a, b) => b.votes - a.votes));
  };

  const onRefresh = () => {
    fetchFeatures(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <Header 
        onAddPress={() => setShowAddModal(true)}
        onRefreshPress={() => fetchFeatures(true)}
        refreshing={refreshing}
      />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <FeatureList
          features={features}
          loading={loading}
          onVoteSuccess={handleVoteSuccess}
        />
      </ScrollView>

      <AddFeatureModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onFeatureAdded={handleFeatureAdded}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default App;