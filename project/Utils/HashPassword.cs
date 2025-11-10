
using System.Security.Cryptography;
using System.Text;

public static class HashPasswordHelper
    {
        public static string HashPasswordSHA512(string password)
        {
            SHA3_512 mySha512 = SHA3_512.Create();
            return Encoding.Default.GetString(mySha512.ComputeHash(Encoding.ASCII.GetBytes(password)));
        }
    }