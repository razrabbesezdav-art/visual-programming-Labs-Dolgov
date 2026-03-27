export interface Book {
  id: number;
  title: string;
  isbn: string;
  pageCount: number;
  authors: string[];
  coverId?: number;
}

export interface GoogleBooksResponse {
  items?: Array<{
    volumeInfo: {
      imageLinks?: {
        thumbnail?: string;
      };
    };
  }>;
}