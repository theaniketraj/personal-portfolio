export interface Profile {
  name: string;
  role: string;
  focus: string[];
  location: string;
  resumeUrl: string;
  links: {
    github: string;
    linkedin: string;
    twitter?: string;
  };
}

export const profileData: Profile = {
  name: "Aniket Raj",
  role: "Software Engineer",
  focus: ["systems", "AI", "developer tooling"],
  location: "India",
  resumeUrl: "/resume.pdf",
  links: {
    github: "https://github.com/theaniketraj",
    linkedin: "https://linkedin.com/in/theaniketraj",
  },
};

export function getProfile(): Profile {
  return profileData;
}
