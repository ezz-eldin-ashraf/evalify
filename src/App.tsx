import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadTemplate from './pages/UploadTemplate';
import Evaluate from './pages/Evaluate';
import StudentsList from './pages/StudentsList';
import Support from './pages/Support';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Results from './pages/Results';
import EditTemplate from './pages/EditTemplate';
import Exams from './pages/Exams';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth routes (no sidebar) */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes placeholder */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/upload-template" element={<UploadTemplate />} />
          <Route path="/evaluate" element={<Evaluate />} />
          <Route path="/students" element={<StudentsList />} />
          <Route path="/support" element={<Support />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/results/:paperId" element={<Results />} />
          <Route path="/edit-template/:templateId" element={<EditTemplate />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
