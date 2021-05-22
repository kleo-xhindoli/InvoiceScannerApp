import React, { useState, useRef, useCallback } from "react";
import { Animated, Easing } from "react-native";
import { Toast } from "../ui/Toast";

interface ToastCfg {
  text: string;
  duration?: number;
}

export interface ToastCtxType {
  showToast: (config: ToastCfg) => void;
}

export const ToastContext = React.createContext<ToastCtxType>({
  showToast: () => {},
});

interface ToastProviderProps {
  children: React.ReactElement | React.ReactElement[];
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastCfg | null>(null);
  const [isShowing, setIsShowing] = useState(false);
  const timeout = useRef<any>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const _show = (cfg: ToastCfg) => {
    setToast(cfg);
    setIsShowing(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 250,
      easing: Easing.inOut(Easing.sin),
      useNativeDriver: true,
    }).start();
  };

  const _hide = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      easing: Easing.inOut(Easing.sin),
      useNativeDriver: true,
    }).start(() => {
      setIsShowing(false);
      setToast(null);
    });
  };

  const showToast = useCallback(({ text, duration = 3000 }: ToastCfg) => {
    timeout.current && clearTimeout(timeout.current);
    _show({ text, duration });

    timeout.current = setTimeout(() => {
      _hide();
    }, duration);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && isShowing && <Toast text={toast.text} opacity={fadeAnim} />}
    </ToastContext.Provider>
  );
}
