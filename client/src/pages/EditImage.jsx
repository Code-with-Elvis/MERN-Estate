import CommonError from "@/components/global/CommonError";
import ImageUploadField from "@/components/global/ImageUploadField";
import EditHeader from "@/components/Listings/EditHeader";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import useGetItems from "@/hooks/useGetItems";
import useUpdateItem from "@/hooks/useUpdateItem";
import { cleanupOldImages, uploadImagesToFirebase } from "@/lib/utils";
import { useAuth } from "@/store";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const EditImage = () => {
  const [images, setImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [oldPreviewUrls, setOldPreviewUrls] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);
  const user = useAuth((state) => state.user);
  const { slug } = useParams();
  const [firebaseLoading, setFirebaseLoading] = useState(false);

  const { data, isPending, error } = useGetItems(
    `/api/v1/listings/${slug}`,
    "listings"
  );
  const { updateItem, isPending: isLoading } = useUpdateItem(
    `/api/v1/listings/${slug}`,
    "listings",
    "Listing details updated successfully!"
  );

  useEffect(() => {
    if (data?.data?.listing?.images) {
      setOldPreviewUrls(data.data.listing.images);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      if (error.response?.status === 401) {
        queryClient.removeQueries();
        navigate("/login");
        logout();
        toast.warning("You are not authorized to perform this action.");
      } else if (error.response?.status === 403) {
        navigate("/");
      } else if (error.response?.status === 404) {
        navigate("/");
        toast.warning("Listing not found.");
      }
    }
  }, [error, queryClient, navigate, logout]);

  if (isPending) {
    return (
      <section className="pb-20">
        <div className="hidden sm:block h-12 bg-[#222]"></div>
        <div className="container pt-5">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="pb-20">
        <div className="hidden sm:block h-12 bg-[#222]"></div>
        <div className="container pt-10">
          <CommonError message="Failed to load listing. Please try again later." />
        </div>
      </section>
    );
  }

  const handleSubmit = async () => {
    setFirebaseLoading(true);
    try {
      if (selectedFiles.length === 0) {
        toast.warning("Please upload at least one image.");
        return;
      }
      const uploadedUrls = await uploadImagesToFirebase(selectedFiles);

      updateItem(
        { images: uploadedUrls },
        {
          onSuccess: () => {
            navigate(`/profile/${user._id}`);
            cleanupOldImages(oldPreviewUrls);
          },
          onError: () => {
            cleanupOldImages(uploadedUrls);
          },
        }
      );
    } catch (error) {
      console.error("Uploading images error:", error);
      toast.error(error?.message || "Failed to upload images.");
    } finally {
      setFirebaseLoading(false);
    }
  };

  return (
    <section className="pb-20">
      <div className="hidden sm:block h-12 bg-[#222]"></div>
      <div className="container pt-5">
        <EditHeader />
        <div className="mt-10 max-w-2xl mx-auto">
          <ImageUploadField
            images={images}
            setImages={setImages}
            setSelectedFiles={setSelectedFiles}
          />
        </div>

        {/* Old Images Preview */}
        {oldPreviewUrls && oldPreviewUrls.length > 0 && (
          <div className="mt-10 max-w-2xl mx-auto">
            <h2 className="uppercase text-xs font-semibold mb-2">
              Current Image(s):
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {oldPreviewUrls.map((url, index) => (
                <div key={index} className="border p-2 rounded">
                  <img
                    src={url}
                    alt={`Current Image ${index + 1}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex mt-10 justify-center">
          <Button
            disabled={isLoading || firebaseLoading}
            type="button"
            onClick={handleSubmit}
            className="uppercase w-48"
          >
            {isLoading || firebaseLoading ? (
              <>
                <Spinner /> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};
export default EditImage;
