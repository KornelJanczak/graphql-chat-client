"use client";

import { useUsers } from "@/common/hooks/user/use-users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";

export default function UsersPage() {
  const { data, loading } = useUsers();

  if (loading) return <LoadingState />;

  if (!data || !data.users) return <EmptyState message="No users found" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users list</CardTitle>
        <CardDescription>Card shows users list</CardDescription>
        <ul className="mt-2 space-y-1">
          {data.users.map((user) => (
            <li key={user.id} className="text-sm">
              {user.email}
            </li>
          ))}
        </ul>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
    </Card>
  );
}
