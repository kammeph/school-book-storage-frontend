import { HttpMethods } from '../hooks/useFetch';
import useFetchPrivate from '../hooks/useFetchPrivate';
import { HttpResponse } from './types';

export const BOOKS = 'books';

export enum Subject {
  German = 'GERMAN',
  Mathematics = 'MATHEMATICS',
  English = 'ENGLISH',
  Music = 'MUSIC',
  GeneralEducation = 'GENERAL_EDUCATION',
  Religion = 'RELIGION'
}

export interface Book {
  id?: string;
  isbn: string;
  name: string;
  description?: string;
  subject?: Subject;
  price?: number;
  grades: number[];
}

export interface BookHttpResponse extends HttpResponse {
  books?: Book[];
  book?: Book;
}

const useBooksApi = () => {
  const fetchPrivate = useFetchPrivate();

  const getBooks = async (): Promise<BookHttpResponse> => {
    return await fetchPrivate('/books/get-all', { method: HttpMethods.GET });
  };

  const addBook = async (book: Book): Promise<HttpResponse> => {
    return await fetchPrivate('/books/add', { method: HttpMethods.POST, body: JSON.stringify(book) });
  };

  const updateBook = async (book: Book): Promise<HttpResponse> => {
    return await fetchPrivate('/books/update', { method: HttpMethods.POST, body: JSON.stringify(book) });
  };

  const deleteBook = async (id: string): Promise<HttpResponse> => {
    return await fetchPrivate(`/books/delete?id=${id}`, { method: HttpMethods.POST });
  };

  return { getBooks, addBook, updateBook, deleteBook };
};

export default useBooksApi;
