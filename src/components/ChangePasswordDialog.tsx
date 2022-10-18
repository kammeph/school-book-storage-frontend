import { faCancel, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { HttpResponse } from '../api/types';
import useUsersApi from '../api/users';
import DialogBase from './DialogBase';

const ChangePasswordDialog: React.FC<{
  isOpen: boolean;
  onClose: () => any;
}> = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatNewPassword, setRepeatNewPassword] = useState('');
  const [error, setError] = useState<string>();

  const onSuccess = (data: HttpResponse) => {
    if (data.error) {
      setError(data.error);
      return;
    }
    onClose();
  };

  const { changePassword } = useUsersApi();
  const { mutate } = useMutation(changePassword, { onSuccess });

  const onSave = (e: any) => {
    e.preventDefault();
    mutate({ oldPassword, newPassword });
  };

  const canSave = useCallback(
    () => !!oldPassword && !!newPassword && newPassword === repeatNewPassword,
    [oldPassword, newPassword, repeatNewPassword]
  );

  const passwordNotEqual = useCallback(
    () => !!newPassword && !!repeatNewPassword && newPassword !== repeatNewPassword,
    [newPassword, repeatNewPassword]
  );

  return (
    <DialogBase isOpen={isOpen} onClose={onClose} title="Enter old and new password">
      {!!error && <p className="text-red-500">{error}</p>}
      <form onSubmit={onSave}>
        <label htmlFor="oldPassword">Old password</label>
        <input
          id="oldPassword"
          className="input w-full"
          type="password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
        />
        <label htmlFor="newPassword">New password</label>
        <input
          id="newPassword"
          className="input w-full"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <label htmlFor="repeatNewPassword">Repeat new password</label>
        <input
          id="newPassrepeatNewPasswordword"
          className="input w-full"
          type="password"
          value={repeatNewPassword}
          onChange={e => setRepeatNewPassword(e.target.value)}
        />
        {passwordNotEqual() && <p className="text-red-500">Passwords are not equal!</p>}

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

export default ChangePasswordDialog;
