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
      brand: {
        Row: {
          api: string | null;
          brand_image: string | null;
          category: string | null;
          created_at: string;
          description: string | null;
          feedback_count: number | null;
          followers: string[] | null;
          followers_count: number | null;
          id: number;
          name: string;
          owner_email: string | null;
          raw_name: string;
          updated_at: string | null;
          user_api_key: string | null;
          user_id: string;
        };
        Insert: {
          api?: string | null;
          brand_image?: string | null;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          feedback_count?: number | null;
          followers?: string[] | null;
          followers_count?: number | null;
          id?: number;
          name: string;
          owner_email?: string | null;
          raw_name: string;
          updated_at?: string | null;
          user_api_key?: string | null;
          user_id?: string;
        };
        Update: {
          api?: string | null;
          brand_image?: string | null;
          category?: string | null;
          created_at?: string;
          description?: string | null;
          feedback_count?: number | null;
          followers?: string[] | null;
          followers_count?: number | null;
          id?: number;
          name?: string;
          owner_email?: string | null;
          raw_name?: string;
          updated_at?: string | null;
          user_api_key?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      brand_followers: {
        Row: {
          brand_id: number | null;
          created_at: string;
          id: number;
          user_id: string;
        };
        Insert: {
          brand_id?: number | null;
          created_at?: string;
          id?: number;
          user_id?: string;
        };
        Update: {
          brand_id?: number | null;
          created_at?: string;
          id?: number;
          user_id?: string;
        };
        Relationships: [];
      };
      feedback: {
        Row: {
          be_anonymous: boolean | null;
          created_at: string;
          description: string;
          email: string;
          event_id: number | null;
          from_embed: boolean | null;
          hash_tags: string | null;
          id: number;
          product_id: number | null;
          recipient_id: number;
          screenshots: string | null;
          star_rating: number | null;
          title: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          be_anonymous?: boolean | null;
          created_at?: string;
          description: string;
          email: string;
          event_id?: number | null;
          from_embed?: boolean | null;
          hash_tags?: string | null;
          id?: number;
          product_id?: number | null;
          recipient_id: number;
          screenshots?: string | null;
          star_rating?: number | null;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Update: {
          be_anonymous?: boolean | null;
          created_at?: string;
          description?: string;
          email?: string;
          event_id?: number | null;
          from_embed?: boolean | null;
          hash_tags?: string | null;
          id?: number;
          product_id?: number | null;
          recipient_id?: number;
          screenshots?: string | null;
          star_rating?: number | null;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string;
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
          user_id: string;
        };
        Insert: {
          brand_id: number;
          created_at?: string;
          dislikes?: string[] | null;
          feedback_id: number;
          id?: number;
          likes?: string[] | null;
          user_id?: string;
        };
        Update: {
          brand_id?: number;
          created_at?: string;
          dislikes?: string[] | null;
          feedback_id?: number;
          id?: number;
          likes?: string[] | null;
          user_id?: string;
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
          user_id: string;
        };
        Insert: {
          brand_id: number;
          created_at?: string;
          feedback_id: number;
          id?: number;
          owner_email?: string | null;
          reply?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Update: {
          brand_id?: number;
          created_at?: string;
          feedback_id?: number;
          id?: number;
          owner_email?: string | null;
          reply?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      user: {
        Row: {
          bio: string;
          created_at: string;
          dp: string | null;
          email: string | null;
          id: number;
          updated_at: string | null;
          user_data: Json;
          user_id: string;
        };
        Insert: {
          bio: string;
          created_at?: string;
          dp?: string | null;
          email?: string | null;
          id?: number;
          updated_at?: string | null;
          user_data: Json;
          user_id?: string;
        };
        Update: {
          bio?: string;
          created_at?: string;
          dp?: string | null;
          email?: string | null;
          id?: number;
          updated_at?: string | null;
          user_data?: Json;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      requesting_user_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
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
