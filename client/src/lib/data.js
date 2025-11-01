import { nanoid } from "nanoid";
import {
  Tag,
  Key,
  Home,
  Building2,
  Crown,
  LandPlot,
  Briefcase,
  Tractor,
} from "lucide-react";
import { id } from "zod/v4/locales";

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
