import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/authService";

export const useLoginMutation = () =>
  useMutation({
    mutationFn: authService.login,
  });

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: authService.register,
  });
