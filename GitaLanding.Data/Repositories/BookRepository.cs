using Microsoft.EntityFrameworkCore;
using GitaLanding.Data.Models;
using GitaLanding.Data;

namespace GitaLanding.Data.Repositories;

/// <summary>
/// Реализация репозитория для работы с книгами
/// </summary>
public class BookRepository : Repository<Book>, IBookRepository
{
    public BookRepository(GitaLandingDbContext context) : base(context)
    {
    }

    public override async Task<Book?> GetByIdAsync(int id)
    {
        return await _dbSet
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<IEnumerable<Book>> GetByAuthorAsync(string authorName)
    {
        return await _dbSet
            .Where(b => b.Author.Contains(authorName))
            .OrderBy(b => b.Title)
            .ToListAsync();
    }

    public async Task<IEnumerable<Book>> SearchByTitleAsync(string searchTerm)
    {
        var normalizedSearchTerm = searchTerm.ToLower();
        return await _dbSet
            .Where(b => b.Title.ToLower().Contains(normalizedSearchTerm))
            .OrderBy(b => b.Title)
            .ToListAsync();
    }

    public async Task<IEnumerable<Book>> GetAvailableBooksAsync()
    {
        return await _dbSet
            .Where(b => b.IsAvailable && b.StockQuantity > 0)
            .OrderBy(b => b.Title)
            .ToListAsync();
    }

    public async Task<IEnumerable<Book>> GetByEditionAsync(string edition)
    {
        return await _dbSet
            .Where(b => b.Edition.Contains(edition))
            .OrderBy(b => b.Title)
            .ToListAsync();
    }

    public async Task<Book?> GetMainBookAsync()
    {
        return await _dbSet
            .FirstOrDefaultAsync(b => b.Title == "Bhagavad-gita As It Is");
    }

    public async Task<bool> UpdateStockQuantityAsync(int bookId, int quantity)
    {
        var book = await GetByIdAsync(bookId);
        if (book == null)
            return false;

        book.StockQuantity = quantity;
        book.UpdatedAt = DateTime.UtcNow;
        
        await _context.SaveChangesAsync();
        return true;
    }
}
