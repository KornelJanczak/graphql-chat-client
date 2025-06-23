"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreatePost } from "@/common/hooks/post/use-create-post";

const formSchema = z.object({
  content: z.string().min(1).min(2).max(20).nonempty(),
  postDescription: z.string(),
});

export default function PostForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [createPost, { loading }] = useCreatePost();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createPost({
      variables: {
        createPostInput: {
          content: values.content,
          description: values.postDescription,
        },
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full px-4 sm:px-6 md:px-8 space-y-8 max-w-3xl mx-auto py-10"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post content</FormLabel>
              <FormControl>
                <Input placeholder="Content" type="text" {...field} />
              </FormControl>
              <FormDescription>This is post content.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Post Description</FormLabel>
              <FormControl>
                <Input placeholder="Post description" type="" {...field} />
              </FormControl>
              <FormDescription>This is post description.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Post"}
        </Button>
      </form>
    </Form>
  );
}
