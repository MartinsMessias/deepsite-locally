import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";

export const FollowUpTooltip = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Info className="size-3 text-neutral-300 cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="!rounded-2xl !p-0 min-w-xs text-center overflow-hidden"
      >
        <header className="bg-neutral-950 px-4 py-3 border-b border-neutral-700/70">
          <p className="text-base text-neutral-200 font-semibold">
            ⚡ Faster, Smarter Updates
          </p>
        </header>
        <main className="p-4">
          <p className="text-neutral-300 text-sm">
            Using the Diff-Patch system, allow Retro Builder to intelligently update
            your project without rewritting the entire codebase.
          </p>
          <p className="text-neutral-500 text-sm mt-2">
            This means faster updates, less data usage, and a more efficient
            development process.
          </p>
        </main>
      </PopoverContent>
    </Popover>
  );
};
