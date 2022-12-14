import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthApi, { ACCESS_TOKEN } from '../api/auth';
import { env } from '../environments/env';

const API_BASE_URL = env.API_BASE_URL;

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
    const response = await fetch(`${API_BASE_URL}${url}`, {
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
    const newResponse = await fetch(`${API_BASE_URL}${url}`, {
      ...init,
      credentials: 'include',
      headers: { ...init?.headers, Authorization: `Bearer ${refreshResponse.data.accessToken}` }
    });
    return await newResponse.json();
  };
  return fetchPrivate;
};

export default useFetchPrivate;
