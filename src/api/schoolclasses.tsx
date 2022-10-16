import { HttpMethods } from '../hooks/useFetch';
import useFetchPrivate from '../hooks/useFetchPrivate';
import { HttpResponse } from './types';

export const SCHOOL_CLASSES = 'schoolClass';

export interface SchoolClass {
  id?: string;
  grade: number;
  letter: string;
  numberOfPupils: number;
  dateFrom: string;
  dateTo: string;
}

export interface SchoolClassHttpResponse extends HttpResponse {
  schoolClasses?: SchoolClass[];
  schoolClass?: SchoolClass;
}

const useSchoolClassesApi = () => {
  const fetchPrivate = useFetchPrivate();

  const getSchoolClasses = async (): Promise<SchoolClassHttpResponse> => {
    return await fetchPrivate('/schoolclasses/get-all', { method: HttpMethods.GET });
  };

  const addSchoolClass = async (book: SchoolClass): Promise<HttpResponse> => {
    return await fetchPrivate('/schoolclasses/add', { method: HttpMethods.POST, body: JSON.stringify(book) });
  };

  const updateSchoolClass = async (book: SchoolClass): Promise<HttpResponse> => {
    return await fetchPrivate('/schoolclasses/update', { method: HttpMethods.POST, body: JSON.stringify(book) });
  };

  const deleteSchoolClass = async (id: string): Promise<HttpResponse> => {
    return await fetchPrivate(`/schoolclasses/delete?id=${id}`, { method: HttpMethods.POST });
  };

  return { getSchoolClasses, addSchoolClass, updateSchoolClass, deleteSchoolClass };
};

export default useSchoolClassesApi;
