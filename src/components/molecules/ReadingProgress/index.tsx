import { useEffect, useState } from 'react';

export default function ReadingProgress() {
    const [width, setWidth] = useState(0);

    const scrollHeight = () => {
        const element = document.documentElement;
        const scrollTop = element.scrollTop || document.body.scrollTop;
        const scrollHeight = element.scrollHeight || document.body.scrollHeight;
        const clientHeight = element.clientHeight;

        const windowHeight = scrollHeight - clientHeight;
        const scrolled = (scrollTop / windowHeight) * 100;

        setWidth(scrolled);
    };

    useEffect(() => {
        // Initial calculation
        scrollHeight();
        window.addEventListener('scroll', scrollHeight);
        return () => window.removeEventListener('scroll', scrollHeight);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-1.5 z-[9999] bg-transparent pointer-events-none">
            <div
                className="h-full bg-[var(--theme-primary)] transition-all duration-150 ease-out shadow-[0_0_10px_var(--theme-primary)]"
                style={{ width: `${width}%` }}
            />
        </div>
    );
}
