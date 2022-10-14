import { faCancel, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { FormEvent, useCallback, useState } from 'react';
import useBooksApi, { Book, BOOKS, Subject } from '../api/books';
import { HttpResponse } from '../api/types';
import DialogBase from './DialogBase';
import PrimitiveSelect from './PrimitiveSelect';
const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const BookEditDialog: React.FC<{ isOpen: boolean; book: Book; onClose: () => any }> = ({ isOpen, book, onClose }) => {
  const [editBook, setEditBook] = useState(book);
  const [error, setError] = useState<string>();
  const canSave = useCallback(
    () => !!editBook.isbn && !!editBook.name && !!editBook.subject && editBook.grades?.length > 0,
    [editBook.isbn, editBook.name, editBook.subject, editBook.grades?.length]
  );
  const onSuccess = (data: HttpResponse) => {
    if (data.error) {
      setError(error);
      return;
    }
    queryClient.invalidateQueries([BOOKS]);
    onClose();
  };

  const { addBook, updateBook } = useBooksApi();
  const queryClient = useQueryClient();
  const { mutate: add } = useMutation(addBook, { onSuccess });
  const { mutate: update } = useMutation(updateBook, { onSuccess });

  const onSave = (e: FormEvent) => {
    e.preventDefault();
    if (book?.id) {
      update(editBook);
    } else {
      add(editBook);
    }
  };
  return (
    <DialogBase isOpen={isOpen} onClose={onClose} title="Enter book data">
      {error && <p className="text-red">{error}</p>}
      <form onSubmit={onSave}>
        <label htmlFor="isbn">ISBN</label>
        <input
          id="isbn"
          className="input w-full"
          type="text"
          value={editBook.isbn}
          onChange={e => setEditBook({ ...editBook, isbn: e.target.value })}
        />

        <label htmlFor="name">Name</label>
        <input
          id="name"
          className="input w-full"
          type="text"
          value={editBook.name}
          onChange={e => setEditBook({ ...editBook, name: e.target.value })}
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          className="input w-full"
          value={editBook.description ?? ''}
          onChange={e => setEditBook({ ...editBook, description: e.target.value })}
        />

        <label>Grades</label>
        <PrimitiveSelect
          value={editBook?.grades}
          options={grades}
          multiple={true}
          onChange={grades => setEditBook({ ...editBook, grades })}
        />

        <label>Price</label>
        <input
          className="input w-full"
          type="number"
          value={editBook.price ?? 0.0}
          onChange={e => setEditBook({ ...editBook, price: Number(e.target.value) })}
        />

        <label>Subject</label>
        <PrimitiveSelect
          value={editBook.subject}
          options={Object.values(Subject)}
          onChange={subject => setEditBook({ ...editBook, subject })}
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

export default BookEditDialog;
