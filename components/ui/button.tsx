import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const buttonVariants = cva("button", { variants: { variant: { primary: "primary", outline: "outline", ghost: "ghost" }, size: { default: "", compact: "compact", full: "full" } }, defaultVariants: { variant: "primary", size: "default" } });
type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean };
export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) { const Comp = asChild ? Slot : "button"; return <Comp data-slot="button" className={clsx(buttonVariants({ variant, size }), className)} {...props} />; }
