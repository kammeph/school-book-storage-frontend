import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SCHOOLS } from '../api/schools';
import useUsersApi, { Locale, ME, Role, User } from '../api/users';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import RequireAuth from '../components/RequireAuth';
import PrimitiveSelect from '../components/PrimitiveSelect';
import SchoolSelect from '../components/SchoolSelect';

const UserEdit: React.FC<{ currentUser?: User }> = ({ currentUser }) => {
  const { id } = useParams();
  const [user, setUser] = useState<User>({ username: '' });
  const { getUserById, updateUser } = useUsersApi();
  const queryClient = useQueryClient();
  const { data } = useQuery([id], () => getUserById(id));
  const { mutate: update } = useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries([id]);
      queryClient.invalidateQueries([SCHOOLS]);
      if (currentUser?.id === id) queryClient.invalidateQueries([ME]);
    }
  });

  useEffect(() => {
    if (!data?.user?.id) return;
    setUser(data.user);
  }, [data?.user?.id]);

  const handleSave = (e: any) => {
    e.preventDefault();
    update(user);
  };

  return (
    <div className="w-full h-full p-5 overflow-auto">
      <div className="flex justify-between item-center px-2">
        <h1 className="h1">Profil</h1>
        <button className="btn-fab" onClick={handleSave}>
          <FontAwesomeIcon icon={faSave} />
        </button>
      </div>
      <br />
      <form className="flex flex-col gap-2">
        <input
          className="input"
          type="text"
          name="username"
          value={user?.username}
          onChange={e => setUser({ ...user, username: e.target.value })}
        />

        <RequireAuth
          userRoles={currentUser?.roles}
          allowedRoles={[Role.SysAdmin]}
          element={<SchoolSelect schoolId={user?.schoolId} onChange={schoolId => setUser({ ...user, schoolId })} />}
        />

        <RequireAuth
          userRoles={currentUser?.roles}
          allowedRoles={[Role.SysAdmin]}
          element={
            <PrimitiveSelect
              value={user?.roles}
              options={Object.values(Role)}
              multiple={true}
              required={true}
              onChange={roles => setUser({ ...user, roles })}
            />
          }
        />

        <PrimitiveSelect
          value={user?.locale}
          options={Object.values(Locale)}
          onChange={locale => setUser({ ...user, locale })}
        />
      </form>
    </div>
  );
};

export default UserEdit;
