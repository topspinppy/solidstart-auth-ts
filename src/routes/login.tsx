import { createEffect, createSignal, Show } from "solid-js";
import LoginForm from "~/components/LoginForm";
import RegisterForm from "~/components/RegisterForm";

type AuthMode = "login" | "register";

export default function Home() {
  const [authMode, setAuthMode] = createSignal<AuthMode>("login");

  createEffect(() => {
    const storedMode = sessionStorage.getItem("authMode") as AuthMode ;
    if (storedMode === 'register') {
      setAuthMode('register');
    }
  })

  createEffect(() => {
    sessionStorage.setItem("authMode", authMode());
  });


  const toggleMode = () => {
    setAuthMode(authMode() === "login" ? "register" : "login");
  };

  return (
    <div class="min-h-screen bg-gradient-to-tr from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div
        class="w-full max-w-md bg-white/10 border border-white/20 rounded-2xl shadow-2xl text-white
         px-6 sm:px-8 py-6 sm:py-8
         max-h-screen overflow-y-auto"
      >
        <h2 class="text-3xl font-bold mb-6 text-center">
          <Show when={authMode() === "login"} fallback={<div>Register</div>}>
            Login
          </Show>
        </h2>

        <Show when={authMode() === "login"} fallback={<RegisterForm />}>
          <LoginForm />
        </Show>

        <p class="text-sm mt-6 text-center text-white/70">
          {authMode() === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={toggleMode}
                class="underline hover:text-purple-300"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={toggleMode}
                class="underline hover:text-purple-300"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>

    </div>
  );
}
