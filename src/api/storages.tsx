import { HttpMethods } from '../hooks/useFetch';
import useFetchPrivate from '../hooks/useFetchPrivate';
import { HttpResponse } from './types';

export const STORAGES = 'storages';

export interface Storage {
  id?: string;
  name: string;
  location: string;
}

export interface StorageHttpResponse extends HttpResponse {
  storages?: Storage[];
  storage?: Storage;
}

const useStoragesApi = () => {
  const fetchPrivate = useFetchPrivate();

  const getStorages = async (): Promise<StorageHttpResponse> => {
    return await fetchPrivate('/storages/get-all', { method: HttpMethods.GET });
  };

  const addStorage = async (book: Storage): Promise<HttpResponse> => {
    return await fetchPrivate('/storages/add', { method: HttpMethods.POST, body: JSON.stringify(book) });
  };

  const updateStorage = async (book: Storage): Promise<HttpResponse> => {
    return await fetchPrivate('/storages/update', { method: HttpMethods.POST, body: JSON.stringify(book) });
  };

  const deleteStorage = async (id: string): Promise<HttpResponse> => {
    return await fetchPrivate(`/storages/delete?id=${id}`, { method: HttpMethods.POST });
  };

  return { getStorages, addStorage, updateStorage, deleteStorage };
};

export default useStoragesApi;
