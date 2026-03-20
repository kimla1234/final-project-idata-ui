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
          {
            title: "Tenants Interview",
            url: "/schema",
            icon: Icons.Folders,
          },
          {
            title: "Tenants HR",
            url: "/tenantsfdd",
            icon: Icons.Folders,
          },
          {
            title: "Add new folder",
            url: "/tenantsffdd",
          },
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
        title: "Help Center",
        icon: Icons.HelpCenter,
        items: [],
        url: "/help_center",
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
