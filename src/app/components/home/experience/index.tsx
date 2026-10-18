import { HardwareAnimated } from '@/components/animations/hardware-animated';
import { Code, Sparkles } from 'lucide-react';
import { getExperience } from '@/lib/content/experience';

const Experience = () => {
    const experienceData = getExperience();

    return (
        <section>
            <div className="container">
                <div className="border-x border-primary/10">
                    <HardwareAnimated animation="slideInUp">
                        <div className="flex flex-col max-w-3xl mx-auto py-10 px-4 sm:px-7">
                            <div className="flex flex-col xs:flex-row gap-5 items-center justify-between">
                                <h2 className="text-sm tracking-[2px] text-primary uppercase font-medium cursor-default">
                                    Experience
                                </h2>
                            </div>
                        </div>
                    </HardwareAnimated>
                    <div className="border-t border-primary/10">
                        <div className="flex flex-col max-w-3xl mx-auto px-4 sm:px-7 py-9 md:py-16 cursor-default">
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
                                            className={`flex flex-col gap-5 border-dashed border-primary/10 cursor-default ${isFirst ? 'pt-0' : 'pt-8 sm:pt-10'} ${isLast ? 'pb-0 border-b-0' : 'pb-8 sm:pb-10 border-b'}`}
                                        >
                                            {value?.icon === 'Code' && (
                                                <Code
                                                    className="w-8 h-8 text-primary"
                                                    strokeWidth={1.5}
                                                    aria-hidden="true"
                                                />
                                            )}
                                            {value?.icon === 'Sparkles' && (
                                                <Sparkles
                                                    className="w-8 h-8 text-primary"
                                                    strokeWidth={1.5}
                                                    aria-hidden="true"
                                                />
                                            )}
                                            <div className="flex flex-wrap gap-5 items-center justify-between">
                                                <h3 className="text-base sm:text-lg font-medium text-primary cursor-default">
                                                    {value?.role}
                                                </h3>
                                                <div className="flex items-center gap-2.5 border border-primary/10 rounded-lg py-1.5 px-3">
                                                    <div
                                                        aria-hidden="true"
                                                        className={`w-4 h-2 rounded-sm ${value?.endYear == 'Present' ? 'bg-primary' : 'bg-primary/10'} `}
                                                    />
                                                    <p className="text-sm xs:text-base text-primary cursor-default">
                                                        {value?.startYear} – {value?.endYear} · {value?.location}
                                                    </p>
                                                </div>
                                            </div>
                                            <ul className="cursor-default">
                                                {value?.bulletPoints?.map((point) => {
                                                    return (
                                                        <li
                                                            key={point.substring(0, 30)}
                                                            className="flex items-start gap-2 text-base font-normal text-secondary cursor-default"
                                                        >
                                                            <span
                                                                className="w-2.5 h-2.5 text-secondary"
                                                                aria-hidden="true"
                                                            >
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
