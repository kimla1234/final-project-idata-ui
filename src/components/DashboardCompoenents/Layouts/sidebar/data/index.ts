import { icon } from "leaflet";
import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Generate API",
        url: "/dashboard",
        icon: Icons.HomeIcon, // Change to Icons.Grid if available
        items: [],
      },

      {
        title: "Schema",
        url: "/schema",
        icon: Icons.Schema,
        items: [
         
        ],
      },

      {
        title: "Documentation",
        url: "/documentation",
        icon: Icons.DocumentCloud, // Change to Icons.Grid if available
        items: [],
      },

    ],
  },
  {
    label: "OTHERS",
    items: [
      {
        title: "Setting",
        icon: Icons.Setting,
        items: [],
        url: "/setting",
      },
      {
        title: "Sign out",
        icon: Icons.LogOutIcon,
        items: [],
        url: "/login",
      },
    ],
  },
];
