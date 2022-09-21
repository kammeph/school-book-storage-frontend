import { HttpMethods } from '../hooks/useFetch';
import useFetchPrivate from '../hooks/useFetchPrivate';
import { HttpResponse } from './types';

export interface User {
  id?: string;
  schoolId?: string;
  username: string;
  roles: string[];
  locale: string;
}

export interface UserHttpResponse extends HttpResponse {
  users?: User[];
  user?: User;
}

const useUsersApi = () => {
  const fetchPrivate = useFetchPrivate();

  const getMe = async (): Promise<UserHttpResponse> => {
    try {
      const resposne = await fetchPrivate('/users/me', { method: HttpMethods.GET });
      return resposne;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return { getMe };
};

export default useUsersApi;
