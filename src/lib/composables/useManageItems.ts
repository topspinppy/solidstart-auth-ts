import { createEffect, createSignal } from "solid-js";

type Item = {
  id: string;
  title: string;
  description?: string;
  createdAt: string | { _seconds: number; _nanoseconds: number };
  updatedAt: string | { _seconds: number; _nanoseconds: number };
  ownerId: string;
};

type Pagination = {
  page: number;
  limit: number;
  count: number;
  total: number;
  hasMore: boolean;
};

export default function useManageItems() {
  const [items, setItems] = createSignal<Item[]>([]);
  const [pagination, setPagination] = createSignal<Pagination | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const [currentPage, setCurrentPage] = createSignal(1);
  async function fetchItems(page = 1, append = false) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/items?page=${page}&limit=5`);
      if (!response.ok) throw new Error("Failed to fetch items");

      const json = await response.json();
      const newItems: Item[] = json.data.items || [];

      setItems(prev => (append ? [...prev, ...newItems] : newItems));
      setPagination(json.data.pagination || null);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    const page = currentPage() + 1;
    if (pagination()?.hasMore) {
      await fetchItems(page, true);
    }
  }

  createEffect(() => {
    fetchItems(1);
  });

  return {
    items,
    pagination,
    loading,
    error,
    fetchItems,
    loadMore,
  };
}
