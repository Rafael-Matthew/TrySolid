import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props: any) => (
        <MetaProvider>
          <Title>SolidStart - Basic</Title>
          <nav class="p-4 bg-blue-500 text-white">
            <a href="/" class="mr-4 hover:underline">Index</a>
            <a href="/about" class="hover:underline">About</a>
          </nav>
          <Suspense>{props.children}</Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
