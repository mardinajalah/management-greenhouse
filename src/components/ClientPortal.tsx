import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ClientPortalProps = {
  children: ReactNode;
  selector?: string;
};

export function ClientPortal({ children, selector }: ClientPortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const element = selector ? document.querySelector(selector) : document.body;
  if (!element) return null;

  return createPortal(children, element);
}
