import { getAdminGuides } from "@/lib/db/admin";
import { formatRate } from "@/lib/money";
import { serviceKindLabel } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

const VERIFICATION_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  verified: "default",
  pending: "secondary",
  rejected: "destructive",
  unverified: "outline",
  expired: "outline",
};

export default async function GuidesPage() {
  const guides = await getAdminGuides();

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b">
        <div className="flex w-full items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-base font-semibold">Guides</h1>
            <p className="text-sm text-muted-foreground">
              {guides.length} guide profiles across all verification states
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Guide</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Trust</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Bookings</TableHead>
                <TableHead className="text-right">Reports</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Regions</TableHead>
                <TableHead className="text-right">Base rate</TableHead>
                <TableHead>Published</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {guides.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="whitespace-nowrap font-medium">{g.fullName}</TableCell>
                  <TableCell>
                    <Badge variant={VERIFICATION_VARIANT[g.verificationStatus] ?? "outline"}>
                      {g.verificationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="tabular-nums">{g.trustScore}</TableCell>
                  <TableCell className="tabular-nums">
                    {g.avgRating === null ? "â€”" : `${g.avgRating.toFixed(1)} (${g.reviewCount})`}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{g.bookingCount}</TableCell>
                  <TableCell className="text-right tabular-nums">{g.reportCount}</TableCell>
                  <TableCell>
                    <div className="flex max-w-64 flex-wrap gap-1">
                      {g.serviceKinds.map((k) => (
                        <Badge key={k} variant="outline" className="px-1.5">
                          {serviceKindLabel(k)}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-48 truncate">{g.regions.join(", ")}</TableCell>
                  <TableCell className="text-right whitespace-nowrap tabular-nums">
                    {g.baseRatePaisa === null ? "â€”" : formatRate(g.baseRatePaisa, "per_day")}
                  </TableCell>
                  <TableCell>
                    {g.isPublished ? (
                      <Badge variant="default">Yes</Badge>
                    ) : (
                      <Badge variant="secondary">No</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}


