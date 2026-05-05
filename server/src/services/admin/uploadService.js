export const uploadService = {
  async uploadMultiple(files = [], provider = "cloudinary") {
    return files.map((file, index) => ({
      provider,
      publicId: `${provider}-${Date.now()}-${index}`,
      url: `https://cdn.example.com/${provider}/${Date.now()}-${file.originalname}`
    }));
  }
};
