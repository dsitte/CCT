import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const API_PORT = import.meta.env.VITE_API_PORT;

if (!API_PORT) {
  throw new Error(`API_PORT falsy: ${API_PORT}`);
}

const client = new ApolloClient({
  uri: `http://localhost:${API_PORT}`,
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
