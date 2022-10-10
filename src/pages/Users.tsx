import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useQuery } from '@tanstack/react-query';
import useUsersApi, { USERS } from '../api/users';
import { Link } from 'react-router-dom';

const Users = () => {
  const { getUsers } = useUsersApi();
  const { data } = useQuery([USERS], getUsers);
  return (
    <>
      <div className="w-full h-full p-5 overflow-auto">
        <h1 className="h1 mb-4">Benutzer</h1>
        <p>{data?.error}</p>
        {data?.users?.map(user => (
          <div key={user.id} className={`card my-2 flex items-center justify-between`}>
            <p>{user?.username}</p>
            <Link to={`${user.id}`}>
              <button className="btn-fab">
                <FontAwesomeIcon icon={faPen} />
              </button>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default Users;
