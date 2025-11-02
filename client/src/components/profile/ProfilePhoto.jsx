import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useAuth } from "@/store";
import { useState } from "react";
import { toast } from "sonner";
import {
  getDownloadURL,
  uploadBytes,
  ref as storageRef,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/firebase";
import useUpdateItem from "@/hooks/useUpdateItem";

const MAX_FILE_SIZE_MB = 2;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

const ProfilePhoto = () => {
  const user = useAuth((state) => state.user);
  const login = useAuth((state) => state.login);
  const [isOpen, setIsOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(
    user?.photo || "https://cdn-icons-png.flaticon.com/128/17561/17561717.png"
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPEG and PNG formats are allowed.");
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      setError("File size must be less than 2MB.");
      return;
    }

    setError("");
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const { updateItem, isPending } = useUpdateItem(
    "/api/v1/users/me/update",
    "users",
    "Profile photo updated successfully"
  );

  const handleImageSave = async () => {
    if (!selectedFile) return;
    setIsLoading(true);

    const oldPhoto = user?.photo; // Step 1: Store old image URL

    try {
      // === Step 2: Upload new image ===

      const imageRef = storageRef(
        storage,
        `profiles/${Date.now()}-${selectedFile.name}/${user._id}`
      );
      await uploadBytes(imageRef, selectedFile);
      const downloadURL = await getDownloadURL(imageRef);

      // === Step 3: Update backend ===

      updateItem(
        { photo: downloadURL },
        {
          onSuccess: () => {
            login({ ...user, photo: downloadURL });

            // 4. Schedule cleanup (non-blocking)
            if (
              oldPhoto &&
              !oldPhoto.includes("flaticon.com") &&
              oldPhoto.includes("firebasestorage.googleapis.com")
            )
              cleanupOldImage(oldPhoto);
          },
        }
      );
      setIsOpen(false);
    } catch (err) {
      console.error("Error uploading image:", err);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const cleanupOldImage = (oldImagePath) => {
    if (!oldImagePath) return;

    // Use Promise-based approach instead of async/await
    const oldImageRef = storageRef(storage, oldImagePath);
    deleteObject(oldImageRef)
      .then(() => {
        console.log("Old image deleted successfully");
      })
      .catch((error) => {
        console.warn("Failed to delete old image:", error);
        // Don't throw error - cleanup failure shouldn't break the flow
      });
  };

  return (
    <article className="relative size-20">
      <Avatar className="size-28 bg-foreground">
        <AvatarImage
          src={
            user?.photo ||
            "https://cdn-icons-png.flaticon.com/128/17561/17561717.png"
          }
          className="object-cover w-full h-full"
        />
        <AvatarFallback className="text-4xl font-bold">
          {user?.name?.charAt(0).toUpperCase() || "P"}
        </AvatarFallback>
      </Avatar>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="size-9 grid place-items-center absolute -bottom-6 -right-9 bg-white dark:text-neutral-800 rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors">
            <Camera size={16} />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="pt-2">
            <DialogTitle className="text-center text-sm uppercase font-medium">
              Update Profile Photo
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 mt-3">
            <span className="size-30 rounded-full overflow-hidden border-4 border-neutral-200  ">
              <img
                src={previewUrl}
                className="size-120 object-cover w-full h-full"
                alt="Preview"
              />
            </span>
            {error && (
              <p className="text-sm text-red-500 text-center max-w-xs">
                {error}
              </p>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="profile-photo-upload"
              aria-label="Upload Profile Photo"
              className="hidden"
            />

            <Button size={"sm"} asChild>
              <Label
                htmlFor="profile-photo-upload"
                className="cursor-pointer bg-blue-500"
              >
                Choose File
              </Label>
            </Button>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleImageSave}
              disabled={!selectedFile || isPending || isLoading}
            >
              {isPending || isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );
};
export default ProfilePhoto;
