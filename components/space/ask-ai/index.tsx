"use client";

import { ArrowUp } from "lucide-react";
import { PiGearSixFill } from "react-icons/pi";
import { TiUserAdd } from "react-icons/ti";

import { Button } from "@/components/ui/button";

export const AskAi = () => {
  return (
    <>
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl ring-[4px] focus-within:ring-neutral-500/30 focus-within:border-neutral-600 ring-transparent group">
        <textarea
          rows={3}
          className="w-full bg-transparent text-sm outline-none text-white placeholder:text-neutral-400 p-4 resize-none mb-1"
          placeholder="Ask Retro Builder anything..."
          onChange={() => {}}
          onKeyDown={() => {}}
        />
        <div className="flex items-center justify-between gap-2 px-4 pb-3">
          <div className="flex-1 flex justify-start">
            <Button
              size="iconXs"
              variant="outline"
              className="!border-neutral-600 !text-neutral-400 !hover:!border-neutral-500 hover:!text-neutral-300"
            >
              <TiUserAdd className="size-4" />
            </Button>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="black" size="sm">
              <PiGearSixFill className="size-4" />
              Settings
            </Button>
            <Button size="iconXs">
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
