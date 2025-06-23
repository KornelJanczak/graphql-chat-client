"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateUser } from "@/common/hooks/user/use-create-user";
import * as z from "zod";

export interface ActionResponse<T = any> {
  success: boolean;
  message: string;
  errors?: {
    [K in keyof T]?: string[];
  };
  inputs?: T;
}
export const formSchema = z.object({
  email: z.string(),
  password: z.string(),
  "repeat-password": z.string(),
});

export default function SignUpPage() {
  const [createUser, { loading }] = useCreateUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Form {...form}>
        <form
          className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-2 border shadow-md"
          onSubmit={form.handleSubmit(async (data) => {
            // Handle form submission with the data
            console.log(data);
            await createUser({
              variables: {
                createUserInput: {
                  email: data.email,
                  password: data.password,
                },
              },
            });
            // You can call createUser here with the form data
          })}
        >
          <h2 className="text-2xl font-bold">Sign Up</h2>
          <p className="text-base">Please fill the form below to contact us</p>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel> *
                <FormControl>
                  <Input
                    placeholder="Enter your email"
                    type={"email"}
                    value={field.value}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel> *
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type={"password"}
                    value={field.value}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="repeat-password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Repeat password</FormLabel> *
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Repeat your password"
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end items-center w-full pt-3">
            <Button className="rounded-lg" size="sm">
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
