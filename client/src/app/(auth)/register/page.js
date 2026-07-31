import AuthCard from '../../../components/auth/AuthCard';
import RegisterForm from '../../../components/auth/RegisterForm';

export const metadata = {
  title: 'Register - Task Management System',
};

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create an Account"
      subtitle="Join us to start managing your tasks efficiently"
      linkLabel="Already have an account?"
      linkText="Sign in here"
      linkHref="/login"
    >
      <RegisterForm />
    </AuthCard>
  );
}