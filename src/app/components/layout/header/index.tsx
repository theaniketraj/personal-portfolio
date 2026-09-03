import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Divider from "@/app/components/divider";

const Header = () => {
  const socialIcon = [
    {
      img: "/images/icon/github-icon.svg",
      href: "https://github.com/theaniketraj",
      icon: "GitHub",
    },
    {
      img: "/images/icon/linkedin-icon.svg",
      href: "https://www.linkedin.com/in/theaniketraj/",
      icon: "LinkedIn",
    },
    {
      img: "/images/icon/twitter-icon.svg",
      href: "https://x.com/aniketfoundry",
      icon: "Twitter",
    },
  ];

  return (
    <header>
      <div className="container">
        <div className="border-x border-b border-primary/10">
          <div className="flex flex-col xs:flex-row items-center xs:items-start justify-center xs:justify-between max-w-3xl mx-auto gap-10 xs:gap-3 px-4 sm:px-7 pt-10 sm:pt-14 pb-8 sm:pb-12">
            <div className="flex flex-col gap-2 sm:gap-3 items-center text-center xs:items-start">
              <Link href="/" aria-label="Go to homepage">
                <h1 className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Aniket Raj
                </h1>
              </Link>
              <p className="text-violet-700 dark:text-violet-400 font-normal">
                SDE · Systems & AI
              </p>
              <div className="flex items-center gap-2">
                <Image
                  src={"/images/icon/map-icon.svg"}
                  alt=""
                  width={20}
                  height={20}
                  className="dark:invert"
                />
                <p className="text-primary">India</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex items-center gap-2">
                {socialIcon?.map((value) => {
                  return (
                    <Link
                      href={value?.href}
                      key={value?.icon}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={value?.icon}
                      className="w-9.5 h-9.5 sm:w-11.5 sm:h-11.5 flex items-center justify-center hover:bg-primary/5 border border-primary/10 rounded-full transition-colors"
                    >
                      <Image
                        src={value?.img}
                        alt={value?.icon}
                        width={18}
                        height={18}
                        className="dark:invert"
                      />
                    </Link>
                  );
                })}
                <ThemeToggle />
              </div>
              <Button asChild className="h-auto rounded-full p-0.5!">
                <Link
                  href="/#contact"
                  className="group inline-block p-0.5 rounded-full bg-[linear-gradient(96.09deg,#9282F8_12.17%,#F3CA4D_90.71%)]"
                >
                  <span className="flex items-center gap-3 bg-primary hover:bg-[linear-gradient(96.09deg,#9282F8_12.17%,#F3CA4D_90.71%)] py-2.5 px-5 rounded-full transition-all">
                    <Image
                      src="/images/icon/spark-icon.svg"
                      alt="spark-icon"
                      width={14}
                      height={14}
                      className="dark:invert group-hover:invert-0"
                    />
                    <span className="text-sm sm:text-base font-semibold text-primary-foreground group-hover:text-white">
                      Get in touch
                    </span>
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Divider />
    </header>
  );
};

export default Header;
