import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.services/user.service";
import type { UserInput } from "@/services/user.services/user.type";
import { queryKeys, type PartialQueryParams } from "@/utils/query-keys";
import { readCookieFromDocument } from "@/utils/cookies";
import { myCookies } from "@/utils/cookies";

const queryKey = queryKeys.user;

export function useUsers(params?: PartialQueryParams) {
  return useQuery({
    queryKey: queryKey.getList(params),
    queryFn: () => userService.getUsers(params),
  });
}

export function useUserById(id: string) {
  return useQuery({
    queryKey: queryKey.detail(id),
    queryFn: () => userService.getUserById(id),
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
      queryClient.invalidateQueries({
        queryKey: queryKey.getList(),
      });
    },
  });
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserInput) => userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey.getList(),
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKey.getList(),
      });
    },
  });
}
