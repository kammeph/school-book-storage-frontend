import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import useBooksApi, { Book, BOOKS } from '../api/books';
import { Role, User } from '../api/users';
import BookEditDialog from '../components/BookEditDialog';
import DeleteDialog from '../components/DeleteDialog';
import RequireAuth from '../components/RequireAuth';

const Books: React.FC<{ currentUser?: User }> = ({ currentUser }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book>();
  const { getBooks, deleteBook } = useBooksApi();
  const queryClient = useQueryClient();
  const { data } = useQuery([BOOKS], getBooks);
  const { mutate: deleteSelectedBook } = useMutation(deleteBook, {
    onSuccess: () => {
      queryClient.invalidateQueries([BOOKS]);
      setSelectedBook(undefined);
    }
  });

  const onOpenEditDialog = (book: Book) => {
    setSelectedBook(book);
    setEditDialogOpen(true);
  };

  const onCloseEditDialog = () => {
    setSelectedBook(undefined);
    setEditDialogOpen(false);
  };

  return (
    <>
      {selectedBook && (
        <BookEditDialog isOpen={editDialogOpen} initialBook={selectedBook} onClose={onCloseEditDialog} />
      )}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        title="Delete book"
        message="Are you sure that you want to delete the selected book?"
        onDelete={() => {
          selectedBook?.id && deleteSelectedBook(selectedBook?.id);
          setDeleteDialogOpen(false);
        }}
        onClose={() => setDeleteDialogOpen(false)}
      />
      <div className="w-full h-full p-5 overflow-auto">
        <div className="flex justify-between items-center mb-4 px-2">
          <h1 className="h1">Bücher</h1>
          <RequireAuth
            userRoles={currentUser?.roles}
            allowedRoles={[Role.SysAdmin, Role.Admin, Role.Superuser]}
            element={
              <button className="btn-fab" onClick={() => onOpenEditDialog({ isbn: '', name: '', grades: [] })}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            }
          />
        </div>
        {data?.books?.map(book => (
          <div key={book.id} className="card my-2">
            <div className="flex flex-row items-center justify-between">
              <div>
                <p className="font-semibold text-xl">{book.name}</p>
                {/* <p>{`ISBN: ${book.isbn}`}</p> */}
                <p>{`${book.subject} - ${book.grades.join(', ')} class`}</p>
              </div>
              <div className="flex gap-1">
                <RequireAuth
                  userRoles={currentUser?.roles}
                  allowedRoles={[Role.SysAdmin, Role.Admin, Role.Superuser]}
                  element={
                    <button className="btn-fab" onClick={() => onOpenEditDialog(book)}>
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
                        setSelectedBook(book);
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

export default Books;
