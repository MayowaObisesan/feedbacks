import { supabase } from "@/utils/supabase/supabase";
import { DBTables } from "@/types/enums";

export class BrandService {
  static async getBrandById(brandId: number) {
    let { data, error } = await supabase
      .from(DBTables.Brand)
      .select("*")
      .eq("id", brandId);

    return { data, error };
  }

  static async getBrandByUserEmail(email: number) {
    let { data, error } = await supabase
      .from(DBTables.Brand)
      .select("*")
      .eq("owner_email", email);

    return { data, error };
  }
}
