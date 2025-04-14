import { cn } from "@/lib/utils";

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
}

export const Logo = ({ className, ...props }: LogoProps) => {
  return (
    <img
      src="/iqify-logo.png"
      alt="IQify Logo"
      className={cn("h-12 w-auto", className)}
      {...props}
    />
  );
}; 