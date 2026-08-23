"use client";
import { useEffect, useState } from "react";
import { HardwareAnimated } from "@/components/animations/hardware-animated";

const Education = () => {
  const [educationData, setEducationData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/page-data");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setEducationData(data?.educationData);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <section>
      <div className="container">
        <div className="border-x border-primary/10">
          <HardwareAnimated animation="slideInUp">
            <div className="flex flex-col max-w-3xl mx-auto py-10 px-4 sm:px-7">
              <div className="flex flex-col xs:flex-row gap-5 items-center justify-between">
                <h2 className="text-sm tracking-[2px] text-primary uppercase font-medium">
                  Education
                </h2>
              </div>
            </div>
          </HardwareAnimated>

          <div className="border-t border-primary/10">
            <div className="relative max-w-3xl mx-auto px-4 sm:px-0 py-10">
              <div className="hidden sm:flex absolute left-5 sm:left-[15.9rem] sm:translate-x-1/2 top-0 bottom-0 w-px bg-primary/10" />

              <div className="relative">
                {educationData?.map((item: any, index: any) => (
                  <HardwareAnimated
                    key={index}
                    animation="slideInRight"
                    delay={index * 0.15}
                  >
                    <div
                      className={`relative flex flex-col sm:flex-row sm:items-start gap-4 ${
                        index !== educationData.length - 1
                          ? "mb-8 sm:mb-16"
                          : ""
                      }`}
                    >
                      <div className="relative pl-8 sm:pl-0 sm:w-64 sm:text-right sm:pr-16">
                        <p className="ml-2.5 sm:ml-0 text-base font-normal sm:mb-0 leading-relaxed">
                          {item.date}
                        </p>

                        {/* Bullet Point */}
                        <div className="absolute left-1.5 sm:left-auto sm:-right-3 top-0 z-10 p-1.5 border border-primary/10 rounded-full bg-background">
                          <div className="w-3 h-3 bg-primary rounded-full" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 flex-1 sm:pl-16 ml-2 sm:ml-0">
                        <h3 className="font-semibold text-base sm:text-lg text-primary">
                          {item.title}
                        </h3>
                        <p className="text-primary">{item.subtitle}</p>
                      </div>
                    </div>
                  </HardwareAnimated>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
