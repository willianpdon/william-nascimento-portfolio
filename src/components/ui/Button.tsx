import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "ghost";

interface CommonProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
}

type AsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type AsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    disabled?: boolean;
  };

type ButtonProps = AsButton | AsAnchor;

/**
 * Shared call-to-action control. Renders an <a> when `href` is provided
 * (used for anchors, mailto and external profile links) and a <button>
 * otherwise. Supports a disabled/placeholder state, used for the CV
 * download until a real file is supplied.
 */
export function Button({
  variant = "primary",
  children,
  className,
  icon,
  ...rest
}: ButtonProps) {
  const classes = [styles.button, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  if ("href" in rest && rest.href !== undefined) {
    const { disabled, onClick, ...anchorProps } = rest;
    return (
      <a
        className={classes}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : undefined}
        {...anchorProps}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
      >
        {icon}
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {icon}
      {children}
    </button>
  );
}
