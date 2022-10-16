import { faCancel, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { FormEvent, useCallback, useState } from 'react';
import useStoragesApi, { Storage, STORAGES } from '../api/storages';
import { HttpResponse } from '../api/types';
import DialogBase from './DialogBase';

const StorageEditDialog: React.FC<{ isOpen: boolean; initialStorage: Storage; onClose: () => any }> = ({
  isOpen,
  initialStorage,
  onClose
}) => {
  const [storage, setStorage] = useState(initialStorage);
  const [error, setError] = useState<string>();
  const canSave = useCallback(() => !!storage.name && !!storage.location, [storage.name, storage.location]);
  const onSuccess = (data: HttpResponse) => {
    if (data.error) {
      setError(error);
      return;
    }
    queryClient.invalidateQueries([STORAGES]);
    onClose();
  };

  const { addStorage, updateStorage } = useStoragesApi();
  const queryClient = useQueryClient();
  const { mutate: add } = useMutation(addStorage, { onSuccess });
  const { mutate: update } = useMutation(updateStorage, { onSuccess });

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    if (initialStorage?.id) {
      update(storage);
    } else {
      add(storage);
    }
  };
  return (
    <DialogBase isOpen={isOpen} onClose={onClose} title="Enter storage data">
      {error && <p className="text-red">{error}</p>}
      <form onSubmit={onSave}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          className="input w-full"
          type="text"
          value={storage.name}
          onChange={e => setStorage({ ...storage, name: e.target.value })}
        />

        <label htmlFor="location">Location</label>
        <input
          id="location"
          className="input w-full"
          type="text"
          value={storage.location}
          onChange={e => setStorage({ ...storage, location: e.target.value })}
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

export default StorageEditDialog;
