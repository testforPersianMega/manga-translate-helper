import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function HomePage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("mth_access")?.value;
  const role = cookieStore.get("mth_role")?.value;
  if (!accessToken) {
    redirect("/login");
  }
  if (role === "ADMIN") {
    redirect("/admin");
  }
  redirect("/app");
}
