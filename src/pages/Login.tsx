import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthApi from '../api/auth';
import { button, card, headers, input, link } from '../styles';
import { useMutation } from '@tanstack/react-query';

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
  const loginMutation = useMutation(['accessToken'], login, {
    onSuccess: data => {
      if (!data.error) navigate(from, { replace: true });
    }
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    loginMutation.mutate({ username, password });
  };

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className={`${card} max-w-xs`}>
        <h1 className={`${headers.h1} text-center`}>Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col flex-nowrap text-left w-full">
          <label className="ml-2" htmlFor="username">
            Username
          </label>
          <input
            className={input.basic}
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
          <input
            className={input.basic}
            type="password"
            name="password"
            placeholder="enter password here"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className={button.basic} disabled={formInvalid()}>
            Submit
          </button>
        </form>
      </div>
      <div>
        <span>You don't have an account?</span>
        <Link className={link} to="/register">
          Register now
        </Link>{' '}
      </div>
    </div>
  );
}

export default Login;
