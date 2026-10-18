import { Metadata } from 'next';
import { profileData } from '@/lib/content/profile';
import Divider from './components/divider';
import AboutMe from './components/home/about-me';
import Education from './components/home/education';
import Experience from './components/home/experience';
import FeaturedWork from './components/home/featured-work';
import ProjectOverview from './components/home/project-overview';
import Contact from './components/home/contact';

export const metadata: Metadata = {
    alternates: {
        canonical: '/'
    }
};

const page = () => {
    return (
        <main id="main-content" tabIndex={-1} className="outline-none">
            <h1 className="sr-only">
                {profileData.name} - {profileData.title}
            </h1>
            <AboutMe />
            <Divider />
            <FeaturedWork />
            <Divider />
            <Experience />
            <Divider />
            <Education />
            <Divider />
            <ProjectOverview />
            <Divider />
            <Contact />
        </main>
    );
};

export default page;
