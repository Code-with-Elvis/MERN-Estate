import { nanoid } from "nanoid";
import {
  Tag,
  Key,
  Home,
  Crown,
  LandPlot,
  Briefcase,
  Tractor,
} from "lucide-react";

const heroTags = [
  {
    id: nanoid(),
    label: "For Sale",
    icon: Tag,
  },
  {
    id: nanoid(),
    label: "For Rent",
    icon: Key,
  },
  {
    id: nanoid(),
    label: "House",
    icon: Home,
  },

  {
    id: nanoid(),
    label: "Villa",
    icon: Crown,
  },
  {
    id: nanoid(),
    label: "Land",
    icon: LandPlot,
  },
  {
    id: nanoid(),
    label: "Commercial",
    icon: Briefcase,
  },
  {
    id: nanoid(),
    label: "Farm",
    icon: Tractor,
  },
];

export { heroTags };
