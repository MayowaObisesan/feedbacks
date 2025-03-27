import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { supabase } from "@/utils/supabase/supabase";
import { DBTables } from "@/types/enums";
import {
  Brand,
  BrandFollowersInsert,
  BrandInsert,
  ExtendedBrand,
} from "@/types";
import { useFeedbacksContext } from "@/context";

async function brandExtendedQuery(brandData: Brand, user_id?: string) {
  const [
    feedbackCountResponse,
    brandFollowersCountResponse,
    brandFollowersResponse,
  ] = await Promise.all([
    supabase
      .from(DBTables.Feedback)
      .select("*", { count: "exact", head: true })
      .eq("recipient_id", brandData?.id),

    supabase
      .from(DBTables.BrandFollowers)
      .select("*", { count: "exact", head: true })
      .eq("brand_id", brandData?.id),

    supabase
      .from(DBTables.BrandFollowers)
      .select("*", { count: "exact", head: true })
      .match({ brand_id: brandData?.id, user_id: user_id }),
  ]);

  return [
    feedbackCountResponse,
    brandFollowersCountResponse,
    brandFollowersResponse,
  ];
}

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

export const useRealTimeBrandsFollowers = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase
      .channel("brand-followers-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: DBTables.BrandFollowers,
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      supabase.channel("brand-followers-changes").unsubscribe();
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
        // .order("feedback_count", { ascending: false })
        // .order("followers_count", { ascending: false })
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
export const useBrands = (limit = 10, page: number = 1) => {
  const DEFAULT_LOAD_COUNT = limit;
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
export const useFollowedBrands = (user_id: string, page: number = 1) => {
  const DEFAULT_LOAD_COUNT = 10;
  const startRange = DEFAULT_LOAD_COUNT * (page - 1);
  const endRange = DEFAULT_LOAD_COUNT * page - 1;

  return useQuery({
    queryKey: ["followedBrands", user_id],
    queryFn: async (): Promise<Brand[]> => {
      const { data: brandsFollowed, error } = await supabase
        .from(DBTables.BrandFollowers)
        .select("brand_id")
        .eq("user_id", user_id)
        .order("created_at", { ascending: false })
        .range(startRange, endRange);

      if (error) throw error;

      const { data } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .in("id", Object.values(brandsFollowed));

      return data || [];
    },
    enabled: !!user_id,
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
export const useBrandByName = (name: string, user_id?: string) => {
  return useQuery({
    queryKey: ["brands", name],
    queryFn: async (): Promise<ExtendedBrand> => {
      const { data, error } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .eq("name", name)
        .single();

      if (error) throw error;

      const [
        feedbackCountResponse,
        brandFollowersCountResponse,
        brandFollowersResponse,
      ] = await brandExtendedQuery(data, user_id);

      return {
        ...data,
        feedback_count: feedbackCountResponse.count || 0,
        followers_count: brandFollowersCountResponse.count || 0,
        is_following: !!brandFollowersResponse?.count,
      };
    },
    enabled: !!name,
    gcTime: 1000 * 60 * 60, // 1 hour
    staleTime: 1000 * 60 * 60,
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

// Follow Brand
export const useFollowBrand = () => {
  const queryClient = useQueryClient();
  const { supabaseClient } = useFeedbacksContext();

  return useMutation({
    mutationFn: async (newBrand: BrandFollowersInsert) => {
      const { data, error } = await supabaseClient
        .from(DBTables.BrandFollowers)
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

// Unfollow Brand
export const useUnfollowBrand = () => {
  const queryClient = useQueryClient();
  const { supabaseClient } = useFeedbacksContext();

  return useMutation({
    mutationFn: async (updates: Partial<BrandFollowersInsert>) => {
      const { data, error } = await supabaseClient
        .from(DBTables.BrandFollowers)
        .delete()
        .match({ brand_id: updates.brand_id, user_id: updates.user_id });

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
