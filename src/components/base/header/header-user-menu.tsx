"use client";

import React from "react";
import { User, LogOut, FileQuestion } from "lucide-react";
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
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { routesName } from "@/utils/constant";
import { deleteCookie } from "@/utils/cookies";
import { myCookies } from "@/utils/cookies";
import { useTranslation } from "@/providers/TranslationsProvider";
import { motion } from "framer-motion";
import { SheetClose } from "@/components/ui/sheet";

interface HeaderUserMenuProps {
  variant?: "desktop" | "mobile";
}

export function HeaderUserMenu({ variant = "desktop" }: HeaderUserMenuProps) {
  const clearUser = useAuthStore((state) => state.clearUser);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const getLocalizedHref = useLocalizedHref();
  const { header } = useTranslation();
  if (!user) return null;

  const handleLogout = async () => {
    await deleteCookie(myCookies.auth);
    clearUser();
    router.push(getLocalizedHref(routesName.home));
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
            className="w-full justify-start"
            onClick={() => router.push(getLocalizedHref(routesName.profile))}
          >
            <User className="mr-2 h-4 w-4" />
            {header.userMenu?.profile || "Profile"}
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => router.push(getLocalizedHref(routesName.quizzes))}
          >
            <FileQuestion className="mr-2 h-4 w-4" />
            {header.userMenu?.myQuizzes}
          </Button>
        </SheetClose>
        <SheetClose asChild>
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {header.userMenu?.logout || "Logout"}
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
            onClick={() => router.push(getLocalizedHref(routesName.profile))}
          >
            <User className="mr-2 h-4 w-4" />
            <span>{header.userMenu?.profile || "Profile"}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(getLocalizedHref(routesName.quizzes))}
          >
            <FileQuestion className="mr-2 h-4 w-4" />
            <span>{header.userMenu?.myQuizzes || "My Quizzes"}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} variant="destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>{header.userMenu?.logout || "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
