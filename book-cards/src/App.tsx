import React, { useEffect, useState } from 'react';
import BookCardWithCover from './components/BookCardWithCover';
import { Book } from './types/book';
import booksData from './data/books.json';
import './App.css';

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('Загрузка локальных данных о книгах...');
    setTimeout(() => {
      setBooks(booksData);
      setLoading(false);
      console.log('Загружено книг:', booksData.length);
    }, 500);
  }, []);

  if (loading) return <div className="loading">Загрузка книг...</div>;

  return (
    <div className="app">
      <h1>Каталог книг</h1>
      <div className="books-grid">
        {books.map(book => (
          <BookCardWithCover key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
};

export default App;