import { Route, Routes, useNavigate } from 'react-router-dom';
import AppContainer from './components/AppContainer';
import { setNavigate } from './lib/navigation';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';

export const Home = () => {
  return <div>Home</div>;
};

const App = () => {
  const navigate = useNavigate();
  setNavigate(navigate);
  return (
  <Routes>
    <Route path="/" element={<AppContainer />} />
    <Route path='/login' element={<Login />} />
    <Route path='/register' element={<Register />} />
    <Route path='/email/verify/:code' element={<VerifyEmail />} />
    <Route path='/password/forgot' element={<ForgotPassword />} />
    <Route path='/password/reset' element={<ResetPassword />} />
  </Routes>
  );
};

export default App;
