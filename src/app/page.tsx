import { Metadata } from "next";
import Divider from "./components/divider";

export const metadata: Metadata = {
  title: "Aniket Raj - Software & AI Engineer",
  alternates: {
    canonical: "/",
  },
};
import AboutMe from "./components/home/about-me";
import Education from "./components/home/education";
import Experience from "./components/home/experience";
import FeaturedWork from "./components/home/featured-work";
import ProjectOverview from "./components/home/project-overview";
import Contact from "./components/home/contact";

const page = () => {
  return (
    <main>
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
