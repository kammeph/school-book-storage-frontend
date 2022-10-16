import { faCancel, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { FormEvent, useCallback, useState } from 'react';
import useBooksApi, { Book, BOOKS, Subject } from '../api/books';
import { HttpResponse } from '../api/types';
import DialogBase from './DialogBase';
import PrimitiveSelect from './PrimitiveSelect';

const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const BookEditDialog: React.FC<{ isOpen: boolean; initialBook: Book; onClose: () => any }> = ({
  isOpen,
  initialBook,
  onClose
}) => {
  const [book, setBook] = useState(initialBook);
  const [error, setError] = useState<string>();
  const canSave = useCallback(
    () => !!book.isbn && !!book.name && !!book.subject && book.grades?.length > 0,
    [book.isbn, book.name, book.subject, book.grades?.length]
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
    if (initialBook?.id) {
      update(book);
    } else {
      add(book);
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
          value={book.isbn}
          onChange={e => setBook({ ...book, isbn: e.target.value })}
        />

        <label htmlFor="name">Name</label>
        <input
          id="name"
          className="input w-full"
          type="text"
          value={book.name}
          onChange={e => setBook({ ...book, name: e.target.value })}
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          className="input w-full"
          value={book.description ?? ''}
          onChange={e => setBook({ ...book, description: e.target.value })}
        />

        <label>Grades</label>
        <PrimitiveSelect
          value={book?.grades}
          options={grades}
          multiple={true}
          onChange={grades => setBook({ ...book, grades })}
        />

        <label>Price</label>
        <input
          className="input w-full"
          type="number"
          value={book.price ?? 0.0}
          onChange={e => setBook({ ...book, price: Number(e.target.value) })}
        />

        <label>Subject</label>
        <PrimitiveSelect
          value={book.subject}
          options={Object.values(Subject)}
          onChange={subject => setBook({ ...book, subject })}
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
