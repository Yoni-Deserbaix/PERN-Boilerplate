"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../api/UserApi";
import { AuthUserType } from "../types/types";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function UserForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.resetQueries({ queryKey: ["users"], exact: true });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user: AuthUserType = {
      id: "0",
      username: formData.get("name") as string,
      email: formData.get("email") as string,
    };
    mutation.mutate(user);
    e.currentTarget.reset();
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        method="post"
        className="mx-auto flex w-full flex-col gap-4"
      >
        <Input type="text" name="name" placeholder="Name" required />
        <Input type="email" name="email" placeholder="Email" required />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <Button type="submit" size="lg">
          Add new user
        </Button>
      </form>
    </div>
  );
}
