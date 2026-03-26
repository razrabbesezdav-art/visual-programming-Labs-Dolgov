import React, { useEffect, useState } from 'react';
import BookCard from './BookCard';
import { Book, GoogleBooksResponse } from '../types/book';

const fetchCoverBlob = async (isbn: string): Promise<Blob | null> => {
  try {
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: GoogleBooksResponse = await response.json();

    const thumbnail = data.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;
    if (!thumbnail) return null;

    const secureThumbnail = thumbnail.replace('http://', 'https://');
    
    const imgResponse = await fetch(secureThumbnail);
    if (!imgResponse.ok) {
      throw new Error(`Image fetch error! status: ${imgResponse.status}`);
    }
    
    const blob = await imgResponse.blob();
    return blob;
  } catch (err) {
    console.error('Error fetching cover for ISBN', isbn, err);
    return null;
  }
};

interface BookCardWithCoverProps {
  book: Book;
}

const BookCardWithCover: React.FC<BookCardWithCoverProps> = ({ book }) => {
  const [coverBlob, setCoverBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadCover = async () => {
      if (book.isbn) {
        const blob = await fetchCoverBlob(book.isbn);
        if (isMounted) {
          setCoverBlob(blob);
          setLoading(false);
        }
      } else {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCover();

    return () => {
      isMounted = false;
    };
  }, [book.isbn]);

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