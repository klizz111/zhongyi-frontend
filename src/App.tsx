import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { PatientForm } from './components/PatientForm';
import TestPage from './pages/test';

function App() {
  return (
    <MantineProvider theme={{ colorScheme: 'dark' }}>
      <BrowserRouter>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <Routes>
              <Route path="/" element={<PatientForm />} />
              <Route path="/test" element={<TestPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Link to="/">首页</Link> | <Link to="/test">测试页面</Link>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
