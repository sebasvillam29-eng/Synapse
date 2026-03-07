interface KbdHintProps {
  keys: string;
  className?: string;
}

const KbdHint = ({ keys, className = "" }: KbdHintProps) => (
  <kbd className={`inline-flex items-center px-1.5 py-0.5 rounded border border-border bg-muted/50 text-[11px] font-mono text-muted-foreground ${className}`}>
    {keys}
  </kbd>
);

export default KbdHint;
