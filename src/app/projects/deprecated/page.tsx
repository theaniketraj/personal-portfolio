import fs from "node:fs";
import path from "node:path";
import { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { HardwareAnimated } from "@/components/animations/hardware-animated";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Deprecated Projects",
  description:
    "A catalogue of experimental, deprecated, or abandoned projects by Aniket Raj.",
  alternates: {
    canonical: "/projects/deprecated",
  },
};

interface DeprecatedProject {
  title: string;
  description: string;
  link: string;
  deprecated: boolean;
  deprecated_reason: string;
}

export default function DeprecatedProjectsPage() {
  const dataPath = path.join(process.cwd(), "data", "deprecated.json");
  let projects: DeprecatedProject[] = [];

  if (fs.existsSync(dataPath)) {
    try {
      const fileContents = fs.readFileSync(dataPath, "utf8");
      projects = JSON.parse(fileContents);
    } catch (e) {
      console.error("Failed to parse deprecated.json", e);
    }
  }

  return (
    <main>
      <section>
        <div className="container">
          <div className="border-x border-primary/10">
            <HardwareAnimated animation="slideInUp">
              <div className="flex flex-col max-w-3xl mx-auto px-4 sm:px-7 py-12 md:py-16 gap-6">
                <Breadcrumb
                  backHref="/projects"
                  backLabel="Active Projects"
                  items={[{ label: "Deprecated" }]}
                />
                <div className="mt-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-primary mb-2 font-(family-name:--font-space-grotesk)">
                    Deprecated &amp; Experimental
                  </h1>
                </div>
                <p className="text-secondary text-base leading-relaxed font-(family-name:--font-space-grotesk)">
                  A graveyard of abandoned experiments, projects, and deprecated
                  tools. Some ideas didn&apos;t pan out, some were replaced by
                  better alternatives, and some just exist as reference code.
                </p>
              </div>
            </HardwareAnimated>

            <div className="border-t border-primary/10">
              <div className="max-w-3xl mx-auto px-4 sm:px-7 py-10 flex flex-col gap-8">
                {projects.length === 0 ? (
                  <p className="text-secondary text-sm">
                    No deprecated projects found.
                  </p>
                ) : (
                  projects.map((project, index) => (
                    <HardwareAnimated
                      key={project.title}
                      animation="slideInUp"
                      delay={index * 0.08}
                    >
                      <article
                        className={`group ${index !== projects.length - 1 ? "border-b border-primary/15 pb-10" : ""}`}
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-xs font-mono text-red-500/90 dark:text-red-400/90 border border-red-500/20 dark:border-red-400/20 bg-red-500/5 dark:bg-red-400/5 rounded-md px-2.5 py-0.5">
                            {project.deprecated_reason || "Deprecated"}
                          </span>
                        </div>

                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <h2 className="text-xl sm:text-2xl font-medium text-primary group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors mb-3">
                              {project.title}
                            </h2>
                          </a>
                        ) : (
                          <h2 className="text-xl sm:text-2xl font-medium text-primary mb-3">
                            {project.title}
                          </h2>
                        )}

                        <p className="text-secondary text-sm sm:text-base leading-relaxed mb-4">
                          {project.description}
                        </p>

                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors"
                            aria-label={`View source code for ${project.title}`}
                          >
                            <span>View Source Code</span>
                            <span className="relative flex items-center justify-center overflow-hidden w-4.5 h-4.5">
                              <ArrowUpRight className="absolute w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-full group-hover:-translate-y-full" />
                              <ArrowUpRight className="absolute w-4.5 h-4.5 -translate-x-full translate-y-full transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
                            </span>
                          </a>
                        )}
                      </article>
                    </HardwareAnimated>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
