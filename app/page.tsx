import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
      <Link
        href="/shadcn-radix-colors"
        className="flex items-center gap-2 hover:text-accent transition-colors"
      >
        shadcn-radix-colors <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
