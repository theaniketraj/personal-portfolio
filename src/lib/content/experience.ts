import { Experience } from "./types";

export const experienceData: Experience[] = [
  {
    icon: "Code",
    role: "Lead Developer - LEXUM",
    location: "Open Source",
    startYear: "2026",
    endYear: "Present",
    bulletPoints: [
      "Designing deterministic, declarative systems programming language for building reliable, long-lived distributed systems.",
      "Scaling it to distributed consensus from single node.",
    ],
  },
  {
    icon: "Sparkles",
    role: "IoT & Systems Developer - Plastecure",
    location: "DIATM",
    startYear: "2024",
    endYear: "2025",
    bulletPoints: [
      "Designed a smart plastic waste management system using ESP32, sensors & Supabase",
      "Plastecure won 1st Place Excellence Award in collaborative Technical Project among 75+ teams",
      "Built real-time dashboard for waste tracking and automated alerts",
    ],
  },
];

export function getExperience(): Experience[] {
  return experienceData;
}
