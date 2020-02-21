import React from 'react';
import SystemDescription from './components/system-description/system-description';
import ErrorBoundary from './components/error-boundary';

const App: React.FC = () => {
  // Routing goes here

  return (
    <ErrorBoundary>
      <SystemDescription></SystemDescription>
    </ErrorBoundary>
  );
}

export default App;
