import { CloudinaryImage, Cloudinary } from '@cloudinary/url-gen';
import { extractPublicId } from 'cloudinary-build-url';
import { format } from '@cloudinary/url-gen/actions/delivery';
import { webp } from '@cloudinary/url-gen/qualifiers/format';
import ICloudConfig from '@cloudinary/url-gen/config/interfaces/Config/ICloudConfig';

export const getUniqueValues = (
  data: Record<string, any>[] = [],
  type: string
) => {
  let unique = data.map((item) => item[type]);
  unique = unique.flat();
  const uniqueSet = new Set(unique);

  return [...uniqueSet];
};

// export const axiosInstance = axios.create({ withCredentials: true });

// axiosInstance.interceptors.request.use(
//   async (req) => {
//     if (!req.cookies) {
//       const res = await axios.post(`/api/v1/users/refreshToken`, {});
//       console.log(res);
//     }

//     return req;
//   },
//   (error) => Promise.reject(error)
// );
const cld = new Cloudinary({
  cloud: {
    cloudName: 'zoooom',
  },
}) as ICloudConfig;
export const convertImageToWebP = (url: string) => {
  const publicId = extractPublicId(url);
  return new CloudinaryImage(publicId, cld).delivery(format(webp())).toURL();
};
