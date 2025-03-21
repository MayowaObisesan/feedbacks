export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      Brand: {
        Row: {
          api: string | null;
          brandImage: string | null;
          category: string | null;
          createdAt: string;
          description: string | null;
          feedbackCount: number | null;
          followers: string[] | null;
          followersCount: number | null;
          id: number;
          name: string;
          ownerEmail: string | null;
          rawName: string;
          updatedAt: string | null;
          userApiKey: string | null;
        };
        Insert: {
          api?: string | null;
          brandImage?: string | null;
          category?: string | null;
          createdAt?: string;
          description?: string | null;
          feedbackCount?: number | null;
          followers?: string[] | null;
          followersCount?: number | null;
          id?: number;
          name: string;
          ownerEmail?: string | null;
          rawName: string;
          updatedAt?: string | null;
          userApiKey?: string | null;
        };
        Update: {
          api?: string | null;
          brandImage?: string | null;
          category?: string | null;
          createdAt?: string;
          description?: string | null;
          feedbackCount?: number | null;
          followers?: string[] | null;
          followersCount?: number | null;
          id?: number;
          name?: string;
          ownerEmail?: string | null;
          rawName?: string;
          updatedAt?: string | null;
          userApiKey?: string | null;
        };
        Relationships: [];
      };
      Feedback: {
        Row: {
          beAnonymous: boolean | null;
          createdAt: string;
          description: string;
          email: string;
          eventId: number | null;
          fromEmbed: boolean | null;
          hashTags: string | null;
          id: number;
          productId: number | null;
          recipientId: number;
          screenshots: string | null;
          starRating: number | null;
          title: string | null;
          updatedAt: string | null;
        };
        Insert: {
          beAnonymous?: boolean | null;
          createdAt?: string;
          description: string;
          email: string;
          eventId?: number | null;
          fromEmbed?: boolean | null;
          hashTags?: string | null;
          id?: number;
          productId?: number | null;
          recipientId: number;
          screenshots?: string | null;
          starRating?: number | null;
          title?: string | null;
          updatedAt?: string | null;
        };
        Update: {
          beAnonymous?: boolean | null;
          createdAt?: string;
          description?: string;
          email?: string;
          eventId?: number | null;
          fromEmbed?: boolean | null;
          hashTags?: string | null;
          id?: number;
          productId?: number | null;
          recipientId?: number;
          screenshots?: string | null;
          starRating?: number | null;
          title?: string | null;
          updatedAt?: string | null;
        };
        Relationships: [];
      };
      feedback_likes: {
        Row: {
          brand_id: number;
          created_at: string;
          dislikes: string[] | null;
          feedback_id: number;
          id: number;
          likes: string[] | null;
        };
        Insert: {
          brand_id: number;
          created_at?: string;
          dislikes?: string[] | null;
          feedback_id: number;
          id?: number;
          likes?: string[] | null;
        };
        Update: {
          brand_id?: number;
          created_at?: string;
          dislikes?: string[] | null;
          feedback_id?: number;
          id?: number;
          likes?: string[] | null;
        };
        Relationships: [];
      };
      feedback_replies: {
        Row: {
          brand_id: number;
          created_at: string;
          feedback_id: number;
          id: number;
          owner_email: string | null;
          reply: string | null;
          updated_at: string | null;
        };
        Insert: {
          brand_id: number;
          created_at?: string;
          feedback_id: number;
          id?: number;
          owner_email?: string | null;
          reply?: string | null;
          updated_at?: string | null;
        };
        Update: {
          brand_id?: number;
          created_at?: string;
          feedback_id?: number;
          id?: number;
          owner_email?: string | null;
          reply?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      User: {
        Row: {
          bio: string;
          createdAt: string;
          dp: string | null;
          email: string | null;
          id: number;
          updatedAt: string;
          userData: Json;
          userId: string | null;
        };
        Insert: {
          bio: string;
          createdAt?: string;
          dp?: string | null;
          email?: string | null;
          id?: number;
          updatedAt?: string;
          userData: Json;
          userId?: string | null;
        };
        Update: {
          bio?: string;
          createdAt?: string;
          dp?: string | null;
          email?: string | null;
          id?: number;
          updatedAt?: string;
          userData?: Json;
          userId?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
