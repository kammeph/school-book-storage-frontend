import { Outlet } from 'react-router-dom';
import { User } from '../api/users';
import Navigation from './Navigation';

const Layout: React.FC<{ currentUser?: User }> = ({ currentUser }) => {
  return (
    <main className="flex flex-col-reverse justify-stretch h-screen bg-gray-100 lg:flex-col">
      <Navigation currentUser={currentUser} />
      <Outlet />
    </main>
  );
};

export default Layout;
