import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 p-6 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold tracking-tight">Next.js Auth</h1>
        <p className="max-w-md text-muted-foreground">
          Better Auth + Drizzle + Supabase Postgres. Sign up to see your data
          flow from the database to the dashboard.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/login" className={cn(buttonVariants({ variant: "default" }))}>
          Sign in
        </Link>
        <Link href="/signup" className={cn(buttonVariants({ variant: "outline" }))}>
          Sign up
        </Link>
        <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost" }))}>
          Dashboard
        </Link>
      </div>
    </div>
  );
}
