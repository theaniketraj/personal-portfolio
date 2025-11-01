import classNames from 'classnames';
import { SkeletonLoader } from './SkeletonLoader';

export const HeroSectionSkeleton: React.FC = () => {
    return (
        <section className="px-4 py-16 sm:py-24 lg:py-32 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Text Content */}
                    <div className="flex-1 space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <SkeletonLoader height={48} className="w-3/4" />
                            <SkeletonLoader height={48} className="w-1/2" />
                        </div>

                        {/* Subtitle */}
                        <div className="space-y-2 pt-4">
                            <SkeletonLoader height={24} className="w-4/5" />
                            <SkeletonLoader height={24} className="w-3/5" />
                        </div>

                        {/* Description text */}
                        <div className="space-y-2 pt-4">
                            <SkeletonLoader height={16} className="w-full" />
                            <SkeletonLoader height={16} className="w-full" />
                            <SkeletonLoader height={16} className="w-3/4" />
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 pt-6">
                            <SkeletonLoader width={120} height={44} className="rounded" />
                            <SkeletonLoader width={120} height={44} className="rounded" />
                        </div>
                    </div>

                    {/* Media Placeholder */}
                    <div className="flex-1">
                        <SkeletonLoader height={400} className="w-full rounded-lg" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export const TextSectionSkeleton: React.FC = () => {
    return (
        <section className="px-4 py-16 sm:py-24 bg-white">
            <div className="max-w-3xl mx-auto space-y-4">
                <SkeletonLoader height={32} className="w-2/3" />
                <div className="space-y-3 pt-4">
                    <SkeletonLoader height={16} className="w-full" />
                    <SkeletonLoader height={16} className="w-full" />
                    <SkeletonLoader height={16} className="w-4/5" />
                    <SkeletonLoader height={16} className="w-full" />
                    <SkeletonLoader height={16} className="w-3/5" />
                </div>
            </div>
        </section>
    );
};

export const FeaturedItemsSkeleton: React.FC<{ itemCount?: number }> = ({ itemCount = 3 }) => {
    return (
        <section className="px-4 py-16 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section title */}
                <SkeletonLoader height={32} className="w-1/3 mb-12" />

                {/* Items Grid */}
                <div
                    className={classNames('grid gap-6', {
                        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': itemCount === 3,
                        'grid-cols-1 sm:grid-cols-2': itemCount === 2,
                        'grid-cols-1': itemCount === 1
                    })}
                >
                    {Array.from({ length: itemCount }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            {/* Image */}
                            <SkeletonLoader height={240} className="w-full rounded-lg" />
                            {/* Title */}
                            <SkeletonLoader height={20} className="w-3/4" />
                            {/* Description */}
                            <div className="space-y-2">
                                <SkeletonLoader height={14} className="w-full" />
                                <SkeletonLoader height={14} className="w-4/5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export const PostFeedSkeleton: React.FC<{ itemCount?: number }> = ({ itemCount = 6 }) => {
    return (
        <section className="px-4 py-16 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section title */}
                <SkeletonLoader height={32} className="w-1/4 mb-12" />

                {/* Posts Grid */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: itemCount }).map((_, i) => (
                        <article key={i} className="space-y-4">
                            {/* Thumbnail */}
                            <SkeletonLoader height={200} className="w-full rounded-lg" />
                            {/* Date */}
                            <SkeletonLoader height={12} className="w-1/4" />
                            {/* Title */}
                            <SkeletonLoader height={20} className="w-3/4" />
                            {/* Excerpt */}
                            <div className="space-y-2">
                                <SkeletonLoader height={14} className="w-full" />
                                <SkeletonLoader height={14} className="w-3/5" />
                            </div>
                            {/* Read more link */}
                            <SkeletonLoader height={16} className="w-1/3" />
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export const ProjectFeedSkeleton: React.FC<{ itemCount?: number }> = ({ itemCount = 6 }) => {
    return (
        <section className="px-4 py-16 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section title */}
                <SkeletonLoader height={32} className="w-1/4 mb-12" />

                {/* Projects Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: itemCount }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            {/* Project image */}
                            <SkeletonLoader height={240} className="w-full rounded-lg" />
                            {/* Project title */}
                            <SkeletonLoader height={20} className="w-3/4" />
                            {/* Project description */}
                            <div className="space-y-2">
                                <SkeletonLoader height={14} className="w-full" />
                                <SkeletonLoader height={14} className="w-4/5" />
                            </div>
                            {/* Tags */}
                            <div className="flex gap-2">
                                <SkeletonLoader width={60} height={24} className="rounded" />
                                <SkeletonLoader width={60} height={24} className="rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export const ContactSectionSkeleton: React.FC = () => {
    return (
        <section className="px-4 py-16 sm:py-24 bg-white">
            <div className="max-w-2xl mx-auto">
                {/* Title */}
                <SkeletonLoader height={32} className="w-1/3 mx-auto mb-8" />

                {/* Form */}
                <div className="space-y-6">
                    {/* Name input */}
                    <SkeletonLoader height={40} className="w-full rounded" />
                    {/* Email input */}
                    <SkeletonLoader height={40} className="w-full rounded" />
                    {/* Message input */}
                    <SkeletonLoader height={120} className="w-full rounded" />
                    {/* Submit button */}
                    <SkeletonLoader width={150} height={44} className="rounded" />
                </div>
            </div>
        </section>
    );
};

export const MediaGallerySkeleton: React.FC<{ itemCount?: number }> = ({ itemCount = 12 }) => {
    return (
        <section className="px-4 py-16 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section title */}
                <SkeletonLoader height={32} className="w-1/4 mb-12" />

                {/* Gallery Grid */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: itemCount }).map((_, i) => (
                        <SkeletonLoader key={i} height={300} className="w-full rounded-lg" />
                    ))}
                </div>
            </div>
        </section>
    );
};

export const QuoteSectionSkeleton: React.FC = () => {
    return (
        <section className="px-4 py-16 sm:py-24 bg-white">
            <div className="max-w-3xl mx-auto text-center space-y-4">
                {/* Quote */}
                <SkeletonLoader height={24} className="w-full" />
                <SkeletonLoader height={24} className="w-4/5 mx-auto" />
                {/* Attribution */}
                <div className="pt-8">
                    <SkeletonLoader height={16} className="w-1/3 mx-auto" />
                </div>
            </div>
        </section>
    );
};

export const TestimonialsSkeleton: React.FC<{ itemCount?: number }> = ({ itemCount = 3 }) => {
    return (
        <section className="px-4 py-16 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section title */}
                <SkeletonLoader height={32} className="w-1/4 mb-12" />

                {/* Testimonials */}
                <div
                    className={classNames('grid gap-6', {
                        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3': itemCount === 3,
                        'grid-cols-1 sm:grid-cols-2': itemCount === 2
                    })}
                >
                    {Array.from({ length: itemCount }).map((_, i) => (
                        <div key={i} className="space-y-4 p-6 border rounded-lg">
                            {/* Quote */}
                            <div className="space-y-2">
                                <SkeletonLoader height={14} className="w-full" />
                                <SkeletonLoader height={14} className="w-full" />
                                <SkeletonLoader height={14} className="w-3/4" />
                            </div>
                            {/* Author */}
                            <div className="flex items-center gap-4 pt-4">
                                <SkeletonLoader width={40} height={40} circle />
                                <div className="flex-1 space-y-2">
                                    <SkeletonLoader height={14} className="w-3/4" />
                                    <SkeletonLoader height={12} className="w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export const HeaderSkeleton: React.FC = () => {
    return (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                {/* Logo */}
                <SkeletonLoader width={120} height={32} className="rounded" />
                {/* Navigation */}
                <div className="hidden md:flex gap-6">
                    <SkeletonLoader width={80} height={20} className="rounded" />
                    <SkeletonLoader width={80} height={20} className="rounded" />
                    <SkeletonLoader width={80} height={20} className="rounded" />
                </div>
                {/* Menu toggle for mobile */}
                <div className="md:hidden">
                    <SkeletonLoader width={24} height={24} className="rounded" />
                </div>
            </div>
        </header>
    );
};

export const FooterSkeleton: React.FC = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 px-4 py-16">
            <div className="max-w-7xl mx-auto">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-4">
                            <SkeletonLoader height={20} className="w-1/2" />
                            <div className="space-y-2">
                                <SkeletonLoader height={16} className="w-3/4" />
                                <SkeletonLoader height={16} className="w-3/4" />
                                <SkeletonLoader height={16} className="w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-8 flex justify-between items-center">
                    <SkeletonLoader width={200} height={16} className="rounded" />
                    <div className="flex gap-4">
                        <SkeletonLoader width={24} height={24} circle />
                        <SkeletonLoader width={24} height={24} circle />
                        <SkeletonLoader width={24} height={24} circle />
                    </div>
                </div>
            </div>
        </footer>
    );
};
