import { TiUserAdd } from "react-icons/ti";
import { Link } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { useCopyToClipboard } from "react-use";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function InviteFriends() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, copyToClipboard] = useCopyToClipboard();

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            size="iconXs"
            variant="outline"
            className="!border-neutral-600 !text-neutral-400 !hover:!border-neutral-500 hover:!text-neutral-300"
          >
            <TiUserAdd className="size-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg lg:!p-8 !rounded-3xl !bg-white !border-neutral-100">
          <DialogTitle className="hidden" />
          <main>
            <div className="flex items-center justify-start -space-x-4 mb-5">
              <div className="size-11 rounded-full bg-pink-300 shadow-2xs flex items-center justify-center text-2xl">
                😎
              </div>
              <div className="size-11 rounded-full bg-amber-300 shadow-2xs flex items-center justify-center text-2xl z-2">
                😇
              </div>
              <div className="size-11 rounded-full bg-sky-300 shadow-2xs flex items-center justify-center text-2xl">
                😜
              </div>
            </div>
            <p className="text-xl font-semibold text-neutral-950 max-w-[200px]">
              Invite your friends to join us!
            </p>
            <p className="text-sm text-neutral-500 mt-2 max-w-sm">
              Support us and share the love and let them know about our awesome
              platform.
            </p>
            <div className="mt-4 space-x-3.5">
              <a
                href="https://x.com/intent/post?url=https://retrobuilder.app/&text=Checkout%20this%20awesome%20AI%20Tool!%20Vibe%20coding%20has%20never%20been%20so%20easy✨" // TODO: Update to actual Retro Builder URL if different
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="lightGray"
                  size="sm"
                  className="!text-neutral-700"
                >
                  <FaXTwitter className="size-4" />
                  Share on
                </Button>
              </a>
              <Button
                variant="lightGray"
                size="sm"
                className="!text-neutral-700"
                onClick={() => {
                  copyToClipboard("https://retrobuilder.app/"); // TODO: Update to actual Retro Builder URL if different
                  toast.success("Invite link copied to clipboard!");
                }}
              >
                <Link className="size-4" />
                Copy Invite Link
              </Button>
            </div>
          </main>
        </DialogContent>
      </form>
    </Dialog>
  );
}
