import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

interface HeaderProps {
  onAddPress: () => void;
  onRefreshPress: () => void;
  refreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onAddPress,
  onRefreshPress,
  refreshing,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>🚀 Feature Voting</Text>
        <Text style={styles.subtitle}>Vote for features you'd like to see!</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.refreshButton]}
          onPress={onRefreshPress}
          disabled={refreshing}
        >
          {refreshing ? (
            <ActivityIndicator size="small" color="#666" />
          ) : (
            <Text style={styles.refreshButtonText}>↻</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.addButton]}
          onPress={onAddPress}
        >
          <Text style={styles.addButtonText}>+ Suggest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  titleContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    minWidth: 44,
  },
  refreshButtonText: {
    fontSize: 18,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007AFF',
    flex: 1,
    marginLeft: 12,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});