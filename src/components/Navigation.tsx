import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faBookOpen,
  faUsers,
  faWarehouse,
  faSchool,
  faGraduationCap,
  faPowerOff,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Role, User } from '../api/users';
import useAuthApi from '../api/auth';
import NavigationLink from './NavigationLink';
import { useNavigate } from 'react-router-dom';

const Navigation: React.FC<{ currentUser?: User }> = ({ currentUser }) => {
  const { logout } = useAuthApi();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logoutMutation = useMutation(async () => await logout(), {
    onSuccess: currentUser => {
      if (!currentUser?.error) {
        queryClient.clear();
        navigate('/login');
      }
    }
  });

  return (
    <nav className="flex items-center sticky rounded-t-sm w-full h-16 bg-indigo-600 text-white lg:justify-end lg:rounded-b-sm lg:rounded-t-none ">
      <div className="hidden mr-auto ml-10 lg:flex lg:items-center lg:gap-3">
        <FontAwesomeIcon icon={faBook} className="w-10 h-10" />
        <span>Your books in save hands!</span>
      </div>
      <ul className="flex flex-row justify-around w-full lg:w-4/6">
        <NavigationLink
          userRoles={currentUser?.roles}
          allowedRoles={[Role.SysAdmin, Role.Admin]}
          to="/schools"
          icon={faSchool}
          text="Schulen"
        />
        <NavigationLink
          userRoles={currentUser?.roles}
          allowedRoles={[Role.User, Role.Superuser, Role.Admin, Role.SysAdmin]}
          to="/books"
          icon={faBookOpen}
          text="Bücher"
        />
        <NavigationLink
          userRoles={currentUser?.roles}
          allowedRoles={[Role.User, Role.Superuser, Role.Admin, Role.SysAdmin]}
          to="/storages"
          icon={faWarehouse}
          text="Lager"
        />
        <NavigationLink
          userRoles={currentUser?.roles}
          allowedRoles={[Role.User, Role.Superuser, Role.Admin, Role.SysAdmin]}
          to="/classes"
          icon={faGraduationCap}
          text="Klassen"
        />
        <NavigationLink
          userRoles={currentUser?.roles}
          allowedRoles={[Role.SysAdmin, Role.Admin]}
          to="/users"
          icon={faUsers}
          text="Benutzer"
        />
        <NavigationLink
          userRoles={currentUser?.roles}
          allowedRoles={[Role.User, Role.Superuser, Role.Admin, Role.SysAdmin]}
          to={`/users/${currentUser?.id}`}
          icon={faUser}
          text={currentUser?.username}
        />
        <li>
          <button onClick={() => logoutMutation.mutate()}>
            <FontAwesomeIcon icon={faPowerOff} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
