import { createSignal } from "solid-js";
import { createAsync } from "@solidjs/router";
import DashboardLayout from "./layout";
import { requireAuth } from "~/lib/auth";
import z from "zod";
import { createForm, zodForm } from "@modular-forms/solid";

const baseSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

export type AddItemFormData = z.infer<typeof baseSchema>;


export default function AddItemPage() {
  createAsync(() => requireAuth());
  const [formError, setFormError] = createSignal<string | null>(null);

  const [, { Form, Field }] = createForm<AddItemFormData>({
    validate: zodForm(baseSchema),
    initialValues: {
      title: "",
      description: "",
    },
  });

  const handleSubmit = async (values: AddItemFormData) => {
    setFormError(null); // reset error
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const payload = await res.json();
        setFormError(payload.message || "Submission failed");
        return;
      }

      window.location.href = '/dashboard'
    } catch (error) {
      console.error(error);
      setFormError("An unexpected error occurred.");
    }
  };

  return (
    <DashboardLayout>
      <div class="max-w-xl mx-auto mt-12">
        <Form onSubmit={handleSubmit} class="space-y-6 bg-white p-8 rounded-xl shadow-md">
          <h2 class="text-3xl font-bold text-gray-800">Add New Item</h2>

          {formError() && (
            <div class="bg-red-100 text-red-700 p-3 rounded-md border border-red-300">
              {formError()}
            </div>
          )}

          <Field name="title">
            {(field, props) => (
              <div>
                <label class="block mb-1 font-medium text-gray-700">Title</label>
                <input
                  {...props}
                  type="text"
                  class="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter title"
                  required
                />
                {field.error && (
                  <p class="mt-1 text-sm text-red-500">{field.error}</p>
                )}
              </div>
            )}
          </Field>

          <Field name="description">
            {(field, props) => (
              <div>
                <label class="block mb-1 font-medium text-gray-700">Description</label>
                <textarea
                  {...props}
                  rows={4}
                  class="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description"
                  required
                />
                {field.error && (
                  <p class="mt-1 text-sm text-red-500">{field.error}</p>
                )}
              </div>
            )}
          </Field>

          <div class="text-right">
            <button
              type="submit"
              class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </div>
        </Form>
      </div>
    </DashboardLayout>
  );
}
