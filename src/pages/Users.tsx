import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useUsersApi, { USERS } from '../api/users';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import DeleteDialog from '../components/DeleteDialog';

const Users = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState('');
  const { getUsers, deleteUser } = useUsersApi();
  const queryClient = useQueryClient();
  const { data } = useQuery([USERS], getUsers);
  const { mutate } = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries([USERS]);
    }
  });
  return (
    <>
      <DeleteDialog
        isOpen={deleteDialogOpen}
        title="Delete user"
        message="Are you sure that you want to delete the selected user?"
        onDelete={() => {
          mutate(deleteUserId);
          setDeleteDialogOpen(false);
        }}
        onClose={() => setDeleteDialogOpen(false)}
      />
      <div className="w-full h-full p-5 overflow-auto">
        <h1 className="h1 mb-4">Benutzer</h1>
        <p>{data?.error}</p>
        {data?.users?.map(user => (
          <div key={user.id} className={`card my-2 flex items-center justify-between`}>
            <p className="font-semibold text-xl">{user?.username}</p>
            <div className="flex gap-1">
              <Link to={`${user.id}`}>
                <button className="btn-fab">
                  <FontAwesomeIcon icon={faPen} />
                </button>
              </Link>
              <button
                className="btn-fab"
                onClick={() => {
                  user?.id && setDeleteUserId(user.id);
                  setDeleteDialogOpen(true);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Users;
