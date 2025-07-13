import { action, redirect } from "@solidjs/router";
import { JSX } from "solid-js";


const logoutAction = action(async () => {
  "use server";

  // Clear the token cookie
  return redirect("/login", {
    headers: {
      "Set-Cookie": "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict",
    }
  });
});

export default function DashboardLayout(props: { children: JSX.Element }) {
  return (
    <>
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header class="bg-white shadow-sm border-b border-gray-200">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">
              <h1 class="text-2xl font-bold text-gray-900"><a href="/dashboard">Dashboard</a></h1>
              <div class="flex items-center space-x-4">
                <form action={logoutAction} method="post" class="inline">
                  <button
                    type="submit"
                    class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </div>
          </div>
        </header>
        <div class="p-6 bg-gray-50 min-h-screen">
          {props.children}
        </div>
      </div>
    </>
  );
}

