import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { PatientForm } from './components/PatientForm';
import TestPage from './pages/test';
import { NotFound } from './pages/Notfound';
import { HelmetProvider } from 'react-helmet-async';
import { Tongueinspect } from './components/Tongueinspect';
import { ConstitutionTest } from './components/ConstitutionTest';
import DataBase from './pages/DataBase';
import Home from './pages/Home';

function App() {
  return (
    <HelmetProvider>
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
                <Route path="/PatientForm" element={<PatientForm />} />
                <Route path="/" element={<ConstitutionTest />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/Tongueinspect" element={<Tongueinspect />} />
                <Route path="/constitution-test" element={<ConstitutionTest />} />
                <Route path="/database" element={<DataBase/>} />
                <Route path="/home" element={<Home />} />
                {/*<Route path="*" element={<Navigate to="/" replace />} />*/}
                <Route path="*" element={<NotFound />} />
              </Routes>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link to="/">中医问诊</Link> | <Link to="/constitution-test">体质测试</Link> | <Link to="/Tongueinspect">舌苔分析</Link> | <Link to="/test">测试页面</Link>
              </div>
            </div>
          </div>
        </BrowserRouter>
      </MantineProvider>
    </HelmetProvider>
  );
}

export default App;
