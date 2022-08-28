import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useFetch, { HttpMethods } from '../hooks/useFetch';
import Button from '../components/Button';
import H1 from '../components/Headers';
import Input from '../components/Input';
import useAuth from '../hooks/useAuth';
import Card from '../components/Card';

interface LoginResponse {
  accessToken?: string;
  error?: string;
}

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const userRef = useRef<HTMLInputElement>(null);
  const [fetchData] = useFetch();
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';
  const formInvalid = useCallback(() => {
    return !username || !password;
  }, [username, password]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const [response, error] = await fetchData<LoginResponse>('/auth/login', {
      body: JSON.stringify({
        aggregateId: 'users',
        name: username,
        password: password
      }),
      method: HttpMethods.POST
    });
    if (!error && !response.error) {
      setAuth({ accessToken: response.accessToken });
      navigate(from, { replace: true });
    }
  };

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  return (
    <>
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
    </>
  );
}

export default Login;
