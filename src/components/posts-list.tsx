"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserPosts } from "@/common/hooks/post/use-user-posts";
import { useSafeUser } from "@/common/providers/auth-provider";
import { DeletePostDialog } from "@/components/dialogs/delete-post.dialog";
import { EditPostDialog } from "@/components/dialogs/edit-post-dialog";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";

export function PostsList() {
  const user = useSafeUser();
  const { posts, loading, error } = useUserPosts();

  // Uncomment for debugging only
  // console.log("posts:", posts);
  // console.log("loading:", loading);
  // console.log("error:", error);

  if (loading && !error) return <PostsLoadingSkeleton />;

  if (error && !loading)
    return (
      <EmptyState
        message={`Error loading posts: ${error.message}`}
        className="text-red-500"
      />
    );

  if (!posts || posts.length === 0)
    return <EmptyState message="No posts found" />;

  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      <h2 className="text-primary pb-4">Posted by you</h2>
      <div className="flex flex-col space-y-6 w-full">
        {posts.map((post) => (
          <Card key={post.id} className="w-full">
            <CardHeader>
              <CardTitle className="line-clamp-1">Post #{post.id}</CardTitle>
              <CardDescription className="line-clamp-2">
                {post.description || "No description"}
              </CardDescription>
              <CardAction>
                <div className="flex gap-2">
                  <EditPostDialog post={post} />
                  <DeletePostDialog postId={post.id} />
                </div>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p>{post.content}</p>
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <div className="text-sm text-muted-foreground">
                Posted by: {user.email}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PostsLoadingSkeleton() {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      <h2 className="text-primary pb-4">Posted by you</h2>
      <LoadingState text="Loading posts..." className="mb-4" />
      <div className="flex flex-col space-y-6 w-full">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-3/4 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter className="border-t">
              <Skeleton className="h-4 w-1/3" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
