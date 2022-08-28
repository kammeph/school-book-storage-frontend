import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from './useAuth';
import useFetch from './useFetch';
import useRefresh from './useRefresh';

const useFetchPrivate = () => {
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const [fetchData] = useFetch();
  const refresh = useRefresh();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchPrivate = async <T extends {}>(url: string, init?: RequestInit) => {
    setLoading(true);
    let [response, error] = await fetchData<T>(url, {
      ...init,
      headers: { ...init?.headers, Authorization: `Bearer ${auth.accessToken}` }
    });
    if (error && error.status == 401) {
      const [response, refreshError] = await refresh();
      error = refreshError;
      if (!refreshError && !response.error) {
        return await fetchData<T>(url, {
          ...init,
          headers: { ...init?.headers, Authorization: `Bearer ${response.accessToken}` }
        });
      } else if (refreshError?.status === 401) {
        navigate('/login', { state: { from: location }, replace: true });
      }
    }
    setLoading(false);
    return [response as T, error] as const;
  };

  return [fetchPrivate, loading] as const;
};

export default useFetchPrivate;
