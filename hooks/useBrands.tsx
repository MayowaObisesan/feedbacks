import type { TablesInsert, Tables } from "@/types/supabase";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/utils/supabase/supabase";
import { DBTables } from "@/types/enums";
import { IBrands } from "@/types";

type Brand = Tables<DBTables.Brand>;
type BrandInsert = TablesInsert<DBTables.Brand>;

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
        .order("feedbackCount", { ascending: false })
        .order("followersCount", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data;
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
        .order("createdAt", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data;
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
        .order("feedbackCount", { ascending: false })
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
        .order("followersCount", { ascending: false })
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
        .order("createdAt", { ascending: false })
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
        .order("createdAt", { ascending: false })
        .range(startRange, endRange);

      if (error) throw error;

      return data;
    },
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
        .eq("ownerEmail", email)
        .order("createdAt", { ascending: false })
        .range(startRange, endRange);

      if (error) throw error;

      return data;
    },
  });
};

// Fetch my brands
export const useFollowedBrands = (email: string, page: number = 1) => {
  const DEFAULT_LOAD_COUNT = 10;
  const startRange = DEFAULT_LOAD_COUNT * (page - 1);
  const endRange = DEFAULT_LOAD_COUNT * page - 1;

  return useQuery({
    queryKey: ["followedBrands"],
    queryFn: async (): Promise<Brand[]> => {
      const { data, error } = await supabase
        .from(DBTables.Brand)
        .select("*")
        .contains("followers", [email])
        .order("createdAt", { ascending: false })
        .range(startRange, endRange);

      if (error) throw error;

      const isFollowed =
        data.filter((eachBrand: IBrands) => eachBrand.followers.includes(email))
          .length > 0;

      // return [...data, isFollowed];
      return data;
    },
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

      return data;
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

      return data;
    },
    enabled: !!name,
  });
};

// Create brand mutation
export const useCreateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newBrand: BrandInsert) => {
      const { data, error } = await supabase
        .from(DBTables.Brand)
        .insert(newBrand)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brands"] });
    },
  });
};

// Update brand mutation
export const useUpdateBrand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Brand> & { id: number }) => {
      const { data, error } = await supabase
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
