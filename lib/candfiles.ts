import type { SupabaseClient } from "@supabase/supabase-js";

export const FILE_BUCKET = "candidate-files";

// Removes the stored files of one candidate, or of the whole workspace when
// candidateId is null. Files must go through the Storage API: deleting the
// database rows alone would leave the files behind. Returns false if anything
// could not be removed, and then the caller must not delete the data.
export async function removeCandidateFiles(
  supabase: SupabaseClient,
  orgId: string,
  candidateId: string | null
): Promise<boolean> {
  for (let round = 0; round < 100; round++) {
    let query = supabase
      .from("candidate_files")
      .select("id,path")
      .eq("org_id", orgId);
    if (candidateId) query = query.eq("candidate_id", candidateId);

    const { data, error } = await query.limit(100);
    if (error) {
      console.error(error);
      return false;
    }
    if (!data || data.length === 0) return true;

    const rows = data as { id: string; path: string }[];

    const { error: removeError } = await supabase.storage
      .from(FILE_BUCKET)
      .remove(rows.map((r) => r.path));
    if (removeError) {
      console.error(removeError);
      return false;
    }

    // Forget what was removed, so the next round moves forward
    const { error: deleteError } = await supabase
      .from("candidate_files")
      .delete()
      .in(
        "id",
        rows.map((r) => r.id)
      )
      .eq("org_id", orgId);
    if (deleteError) {
      console.error(deleteError);
      return false;
    }
  }
  return false;
}