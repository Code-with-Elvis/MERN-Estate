import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, GripVertical } from "lucide-react";

const MAX_IMAGES = 3;

const SortableImage = ({ id, src, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group border rounded-xl overflow-hidden"
    >
      <img
        src={src}
        alt="Preview"
        className="w-32 h-32 object-cover rounded-xl"
      />
      <button
        type="button"
        onClick={() => onRemove(id)}
        className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
      >
        <X size={14} />
      </button>
      <div
        {...attributes}
        {...listeners}
        className="absolute bottom-1 left-1 bg-white/80 rounded-full p-1 cursor-grab opacity-0 group-hover:opacity-100 transition"
      >
        <GripVertical size={14} />
      </div>
    </div>
  );
};

const ImageUploadField = ({ images, setImages, setSelectedFiles }) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const selected = files.slice(0, MAX_IMAGES - images.length);

    const previews = selected.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...previews]);
    setSelectedFiles((prev) => [...prev, ...selected]);
  };

  const handleRemove = (id) => {
    const removedIndex = images.indexOf(id);
    setImages((prev) => prev.filter((img) => img !== id));
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== removedIndex)
    );
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = images.indexOf(active.id);
      const newIndex = images.indexOf(over.id);

      setImages((prev) => arrayMove(prev, oldIndex, newIndex));
      setSelectedFiles((prev) => arrayMove(prev, oldIndex, newIndex));
    }
  };

  return (
    <div className="mb-6 mt-5">
      <p className="mb-3 text-sm">
        <span className="font-semibold text-base">Images:</span> The first image
        will be the cover (max {MAX_IMAGES})
      </p>

      <Input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        disabled={images.length >= MAX_IMAGES}
      />

      {images.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex gap-3 flex-wrap mt-3">
              {images.map((img) => (
                <SortableImage
                  key={img}
                  id={img}
                  src={img}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className="mt-3 flex justify-end">
        <Button
          variant="outline"
          type="button"
          className="border-dashed hover:bg-transparent hover:text-accent cursor-no-drop text-xs border-accent text-accent"
        >
          {images.length} / {MAX_IMAGES} Uploaded
        </Button>
      </div>
    </div>
  );
};

export default ImageUploadField;
