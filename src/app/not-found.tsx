import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HardwareAnimated } from "@/components/animations/hardware-animated";
import { NotFoundIllustration } from "@/components/illustrations/not-found-illustration";

function Birds() {
  return (
    <div className="container-bird pointer-events-none opacity-50 z-0">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bird bird-anim">
          <div className="bird-container">
            <div className="wing wing-left">
              <div className="wing-left-top"></div>
            </div>
            <div className="wing wing-right">
              <div className="wing-right-top"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="container flex-1 flex flex-col">
        <div className="border-x border-primary/10 flex-1 flex flex-col items-center justify-between pt-16 md:pt-24 pb-0 relative overflow-hidden">
          {/* Background Glow Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />

          {/* Flying Birds Background */}
          <Birds />

          <div className="max-w-2xl mx-auto px-4 sm:px-7 text-center z-10 flex-1 flex flex-col justify-center mb-8">
            <HardwareAnimated animation="slideInUp">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-6 mb-4 font-(family-name:--font-space-grotesk)">
                Page Not Found
              </h2>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-10 font-(family-name:--font-space-grotesk)">
                Oops! It seems you&apos;ve ventured into the unknown. The page
                you&apos;re looking for doesn&apos;t exist or has been moved to
                a new URL.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 h-12 text-base font-semibold font-(family-name:--font-space-grotesk)"
                >
                  <Link href="/">Return Home</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 h-12 text-base font-semibold border-primary/20 hover:bg-primary/5 font-(family-name:--font-space-grotesk)"
                >
                  <Link href="/projects">View Projects</Link>
                </Button>
              </div>
            </HardwareAnimated>
          </div>

          {/* Illustration sitting on the footer separator */}
          <div className="w-full relative z-0">
            <NotFoundIllustration className="w-full h-auto object-bottom mx-auto" />
          </div>
        </div>
      </div>
    </main>
  );
}
