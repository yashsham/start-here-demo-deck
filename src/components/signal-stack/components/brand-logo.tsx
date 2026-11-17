import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function BrandLogo({ size = "md", className = "" }: BrandLogoProps) {
  const sizeMap = {
    sm: "size-7 p-[5px] gap-[2.5px] rounded-md",
    md: "size-9 p-[6px] gap-[3px] rounded-lg",
    lg: "size-11 p-[7px] gap-[3.5px] rounded-xl",
    xl: "size-14 p-[9px] gap-[4.5px] rounded-2xl",
  };

  const tileMap = {
    sm: "rounded-[1.5px]",
    md: "rounded-[2px]",
    lg: "rounded-[3px]",
    xl: "rounded-[4px]",
  };

  return (
    <span
      className={`grid shrink-0 grid-cols-2 border border-primary/30 bg-[#070e1b] shadow-inner transition-colors ${sizeMap[size]} ${className}`}
      aria-hidden="true"
    >
      <span className={`${tileMap[size]} bg-primary`} />
      <span className={`${tileMap[size]} bg-primary/70`} />
      <span className={`${tileMap[size]} bg-cyan`} />
      <span className={`${tileMap[size]} bg-primary/40`} />
    </span>
  );
}