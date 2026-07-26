import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Centers content and applies the shared max-width/padding used across
 * every section, so page sections don't each re-implement layout.
 */
export function Container({ children, className }: ContainerProps) {
  const classes = className ? `container ${className}` : "container";
  return <div className={classes}>{children}</div>;
}
