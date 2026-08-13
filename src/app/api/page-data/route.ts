import { NextResponse } from "next/server";

const experienceData = [
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

const educationData = [
  {
    date: "2022 - 2026",
    title: "B. Tech in Computer Science & Engineering",
    subtitle: "Durgapur Institute of Advanced Technology and Management",
  },
  {
    date: "2020 - 2022",
    title: "Intermediate, Science",
    subtitle: "Bhagwat Vidyapeeth, Chapra",
  },
  {
    date: "2018 - 2020",
    title: "Matriculation, Science",
    subtitle: "Bhagwat Vidyapeeth, Chapra",
  },
];

const projectOverview = {
  projects: [
    {
      name: "LAWGIC - AI Powered Legal Research Assistant",
      url: "/projects/lawgic",
    },
    {
      name: "Plastecure - Smart Plastic Waste Management System",
      url: "/projects/plastecure",
    },
  ],
  blogs: [
    {
      name: "REST vs GraphQL: Which API Style Should You Use and When?",
      url: "/blog/rest-vs-graphql",
    },
    {
      name: "Kotlin MVVM: Clean Architecture in Android",
      url: "/blog/kotlin-mvvm-clean-architecture",
    },
  ],
};

export const GET = async () => {
  return NextResponse.json({
    experienceData,
    educationData,
    projectOverview,
  });
};
