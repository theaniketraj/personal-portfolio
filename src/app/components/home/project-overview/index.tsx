import Image from "next/image";
import Link from "next/link";
import { HardwareAnimated } from "@/components/animations/hardware-animated";
import { getProjects, getBlogPosts } from "@/lib/mdx";

const ProjectOverview = () => {
  const allProjects = getProjects();
  const allBlogs = getBlogPosts();

  const projectOverview = {
    projects: allProjects.slice(0, 2).map((project) => ({
      name: project.title,
      url: `/projects/${project.slug}`,
      description: project.description,
    })),
    blogs: allBlogs.slice(0, 2).map((blog) => ({
      name: blog.title,
      url: `/blog/${blog.slug}`,
      description: blog.excerpt,
    })),
  };

  return (
    <section>
      <div className="container">
        <div className="border-x border-primary/10">
          <div className="flex flex-col max-w-3xl mx-auto gap-12 sm:gap-16 px-4 sm:px-7 py-9 md:py-16">
            {/* Projects Section */}
            <HardwareAnimated animation="slideInUp">
              <div className="flex flex-col xs:flex-row items-start gap-5 xs:gap-10 md:gap-24 lg:gap-12">
                <h2 className="max-w-fit lg:max-w-2xs w-full text-sm tracking-[2px] text-primary uppercase font-medium pt-1">
                  Projects
                </h2>
                <div className="flex flex-col gap-4 flex-1">
                  <div className="flex flex-col gap-3">
                    {projectOverview.projects?.map((value, index) => (
                      <Link
                        key={value.url}
                        href={value.url}
                        className="group flex items-center justify-between gap-3"
                      >
                        <h3 className="text-lg sm:text-xl font-medium group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {value.name}
                          {value.description
                            ? ` : ${value.description.split(" ").slice(0, 4).join(" ")}...`
                            : ""}
                        </h3>
                        <Image
                          src={"/images/icon/tile-arrow-icon.svg"}
                          alt=""
                          width={24}
                          height={24}
                          className="dark:invert group-hover:translate-x-1.5 group-hover:rotate-45 transition-all duration-300 ease-in shrink-0"
                        />
                      </Link>
                    ))}
                  </div>
                  <div>
                    <Link
                      href="/projects"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-primary hover:text-violet-600 dark:hover:text-violet-400 transition-colors pt-2"
                    >
                      See all projects
                    </Link>
                  </div>
                </div>
              </div>
            </HardwareAnimated>

            {/* Blogs Section */}
            <HardwareAnimated animation="slideInUp" delay={0.15}>
              <div className="flex flex-col xs:flex-row items-start gap-5 xs:gap-10 md:gap-24 lg:gap-12">
                <h2 className="max-w-fit lg:max-w-2xs w-full text-sm tracking-[2px] text-primary uppercase font-medium pt-1">
                  Blogs
                </h2>
                <div className="flex flex-col gap-4 flex-1">
                  <div className="flex flex-col gap-3">
                    {projectOverview.blogs?.map((value, index) => (
                      <Link
                        key={value.url}
                        href={value.url}
                        className="group flex items-center justify-between gap-3"
                      >
                        <h3 className="text-lg sm:text-xl font-medium group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {value.name}
                        </h3>
                        <Image
                          src={"/images/icon/tile-arrow-icon.svg"}
                          alt=""
                          width={24}
                          height={24}
                          className="dark:invert group-hover:translate-x-1.5 group-hover:rotate-45 transition-all duration-300 ease-in shrink-0"
                        />
                      </Link>
                    ))}
                  </div>
                  <div>
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-primary hover:text-violet-600 dark:hover:text-violet-400 transition-colors pt-2"
                    >
                      See all blogs
                    </Link>
                  </div>
                </div>
              </div>
            </HardwareAnimated>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectOverview;
