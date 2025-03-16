import type { Tables } from "@/types/supabase";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/utils/supabase/supabase";
import { DBTables } from "@/types/enums";

type Feedback = Tables<DBTables.Feedback>;
type FeedbackLikes = Tables<DBTables.FeedbackLikes>;

export function useTrendingFeedbacks(limit: number = 5, daysAgo: number = 7) {
  const fetchTrendingFeedbacks = async (): Promise<Feedback[]> => {
    const dateThreshold = new Date();

    dateThreshold.setDate(dateThreshold.getDate() - daysAgo);

    const { data, error } = await supabase
      .from(DBTables.Feedback)
      .select("*")
      // .gte("createdAt", dateThreshold.toISOString())
      .gte("starRating", 2) // Only fetch feedbacks with rating >= 4
      .order("starRating", { ascending: false })
      .order("createdAt", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(error.message);
    }

    return data as Feedback[];
  };

  return useQuery({
    queryKey: ["trending-feedbacks", limit, daysAgo],
    queryFn: fetchTrendingFeedbacks,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useAllFeedbacks(limit: number = 10, page: number = 1) {
  const startRange = limit * (page - 1);
  const endRange = limit * page - 1;

  const fetchAllFeedbacks = async (): Promise<{
    data: Feedback[];
    count: number;
  }> => {
    const { count, data, error } = await supabase
      .from(DBTables.Feedback)
      .select("*", { count: "exact", head: false })
      .order("createdAt", { ascending: false })
      .range(startRange, endRange);

    if (error) {
      throw new Error(error.message);
    }

    return {
      data: data as Feedback[],
      count: count || 0,
    };
  };

  return useQuery({
    queryKey: ["all-feedbacks", page, limit],
    queryFn: fetchAllFeedbacks,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

type FeedbackWithCounts = Feedback & {
  helpfulResponseCount: number;
  unhelpfulResponseCount: number;
  isHelpful: boolean;
  isUnhelpful: boolean;
};
export function useBrandFeedbacks(
  brandId: number | string,
  email?: string,
  page: number = 1,
  limit: number = 10,
) {
  const DEFAULT_LOAD_COUNT = limit;
  const startRange = DEFAULT_LOAD_COUNT * (page - 1);
  const endRange = DEFAULT_LOAD_COUNT * page - 1;

  const fetchFeedbacks = async (): Promise<{
    data: FeedbackWithCounts[];
    count: number;
  }> => {
    const [feedbackResponse, likesResponse] = await Promise.all([
      // Fetch feedbacks
      supabase
        .from(DBTables.Feedback)
        .select("*", { count: "exact", head: false })
        .eq("recipientId", brandId)
        .order("createdAt", { ascending: false })
        .range(startRange, endRange),

      // Fetch all likes for this brand's feedbacks
      supabase.from(DBTables.FeedbackLikes).select("*").eq("brand_id", brandId),
    ]);

    if (feedbackResponse.error) {
      throw new Error(feedbackResponse.error.message);
    }
    if (likesResponse.error) {
      throw new Error(likesResponse.error.message);
    }

    const feedbacks = feedbackResponse.data || [];

    const likes = likesResponse.data || [];

    // Transform the data to include likes information
    const transformedData = feedbacks.map((feedback) => {
      const feedbackLikes: FeedbackLikes[] = likes.filter(
        (like) => like.feedback_id === feedback.id,
      );

      return {
        ...feedback,
        likesCount:
          feedbackLikes.length > 0 ? feedbackLikes[0].likes?.length : 0,
        dislikesCount:
          feedbackLikes.length > 0 ? feedbackLikes[0].dislikes?.length : 0,
        hasLiked:
          email && feedbackLikes.length > 0
            ? feedbackLikes[0].likes?.some((like: string) => like === email)
            : false,
        hasDisliked:
          email && feedbackLikes.length > 0
            ? feedbackLikes[0].dislikes?.some(
                (dislike: string) => dislike === email,
              )
            : false,
      };
    });

    /*// Transform the data to include the count
    const transformedData =
      data?.map((feedback) => ({
        ...feedback,
        helpfulResponseCount: feedback.likes?.length || 0,
        unhelpfulResponseCount: feedback.likes?.length || 0,
        isHelpful: email
          ? feedback.helpfulResponses?.includes(email) || false
          : false,
        isUnhelpful: email
          ? feedback.unhelpfulResponses?.includes(email) || false
          : false,
      })) || [];*/

    return { data: transformedData, count: feedbackResponse.count || 0 };
  };

  return useQuery({
    queryKey: ["feedbacks", brandId],
    queryFn: fetchFeedbacks,
    enabled: !!brandId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

// Optional mutation hook for creating feedbacks
export function useCreateFeedback() {
  const createFeedback = async (
    feedback: Omit<Feedback, "id" | "created_at">,
  ) => {
    const { data, error } = await supabase
      .from(DBTables.Feedback)
      .insert([feedback])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  return useMutation({
    mutationFn: createFeedback,
  });
}

// Fetch single feedback by ID
export function useFeedbackById(id: string) {
  const fetchFeedback = async (): Promise<Feedback> => {
    const { data, error } = await supabase
      .from(DBTables.Feedback)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  };

  return useQuery({
    queryKey: ["feedback", id],
    queryFn: fetchFeedback,
    enabled: !!id,
  });
}

// Update feedback mutation
export function useUpdateFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<Feedback> & { id: number }) => {
      const { data, error } = await supabase
        .from(DBTables.Feedback)
        .update(updates)
        .eq("id", id)
        .select();

      console.log(updates, data);

      if (error) {
        console.error("update feedback error", error.message);
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["feedback", variables.id] });
    },
  });
}

// Update feedback mutation
export function useUpdateFeedbackLikes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updates
    }: Partial<FeedbackLikes> & { id: number }) => {
      const { count } = await supabase
        .from(DBTables.FeedbackLikes)
        .select("*", { count: "exact", head: true })
        .eq("feedback_id", id);

      if (count === 0) {
        // No one has liked or disliked this feedback yet.
        const { data, error } = await supabase
          .from(DBTables.FeedbackLikes)
          .insert(updates)
          .eq("feedback_id", id)
          .select();

        if (error) {
          throw new Error(error.message);
        }

        return data;
      } else {
        // At lease one person have liked or disliked this feedback.
        const { data, error } = await supabase
          .from(DBTables.FeedbackLikes)
          .update(updates)
          .eq("feedback_id", id)
          .select();

        if (error) {
          throw new Error(error.message);
        }

        return data;
      }
    },
    onSuccess: (_, variables) => {
      // queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["feedback", variables.id] });
    },
  });
}

