public class User
{
    public Guid Id { get; set; }
    public string? UserName { get; set;}
    public string? Password { get; set;}

    public List<BlogPost> Articles { get; set; } = new List<BlogPost>();
}
