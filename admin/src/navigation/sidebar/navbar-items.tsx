import React from "react";
import { SubjectEnum } from "@/types/enums/common.enum";
import { ROUTES } from "@/navigation/sidebar/routes";
import {
  BoxCubeIcon,
  DocsIcon,
  GridIcon,
  ListIcon,
  ShootingStarIcon,
  UserCircleIcon,
} from "@/icons/index";

export type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subject?: SubjectEnum;
  subItems?: {
    name: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    subject?: SubjectEnum;
    icon?: React.ReactNode;
  }[];
};

// Main LMS Navigation
export const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: ROUTES.dashboard,
    subject: SubjectEnum.DASHBOARD,
  },
  {
    icon: <UserCircleIcon />,
    name: "Users",
    path: ROUTES.users.list,
    subject: SubjectEnum.USERS,
  },
  {
    icon: <DocsIcon />,
    name: "Courses",
    path: ROUTES.courses.list,
    subject: SubjectEnum.COURSES,
  },
];

// Management & Moderation Navigation
export const othersNavItems: NavItem[] = [
  {
    icon: <BoxCubeIcon />,
    name: "Categories",
    path: ROUTES.categories.list,
    subject: SubjectEnum.CATEGORIES,
  },
  {
    icon: <ListIcon />,
    name: "Tags",
    path: ROUTES.tags.list,
    subject: SubjectEnum.TAGS,
  },
  {
    icon: <ShootingStarIcon />,
    name: "Reviews",
    path: ROUTES.reviews.list,
    subject: SubjectEnum.REVIEWS,
  },
];

export type TSearchModule = {
  id: string;
  title: string;
  category: string;
  path: string;
  icon: React.ReactNode;
  subject?: SubjectEnum;
};

export const getDynamicSearchModules = (): TSearchModule[] => {
  const modules: TSearchModule[] = [];

  const processItems = (items: NavItem[], defaultCategory: string) => {
    items.forEach((item) => {
      if (item.subItems) {
        item.subItems.forEach((sub) => {
          modules.push({
            id: sub.path,
            title: sub.name,
            category: item.name,
            path: sub.path,
            icon: sub.icon || item.icon,
            subject: sub.subject,
          });
        });
      } else if (item.path) {
        modules.push({
          id: item.path,
          title: item.name,
          category: defaultCategory,
          path: item.path,
          icon: item.icon,
          subject: item.subject,
        });
      }
    });
  };

  processItems(navItems, "Main");
  processItems(othersNavItems, "Management");

  return modules;
};
