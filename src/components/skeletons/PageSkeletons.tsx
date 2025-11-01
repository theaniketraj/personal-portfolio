import {
    ContactSectionSkeleton,
    FeaturedItemsSkeleton,
    FooterSkeleton,
    HeaderSkeleton,
    HeroSectionSkeleton,
    PostFeedSkeleton,
    TextSectionSkeleton
} from './SectionSkeletons';

export const PageLoadingSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <HeaderSkeleton />
            <main>
                <HeroSectionSkeleton />
                <TextSectionSkeleton />
                <FeaturedItemsSkeleton itemCount={3} />
                <TextSectionSkeleton />
                <PostFeedSkeleton itemCount={6} />
            </main>
            <FooterSkeleton />
        </div>
    );
};

export const BlogPageLoadingSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <HeaderSkeleton />
            <main className="px-4 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto">
                    <PostFeedSkeleton itemCount={12} />
                </div>
            </main>
            <FooterSkeleton />
        </div>
    );
};

export const ProjectPageLoadingSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <HeaderSkeleton />
            <main className="px-4 py-16 sm:py-24">
                <div className="max-w-7xl mx-auto">
                    <FeaturedItemsSkeleton itemCount={12} />
                </div>
            </main>
            <FooterSkeleton />
        </div>
    );
};

export const ContactPageLoadingSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <HeaderSkeleton />
            <main>
                <ContactSectionSkeleton />
            </main>
            <FooterSkeleton />
        </div>
    );
};
