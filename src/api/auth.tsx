import useFetch, { HttpMethods } from '../hooks/useFetch';
import { HttpResponse } from './types';

export interface Credentials {
  username: string;
  password: string;
}

export interface AccessTokenHttpResponse extends HttpResponse {
  accessToken?: string;
}

const useAuthApi = () => {
  const fetchData = useFetch();

  const login = async (credentials: Credentials): Promise<AccessTokenHttpResponse> => {
    return await fetchData('/auth/login', { method: HttpMethods.POST, body: JSON.stringify(credentials) });
  };

  const register = async (credentials: Credentials): Promise<HttpResponse> => {
    return await fetchData('/auth/register', { method: HttpMethods.POST, body: JSON.stringify(credentials) });
  };

  const logout = async (): Promise<HttpResponse> => {
    return await fetchData('/auth/logout', { method: HttpMethods.POST });
  };

  const refresh = async (): Promise<AccessTokenHttpResponse> => {
    return await fetchData('/auth/refresh', { method: HttpMethods.GET, credentials: 'include' });
  };

  return { login, register, logout, refresh };
};

export default useAuthApi;
