"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMount, useUnmount } from "react-use";
import classNames from "classnames";

import Logo from "@/assets/logo.svg";

const navigationLinks = [
  {
    name: "Create Website",
    href: "/projects/new",
  },
  {
    name: "Features",
    href: "#features",
  },
  {
    name: "Community",
    href: "#community",
  },
  {
    name: "Deploy",
    href: "#deploy",
  },
];

export default function Navigation() {
  const [hash, setHash] = useState("");

  const selectorRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLLIElement[]>(
    new Array(navigationLinks.length).fill(null)
  );
  const [isScrolled, setIsScrolled] = useState(false);

  useMount(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100);
    };

    const initialHash = window.location.hash;
    if (initialHash) {
      setHash(initialHash);
      calculateSelectorPosition(initialHash);
    }

    window.addEventListener("scroll", handleScroll);
  });

  useUnmount(() => {
    window.removeEventListener("scroll", () => {});
  });

  const handleClick = (href: string) => {
    setHash(href);
    calculateSelectorPosition(href);
  };

  const calculateSelectorPosition = (href: string) => {
    if (selectorRef.current && linksRef.current) {
      const index = navigationLinks.findIndex((l) => l.href === href);
      const targetLink = linksRef.current[index];
      if (targetLink) {
        const targetRect = targetLink.getBoundingClientRect();
        selectorRef.current.style.left = targetRect.left + "px";
        selectorRef.current.style.width = targetRect.width + "px";
      }
    }
  };

  return (
    <div
      className={classNames(
        "sticky top-0 z-10 transition-all duration-200 backdrop-blur-md",
        {
          "bg-black/30": isScrolled,
        }
      )}
    >
      <nav className="grid grid-cols-2 p-4 container mx-auto">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src={Logo}
            className="w-9 mr-1"
            alt="Retro Builder Logo"
            width={64}
            height={64}
          />
          <p className="font-sans text-white text-xl font-bold">Retro Builder</p>
        </Link>
        <ul className="items-center justify-center gap-6 hidden">
          {navigationLinks.map((link) => (
            <li
              key={link.name}
              ref={(el) => {
                const index = navigationLinks.findIndex(
                  (l) => l.href === link.href
                );
                if (el && linksRef.current[index] !== el) {
                  linksRef.current[index] = el;
                }
              }}
              className="inline-block font-sans text-sm"
            >
              <Link
                href={link.href}
                className={classNames(
                  "text-neutral-500 hover:text-primary transition-colors",
                  {
                    "text-primary": hash === link.href,
                  }
                )}
                onClick={() => {
                  handleClick(link.href);
                }}
              >
                {link.name}
              </Link>
            </li>
          ))}
          <div
            ref={selectorRef}
            className={classNames(
              "h-1 absolute bottom-4 transition-all duration-200 flex items-center justify-center",
              {
                "opacity-0": !hash,
              }
            )}
          >
            <div className="size-1 bg-white rounded-full" />
          </div>
        </ul>
      </nav>
    </div>
  );
}
