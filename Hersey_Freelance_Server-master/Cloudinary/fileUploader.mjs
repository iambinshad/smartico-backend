import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: 'drlbuux1l',
  api_key: '123249645135582',
  api_secret: '6-iXpLb6af9kU91urZYIAZfE4uc',
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

export default (image) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (error, result) => {
      if (result && result.secure_url) {
        return resolve(result.secure_url);
      } else if (error) {
        console.log(error.message);
        return reject({ message: error.message });
      }
    });
  });
};
