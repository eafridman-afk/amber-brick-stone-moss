import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function Slider({
  className,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center py-1",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-elevated">
        <SliderPrimitive.Range className="absolute h-full bg-accent-dim" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "block size-4 rounded-full border border-border-strong bg-fg shadow-sm",
          "transition-colors hover:bg-accent focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none",
        )}
      />
    </SliderPrimitive.Root>
  );
}
