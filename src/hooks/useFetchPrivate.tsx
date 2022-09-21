import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from './useAuth';
import useRefreshAccessToken from './useRefresh';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useFetchPrivate = () => {
  const { auth } = useAuth();
  const refresh = useRefreshAccessToken();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchPrivate = async (url: string, init?: RequestInit) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...init,
      credentials: 'include',
      headers: { ...init?.headers, Authorization: `Bearer ${auth.accessToken}` }
    });
    if (response.ok) return await response.json();
    if (response.status === 401) {
      const newAccessToken = await refresh();
      if (!newAccessToken) {
        navigate('/login', { state: { from: location }, replace: true });
        return { error: 'Unauthorized' };
      }
      const newResponse = await fetch(`${BASE_URL}${url}`, {
        ...init,
        credentials: 'include',
        headers: { ...init?.headers, Authorization: `Bearer ${newAccessToken}` }
      });
      return await newResponse.json();
    }
  };
  return fetchPrivate;
};

export default useFetchPrivate;
