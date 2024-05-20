import Link from "next/link";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import Loader from "../Loader";

interface IButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "transparent" | "link" | "none";
  isLoading?: boolean;
  hasMinWidth?: boolean;
  size?: "small" | "large" | "xlarge" | "inherit";
}

interface ILinkButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "transparent" | "link" | "none";
  hasMinWidth?: boolean;
  className?: string;
  isUnderlined?: boolean;
  size?: "small" | "large" | "xlarge" | "inherit";
  target?: "_blank" | "_self" | "_parent" | "_top";
}

const sizes = {
  small: "h-9 text-sm",
  large: "h-11",
  xlarge: "h-14 px-6",
  inherit: ""
};

const classnames = {
  primary:
    "!bg-primary-100 text-white hover:opacity-75 hover:text-white px-4 disabled:opacity-75",
  secondary:
    "bg-white text-slate-800 border border-slate-200 px-4 shadow-sm hover:bg-slate-100 focus:ring-2 focus:ring-slate-200 focus:ring-opacity-50",
  transparent: "bg-transparent px-4 font-semibold",
  link: "bg-transparent h-auto px-0 hover:opacity-50 text-left",
  none: ""
};

const Button: React.FC<IButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  hasMinWidth = false,
  type,
  isLoading = false,
  size = "inherit",
  ...props
}) => {
  return (
    <button
      type={type || "button"}
      className={`max-w-md rounded-lg transition duration-200 ease-in-out ${
        classnames[variant]
      } ${sizes[size]} ${hasMinWidth ? "min-w-[220px]" : ""}  ${className}`}
      {...props}
    >
      {!isLoading ? children : <Loader />}
    </button>
  );
};

export const LinkButton: React.FC<ILinkButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  hasMinWidth = false,
  isUnderlined = false,
  size = "inherit",
  href,
  target = "_self"
}) => {
  return (
    <Link
      href={href}
      target={target}
      className={`max-w-md rounded-lg flex items-center justify-center ${
        isUnderlined ? "underline" : "!no-underline"
      } 	transition duration-200 ease-in-out ${classnames[variant]} ${
        sizes[size]
      } ${hasMinWidth ? "min-w-[220px]" : ""}  ${className}`}
    >
      {children}
    </Link>
  );
};

export default Button;
