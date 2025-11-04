import { storage } from "@/firebase";
import { clsx } from "clsx";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { nanoid } from "nanoid";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

async function uploadImagesToFirebase(files) {
  if (!files || files.length === 0) return [];

  // === Validate file sizes and types before upload ===
  const maxSizeInMB = 1; // 1MB
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  for (const file of files) {
    // ===  Check file size ===
    if (file.size > maxSizeInBytes) {
      throw new Error(`File size exceeds ${maxSizeInMB}MB limit`);
    }

    // === Check file type ===
    if (!file.type.startsWith("image/")) {
      throw new Error("Invalid file type");
    }
  }

  const uploadPromises = Array.from(files).map(async (file) => {
    const storageRef = ref(storage, `listings/${nanoid()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  });

  // === Wait for all uploads to finish ===
  return Promise.all(uploadPromises);
}

const cleanupOldImages = async (imageUrls) => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return;

  try {
    const deletePromises = imageUrls.map(async (url) => {
      const imageRef = ref(storage, url);
      await deleteObject(imageRef);
    });

    await Promise.all(deletePromises);

    const timeoutId = setTimeout(() => {
      toast.info("Listing related images deleted successfully.");
    }, 4000);

    return () => clearTimeout(timeoutId);
  } catch (error) {
    console.error("Error deleting images:", error);
  }
};

export { uploadImagesToFirebase, cleanupOldImages };
