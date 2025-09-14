import React, { useState } from "react";
import { eventBus } from "../utils/eventBus";
import type { Author } from "../types";
import { apiService } from "../services/api";

const AuthorList: React.FC<{
  authors: Author[];
  setAuthors: React.Dispatch<React.SetStateAction<Author[]>>;
  refreshAuthors: () => void;
}> = ({ authors, setAuthors, refreshAuthors }) => {
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiService.createAuthor(name);
      setName("");
      await refreshAuthors();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this author?")) return;
    try {
      await apiService.deleteAuthor(id);
      await refreshAuthors();
      eventBus.emit('authorUpdated'); // Notify other components that author was deleted
    } catch (err: any) {
      setError(err.message);
    }
  };

  const startEdit = (author: Author) => {
    setEditId(author.id);
    setEditName(author.name);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  const handleEditSave = async (id: number) => {
    try {
      await apiService.updateAuthor(id, editName);
      await refreshAuthors();
      eventBus.emit('authorUpdated'); // Notify other components that author was updated
      cancelEdit();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold mb-6 text-green-700 text-center drop-shadow">Authors</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-center bg-white p-4 rounded-lg shadow-md">
        <input
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 w-48"
          type="text"
          placeholder="Author name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow transition disabled:opacity-50"
          type="submit"
          disabled={submitting}
        >
          Add Author
        </button>
      </form>
      <ul className="space-y-4 max-w-xl mx-auto">
        {authors.map(author => (
          <li key={author.id} className="border border-gray-200 bg-white p-4 rounded-lg shadow flex items-center justify-between gap-2">
            {editId === author.id ? (
              <>
                <input className="border rounded px-2 py-1 mr-2" value={editName} onChange={e => setEditName(e.target.value)} />
                <button className="bg-green-500 text-white px-3 py-1 rounded mr-2" onClick={() => handleEditSave(author.id)}>Save</button>
                <button className="bg-gray-300 text-gray-800 px-3 py-1 rounded" onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <span className="font-semibold text-lg text-gray-800">{author.name}</span>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => startEdit(author)}>Edit</button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(author.id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuthorList;
