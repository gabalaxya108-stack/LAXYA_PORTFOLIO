/**
 * Portfolio Data Central Aggregator
 * Imports individual modules from src/data and provides unified backward & forward compatibility.
 */

import profile from "./profile.js";
import projects from "./projects.js";
import skillsData from "./skills.js";
import education from "./education.js";
import certifications from "./certifications.js";
import achievements from "./achievements.js";
import galleryItems from "./gallery.js";

export const portfolioData = {
  profile,
  projects,
  skills: skillsData,
  education,
  certifications,
  achievements,
  gallery: galleryItems,

  // Backward compatibility object for legacy consumers
  personalInfo: {
    fullName: profile.name,
    initials: "LG",
    eyebrow: profile.primaryPositioning.toUpperCase(),
    headline: profile.name,
    subheadline: profile.primaryPositioning,
    tagline: profile.supportingStatement,
    uid: profile.uid,
    college: profile.university,
    university: profile.university,
    degree: profile.degree,
    branch: profile.branch,
    year: profile.year,
    semester: profile.semester,
    email: profile.email,
    location: profile.location,
    avatarPlaceholder: "LG",
    avatarImage: profile.portraitPath,
    githubUrl: profile.github,
    linkedinUrl: profile.linkedin,
    leetcodeUrl: profile.leetcode,
    cgpa: profile.cgpa,
    graduation: profile.graduation
  },

  academicMetrics: [
    { label: "Cumulative CGPA", value: profile.cgpa, note: "Academic Excellence" },
    { label: "LeetCode Solved", value: profile.leetcodeProblems, note: "Algorithmic Competency", link: profile.leetcode },
    { label: "Graduation Year", value: profile.graduation, note: "Expected Completion" },
    { label: "Azure Certifications", value: `${profile.azureCertsCount}`, note: "AZ-900 & AI-900 Verified" }
  ]
};

export default portfolioData;
