import React from 'react';
import { FeatureList } from './components/FeatureList';
import { AddFeatureForm } from './components/AddFeatureForm';
import { useFeatures } from './hooks/useFeatures';
import './App.css';

function App() {
  const { 
    features, 
    loading, 
    error, 
    createFeature, 
    voteForFeature 
  } = useFeatures();

  const handleCreateFeature = async (featureData: any) => {
    try {
      await createFeature(featureData);
    } catch (error) {
      // Error is handled by the hook
      console.error('Failed to create feature:', error);
    }
  };

  const handleVoteForFeature = async (featureId: number) => {
    try {
      await voteForFeature(featureId);
    } catch (error) {
      // Error is handled by the hook
      console.error('Failed to vote:', error);
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="container">
          <h1>🚀 Feature Voting System</h1>
          <p>Submit feature requests and vote for your favorites!</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <div className="app-grid">
            <section className="form-section">
              <AddFeatureForm 
                onSubmit={handleCreateFeature}
                loading={loading}
              />
            </section>

            <section className="list-section">
              <FeatureList
                features={features}
                loading={loading}
                error={error}
                onVote={handleVoteForFeature}
              />
            </section>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2025 Feature Voting System</p>
        </div>
      </footer>
    </div>
  );
}

export default App;