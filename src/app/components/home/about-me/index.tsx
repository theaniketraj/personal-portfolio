import { Badge } from '@/components/ui/badge';
import { HardwareAnimated } from '@/components/animations/hardware-animated';
import { skillsData as skills } from '@/lib/data';

const AboutMe = () => {
    return (
        <section>
            <div className="container">
                <div className="border-x border-primary/10 bg-[url('/images/about-me/about-me-bg.svg')] dark:bg-[url('/images/about-me/about-me-bg-dark.svg')] bg-cover bg-center bg-no-repeat">
                    <HardwareAnimated animation="slideInUp">
                        <div className="flex flex-col gap-9 sm:gap-12 max-w-3xl mx-auto px-4 sm:px-7 py-11 md:py-20 font-(family-name:--font-space-grotesk)">
                            <div className="flex flex-col gap-4">
                                <h2 className="text-sm tracking-[2px] cursor-default text-primary uppercase font-medium">
                                    About Me
                                </h2>
                                <p className="text-xl sm:text-2xl md:text-3xl lg:text-[32px] font-normal cursor-default text-primary text-justify">
                                    Hey there. I&apos;m Aniket Raj - A Computer Science and Engineering graduate who
                                    enjoys{' '}
                                    <span className="bg-[linear-gradient(90deg,rgba(243,202,77,0.4)_0%,rgba(243,202,77,0.05)_100%)]">
                                        building systems
                                    </span>{' '}
                                    where software meets real world constraints, from distributed runtimes &{' '}
                                    <span className="border-b-2">developer tooling to applied AI.</span>
                                </p>
                                <p className="text-base sm:text-lg cursor-default text-secondary font-normal text-justify">
                                    I care about software that is reliable, efficient, and useful beyond the demo.
                                </p>
                            </div>
                            <div className="flex flex-col gap-5 cursor-default select-none">
                                <h3 className="text-sm text-primary uppercase font-medium cursor-default select-none">
                                    Skills
                                </h3>
                                <div className="flex flex-col gap-5 cursor-default select-none">
                                    {skills.map((skillGroup) => (
                                        <div
                                            key={skillGroup.category}
                                            className="grid grid-cols-1 sm:grid-cols-[140px_1fr] md:grid-cols-[160px_1fr] gap-3 sm:gap-4 items-start cursor-default select-none"
                                        >
                                            <p className="text-sm font-medium text-muted-foreground sm:pt-1.5 cursor-default select-none">
                                                {skillGroup.category}
                                            </p>
                                            <div className="flex flex-wrap gap-2 sm:gap-3 cursor-default select-none">
                                                {skillGroup.items.map((value) => (
                                                    <Badge
                                                        variant={'outline'}
                                                        key={value}
                                                        className="py-1.5 px-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-default select-none"
                                                    >
                                                        <p className="text-xs sm:text-sm font-medium text-primary cursor-default select-none">
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
