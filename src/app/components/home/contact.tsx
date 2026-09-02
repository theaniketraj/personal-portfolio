"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HardwareAnimated } from "@/components/animations/hardware-animated";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const BLOCKED_DOMAINS = new Set([
  "example.com",
  "test.com",
  "fake.com",
  "hell.com",
  "mailinator.com",
  "temp-mail.org",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "getnada.com",
  "sharklasers.com",
  "grr.la",
  "guerrillamailblock.com",
  "maildrop.cc",
  "tempmail.com",
  "temp-mail.io",
  "burnermail.io",
  "mailnesia.com",
  "emailondeck.com",
  "throwawaymail.com",
  "moakt.com",
  "mintemail.com",
  "mailcatch.com",
  "mytrashmail.com",
  "trashmail.com",
  "trashmail.me",
  "dispostable.com",
  "mail7.io",
  "mail.tm",
  "emailn.de",
  "emailfake.com",
  "crazymailing.com",
  "mohmail.com",
  "inboxes.com",
  "disposablemail.com",
  "tempr.email",
  "dropmail.me",
  "mailpoof.com",
  "wtf.com",
]);

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error" | "invalid_email"
  >("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formElement = event.currentTarget;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    const formData = new FormData(formElement);
    const formDataObject = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;

    const email = formDataObject.email?.trim().toLowerCase() || "";
    const domain = email.slice(email.lastIndexOf("@") + 1).replace(/\.$/, "");

    if (domain && BLOCKED_DOMAINS.has(domain)) {
      setSubmitStatus("invalid_email");
      setIsSubmitting(false);
      return;
    }

    try {
      const params = new URLSearchParams();

      Object.entries(formDataObject).forEach(([key, value]) => {
        params.append(key, String(value).trim());
      });

      const response = await fetch("/netlify-form.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSubmitStatus("success");
      formElement.reset();
    } catch (error) {
      console.error("Netlify form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact">
      <div className="container">
        <div className="border-x border-primary/10">
          <div className="flex flex-col max-w-3xl mx-auto px-4 sm:px-7 py-12 md:py-24">
            <HardwareAnimated animation="slideInUp">
              <div className="space-y-4 mb-12 text-center xs:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  Got an interesting project?
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg">
                  Tell me more about it. I&apos;m always open to discussing new
                  projects, creative ideas, or opportunities to be part of your
                  visions.
                </p>
              </div>

              {submitStatus === "success" ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-6">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight mb-4">
                    Thank You! 🎉
                  </h3>
                  <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                    Your message has been received! I appreciate you reaching
                    out and will get back to you within 24-48 hours.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-8">
                    <Button variant="outline" asChild className="h-12 w-full">
                      <Link href="/projects">View My Projects</Link>
                    </Button>
                    <Button variant="outline" asChild className="h-12 w-full">
                      <Link href="/blog">Read My Blog</Link>
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    onClick={() => setSubmitStatus("idle")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form
                  name="sign-up-form"
                  method="POST"
                  action="/netlify-form.html"
                  data-netlify="true"
                  data-netlify-honeypot="bot-field"
                  data-netlify-recaptcha="true"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Netlify Hidden Inputs */}
                  <input type="hidden" name="form-name" value="sign-up-form" />
                  <div hidden>
                    <input name="bot-field" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="firstName"
                        className="text-sm font-medium text-muted-foreground"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        placeholder="John"
                        className="w-full flex h-12 rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:bg-background/80"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="lastName"
                        className="text-sm font-medium text-muted-foreground"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Doe"
                        className="w-full flex h-12 rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:bg-background/80"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-sm font-medium text-muted-foreground"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="john@example.com"
                        className="w-full flex h-12 rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:bg-background/80"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="address"
                        className="text-sm font-medium text-muted-foreground"
                      >
                        Location (Optional)
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        placeholder="City, Country"
                        className="w-full flex h-12 rounded-xl border border-input bg-background/50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:bg-background/80"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      placeholder="Tell me about your project..."
                      rows={5}
                      className="w-full flex rounded-xl border border-input bg-background/50 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:bg-background/80 resize-none"
                    />
                  </div>

                  <div data-netlify-recaptcha="true" className="py-2" />

                  <div className="flex items-center gap-3 py-2">
                    <div className="relative flex h-5 w-5 items-center justify-center shrink-0">
                      <input
                        id="updatesConsent"
                        name="updatesConsent"
                        type="checkbox"
                        className="peer appearance-none h-5 w-5 rounded border border-input bg-background/50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
                      />
                      <Check
                        className="absolute inset-0 m-auto h-4 w-4 text-primary opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                        strokeWidth={3}
                      />
                    </div>
                    <label
                      htmlFor="updatesConsent"
                      className="text-sm font-medium text-muted-foreground cursor-pointer select-none"
                    >
                      Sign me up to receive updates
                    </label>
                  </div>

                  {submitStatus === "error" && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
                      Oops! There was an error sending your message. Please try
                      again.
                    </div>
                  )}

                  {submitStatus === "invalid_email" && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-500 rounded-xl text-sm">
                      Please enter a valid, genuine email address.
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 h-12 text-sm font-semibold rounded-full mt-4"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </HardwareAnimated>
          </div>
        </div>
      </div>
    </section>
  );
}
