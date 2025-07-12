// src/routes/dashboard.tsx
import { action, createAsync, query, redirect, useNavigate } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import { requireAuth } from "~/lib/auth";
import useManageItems from "~/lib/composables/useManageItems";
import useProfile from "~/lib/composables/useProfile";
import DashboardLayout from "./layout";


const logoutAction = action(async () => {
  "use server";

  // Clear the token cookie
  return redirect("/login", {
    headers: {
      "Set-Cookie": "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict",
    }
  });
});

export default function Dashboard() {
  // check authentication
  createAsync(() => requireAuth());
  const { profile } = useProfile();
  const { items, loadMore, pagination } = useManageItems();
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <Show when={profile()} fallback={<div />}>
          <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div class="flex items-center space-x-4">
              <img
                src={profile()?.avatarUrl}
                alt="Profile"
                class="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h2 class="text-2xl font-bold text-gray-900">
                  Welcome back, {profile()?.displayName}!
                </h2>
                <span>
                  {profile()?.bio}
                </span>
              </div>
            </div>
          </div>
        </Show>
        {/* Profile Overview Card */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div class="lg:col-span-1">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Profile Overview</h3>
              <div class="space-y-3">
                <Show when={profile()} fallback={<div />}>
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Name</p>
                      <p class="font-medium text-gray-900">{profile()?.displayName}</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-sm text-gray-600">Email</p>
                      <p class="font-medium text-gray-900">{profile()?.email}</p>
                    </div>
                  </div>
                </Show>
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Total Items</p>
                    <Show when={pagination()?.total} fallback={<p class="font-medium text-gray-900">0</p>}>
                      <p class="font-medium text-gray-900">{pagination()?.total}</p>
                    </Show>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate("/profile")}
                class="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                View Full Profile
              </button>
            </div>
          </div>

          {/* Recent Items */}
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-gray-900">Your Items</h3>
                <button
                  onClick={() => navigate("/items/add")}
                  class="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Add New Item
                </button>
              </div>
              <Show when={items() && items().length !== 0} fallback={<div class="text-gray-500">No items found.</div>}>
                <div class="space-y-3">
                  <For each={items()}>
                    {(item) => (
                      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => navigate(`/dashboard/items/${item.id}`)}>
                        <div class="flex items-center space-x-3">
                          <div>
                            <p class="font-medium text-gray-900">{item.title}</p>
                            <p class="text-sm text-gray-600">{item.description ?? '-'}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
                <Show when={pagination()?.hasMore}>
                <button
                  onClick={() => loadMore()}
                  class="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                >
                  ดูเพิ่มเติม
                </button>
                </Show>
              </Show>
            </div>
          </div>
        </div>
      </main>
    </DashboardLayout>
  );
}