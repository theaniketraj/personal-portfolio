'use client';

import React, { useEffect } from 'react';
import { useContactDraft } from '@/components/contact-draft-context';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import type { ContactSubmitStatus, ContactErrorField } from '@/lib/contact';

interface ContactFormProps {
    isSubmitting: boolean;
    submitStatus: ContactSubmitStatus;
    validationError: string;
    errorField: ContactErrorField;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onFieldChange: () => void;
}

export function ContactForm({
    isSubmitting,
    submitStatus,
    validationError,
    errorField,
    onSubmit,
    onFieldChange
}: Readonly<ContactFormProps>) {
    const { draftData } = useContactDraft();

    useEffect(() => {
        if (draftData) {
            const form = document.forms.namedItem('sign-up-form');
            if (form) {
                if (draftData.firstName)
                    (form.elements.namedItem('firstName') as HTMLInputElement).value = draftData.firstName.trim();
                if (draftData.lastName)
                    (form.elements.namedItem('lastName') as HTMLInputElement).value = draftData.lastName.trim();
                if (draftData.email)
                    (form.elements.namedItem('email') as HTMLInputElement).value = draftData.email.trim();
                if (draftData.message)
                    (form.elements.namedItem('message') as HTMLTextAreaElement).value = draftData.message.trim();
            }
        }
    }, [draftData]);

    return (
        <form
            name="sign-up-form"
            method="POST"
            action="/netlify-form.html"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={onSubmit}
            onChange={onFieldChange}
            className="space-y-6"
        >
            {/* Netlify Hidden Inputs */}
            <input type="hidden" name="form-name" value="sign-up-form" />
            <div hidden aria-hidden="true">
                <input name="bot-field" tabIndex={-1} aria-hidden="true" autoComplete="off" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-muted-foreground">
                        First Name
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        placeholder="Tony"
                        aria-invalid={errorField === 'firstName' ? 'true' : undefined}
                        aria-describedby={errorField === 'firstName' ? 'contact-form-error' : undefined}
                        className="w-full flex h-12 rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:bg-background/80"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-muted-foreground">
                        Last Name
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Stark"
                        className="w-full flex h-12 rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:bg-background/80"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="tonystark@jarvis.com"
                        aria-invalid={errorField === 'email' ? 'true' : undefined}
                        aria-describedby={errorField === 'email' ? 'contact-form-error' : undefined}
                        className="w-full flex h-12 rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:bg-background/80"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium text-muted-foreground">
                        Location (Optional)
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        placeholder="City, Country"
                        className="w-full flex h-12 rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:bg-background/80"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-muted-foreground">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    placeholder="Tell me about your project..."
                    rows={5}
                    aria-invalid={errorField === 'message' ? 'true' : undefined}
                    aria-describedby={errorField === 'message' ? 'contact-form-error' : undefined}
                    className="w-full flex rounded-xl border border-input bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:bg-background/80 resize-none"
                />
            </div>

            <div className="flex items-center gap-3 py-2">
                <div className="relative flex h-5 w-5 items-center justify-center shrink-0">
                    <input
                        id="updatesConsent"
                        name="updatesConsent"
                        type="checkbox"
                        className="peer appearance-none h-5 w-5 rounded border border-input bg-background/50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
                    />
                    <Check
                        className="absolute inset-0 m-auto h-4 w-4 text-primary opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                        strokeWidth={3}
                        aria-hidden="true"
                    />
                </div>
                <label
                    htmlFor="updatesConsent"
                    className="text-sm font-medium text-muted-foreground cursor-pointer select-none"
                >
                    Sign me up to receive updates
                </label>
            </div>

            {submitStatus === 'error' && (
                <div
                    id="contact-form-error"
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                    className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm"
                >
                    Oops! There was an error sending your message. Please try again.
                </div>
            )}

            {submitStatus === 'invalid_email' && (
                <div
                    id="contact-form-error"
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                    className="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-500 rounded-xl text-sm"
                >
                    {validationError || 'Please enter a valid, genuine email address.'}
                </div>
            )}

            {submitStatus === 'validation_error' && (
                <div
                    id="contact-form-error"
                    role="alert"
                    aria-live="assertive"
                    aria-atomic="true"
                    className="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-500 rounded-xl text-sm"
                >
                    {validationError || 'Please fill in all required fields. Spaces alone are not accepted.'}
                </div>
            )}

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 h-12 text-sm font-semibold rounded-full mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
        </form>
    );
}
