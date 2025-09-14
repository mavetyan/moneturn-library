import React, { useEffect, useState, useCallback } from "react";
import { eventBus } from "../utils/eventBus";
import type { Book, Author } from "../types";
import { apiService } from "../services/api";

const BookList: React.FC<{
  authors: Author[];
  refreshAuthors: () => void;
}> = ({ authors, refreshAuthors }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editAuthorId, setEditAuthorId] = useState("");

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getBooks();
      setBooks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]); // Initial load

  useEffect(() => {
    const handleAuthorUpdate = () => {
      fetchBooks();
    };

    eventBus.on('authorUpdated', handleAuthorUpdate);
    
    return () => {
      eventBus.off('authorUpdated', handleAuthorUpdate);
    };
  }, [fetchBooks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiService.createBook(title, Number(authorId));
      setTitle("");
      setAuthorId("");
      fetchBooks();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await apiService.deleteBook(id);
      fetchBooks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const startEdit = (book: Book) => {
    setEditId(book.id);
    setEditTitle(book.title);
    setEditAuthorId(book.author.id.toString());
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
    setEditAuthorId("");
  };

  const handleEditSave = async (id: number) => {
    try {
      await apiService.updateBook(id, editTitle, Number(editAuthorId));
      fetchBooks();
      cancelEdit();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div>Loading books...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-700 text-center drop-shadow">Books</h2>
      <form onSubmit={handleSubmit} className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-center bg-white p-4 rounded-lg shadow-md">
        <input className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-48" type="text" placeholder="Book title" value={title} onChange={e => setTitle(e.target.value)} required />
        <select className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-48" value={authorId} onChange={e => setAuthorId(e.target.value)} required>
          <option value="">Select author</option>
          {authors.map(author => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow transition disabled:opacity-50" type="submit" disabled={submitting}>
          Add Book
        </button>
      </form>
      <ul className="space-y-4 max-w-xl mx-auto">
        {books.map(book => (
          <li key={book.id} className="border border-gray-200 bg-white p-4 rounded-lg shadow flex flex-col md:flex-row items-center justify-between gap-2">
            {editId === book.id ? (
              <>
                <input className="border rounded px-2 py-1 mr-2" value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                <select className="border rounded px-2 py-1 mr-2" value={editAuthorId} onChange={e => setEditAuthorId(e.target.value)}>
                  {authors.map(author => (
                    <option key={author.id} value={author.id}>{author.name}</option>
                  ))}
                </select>
                <button className="bg-green-500 text-white px-3 py-1 rounded mr-2" onClick={() => handleEditSave(book.id)}>Save</button>
                <button className="bg-gray-300 text-gray-800 px-3 py-1 rounded" onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <div>
                  <span className="font-semibold text-lg text-gray-800">{book.title}</span>
                  <span className="text-gray-500 ml-2">by {book.author?.name}</span>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => startEdit(book)}>Edit</button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(book.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookList;
