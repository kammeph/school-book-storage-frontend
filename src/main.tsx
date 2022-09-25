import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Register from './pages/Register';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Schools from './pages/Schools';
import Books from './pages/Books';
import Storages from './pages/Storages';
import Classes from './pages/Classes';
import Users from './pages/Users';
import User from './pages/User';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="schools" element={<Schools />} />
            <Route path="books" element={<Books />} />
            <Route path="storages" element={<Storages />} />
            <Route path="classes" element={<Classes />} />
            <Route path="users">
              <Route index element={<Users />} />
              <Route path=":id" element={<User />} />
            </Route>
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
