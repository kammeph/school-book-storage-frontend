import { faCancel, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DialogBase from './DialogBase';

const DeleteDialog: React.FC<{
  isOpen: boolean;
  title?: string;
  message: string;
  onDelete: () => any;
  onClose: () => any;
}> = ({ isOpen, title, message, onDelete, onClose }) => {
  return (
    <DialogBase isOpen={isOpen} title={title} onClose={onClose}>
      <p>{message}</p>
      <div className="flex justify-between">
        <button type="button" className="btn-secondary flex items-center justify-center gap-2 w-32" onClick={onClose}>
          <FontAwesomeIcon icon={faCancel} />
          Cancel
        </button>
        <button className="btn-accent flex items-center justify-center gap-2 w-32" onClick={onDelete}>
          <FontAwesomeIcon icon={faTrash} />
          Delete
        </button>
      </div>
    </DialogBase>
  );
};

export default DeleteDialog;
