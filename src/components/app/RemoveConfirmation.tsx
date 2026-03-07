import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X } from "lucide-react";

interface RemoveConfirmationProps {
  onConfirm: () => void;
  children?: React.ReactNode;
}

const RemoveConfirmation = ({ onConfirm, children }: RemoveConfirmationProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children || (
          <button className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors">
            <X className="w-3 h-3" /> Remove
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4" align="end">
        <p className="text-sm font-medium text-foreground mb-1">Remove this document?</p>
        <p className="text-xs text-muted-foreground mb-3">
          Your generated content will be deleted.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => setOpen(false)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground border border-border hover:bg-muted/30 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); setOpen(false); }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-destructive-foreground bg-destructive hover:opacity-90 transition-all"
          >
            Remove
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default RemoveConfirmation;
