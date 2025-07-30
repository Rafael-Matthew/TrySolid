import { createSignal } from "solid-js";
import { A } from "@solidjs/router";

export default function RegisterPage() {
  const [formData, setFormData] = createSignal({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = createSignal(false);
  const [acceptTerms, setAcceptTerms] = createSignal(false);

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (formData().password !== formData().confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    if (!acceptTerms()) {
      alert("Please accept the terms and conditions!");
      return;
    }
    
    setIsLoading(true);
    // Simulate registration process
    setTimeout(() => {
      setIsLoading(false);
      console.log("Registration attempt:", formData());
    }, 2000);
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -inset-10 opacity-50">
          <div class="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div class="absolute top-1/3 right-1/4 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div class="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      {/* Main container */}
      <div class="relative w-full max-w-md">
        {/* Glass effect card */}
        <div class="backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8 transition-all duration-300 hover:bg-white/15 hover:shadow-3xl hover:scale-105">
          {/* Logo/Brand */}
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mb-4 transform transition-transform duration-300 hover:rotate-12 hover:scale-110">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
            <h1 class="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Create Account
            </h1>
            <p class="text-gray-300">Join us today and get started</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} class="space-y-6">
            {/* Name Fields */}
            <div class="grid grid-cols-2 gap-4">
              <div class="group">
                <label class="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  value={formData().firstName}
                  onInput={(e) => updateForm("firstName", e.target.value)}
                  placeholder="John"
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:bg-white/15 transition-all duration-300 hover:bg-white/15"
                  required
                />
              </div>
              <div class="group">
                <label class="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData().lastName}
                  onInput={(e) => updateForm("lastName", e.target.value)}
                  placeholder="Doe"
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:bg-white/15 transition-all duration-300 hover:bg-white/15"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div class="group">
              <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div class="relative">
                <input
                  type="email"
                  value={formData().email}
                  onInput={(e) => updateForm("email", e.target.value)}
                  placeholder="john.doe@example.com"
                  class="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:bg-white/15 transition-all duration-300 hover:bg-white/15"
                  required
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400 group-hover:text-emerald-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div class="group">
              <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div class="relative">
                <input
                  type="password"
                  value={formData().password}
                  onInput={(e) => updateForm("password", e.target.value)}
                  placeholder="Create a strong password"
                  class="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:bg-white/15 transition-all duration-300 hover:bg-white/15"
                  required
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400 group-hover:text-emerald-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div class="group">
              <label class="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <div class="relative">
                <input
                  type="password"
                  value={formData().confirmPassword}
                  onInput={(e) => updateForm("confirmPassword", e.target.value)}
                  placeholder="Confirm your password"
                  class="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-400 focus:bg-white/15 transition-all duration-300 hover:bg-white/15"
                  required
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400 group-hover:text-emerald-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div class="flex items-start">
              <input
                type="checkbox"
                checked={acceptTerms()}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                class="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
              />
              <span class="ml-3 text-sm text-gray-300">
                I agree to the{" "}
                <a href="#" class="text-emerald-400 hover:text-emerald-300 transition-colors duration-300">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" class="text-emerald-400 hover:text-emerald-300 transition-colors duration-300">
                  Privacy Policy
                </a>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading()}
              class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              {isLoading() ? (
                <div class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div class="my-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-white/20"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-transparent text-gray-400">Or register with</span>
              </div>
            </div>
          </div>

          {/* Social Registration Buttons */}
          <div class="grid grid-cols-2 gap-3">
            <button class="flex items-center justify-center px-4 py-2 border border-white/20 rounded-xl bg-white/10 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="ml-2 text-white text-sm">Google</span>
            </button>
            <button class="flex items-center justify-center px-4 py-2 border border-white/20 rounded-xl bg-white/10 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span class="ml-2 text-white text-sm">Facebook</span>
            </button>
          </div>

          {/* Sign in link */}
          <p class="mt-6 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <A href="/" class="text-emerald-400 hover:text-emerald-300 transition-colors duration-300 font-medium">
              Sign in
            </A>
          </p>
        </div>

        {/* Floating elements */}
        <div class="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20 animate-bounce"></div>
        <div class="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full opacity-20 animate-pulse"></div>
      </div>
    </div>
  );
}
