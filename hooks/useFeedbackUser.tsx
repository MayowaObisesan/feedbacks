// hooks/useUser.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@supabase/auth-js";

import { supabase } from "@/utils/supabase/supabase";
import { DBTables } from "@/types/enums";
import { Brand, IUser } from "@/types";

export const useUserQuery = () => {
  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  };

  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
};

export const useUserDBQuery = (email: string) => {
  const getUserDB = async (email: string) => {
    const { data, error } = await supabase
      .from(DBTables.User)
      .select("*")
      .eq("email", email)
      .single();

    if (error) throw error;

    return data;
  };

  return useQuery({
    queryKey: ["userDB", email],
    queryFn: () => getUserDB(email),
    enabled: !!email,
  });
};

// hooks/useFeedbackUser.tsx
interface BatchResponse {
  user: User | null; // Replace 'any' with your User type from supabase.auth
  userDB: IUser | null;
  myBrands: Brand[] | null;
}

export const useUserAndUserDBQuery = () => {
  const fetchUserAndUserDB = async (): Promise<BatchResponse> => {
    const batchResponse: BatchResponse = {
      user: null,
      userDB: null,
      myBrands: [],
    };

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: userDB } = await supabase
        .from(DBTables.User)
        .select("*")
        .eq("email", user?.email)
        .single();

      const { data: myBrands } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .eq("ownerEmail", user?.email)
        .order("createdAt", { ascending: false })
        .range(0, 10);

      batchResponse.user = user;
      batchResponse.userDB = userDB;
      batchResponse.myBrands = myBrands;
    }

    return batchResponse;
  };

  return useQuery({
    queryKey: ["userAndUserDB"],
    queryFn: fetchUserAndUserDB,
    staleTime: Infinity, // Keep data fresh indefinitely
    gcTime: 1000 * 60 * 60, // Cache for 1 hour
    /*initialData: {
      user: null,
      userDB: null,
    },*/
    // Initialize with empty state to prevent flash
    placeholderData: {
      user: null,
      userDB: null,
      myBrands: [],
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: IUser) => {
      const { data, error } = await supabase
        .from(DBTables.User)
        .insert([userData])
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user", data.email], data);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      updates,
    }: {
      email: string;
      updates: Partial<IUser>;
    }) => {
      const { data, error } = await supabase
        .from(DBTables.User)
        .update(updates)
        .eq("email", email)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user", data.email], data);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase
        .from(DBTables.User)
        .delete()
        .eq("email", email);

      if (error) throw error;

      return email;
    },
    onSuccess: (email) => {
      queryClient.invalidateQueries({ queryKey: ["user", email] });
    },
  });
};
