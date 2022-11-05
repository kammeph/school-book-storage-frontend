import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthApi, { ACCESS_TOKEN } from '../api/auth';

// export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const BASE_URL = 'https://sbs-api.kammererphilipp.de/api';

const useFetchPrivate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refresh, logout } = useAuthApi();
  const query = useQuery([ACCESS_TOKEN], refresh);
  const { mutate } = useMutation(logout, {
    onSuccess: () => {
      queryClient.clear();
      navigate('/login', { state: { from: location }, replace: true });
    }
  });
  const queryClient = useQueryClient();

  const fetchPrivate = async (url: string, init?: RequestInit) => {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...init,
      credentials: 'include',
      headers: { ...init?.headers, Authorization: `Bearer ${query.data?.accessToken}` }
    });
    if (response.ok || response.status !== 401) return await response.json();
    const refreshResponse = await query.refetch();
    if (!refreshResponse.data?.accessToken) {
      await mutate();
      return { error: 'Unauthorized' };
    }
    const newResponse = await fetch(`${BASE_URL}${url}`, {
      ...init,
      credentials: 'include',
      headers: { ...init?.headers, Authorization: `Bearer ${refreshResponse.data.accessToken}` }
    });
    return await newResponse.json();
  };
  return fetchPrivate;
};

export default useFetchPrivate;
