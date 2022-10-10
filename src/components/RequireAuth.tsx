import { Role } from '../api/users';

const RequireAuth: React.FC<{ userRoles?: Role[]; allowedRoles: Role[]; element: JSX.Element }> = ({
  userRoles,
  allowedRoles,
  element
}) => {
  return userRoles?.some(r => allowedRoles.includes(r)) ? element : <></>;
};

export default RequireAuth;
