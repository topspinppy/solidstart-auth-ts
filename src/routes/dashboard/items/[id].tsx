import { createAsync, useParams } from "@solidjs/router";
import { requireAuth } from "~/lib/auth";
import DashboardLayout from "../layout";
import { createEffect, createSignal, Show } from "solid-js";

interface IItem {
  ownerId: string;
  createdAt: string;
  description: string;
  id: string;
  title: string;
  updatedAt: string;
}

export default function ItemPage() {
  const [item, setItem] = createSignal<IItem | null>(null);
  const [loading, setLoading] = createSignal(true);
  const params = useParams();

  // ✅ ตรวจ auth ก่อน render
  createAsync(() => requireAuth());

  // ✅ โหลดข้อมูล item
  createEffect(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/item/${params.id}`);
      if (!res.ok) throw new Error("Failed to fetch item");
      const data = await res.json();
      setItem(data.data);
    } catch (err) {
      console.error(err);
      setItem(null);
    } finally {
      setLoading(false);
    }
  });

  return (
    <DashboardLayout>
      <main class="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
        <Show when={!loading()} fallback={<p class="text-gray-500">Loading item...</p>}>
          <Show when={item()} fallback={<p class="text-red-500">Item not found.</p>}>
            {(item) => (
              <div>
                <h1 class="text-3xl font-bold text-gray-900">{item().title}</h1>
                <p class="mt-4 text-gray-700 whitespace-pre-line">
                  {item().description || "No description available."}
                </p>

                <div class="mt-6 text-sm text-gray-500 space-y-1">
                  <p><strong>Owner ID:</strong> {item().ownerId}</p>
                  <p><strong>Created:</strong> {new Date(item().createdAt).toLocaleString()}</p>
                  <p><strong>Last updated:</strong> {new Date(item().updatedAt).toLocaleString()}</p>
                </div>
              </div>
            )}
          </Show>
        </Show>
      </main>
    </DashboardLayout>
  );
}
