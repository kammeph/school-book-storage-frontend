import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import useSchoolClassesApi, { SchoolClass, SCHOOL_CLASSES } from '../api/schoolclasses';
import { Role, User } from '../api/users';
import DeleteDialog from '../components/DeleteDialog';
import RequireAuth from '../components/RequireAuth';
import SchoolClassEditDialog from '../components/SchoolClassEditDialog';

const SchoolClasses: React.FC<{ currentUser?: User }> = ({ currentUser }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSchoolClass, setSelectedSchoolClass] = useState<SchoolClass>();
  const { getSchoolClasses, deleteSchoolClass } = useSchoolClassesApi();
  const queryClient = useQueryClient();
  const { data } = useQuery([SCHOOL_CLASSES], getSchoolClasses);
  const { mutate: deleteSelectedSchoolClass } = useMutation(deleteSchoolClass, {
    onSuccess: () => {
      queryClient.invalidateQueries([SCHOOL_CLASSES]);
      setSelectedSchoolClass(undefined);
    }
  });

  const onOpenEditDialog = (schoolClass: SchoolClass) => {
    setSelectedSchoolClass(schoolClass);
    setEditDialogOpen(true);
  };

  const onCloseEditDialog = () => {
    setSelectedSchoolClass(undefined);
    setEditDialogOpen(false);
  };

  return (
    <>
      {selectedSchoolClass && (
        <SchoolClassEditDialog
          isOpen={editDialogOpen}
          initialSchoolClass={selectedSchoolClass}
          onClose={onCloseEditDialog}
        />
      )}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        title="Delete schoolClass"
        message="Are you sure that you want to delete the selected school class?"
        onDelete={() => {
          selectedSchoolClass?.id && deleteSelectedSchoolClass(selectedSchoolClass?.id);
          setDeleteDialogOpen(false);
        }}
        onClose={() => setDeleteDialogOpen(false)}
      />
      <div className="w-full h-full p-5 overflow-auto">
        <div className="flex justify-between items-center mb-4 px-2">
          <h1 className="h1">Klassen</h1>
          <RequireAuth
            userRoles={currentUser?.roles}
            allowedRoles={[Role.SysAdmin, Role.Admin, Role.Superuser]}
            element={
              <button
                className="btn-fab"
                onClick={() =>
                  onOpenEditDialog({
                    grade: 0,
                    letter: '',
                    numberOfPupils: 0,
                    dateFrom: new Date().toISOString(),
                    dateTo: new Date().toISOString()
                  })
                }
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            }
          />
        </div>
        {data?.schoolClasses?.map(schoolClass => (
          <div key={schoolClass.id} className="card my-2">
            <div className="flex flex-row items-center justify-between">
              <div>
                <p className="font-semibold text-xl">{`${schoolClass.grade}${schoolClass.letter}`}</p>
                <p>{`${new Date(schoolClass.dateFrom).getFullYear()} - ${new Date(
                  schoolClass.dateTo
                ).getFullYear()}`}</p>
              </div>
              <div className="flex gap-1">
                <RequireAuth
                  userRoles={currentUser?.roles}
                  allowedRoles={[Role.SysAdmin, Role.Admin, Role.Superuser]}
                  element={
                    <button className="btn-fab" onClick={() => onOpenEditDialog(schoolClass)}>
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
                        setSelectedSchoolClass(schoolClass);
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

export default SchoolClasses;
