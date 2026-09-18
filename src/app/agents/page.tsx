import { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { HardwareAnimated } from "@/components/animations/hardware-animated";
import { WebMCPStatusBadge } from "@/components/agents/webmcp-status-badge";
import {
  Lock,
  ShieldCheck,
  Database,
  Zap,
  FileText,
  Server,
  Code2,
  Plug,
  AppWindow,
  Bot,
  ArrowUpRight,
} from "lucide-react";
import "@/lib/webmcp/actions";

export const metadata: Metadata = {
  title: "Agent Portal | Aniket Raj's Portfolio",
  description:
    "WebMCP developer portal for AI agents to interact with my portfolio.",
};

export default function AgentsPage() {
  return (
    <main className="overflow-x-hidden w-full">
      <section className="bg-[url('/images/blog-detail/blog-detail-bg.svg')] dark:bg-[url('/images/blog-detail/blog-detail-bg-dark.svg')] bg-cover bg-center bg-no-repeat min-h-screen">
        <div className="container">
          <div className="border-x border-primary/10">
            {/* Hero Section */}
            <div className="max-w-5xl mx-auto px-4 sm:px-7 pt-12 md:pt-20 pb-16 text-center">
              <HardwareAnimated animation="slideInUp">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <Breadcrumb
                    backHref="/"
                    backLabel="Home"
                    items={[{ label: "Agent Portal" }]}
                  />
                  <WebMCPStatusBadge />
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter mb-6 font-(family-name:--font-space-grotesk)">
                  <span className="bg-[linear-gradient(96.09deg,#9282F8_12.17%,#F3CA4D_90.71%)] bg-clip-text text-transparent">
                    Agent Portal
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-secondary leading-relaxed font-(family-name:--font-space-grotesk) max-w-3xl mx-auto">
                  This portfolio exposes an interface for AI agents. Compatible
                  agents can discover my projects, retrieve structured
                  information, explore my writing, and prepare actions without
                  navigating the site like a human.
                </p>
              </HardwareAnimated>
            </div>

            {/* The Idea & One Website. Two Interfaces */}
            <div className="border-t border-primary/10">
              <div className="max-w-5xl mx-auto px-4 sm:px-7 py-10 md:py-16">
                <HardwareAnimated animation="slideInUp" delay={0.2}>
                  <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary font-(family-name:--font-space-grotesk) mb-4">
                      The Idea
                    </h2>
                    <p className="text-lg text-secondary max-w-lg mx-auto leading-relaxed">
                      A website shouldn&apos;t need to be reverse-engineered by
                      an agent. Humans interpret interfaces visually. Agents
                      should be able to interact with explicit capabilities.
                    </p>
                  </div>
                </HardwareAnimated>
              </div>
            </div>

            {/* One Website. Two Interfaces */}
            <div className="border-t border-primary/10">
              <div className="max-w-5xl mx-auto px-4 sm:px-7 py-10 md:py-16">
                <HardwareAnimated animation="fadeInScale" delay={0.3}>
                  <div className="w-full max-w-5xl mx-auto py-4">
                    <div className="flex flex-col md:flex-row w-full justify-between items-center md:items-start gap-12 md:gap-0">
                      {/* Human Column */}
                      <div className="flex-1 flex flex-col z-10 items-center md:items-start text-center md:text-left">
                        <h3 className="text-3xl font-bold text-primary font-(family-name:--font-space-grotesk) h-9 flex items-center justify-center md:justify-start w-full md:w-auto mb-8">
                          Human
                        </h3>
                        <div className="flex flex-col gap-8 w-full items-center md:items-start">
                          {[
                            "Visual navigation",
                            "Projects",
                            "Articles",
                            "Forms",
                          ].map((item) => (
                            <div
                              key={item}
                              className="flex w-full items-center justify-center md:justify-start h-7 group"
                            >
                              <span className="whitespace-nowrap text-lg font-medium text-secondary group-hover:text-primary transition-colors">
                                {item}
                              </span>
                              <div className="hidden md:block flex-1 h-px bg-primary/20 ml-4 relative group-hover:bg-primary/40 transition-colors">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary/60 transition-colors"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Center Column with SVG Curves (Desktop) */}
                      <div className="hidden md:flex flex-col items-center justify-center relative w-[320px] h-52 shrink-0 mt-17 z-10">
                        <svg
                          className="absolute inset-0 w-full h-full pointer-events-none"
                          viewBox="0 0 320 208"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {/* Left to Center paths */}
                          <path
                            d="M 0 14 C 80 14, 80 104, 160 104"
                            stroke="currentColor"
                            className="text-primary/20"
                            strokeWidth="1"
                          />
                          <path
                            d="M 0 74 C 80 74, 80 104, 160 104"
                            stroke="currentColor"
                            className="text-primary/20"
                            strokeWidth="1"
                          />
                          <path
                            d="M 0 134 C 80 134, 80 104, 160 104"
                            stroke="currentColor"
                            className="text-primary/20"
                            strokeWidth="1"
                          />
                          <path
                            d="M 0 194 C 80 194, 80 104, 160 104"
                            stroke="currentColor"
                            className="text-primary/20"
                            strokeWidth="1"
                          />

                          {/* Right to Center paths */}
                          <path
                            d="M 320 14 C 240 14, 240 104, 160 104"
                            stroke="currentColor"
                            className="text-primary/20"
                            strokeWidth="1"
                          />
                          <path
                            d="M 320 74 C 240 74, 240 104, 160 104"
                            stroke="currentColor"
                            className="text-primary/20"
                            strokeWidth="1"
                          />
                          <path
                            d="M 320 134 C 240 134, 240 104, 160 104"
                            stroke="currentColor"
                            className="text-primary/20"
                            strokeWidth="1"
                          />
                          <path
                            d="M 320 194 C 240 194, 240 104, 160 104"
                            stroke="currentColor"
                            className="text-primary/20"
                            strokeWidth="1"
                          />
                        </svg>

                        {/* Pill */}
                        <div className="bg-background border border-primary/20 px-6 py-3 rounded-full text-sm font-mono text-primary/80 z-10 shadow-sm relative">
                          SAME CONTENT MODEL
                        </div>
                      </div>

                      {/* Mobile Pill */}
                      <div className="md:hidden flex flex-col items-center justify-center relative py-12 w-full">
                        <div className="absolute top-0 bottom-0 w-px bg-primary/20"></div>
                        <div className="bg-background border border-primary/20 px-6 py-3 rounded-full text-sm font-mono text-primary/80 z-10 shadow-sm relative">
                          SAME CONTENT MODEL
                        </div>
                      </div>

                      {/* Agent Column */}
                      <div className="flex-1 flex flex-col z-10 items-center md:items-end text-center md:text-right">
                        <h3 className="text-3xl font-bold text-primary font-(family-name:--font-space-grotesk) h-9 flex items-center justify-center md:justify-end w-full md:w-auto mb-8">
                          Agent
                        </h3>
                        <div className="flex flex-col gap-8 w-full items-center md:items-end">
                          {[
                            "Structured tools",
                            "Project discovery",
                            "Content retrieval",
                            "Supported actions",
                          ].map((item) => (
                            <div
                              key={item}
                              className="flex w-full items-center justify-center md:justify-start h-7 group"
                            >
                              <div className="hidden md:block flex-1 h-px bg-primary/20 mr-4 relative group-hover:bg-primary/40 transition-colors">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary/60 transition-colors"></div>
                              </div>
                              <span className="whitespace-nowrap text-lg font-medium text-secondary group-hover:text-primary transition-colors">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </HardwareAnimated>
              </div>
            </div>

            {/* Under the Hood */}
            <div className="border-t border-primary/10">
              <div className="max-w-5xl mx-auto px-4 sm:px-7 py-12 md:py-20">
                <HardwareAnimated animation="slideInUp" delay={0.4}>
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary font-(family-name:--font-space-grotesk) text-center mb-12">
                      Under the Hood
                    </h2>

                    <div className="relative max-w-4xl mx-auto mt-16 pb-8">
                      {/* Central Glowing Spine */}
                      <div className="absolute left-1/2 top-8 bottom-8 w-0.5 bg-linear-to-b from-primary/0 via-primary/50 to-primary/0 -translate-x-1/2 z-0 shadow-[0_0_10px_rgba(var(--primary),0.5)]"></div>

                      <div className="flex flex-col gap-16 relative z-10">
                        {[
                          {
                            name: "Content",
                            icon: FileText,
                            desc: "Raw Markdown & MDX",
                          },
                          {
                            name: "Portfolio Service",
                            icon: Server,
                            desc: "React Server Components",
                          },
                          {
                            name: "Typed Definitions",
                            icon: Code2,
                            desc: "Zod schemas for tooling",
                          },
                          {
                            name: "WebMCP Adapter",
                            icon: Plug,
                            desc: "Standardized tool mapping",
                          },
                          {
                            name: "document.\u200bmodelContext",
                            icon: AppWindow,
                            desc: "DOM object injection",
                          },
                          {
                            name: "Compatible Agent",
                            icon: Bot,
                            desc: "Direct tool execution",
                          },
                        ].map((step, idx) => {
                          const isEven = idx % 2 === 0;
                          return (
                            <div
                              key={step.name}
                              className={`relative flex w-full items-center min-h-20 ${isEven ? "flex-row-reverse" : "flex-row"}`}
                            >
                              {/* Center Icon (Always Centered) */}
                              <div className="absolute left-1/2 -translate-x-1/2 shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full border-[3px] md:border-4 border-background bg-background shadow-[0_0_20px_rgba(var(--primary),0.3)] flex items-center justify-center text-primary z-10 group hover:scale-110 transition-transform duration-300">
                                <div className="absolute inset-0 bg-primary/10 rounded-full"></div>
                                <step.icon
                                  className="relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(var(--primary),0.8)] transition-all w-6 h-6 md:w-8 md:h-8"
                                  strokeWidth={1.5}
                                />
                              </div>

                              {/* Spacer for layout balance */}
                              <div className="flex-1"></div>

                              {/* Single Text Block */}
                              <div
                                className={`w-1/2 flex flex-col justify-center ${isEven ? "pr-12 md:pr-16 text-right" : "pl-12 md:pl-16 text-left"}`}
                              >
                                <h3 className="text-lg md:text-2xl font-bold text-primary font-(family-name:--font-space-grotesk) mb-1 md:mb-2 leading-tight">
                                  {step.name}
                                </h3>
                                <p className="text-xs md:text-base text-secondary font-medium leading-relaxed">
                                  {step.desc}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </HardwareAnimated>
              </div>
            </div>

            <div className="border-t border-primary/10">
              <HardwareAnimated animation="slideInUp" delay={0.2}>
                <div className="flex flex-col items-center text-center max-w-5xl mx-auto px-4 sm:px-7 py-12 md:py-16 gap-3">
                  <h2 className="text-3xl sm:text-4xl font-bold text-primary font-(family-name:--font-space-grotesk)">
                    Execution Model
                  </h2>
                  <p className="text-secondary max-w-2xl text-base leading-relaxed">
                    How agents interact with this environment.
                  </p>
                </div>
              </HardwareAnimated>

              <div className="grid grid-cols-1 md:grid-cols-2 border-t border-primary/10">
                {/* Grid Card 1 */}
                <HardwareAnimated animation="fadeInScale" delay={0.1}>
                  <div className="group flex flex-col p-6 sm:p-8 border-b border-primary/10 hover:bg-primary/5 transition-colors h-full">
                    <div className="w-10 h-10 border border-primary/10 rounded-lg flex items-center justify-center mb-5 text-primary bg-background/50">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-medium text-primary mb-2 font-(family-name:--font-space-grotesk)">
                      Read-Only by Default
                    </h3>
                    <p className="text-sm sm:text-base text-secondary leading-relaxed">
                      Most exposed tools only retrieve portfolio data. Actions
                      that modify page state are explicitly marked as
                      non-read-only and remain user-confirmed.
                    </p>
                  </div>
                </HardwareAnimated>

                {/* Grid Card 2 */}
                <HardwareAnimated animation="fadeInScale" delay={0.2}>
                  <div className="group flex flex-col p-6 sm:p-8 md:border-l md:border-primary/10 border-b border-primary/10 hover:bg-primary/5 transition-colors h-full">
                    <div className="w-10 h-10 border border-primary/10 rounded-lg flex items-center justify-center mb-5 text-primary bg-background/50">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-medium text-primary mb-2 font-(family-name:--font-space-grotesk)">
                      Runtime Validation
                    </h3>
                    <p className="text-sm sm:text-base text-secondary leading-relaxed">
                      Tool inputs are validated against strict{" "}
                      <strong>Zod schemas</strong> before execution.
                    </p>
                  </div>
                </HardwareAnimated>

                {/* Grid Card 3 */}
                <HardwareAnimated animation="fadeInScale" delay={0.3}>
                  <div className="group flex flex-col p-6 sm:p-8 border-b border-primary/10 hover:bg-primary/5 transition-colors h-full">
                    <div className="w-10 h-10 border border-primary/10 rounded-lg flex items-center justify-center mb-5 text-primary bg-background/50">
                      <Database className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-medium text-primary mb-2 font-(family-name:--font-space-grotesk)">
                      Semantic Taxonomy
                    </h3>
                    <p className="text-sm sm:text-base text-secondary leading-relaxed">
                      Data isn't just plain text. Projects and articles are
                      richly categorized by domains, capabilities, technologies,
                      and engineering areas.
                    </p>
                  </div>
                </HardwareAnimated>

                {/* Grid Card 4 */}
                <HardwareAnimated animation="fadeInScale" delay={0.4}>
                  <div className="group flex flex-col p-6 sm:p-8 md:border-l md:border-primary/10 border-b border-primary/10 hover:bg-primary/5 transition-colors h-full">
                    <div className="w-10 h-10 border border-primary/10 rounded-lg flex items-center justify-center mb-5 text-primary bg-background/50">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-medium text-primary mb-2 font-(family-name:--font-space-grotesk)">
                      Build-Time Content
                    </h3>
                    <p className="text-sm sm:text-base text-secondary leading-relaxed">
                      Portfolio metadata is derived from local content at build
                      or runtime rather than fetched from an external database,
                      allowing for exceptionally low overhead.
                    </p>
                  </div>
                </HardwareAnimated>
              </div>
            </div>

            {/* Why & Footer CTA */}
            <div className="border-t border-primary/10">
              <div className="max-w-5xl mx-auto px-4 sm:px-7 py-16 md:py-24">
                <HardwareAnimated animation="fadeInScale" delay={0.5}>
                  <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary font-(family-name:--font-space-grotesk) mb-6">
                      Why?
                    </h2>
                    <p className="text-xl text-secondary max-w-2xl mx-auto leading-relaxed mb-12">
                      The web is no longer consumed only by humans.
                      <br />
                      This portfolio should work for both.
                    </p>

                    <div className="p-8 border border-primary/10 bg-background/50 rounded-2xl max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                      <p className="text-secondary text-left text-sm sm:text-base flex-1 border-l-2 border-primary/30 pl-4">
                        WebMCP is an evolving web capability.
                        <br className="hidden sm:block" />
                        The site remains fully usable without it.
                      </p>
                      <a
                        href="https://github.com/theaniketraj/personal-portfolio/tree/main/src/lib/webmcp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 whitespace-nowrap px-6 py-3 bg-primary text-background font-medium rounded-lg hover:bg-primary/90 transition-all duration-300"
                      >
                        View implementation
                        <ArrowUpRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45 group-hover:translate-x-0.5" />
                      </a>
                    </div>
                  </div>
                </HardwareAnimated>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
