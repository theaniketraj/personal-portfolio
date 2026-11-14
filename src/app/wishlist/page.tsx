import { Metadata } from 'next';
import { Breadcrumb } from '@/components/breadcrumb';
import { HardwareAnimated } from '@/components/animations/hardware-animated';
import { getWishlistItems } from '@/lib/mdx';
import { WishlistClient } from './wishlist-client';

export const metadata: Metadata = {
    title: 'Wishlist & Setup Aspirations',
    robots: {
        index: false,
        follow: false,
        nocache: true
    }
};

export default function WishlistPage() {
    const items = getWishlistItems();

    return (
        <main
            id="main-content"
            tabIndex={-1}
            className="outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
        >
            <section>
                <div className="container">
                    <div className="border-x border-primary/10">
                        {/* Hero Header */}
                        <HardwareAnimated animation="slideInUp">
                            <div className="flex flex-col max-w-3xl mx-auto px-4 sm:px-7 py-12 md:py-16 gap-6">
                                <Breadcrumb backHref="/" backLabel="Home" items={[{ label: 'Wishlist' }]} />
                                <div>
                                    <p className="text-sm tracking-[2px] text-primary uppercase cursor-default select-none font-medium mb-2 font-(family-name:--font-space-grotesk)">
                                        Gear &amp; Setup Aspirations
                                    </p>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal cursor-default select-none text-primary font-(family-name:--font-space-grotesk)">
                                        Workstation &amp; Hardware Wishlist
                                    </h1>
                                </div>
                                <p className="text-secondary text-base leading-relaxed cursor-default select-none font-(family-name:--font-space-grotesk)">
                                    A curated collection of developer hardware, custom peripherals, ergonomics, and
                                    engineering books I&apos;m looking forward to adding to my setup.
                                </p>
                            </div>
                        </HardwareAnimated>

                        {/* Interactive Client Grid */}
                        <WishlistClient items={items} />
                    </div>
                </div>
            </section>
        </main>
    );
}
