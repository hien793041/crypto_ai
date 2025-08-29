using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace ONE_Services.Handlers
{
	public class RSA
	{
		public static MemoryStream RSAEncrypt(Stream input, RSAParameters pair)
		{
			using (RSACryptoServiceProvider rsa = new RSACryptoServiceProvider())
			{
				rsa.ImportParameters(pair);
				int blockSize = rsa.KeySize / 8 - 11;
				byte[] buffer = new byte[blockSize];
				MemoryStream output = new MemoryStream();
				while (true)
				{
					int readCount = input.Read(buffer, 0, blockSize);
					if (readCount == 0)
						break;
					byte[] data;
					if (readCount != blockSize)
					{
						data = new byte[readCount];
						Buffer.BlockCopy(buffer, 0, data, 0, readCount);
					}
					else data = buffer;
					byte[] encrypted = rsa.Encrypt(data, false);
					output.Write(encrypted, 0, encrypted.Length);
				}
				output.Seek(0, SeekOrigin.Begin);
				return output;
			}
		}

		public static MemoryStream RSADecrypt(Stream input, RSAParameters pair)
		{
			using (RSACryptoServiceProvider rsa = new RSACryptoServiceProvider())
			{
				rsa.ImportParameters(pair);
				int blockSize = rsa.KeySize / 8;
				byte[] buffer = new byte[blockSize];
				MemoryStream output = new MemoryStream();
				while (true)
				{
					int readCount = input.Read(buffer, 0, blockSize);
					if (readCount == 0)
						break;
					byte[] data;
					if (readCount != blockSize)
					{
						data = new byte[readCount];
						Buffer.BlockCopy(buffer, 0, data, 0, readCount);
					}
					else data = buffer;
					byte[] decrypted = rsa.Decrypt(data, false);
					output.Write(decrypted, 0, decrypted.Length);
				}
				output.Seek(0, SeekOrigin.Begin);
				return output;
			}
		}

	}
}
