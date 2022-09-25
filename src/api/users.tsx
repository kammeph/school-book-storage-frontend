import { HttpMethods } from '../hooks/useFetch';
import useFetchPrivate from '../hooks/useFetchPrivate';
import { HttpResponse } from './types';

export enum Role {
  User = 'USER',
  Superuser = 'SUPERUSER',
  Admin = 'ADMIN',
  SysAdmin = 'SYS_ADMIN'
}

export interface User {
  id?: string;
  schoolId?: string;
  username: string;
  roles: Role[];
  locale: string;
}

export interface UserHttpResponse extends HttpResponse {
  users?: User[];
  user?: User;
}

const useUsersApi = () => {
  const fetchPrivate = useFetchPrivate();

  const getById = async (id?: string): Promise<UserHttpResponse> => {
    if (!id) return { error: 'user id not specified' };
    try {
      const resposne = await fetchPrivate(`/users/by-id?userId=${id}`, { method: HttpMethods.GET });
      return resposne;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getMe = async (): Promise<UserHttpResponse> => {
    try {
      const resposne = await fetchPrivate('/users/me', { method: HttpMethods.GET });
      return resposne;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return { getById, getMe };
};

export default useUsersApi;
