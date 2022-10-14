import { useQuery } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';
import useUsersApi, { ME } from './api/users';
import Layout from './components/Layout';
import Books from './pages/Books';
import Classes from './pages/Classes';
import Schools from './pages/Schools';
import Storages from './pages/Storages';
import UserEdit from './pages/User';
import Users from './pages/Users';

function App() {
  const { getMe } = useUsersApi();
  const { data } = useQuery([ME], getMe);

  return (
    <Routes>
      <Route path="/" element={<Layout currentUser={data?.user} />}>
        <Route path="schools" element={<Schools currentUser={data?.user} />} />
        <Route path="books" element={<Books currentUser={data?.user} />} />
        <Route path="storages" element={<Storages />} />
        <Route path="classes" element={<Classes />} />
        <Route path="users">
          <Route index element={<Users />} />
          <Route path=":id" element={<UserEdit currentUser={data?.user} />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
