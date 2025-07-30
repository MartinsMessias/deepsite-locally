import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, onFileSelect, ...props }: React.ComponentProps<"input"> & { onFileSelect?: (data: { file: File; content: string }) => void }) {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        onFileSelect?.({ file, content: fileContent });
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="relative">
      <input
        type={type === "file" ? "file" : type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
        onChange={type === "file" ? handleFileChange : props.onChange}
      />
      {type === "file" && (
        <label className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <span className="text-gray-500">Attach</span>
        </label>
      )}
    </div>
  );
}

export { Input }
