import { getAdminListings } from "@/lib/db/admin";
import { formatNPR } from "@/lib/money";
import { serviceKindLabel } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, SearchIcon } from "lucide-react";
import { ListingRowActions } from "./listing-row-actions";

export const dynamic = "force-dynamic";
export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kind?: string }>;
}) {
  const params = await searchParams;
  const kinds = ["trek_guide", "city_guide", "porter", "homestay"] as const;
  const kind =
    params.kind && (kinds as readonly string[]).includes(params.kind)
      ? (params.kind as (typeof kinds)[number])
      : undefined;
  const rows = await getAdminListings({ query: params.q, kind });

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b">
        <div className="flex w-full items-center justify-between px-4 lg:px-6">
          <div>
            <h1 className="text-base font-semibold">Listings</h1>
            <p className="text-sm text-muted-foreground">
              {rows.length} bookable service{rows.length === 1 ? "" : "s"} from guides
            </p>
          </div>
          <Button render={<a href="/admin/listings/new" />}>
            <PlusIcon />
            New listing
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        <form
          className="flex flex-wrap items-center gap-2"
          role="search"
        >
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Search title, slug or guideâ€¦"
              className="w-72 pl-9"
              aria-label="Search listings"
            />
          </div>
          <Select
            name="kind"
            defaultValue={params.kind ?? "all"}
            items={kinds.map((k) => ({ label: serviceKindLabel(k), value: k }))}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="All service kinds" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All service kinds</SelectItem>
              {kinds.map((k) => (
                <SelectItem key={k} value={k}>
                  {serviceKindLabel(k)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" variant="outline">
            Filter
          </Button>
        </form>

        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Listing</TableHead>
                <TableHead>Guide</TableHead>
                <TableHead>Kind</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Days</TableHead>
                <TableHead className="text-right">Price / day</TableHead>
                <TableHead className="text-right">Bookings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No listings match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="max-w-64">
                        <div className="truncate font-medium">{row.title}</div>
                        <div className="truncate text-xs text-muted-foreground">{row.slug}</div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{row.guideName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{serviceKindLabel(row.serviceKind)}</Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{row.region}</TableCell>
                    <TableCell>{row.durationDays}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatNPR(row.pricePaisa)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{row.bookingCount}</TableCell>
                    <TableCell>
                      <Badge variant={row.isActive ? "default" : "secondary"}>
                        {row.isActive ? "Active" : "Hidden"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <ListingRowActions id={row.id} isActive={row.isActive} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}


