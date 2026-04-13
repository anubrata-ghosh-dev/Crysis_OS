'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Create a global toast context is overkill, so we'll use a simple hook
const toastQueue: ToastMessage[] = [];
let toastListeners: ((toasts: ToastMessage[]) => void)[] = [];

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  React.useEffect(() => {
    const listener = setToasts;
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener);
    };
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = Math.random().toString(36).substring(7);
    const toast: ToastMessage = { id, message, type, duration };

    const newToasts = [...toastQueue, toast];
    toastQueue.length = 0;
    toastQueue.push(...newToasts);

    toastListeners.forEach((listener) => listener(newToasts));

    if (duration > 0) {
      setTimeout(() => {
        const filteredToasts = toastQueue.filter((t) => t.id !== id);
        toastQueue.length = 0;
        toastQueue.push(...filteredToasts);
        toastListeners.forEach((listener) => listener(filteredToasts));
      }, duration);
    }
  }, []);

  return { toasts, showToast };
}

interface ToastContainerProps {
  toasts: ToastMessage[];
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} className="text-green-400" />;
      case 'error':
        return <AlertCircle size={18} className="text-red-400" />;
      case 'info':
        return <Info size={18} className="text-blue-400" />;
    }
  };

  const getBgColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-900 border-green-600';
      case 'error':
        return 'bg-red-900 border-red-600';
      case 'info':
        return 'bg-blue-900 border-blue-600';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[2000] pointer-events-none flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${getBgColor(
              toast.type
            )} backdrop-blur-lg pointer-events-auto`}
          >
            {getIcon(toast.type)}
            <span className="text-sm font-medium text-white">{toast.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
