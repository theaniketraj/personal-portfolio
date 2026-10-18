'use client';

import React, { useState } from 'react';
import { HardwareAnimated } from '@/components/animations/hardware-animated';
import { ContactForm } from './contact/contact-form';
import { ContactSuccess } from './contact/contact-success';
import {
    validateContactForm,
    submitContactForm,
    type ContactSubmitStatus,
    type ContactErrorField
} from '@/lib/contact';

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<ContactSubmitStatus>('idle');
    const [validationError, setValidationError] = useState<string>('');
    const [errorField, setErrorField] = useState<ContactErrorField>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formElement = event.currentTarget;

        setIsSubmitting(true);
        setSubmitStatus('idle');
        setValidationError('');
        setErrorField(null);

        const formData = new FormData(formElement);
        const rawEntries = Object.fromEntries(formData.entries()) as Record<string, string>;

        const validation = validateContactForm(rawEntries);

        if (!validation.valid) {
            setValidationError(validation.error);
            setSubmitStatus(validation.status);
            setErrorField(validation.field);
            (formElement.elements.namedItem(validation.field) as HTMLElement | null)?.focus();
            setIsSubmitting(false);
            return;
        }

        if (validation.isBot) {
            setIsSubmitting(false);
            setSubmitStatus('success');
            setErrorField(null);
            formElement.reset();
            return;
        }

        const result = await submitContactForm(validation.data);

        if (result.success) {
            setSubmitStatus('success');
            setErrorField(null);
            formElement.reset();
        } else {
            setSubmitStatus('error');
            setValidationError(result.error);
            setErrorField(null);
        }

        setIsSubmitting(false);
    }

    return (
        <section id="contact">
            <div className="container">
                <div className="border-x border-primary/10">
                    <div className="flex flex-col max-w-3xl mx-auto px-4 sm:px-7 py-12 md:py-24">
                        <HardwareAnimated animation="slideInUp">
                            {submitStatus !== 'success' && (
                                <div className="space-y-4 mb-12 text-center xs:text-left">
                                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight cursor-default">
                                        Got an Interesting Project?
                                    </h2>
                                    <p className="text-muted-foreground text-base cursor-default sm:text-lg">
                                        Tell me more about it. I&apos;m always open to discussing new projects, creative
                                        ideas, or opportunities to be part of your visions.
                                    </p>
                                </div>
                            )}

                            {submitStatus === 'success' ? (
                                <ContactSuccess
                                    onReset={() => {
                                        setSubmitStatus('idle');
                                        setErrorField(null);
                                    }}
                                />
                            ) : (
                                <ContactForm
                                    isSubmitting={isSubmitting}
                                    submitStatus={submitStatus}
                                    validationError={validationError}
                                    errorField={errorField}
                                    onSubmit={handleSubmit}
                                    onFieldChange={() => {
                                        if (submitStatus !== 'idle') {
                                            setSubmitStatus('idle');
                                            setValidationError('');
                                            setErrorField(null);
                                        }
                                    }}
                                />
                            )}
                        </HardwareAnimated>
                    </div>
                </div>
            </div>
        </section>
    );
}
