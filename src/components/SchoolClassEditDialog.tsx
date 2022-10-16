import { faCancel, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import useSchoolClassesApi, { SchoolClass, SCHOOL_CLASSES } from '../api/schoolclasses';
import { HttpResponse } from '../api/types';
import DialogBase from './DialogBase';

const SchoolClassEditDialog: React.FC<{ isOpen: boolean; initialSchoolClass: SchoolClass; onClose: () => any }> = ({
  isOpen,
  initialSchoolClass: initialSchoolClass,
  onClose
}) => {
  console.log(typeof initialSchoolClass.dateFrom);
  const [schoolClass, setSchoolClass] = useState(initialSchoolClass);
  const [error, setError] = useState<string>();
  const canSave = useCallback(
    () =>
      !!schoolClass.grade &&
      !!schoolClass.letter &&
      !!schoolClass.numberOfPupils &&
      !!schoolClass.dateFrom &&
      !!schoolClass.dateTo,
    [schoolClass.grade, schoolClass.letter && schoolClass.numberOfPupils && schoolClass.dateFrom && schoolClass.dateTo]
  );
  const onSuccess = (data: HttpResponse) => {
    if (data.error) {
      setError(error);
      return;
    }
    queryClient.invalidateQueries([SCHOOL_CLASSES]);
    onClose();
  };

  const { addSchoolClass, updateSchoolClass } = useSchoolClassesApi();
  const queryClient = useQueryClient();
  const { mutate: add } = useMutation(addSchoolClass, { onSuccess });
  const { mutate: update } = useMutation(updateSchoolClass, { onSuccess });

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    if (initialSchoolClass?.id) {
      update(schoolClass);
    } else {
      add(schoolClass);
    }
  };

  const onDateFromChange = (e: ChangeEvent<HTMLInputElement>) => {
    const dateFrom = new Date(e.target.value);
    const dateTo = new Date(e.target.value);
    dateTo.setFullYear(dateFrom.getFullYear() + 1);
    dateTo.setDate(dateFrom.getDate() - 1);
    setSchoolClass({ ...schoolClass, dateFrom: dateFrom.toISOString(), dateTo: dateTo.toISOString() });
  };

  return (
    <DialogBase isOpen={isOpen} onClose={onClose} title="Enter school class data">
      {error && <p className="text-red">{error}</p>}
      <form onSubmit={onSave}>
        <label htmlFor="grade">Name</label>
        <input
          id="grade"
          className="input w-full"
          type="number"
          value={schoolClass.grade}
          onChange={e => setSchoolClass({ ...schoolClass, grade: Number(e.target.value) })}
        />

        <label htmlFor="letter">Location</label>
        <input
          id="letter"
          className="input w-full"
          type="text"
          value={schoolClass.letter}
          onChange={e => setSchoolClass({ ...schoolClass, letter: e.target.value })}
        />

        <label htmlFor="numberOfPupils">Number of pupils</label>
        <input
          id="numberOfPupils"
          className="input w-full"
          type="number"
          value={schoolClass.numberOfPupils}
          onChange={e => setSchoolClass({ ...schoolClass, numberOfPupils: Number(e.target.value) })}
        />

        <label htmlFor="dateFrom">Date from</label>
        <input
          id="dateFrom"
          className="input w-full pr-2"
          type="date"
          value={(schoolClass.dateFrom ?? new Date().toISOString())?.split('T')?.[0]}
          onChange={onDateFromChange}
        />

        <label htmlFor="dateTo">Date to</label>
        <input
          id="dateTo"
          className="input w-full pr-2"
          type="date"
          value={(schoolClass.dateTo ?? new Date().toISOString()).split('T')?.[0]}
          onChange={e => setSchoolClass({ ...schoolClass, dateTo: new Date(e.target.value).toISOString() })}
        />

        <div className="flex justify-between">
          <button type="button" className="btn-secondary flex items-center justify-center gap-2 w-32" onClick={onClose}>
            <FontAwesomeIcon icon={faCancel} />
            Cancel
          </button>
          <button className="btn flex items-center justify-center gap-2 w-32" disabled={!canSave()}>
            <FontAwesomeIcon icon={faSave} />
            Save
          </button>
        </div>
      </form>
    </DialogBase>
  );
};

export default SchoolClassEditDialog;
