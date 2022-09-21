import { useEffect, useRef, useState } from 'react';
import Card from '../components/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faSave, faCancel, faPen } from '@fortawesome/free-solid-svg-icons';
import { FabButton } from '../components/Button';
import Input, { UnderlineInput } from '../components/Input';
import H1 from '../components/Headers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useSchoolsApi from '../api/schools';

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

  useEffect(() => {
    console.log(data?.error);
  }, [data?.error]);

  return (
    <div className="w-full p-5">
      <H1>Schulen</H1>
      <p>{data?.error}</p>
      <form className="flex gap-1" onSubmit={addSchoolMutation.mutate}>
        <Input
          className="grow"
          type="text"
          placeholder="School name"
          value={addSchoolName}
          onChange={e => setAddSchoolName(e.target.value)}
        />
        <FabButton>
          <FontAwesomeIcon icon={faPlus} />
        </FabButton>
      </form>
      {data?.schools?.map(school => (
        <Card key={school.id} className="my-2">
          <div className="flex flex-row items-center justify-between">
            {editSchoolId !== school.id && (
              <>
                <p>{school.name}</p>
                <div className="grid grid-flow-col gap-1">
                  <FabButton onClick={() => handleEditMode(school.id, school.name)}>
                    <FontAwesomeIcon icon={faPen} />
                  </FabButton>
                  <FabButton onClick={() => deleteSchoolMutation.mutate(school.id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </FabButton>
                </div>
              </>
            )}
          </div>
          {editSchoolId === school.id && (
            <form className="flex flex-row items-center justify-between" onSubmit={updateSchoolMutation.mutate}>
              {editSchoolId === school.id && (
                <UnderlineInput
                  ref={editSchoolNameRef}
                  type="text"
                  value={editSchoolName}
                  onChange={e => setEditSchoolName(e.target.value)}
                />
              )}
              <div className="grid grid-flow-col gap-1">
                <FabButton type="submit">
                  <FontAwesomeIcon icon={faSave} />
                </FabButton>
                <FabButton type="button" onClick={() => handleEditMode()}>
                  <FontAwesomeIcon icon={faCancel} />
                </FabButton>
              </div>
            </form>
          )}
        </Card>
      ))}
    </div>
  );
};

export default Schools;
