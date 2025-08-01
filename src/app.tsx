import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { AuthProvider } from "~/lib/auth";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props: any) => (
        <MetaProvider>
          <Title>SolidStart - Modern Login</Title>
          <AuthProvider>
            <Suspense fallback={<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
              <div class="text-white text-xl">Loading...</div>
            </div>}>
              {props.children}
            </Suspense>
          </AuthProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
