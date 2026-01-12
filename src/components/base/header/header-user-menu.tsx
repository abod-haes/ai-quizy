"use client";

import React from "react";
import { User, LogOut, FileQuestion, Grid } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuthStore, handleLogout } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { dashboardRoutesName, routesName } from "@/utils/constant";
import { useTranslation } from "@/providers/TranslationsProvider";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { SheetClose } from "@/components/ui/sheet";
import { roleType } from "@/utils/enum/common.enum";

interface HeaderUserMenuProps {
  variant?: "desktop" | "mobile";
}

export function HeaderUserMenu({ variant = "desktop" }: HeaderUserMenuProps) {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const getLocalizedHref = useLocalizedHref();
  const queryClient = useQueryClient();
  const { header } = useTranslation();
  if (!user) return null;

  const onLogout = async () => {
    await handleLogout(router, queryClient, getLocalizedHref, routesName.home.href);
  };

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  if (variant === "mobile") {
    return (
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-3 rounded-lg border p-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} alt={user.firstName} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-muted-foreground text-xs">{user.email}</p>
          </div>
        </div>
        <SheetClose asChild>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push(getLocalizedHref(routesName.profile.href))}
          >
            <User className="mr-2 h-4 w-4" />
            {header.userMenu?.profile || "Profile"}
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push(getLocalizedHref(routesName.quizzes.href))}
          >
            <FileQuestion className="mr-2 h-4 w-4" />
            {header.userMenu?.myQuizzes}
          </Button>
        </SheetClose>
        {user.role === roleType.ADMIN && (
          <SheetClose asChild>
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                router.push(getLocalizedHref(dashboardRoutesName.dashboard.href))
              }
            >
              <Grid className="mr-2 h-4 w-4" />
              {header.userMenu?.dashboard}
            </Button>
          </SheetClose>
        )}
        <SheetClose asChild>
          <Button
            variant="destructive"
            className="w-full"
            onClick={onLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {header.userMenu?.logout}
          </Button>
        </SheetClose>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div>
          <Button size="sm" className="relative h-9 w-9 rounded-full">
            <User className="size-5" />
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-muted-foreground text-xs leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push(getLocalizedHref(routesName.profile.href))}
          >
            <User className="mr-2 h-4 w-4" />
            <span>{header.userMenu?.profile}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(getLocalizedHref(routesName.quizzes.href))}
          >
            <FileQuestion className="mr-2 h-4 w-4" />
            <span>{header.userMenu?.myQuizzes}</span>
          </DropdownMenuItem>
          {user.role === roleType.ADMIN && (
            <DropdownMenuItem
              onClick={() =>
                router.push(getLocalizedHref(dashboardRoutesName.dashboard.href))
              }
            >
              <Grid className="mr-2 h-4 w-4" />
              <span>{header.userMenu?.dashboard}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{header.userMenu?.logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
