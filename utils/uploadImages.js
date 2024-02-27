import { v2 as cloudinary } from "cloudinary";

export const uploadImagesCloudinary = async (file, folder) => {

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  try {
    // Upload the image
    const result = await cloudinary.uploader.upload(file, { folder: folder });
    const arrayUrl = result.secure_url.split("/")
    const objectImages = {}
    objectImages[`${result.public_id}`] = `${arrayUrl[6]}/${arrayUrl[7]}/${arrayUrl[8]}`
    
    return objectImages;

  } catch (error) {
    console.error(error);
  }

};

export const deleteImagesCloudinary = async(publicId) => {

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

  cloudinary.uploader.destroy(publicId, function(error, result) {
    if (error) {
      console.error('Error al eliminar la imagen:', error);
    } else {
      //console.log('Imagen eliminada exitosamente:', result);
    }
  });
}

