public class BlogPost 
{
    public Guid Id { get; set;}

    public string? Title { get; set;}

    public string? Content { get; set; }

    public string? Tags { get; set; } // This will be a comma sepparated string i.e. "Tech;Computer;Internet"

    public User? Author { get; set; } 
}