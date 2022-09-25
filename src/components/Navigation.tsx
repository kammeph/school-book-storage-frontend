import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBookOpen,
  faUsers,
  faWarehouse,
  faSchool,
  faGraduationCap,
  faPowerOff,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useUsersApi, { Role } from '../api/users';
import useAuthApi from '../api/auth';
import NavigationLink from './NavigationLink';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const { getMe } = useUsersApi();
  const { logout } = useAuthApi();
  const queryClient = useQueryClient();
  const { data } = useQuery(['me'], getMe);
  const navigate = useNavigate();

  const logoutMutation = useMutation(async () => await logout(), {
    onSuccess: data => {
      if (!data?.error) {
        queryClient.clear();
        navigate('/login');
      }
    }
  });

  return (
    <nav className="flex items-center sticky rounded-t-sm w-full h-16 bg-indigo-600 text-white lg:justify-end lg:rounded-b-sm lg:rounded-t-none ">
      <ul className="flex flex-row justify-around w-full lg:w-4/6">
        <NavigationLink allowedRoles={[Role.SysAdmin]} to="/schools" icon={faSchool} text="Schulen" />
        <NavigationLink
          allowedRoles={[Role.User, Role.Superuser, Role.Admin, Role.SysAdmin]}
          to="/books"
          icon={faBookOpen}
          text="Bücher"
        />
        <NavigationLink
          allowedRoles={[Role.User, Role.Superuser, Role.Admin, Role.SysAdmin]}
          to="/storages"
          icon={faWarehouse}
          text="Lager"
        />
        <NavigationLink
          allowedRoles={[Role.User, Role.Superuser, Role.Admin, Role.SysAdmin]}
          to="/classes"
          icon={faGraduationCap}
          text="Klassen"
        />
        <NavigationLink allowedRoles={[Role.SysAdmin, Role.Admin]} to="/users" icon={faUsers} text="Benutzer" />
        <NavigationLink
          allowedRoles={[Role.User, Role.Superuser, Role.Admin, Role.SysAdmin]}
          to={`/users/${data?.user?.id}`}
          icon={faUser}
          text={data?.user?.username}
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
