import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HardwareAnimated } from "@/components/animations/hardware-animated";
import { getFeaturedProjects } from "@/lib/mdx";

const FeaturedWork = () => {
  const featureWork = getFeaturedProjects();

  return (
    <section>
      <div className="container">
        <div className="border-x border-primary/10">
          <HardwareAnimated animation="slideInUp">
            <div className="flex flex-col max-w-3xl mx-auto py-10 px-4 sm:px-7">
              <div className="flex flex-col xs:flex-row gap-5 items-center justify-between">
                <h2 className="text-sm tracking-[2px] text-primary uppercase font-medium">
                  My Resume
                </h2>
                <Button asChild variant={"outline"} className="h-auto">
                  <Link
                    href="https://theaniketraj.github.io/vitae"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-5"
                  >
                    View Resume / CV
                  </Link>
                </Button>
              </div>
            </div>
          </HardwareAnimated>
          <div className="border-t border-primary/10">
            <HardwareAnimated animation="slideInUp">
              <div className="flex flex-col max-w-3xl mx-auto py-10 px-4 sm:px-7">
                <h2 className="text-sm tracking-[2px] text-primary uppercase font-medium">
                  Featured Work
                </h2>
              </div>
            </HardwareAnimated>
            <div className="grid grid-cols-1 md:grid-cols-2 border-t border-primary/10">
              {featureWork?.map((project, index) => {
                const isRightCol = index % 2 === 1;

                return (
                  <HardwareAnimated
                    key={project.slug}
                    animation="fadeInScale"
                    delay={index * 0.15}
                  >
                    <div
                      className={`group flex flex-col gap-3.5 sm:gap-5 p-3.5 sm:p-6 ${isRightCol ? "md:border-l md:border-primary/10" : ""}`}
                    >
                      <Link
                        href={`/projects/${project.slug}`}
                        className="overflow-hidden"
                      >
                        <Image
                          src={project.image || ""}
                          alt={project.title || "Project thumbnail"}
                          width={490}
                          height={300}
                          className="w-full h-auto group-hover:scale-105 transition-all duration-300 ease-in-out"
                        />
                      </Link>
                      <div className="flex flex-col gap-1 sm:gap-2 px-2">
                        <Link href={`/projects/${project.slug}`}>
                          <h3 className="text-lg sm:text-xl font-medium text-primary">
                            {project.title}
                          </h3>
                        </Link>
                        <div className="flex">
                          <p>{project.roles?.join(", ")}</p>
                        </div>
                      </div>
                    </div>
                  </HardwareAnimated>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedWork;
