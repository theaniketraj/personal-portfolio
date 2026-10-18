import React from 'react';

export default function Template({ children }: Readonly<{ children: React.ReactNode }>) {
    return <div className="animate-page-enter">{children}</div>;
}
