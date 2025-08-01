import { Title } from "@solidjs/meta";
import { HttpStatusCode } from "@solidjs/start";
import { A } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

export default function NotFound() {
  const [mousePosition, setMousePosition] = createSignal({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = createSignal(false);

  onMount(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden relative">
      <Title>404 - Page Not Found</Title>
      <HttpStatusCode code={404} />
      
      {/* Animated background particles */}
      <div class="absolute inset-0">
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div class="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Mouse follower effect */}
      <div 
        class="fixed w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full pointer-events-none z-50 transition-transform duration-100 ease-out mix-blend-screen"
        style={{
          left: `${mousePosition().x - 12}px`,
          top: `${mousePosition().y - 12}px`,
          transform: 'scale(1)',
        }}
      ></div>

      {/* Main content */}
      <div class={`relative z-10 text-center transform transition-all duration-1000 ${isVisible() ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        
        {/* 404 Number with glitch effect */}
        <div class="relative mb-8">
          <h1 class="text-9xl md:text-[12rem] font-black text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text animate-pulse">
            404
          </h1>
          {/* Glitch layers */}
          <h1 class="absolute top-0 left-0 text-9xl md:text-[12rem] font-black text-red-500/30 animate-pulse" style="clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%)">
            404
          </h1>
          <h1 class="absolute top-0 left-0 text-9xl md:text-[12rem] font-black text-blue-500/30 animate-pulse animation-delay-1000" style="clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%)">
            404
          </h1>
        </div>

        {/* Error message */}
        <div class="mb-8 space-y-4">
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in-up">
            Oops! Page Not Found
          </h2>
          <p class="text-xl text-gray-300 max-w-md mx-auto animate-fade-in-up animation-delay-500">
            The page you're looking for seems to have vanished into the digital void.
          </p>
        </div>

        {/* Animated robot/astronaut */}
        <div class="mb-8 animate-float">
          <div class="inline-block p-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full backdrop-blur-sm border border-white/10">
            <svg class="w-24 h-24 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              <circle cx="9" cy="9" r="1"></circle>
              <circle cx="15" cy="9" r="1"></circle>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6"></path>
            </svg>
          </div>
        </div>

        {/* Action buttons */}
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-1000">
          <A 
            href="/" 
            class="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
          >
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Go Home
            </span>
          </A>
          
          <button 
            onClick={() => window.history.back()}
            class="group px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-white/40"
          >
            <span class="flex items-center">
              <svg class="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Go Back
            </span>
          </button>
        </div>

        {/* Help text */}
        <div class="mt-12 animate-fade-in-up animation-delay-1500">
          <p class="text-gray-400 text-sm">
            Lost? Try searching or contact our support team
          </p>
          <div class="flex justify-center mt-4 space-x-6">
            <a href="mailto:support@example.com" class="text-purple-400 hover:text-purple-300 transition-colors duration-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </a>
            <a href="#" class="text-purple-400 hover:text-purple-300 transition-colors duration-300">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </a>
            <a href="#" class="text-purple-400 hover:text-purple-300 transition-colors duration-300">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div class="absolute top-20 left-20 w-16 h-16 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full animate-bounce"></div>
      <div class="absolute bottom-20 right-20 w-20 h-20 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full animate-bounce animation-delay-2000"></div>
      <div class="absolute top-1/2 left-10 w-12 h-12 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full animate-bounce animation-delay-4000"></div>
      <div class="absolute bottom-1/3 left-1/3 w-8 h-8 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full animate-bounce animation-delay-1000"></div>
    </div>
  );
}
