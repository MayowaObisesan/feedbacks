// hooks/useUser.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession, useUser } from "@clerk/nextjs";
import { UserResource } from "@clerk/types";
import { useEffect } from "react";

import { supabase } from "@/utils/supabase/supabase";
import { DBTables } from "@/types/enums";
import { Brand, IUser } from "@/types";
import { useFeedbacksContext } from "@/context";

export const useRealTimeUsers = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("user-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: DBTables.User,
        },
        (payload) => {
          // Invalidate user-related queries
          queryClient.invalidateQueries({
            predicate: (query) => {
              const queryKey = query.queryKey[0];

              return (
                typeof queryKey === "string" &&
                (queryKey === "user" ||
                  queryKey === "userDB" ||
                  queryKey === "userAndUserDB")
              );
            },
          });
        },
      )
      .subscribe();

    return () => {
      console.log("removing user-changes");
      supabase.channel("user-changes").unsubscribe();
    };
  }, [queryClient]);
};

export const useUserQuery = () => {
  const { user } = useUser();
  const getUser = async () => {
    /*const {
      data: { user },
    } = await supabase.auth.getUser();
    */

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
  user: UserResource | null; // Replace 'any' with your User type from supabase.auth
  userDB: IUser | null;
  myBrands: Brand[] | null;
  followedBrands: Brand[] | null;
}

export const useUserAndUserDBQuery = () => {
  const { user } = useUser();

  const fetchUserAndUserDB = async (): Promise<BatchResponse> => {
    const batchResponse: BatchResponse = {
      user: null,
      userDB: null,
      myBrands: [],
      followedBrands: [],
    };

    // const {
    //   data: { user },
    // } = await supabase.auth.getUser();

    if (user) {
      const { data: userDB } = await supabase
        .from(DBTables.User)
        .select("*")
        .eq("email", user?.primaryEmailAddress?.emailAddress)
        .single();

      const { data: myBrands } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .eq("owner_email", user?.primaryEmailAddress?.emailAddress)
        .order("created_at", { ascending: false })
        .range(0, 10);

      const { data: brandsFollowedIds } = await supabase
        .from(DBTables.BrandFollowers)
        .select("brand_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      // Fetch the brandsData for brands you follow
      const { data: followedBrands } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .in("id", Object.values(brandsFollowedIds!));

      const transformedData = myBrands
        ? await Promise.all(
            myBrands.map(async (eachBrand: Brand) => {
              // Fetch all feedbacks count of this brand
              const { count } = await supabase
                .from(DBTables.Feedback)
                .select("*", { count: "exact", head: true })
                .eq("recipient_id", eachBrand.id);

              // Fetch all followers count of this brand
              const { count: followersCount } = await supabase
                .from(DBTables.BrandFollowers)
                .select("*", { count: "exact", head: true })
                .eq("brand_id", eachBrand.id);

              return {
                ...eachBrand,
                feedback_count: count || 0,
                followers_count: followersCount || 0,
              };
            }),
          )
        : [];

      batchResponse.user = user;
      batchResponse.userDB = userDB;
      batchResponse.myBrands = transformedData;
      batchResponse.followedBrands = followedBrands || [];
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
      followedBrands: [],
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { supabaseClient } = useFeedbacksContext();

  return useMutation({
    mutationFn: async (userData: IUser) => {
      const { data, error } = await supabaseClient
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
  const { supabaseClient } = useFeedbacksContext();

  return useMutation({
    mutationFn: async ({
      email,
      updates,
    }: {
      email: string;
      updates: Partial<IUser>;
    }) => {
      const { data, error } = await supabaseClient
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

export const useCreateOrUpdateUser = () => {
  const queryClient = useQueryClient();
  const { supabaseClient } = useFeedbacksContext();
  const { session } = useSession();

  return useMutation({
    mutationFn: async ({
      email,
      updates,
    }: {
      email: string;
      updates: Partial<IUser>;
    }) => {
      const { count } = await supabase
        .from(DBTables.User)
        .select("*", { count: "exact", head: true })
        .eq("email", email);

      if (count === 0) {
        const { data, error } = await supabaseClient
          .from(DBTables.User)
          .insert([
            {
              ...updates,
              email: session?.user.primaryEmailAddress?.emailAddress,
              user_data: session?.user,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        return data;
      } else {
        const { data, error } = await supabaseClient
          .from(DBTables.User)
          .update({ ...updates, updated_at: new Date() })
          .eq("email", email)
          .select()
          .single();

        if (error) throw error;

        return data;
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user", data.email], data);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { supabaseClient } = useFeedbacksContext();

  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabaseClient
        .from(DBTables.User)
        .delete()
        .eq("email", email);

      if (error) throw error;

      return email;
    },
    onSuccess: (email) => {
      queryClient.invalidateQueries({ queryKey: ["user", email] });
      queryClient.removeQueries({ queryKey: ["user", email] });
    },
  });
};
