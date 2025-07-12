import { createAsync } from "@solidjs/router";
import { createEffect, createSignal, Show } from "solid-js";
import LoginForm, { FormData } from "~/components/LoginForm";
import RegisterForm, { RegisterFormData } from "~/components/RegisterForm";
import { redirectIfAuthenticated } from "~/lib/auth";

type AuthMode = "login" | "register";

export default function Home() {
  const [authMode, setAuthMode] = createSignal<AuthMode>("login");
  const [error, setError] = createSignal<string>();

  createAsync(() => {
    return redirectIfAuthenticated();
  })
  
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

  const handleLogin = async (values: FormData) => {
    setError(undefined);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const payload = await res.json();
        setError(payload.message || "Login failed");
        return;
      }
      
      window.location.href = '/dashboard';
    } catch (error) {
      console.error(error);
      setError("Network error, please try again");
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setError(undefined);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const payload = await res.json();
        setError(payload.message || "Register failed");
        return;
      }
      
      toggleMode()
    } catch (error) {
      console.error(error);
      setError("Network error, please try again");
    }
  }
  

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

        <Show when={authMode() === "login"} fallback={<RegisterForm onSubmit={handleRegister}/>}>
          <LoginForm 
            onSubmit={handleLogin}
          />
        </Show>
        <Show when={error()}>
          <p class="text-red-500 text-sm mt-4">{error()}</p>
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
