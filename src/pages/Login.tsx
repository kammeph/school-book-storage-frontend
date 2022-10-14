import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthApi, { ACCESS_TOKEN } from '../api/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const userRef = useRef<HTMLInputElement>(null);
  const { login } = useAuthApi();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/books';
  
  const formInvalid = useCallback(() => {
    return !username || !password;
  }, [username, password]);
  const queryClient = useQueryClient();
  const { mutate: loginUser } = useMutation(login, {
    onSuccess: data => {
      if (!data.error) {
        queryClient.setQueryData([ACCESS_TOKEN], data);
        navigate(from, { replace: true });
      }
    }
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    loginUser({ username, password });
  };

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-full bg-gray-100">
      <div className="card max-w-xs">
        <h1 className="h1 text-center">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col flex-nowrap text-left w-full">
          <label htmlFor="username">Username</label>
          <input
            className="input"
            ref={userRef}
            type="text"
            name="username"
            placeholder="enter username here"
            id="username"
            autoComplete="off"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            className="input"
            type="password"
            name="password"
            placeholder="enter password here"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="btn" disabled={formInvalid()}>
            Submit
          </button>
        </form>
      </div>
      <div className="mt-2">
        <span>You don't have an account?</span>
        <Link className="m-2 text-indigo-600 hover:underline" to="/register">
          Register now
        </Link>{' '}
      </div>
    </div>
  );
}

export default Login;
