import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Link } from 'react-router-dom';
import { Role } from '../api/users';

const NavigationLink: React.FC<{ userRoles?: Role[]; allowedRoles: Role[]; text?: string; to: string; icon: any }> = ({
  userRoles,
  allowedRoles,
  text,
  to,
  icon
}) => {
  return userRoles?.some(r => allowedRoles.includes(r)) ? (
    <li>
      <Link className="flex gap-1 items-center" to={to}>
        <FontAwesomeIcon icon={icon} />
        <b className="invisible w-0 lg:w-auto lg:visible">{text}</b>
      </Link>
    </li>
  ) : (
    <></>
  );
};

export default NavigationLink;
