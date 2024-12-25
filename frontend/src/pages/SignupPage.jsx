import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/Auth/SignupForm';

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignupSuccess = () => {
    navigate('/login');
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <SignupForm onSuccess={handleSignupSuccess} />
    </div>
  );
};

export default SignupPage;
