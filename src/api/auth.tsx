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
    const response = fetchData('/auth/login', { method: HttpMethods.POST, body: JSON.stringify(credentials) });
    return response;
  };

  const register = async (credentials: Credentials): Promise<HttpResponse> => {
    const response = fetchData('/auth/register', { method: HttpMethods.POST, body: JSON.stringify(credentials) });
    return response;
  };

  const logout = async (): Promise<HttpResponse> => {
    const response = fetchData('/auth/logout', { method: HttpMethods.POST });
    return response;
  };

  return { login, register, logout };
};

export default useAuthApi;
