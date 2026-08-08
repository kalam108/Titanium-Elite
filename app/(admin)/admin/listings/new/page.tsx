import { getAdminGuideOptions } from "@/lib/db/admin";
import { getAllRegions } from "@/lib/db/regions";
import { ListingForm } from "./listing-form";

export const dynamic = "force-dynamic";
export default async function NewListingPage() {
  const [guides, regions] = await Promise.all([getAdminGuideOptions(), getAllRegions()]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 lg:px-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">New listing</h1>
        <p className="text-sm text-muted-foreground">
          Create a bookable service (trek, city tour, porter support or homestay) for a guide.
        </p>
      </div>
      <ListingForm guides={guides} regions={regions} />
    </div>
  );
}


