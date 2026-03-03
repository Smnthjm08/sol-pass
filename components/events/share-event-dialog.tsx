"use client";

import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function ShareEventDialog({ eventName }: { eventName: string }) {
    const [copied, setCopied] = useState(false);
    const url = typeof window !== "undefined" ? window.location.href : "";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success("URL copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error("Failed to copy URL");
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full flex items-center gap-2"
                    size="sm"
                >
                    <Share2 className="w-3.5 h-3.5" />
                    Share Event
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share Event</DialogTitle>
                    <DialogDescription>
                        Anyone with this link will be able to view and register for "{eventName}".
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 pt-4">
                    <div className="grid flex-1 gap-2">
                        <Input
                            id="link"
                            defaultValue={url}
                            readOnly
                            className="h-9"
                        />
                    </div>
                    <Button
                        type="submit"
                        size="sm"
                        className="px-3"
                        onClick={handleCopy}
                    >
                        <span className="sr-only">Copy</span>
                        {copied ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
