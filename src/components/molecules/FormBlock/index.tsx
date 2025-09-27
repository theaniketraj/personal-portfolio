import classNames from 'classnames';
import * as React from 'react';

import { Annotated } from '@/components/Annotated';
import { DynamicComponent } from '@/components/components-registry';
import { submitForm } from '@/utils/form-submission';
import { mapStylesToClassNames as mapStyles } from '@/utils/map-styles-to-class-names';

export default function FormBlock(props) {
    const formRef = React.createRef<HTMLFormElement>();
    const { elementId, className, fields = [], submitLabel, styles = {} } = props;

    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitStatus, setSubmitStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

    if (fields.length === 0) {
        return null;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        const formData = new FormData(formRef.current);
        const formDataObject = Object.fromEntries(formData.entries()) as Record<string, string>;

        try {
            const result = await submitForm(elementId, formDataObject);

            if (result.success) {
                // Redirect to thank you page
                window.location.href = '/thank-you';
            } else {
                throw new Error(result.error || 'Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            setSubmitStatus('error');
            setIsSubmitting(false);
        }
    }

    return (
        <Annotated content={props}>
            <form
                className={className}
                name={elementId}
                id={elementId}
                method="POST"
                action="/thank-you"
                onSubmit={handleSubmit}
                ref={formRef}
                data-netlify="true"
                data-netlify-honeypot="bot-field"
            >
                <div className="grid gap-6 sm:grid-cols-2">
                    {/* Netlify form detection */}
                    <input type="hidden" name="form-name" value={elementId} />
                    {/* Honeypot field for spam protection */}
                    <input type="hidden" name="bot-field" />

                    {fields.map((field, index) => {
                        return <DynamicComponent key={field.name || `field-${index}`} {...field} />;
                    })}
                </div>

                {/* Error message */}
                {submitStatus === 'error' && (
                    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        Oops! There was an error sending your message. Please try again or contact me directly at theaniketraj@hotmail.com
                    </div>
                )}

                <div className={classNames('mt-8', mapStyles({ textAlign: styles.self?.textAlign ?? 'left' }))}>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={classNames(
                            "inline-flex items-center justify-center px-5 py-4 text-lg transition border-2 border-current",
                            {
                                "hover:bottom-shadow-6 hover:-translate-y-1.5": !isSubmitting,
                                "opacity-50 cursor-not-allowed": isSubmitting
                            }
                        )}
                    >
                        {isSubmitting ? 'Sending...' : submitLabel}
                    </button>
                </div>
            </form>
        </Annotated>
    );
}
