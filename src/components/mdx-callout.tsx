'use client';

import { Lightbulb, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export function TLDR({ children }: Readonly<{ children: React.ReactNode }>) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            data-tldr
            className="group my-6 rounded-xl border border-primary/10 bg-primary/2 shadow-sm overflow-hidden"
        >
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="tldr-panel"
                className="w-full flex items-center justify-between p-4 md:p-5 cursor-pointer hover:bg-primary/4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-500 ${
                            isOpen
                                ? 'bg-[#F3CA4D]/10 text-[#F3CA4D] shadow-[0_0_8px_rgba(243,202,77,0.25)]'
                                : 'bg-primary/5 text-primary'
                        }`}
                    >
                        <Lightbulb
                            aria-hidden="true"
                            className={`w-4 h-4 transition-all duration-500 ${
                                isOpen ? 'fill-[#F3CA4D]/20' : 'fill-transparent'
                            }`}
                        />
                    </div>
                    <span id="tldr-heading" className="m-0! mt-0! mb-0! border-0! text-lg font-semibold text-primary">
                        TL;DR
                    </span>
                </div>
                <div
                    aria-hidden="true"
                    className={`text-secondary transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
                >
                    <ChevronRight className="w-5 h-5" />
                </div>
            </button>
            <div
                id="tldr-panel"
                role="region"
                aria-labelledby="tldr-heading"
                className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
            >
                <div className="overflow-hidden">
                    <div className="px-5 pb-6 md:px-7 md:pb-7 border-t border-primary/10 bg-primary/3">
                        <div className="pt-5 text-secondary text-sm md:text-base [&>ul]:mt-0! [&>ul]:mb-0! [&>ul>li]:mt-3 [&>ul]:pl-5 md:[&>ul]:pl-6 leading-relaxed cursor-default">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
