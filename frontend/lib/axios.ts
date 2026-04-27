import axios, { isAxiosError } from "axios";
import { useAuthStore } from "@/store/authStore";
/** Same API as `@/components/ui/sonner`; use that Toaster in the layout for shadcn styling. */
import { toast } from "sonner";

declare module "axios" {
  interface AxiosRequestConfig {
    /** When true, the response interceptor will not show a success toast from the API body. */
    skipGlobalSuccessToast?: boolean;
    /** When true, the error interceptor will not show an error toast. */
    skipGlobalErrorToast?: boolean;
  }
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

function getApiMessage(data: unknown): string | undefined {
  if (data && typeof data === "object" && "message" in data) {
    const m = (data as { message: unknown }).message;
    if (typeof m === "string" && m.trim()) return m;
  }
  return undefined;
}

function getErrorToastMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const fromBody = getApiMessage(error.response?.data);
    if (fromBody) return fromBody;
    if (error.message) return error.message;
  }
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong";
}

/* -------------------------
   REQUEST INTERCEPTOR
-------------------------- */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* -------------------------
   RESPONSE INTERCEPTOR
-------------------------- */
axiosInstance.interceptors.response.use(
  (response) => {
    if (typeof window === "undefined") return response;

    const { skipGlobalSuccessToast } = response.config;
    if (skipGlobalSuccessToast) return response;

    const data = response.data;
    if (
      data &&
      typeof data === "object" &&
      data.success === true &&
      typeof (data as { message?: unknown }).message === "string"
    ) {
      const msg = (data as { message: string }).message.trim();
      if (msg.length > 0) {
        toast.success(msg);
      }
    }

    return response;
  },
  (error) => {
    const status = error.response?.status;
    const reqUrl = String(error.config?.url ?? "");
    const skipGlobalErrorToast = error.config?.skipGlobalErrorToast === true;

    if (
      status === 401 &&
      error.response?.data?.message === "Invalid email or password"
    ) {
      return Promise.reject(error);
    }

    if (status === 401 && reqUrl.includes("forgot-password")) {
      return Promise.reject(error);
    }

    if (status === 401) {
      if (typeof window !== "undefined") {
        toast.error("Session expired. Please log in again.");
        const { logOut } = useAuthStore.getState();
        logOut();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (typeof window !== "undefined" && !skipGlobalErrorToast) {
      toast.error(getErrorToastMessage(error));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
