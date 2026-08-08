import { getAdminBookings } from "@/lib/db/admin";
import { formatNPR } from "@/lib/money";
import { BOOKING_STATUS_LABELS } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CircleCheckIcon } from "lucide-react";
import { format } from "date-fns";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  confirmed: "default",
  in_progress: "default",
  completed: "secondary",
  inquiry: "outline",
  pending_payment: "outline",
  cancelled: "destructive",
  disputed: "destructive",
};

export const dynamic = "force-dynamic";
export default async function BookingsPage() { const bookings = await getAdminBookings(100);

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b">
        <div className="flex w-full items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-base font-semibold">Bookings</h1>
            <p className="text-sm text-muted-foreground">
              {bookings.length} most recent bookings across all guides
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Traveler</TableHead>
                <TableHead>Guide</TableHead>
                <TableHead>Listing</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead className="text-right">Party</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Paid / reviewed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs font-medium">{b.code}</TableCell>
                  <TableCell className="whitespace-nowrap">{b.travelerName}</TableCell>
                  <TableCell className="whitespace-nowrap">{b.guideName}</TableCell>
                  <TableCell className="max-w-56 truncate">{b.listingTitle ?? "â€”"}</TableCell>
                  <TableCell className="whitespace-nowrap text-xs tabular-nums">
                    {format(new Date(`${b.startDate}T00:00:00Z`), "MMM d")} â€“{" "}
                    {format(new Date(`${b.endDate}T00:00:00Z`), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{b.partySize}</TableCell>
                  <TableCell className="text-right whitespace-nowrap tabular-nums">
                    {formatNPR(b.totalPaisa)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[b.status] ?? "outline"}>
                      {BOOKING_STATUS_LABELS[b.status] ?? b.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
                      {b.hasPayment && <CircleCheckIcon className="size-3.5 text-green-600" aria-label="Paid" />}
                      {b.hasReview && <CircleCheckIcon className="size-3.5 text-amber-600" aria-label="Reviewed" />}
                      {!b.hasPayment && !b.hasReview && "â€”"}
                    </div>
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


