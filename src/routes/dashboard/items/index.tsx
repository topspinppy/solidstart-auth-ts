import { createAsync } from "@solidjs/router";
import { redirectIfAuthenticated } from "~/lib/auth";



export default function ItemsPage() {
  // ✅ ตรวจ auth ก่อน render
  createAsync(() => redirectIfAuthenticated());

  return <></>
}