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
import HomeApartment from "../assets/home-apartment.png";
import HomeVilla from "../assets/home-villa.png";
import HomeCommercial from "../assets/home-commercial.png";
import HomeLand from "../assets/home-land.png";
import HomeHouse from "../assets/home-house.png";
import HomeDuplex from "../assets/home-duplex.png";

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

const homeInterest = [
  {
    id: nanoid(),
    category: "Houses",
    imageUrl: HomeHouse,
  },
  {
    id: nanoid(),
    category: "Apartments",
    imageUrl: HomeApartment,
  },
  {
    id: nanoid(),
    category: "Villas",
    imageUrl: HomeVilla,
  },
  {
    id: nanoid(),
    category: "Commercial",
    imageUrl: HomeCommercial,
  },
  {
    id: nanoid(),
    category: "Land",
    imageUrl: HomeLand,
  },
  {
    id: nanoid(),
    category: "Duplexes",
    imageUrl: HomeDuplex,
  },
];

export { heroTags, homeInterest };
