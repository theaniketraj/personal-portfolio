import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HardwareAnimated } from "@/components/animations/hardware-animated";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="container flex-1 flex flex-col">
        <div className="border-x border-primary/10 flex-1 flex items-center justify-center py-20 md:py-32 relative overflow-hidden">
          {/* Background Glow Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />

          <div className="max-w-2xl mx-auto px-4 sm:px-7 text-center">
            <HardwareAnimated animation="slideInUp">
              <h1 className="text-8xl md:text-9xl font-bold tracking-tighter bg-[linear-gradient(96.09deg,#9282F8_12.17%,#F3CA4D_90.71%)] bg-clip-text text-transparent drop-shadow-sm">
                404
              </h1>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-6 mb-4">
                Page Not Found
              </h2>
              <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-10">
                Oops! It seems you&apos;ve ventured into the unknown. The page
                you&apos;re looking for doesn&apos;t exist or has been moved to
                a new URL.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full px-8 h-12 text-base font-semibold"
                >
                  <Link href="/">Return Home</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 h-12 text-base font-semibold border-primary/20 hover:bg-primary/5"
                >
                  <Link href="/projects">View Projects</Link>
                </Button>
              </div>
            </HardwareAnimated>
          </div>
        </div>
      </div>
    </main>
  );
}
