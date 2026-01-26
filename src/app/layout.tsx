import { AuthProvider } from "@/providers/auth-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Z Consultation",
  description: "Appointment & Queue Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          {children}
          <Toaster
            richColors
            closeButton
            position="top-right"
            theme="light"
            toastOptions={{
              style: {
                borderRadius: "var(--radius)",
              },
              classNames: {
                toast:
                  "group toast group-[.toaster]:bg-white group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                description: "group-[.toast]:text-muted-foreground",
                actionButton:
                  "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                cancelButton:
                  "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
