
using System.Security.Cryptography;
using System.Text;

public static class HashPasswordHelper
    {
        public static string HashPasswordSHA256(string password)
        {
            SHA3_512 mySha565 = SHA3_512.Create();
            return Encoding.Default.GetString(mySha565.ComputeHash(Encoding.ASCII.GetBytes(password)));
        }
    }