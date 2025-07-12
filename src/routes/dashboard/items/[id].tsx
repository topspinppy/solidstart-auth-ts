import { createAsync } from "@solidjs/router";
import { requireAuth } from "~/lib/auth";



function Item() {
  createAsync(() => requireAuth());
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Item Page</h1>
      <p class="mt-8">This is the item page.</p>
    </main>
  );
}
export default Item;
