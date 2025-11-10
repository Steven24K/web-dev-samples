using Microsoft.EntityFrameworkCore;

public class DatabaseContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<BlogPost> BlogPosts { get; set; }
    public DatabaseContext(DbContextOptions options) : base(options)
    {

    }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasData(new User
            {
            Id = Guid.ParseExact("0123456789abcdef0123456789abcdef", "N"),
            UserName = "Steven",
            Password = HashPasswordHelper.HashPasswordSHA256("password")
            });
    }
}