import { faCancel, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import useSchoolsApi, { School, SCHOOLS } from '../api/schools';
import { HttpResponse } from '../api/types';
import DialogBase from './DialogBase';

const SchoolEditDialog: React.FC<{
  isOpen: boolean;
  school: School;
  onClose: () => any;
}> = ({ isOpen, school, onClose }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string>();

  const onSuccess = (data: HttpResponse) => {
    if (data.error) {
      setError(error);
      return;
    }
    queryClient.invalidateQueries([SCHOOLS]);
    onClose();
  };

  const { addSchool, updateSchool } = useSchoolsApi();
  const queryClient = useQueryClient();
  const { mutate: add } = useMutation(addSchool, { onSuccess });
  const { mutate: update } = useMutation(updateSchool, { onSuccess });

  useEffect(() => {
    setName(school?.name);
  }, [school.id]);

  const onSave = (e: any) => {
    e.preventDefault();
    if (school?.id) {
      update({ id: school.id, name });
    } else {
      add(name);
    }
    onClose();
  };

  return (
    <DialogBase isOpen={isOpen} onClose={onClose} title="Enter school name">
      {error && <p className="text-red">{error}</p>}
      <form onSubmit={onSave}>
        <input className="input w-full" type="text" value={name} onChange={e => setName(e.target.value)} />
        <div className="flex justify-between">
          <button type="button" className="btn-secondary flex items-center justify-center gap-2 w-32" onClick={onClose}>
            <FontAwesomeIcon icon={faCancel} />
            Cancel
          </button>
          <button className="btn flex items-center justify-center gap-2 w-32" disabled={!name}>
            <FontAwesomeIcon icon={faSave} />
            Save
          </button>
        </div>
      </form>
    </DialogBase>
  );
};

export default SchoolEditDialog;
