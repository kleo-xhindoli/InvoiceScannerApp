import React from "react";
import { ToastProvider } from "./src/components/providers/Toast";
import ScannerScreen from "./src/screens/ScannerScreen";

export default function App() {
  return (
    <ToastProvider>
      <ScannerScreen />
    </ToastProvider>
  );
}
