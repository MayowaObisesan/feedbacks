import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { supabase } from "@/utils/supabase/supabase";
import { DBTables } from "@/types/enums";
import { Brand, BrandInsert } from "@/types";
import { useFeedbacksContext } from "@/context";

export const useRealTimeBrands = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase
      .channel("brand-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: DBTables.Brand,
        },
        (payload) => {
          queryClient.invalidateQueries({
            predicate: (query) => {
              const queryKey = query.queryKey[0];

              return typeof queryKey === "string" && queryKey === "brands";
            },
          });
        },
      )
      .subscribe();

    return () => {
      supabase.channel("brand-changes").unsubscribe();
    };
  }, [queryClient]);
};

// Fetch trending brands based on multiple criteria
export const useTrendingBrands = (
  limit: number = 5,
  timeframe: string = "7d",
) => {
  return useQuery({
    queryKey: ["brands", "trending", limit, timeframe],
    queryFn: async (): Promise<Brand[]> => {
      // Calculate date range based on timeframe
      const now = new Date();
      const pastDate = new Date();
      const days = parseInt(timeframe) || 7;

      pastDate.setDate(now.getDate() - days);

      const { data, error } = await supabase
        .from(DBTables.Brand)
        .select("*")
        // .gte("createdAt", pastDate.toISOString())
        .order("feedback_count", { ascending: false })
        .order("followers_count", { ascending: false })
        .limit(limit);

      if (error) throw error;

      const transformedData = await Promise.all(
        data?.map(async (eachBrand) => {
          // Fetch all feedbacks count of this brand
          const { count } = await supabase
            .from(DBTables.Feedback)
            .select("*", { count: "exact", head: true })
            .eq("recipient_id", eachBrand.id);

          return {
            ...eachBrand,
            feedback_count: count || 0,
          };
        }),
      );

      // return data;
      return transformedData || [];
    },
  });
};

// Fetch latest brands with limit
export const useLatestBrands = (limit: number = 5) => {
  return useQuery({
    queryKey: ["brands", "latest", limit],
    queryFn: async (): Promise<Brand[]> => {
      const { data, error } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      const transformedData = await Promise.all(
        data?.map(async (eachBrand) => {
          // Fetch all feedbacks count of this brand
          const { count } = await supabase
            .from(DBTables.Feedback)
            .select("*", { count: "exact", head: true })
            .eq("recipient_id", eachBrand.id);

          return {
            ...eachBrand,
            feedback_count: count || 0,
          };
        }),
      );

      return transformedData || [];
    },
  });
};

