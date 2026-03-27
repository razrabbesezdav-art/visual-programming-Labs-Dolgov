import React, { useEffect, useState } from 'react';
import BookCardWithCover from './components/BookCardWithCover';
import { Book } from './types/book';
import './App.css';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=20';

interface GoogleBookItem {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    pageCount?: number;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Загрузка книг из Google Books API...');
    
    fetch(GOOGLE_BOOKS_API)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Получены данные:', data);
        
        const formattedBooks: Book[] = (data.items || []).slice(0, 12).map((item: GoogleBookItem, index: number) => {
          const isbnObj = item.volumeInfo.industryIdentifiers?.find(
            id => id.type === 'ISBN_13' || id.type === 'ISBN_10'
          );
          
          return {
            id: index + 1,
            title: item.volumeInfo.title || 'Unknown Title',
            isbn: isbnObj?.identifier || '9785170918683',
            pageCount: item.volumeInfo.pageCount || 200,
            authors: item.volumeInfo.authors || ['Unknown Author']
          };
        });
        
        setBooks(formattedBooks);
        setLoading(false);
        console.log('Загружено книг:', formattedBooks.length);
      })
      .catch(err => {
        console.error('Ошибка загрузки книг:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Загрузка книг...</div>;
  if (error) return <div className="error">Ошибка: {error}</div>;

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