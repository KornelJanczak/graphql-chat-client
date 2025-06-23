"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/extension/multi-select";
import React from "react";
import { User } from "@/common/interfaces/user";
import { cn } from "@/lib/utils";
import { useCreateChat } from "@/common/hooks/chat/use-create-chat";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  chatName: z.string().min(2).max(50),
  membersEmails: z.array(z.string()).min(1, {
    message: "Please select at least one user",
  }),
});

interface CreateChatFormProps extends React.HTMLAttributes<HTMLFormElement> {
  users?: User[];
  loading?: boolean;
  error?: string;
}

export default function CreateChatForm({
  users,
  loading,
  error,
  ...restOfProps
}: CreateChatFormProps) {
  const router = useRouter();
  const { createChat, loading: createLoading } = useCreateChat();

  const isUsersExists = users && users.length > 0;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chatName: "",
      membersEmails: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting form with values:", values);

    try {
      await createChat({
        variables: {
          createChatInput: {
            name: values.chatName,
            membersEmails: values.membersEmails,
          },
        },
      });

      form.reset();
      // router.push("/dashboard/chats");
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to create chat. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "space-y-8 max-w-3xl mx-auto py-10",
          restOfProps.className
        )}
        {...restOfProps}
      >
        <FormField
          control={form.control}
          name="chatName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chat title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter chat title..."
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormDescription>Name your chat</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="membersEmails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select chat members</FormLabel>
              <FormControl>
                <MultiSelector
                  values={field.value}
                  onValuesChange={field.onChange}
                  loop
                  className="max-w-xs"
                >
                  <MultiSelectorTrigger>
                    <MultiSelectorInput placeholder="Select users" />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    {isUsersExists && (
                      <MultiSelectorList>
                        {users.map((user) => (
                          <MultiSelectorItem key={user.id} value={user.email}>
                            {user.email}
                          </MultiSelectorItem>
                        ))}
                      </MultiSelectorList>
                    )}
                    {!isUsersExists && !loading && (
                      <div className="flex justify-center p-2">
                        <span className="text-muted-foreground">
                          No users available
                        </span>
                      </div>
                    )}
                    {loading && (
                      <div className="flex justify-center p-2">
                        <span className="text-primary">Loading...</span>
                      </div>
                    )}
                  </MultiSelectorContent>
                </MultiSelector>
              </FormControl>
              <FormDescription>
                Select users to add to this chat
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={createLoading}>
          {createLoading ? "Creating..." : "Create Chat"}
        </Button>
      </form>
    </Form>
  );
}
