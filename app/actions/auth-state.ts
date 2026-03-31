import type { AuthState } from "@/app/actions/auth";

export const emptyState: AuthState = {
  error: null,
  values: {
    name: "",
    email: "",
  },
};