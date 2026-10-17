'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function RouteBorderBeam() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [cycle, setCycle] = useState(0);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Increment cycle on every pathname change to re-trigger the sweep
        setCycle((prev) => prev + 1);
    }, [pathname]);

    if (!mounted) return null;

    return (
        <div
            key={`${pathname}-${cycle}`}
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-9999 overflow-hidden"
        >
            <div className="container relative h-full">
                {/* Left Rail Glowing Beam */}
                <div className="border-beam-rail-left" />

                {/* Right Rail Glowing Beam */}
                <div className="border-beam-rail-right" />
            </div>
        </div>
    );
}
