"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-react";
import { deleteListingAction, toggleListingActiveAction } from "./actions";

export function ListingRowActions({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", id);
      formData.set("active", String(!isActive));
      await toggleListingActiveAction(formData);
      toast.success(isActive ? "Listing hidden" : "Listing published");
    });
  }

  function remove() {
    if (!confirm("Delete this listing permanently? Bookings keep their history.")) return;
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", id);
      await deleteListingAction(formData);
      toast.success("Listing deleted");
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={pending}
        render={
          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground" />
        }
      >
        <EllipsisVerticalIcon />
        <span className="sr-only">Listing actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onSelect={toggle}>
          {isActive ? "Hide listing" : "Publish listing"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onSelect={remove}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
