import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import H1 from '../components/Headers';
import Input from '../components/Input';
import useAuth from '../hooks/useAuth';
import Card from '../components/Card';
import useAuthApi from '../api/auth';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const userRef = useRef<HTMLInputElement>(null);
  const { login } = useAuthApi();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/schools';
  const formInvalid = useCallback(() => {
    return !username || !password;
  }, [username, password]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await login({ username, password });
    if (!response.error) {
      setAuth({ accessToken: response.accessToken });
      navigate(from, { replace: true });
    }
  };

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Card className="max-w-xs">
        <H1 className="text-center">Login</H1>
        <form onSubmit={handleSubmit} className="flex flex-col flex-nowrap text-left w-full">
          <label className="ml-2" htmlFor="username">
            Username
          </label>
          <Input
            ref={userRef}
            type="text"
            name="username"
            placeholder="enter username here"
            id="username"
            autoComplete="off"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <label className="ml-2" htmlFor="password">
            Password
          </label>
          <Input
            type="password"
            name="password"
            placeholder="enter password here"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button disabled={formInvalid()}>Submit</Button>
        </form>
      </Card>
      <div>
        <span>You don't have an account?</span>
        <Link className="m-2 text-indigo-600 hover:underline" to="/register">
          Register now
        </Link>{' '}
      </div>
    </div>
  );
}

export default Login;
