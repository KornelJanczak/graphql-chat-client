"use client";

import { useUsers } from "@/common/hooks/user/use-users";
import PostForm from "@/components/forms/post-form";
import { PostsList } from "@/components/posts-list";

export default function PostsPage() {
  const { data } = useUsers();

  return (
    <div className="max-w-3xl px-4">
      <PostForm />
      <PostsList />
    </div>
  );
}
