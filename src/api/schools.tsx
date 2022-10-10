import { HttpMethods } from '../hooks/useFetch';
import useFetchPrivate from '../hooks/useFetchPrivate';
import { HttpResponse } from './types';

export const SCHOOLS = 'schools';

export interface School {
  id?: string;
  name: string;
}

export interface SchoolHttpResponse extends HttpResponse {
  schools?: School[];
  school?: School;
}

const useSchoolsApi = () => {
  const fetchPrivate = useFetchPrivate();

  const getSchools = async (): Promise<SchoolHttpResponse> => {
    return await fetchPrivate('/schools', { method: HttpMethods.GET });
  };

  const addSchool = async (name: string): Promise<HttpResponse> => {
    return await fetchPrivate('/schools/add', { method: HttpMethods.POST, body: JSON.stringify({ name }) });
  };

  const updateSchool = async (school: School): Promise<HttpResponse> => {
    return await fetchPrivate('/schools/update', { method: HttpMethods.POST, body: JSON.stringify(school) });
  };

  const deleteSchool = async (id: string): Promise<HttpResponse> => {
    return await fetchPrivate(`/schools/delete?id=${id}`, { method: HttpMethods.POST });
  };

  return { getSchools, addSchool, updateSchool, deleteSchool };
};

export default useSchoolsApi;
