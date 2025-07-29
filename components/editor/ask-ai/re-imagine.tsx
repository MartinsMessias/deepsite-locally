import { useState } from "react";
import { Paintbrush } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import Loading from "@/components/loading";
import { api } from "@/lib/api";

export function ReImagine({
  onRedesign,
}: {
  onRedesign: (md: string) => void;
}) {
  const [url, setUrl] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfUrlIsValid = (url: string) => {
    const urlPattern = new RegExp(
      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
      "i"
    );
    return urlPattern.test(url);
  };

  const handleClick = async () => {
    if (isLoading) return; // Prevent multiple clicks while loading
    if (!url) {
      toast.error("Please enter a URL.");
      return;
    }
    if (!checkIfUrlIsValid(url)) {
      toast.error("Please enter a valid URL.");
      return;
    }
    setIsLoading(true);
    const response = await api.put("/re-design", {
      url: url.trim(),
    });
    if (response?.data?.ok) {
      setOpen(false);
      setUrl("");
      onRedesign(response.data.markdown);
      toast.success("Retro Builder is redesigning your site! Let him cook... 🔥");
    } else {
      toast.error(response?.data?.error || "Failed to redesign the site.");
    }
    setIsLoading(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <form>
        <PopoverTrigger asChild>
          <Button
            size="iconXs"
            variant="outline"
            className="!border-neutral-600 !text-neutral-400 !hover:!border-neutral-500 hover:!text-neutral-300"
          >
            <Paintbrush className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="!rounded-2xl !p-0 !bg-white !border-neutral-100 min-w-xs text-center overflow-hidden"
        >
          <header className="bg-neutral-50 p-6 border-b border-neutral-200/60">
            <div className="flex items-center justify-center -space-x-4 mb-3">
              <div className="size-9 rounded-full bg-pink-200 shadow-2xs flex items-center justify-center text-xl opacity-50">
                🎨
              </div>
              <div className="size-11 rounded-full bg-amber-200 shadow-2xl flex items-center justify-center text-2xl z-2">
                🥳
              </div>
              <div className="size-9 rounded-full bg-sky-200 shadow-2xs flex items-center justify-center text-xl opacity-50">
                💎
              </div>
            </div>
            <p className="text-xl font-semibold text-neutral-950">
              Redesign your Site!
            </p>
            <p className="text-sm text-neutral-500 mt-1.5">
              Try our new Redesign feature to give your site a fresh look.
            </p>
          </header>
          <main className="space-y-4 p-6">
            <div>
              <p className="text-sm text-neutral-700 mb-2">
                Enter your website URL to get started:
              </p>
              <Input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={(e) => {
                  const inputUrl = e.target.value.trim();
                  if (!inputUrl) {
                    setUrl("");
                    return;
                  }
                  if (!checkIfUrlIsValid(inputUrl)) {
                    toast.error("Please enter a valid URL.");
                    return;
                  }
                  setUrl(inputUrl);
                }}
                className="!bg-white !border-neutral-300 !text-neutral-800 !placeholder:text-neutral-400 selection:!bg-blue-100"
              />
            </div>
            <div>
              <p className="text-sm text-neutral-700 mb-2">
                Then, let&apos;s redesign it!
              </p>
              <Button
                variant="black"
                onClick={handleClick}
                className="relative w-full"
              >
                {isLoading ? (
                  <>
                    <Loading
                      overlay={false}
                      className="ml-2 size-4 animate-spin"
                    />
                    Fetching your site...
                  </>
                ) : (
                  <>
                    Redesign <Paintbrush className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </main>
        </PopoverContent>
      </form>
    </Popover>
  );
}
