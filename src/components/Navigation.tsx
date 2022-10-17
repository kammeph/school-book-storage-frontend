import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBookOpen, faUsers, faWarehouse, faSchool, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { Role, User } from '../api/users';
import NavigationLink from './NavigationLink';
import UserMenu from './UserMenu';

const Navigation: React.FC<{ currentUser?: User }> = ({ currentUser }) => {
  return (
    <nav className="flex items-center sticky rounded-t-sm w-full h-16 bg-indigo-600 text-white lg:justify-end lg:rounded-b-sm lg:rounded-t-none ">
      <div className="hidden mr-auto ml-10 lg:flex lg:items-center lg:gap-3">
        <FontAwesomeIcon icon={faBook} className="w-10 h-10" />
        <span>Your books in save hands!</span>
      </div>
      <ul className="flex flex-row justify-around items-center w-full lg:w-4/6">
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
        <UserMenu currentUser={currentUser} />
      </ul>
    </nav>
  );
};

export default Navigation;
