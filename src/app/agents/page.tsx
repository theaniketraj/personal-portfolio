import { Metadata } from "next";
import { Breadcrumb } from "@/components/breadcrumb";
import { HardwareAnimated } from "@/components/animations/hardware-animated";
import { WebMCPStatusBadge } from "@/components/agents/webmcp-status-badge";
import { Lock, ShieldCheck, Database, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Agent Portal | Aniket Raj",
  description:
    "WebMCP developer portal for AI agents to interact with my portfolio.",
};

export default function AgentsPage() {
  return (
    <main>
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
                  This portfolio is fully machine-readable. It exposes a strict,
                  read-only <strong>WebMCP API</strong> that allows AI agents to
                  query structured metadata, search for relevant projects by
                  capabilities, and semantically understand the architecture of
                  my work.
                </p>
              </HardwareAnimated>
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
                      Read-Only Access
                    </h3>
                    <p className="text-sm sm:text-base text-secondary leading-relaxed">
                      All exposed tools are strictly <strong>read-only</strong>.
                      No mutations, state changes, or destructive actions are
                      possible via this interface.
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
                      Every tool execution intercepts inputs and strictly
                      validates them against pre-compiled{" "}
                      <strong>Zod schemas</strong> before processing.
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
                      Zero Latency
                    </h3>
                    <p className="text-sm sm:text-base text-secondary leading-relaxed">
                      All metadata is resolved and cached at build time. Tool
                      execution returns structured context to the agent with
                      near zero latency overhead.
                    </p>
                  </div>
                </HardwareAnimated>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="border-t border-primary/10">
              <div className="max-w-4xl mx-auto px-4 sm:px-7 py-16 md:py-24">
                <HardwareAnimated animation="slideInUp" delay={0.3}>
                  <div className="text-center mb-10">
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary font-(family-name:--font-space-grotesk)">
                      How to Fetch Data
                    </h2>
                  </div>

                  <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono text-sm shrink-0">
                        1
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-primary mb-1">
                          Point your AI at any page
                        </h3>
                        <p className="text-secondary text-sm leading-relaxed">
                          Simply provide the URL of this portfolio to your agent
                          (e.g. Claude, ChatGPT, or Cursor).
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono text-sm shrink-0">
                        2
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-primary mb-1">
                          Tools are auto-retrieved
                        </h3>
                        <p className="text-secondary text-sm leading-relaxed">
                          The agent will automatically read the{" "}
                          <a
                            href="/llms.txt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-violet-500 transition-colors underline underline-offset-4 font-mono text-xs"
                          >
                            llms.txt
                          </a>{" "}
                          and detect the available WebMCP tools.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-mono text-sm shrink-0">
                        3
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-primary mb-1">
                          Query with natural language
                        </h3>
                        <p className="text-secondary text-sm leading-relaxed">
                          Ask the agent to "list all React projects" or "read
                          the latest article on system design" and it will
                          instantly execute the tools to return structured JSON.
                        </p>
                      </div>
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
