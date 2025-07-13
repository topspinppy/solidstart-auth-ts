import { A, createAsync } from "@solidjs/router";
import DashboardLayout from "./dashboard/layout";
import { requireAuth } from "~/lib/auth";

export default function NotFound() {
  // check authentication
  createAsync(() => requireAuth());
    
  return (
    <DashboardLayout>
      <main class="text-center mx-auto text-gray-700 p-4">
        <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Not Found</h1>
        <p class="mt-8">
          Visit{" "}
          <a href="https://solidjs.com" target="_blank" class="text-sky-600 hover:underline">
            solidjs.com
          </a>{" "}
          to learn how to build Solid apps.
        </p>
        <p class="my-4">
          <A href="/" class="text-sky-600 hover:underline">
            Home
          </A>
          {" - "}
          <A href="/about" class="text-sky-600 hover:underline">
            About Page
          </A>
        </p>
      </main>
    </DashboardLayout>
  );
}
