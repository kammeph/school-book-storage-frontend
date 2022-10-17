import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useUsersApi, { User, USERS } from '../api/users';
import { useState } from 'react';
import DeleteDialog from '../components/DeleteDialog';
import UserEditDialog from '../components/UserEditDialog';

const Users: React.FC<{ currentUser?: User }> = ({ currentUser }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>();
  const { getUsers, deleteUser } = useUsersApi();
  const queryClient = useQueryClient();
  const { data } = useQuery([USERS], getUsers);
  const { mutate } = useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries([USERS]);
      setSelectedUser(undefined);
    }
  });

  const onOpenEditDialog = (user: User) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const onCloseEditDialog = () => {
    setSelectedUser(undefined);
    setEditDialogOpen(false);
  };

  return (
    <>
      {selectedUser && currentUser && (
        <UserEditDialog
          isOpen={editDialogOpen}
          initialUser={selectedUser}
          currentUser={currentUser}
          onClose={onCloseEditDialog}
        />
      )}
      {selectedUser && (
        <DeleteDialog
          isOpen={deleteDialogOpen}
          title="Delete user"
          message="Are you sure that you want to delete the selected user?"
          onDelete={() => {
            selectedUser?.id && mutate(selectedUser.id);
            setDeleteDialogOpen(false);
          }}
          onClose={() => setDeleteDialogOpen(false)}
        />
      )}
      <div className="w-full h-full p-5 overflow-auto">
        <h1 className="h1 mb-4">Benutzer</h1>
        <p>{data?.error}</p>
        {data?.users?.map(user => (
          <div key={user.id} className={`card my-2 flex items-center justify-between`}>
            <p className="font-semibold text-xl">{user?.username}</p>
            <div className="flex gap-1">
              <button className="btn-fab" onClick={() => onOpenEditDialog(user)}>
                <FontAwesomeIcon icon={faPen} />
              </button>
              <button
                className="btn-fab"
                onClick={() => {
                  setSelectedUser(user);
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
