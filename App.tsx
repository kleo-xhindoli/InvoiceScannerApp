import React from "react";
import { ToastProvider } from "./src/components/providers/Toast";
import RootNavigator from "./src/navigators/RootNavigator";

export default function App() {
  return (
    <ToastProvider>
      <RootNavigator />
    </ToastProvider>
  );
}
