import useAuth from './useAuth';
import { HttpMethods } from './useFetch';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const useRefreshAccessToken = () => {
  const { setAuth } = useAuth();
  const refresh = async () => {
    const response = await fetch(`${BASE_URL}/auth/refresh`, { method: HttpMethods.GET, credentials: 'include' });
    let accessToken = '';
    if (response.ok) {
      const body = await response.json();
      accessToken = body.accessToken;
    }
    setAuth({ accessToken });
    return accessToken;
  };
  return refresh;
};

export default useRefreshAccessToken;
