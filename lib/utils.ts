import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const COLORS = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "pink",
  "gray",
];

export const getPTag = (repoId: string) => {
  return `<p style="border-radius: 8px; text-align: center; font-size: 12px; color: #fff; margin-top: 16px;position: fixed; left: 8px; bottom: 8px; z-index: 10; background: rgba(0, 0, 0, 0.8); padding: 4px 8px;">Made with <img src="https://retrobuilder.app/logo.svg" alt="Retro Builder Logo" style="width: 16px; height: 16px; vertical-align: middle;display:inline-block;margin-right:3px;filter:brightness(0) invert(1);"><a href="https://retrobuilder.app" style="color: #fff;text-decoration: underline;" target="_blank" >Retro Builder</a> - 🧬 <a href="https://retrobuilder.app?remix=${repoId}" style="color: #fff;text-decoration: underline;" target="_blank" >Remix</a></p>`; // TODO: Update to actual Retro Builder URLs if different
};
