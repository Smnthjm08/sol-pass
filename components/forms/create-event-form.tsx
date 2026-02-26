"use client";

import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    TimelineSteps,
    TimelineStepsItem,
    TimelineStepsHeader,
    TimelineStepsIcon,
    TimelineStepsTitle,
    TimelineStepsDescription,
    TimelineStepsConnector
} from "@/components/ui/timeline-steps";
import { Check, Info, Rocket, ChevronRight, ChevronLeft, Loader2, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { DatePickerTime } from "@/components/utils/date-time-picker";

export default function CreateEventForm() {
    const router = useRouter();
    const { publicKey, connected } = useWallet();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [currentStep, setCurrentStep] = useState(0);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
    const [eventTime, setEventTime] = useState("10:30");
    const [location, setLocation] = useState("");
    const [capacity, setCapacity] = useState("");
    const [price, setPrice] = useState("");
    const [isFree, setIsFree] = useState(true);
    const [isOnline, setIsOnline] = useState(false);
    const [isOffline, setIsOffline] = useState(false);

    const steps = [
        { title: "Info & Location", description: "The basics", icon: Info },
        { title: "Settings & Pricing", description: "Logistics and tickets", icon: Rocket },
    ];

    const handleSubmit = async () => {
        setError(null);

        if (!connected || !publicKey) {
            setError("Please connect your wallet first.");
            return;
        }

        try {
            setLoading(true);

            let finalDate = "";
            if (eventDate) {
                const [hours, minutes] = eventTime.split(":").map(Number);
                const d = new Date(eventDate);
                d.setHours(hours || 0, minutes || 0, 0, 0);
                finalDate = d.toISOString();
            }

            const { data } = await axios.post("/api/events", {
                publicKey: publicKey.toBase58(),
                name: name.trim(),
                description: description.trim(),
                date: finalDate,
                location: location.trim() || undefined,
                capacity: capacity || undefined,
                price: !isFree ? price || undefined : undefined,
                isFree,
                isOnline,
                isOffline,
            });

            router.push(`/event/${data.id}`);
        } catch (err) {
            const axiosErr = err as AxiosError<{ error: string }>;
            setError(axiosErr.response?.data?.error ?? "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (currentStep === 0) {
            if (!name.trim() || !description.trim() || !eventDate) {
                setError("Please fill in name, description, and date.");
                return;
            }
        }
        setError(null);
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    };

    const prevStep = () => {
        setError(null);
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-1">
                <h2 className="text-2xl font-extrabold tracking-tight">List Your Event</h2>
                <p className="text-sm text-muted-foreground">Follow two simple steps to launch your experience.</p>
            </div>

            <TimelineSteps orientation="horizontal" className="px-4">
                {steps.map((step, idx) => {
                    const Icon = step.icon;
                    const isCompleted = currentStep > idx;
                    const isCurrent = currentStep === idx;

                    return (
                        <TimelineStepsItem
                            key={idx}
                            status={isCompleted ? "completed" : isCurrent ? "current" : "upcoming"}
                            className="flex-1"
                        >
                            {idx < steps.length - 1 && (
                                <TimelineStepsConnector
                                    orientation="horizontal"
                                    status={isCompleted ? "completed" : isCurrent ? "current" : "upcoming"}
                                />
                            )}
                            <TimelineStepsHeader className="flex-col text-center gap-2">
                                <TimelineStepsIcon
                                    size="sm"
                                    variant={isCompleted ? "primary" : isCurrent ? "outline" : "default"}
                                    className={cn(isCurrent && "border-primary text-primary shadow-[0_0_10px_rgba(var(--primary),0.2)]")}
                                >
                                    {isCompleted ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                                </TimelineStepsIcon>
                                <div className="space-y-0">
                                    <TimelineStepsTitle className={cn("text-xs transition-all", isCurrent && "text-primary font-bold")}>
                                        {step.title}
                                    </TimelineStepsTitle>
                                    <TimelineStepsDescription className="text-[9px] hidden sm:block opacity-70">
                                        {step.description}
                                    </TimelineStepsDescription>
                                </div>
                            </TimelineStepsHeader>
                        </TimelineStepsItem>
                    );
                })}
            </TimelineSteps>

            <FieldSet className="bg-secondary/20 p-4 rounded-3xl border border-secondary shadow-sm relative overflow-hidden group">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700" />

                {currentStep === 0 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Event Name *</FieldLabel>
                                <Input
                                    id="name"
                                    placeholder="e.g. Solana Breakpoint 2024"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-background/50 border-secondary focus:border-primary transition-all rounded-xl h-8"
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="description">Description *</FieldLabel>
                                <Textarea
                                    id="description"
                                    placeholder="What's this event about? (Markdown supported)"
                                    rows={5}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="bg-background/50 border-secondary focus:border-primary transition-all resize-none rounded-xl"
                                />
                            </Field>
                            <div className="grid grid-cols-1 gap-4">
                                <DatePickerTime
                                    date={eventDate}
                                    setDate={setEventDate}
                                    time={eventTime}
                                    setTime={setEventTime}
                                />
                                <Field>
                                    <FieldLabel htmlFor="location" className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1">Location</FieldLabel>
                                    <div className="relative">
                                        <Input
                                            id="location"
                                            placeholder="Physical Address or Link"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="bg-background/50 border-secondary focus:border-primary transition-all rounded-xl h-8 pl-10"
                                        />
                                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    </div>
                                </Field>
                            </div>
                        </FieldGroup>
                    </div>
                )}

                {currentStep === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                        <FieldGroup className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl border border-secondary bg-background/40 flex items-center justify-between transition-colors hover:bg-background/60">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-bold">Online</Label>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Virtual</p>
                                    </div>
                                    <Switch id="isOnline" checked={isOnline} onCheckedChange={setIsOnline} />
                                </div>
                                <div className="p-4 rounded-2xl border border-secondary bg-background/40 flex items-center justify-between transition-colors hover:bg-background/60">
                                    <div className="space-y-0.5">
                                        <Label className="text-sm font-bold">In-Person</Label>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Physical</p>
                                    </div>
                                    <Switch id="isOffline" checked={isOffline} onCheckedChange={setIsOffline} />
                                </div>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="capacity">Total Capacity</FieldLabel>
                                <Input
                                    id="capacity"
                                    type="number"
                                    min={1}
                                    placeholder="Leave blank for unlimited"
                                    value={capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                    className="bg-background/50 border-secondary focus:border-primary transition-all rounded-xl h-11"
                                />
                            </Field>

                            <div className="p-6 rounded-2xl border border-secondary bg-background/60 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-lg font-bold">Free Event</Label>
                                        <p className="text-xs text-muted-foreground font-medium italic">No ticket price for attendees</p>
                                    </div>
                                    <Switch
                                        id="isFree"
                                        checked={isFree}
                                        onCheckedChange={(v) => {
                                            setIsFree(v);
                                            if (v) setPrice("");
                                        }}
                                        className="scale-110"
                                    />
                                </div>

                                {!isFree && (
                                    <Field className="animate-in slide-in-from-top-2 duration-300">
                                        <FieldLabel htmlFor="price">Ticket Price</FieldLabel>
                                        <div className="relative">
                                            <Input
                                                id="price"
                                                type="number"
                                                min={0}
                                                step={0.001}
                                                placeholder="0.05"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                className="bg-background/80 border-secondary focus:border-primary transition-all pl-12 h-14 text-xl font-bold rounded-xl"
                                            />
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-xs">SOL</span>
                                        </div>
                                    </Field>
                                )}
                            </div>
                        </FieldGroup>
                    </div>
                )}

                {error && (
                    <div className="mt-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold animate-in bounce-in duration-300">
                        ⚠️ {error}
                    </div>
                )}

                <div className="flex items-center justify-between mt-10 pt-6 border-t border-secondary">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={prevStep}
                        disabled={currentStep === 0 || loading}
                        className="gap-2 rounded-full px-6 transition-all hover:bg-secondary"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </Button>

                    {currentStep < steps.length - 1 ? (
                        <Button
                            type="button"
                            onClick={nextStep}
                            className="gap-2 rounded-full px-10 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all transform active:scale-95"
                        >
                            Continue
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || !connected}
                            className="gap-2 rounded-full px-12 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 transition-all transform active:scale-95"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Launching...
                                </>
                            ) : (
                                <>
                                    <Rocket className="w-4 h-4" />
                                    Launch Event
                                </>
                            )}
                        </Button>
                    )}
                </div>

                {!connected && currentStep === 1 && (
                    <p className="text-center text-[10px] text-amber-500 mt-4 font-black uppercase tracking-[0.2em]">
                        Connect wallet to publish
                    </p>
                )}
            </FieldSet>
        </div>
    );
}
