import Link from "next/link";
import { formatDistance } from "date-fns";
import { EllipsisVertical } from "lucide-react";

import { Project } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="text-neutral-200 space-y-4 group cursor-pointer">
      <Link
        href={`/projects/${project.space_id}`}
        className="relative bg-neutral-900 rounded-2xl overflow-hidden h-44 w-full flex items-center justify-end flex-col px-3 border border-neutral-800"
      >
        <iframe
          src={`https://${project.space_id.replace("/", "-")}.static.retrobuilder.app/`} // TODO: Update to actual Retro Builder CDN if different
          frameBorder="0"
          className="absolute inset-0 w-full h-full top-0 left-0 group-hover:brightness-75 transition-all duration-200 pointer-events-none"
        ></iframe>

        <Button
          variant="default"
          className="w-full transition-all duration-200 translate-y-full group-hover:-translate-y-3"
        >
          Open project
        </Button>
      </Link>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-neutral-200 text-base font-semibold line-clamp-1">
            {project.space_id}
          </p>
          <p className="text-sm text-neutral-500">
            Updated{" "}
            {formatDistance(
              new Date(project._updatedAt || Date.now()),
              new Date(),
              {
                addSuffix: true,
              }
            )}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVertical className="text-neutral-400 size-5 hover:text-neutral-300 transition-colors duration-200 cursor-pointer" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuGroup>
              
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
