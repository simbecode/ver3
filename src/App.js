import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import AppShell from './components/layout/AppShell';
import MyCards from './pages/MyCards';
import GroupCards from './pages/GroupCards';
import Notes from './pages/Notes';
import Map from './pages/Map';
import WorkLog from './pages/WorkLog';
import WorkLogList from './pages/WorkLogList';
import WorkLogDashboard from './pages/WorkLogDashboard';
import Home from './pages/Home';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppShell>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-cards" element={<MyCards />} />
            <Route path="/group-cards" element={<GroupCards />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/map" element={<Map />} />
            <Route path="/worklog" element={<WorkLogList />} />
            <Route path="/worklog/create" element={<WorkLog />} />
            <Route path="/worklog-dashboard" element={<WorkLogDashboard />} />
            {/* 추가 라우트는 여기에 설정 */}
          </Routes>
        </AppShell>
      </Router>
    </ThemeProvider>
  );
}

export default App;
