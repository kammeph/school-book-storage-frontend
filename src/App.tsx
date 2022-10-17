import { useQuery } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';
import useUsersApi, { ME } from './api/users';
import Layout from './components/Layout';
import Books from './pages/Books';
import SchoolClasses from './pages/SchoolClasses';
import Schools from './pages/Schools';
import Storages from './pages/Storages';
import Users from './pages/Users';

function App() {
  const { getMe } = useUsersApi();
  const { data } = useQuery([ME], getMe);

  return (
    <Routes>
      <Route path="/" element={<Layout currentUser={data?.user} />}>
        <Route path="schools" element={<Schools currentUser={data?.user} />} />
        <Route path="books" element={<Books currentUser={data?.user} />} />
        <Route path="storages" element={<Storages currentUser={data?.user} />} />
        <Route path="classes" element={<SchoolClasses currentUser={data?.user} />} />
        <Route path="users" element={<Users currentUser={data?.user} />} />
      </Route>
    </Routes>
  );
}

export default App;
