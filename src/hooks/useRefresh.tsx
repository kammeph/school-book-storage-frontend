import useAuth from './useAuth';
import useFetch, { HttpMethods } from './useFetch';

interface RefreshResponse {
  accessToken?: string;
  error?: string;
}

const useRefresh = () => {
  const { setAuth } = useAuth();
  const [fetchData] = useFetch();
  const refresh = async () => {
    const [response, error] = await fetchData<RefreshResponse>('/auth/refresh', { method: HttpMethods.GET });
    if (!error && !response.error) {
      setAuth({ accessToken: response.accessToken });
    }
    return [response, error] as const;
  };
  return refresh;
};

export default useRefresh;
