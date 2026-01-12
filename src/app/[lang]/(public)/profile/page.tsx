"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import DynamicForm, {
  type FormDefinition,
} from "@/components/form-render/form-render";
import { useUser, useAuthStore, handleLogout } from "@/store/auth.store";
import {
  useUpdateProfile,
  useChangePassword,
} from "@/services/user.services/user.query";
import { useTranslation } from "@/providers/TranslationsProvider";
import { useCurrentLang } from "@/hooks/useCurrentLang";
import { getDirection } from "@/utils/translations/language-utils";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Lock, LogOut, Mail, UserCircle, Trophy } from "lucide-react";
import { Loading } from "@/components/custom/loading";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLocalizedHref } from "@/hooks/useLocalizedHref";
import { routesName } from "@/utils/constant";
import { useQuizzes } from "@/services/quizes.services/quizes.query";
import { QuizCard } from "@/components/quiz/quiz-card";
import { useQueryClient } from "@tanstack/react-query";

function ProfilePage() {
  const user = useUser();
  const { setUser } = useAuthStore();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const router = useRouter();
  const getLocalizedHref = useLocalizedHref();
  const queryClient = useQueryClient();
  const t = useTranslation();
  const lang = useCurrentLang();
  const direction = getDirection(lang);
  const isRTL = direction === "rtl";

  const profileDict = React.useMemo(() => t.profile || {}, [t.profile]);
  const common = React.useMemo(
    () => t.dashboard?.common || {},
    [t.dashboard?.common],
  );
  const quizzesDict = React.useMemo(() => t.quizzes || {}, [t.quizzes]);

  // Fetch solved quizzes for the current user
  const { data: quizzesData, isLoading: isLoadingQuizzes } = useQuizzes(
    {
      studentId: user?.id || undefined,
      PerPage: 100, // Get more quizzes to filter
    },
    {
      enabled: !!user?.id, // Only fetch if user exists
    },
  );

  // Filter only solved quizzes
  const solvedQuizzes = React.useMemo(() => {
    if (!quizzesData?.items) return [];
    return quizzesData.items.filter((quiz) => quiz.isSolved === true);
  }, [quizzesData]);

  const userInitials = React.useMemo(() => {
    if (!user) return "U";
    return (
      `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
      user.email?.[0]?.toUpperCase() ||
      "U"
    );
  }, [user]);

  const onLogout = async () => {
    await handleLogout(
      router,
      queryClient,
      getLocalizedHref,
      routesName.home.href,
    );
  };

  const profileFormDefinition: FormDefinition = React.useMemo(
    () => ({
      id: "profile-form",
      fields: [
        {
          key: "firstName",
          type: "text",
          label: common.firstName || "First Name",
          placeholder: common.firstName || "Enter first name",
          required: true,
          defaultValue: user?.firstName || "",
          validation: {
            minLength: 1,
            messages: {
              required: "First name is required",
            },
          },
        },
        {
          key: "lastName",
          type: "text",
          label: common.lastName || "Last Name",
          placeholder: common.lastName || "Enter last name",
          required: true,
          defaultValue: user?.lastName || "",
          validation: {
            minLength: 1,
            messages: {
              required: "Last name is required",
            },
          },
        },
        {
          key: "email",
          type: "email",
          label: common.email || "Email",
          placeholder: common.email || "Enter email address",
          required: true,
          defaultValue: user?.email || "",
          validation: {
            messages: {
              required: "Email is required",
              email: "Please enter a valid email address",
            },
          },
        },
      ],
      showResetButton: false,
      submitButtonText: profileDict.updateButton || "Update Profile",
      isLoading: updateProfile.isPending,
    }),
    [user, updateProfile.isPending, common, profileDict],
  );

  const passwordFormDefinition: FormDefinition = React.useMemo(
    () => ({
      id: "password-form",
      fields: [
        {
          key: "oldPassword",
          type: "password",
          label: profileDict.oldPassword || "Current Password",
          placeholder:
            profileDict.oldPasswordPlaceholder || "Enter your current password",
          required: true,
          validation: {
            minLength: 1,
            messages: {
              required: "Current password is required",
            },
          },
        },
        {
          key: "newPassword",
          type: "password",
          label: profileDict.newPassword || "New Password",
          placeholder:
            profileDict.newPasswordPlaceholder || "Enter your new password",
          required: true,
          validation: {
            minLength: 6,
            messages: {
              required: "New password is required",
              minLength: "Password must be at least 6 characters",
            },
          },
        },
        {
          key: "confirmPassword",
          type: "password",
          label: profileDict.confirmPassword || "Confirm New Password",
          placeholder:
            profileDict.confirmPasswordPlaceholder ||
            "Confirm your new password",
          required: true,
          validation: {
            minLength: 6,
            messages: {
              required: "Please confirm your password",
              minLength: "Password must be at least 6 characters",
            },
          },
        },
      ],
      showResetButton: false,
      submitButtonText: profileDict.changePasswordButton || "Change Password",
      isLoading: changePassword.isPending,
    }),
    [changePassword.isPending, profileDict],
  );

  const handleProfileSubmit = async (data: Record<string, unknown>) => {
    try {
      const updatedUser = await updateProfile.mutateAsync({
        firstName: data.firstName as string,
        lastName: data.lastName as string,
        email: data.email as string,
      });

      // Update user in store
      setUser(updatedUser);

      toast.success(
        profileDict.updateSuccess || "Profile updated successfully",
      );
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(profileDict.updateError || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (data: Record<string, unknown>) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        toast.error(profileDict.passwordMismatch || "Passwords do not match");
        return;
      }

      await changePassword.mutateAsync({
        oldPassword: data.oldPassword as string,
        newPassword: data.newPassword as string,
      });

      toast.success(
        profileDict.passwordChangeSuccess || "Password changed successfully",
      );
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error(
        profileDict.passwordChangeError || "Failed to change password",
      );
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto flex min-h-[400px] items-center justify-center py-12">
        <div className="text-center">
          <Loading size="lg" message="Loading profile..." />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Profile Header */}
        <Card className="border-border/50 from-primary/5 via-primary/10 to-primary/5 overflow-hidden bg-gradient-to-r pb-6">
          <CardHeader className="">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Avatar className="border-background size-24 border-4 shadow-lg">
                    <AvatarImage
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-3xl font-bold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                <div className="space-y-1">
                  <CardTitle className="text-3xl font-bold">
                    {user.firstName} {user.lastName}
                  </CardTitle>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                    <CardDescription className="flex items-center gap-2 text-base">
                      <Mail className="size-4" />
                      {user.email}
                    </CardDescription>
                  </div>
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={onLogout}
                className="gap-2"
              >
                <LogOut className="size-4" />
                {profileDict.logout || "Log out"}
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Profile Information Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="size-5" />
                {profileDict.title || "Profile Information"}
              </CardTitle>
              <CardDescription>
                {profileDict.description ||
                  "Update your profile information below."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "max-h-[70vh] overflow-y-auto",
                  isRTL && "rtl:text-start",
                )}
              >
                <DynamicForm
                  definition={profileFormDefinition}
                  onSubmit={handleProfileSubmit}
                />
              </div>
            </CardContent>
          </Card>

          {/* Password Change Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="size-5" />
                {profileDict.passwordTitle || "Change Password"}
              </CardTitle>
              <CardDescription>
                {profileDict.passwordDescription ||
                  "Update your password to keep your account secure."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "max-h-[70vh] overflow-y-auto",
                  isRTL && "rtl:text-start",
                )}
              >
                <DynamicForm
                  definition={passwordFormDefinition}
                  onSubmit={handlePasswordSubmit}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Solved Quizzes Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="size-5" />
              {t.header?.userMenu?.myQuizzes || "My Quizzes"}
            </CardTitle>
            <CardDescription>
              {solvedQuizzes.length > 0
                ? `${solvedQuizzes.length} ${
                    solvedQuizzes.length > 1 ? "quizzes" : "quiz"
                  } solved`
                : "You haven't solved any quizzes yet."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingQuizzes ? (
              <div className="flex items-center justify-center py-12">
                <Loading size="md" message="Loading solved quizzes..." />
              </div>
            ) : solvedQuizzes.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  {quizzesDict.results?.noQuizzesFound ||
                    "No solved quizzes yet. Start solving quizzes to see them here!"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {solvedQuizzes.map((quiz) => (
                  <QuizCard key={quiz.id} quiz={quiz} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default ProfilePage;
