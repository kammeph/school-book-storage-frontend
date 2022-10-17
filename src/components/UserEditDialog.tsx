import { faCancel, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { FormEvent, useState } from 'react';
import { HttpResponse } from '../api/types';
import useUsersApi, { Locale, ME, Role, User, USERS } from '../api/users';
import DialogBase from './DialogBase';
import PrimitiveSelect from './PrimitiveSelect';
import RequireAuth from './RequireAuth';
import SchoolSelect from './SchoolSelect';

const UserEditDialog: React.FC<{ isOpen: boolean; initialUser: User; currentUser: User; onClose: () => any }> = ({
  isOpen,
  initialUser,
  currentUser,
  onClose
}) => {
  const [user, setUser] = useState(initialUser);
  const [error, setError] = useState<string>();
  const onSuccess = (data: HttpResponse) => {
    if (data.error) {
      setError(error);
      return;
    }
    queryClient.invalidateQueries([USERS]);
    if (user?.id === currentUser.id) queryClient.invalidateQueries([ME]);
    onClose();
  };

  const { updateUser } = useUsersApi();
  const queryClient = useQueryClient();
  const { mutate: update } = useMutation(updateUser, { onSuccess });

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    if (user?.id) {
      update(user);
    }
  };
  return (
    <DialogBase isOpen={isOpen} onClose={onClose} title="Enter user data">
      {error && <p className="text-red">{error}</p>}
      <form onSubmit={onSave}>
        <label htmlFor="name">Username</label>
        <input
          id="name"
          className="input w-full"
          type="text"
          value={user.username}
          onChange={e =>
            setUser(prev => {
              return { ...prev, username: e.target.value };
            })
          }
        />

        <label>School</label>
        <RequireAuth
          userRoles={currentUser?.roles}
          allowedRoles={[Role.SysAdmin]}
          element={<SchoolSelect schoolId={user?.schoolId} onChange={schoolId => setUser({ ...user, schoolId })} />}
        />

        <label>Roles</label>
        <RequireAuth
          userRoles={currentUser?.roles}
          allowedRoles={[Role.SysAdmin]}
          element={
            <PrimitiveSelect
              value={user?.roles}
              options={Object.values(Role)}
              multiple={true}
              onChange={roles => setUser({ ...user, roles })}
            />
          }
        />

        <label>Locale</label>
        <PrimitiveSelect
          value={user?.locale}
          options={Object.values(Locale)}
          onChange={locale => setUser({ ...user, locale })}
        />

        <div className="flex justify-between">
          <button type="button" className="btn-secondary flex items-center justify-center gap-2 w-32" onClick={onClose}>
            <FontAwesomeIcon icon={faCancel} />
            Cancel
          </button>
          <button className="btn flex items-center justify-center gap-2 w-32" disabled={!user?.username}>
            <FontAwesomeIcon icon={faSave} />
            Save
          </button>
        </div>
      </form>
    </DialogBase>
  );
};

export default UserEditDialog;
