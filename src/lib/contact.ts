export const BLOCKED_DOMAINS = new Set([
    'example.com',
    'test.com',
    'fake.com',
    'hell.com',
    'mailinator.com',
    'temp-mail.org',
    '10minutemail.com',
    'guerrillamail.com',
    'yopmail.com',
    'getnada.com',
    'sharklasers.com',
    'grr.la',
    'guerrillamailblock.com',
    'maildrop.cc',
    'tempmail.com',
    'temp-mail.io',
    'burnermail.io',
    'mailnesia.com',
    'emailondeck.com',
    'throwawaymail.com',
    'moakt.com',
    'mintemail.com',
    'mailcatch.com',
    'mytrashmail.com',
    'trashmail.com',
    'trashmail.me',
    'dispostable.com',
    'mail7.io',
    'mail.tm',
    'emailn.de',
    'emailfake.com',
    'crazymailing.com',
    'mohmail.com',
    'inboxes.com',
    'disposablemail.com',
    'tempr.email',
    'dropmail.me',
    'mailpoof.com',
    'wtf.com'
]);

export interface ContactFormData {
    firstName: string;
    lastName?: string;
    email: string;
    address?: string;
    message: string;
    updatesConsent?: boolean;
    botField?: string;
}

export type ContactSubmitStatus = 'idle' | 'success' | 'error' | 'invalid_email' | 'validation_error';
export type ContactErrorField = 'firstName' | 'email' | 'message' | null;

export type ContactValidationResult =
    | { valid: true; data: ContactFormData; isBot: boolean }
    | {
          valid: false;
          error: string;
          field: 'firstName' | 'email' | 'message';
          status: 'validation_error' | 'invalid_email';
      };

export type ContactSubmissionResult = { success: true } | { success: false; error: string; status: 'error' };

/**
 * Validates raw contact form entries, ensuring required fields, lengths,
 * valid email syntax, and disposable domain protection.
 */
export function validateContactForm(rawEntries: Record<string, string>): ContactValidationResult {
    const botField = rawEntries['bot-field']?.trim() || '';
    if (botField) {
        return {
            valid: true,
            isBot: true,
            data: {
                firstName: '',
                email: '',
                message: '',
                botField
            }
        };
    }

    const firstName = rawEntries.firstName?.trim() || '';
    const lastName = rawEntries.lastName?.trim() || '';
    const email = rawEntries.email?.trim().toLowerCase() || '';
    const address = rawEntries.address?.trim() || '';
    const message = rawEntries.message?.trim() || '';
    const updatesConsent = !!rawEntries.updatesConsent;

    if (!firstName) {
        return {
            valid: false,
            error: 'Please enter your first name. Spaces alone are not accepted.',
            field: 'firstName',
            status: 'validation_error'
        };
    }

    if (firstName.length > 100) {
        return {
            valid: false,
            error: 'First name must be 100 characters or fewer.',
            field: 'firstName',
            status: 'validation_error'
        };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return {
            valid: false,
            error: 'Please enter a valid email address.',
            field: 'email',
            status: 'invalid_email'
        };
    }

    const domain = email.slice(email.lastIndexOf('@') + 1).replace(/\.$/, '');
    if (domain && BLOCKED_DOMAINS.has(domain)) {
        return {
            valid: false,
            error: 'Please enter a genuine, non-disposable email address.',
            field: 'email',
            status: 'invalid_email'
        };
    }

    if (!message) {
        return {
            valid: false,
            error: 'Please enter your message. Spaces alone are not accepted.',
            field: 'message',
            status: 'validation_error'
        };
    }

    if (message.length > 5000) {
        return {
            valid: false,
            error: 'Message must be 5000 characters or fewer.',
            field: 'message',
            status: 'validation_error'
        };
    }

    return {
        valid: true,
        isBot: false,
        data: {
            firstName,
            lastName,
            email,
            address,
            message,
            updatesConsent
        }
    };
}

/**
 * Submits the validated contact form payload to the Netlify endpoint.
 */
export async function submitContactForm(data: ContactFormData): Promise<ContactSubmissionResult> {
    try {
        const params = new URLSearchParams();
        params.append('form-name', 'sign-up-form');
        params.append('firstName', data.firstName);
        if (data.lastName) params.append('lastName', data.lastName);
        params.append('email', data.email);
        if (data.address) params.append('address', data.address);
        params.append('message', data.message);
        if (data.updatesConsent) {
            params.append('updatesConsent', 'on');
        }

        const response = await fetch('/netlify-form.html', {
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
            error: 'Oops! There was an error sending your message. Please try again.',
            status: 'error'
        };
    }
}
