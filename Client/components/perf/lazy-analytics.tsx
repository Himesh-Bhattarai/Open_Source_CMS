"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const VercelAnalytics = dynamic(
  () => import("@vercel/analytics/next").then((module) => module.Analytics),
  { ssr: false },
);

type WindowWithIdleCallbacks = Window & {
  requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export function LazyAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== "true") return;

    const windowWithIdle = window as WindowWithIdleCallbacks;
    if (typeof windowWithIdle.requestIdleCallback === "function") {
      const handle = windowWithIdle.requestIdleCallback(() => setEnabled(true), {
        timeout: 2000,
      });

      return () => {
        if (typeof windowWithIdle.cancelIdleCallback === "function") {
          windowWithIdle.cancelIdleCallback(handle);
        }
      };
    }

    const timeout = window.setTimeout(() => setEnabled(true), 1200);
    return () => window.clearTimeout(timeout);
  }, []);

  if (process.env.NODE_ENV !== "production") return null;
  if (process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== "true") return null;
  if (!enabled) return null;

  return <VercelAnalytics />;
}
