/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

export const handleApiError = (error: any, fallbackMessage = "An unexpected error occurred") => {
  let message = fallbackMessage;

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  } else if (typeof error === "object" && error !== null) {
    // Handle direct API response object if passed
    if (Array.isArray(error.message)) {
      message = error.message.join("\n");
    } else if (error.message) {
      message = error.message;
    }
  }

  // Ensure message is not "[object Object]"
  if (message === "[object Object]") {
      message = fallbackMessage;
  }

  toast.error(message, {
      duration: 5000,
      style: { whiteSpace: "pre-line" } // Allow newlines
  });
};
