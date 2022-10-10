import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthApi from '../api/auth';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState('');
  const userRef = useRef<HTMLInputElement>(null);
  const { register } = useAuthApi();
  const navigate = useNavigate();

  const formInvalid = useCallback(() => {
    return !username || !password || !passwordMatch || password !== passwordMatch;
  }, [username, password, passwordMatch]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await register({ username, password });
    if (!response.error) {
      navigate('/login');
    }
  };

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-full bg-gray-100">
      <div className="card max-w-xs">
        <h1 className="h1 text-center">Register</h1>
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
          <label htmlFor="passwordMatch">Repeat password</label>
          <input
            className="input"
            type="password"
            name="passwordMatch"
            placeholder="repeat password"
            id="passwordMatch"
            value={passwordMatch}
            onChange={e => setPasswordMatch(e.target.value)}
          />
          <button className="btn" disabled={formInvalid()}>
            Submit
          </button>
        </form>
      </div>
      <div className="mt-2">
        <span>You already have login and password?</span>
        <Link className="m-2 text-indigo-600 hover:underline" to="/login">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
