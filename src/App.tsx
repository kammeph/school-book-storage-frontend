import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './components/Button';
import useFetch, { HttpMethods } from './hooks/useFetch';
import useFetchPrivate from './hooks/useFetchPrivate';

interface User {
  id?: string;
  schoolId?: string;
  name?: string;
  roles?: string[];
  locale?: string;
}

interface UserResponse {
  user?: User;
  error?: string;
}

function App() {
  const [user, setUser] = useState<UserResponse>({});
  const [fetchPrivate] = useFetchPrivate();
  const [fetchData] = useFetch();
  const navigate = useNavigate();
  useEffect(() => {
    fetchPrivate<UserResponse>('/users/me', { method: HttpMethods.GET }).then(result => {
      const [response, error] = result;
      setUser(response);
    });
  }, []);
  const handleLogout = async () => {
    await fetchData('/auth/logout', { method: HttpMethods.POST });
    navigate('/login');
  };
  return (
    <main className="flex justify-center">
      <p>{JSON.stringify(user)}</p>
      <Button onClick={handleLogout}>Logout</Button>
    </main>
  );
}

export default App;
