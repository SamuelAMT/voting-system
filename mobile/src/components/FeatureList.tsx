import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { Feature } from '../types/Feature';
import { apiService } from '../services/api';

interface FeatureListProps {
  features: Feature[];
  loading: boolean;
  onVoteSuccess: (featureId: number) => void;
}

export const FeatureList: React.FC<FeatureListProps> = ({
  features,
  loading,
  onVoteSuccess,
}) => {
  const [votingStates, setVotingStates] = useState<{[key: number]: boolean}>({});

  const handleVote = async (featureId: number, featureTitle: string) => {
    try {
      setVotingStates(prev => ({ ...prev, [featureId]: true }));
      
      await apiService.voteForFeature(featureId);
      onVoteSuccess(featureId);
      
      Alert.alert('Success', `Voted for "${featureTitle}"!`);
    } catch (error: any) {
      console.error('Vote error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to vote';
      Alert.alert('Vote Failed', errorMessage);
    } finally {
      setVotingStates(prev => ({ ...prev, [featureId]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading && features.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading features...</Text>
      </View>
    );
  }

  if (features.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>No features yet!</Text>
        <Text style={styles.emptySubtitle}>
          Be the first to suggest a feature for voting.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Feature Requests ({features.length})
      </Text>
      
      {features.map((feature, index) => (
        <View key={feature.id} style={styles.featureCard}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>#{index + 1}</Text>
          </View>
          
          <View style={styles.featureContent}>
            <View style={styles.featureHeader}>
              <Text style={styles.featureTitle} numberOfLines={2}>
                {feature.title}
              </Text>
              <View style={styles.voteContainer}>
                <Text style={styles.voteCount}>{feature.votes}</Text>
                <Text style={styles.voteLabel}>votes</Text>
              </View>
            </View>
            
            {feature.description && (
              <Text style={styles.featureDescription} numberOfLines={3}>
                {feature.description}
              </Text>
            )}
            
            <View style={styles.featureMeta}>
              <Text style={styles.authorText}>by {feature.authorName}</Text>
              <Text style={styles.dateText}>{formatDate(feature.createdAt)}</Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[
              styles.voteButton,
              votingStates[feature.id] && styles.voteButtonDisabled
            ]}
            onPress={() => handleVote(feature.id, feature.title)}
            disabled={votingStates[feature.id]}
          >
            {votingStates[feature.id] ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Text style={styles.voteIcon}>👍</Text>
                <Text style={styles.voteButtonText}>Vote</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    marginTop: 8,
  },
  featureCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rankBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 12,
    minWidth: 32,
    alignItems: 'center',
  },
  rankText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  featureContent: {
    flex: 1,
    marginRight: 12,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  voteContainer: {
    alignItems: 'center',
  },
  voteCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  voteLabel: {
    fontSize: 12,
    color: '#666',
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  featureMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  voteButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
    height: 40,
  },
  voteButtonDisabled: {
    opacity: 0.6,
  },
  voteIcon: {
    fontSize: 14,
    marginBottom: 2,
  },
  voteButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
});