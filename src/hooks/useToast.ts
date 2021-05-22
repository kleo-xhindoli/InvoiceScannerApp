import { useContext } from "react";
import { ToastContext } from "../components/providers/Toast";

export default function useToast() {
  const { showToast } = useContext(ToastContext);
  return { showToast };
}