// By feedback count (trending)
export const useLatestBrandsByFeedback = (limit: number = 5) => {
  return useQuery({
    queryKey: ["brands", "latest", "feedback", limit],
    queryFn: async (): Promise<Brand[]> => {
      const { data, error } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .order("feedback_count", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data;
    },
  });
};

// By followers count (popular)
export const useLatestBrandsByFollowers = (limit: number = 5) => {
  return useQuery({
    queryKey: ["brands", "latest", "followers", limit],
    queryFn: async (): Promise<Brand[]> => {
      const { data, error } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .order("followers_count", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data;
    },
  });
};

// By category
export const useLatestBrandsByCategory = (
  category: string,
  limit: number = 5,
) => {
  return useQuery({
    queryKey: ["brands", "latest", "category", category, limit],
    queryFn: async (): Promise<Brand[]> => {
      const { data, error } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data;
    },
    enabled: !!category,
  });
};

// Fetch all brands
export const useBrands = (page: number = 1) => {
  const DEFAULT_LOAD_COUNT = 10;
  const startRange = DEFAULT_LOAD_COUNT * (page - 1);
  const endRange = DEFAULT_LOAD_COUNT * page - 1;

  return useQuery({
    queryKey: ["brands"],
    queryFn: async (): Promise<Brand[]> => {
      const { data, error } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .order("created_at", { ascending: false })
        .range(startRange, endRange);

      if (error) throw error;

      const transformedData = await Promise.all(
        data?.map(async (eachBrand) => {
          // Fetch all feedbacks count of this brand
          const { count } = await supabase
            .from(DBTables.Feedback)
            .select("*", { count: "exact", head: true })
            .eq("recipient_id", eachBrand.id);

          return {
            ...eachBrand,
            feedback_count: count || 0,
          };
        }),
      );

      return transformedData || [];
    },
    maxPages: 30,
  });
};

// Fetch my brands
export const useMyBrands = (email: string, page: number = 1) => {
  const DEFAULT_LOAD_COUNT = 10;
  const startRange = DEFAULT_LOAD_COUNT * (page - 1);
  const endRange = DEFAULT_LOAD_COUNT * page - 1;

  return useQuery({
    queryKey: ["myBrands"],
    queryFn: async (): Promise<Brand[]> => {
      const { data, error } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .eq("owner_email", email)
        .order("created_at", { ascending: false })
        .range(startRange, endRange);

      if (error) throw error;

      const transformedData = await Promise.all(
        data?.map(async (eachBrand) => {
          // Fetch all feedbacks count of this brand
          const { count } = await supabase
            .from(DBTables.Feedback)
            .select("*", { count: "exact", head: true })
            .eq("recipient_id", eachBrand.id);

          return {
            ...eachBrand,
            feedback_count: count || 0,
          };
        }),
      );

      return transformedData || [];
    },
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};

// Fetch my brands
export const useFollowedBrands = (email: string, page: number = 1) => {
  const DEFAULT_LOAD_COUNT = 10;
  const startRange = DEFAULT_LOAD_COUNT * (page - 1);
  const endRange = DEFAULT_LOAD_COUNT * page - 1;

  return useQuery({
    queryKey: ["followedBrands", email],
    queryFn: async (): Promise<Brand[]> => {
      const { data, error } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .contains("followers", [email])
        .order("created_at", { ascending: false })
        .range(startRange, endRange);

      console.log("Followed brands query", email, data);

      if (error) throw error;

      const isFollowed =
        data.filter((eachBrand: Brand) => eachBrand.followers?.includes(email))
          .length > 0;

      // return [...data, isFollowed];
      return data;
    },
    enabled: !!email,
  });
};

// Fetch single brand
export const useBrandById = (id: number) => {
  return useQuery({
    queryKey: ["brands", id],
    queryFn: async (): Promise<Brand> => {
      const { data, error } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      const { count } = await supabase
        .from(DBTables.Feedback)
        .select("*", { count: "exact", head: true })
        .eq("recipient_id", id);

      return { ...data, feedback_count: count };
    },
    enabled: !!id,
  });
};

// Fetch single brand using brandName
export const useBrandByName = (name: string) => {
  return useQuery({
    queryKey: ["brands", name],
    queryFn: async (): Promise<Brand> => {
      const { data, error } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .eq("name", name)
        .single();

      if (error) throw error;

      const { count } = await supabase
        .from(DBTables.Feedback)
        .select("*", { count: "exact", head: true })
        .eq("recipient_id", data?.id);

      return { ...data, feedback_count: count };
    },
    enabled: !!name,
  });
};

// Create brand mutation
export const useCreateBrand = () => {
  const queryClient = useQueryClient();
  const { supabaseClient } = useFeedbacksContext();

  return useMutation({
    mutationFn: async (newBrand: BrandInsert) => {
      const { data, error } = await supabaseClient
        .from(DBTables.Brand)
        .insert(newBrand)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["myBrands"] });
      // Invalidate all brand-related queries
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey[0];

          return typeof queryKey === "string" && queryKey === "brands";
        },
      });
    },
  });
};

// Update brand mutation
export const useUpdateBrand = () => {
  const queryClient = useQueryClient();
  const { supabaseClient } = useFeedbacksContext();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Brand> & { id: number }) => {
      const { data, error } = await supabaseClient
        .from(DBTables.Brand)
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
      queryClient.invalidateQueries({ queryKey: ["brands", variables.id] });
    },
  });
};
