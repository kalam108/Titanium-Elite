import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { requireSession } from "@/lib/session";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardPage() {
  // Real session from the DB through Drizzle; redirects to /login when absent.
  const session = await requireSession();
  const { user } = session;

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="size-12">
              {user.image && <AvatarImage src={user.image} alt={user.name} />}
              <AvatarFallback>
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
            <Badge variant="secondary">
              {user.emailVerified ? "Verified" : "Unverified"}
            </Badge>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-col gap-2 pt-6">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">User ID</span>
            <span className="font-mono">{user.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Account created</span>
            <span>{user.createdAt.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-end pt-4">
            <SignOutButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
