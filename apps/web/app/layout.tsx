import type { ReactNode } from "react";
import "./globals.css";
import { ToastProvider } from "./components/ToastProvider";

export const metadata = {
  title: "Manga Translate Helper Admin"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
