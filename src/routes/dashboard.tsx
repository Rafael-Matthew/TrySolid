import { useAuth } from "~/lib/auth";
import { createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import CollaborativeWhiteboard from "~/components/CollaborativeWhiteboard";

export default function Dashboard() {
  const auth = useAuth();
  const navigate = useNavigate();

  createEffect(() => {
    if (!auth.user()) {
      navigate("/");
    }
  });

  const handleLogout = () => {
    auth.logout();
    navigate("/");
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav class="backdrop-blur-lg bg-white/10 border-b border-white/20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <h1 class="text-xl font-semibold text-white">Dashboard</h1>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="text-gray-300">
                Welcome, {auth.user()?.firstName}!
              </div>
              <button
                onClick={handleLogout}
                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Welcome Card */}
            <div class="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-white">Profile</h3>
                  <p class="text-gray-300">Manage your account</p>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div class="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-white">Analytics</h3>
                  <p class="text-gray-300">View your stats</p>
                </div>
              </div>
            </div>

            {/* Settings Card */}
            <div class="backdrop-blur-lg bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-white">Settings</h3>
                  <p class="text-gray-300">Configure preferences</p>
                </div>
              </div>
            </div>
          </div>

          {/* Collaborative Whiteboard */}
          <div class="mt-8">
            <CollaborativeWhiteboard />
          </div>

          {/* Main Content Area */}
          <div class="mt-8">
            <div class="backdrop-blur-lg bg-white/10 rounded-2xl border border-white/20 p-8">
              <h2 class="text-2xl font-bold text-white mb-6">Welcome to your Dashboard!</h2>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 class="text-lg font-semibold text-white mb-4">User Information</h3>
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-gray-300">Name:</span>
                      <span class="text-white">{auth.user()?.firstName} {auth.user()?.lastName}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-300">Email:</span>
                      <span class="text-white">{auth.user()?.email}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-300">Status:</span>
                      <span class="text-green-400">Active</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div class="space-y-3">
                    <button class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                      Update Profile
                    </button>
                    <button class="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                      View Reports
                    </button>
                    <button class="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
                      Account Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Animated background elements */}
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -inset-10 opacity-30">
          <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div class="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div class="absolute bottom-1/4 left-1/3 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>
    </div>
  );
}
