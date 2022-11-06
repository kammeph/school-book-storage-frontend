import { env } from '../environments/env';

const API_BASE_URL = env.API_BASE_URL;

export const HttpMethods = {
  GET: 'GET',
  POST: 'POST'
};

const useFetch = () => {
  const fetchData = async (url: string, init?: RequestInit) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      credentials: 'include',
      ...init,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...init?.headers
      }
    });
    return response.json();
  };
  return fetchData;
};

export default useFetch;
