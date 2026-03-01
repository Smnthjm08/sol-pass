"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "../utils/date-time-picker";

export function CreateEventForm() {
    const [category, setCategory] = useState("");
    const [isOnline, setIsOnline] = useState(false);
    const [isFree, setIsFree] = useState(true);
    const [date, setDate] = useState<Date | undefined>();

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const data = {
            publicKey: window.solana?.publicKey?.toString(), // wallet

            name: formData.get("name"),
            description: formData.get("description"),

            category,

            location: isOnline ? null : formData.get("location"),

            capacity: formData.get("capacity")
                ? Number(formData.get("capacity"))
                : null,

            date: date ? date.toISOString() : null,

            isOnline,
            isOffline: !isOnline,

            isFree,

            price: isFree
                ? null
                : formData.get("price")
                    ? Number(formData.get("price"))
                    : null,

            comments: formData.get("comments"),
        };

        await fetch("/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    }

    return (
        <div className="w-full max-w-xl">
            <form onSubmit={onSubmit}>
                <FieldGroup>

                    {/* EVENT INFO */}

                    <FieldSet>
                        <FieldLegend>Create Event</FieldLegend>
                        <FieldDescription>
                            Fill in the details to publish your event
                        </FieldDescription>

                        <FieldGroup>
                            <Field>
                                <FieldLabel>Name</FieldLabel>
                                <Input name="name" placeholder="Solana Hacker House" required />
                            </Field>

                            <Field>
                                <FieldLabel>Description</FieldLabel>
                                <Textarea
                                    name="description"
                                    placeholder="Describe your event"
                                    required
                                />
                            </Field>

                            <Field>
                                <FieldLabel>Category</FieldLabel>

                                <Select onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Music">Music</SelectItem>
                                            <SelectItem value="Sports">Sports</SelectItem>
                                            <SelectItem value="Conference">Conference</SelectItem>
                                            <SelectItem value="Festival">Festival</SelectItem>
                                            <SelectItem value="Art">Art</SelectItem>
                                            <SelectItem value="Food">Food</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <FieldSeparator />

                    {/* DATE + LOCATION */}

                    <FieldSet>
                        <FieldLegend>Date and Location</FieldLegend>

                        <FieldGroup>
                            <Field>
                                <FieldLabel>Date</FieldLabel>
                                <DatePicker date={date} setDate={setDate} />
                            </Field>

                            <Field orientation="horizontal">
                                <Checkbox
                                    checked={isOnline}
                                    onCheckedChange={(v) => setIsOnline(!!v)}
                                />
                                <FieldLabel className="font-normal">Online Event</FieldLabel>
                            </Field>

                            <Field>
                                <FieldLabel>Location</FieldLabel>
                                <Input
                                    name="location"
                                    placeholder="Leave empty if online"
                                    disabled={isOnline}
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    <FieldSeparator />

                    {/* PRICING */}

                    <FieldSet>
                        <FieldLegend>Pricing</FieldLegend>

                        <FieldGroup>
                            <Field orientation="horizontal">
                                <Checkbox
                                    checked={isFree}
                                    onCheckedChange={(v) => setIsFree(!!v)}
                                />
                                <FieldLabel className="font-normal">Free Event</FieldLabel>
                            </Field>

                            <div className="flex gap-4">
                                <Field>
                                    <FieldLabel>Price (in SOL)</FieldLabel>
                                    <Input
                                        name="price"
                                        placeholder="0.00"
                                        disabled={isFree}
                                        type="number"
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel>Capacity</FieldLabel>
                                    <Input name="capacity" placeholder="100" type="number" />
                                </Field>
                            </div>
                        </FieldGroup>
                    </FieldSet>

                    <FieldSeparator />

                    {/* COMMENTS */}

                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel>Comments</FieldLabel>
                                <Textarea
                                    name="comments"
                                    placeholder="Additional notes"
                                    className="resize-none"
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>

                    {/* ACTIONS */}

                    <Field orientation="horizontal">
                        <Button type="submit">Create Event</Button>
                        <Button variant="outline" type="button">
                            Cancel
                        </Button>
                    </Field>

                </FieldGroup>
            </form>
        </div>
    );
}