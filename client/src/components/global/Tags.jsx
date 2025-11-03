import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const Tags = ({ tags, setTags }) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = input.trim();

      if (
        newTag &&
        !tags.some((tag) => tag.toLowerCase() === newTag.toLowerCase()) //=== check uniqueness (case-insensitive)
      ) {
        setTags([...tags, newTag]); // === Save with original casing
      }

      setInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Card className="rounded-md mb-2.5 bg-transparent">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Tags</CardTitle>
        <CardDescription>
          Add relevant tags to describe your listing e.g "spacious".
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center flex-wrap gap-2 border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="flex items-center gap-1 pr-1 text-sm"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                type="button"
                className="hover:text-red-500 ml-1"
              >
                <X
                  className="size-3
                "
                />
              </button>
            </Badge>
          ))}

          {/* Input looks like it's inside */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              tags.length === 0 ? "Type a tag and press Enter or comma" : ""
            }
            className="text-sm flex-1 min-w-[120px] border-none focus:ring-0 focus:outline-none bg-transparent py-1"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Tags;
