import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faSave, faCancel, faPen } from '@fortawesome/free-solid-svg-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useSchoolsApi from '../api/schools';
import { button, card, headers, input } from '../styles';

const SCHOOLS = 'schools';

const Schools = () => {
  const [addSchoolName, setAddSchoolName] = useState('');
  const [editSchoolId, setEditSchoolId] = useState<string | undefined>();
  const [editSchoolName, setEditSchoolName] = useState<string | undefined>();
  const editSchoolNameRef = useRef<HTMLInputElement>(null);

  const { getSchools, addSchool, updateSchool, deleteSchool } = useSchoolsApi();
  const queryClient = useQueryClient();
  const { data } = useQuery([SCHOOLS], getSchools);

  const addSchoolMutation = useMutation(
    async (e: any) => {
      e.preventDefault();
      addSchool(addSchoolName);
      setAddSchoolName('');
    },
    {
      onSuccess: () => queryClient.invalidateQueries([SCHOOLS])
    }
  );

  const updateSchoolMutation = useMutation(
    async (e: any) => {
      e.preventDefault();
      if (editSchoolId && editSchoolName) updateSchool({ id: editSchoolId, name: editSchoolName });
      handleEditMode();
    },
    {
      onSuccess: () => queryClient.invalidateQueries([SCHOOLS])
    }
  );

  const deleteSchoolMutation = useMutation(deleteSchool, {
    onSuccess: () => queryClient.invalidateQueries([SCHOOLS])
  });

  const handleEditMode = (id?: string, name?: string) => {
    setEditSchoolId(id);
    setEditSchoolName(name);
  };

  useEffect(() => {
    if (!!editSchoolId) editSchoolNameRef.current?.focus();
  }, [editSchoolId]);

  return (
    <div className="w-full h-full p-5 overflow-auto">
      <h1 className={headers.h1}>Schulen</h1>
      <p>{data?.error}</p>
      <form className="flex gap-1" onSubmit={addSchoolMutation.mutate}>
        <input
          className={`${input.basic} grow`}
          type="text"
          placeholder="School name"
          value={addSchoolName}
          onChange={e => setAddSchoolName(e.target.value)}
        />
        <button className={button.fab}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </form>
      {data?.schools?.map(school => (
        <div key={school.id} className={`${card} my-2`}>
          <div className="flex flex-row items-center justify-between">
            {editSchoolId !== school.id && (
              <>
                <p>{school.name}</p>
                <div className="grid grid-flow-col gap-1">
                  <button className={button.fab} onClick={() => handleEditMode(school.id, school.name)}>
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button className={button.fab} onClick={() => deleteSchoolMutation.mutate(school.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </>
            )}
          </div>
          {editSchoolId === school.id && (
            <form className="flex flex-row items-center justify-between" onSubmit={updateSchoolMutation.mutate}>
              {editSchoolId === school.id && (
                <input
                  className={input.underlined}
                  ref={editSchoolNameRef}
                  type="text"
                  value={editSchoolName}
                  onChange={e => setEditSchoolName(e.target.value)}
                />
              )}
              <div className="grid grid-flow-col gap-1">
                <button className={button.fab} type="submit">
                  <FontAwesomeIcon icon={faSave} />
                </button>
                <button className={button.fab} type="button" onClick={() => handleEditMode()}>
                  <FontAwesomeIcon icon={faCancel} />
                </button>
              </div>
            </form>
          )}
        </div>
      ))}
    </div>
  );
};

export default Schools;
