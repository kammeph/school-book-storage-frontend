// export const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const BASE_URL = 'https://school-book-storage-service-c4un754gva-uc.a.run.app/api';

export const HttpMethods = {
  GET: 'GET',
  POST: 'POST'
};

const useFetch = () => {
  const fetchData = async (url: string, init?: RequestInit) => {
    const response = await fetch(`${BASE_URL}${url}`, {
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
