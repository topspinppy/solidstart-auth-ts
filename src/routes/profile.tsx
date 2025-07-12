

export default function Profile() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="text-6xl text-sky-700 font-thin uppercase my-16">Profile</h1>
      <p class="text-lg">This is your profile page.</p>
      <div class="mt-8">
        <button class="bg-blue-500 text-white p-2 rounded">
          Edit Profile
        </button>
        <button class="bg-green-500 text-white p-2 rounded ml-4">
          Logout
        </button>
      </div>
    </main>
  );
}