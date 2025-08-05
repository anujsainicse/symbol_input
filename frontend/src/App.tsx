import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Landing from './pages/Landing';
import DEXManagement from './pages/DEXManagement';
import CEXManagement from './pages/CEXManagement';
import FuturesManagement from './pages/FuturesManagement';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000, // 30 seconds
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dex" element={<DEXManagement />} />
            <Route path="/cex" element={<CEXManagement />} />
            <Route path="/futures" element={<FuturesManagement />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;