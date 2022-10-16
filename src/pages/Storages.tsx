import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import useStoragesApi, { Storage, STORAGES } from '../api/storages';
import { Role, User } from '../api/users';
import DeleteDialog from '../components/DeleteDialog';
import RequireAuth from '../components/RequireAuth';
import StorageEditDialog from '../components/StorageEditDialog';

const Storages: React.FC<{ currentUser?: User }> = ({ currentUser }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState<Storage>();
  const { getStorages, deleteStorage } = useStoragesApi();
  const queryClient = useQueryClient();
  const { data } = useQuery([STORAGES], getStorages);
  const { mutate: deleteSelectedStorage } = useMutation(deleteStorage, {
    onSuccess: () => queryClient.invalidateQueries([STORAGES])
  });
  const onOpenEditDialog = (storage: Storage) => {
    setSelectedStorage(storage);
    setEditDialogOpen(true);
  };
  const onCloseEditDialog = () => {
    setSelectedStorage(undefined);
    setEditDialogOpen(false);
  };
  return (
    <>
      {selectedStorage && (
        <StorageEditDialog isOpen={editDialogOpen} initialStorage={selectedStorage} onClose={onCloseEditDialog} />
      )}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        title="Delete storage"
        message="Are you sure that you want to delete the selected storage?"
        onDelete={() => {
          selectedStorage?.id && deleteSelectedStorage(selectedStorage?.id);
          setDeleteDialogOpen(false);
        }}
        onClose={() => setDeleteDialogOpen(false)}
      />
      <div className="w-full h-full p-5 overflow-auto">
        <div className="flex justify-between items-center mb-4 px-2">
          <h1 className="h1">Lager</h1>
          <RequireAuth
            userRoles={currentUser?.roles}
            allowedRoles={[Role.SysAdmin, Role.Admin, Role.Superuser]}
            element={
              <button className="btn-fab" onClick={() => onOpenEditDialog({ name: '', location: '' })}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            }
          />
        </div>
        {data?.storages?.map(storage => (
          <div key={storage.id} className="card my-2">
            <div className="flex flex-row items-center justify-between">
              <div>
                <p className="font-semibold text-xl">{storage.name}</p>
                <p>{storage.location}</p>
              </div>
              <div className="flex gap-1">
                <RequireAuth
                  userRoles={currentUser?.roles}
                  allowedRoles={[Role.SysAdmin, Role.Admin, Role.Superuser]}
                  element={
                    <button className="btn-fab" onClick={() => onOpenEditDialog(storage)}>
                      <FontAwesomeIcon icon={faPen} />
                    </button>
                  }
                />
                <RequireAuth
                  userRoles={currentUser?.roles}
                  allowedRoles={[Role.SysAdmin, Role.Admin]}
                  element={
                    <button
                      className="btn-fab"
                      onClick={() => {
                        setSelectedStorage(storage);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Storages;
