"use client";
import { Badge } from "@/components/ui/badge";
import { HardwareAnimated } from "@/components/animations/hardware-animated";

const AboutMe = () => {
  const skills = [
    {
      category: "Languages",
      items: ["Java", "Kotlin", "Python", "JavaScript", "TypeScript", "SQL"],
    },
    {
      category: "Android",
      items: ["Android SDK", "Retrofit", "Coroutines", "Jetpack Compose"],
    },
    { category: "AI/ML", items: ["TensorFlow Lite", "Scikit-learn", "OpenCV"] },
    { category: "Systems & Tools", items: ["CLI tooling", "REST APIs", "Git"] },
  ];
  return (
    <section>
      <div className="container">
        <div className="border-x border-primary/10 bg-[url('/images/about-me/about-me-bg.svg')] dark:bg-[url('/images/about-me/about-me-bg-dark.svg')] bg-cover bg-center bg-no-repeat">
          <HardwareAnimated animation="slideInUp">
            <div className="flex flex-col gap-9 sm:gap-12 max-w-3xl mx-auto px-4 sm:px-7 py-11 md:py-20 font-(family-name:--font-space-grotesk)">
              <div className="flex flex-col gap-4">
                <h2 className="text-sm tracking-[2px] text-primary uppercase font-medium">
                  About Me
                </h2>
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-normal text-primary">
                  Hey there. I&apos;m Aniket Raj - A Computer Science &amp;
                  Engineering graduate passionate about{" "}
                  <span className="bg-[linear-gradient(90deg,rgba(243,202,77,0.4)_0%,rgba(243,202,77,0.05)_100%)]">
                    leveraging technology
                  </span>{" "}
                  to build scalable, real world{" "}
                  <span className="border-b-2">software &amp; AI systems</span>.
                </h3>
                <p className="text-base sm:text-lg text-secondary font-normal">
                  Passionate about writing clean, scalable, and efficient Web
                  and AI applications.
                </p>
              </div>
              <div className="flex flex-col gap-5">
                <h3 className="text-sm text-primary uppercase font-medium">
                  Skills &amp; Fluency
                </h3>
                <div className="flex flex-col gap-5">
                  {skills.map((skillGroup, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 sm:grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-3 sm:gap-4 items-start"
                    >
                      <p className="text-sm font-medium text-muted-foreground sm:pt-1.5">
                        {skillGroup.category}
                      </p>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {skillGroup.items.map((value, index) => (
                          <Badge
                            variant={"outline"}
                            key={index}
                            className="py-1.5 px-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                          >
                            <p className="text-xs sm:text-sm font-medium text-primary">
                              {value}
                            </p>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </HardwareAnimated>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
