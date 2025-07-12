

export default function Dashboard() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="text-6xl text-sky-700 font-thin uppercase my-16">Dashboard</h1>
      <p class="text-lg">Welcome to your dashboard!</p>
      <div class="mt-8">
        <button class="bg-blue-500 text-white p-2 rounded">
          View Profile
        </button>
        <button class="bg-green-500 text-white p-2 rounded ml-4">
          Settings
        </button>
      </div>
    </main>
  );
}