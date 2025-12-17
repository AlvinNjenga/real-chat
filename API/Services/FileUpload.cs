using System;

namespace API.Services;

public class FileUpload
{
    public static async Task<string> Upload(IFormFile file)
    {
        var uploadFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

        if (!Directory.Exists(uploadFolder))
        {
            Directory.CreateDirectory(uploadFolder);
        }

        // GUID to allow same file to be uploaded without clashing.
        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

        var filePath = Path.Combine(uploadFolder, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        return fileName;
    }
}
