import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faPen } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useSchoolsApi, { School } from '../api/schools';
import SchoolEditDialog from '../components/SchoolEditDialog';
import DeleteDialog from '../components/DeleteDialog';
import { Role, User } from '../api/users';
import RequireAuth from '../components/RequireAuth';

const SCHOOLS = 'schools';

const Schools: React.FC<{ currentUser?: User }> = ({ currentUser }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [editSchool, setEditSchool] = useState<School>({ name: '' });
  const { getSchools, deleteSchool } = useSchoolsApi();
  const queryClient = useQueryClient();
  const { data } = useQuery([SCHOOLS], getSchools);

  const deleteSchoolMutation = useMutation(deleteSchool, {
    onSuccess: () => queryClient.invalidateQueries([SCHOOLS])
  });

  return (
    <>
      <SchoolEditDialog isOpen={editDialogOpen} school={editSchool} onClose={() => setEditDialogOpen(false)} />
      <DeleteDialog
        isOpen={deleteDialogOpen}
        title="Delete school"
        message="Are you sure that you want to delete the selected school?"
        onDelete={() => {
          deleteSchoolMutation.mutate(deleteId);
          setDeleteDialogOpen(false);
        }}
        onClose={() => setDeleteDialogOpen(false)}
      />
      <div className="w-full h-full p-5 overflow-auto">
        <div className="flex justify-between items-center mb-4 px-2">
          <h1 className="h1">Schulen</h1>
          <RequireAuth
            userRoles={currentUser?.roles}
            allowedRoles={[Role.SysAdmin]}
            element={
              <button
                className="btn-fab"
                onClick={() => {
                  setEditSchool({ name: '' });
                  setEditDialogOpen(true);
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            }
          />
        </div>
        {data?.schools?.map(school => (
          <div key={school.id} className="card my-2">
            <div className="flex flex-row items-center justify-between">
              <p className="font-semibold font-accent">{school.name}</p>
              <div className="grid grid-flow-col gap-1">
                <button
                  className="btn-fab"
                  onClick={() => {
                    setEditSchool(school);
                    setEditDialogOpen(true);
                  }}
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button
                  className="btn-fab"
                  onClick={() => {
                    school?.id && setDeleteId(school.id);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Schools;
