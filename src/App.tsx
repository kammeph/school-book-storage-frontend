import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthApi from './api/auth';
import useUsersApi, { UserHttpResponse } from './api/users';
import Button from './components/Button';
import useFetch, { HttpMethods } from './hooks/useFetch';
import useFetchPrivate from './hooks/useFetchPrivate';

function App() {
  const { getMe } = useUsersApi();
  const { logout } = useAuthApi();
  const { isError, error, data } = useQuery<any, Error, UserHttpResponse, string[]>(['me'], getMe);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <main className="flex justify-center">
      {!isError && <p>Data: {JSON.stringify(data?.user)}</p>}
      {isError && <p>{error?.message}</p>}
      <Button onClick={handleLogout}>Logout</Button>
    </main>
  );
}

export default App;
