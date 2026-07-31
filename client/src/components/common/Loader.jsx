import { Loader2 } from "lucide-react";

export default function Loader({
  text = "Loading...",
  className = "",
}) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>{text}</span>
    </div>
  );
}