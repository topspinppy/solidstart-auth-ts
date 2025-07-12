import { createForm, zodForm } from "@modular-forms/solid";
import z from "zod";

const schema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6"),
})

export type FormData = z.infer<typeof schema>;

interface ILoginFormProps {
  onSubmit: (values: FormData) => void;
}

export default function LoginForm(props: ILoginFormProps) {
  const { onSubmit } = props;
  const [, { Form, Field }] = createForm<FormData>({
    validate: zodForm(schema),
    initialValues: {
      email: "",
      password: ""
    }
  });

  const handleSubmit = (values: FormData) => {
    onSubmit(values);
  }

  return (
    <Form 
      class="space-y-5"
      onSubmit={handleSubmit}
    >
      <Field name="email">
        {(field, props) => (
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input
              {...props}
              type="email"
              class="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-white/60"
              placeholder="you@example.com"
              required
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
            <label class="block text-sm font-medium mb-1">Password</label>
            <input
              {...props}
              type="password"
              class="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-white/60"
              placeholder="••••••••"
              required
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
        เข้าสู่ระบบ
      </button>
    </Form>
  )
}