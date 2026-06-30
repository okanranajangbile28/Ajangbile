import axios from "axios";
import { CloudinaryImage, Cloudinary } from "@cloudinary/url-gen";
import { extractPublicId } from "cloudinary-build-url";
import { format } from "@cloudinary/url-gen/actions/delivery";
import { webp } from "@cloudinary/url-gen/qualifiers/format";
import ICloudConfig from "@cloudinary/url-gen/config/interfaces/Config/ICloudConfig";

// ===============================
// AXIOS INSTANCE (FIXED)
// ===============================
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

// ===============================
// UTIL FUNCTION
// ===============================
export const getUniqueValues = (
  data: Array<Record<string, unknown>> = [],
  type: string,
) => {
  let unique = data.map((item) => item[type]);
  unique = unique.flat();
  const uniqueSet = new Set(unique);

  return [...uniqueSet];
};

// ===============================
// CLOUDINARY CONFIG
// ===============================
const cld = new Cloudinary({
  cloud: {
    cloudName: "zoooom",
  },
}) as ICloudConfig;

// ===============================
// IMAGE CONVERTER
// ===============================
export const convertImageToWebP = (url: string) => {
  const publicId = extractPublicId(url);
  return new CloudinaryImage(publicId, cld).delivery(format(webp())).toURL();
};
