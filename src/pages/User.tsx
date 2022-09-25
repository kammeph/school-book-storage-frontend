import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import useUsersApi from '../api/users';
import { headers } from '../styles';

const User = () => {
  const { id } = useParams();
  const { getById } = useUsersApi();
  const { data } = useQuery([id], () => getById(id));
  return (
    <div className="w-full h-full p-5 overflow-auto">
      <h1 className={headers.h1}>{data?.user?.username}</h1>
    </div>
  );
};

export default User;
