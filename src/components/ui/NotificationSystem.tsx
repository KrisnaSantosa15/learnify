"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { removeToast } from "@/lib/slices/uiSlice";

export default function NotificationSystem() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => {
    const ui = state.ui as any;
    return ui?.toasts || [];
  });

  // Auto-remove toasts after their duration
  useEffect(() => {
    toasts.forEach((toast: any) => {
      setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, toast.duration || 3000);
    });
  }, [toasts, dispatch]);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast: any) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded-lg shadow-lg text-white transform transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-500"
              : toast.type === "error"
              ? "bg-red-500"
              : toast.type === "warning"
              ? "bg-yellow-500"
              : "bg-blue-500"
          } animate-slide-in`}
          onClick={() => dispatch(removeToast(toast.id))}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {toast.type === "success"
                ? "✅"
                : toast.type === "error"
                ? "❌"
                : toast.type === "warning"
                ? "⚠️"
                : "ℹ️"}
            </span>
            <span>{toast.message}</span>
            <button
              className="ml-2 opacity-70 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(removeToast(toast.id));
              }}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