// Delete feedback mutation
export function useDeleteFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from(DBTables.Feedback)
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      queryClient.invalidateQueries({ queryKey: ["feedback", id] });
    },
  });
}

export function useMySentFeedbacks(email: string, page: number = 1) {
  const DEFAULT_LOAD_COUNT = 10;
  const startRange = DEFAULT_LOAD_COUNT * (page - 1);
  const endRange = DEFAULT_LOAD_COUNT * page - 1;

  const fetchMySentFeedbacks = async (): Promise<Feedback[]> => {
    const { data, error } = await supabase
      .from(DBTables.Feedback)
      .select("*", { count: "exact", head: false })
      .eq("email", email)
      .order("createdAt", { ascending: false })
      .range(startRange, endRange);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  };

  return useQuery({
    queryKey: ["my-sent-feedbacks", page],
    queryFn: fetchMySentFeedbacks,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useStarRatingCounts(brandId?: number | string) {
  const fetchStarRatingCounts = async (): Promise<number[]> => {
    const queries = [1, 2, 3].map((rating) =>
      supabase
        .from(DBTables.Feedback)
        .select("*", { count: "exact", head: true })
        .match({
          starRating: rating,
          recipientId: brandId,
        }),
    );

    const results = await Promise.all(queries);

    return results.map((result) => result.count || 0);
  };

  return useQuery({
    queryKey: ["star-rating-counts", brandId],
    queryFn: fetchStarRatingCounts,
    enabled: !!brandId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

export const useFilteredFeedbacks = (
  brandId?: number | string,
  starRating?: number,
) => {
  return useQuery({
    queryKey: ["filtered-feedbacks", brandId, starRating],
    queryFn: async () => {
      let query = supabase
        .from(DBTables.Feedback)
        .select("*")
        .eq("recipientId", brandId)
        .order("createdAt", { ascending: false });

      if (starRating) {
        query = query.eq("starRating", starRating);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data;
    },
    enabled: !!brandId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
