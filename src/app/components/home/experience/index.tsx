import { HardwareAnimated } from "@/components/animations/hardware-animated";
import { Code, Sparkles } from "lucide-react";
import { getExperience } from "@/lib/content/experience";

const Experience = () => {
  const experienceData = getExperience();

  return (
    <section>
      <div className="container">
        <div className="border-x border-primary/10">
          <HardwareAnimated animation="slideInUp">
            <div className="flex flex-col max-w-3xl mx-auto py-10 px-4 sm:px-7">
              <div className="flex flex-col xs:flex-row gap-5 items-center justify-between">
                <h2 className="text-sm tracking-[2px] text-primary uppercase font-medium">
                  Experience
                </h2>
              </div>
            </div>
          </HardwareAnimated>
          <div className="border-t border-primary/10">
            <div className="flex flex-col max-w-3xl mx-auto px-4 sm:px-7 py-9 md:py-16 ">
              {experienceData?.map((value, index) => {
                const isFirst = index === 0;
                const isLast = index === experienceData.length - 1;

                return (
                  <HardwareAnimated
                    key={`${value?.role}-${value?.startYear}`}
                    animation="slideInLeft"
                    delay={index * 0.15}
                  >
                    <div
                      className={`flex flex-col gap-5 border-dashed border-primary/10 ${isFirst ? "pt-0" : "pt-8 sm:pt-10"} ${isLast ? "pb-0 border-b-0" : "pb-8 sm:pb-10 border-b"}`}
                    >
                      {value?.icon === "Code" && (
                        <Code
                          className="w-8 h-8 text-primary"
                          strokeWidth={1.5}
                        />
                      )}
                      {value?.icon === "Sparkles" && (
                        <Sparkles
                          className="w-8 h-8 text-primary"
                          strokeWidth={1.5}
                        />
                      )}
                      <div className="flex flex-wrap gap-5 items-center justify-between">
                        <h3 className="text-base sm:text-lg font-medium text-primary">
                          {value?.role}
                        </h3>
                        <div className="flex items-center gap-2.5 border border-primary/10 rounded-lg py-1.5 px-3">
                          <div
                            className={`w-4 h-2 rounded-sm ${value?.endYear == "Present" ? "bg-primary" : "bg-primary/10"} `}
                          />
                          <p className="text-sm xs:text-base text-primary">
                            {value?.startYear} – {value?.endYear} ·{" "}
                            {value?.location}
                          </p>
                        </div>
                      </div>
                      <ul>
                        {value?.bulletPoints?.map((point, pointIndex) => {
                          return (
                            <li
                              key={point.substring(0, 30)}
                              className="flex items-start gap-2 text-base font-normal text-secondary"
                            >
                              <span className="w-2.5 h-2.5 text-secondary">
                                •
                              </span>
                              {point}
                            </li>
                          );
                        })}
                      </ul>
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

export default Experience;
