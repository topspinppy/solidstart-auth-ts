

export default function LoginForm() {
  return (
    <form class="space-y-5">
      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          class="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-white/60"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          class="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-white/60"
          placeholder="••••••••"
          required
        />
      </div>

      <button
        type="submit"
        class="w-full py-2 bg-purple-600 hover:bg-purple-500 transition duration-300 text-white font-semibold rounded-lg shadow-lg"
      >
        เข้าสู่ระบบ
      </button>
    </form>
  )
}