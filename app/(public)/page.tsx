import { AskAi } from "@/components/space/ask-ai";
import { redirect } from "next/navigation";
export default function Home() {
  redirect("/projects/new");
  return (
    <>
      <header className="container mx-auto pt-20 px-6 relative flex flex-col items-center justify-center text-center">
        <div className="rounded-full border border-neutral-100/10 bg-neutral-100/5 text-xs text-neutral-300 px-3 py-1 max-w-max mx-auto mb-2">
          ✨ Retro Builder Public Beta
        </div>
        <h1 className="text-8xl font-semibold text-white font-mono max-w-4xl">
          Code your website with AI in seconds
        </h1>
        <p className="text-2xl text-neutral-300/80 mt-4 text-center max-w-2xl">
          Vibe Coding has never been so easy.
        </p>
        <div className="mt-14 max-w-2xl w-full mx-auto">
          <AskAi />
        </div>
        <div className="absolute inset-0 pointer-events-none -z-[1]">
          <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-10 blur-3xl rounded-full" />
          <div className="w-2/3 h-3/4 bg-gradient-to-r from-blue-500 to-teal-500 opacity-24 blur-3xl absolute -top-20 right-10 transform rotate-12" />
          <div className="w-1/2 h-1/2 bg-gradient-to-r from-amber-500 to-rose-500 opacity-20 blur-3xl absolute bottom-0 left-10 rounded-3xl" />
          <div className="w-48 h-48 bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-20 blur-3xl absolute top-1/3 right-1/3 rounded-lg transform -rotate-15" />
        </div>
      </header>
      <div id="community" className="h-screen flex items-center justify-center">
        <h1 className="text-7xl font-extrabold text-white font-mono">
          Community Driven
        </h1>
      </div>
      <div id="deploy" className="h-screen flex items-center justify-center">
        <h1 className="text-7xl font-extrabold text-white font-mono">
          Deploy your website in seconds
        </h1>
      </div>
      <div id="features" className="h-screen flex items-center justify-center">
        <h1 className="text-7xl font-extrabold text-white font-mono">
          Features that make you smile
        </h1>
      </div>
    </>
  );
}
