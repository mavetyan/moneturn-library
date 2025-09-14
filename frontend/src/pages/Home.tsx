import React, { useEffect, useState, useCallback } from "react";
import BookList from "../components/BookList";
import AuthorList from "../components/AuthorList";
import type { Author } from "../types";
import { apiService } from "../services/api";

const Home: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);

  const refreshAuthors = useCallback(async () => {
    try {
      const data = await apiService.getAuthors();
      setAuthors(data);
    } catch (error) {
      console.error('Failed to fetch authors:', error);
    }
  }, []);

  useEffect(() => {
    refreshAuthors();
  }, [refreshAuthors]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-start py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-blue-800 drop-shadow text-center">
        Moneturn Book Library
      </h1>
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-stretch justify-center">
        <div className="flex-1 bg-white rounded-xl shadow-lg p-6 mb-4 md:mb-0">
          <BookList 
            authors={authors} 
            refreshAuthors={refreshAuthors}
          />
        </div>
        <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
          <AuthorList
            authors={authors}
            setAuthors={setAuthors}
            refreshAuthors={refreshAuthors}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
