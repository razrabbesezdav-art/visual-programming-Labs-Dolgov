import React, { useEffect, useState } from 'react';
import BookCardWithCover from './components/BookCardWithCover';
import { Book } from './types/book';
import './App.css';

interface OpenLibraryBook {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
}

const OPEN_LIBRARY_API = 'https://openlibrary.org/search.json?q=subject:fiction&limit=12';

interface ExtendedBook extends Book {
  coverId?: number;
}

const App: React.FC = () => {
  const [books, setBooks] = useState<ExtendedBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        console.log('Загрузка книг из Open Library API...');
        
        const response = await fetch(OPEN_LIBRARY_API);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Получены данные:', data);
        
        const formattedBooks: ExtendedBook[] = (data.docs || []).map((doc: OpenLibraryBook, index: number) => ({
          id: index + 1,
          title: doc.title || 'Unknown Title',
          isbn: doc.isbn?.[0] || `978${Math.floor(Math.random() * 10000000000)}`,
          pageCount: 200,
          authors: doc.author_name || ['Unknown Author'],
          coverId: doc.cover_i 
        }));
        
        setBooks(formattedBooks);
        setLoading(false);
        console.log('Загружено книг:', formattedBooks.length);
        console.log('Книги с coverId:', formattedBooks.filter(b => b.coverId).length);
      } catch (err) {
        console.error('Ошибка загрузки книг:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <div className="loading">Загрузка книг...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

  return (
    <div className="app">
      <h1>Каталог книг</h1>
      <div className="books-grid">
        {books.map(book => (
          <BookCardWithCover 
            key={book.id} 
            book={book}
            coverId={book.coverId}
          />
        ))}
      </div>
    </div>
  );
};

export default App;