import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFetch, { HttpMethods } from '../hooks/useFetch';
import Button from '../components/Button';
import H1 from '../components/Headers';
import Input from '../components/Input';
import Card from '../components/Card';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState('');
  const userRef = useRef<HTMLInputElement>(null);
  const [fetchData] = useFetch();
  const navigate = useNavigate();

  const formInvalid = useCallback(() => {
    return !username || !password || !passwordMatch || password !== passwordMatch;
  }, [username, password, passwordMatch]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const [response, error] = await fetchData('/auth/register', {
      body: JSON.stringify({
        aggregateId: 'users',
        name: username,
        password: password,
        locale: 'EN'
      }),
      method: HttpMethods.POST
    });
    if (!error) {
      navigate('/login');
    }
  };

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  return (
    <>
      <Card className="max-w-xs">
        <H1 className="text-center">Register</H1>
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
          <label className="ml-2" htmlFor="passwordMatch">
            Repeat password
          </label>
          <Input
            type="password"
            name="passwordMatch"
            placeholder="repeat password"
            id="passwordMatch"
            value={passwordMatch}
            onChange={e => setPasswordMatch(e.target.value)}
          />
          <Button disabled={formInvalid()}>Submit</Button>
        </form>
      </Card>
      <div>
        <span>You already have login and password?</span>
        <Link className="text-right m-2 hover:underline text-indigo-600" to="/login">
          Login
        </Link>
      </div>
    </>
  );
};

export default Register;
