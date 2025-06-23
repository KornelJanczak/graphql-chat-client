import { Chat } from "@/common/interfaces/chat";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

interface ChatCardProps {
  chat: Pick<Chat, "name" | "createdAt" | "id">;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
}

export function ChatCard({ chat }: ChatCardProps) {
  return (
    <Link href={`/dashboard/chats/${chat.id}`} className="no-underline">
      <Card>
        <CardHeader>
          <CardTitle>{chat.name}</CardTitle>
          {/* <CardDescription>Card Description</CardDescription> */}
          {/* <CardAction>Card Action</CardAction> */}
        </CardHeader>
        <CardContent>
          <p>Your Created: {formatDate(chat.createdAt)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
