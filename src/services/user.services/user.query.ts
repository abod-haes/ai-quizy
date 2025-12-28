import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { userService } from "@/services/user.services/user.service";
import type { UserInput, User } from "@/services/user.services/user.type";
import { queryKeys, type PartialQueryParams } from "@/utils/query-keys";
import { readCookieFromDocument } from "@/utils/cookies";
import { myCookies } from "@/utils/cookies";
import { useAuthStore } from "@/store/auth.store";

const queryKey = queryKeys.user;

export function useUsers(
  params?: PartialQueryParams & { Role?: number },
) {
  return useQuery({
    queryKey: queryKey.getList(params),
    queryFn: () => userService.getUsers(params),
  });
}

export function useUserById(
  id: string,
  options?: Omit<UseQueryOptions<User, Error>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKey.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: options?.enabled !== false && !!id,
    ...options,
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKey.currentUser(),
    queryFn: () => userService.getCurrentUser(),
    enabled: !!readCookieFromDocument(myCookies.auth),
    staleTime: 0,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserInput) => userService.createUser(data),
    onSuccess: () => {
      // Invalidate all user list queries to refetch data
      queryClient.invalidateQueries({
        queryKey: ["user", "list"],
      });
    },
  });
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserInput) => userService.updateUser(id, data),
    onSuccess: () => {
      // Invalidate all user list queries and specific user detail to refetch data
      queryClient.invalidateQueries({
        queryKey: ["user", "list"],
      });
      queryClient.invalidateQueries({
        queryKey: queryKey.detail(id),
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: (_, deletedId) => {
      // Invalidate all user list queries to refetch data
      queryClient.invalidateQueries({
        queryKey: ["user", "list"],
      });
      // Also invalidate the specific user detail query
      queryClient.invalidateQueries({
        queryKey: queryKey.detail(deletedId),
      });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: { firstName: string; lastName: string; email: string }) =>
      userService.updateProfile(data),
    onSuccess: (updatedUser) => {
      // Update the user in the auth store
      setUser(updatedUser);
      // Invalidate current user query
      queryClient.invalidateQueries({
        queryKey: queryKey.currentUser(),
      });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) =>
      userService.changePassword(data),
  });
}
