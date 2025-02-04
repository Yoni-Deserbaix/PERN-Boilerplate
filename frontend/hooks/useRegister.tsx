import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthContext } from "../context/authContext";
import { registerUser } from "../lib/api/AuthApi";

export const useRegister = () => {
  const { setAuthUser } = useAuthContext();
  const router = useRouter();

  const registerMutation = useMutation({
    mutationFn: async (data: {
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => {
      const response = await registerUser(
        data.username,
        data.email,
        data.password,
        data.confirmPassword,
      );
      return response;
    },
    onMutate: () => {
      toast.loading("Registering...");
    },
    onSuccess: (data) => {
      toast.success("Register successful ! 🎉");
      setAuthUser(data.user);
      router.push("/dashboard");
    },
    onError: (error: Error) => {
      if (error.message === "Email already exists") {
        toast.error("Email already exists");
      } else if (error.message === "Validation error") {
        toast.error("Invalid email or password");
      } else {
        toast.error("An error occurred. Please try again.");
      }
    },
    onSettled: () => {
      toast.dismiss();
    },
  });

  return {
    signUp: registerMutation.mutate,
    isLoading: registerMutation.isPending,
  };
};
