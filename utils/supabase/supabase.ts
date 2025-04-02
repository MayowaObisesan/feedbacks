import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

if (!supabaseKey || !supabaseUrl) {
  throw new Error("Unable to connect to the database.");
}

// export const supabase = createClient(supabaseUrl, supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  accessToken: () => {
    return window.Clerk.session?.getToken();
  },
});

console.log("BASE SUPABASE CLIENT:::", supabase);
