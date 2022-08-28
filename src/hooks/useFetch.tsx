import { useEffect, useState } from 'react';

export interface HttpError {
  message?: string;
  status?: number;
}

export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const HttpMethods = {
  GET: 'GET',
  POST: 'POST'
};

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState<AbortController>();

  // async function fetchData<T extends any>(url: string, init?: RequestInit) {
  const fetchData = async <T extends {}>(url: string, init?: RequestInit) => {
    setLoading(true);
    setController(new AbortController());
    let data;
    let error: HttpError | undefined = undefined;
    try {
      const res = await fetch(`${BASE_URL}${url}`, {
        credentials: 'include',
        signal: controller?.signal,
        ...init,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...init?.headers
        }
      });
      if (res.ok) {
        data = await res.json();
      } else {
        error = {
          message: await res.text(),
          status: res.status
        };
        await Promise.reject(res);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
    return [data as T, error] as const;
  };
  useEffect(() => {
    return () => controller?.abort();
  }, []);

  return [fetchData, loading] as const;
};

export default useFetch;
