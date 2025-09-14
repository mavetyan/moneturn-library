import { apiService } from '../api';

// Mock fetch globally
global.fetch = jest.fn();

describe('ApiService', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('Authors', () => {
    it('should create an author', async () => {
      const mockAuthor = { id: 1, name: 'Test Author' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockAuthor,
      });

      const result = await apiService.createAuthor('Test Author');

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/authors',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'Test Author' }),
        })
      );
      expect(result).toEqual(mockAuthor);
    });

    it('should handle API errors', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Author name is required' }),
      });

      await expect(apiService.createAuthor('')).rejects.toThrow('Author name is required');
    });
  });

  describe('Books', () => {
    it('should create a book', async () => {
      const mockBook = { id: 1, title: 'Test Book', authorId: 1 };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockBook,
      });

      const result = await apiService.createBook('Test Book', 1);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/books',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ title: 'Test Book', authorId: 1 }),
        })
      );
      expect(result).toEqual(mockBook);
    });
  });
});
