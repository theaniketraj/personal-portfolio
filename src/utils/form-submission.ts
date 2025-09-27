/**
 * Form submission utilities
 * Supports Netlify Forms and EmailJS as fallback
 */

interface FormData {
    [key: string]: string | boolean;
}

export interface FormSubmissionResult {
    success: boolean;
    error?: string;
}

/**
 * Submit form data using Netlify Forms
 */
export async function submitToNetlify(formName: string, formData: FormData): Promise<FormSubmissionResult> {
    try {
        const params = new URLSearchParams();
        params.append('form-name', formName);

        Object.entries(formData).forEach(([key, value]) => {
            params.append(key, String(value));
        });

        const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Netlify form submission error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * Submit form data using EmailJS (requires EmailJS SDK)
 * Enable this if you want to use EmailJS as primary or fallback method
 */
export async function submitToEmailJS(_formData: FormData): Promise<FormSubmissionResult> {
    // EmailJS implementation would go here when needed
    // For now, return not implemented
    return {
        success: false,
        error: 'EmailJS not configured'
    };
}

/**
 * Main form submission function with fallback support
 */
export async function submitForm(formName: string, formData: FormData): Promise<FormSubmissionResult> {
    // Try Netlify Forms
    return await submitToNetlify(formName, formData);
}
