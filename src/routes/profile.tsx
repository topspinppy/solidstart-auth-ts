import { createEffect, createSignal } from "solid-js";
import { createAsync } from "@solidjs/router";
import { requireAuth } from "~/lib/auth";
import z from "zod";
import { createForm, setValue, zodForm } from "@modular-forms/solid";
import DashboardLayout from "./dashboard/layout";
import useProfile from "~/lib/composables/useProfile";

const baseSchema = z.object({
  displayName: z.string().min(1, { message: "Title is required" }),
  bio: z.string().min(1, { message: "Description is required" }),
  avatarUrl: z.string().min(1),
});

export type AddItemFormData = z.infer<typeof baseSchema>;

export default function EditProfilePage() {
  createAsync(() => requireAuth());
  const { profile } = useProfile();
  const [formError, setFormError] = createSignal<string | null>(null);

  const [form, { Form, Field }] = createForm<AddItemFormData>({
    validate: zodForm(baseSchema),
    initialValues: {
      displayName: "",
      bio: "",
      avatarUrl: "",
    },
  });

  // set ค่าจาก profile หลังโหลดเสร็จ
  createEffect(() => {
    const data = profile();
    if (data) {
      setValue(form, "displayName", data.displayName ?? "");
      setValue(form, "bio", data.bio ?? "");
      setValue(form, "avatarUrl", data.avatarUrl ?? "");
    }
  });

  const handleSubmit = async (values: AddItemFormData) => {
    setFormError(null); // reset error
    try {
      const res = await fetch("/api/user", {
        method: "PATCH",
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

      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      setFormError("An unexpected error occurred.");
    }
  };

  return (
    <DashboardLayout>
      <div class="max-w-xl mx-auto mt-12">
        <Form
          onSubmit={handleSubmit}
          class="space-y-6 bg-white p-8 rounded-xl shadow-md"
        >
          <h2 class="text-3xl font-bold text-gray-800">Edit Profile</h2>

          {formError() && (
            <div class="bg-red-100 text-red-700 p-3 rounded-md border border-red-300">
              {formError()}
            </div>
          )}

          <Field name="displayName">
            {(field, props) => {
              return (
                <div>
                  <label class="block mb-1 font-medium text-gray-700">
                    Display Name
                  </label>
                  <input
                    {...props}
                    value={field.value}
                    type="text"
                    class="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Display Name"
                    required
                  />
                  {field.error && (
                    <p class="mt-1 text-sm text-red-500">{field.error}</p>
                  )}
                </div>
              );
            }}
          </Field>

          <Field name="bio">
            {(field, props) => (
              <div>
                <label class="block mb-1 font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  {...props}
                  value={field.value}
                  rows={4}
                  class="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Biography"
                  required
                />
                {field.error && (
                  <p class="mt-1 text-sm text-red-500">{field.error}</p>
                )}
              </div>
            )}
          </Field>

          <Field name="avatarUrl">
            {(field, props) => (
              <div>
                <label class="block mb-1 font-medium text-gray-700">
                  Avatar URL
                </label>
                <input
                  value={field.value}
                  {...props}
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
              class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition cursor-pointer w-full"
            >
              Edit
            </button>
          </div>
        </Form>
      </div>
    </DashboardLayout>
  );
}
