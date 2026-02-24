import { Zap } from "lucide-react";
import Link from "next/link";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold dark:text-neutral-200 text-neutral-900 tracking-tight">
                pass<span className="text-violet-600">vault</span>
            </span>
        </Link>
    );
}