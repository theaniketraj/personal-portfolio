import { Education } from "./types";

export const educationData: Education[] = [
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

export function getEducation(): Education[] {
  return educationData;
}
