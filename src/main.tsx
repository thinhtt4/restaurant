import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import { persister, store } from "./store/store.ts";
import { Toaster } from "@/components/ui/sonner";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate persistor={persister}>
      <App />
    </PersistGate>
    
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#E8EDFF",
          color: "#1E3A8A",
          border: "1px solid #A5B4FC",
          borderRadius: "10px",
          fontWeight: 500,
          padding: "15px 20px",
        },
        className: "shadow-md",
      }}
    />
  </Provider>
);
