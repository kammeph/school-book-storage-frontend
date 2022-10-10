import { HttpMethods } from '../hooks/useFetch';
import useFetchPrivate from '../hooks/useFetchPrivate';
import { HttpResponse } from './types';

export const USERS = 'users';
export const ME = 'me';

export enum Role {
  User = 'USER',
  Superuser = 'SUPERUSER',
  Admin = 'ADMIN',
  SysAdmin = 'SYS_ADMIN'
}

export enum Locale {
  EN = 'EN',
  DE = 'DE'
}

export interface User {
  id?: string;
  schoolId?: string;
  username?: string;
  roles?: Role[];
  locale?: Locale;
}

export interface UserHttpResponse extends HttpResponse {
  users?: User[];
  user?: User;
}

const useUsersApi = () => {
  const fetchPrivate = useFetchPrivate();

  const getUsers = async (): Promise<UserHttpResponse> => {
    return await fetchPrivate(`/users`, { method: HttpMethods.GET });
  };

  const getUserById = async (id?: string): Promise<UserHttpResponse> => {
    if (!id) return { error: 'user id not specified' };
    return await fetchPrivate(`/users/by-id?userId=${id}`, { method: HttpMethods.GET });
  };

  const getMe = async (): Promise<UserHttpResponse> => {
    return await fetchPrivate('/users/me', { method: HttpMethods.GET });
  };

  const updateUser = async (user: User): Promise<HttpResponse> => {
    return await fetchPrivate(`/users/update`, { method: HttpMethods.POST, body: JSON.stringify(user) });
  };

  return { getUsers, getUserById, getMe, updateUser };
};

export default useUsersApi;
