import React, { useEffect, useState } from 'react';
import BookCardWithCover from './components/BookCardWithCover';
import { Book } from './types/book';
import './App.css';

const BOOKS_API = 'https://fakeapi.extendsclass.com/books.JSON';

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(BOOKS_API)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: Book[]) => {
        setBooks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching books:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Loading books...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="app">
      <h1>Book Catalog</h1>
      <div className="books-grid">
        {books.map(book => (
          <BookCardWithCover key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default App;