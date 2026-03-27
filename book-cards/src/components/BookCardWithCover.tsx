import React, { useEffect, useState } from 'react';
import BookCard from './BookCard';
import { Book } from '../types/book';

const fetchCoverFromOpenLibrary = async (coverId: number): Promise<Blob | null> => {
  try {
    const coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
    
    const response = await fetch(coverUrl);
    if (!response.ok) {
      const mediumUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
      const mediumResponse = await fetch(mediumUrl);
      if (!mediumResponse.ok) return null;
      const blob = await mediumResponse.blob();
      return blob;
    }
    
    const blob = await response.blob();
    return blob;
  } catch (err) {
    console.error('Error fetching cover from Open Library:', err);
    return null;
  }
};

const fetchCoverFromGoogleBooks = async (isbn: string): Promise<Blob | null> => {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    const thumbnail = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
    if (!thumbnail) return null;

    const secureThumbnail = thumbnail.replace('http://', 'https://');
    const imgResponse = await fetch(secureThumbnail);
    const blob = await imgResponse.blob();
    return blob;
  } catch (err) {
    console.error('Error fetching cover from Google Books:', err);
    return null;
  }
};

interface BookCardWithCoverProps {
  book: Book;
  coverId?: number;
}

const BookCardWithCover: React.FC<BookCardWithCoverProps> = ({ book, coverId }) => {
  const [coverBlob, setCoverBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadCover = async () => {
      let blob: Blob | null = null;
    
      if (coverId) {
        console.log(`Загрузка обложки из Open Library для книги: ${book.title}, coverId: ${coverId}`);
        blob = await fetchCoverFromOpenLibrary(coverId);
      }

      if (!blob && book.isbn) {
        console.log(`Загрузка обложки из Google Books для ISBN: ${book.isbn}`);
        blob = await fetchCoverFromGoogleBooks(book.isbn);
      }
      
      if (isMounted) {
        setCoverBlob(blob);
        setLoading(false);
      }
    };

    loadCover();

    return () => {
      isMounted = false;
    };
  }, [book.isbn, book.title, coverId]);

  return (
    <BookCard
      title={book.title}
      authors={book.authors}
      imageBlob={coverBlob}
      isLoading={loading}
    />
  );
};

export default BookCardWithCover;