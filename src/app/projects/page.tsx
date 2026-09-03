import Link from "next/link";
import Image from "next/image";
import { getProjects } from "@/lib/mdx";
import { HardwareAnimated } from "@/components/animations/hardware-animated";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore technical projects, open-source systems, and AI frameworks built by Aniket Raj.",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <main>
      <section>
        <div className="container">
          <div className="border-x border-primary/10">
            <HardwareAnimated animation="slideInUp">
              <div className="flex flex-col max-w-3xl mx-auto px-4 sm:px-7 py-12 md:py-16 gap-6">
                <div>
                  <p className="text-sm tracking-[2px] text-primary uppercase font-medium mb-2">
                    Portfolio Directory
                  </p>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-primary">
                    Technical Projects &amp; Frameworks
                  </h1>
                </div>
                <p className="text-secondary text-base leading-relaxed">
                  A structured collection of open-source libraries, AI systems,
                  developer tooling, and IoT applications.
                </p>
              </div>
            </HardwareAnimated>

            <div className="grid grid-cols-1 md:grid-cols-2 border-t border-primary/10">
              {projects.map((project, index) => {
                const isRightCol = index % 2 === 1;
                return (
                  <HardwareAnimated
                    key={project.slug}
                    animation="fadeInScale"
                    delay={index * 0.1}
                  >
                    <div
                      className={`group flex flex-col justify-between p-6 sm:p-8 ${
                        isRightCol ? "md:border-l md:border-primary/10" : ""
                      } border-b border-primary/10 hover:bg-primary/5 transition-colors`}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-secondary border border-primary/10 rounded-md px-2.5 py-0.5">
                            {project.date}
                          </span>
                        </div>
                        <Link href={`/projects/${project.slug}`}>
                          <h3 className="text-xl font-medium text-primary group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                            {project.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-secondary line-clamp-3">
                          {project.description}
                        </p>
                      </div>
                      <div className="pt-5 flex flex-col gap-5">
                        <Link
                          href={`/projects/${project.slug}`}
                          aria-label={`View case study: ${project.title}`}
                          className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors"
                        >
                          <span>View Case Study / Docs</span>
                          <Image
                            src="/images/icon/tile-arrow-icon.svg"
                            alt=""
                            aria-hidden="true"
                            width={20}
                            height={20}
                            className="dark:invert group-hover:translate-x-1.5 group-hover:rotate-45 transition-all duration-300 ease-in"
                          />
                        </Link>
                      </div>
                    </div>
                  </HardwareAnimated>
                );
              })}
            </div>

            {/* Deprecated Projects Link */}
            <div className="border-t border-primary/10 py-10 px-4 sm:px-7 flex justify-center bg-primary/5 hover:bg-primary/10 transition-colors">
              <Link
                href="/projects/deprecated"
                className="group flex flex-col items-center gap-2 text-center"
              >
                <span className="text-xs font-mono uppercase text-secondary group-hover:text-primary transition-colors">
                  Archived & Experimental
                </span>
                <span className="text-lg font-medium text-primary group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors flex items-center justify-center gap-2">
                  View Deprecated Projects
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover:translate-x-1.5"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
