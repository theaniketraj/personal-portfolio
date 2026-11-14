import { test, expect } from '@playwright/test';

test.describe('CLI Terminal Modal & Accessibility Tests', () => {
    test('Focus trapping excludes hidden backdrop, Escape closes and restores focus, Close button closes and restores focus', async ({
        page
    }) => {
        await page.goto('/');

        const triggerButton = page.locator('button[aria-label="Open Terminal CLI"]');
        await expect(triggerButton).toBeVisible();

        // 1. Open Terminal by clicking trigger button
        await triggerButton.click();

        const dialog = page.locator('dialog[aria-modal="true"]');
        await expect(dialog).toBeVisible();

        // Verify backdrop is NOT a button and has aria-hidden="true"
        const backdropButton = dialog.locator('button[aria-hidden="true"]');
        await expect(backdropButton).toHaveCount(0);

        const backdropDiv = dialog.locator('div[aria-hidden="true"]');
        await expect(backdropDiv).toHaveCount(1);

        // Terminal input should be focused automatically
        const terminalInput = dialog.locator('input[aria-label="Terminal command input"]');
        await expect(terminalInput).toBeFocused();

        // Terminal input container should NOT show a persistent overlay/ring on open
        const inputContainer = dialog.locator('[data-terminal-input-container]');
        await expect(inputContainer).not.toHaveClass(/ring-2/);

        // 2. Test focus trap: Tab from terminal input should wrap to Fullscreen button, NOT the backdrop
        const fullscreenButton = dialog.locator('button[aria-label="Enter Fullscreen"]');
        const closeButton = dialog.locator('button[aria-label="Close Terminal"]');

        await page.keyboard.press('Tab');
        await expect(fullscreenButton).toBeFocused();

        await page.keyboard.press('Tab');
        await expect(closeButton).toBeFocused();

        await page.keyboard.press('Tab');
        await expect(terminalInput).toBeFocused();
        // Keyboard navigation (Tab) displays the accessible focus ring
        await expect(inputContainer).toHaveClass(/ring-2/);

        // Shift+Tab from terminal input back to close button
        await page.keyboard.press('Shift+Tab');
        await expect(closeButton).toBeFocused();
        await expect(inputContainer).not.toHaveClass(/ring-2/);

        // Shift+Tab from fullscreen button back to terminal input
        await page.keyboard.press('Shift+Tab');
        await expect(fullscreenButton).toBeFocused();
        await page.keyboard.press('Shift+Tab');
        await expect(terminalInput).toBeFocused();
        await expect(inputContainer).toHaveClass(/ring-2/);

        // 3. Test closing with Escape key -> Dialog closes and focus restored to triggerButton
        await page.keyboard.press('Escape');
        await expect(dialog).toHaveCount(0);
        await expect(triggerButton).toBeFocused();

        // 4. Test closing with Close button -> Dialog closes and focus restored to triggerButton
        await triggerButton.click();
        await expect(dialog).toBeVisible();
        await expect(terminalInput).toBeFocused();

        await closeButton.click();
        await expect(dialog).toHaveCount(0);
        await expect(triggerButton).toBeFocused();
    });

    test('Preserves command history across terminal open and close sessions', async ({ page }) => {
        await page.goto('/');

        const triggerButton = page.locator('button[aria-label="Open Terminal CLI"]');
        await expect(triggerButton).toBeVisible();

        // 1. Open terminal
        await triggerButton.click();
        const dialog = page.locator('dialog[aria-modal="true"]');
        await expect(dialog).toBeVisible();

        const terminalInput = dialog.locator('input[aria-label="Terminal command input"]');
        await expect(terminalInput).toBeFocused();

        // 2. Run "help" command
        await terminalInput.fill('help');
        await page.keyboard.press('Enter');

        // Verify output for help appeared
        await expect(dialog.getByText('Explore my technical toolkit')).toBeVisible();

        // 3. Close terminal with Escape key
        await page.keyboard.press('Escape');
        await expect(dialog).toHaveCount(0);

        // 4. Reopen terminal
        await triggerButton.click();
        await expect(dialog).toBeVisible();

        // 5. Verify previous "help" command output is still preserved in history
        await expect(dialog.getByText('Explore my technical toolkit')).toBeVisible();
    });

    test('typing or selecting reset restores initialization session and welcome text', async ({ page }) => {
        await page.goto('/');

        const triggerButton = page.locator('button[aria-label="Open Terminal CLI"]');
        await triggerButton.click();
        const dialog = page.locator('dialog[aria-modal="true"]');
        await expect(dialog).toBeVisible();

        const terminalInput = dialog.locator('input[aria-label="Terminal command input"]');
        await expect(terminalInput).toBeFocused();

        // 1. Run help to generate command output
        await terminalInput.fill('help');
        await page.keyboard.press('Enter');
        await expect(dialog.getByText('Explore my technical toolkit')).toBeVisible();

        // 2. Type "reset" -> restores sys_init and welcome text
        await terminalInput.fill('reset');
        await page.keyboard.press('Enter');

        await expect(dialog.getByText('Session initialized')).toBeVisible();
        await expect(dialog.getByText('Explore my technical toolkit')).toHaveCount(0);
        await expect(dialog.getByText('02 LINES')).toBeVisible();

        // 3. Run help again, then click/select "reset" button from help list
        await terminalInput.fill('help');
        await page.keyboard.press('Enter');
        await expect(dialog.getByText('Explore my technical toolkit')).toBeVisible();

        const resetButton = dialog.locator('button', { hasText: 'reset' });
        await expect(resetButton).toContainText('ctrl + L');
        await resetButton.click();

        await expect(dialog.getByText('Session initialized')).toBeVisible();
        await expect(dialog.getByText('Explore my technical toolkit')).toHaveCount(0);
        await expect(dialog.getByText('02 LINES')).toBeVisible();

        // 4. Test "clear" alias also restores session cleanly
        await terminalInput.fill('help');
        await page.keyboard.press('Enter');
        await expect(dialog.getByText('Explore my technical toolkit')).toBeVisible();

        await terminalInput.fill('clear');
        await page.keyboard.press('Enter');

        await expect(dialog.getByText('Session initialized')).toBeVisible();
        await expect(dialog.getByText('02 LINES')).toBeVisible();

        // 5. Test "Control+l" shortcut also restores session cleanly
        await terminalInput.fill('help');
        await page.keyboard.press('Enter');
        await expect(dialog.getByText('Explore my technical toolkit')).toBeVisible();

        await page.keyboard.press('Control+l');
        await expect(dialog.getByText('Session initialized')).toBeVisible();
        await expect(dialog.getByText('02 LINES')).toBeVisible();
    });

    test('backtick (`) key exclusively opens and closes the terminal without typing into terminal input', async ({
        page
    }) => {
        await page.goto('/');

        const dialog = page.locator('dialog[aria-modal="true"]');
        await expect(dialog).toHaveCount(0);

        // 1. Pressing backtick opens the terminal and auto-focuses the input
        await page.keyboard.press('Backquote');
        await expect(dialog).toBeVisible();

        const terminalInput = dialog.locator('input[aria-label="Terminal command input"]');
        await expect(terminalInput).toBeFocused();
        await expect(terminalInput).toHaveValue('');

        // 2. Typing characters works normally, and pressing backtick closes instead of typing "`"
        await page.keyboard.type('help');
        await expect(terminalInput).toHaveValue('help');

        await page.keyboard.press('Backquote');
        await expect(dialog).toHaveCount(0);

        // 3. Reopening with backtick confirms no backtick character was inserted into the input
        await page.keyboard.press('Backquote');
        await expect(dialog).toBeVisible();
        await expect(terminalInput).toHaveValue('help');

        // 4. Close again via backtick
        await page.keyboard.press('Backquote');
        await expect(dialog).toHaveCount(0);

        // 5. Regular form inputs outside the terminal should still allow typing backtick
        const contactInput = page.locator('#firstName');
        await contactInput.click();
        await page.keyboard.press('Backquote');
        await expect(dialog).toHaveCount(0);
        await expect(contactInput).toHaveValue('`');
    });
});
