"use client";

import { useRouter } from "next/navigation";
import { Button } from "./Button";
import { useToast } from "./ToastProvider";

export function LogoutButton() {
  const router = useRouter();
  const { notify } = useToast();

  const onLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    notify("Signed out.");
    router.push("/login");
  };

  return (
    <Button variant="ghost" onClick={onLogout} type="button">
      Sign out
    </Button>
  );
}
