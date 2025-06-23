"use client";

import { useUsers } from "@/common/hooks/user/use-users";
import CreateChatForm from "@/components/forms/create-chat-form";

export default function CreateChatPage() {
  const { users, loading, error } = useUsers();

  return (
    <div className="flex items-center justify-center min-h-[calc(70vh-4rem)] w-full">
      <div className="max-w-3xl w-full px-4">
        <CreateChatForm users={users} loading={loading} error={error?.message} />
      </div>
    </div>
  );
}
