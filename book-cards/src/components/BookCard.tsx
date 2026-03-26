import React, { useState, useEffect } from 'react';
import './BookCard.css';

interface BookCardProps {
  title: string;
  authors: string[];
  imageBlob: Blob | null;
  isLoading?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ 
  title, 
  authors, 
  imageBlob, 
  isLoading = false 
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (imageBlob) {
      const url = URL.createObjectURL(imageBlob);
      setImageUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [imageBlob]);

  if (isLoading) {
    return (
      <div className="book-card">
        <div className="book-cover placeholder">
          <div className="loading-spinner"></div>
        </div>
        <div className="book-title">{title}</div>
        <div className="book-authors">{authors?.join(', ') || 'Unknown author'}</div>
      </div>
    );
  }

  return (
    <div className="book-card">
      <div className="book-cover">
        {imageUrl ? (
          <img src={imageUrl} alt={title} />
        ) : (
          <div className="no-image">No cover</div>
        )}
      </div>
      <div className="book-title">{title}</div>
      <div className="book-authors">{authors?.join(', ') || 'Unknown author'}</div>
    </div>
  );
};

export default BookCard;