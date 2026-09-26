import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";


const variants = {
    default: "",
    primary: "min-h-12 rounded-full border border-white/15 bg-white px-7 text-sm text-[#551A8B] transition duration-300",
    link: "text-gray-300 hover:text-white hover:bg-white/5 rounded-lg",
    "button-red": "rounded-full bg-transparent px-5 py-2.5 text-sm font-medium text-[#dba0a0] transition-colors hover:bg-[#dba0a0]/10 sm:px-6",
    secondary: "bg-white/10 text-white hover:bg-white/20",
} as const;

const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-2 py-2 text-base",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
}

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type LinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type Props = ButtonProps | LinkProps;



export default function Button({
  variant = "default",
  size = "md",
  children,
  className = "",
  ...props
}: Props) {
  const classes = `
    inline-flex
    items-center
    justify-center
    font-medium
    transition-colors
    cursor-pointer
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  if ("href" in props && props.href) {
    return (
      <a {...props} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
}