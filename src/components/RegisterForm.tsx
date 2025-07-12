import { createForm, zodForm } from "@modular-forms/solid";
import z from "zod";

const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  surname: z.string().min(1, "Surname is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
  birthdate: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url("Invalid URL").optional(), // Fixed: use z.string().url()
})

const schema = baseSchema.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"] // This helps with field-specific error placement
});

type FormData = z.infer<typeof schema>;

export default function RegisterForm() {
  const [, { Form, Field }] = createForm<FormData>({
    validate: zodForm(schema),
    initialValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthdate: "",
      bio: "",
      avatarUrl: ""
    }
  })
  return (
    <Form
      class="flex flex-col gap-5 sm:gap-6 py-6 sm:py-8"
      onSubmit={(values) => {
        console.log("Form submitted with values:", values);
      }}
    >
      <Field name="name">
        {(field, props) => (
          <div>
            <label class="block text-sm font-medium mb-1 text-white">Name</label>
            <input
              {...props}
              type="text"
              placeholder="eg, John"
              class="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {field.error && (
              <p class="mt-1 text-sm text-red-500">{field.error}</p>
            )}
          </div>
        )}
      </Field>

      <Field name="surname">
        {(field, props) => (
          <div>
            <label class="block text-sm font-medium mb-1 text-white">Surname</label>
            <input
              {...props}
              type="text"
              placeholder="eg, Doe"
              class="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {field.error && (
              <p class="mt-1 text-sm text-red-500">{field.error}</p>
            )}
          </div>
        )}
      </Field>

      <Field name="email">
        {(field, props) => (
          <div>
            <label class="block text-sm font-medium mb-1 text-white">Email</label>
            <input
              {...props}
              type="email"
              placeholder="you@example.com"
              class="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {field.error && (
              <p class="mt-1 text-sm text-red-500">{field.error}</p>
            )}
          </div>
        )}
      </Field>

      <Field name="password">
        {(field, props) => (
          <div>
            <label class="block text-sm font-medium mb-1 text-white">Password</label>
            <input
              {...props}
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {field.error && (
              <p class="mt-1 text-sm text-red-500">{field.error}</p>
            )}
          </div>
        )}
      </Field>
      <Field name="confirmPassword">
        {(field, props) => (
          <div>
            <label class="block text-sm font-medium mb-1 text-white">Confirm Password</label>
            <input
              {...props}
              type="password"
              placeholder="••••••••"
              class="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {field.error && (
              <p class="mt-1 text-sm text-red-500">{field.error}</p>
            )}
          </div>
        )}
      </Field>

      <Field name="birthdate">
        {(field, props) => (
          <div>
            <label class="block text-sm font-medium mb-1 text-white">Birthdate</label>
            <input
              {...props}
              type="date"
              class="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {field.error && (
              <p class="mt-1 text-sm text-red-500">{field.error}</p>
            )}
          </div>
        )}
      </Field>

      <Field name="bio">
        {(field, props) => (
          <div>
            <label class="block text-sm font-medium mb-1 text-white">Short Bio</label>
            <textarea
              {...props}
              rows="3"
              placeholder="Tell us a bit about yourself..."
              class="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            ></textarea>
            {field.error && (
              <p class="mt-1 text-sm text-red-500">{field.error}</p>
            )}
          </div>
        )}
      </Field>

      <Field name="avatarUrl">
        {(field, props) => (
          <div>
            <label class="block text-sm font-medium mb-1 text-white">Avatar URL</label>
            <input
              {...props}
              type="url"
              placeholder="https://example.com/avatar.png"
              class="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {field.error && (
              <p class="mt-1 text-sm text-red-500">{field.error}</p>
            )}
          </div>
        )}
      </Field>

      <button
        type="submit"
        class="w-full py-2 bg-purple-600 hover:bg-purple-500 transition duration-300 text-white font-semibold rounded-lg shadow-lg"
      >
        สมัครสมาชิก
      </button>
    </Form>
  );
}