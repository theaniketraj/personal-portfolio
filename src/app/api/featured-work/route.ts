import { NextResponse } from "next/server";

const featureWork = [
  {
    title: "Lexum - Deterministic control for distributed systems.",
    description:
      "A deterministic, declarative systems programming language for building reliable, long-lived distributed systems.",
    roles: ["Rust", "Compiler & Runtime Design", "Distributed Systems"],
    image: "/images/feature-work/feature-img-1.png",
    slug: "lexum",
  },
  {
    title: "Plastecure - Smart Plastic Waste Management System",
    description:
      "IoT-powered plastic recycling solution integrating ESP32 microcontrollers, sensors, and Supabase cloud storage to automate plastic waste segregation.",
    roles: ["C", "C++", "Python", "IoT & ESP32", "Supabase"],
    image: "/images/feature-work/feature-img-2.png",
    slug: "plastecure",
  },
];

export const GET = async () => {
  return NextResponse.json({
    featureWork,
  });
};
