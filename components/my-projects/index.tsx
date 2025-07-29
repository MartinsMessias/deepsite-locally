"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useUser } from "@/hooks/useUser";
import { Project } from "@/types";
import { redirect } from "next/navigation";
import { ProjectCard } from "./project-card";
import { LoadProject } from "./load-project";

export function MyProjects({
  projects: initialProjects,
}: {
  projects: Project[];
}) {
  const { user } = useUser();
  if (!user) {
    redirect("/");
  }
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  return (
    <>
      <section className="max-w-[86rem] py-12 px-4 mx-auto">
        <header className="flex items-center justify-between max-lg:flex-col gap-4">
          <div className="text-left">
            <h1 className="text-3xl font-bold text-white">
              <span className="capitalize">{user.fullname}</span>&apos;s
              Retro Builder Projects
            </h1>
            <p className="text-muted-foreground text-base mt-1 max-w-xl">
              Create, manage, and explore your Retro Builder projects.
            </p>
          </div>
          <LoadProject
            fullXsBtn
            onSuccess={(project: Project) => {
              setProjects((prev) => [...prev, project]);
            }}
          />
        </header>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link
            href="/projects/new"
            className="bg-neutral-900 rounded-xl h-44 flex items-center justify-center text-neutral-300 border border-neutral-800 hover:brightness-110 transition-all duration-200"
          >
            <Plus className="size-5 mr-1.5" />
            Create Project
          </Link>
          {projects.map((project: Project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </section>
    </>
  );
}
