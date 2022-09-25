import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Link } from 'react-router-dom';
import useUsersApi, { Role } from '../api/users';

const NavigationLink: React.FC<{ allowedRoles: Role[]; text?: string; to: string; icon: any }> = ({
  allowedRoles,
  text,
  to,
  icon
}) => {
  const { getMe } = useUsersApi();
  const { data } = useQuery(['me'], getMe);
  return data?.user?.roles.some(r => allowedRoles.includes(r)) ? (
    <li>
      <Link className="flex gap-1 items-center font-accent" to={to}>
        <FontAwesomeIcon icon={icon} />
        <b className="invisible w-0 lg:w-auto lg:visible">{text}</b>
      </Link>
    </li>
  ) : (
    <></>
  );
};

export default NavigationLink;
