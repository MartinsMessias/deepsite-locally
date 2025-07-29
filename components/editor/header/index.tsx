import { ReactNode } from "react";
import { Eye, MessageCircleCode } from "lucide-react";

import Logo from "@/assets/logo.svg";

import { Button } from "@/components/ui/button";
import classNames from "classnames";
import Image from "next/image";

const TABS = [
  {
    value: "chat",
    label: "Chat",
    icon: MessageCircleCode,
  },
  {
    value: "preview",
    label: "Preview",
    icon: Eye,
  },
];

export function Header({
  tab,
  onNewTab,
  children,
}: {
  tab: string;
  onNewTab: (tab: string) => void;
  children?: ReactNode;
}) {
  return (
    <header className="border-b bg-slate-200 border-slate-300 dark:bg-neutral-950 dark:border-neutral-800 px-3 lg:px-6 py-2 flex items-center max-lg:gap-3 justify-between lg:grid lg:grid-cols-3 z-20">
      <div className="flex items-center justify-start gap-3">
        <h1 className="text-neutral-900 dark:text-white text-lg lg:text-xl font-bold flex items-center justify-start">
          <Image
            src={Logo}
            alt="Retro Builder Logo"
            className="size-6 lg:size-8 mr-2 invert-100 dark:invert-0"
          />
          <p className="max-md:hidden flex items-center justify-start">
            Retro Builder
            <span className="font-mono bg-gradient-to-br from-sky-500 to-emerald-500 text-neutral-950 rounded-full text-xs ml-2 px-1.5 py-0.5">
              {" "}
              v2
            </span>
          </p>
        </h1>
      </div>
      <div className="flex items-center justify-start lg:justify-center gap-1 max-lg:pl-3 flex-1 max-lg:border-l max-lg:border-l-neutral-800">
        {TABS.map((item) => (
          <Button
            key={item.value}
            variant={tab === item.value ? "secondary" : "ghost"}
            className={classNames("", {
              "opacity-60": tab !== item.value,
            })}
            size="sm"
            onClick={() => onNewTab(item.value)}
          >
            <item.icon className="size-4" />
            <span className="hidden md:inline">{item.label}</span>
          </Button>
        ))}
      </div>
      <div className="flex items-center justify-end gap-3">{children}</div>
    </header>
  );
}
