import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthApi from '../api/auth';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useFetchPrivate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refresh } = useAuthApi();
  const query = useQuery(['accessToken'], refresh);

  const fetchPrivate = async (url: string, init?: RequestInit) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...init,
      credentials: 'include',
      headers: { ...init?.headers, Authorization: `Bearer ${query.data?.accessToken}` }
    });
    if (response.ok) return await response.json();
    if (response.status === 401) {
      // const newAccessToken = await refresh();
      const refreshResponse = await query.refetch();
      if (!refreshResponse.data?.accessToken) {
        navigate('/login', { state: { from: location }, replace: true });
        return { error: 'Unauthorized' };
      }
      const newResponse = await fetch(`${BASE_URL}${url}`, {
        ...init,
        credentials: 'include',
        headers: { ...init?.headers, Authorization: `Bearer ${refreshResponse.data.accessToken}` }
      });
      return await newResponse.json();
    }
  };
  return fetchPrivate;
};

export default useFetchPrivate;
