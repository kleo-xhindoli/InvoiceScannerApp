import React from "react";
import { ToastProvider } from "./src/components/providers/Toast";
import Config from "./src/config/environment";
import RootNavigator from "./src/navigators/RootNavigator";

console.log(Config.apiUrl)

export default function App() {
  return (
    <ToastProvider>
      <RootNavigator />
    </ToastProvider>
  );
}
