import { useMutation } from "@tanstack/react-query";
import { loginAdmin } from "../services/api.js";

export function useAdminLogin() {
  return useMutation({
    mutationFn: loginAdmin,
  });
}
