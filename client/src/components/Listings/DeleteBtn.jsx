import { MdDeleteOutline } from "react-icons/md";
import { Delete } from "lucide-react";
import { Button } from "../ui/button";

const DeleteBtn = () => {
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      className="absolute w-8 bg-transparent top-2 right-2"
    >
      <MdDeleteOutline className="size-5 text-white drop-shadow-[0_0_1px_#000]" />
    </Button>
  );
};
export default DeleteBtn;
