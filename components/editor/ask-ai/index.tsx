"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useMemo } from "react";
import classNames from "classnames";
import { toast } from "sonner";
import { useLocalStorage, useUpdateEffect } from "react-use";
import { ArrowUp, ChevronDown, Crosshair } from "lucide-react";
import { FaStopCircle } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { MODELS } from "@/lib/providers";
import { HtmlHistory } from "@/types";
import { InviteFriends } from "@/components/invite-friends";
import { Settings } from "@/components/editor/ask-ai/settings";
import { ReImagine } from "@/components/editor/ask-ai/re-imagine";
import Loading from "@/components/loading";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipContent } from "@radix-ui/react-tooltip";
import { SelectedHtmlElement } from "./selected-html-element";
import { FollowUpTooltip } from "./follow-up-tooltip";
import { isTheSameHtml } from "@/lib/compare-html-diff";

export function AskAI({
  html,
  setHtml,
  onScrollToBottom,
  isAiWorking,
  setisAiWorking,
  isEditableModeEnabled = false,
  selectedElement,
  setSelectedElement,
  setIsEditableModeEnabled,
  onNewPrompt,
  onSuccess,
}: {
  html: string;
  setHtml: (html: string) => void;
  onScrollToBottom: () => void;
  isAiWorking: boolean;
  onNewPrompt: (prompt: string) => void;
  htmlHistory?: HtmlHistory[];
  setisAiWorking: React.Dispatch<React.SetStateAction<boolean>>;
  onSuccess: (h: string, p: string, n?: number[][]) => void;
  isEditableModeEnabled: boolean;
  setIsEditableModeEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  selectedElement?: HTMLElement | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}) {
  const refThink = useRef<HTMLDivElement | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);

  const [prompt, setPrompt] = useState("");
  const [hasAsked, setHasAsked] = useState(false);
  const [previousPrompt, setPreviousPrompt] = useState("");
  const [provider, setProvider] = useLocalStorage("provider", "auto");
    const [model, setModel] = useLocalStorage(
      "model",
      typeof window !== "undefined"
        ? localStorage.getItem("openai_model") || MODELS[0].value
        : MODELS[0].value
    );
  const [openProvider, setOpenProvider] = useState(false);
  const [providerError, setProviderError] = useState("");
  const [think, setThink] = useState<string | undefined>(undefined);
  const [openThink, setOpenThink] = useState(false);
  const [isThinking, setIsThinking] = useState(true);
  const [controller, setController] = useState<AbortController | null>(null);
  const [isFollowUp, setIsFollowUp] = useState(true);

  const callAi = async (redesignMarkdown?: string) => {
    if (isAiWorking) return;
    if (!redesignMarkdown && !prompt.trim()) return;
    setisAiWorking(true);
    setProviderError("");
    setThink("");
    setOpenThink(false);
    setIsThinking(true);

    let contentResponse = "";
    let thinkResponse = "";
    let lastRenderTime = 0;

    const abortController = new AbortController();
    setController(abortController);
    try {
      onNewPrompt(prompt);
      if (isFollowUp && !redesignMarkdown && !isSameHtml) {
        const selectedElementHtml = selectedElement
          ? selectedElement.outerHTML
          : "";
        const apiKey = localStorage.getItem("openai_api_key");
        const baseUrl = localStorage.getItem("openai_base_url");
        const customModel = localStorage.getItem("openai_model");
        const request = await fetch("/api/ask-ai", {
          method: "PUT",
          body: JSON.stringify({
            prompt,
            provider,
            previousPrompt,
            model,
            html,
            selectedElementHtml,
            apiKey,
            baseUrl,
            customModel,
          }),
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": window.location.hostname,
          },
          signal: abortController.signal,
        });
        if (request && request.body) {
          const res = await request.json();
          if (!request.ok) {
            setisAiWorking(false);
            return;
          }
          setHtml(res.html);
          toast.success("AI responded successfully");
          setPreviousPrompt(prompt);
          setPrompt("");
          setisAiWorking(false);
          onSuccess(res.html, prompt, res.updatedLines);
          if (audio.current) audio.current.play();
        }
      } else {
        const apiKey = localStorage.getItem("openai_api_key");
        const baseUrl = localStorage.getItem("openai_base_url");
        const customModel = localStorage.getItem("openai_model");
        const request = await fetch("/api/ask-ai", {
          method: "POST",
          body: JSON.stringify({
            prompt,
            provider,
            model,
            html: isSameHtml ? "" : html,
            redesignMarkdown,
            apiKey,
            baseUrl,
            customModel,
          }),
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": window.location.hostname,
          },
          signal: abortController.signal,
        });
        if (request && request.body) {
          if (!request.ok) {
            let errorMsg = "AI request failed.";
            try {
              const errorJson = await request.json();
              errorMsg = errorJson?.error || errorJson?.message || errorMsg;
            } catch (e) {
              // fallback: try to read as text
              console.error("Error parsing AI response:", e);
              try {
                errorMsg = await request.text();
              } catch {}
            }
            toast.error(errorMsg);
            setisAiWorking(false);
            return;
          }
          const reader = request.body.getReader();
          const decoder = new TextDecoder("utf-8");
          const selectedModel = MODELS.find(
            (m: { value: string }) => m.value === model
          );
          let contentThink: string | undefined = undefined;
          const read = async () => {
            const { done, value } = await reader.read();
            if (done) {
              const isJson =
                contentResponse.trim().startsWith("{") &&
                contentResponse.trim().endsWith("}");
              const jsonResponse = isJson ? JSON.parse(contentResponse) : null;
              if (jsonResponse && !jsonResponse.ok) {
                toast.error(jsonResponse?.error || jsonResponse?.message || "AI request failed.");
                setisAiWorking(false);
                return;
              }

              toast.success("REtro is done!");
              setPreviousPrompt(prompt);
              setPrompt("");
              setisAiWorking(false);
              setHasAsked(true);
              setModel(MODELS[0].value);
              if (audio.current) audio.current.play();

              // Now we have the complete HTML including </html>, so set it to be sure
              const finalDoc = contentResponse.match(
                /<!DOCTYPE html>[\s\S]*<\/html>/
              )?.[0];
              if (finalDoc) {
                setHtml(finalDoc);
              }
              onSuccess(finalDoc ?? contentResponse, prompt);

              return;
            }

            const chunk = decoder.decode(value, { stream: true });
            thinkResponse += chunk;
            if (selectedModel?.isThinker) {
              const thinkMatch = thinkResponse.match(/<think>[\s\S]*/)?.[0];
              if (thinkMatch && !thinkResponse?.includes("</think>")) {
                if ((contentThink?.length ?? 0) < 3) {
                  setOpenThink(true);
                }
                setThink(thinkMatch.replace("<think>", "").trim());
                contentThink += chunk;
                return read();
              }
            }

            contentResponse += chunk;

            const newHtml = contentResponse.match(
              /<!DOCTYPE html>[\s\S]*/
            )?.[0];
            if (newHtml) {
              setIsThinking(false);
              let partialDoc = newHtml;
              if (
                partialDoc.includes("<head>") &&
                !partialDoc.includes("</head>")
              ) {
                partialDoc += "\n</head>";
              }
              if (
                partialDoc.includes("<body") &&
                !partialDoc.includes("</body>")
              ) {
                partialDoc += "\n</body>";
              }
              if (!partialDoc.includes("</html>")) {
                partialDoc += "\n</html>";
              }

              // Throttle the re-renders to avoid flashing/flicker
              const now = Date.now();
              if (now - lastRenderTime > 300) {
                setHtml(partialDoc);
                lastRenderTime = now;
              }

              if (partialDoc.length > 200) {
                onScrollToBottom();
              }
            }
            read();
          };

          read();
        }
      }
    } catch (error: any) {
      setisAiWorking(false);
      toast.error(error.message);
    }
  };

  const stopController = () => {
    if (controller) {
      controller.abort();
      setController(null);
      setisAiWorking(false);
      setThink("");
      setOpenThink(false);
      setIsThinking(false);
    }
  };

  useUpdateEffect(() => {
    if (refThink.current) {
      refThink.current.scrollTop = refThink.current.scrollHeight;
    }
  }, [think]);

  useUpdateEffect(() => {
    if (!isThinking) {
      setOpenThink(false);
    }
  }, [isThinking]);

  const isSameHtml = useMemo(() => {
    return isTheSameHtml(html);
  }, [html]);

  return (
    <div className="px-3">
    <div className="px-3">
      <div className="relative bg-neutral-800 border border-neutral-700 rounded-2xl ring-[4px] focus-within:ring-neutral-500/30 focus-within:border-neutral-600 ring-transparent z-10 w-full group">
        {think && (
          <div className="w-full border-b border-neutral-700 relative overflow-hidden">
            <header
              className="flex items-center justify-between px-5 py-2.5 group hover:bg-neutral-600/20 transition-colors duration-200 cursor-pointer"
              onClick={() => {
                setOpenThink(!openThink);
              }}
            >
              <p className="text-sm font-medium text-neutral-300 group-hover:text-neutral-200 transition-colors duration-200">
                  {isThinking ? "Retro Builder is thinking..." : "Retro Builder's plan"}
              </p>
              <ChevronDown
                className={classNames(
                  "size-4 text-neutral-400 group-hover:text-neutral-300 transition-all duration-200",
                  {
                    "rotate-180": openThink,
                  }
                )}
              />
            </header>
            <main
              ref={refThink}
              className={classNames(
                "overflow-y-auto transition-all duration-200 ease-in-out",
                {
                  "max-h-[0px]": !openThink,
                  "min-h-[250px] max-h-[250px] border-t border-neutral-700":
                    openThink,
                }
              )}
            >
              <p className="text-[13px] text-neutral-400 whitespace-pre-line px-5 pb-4 pt-3">
                {think}
              </p>
            </main>
          </div>
        )}
        {selectedElement && (
          <div className="px-4 pt-3">
            <SelectedHtmlElement
              element={selectedElement}
              isAiWorking={isAiWorking}
              onDelete={() => setSelectedElement(null)}
            />
          </div>
        )}
        <div className="w-full relative flex items-center justify-between">
          <input
            type="text"
            disabled={isAiWorking}
            className={classNames(
              "w-full bg-transparent text-sm outline-none text-white placeholder:text-neutral-400 p-4",
              {
                "!pt-2.5": selectedElement && !isAiWorking,
              }
            )}
            placeholder={
              selectedElement
                ? `Ask Retro Builder about ${selectedElement.tagName.toLowerCase()}...`
                : hasAsked
                ? "Ask Retro Builder for edits"
                : "Ask Retro Builder anything..."
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                callAi();
              }
            }}
          />
        </div>
          <div className="flex-1 flex items-center justify-start gap-1.5">
            <ReImagine onRedesign={(md) => callAi(md)} />
            {!isSameHtml && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="xs"
                    variant={isEditableModeEnabled ? "default" : "outline"}
                    onClick={() => {
                      setIsEditableModeEnabled?.(!isEditableModeEnabled);
                    }}
                    className={classNames("h-[28px]", {
                      "!text-neutral-400 hover:!text-neutral-200 !border-neutral-600 !hover:!border-neutral-500":
                        !isEditableModeEnabled,
                    })}
                  >
                    <Crosshair className="size-4" />
                    Edit
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  align="start"
                  className="bg-neutral-950 text-xs text-neutral-200 py-1 px-2 rounded-md -translate-y-0.5"
                >
                  Select an element on the page to ask Retro Builder edit it
                  directly.
                </TooltipContent>
              </Tooltip>
            )}
            <InviteFriends />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Settings
              provider={provider as string}
              model={model as string}
              onChange={setProvider}
              onModelChange={setModel}
              open={openProvider}
              error={providerError}
              isFollowUp={!isSameHtml && isFollowUp}
              onClose={setOpenProvider}
            />
            <Button
              size="iconXs"
              disabled={isAiWorking || !prompt.trim()}
              onClick={() => callAi()}
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
        </div>
        {!isSameHtml && (
          <div className="absolute top-0 right-0 -translate-y-[calc(100%+8px)] select-none text-xs text-neutral-400 flex items-center justify-center gap-2 bg-neutral-800 border border-neutral-700 rounded-md p-1 pr-2.5">
            <label
              htmlFor="diff-patch-checkbox"
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <Checkbox
                id="diff-patch-checkbox"
                checked={isFollowUp}
                onCheckedChange={(e) => {
                  setIsFollowUp(e === true);
                }}
              />
              Diff-Patch Update
            </label>
            <FollowUpTooltip />
          </div>
        )}
      </div>
      <audio ref={audio} id="audio" className="hidden">
  <source src="/success.wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
