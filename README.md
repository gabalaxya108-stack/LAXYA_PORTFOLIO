# Laxya Gaba — Personal Portfolio & COA Learning Platform

A premium, multi-page personal portfolio website for **Laxya Gaba**, Computer Science & Engineering (AI) student at Chandigarh University.

Designed with **Visual Direction "E"**: combining premium editorial aesthetics, modern software product identity, minimal luxury, and authentic engineering depth.

---

## 🏛️ Multi-Page Route Architecture

This is a **true multi-page application (MPA)** with 8 distinct routes:

| Route | Page | Purpose & Character |
| :--- | :--- | :--- |
| **`/`** | **Home** | Cinematic hero with Laxya's professional portrait, 8.65 CGPA, 100+ LeetCode problems, 2029 graduation, 2 Microsoft Azure certifications, featured projects, and interactive COA terminal preview. |
| **`/about/`** | **About** | Editorial bio ("Building a strong foundation in AI..."), 8 numbered areas of exploration, honest skill groups, education timeline, and personal side (*AI & Tech Explained Simply*, badminton, music, AI & geopolitics). |
| **`/projects/`** | **Projects** | Dedicated editorial project index featuring CREST, AI Resume Analyzer, NeuroVision AI, ParakhAI, IP Shakti Sahayak, and SAAR with architecture blueprints and GitHub repositories. |
| **`/coa/`** | **COA Lab** | Dual-tool educational software platform: (1) **Number System Converter** (12-way cross-radix converter with dynamic division proofs & reference table), and (2) **CPU Instruction Simulator** based on [SIMULATOR](https://github.com/gabalaxya108-stack/SIMULATOR) (expression validator, infix-to-postfix, code generation & execution trace for 3, 2, 1, and 0-Address architectures). |
| **`/gallery/`** | **Gallery** | Curated editorial milestones, hackathons, and certifications (AZ-900, AI-900, IDEA 2.0) with interactive category filters and modal inspection. |
| **`/resume/`** | **Resume** | Clean web-first CV and direct one-click download of Laxya's official PDF resume (`/documents/laxya_gaba_resume.pdf`). |
| **`/document/`** | **Document** | Dedicated PDF reading environment displaying Laxya's submitted Computer Organisation and Architecture assignment (UID: 25BAI10005, Section: 25BAI-601 to Dr. Ruchika Gupta on 06 Aug 2026 covering 12 core topics). |
| **`/contact/`** | **Contact** | Direct communication channels (`gabalaxya002@gmail.com`, GitHub, LinkedIn, Mohali), copy-to-clipboard trigger, and structured email dispatch form. |

---

## ✏️ How to Update My Portfolio

To update any content on this portfolio, edit the centralized data files inside `src/data/`. **You do not need to modify HTML or component templates directly.**

### 1. Personal Information & Positioning
Edit [`src/data/profile.js`](src/data/profile.js):
- Name, UID, institution, degree, semester, expected graduation year
- Email, GitHub URL, LinkedIn URL, location
- Hero statement, headline, and bio snippets

### 2. Projects & Systems
Edit [`src/data/projects.js`](src/data/projects.js):
To add a new project, insert an object into the `projects` array:
```javascript
{
  id: "project-slug",
  number: "04",
  name: "Project Title",
  subtitle: "One-line technical summary",
  category: "AI / Systems",
  technologies: ["Python", "PyTorch", "FastAPI"],
  status: "ACTIVE",
  statusType: "success",
  role: "Lead Engineer",
  keyContribution: "Core algorithm or architectural contribution",
  description: "Detailed description of the problem solved and system architecture.",
  highlight: "Hackathon win / Benchmark metric / Paper",
  github: "https://github.com/gabalaxya108-stack/your-repo",
  featured: true
}
```

### 3. Skills & Interests
Edit [`src/data/skills.js`](src/data/skills.js):
- Add or modify items in `programming`, `core`, and `toolsAndPlatforms`.
- Adjust numbered areas of interest in `interests`.
- Update personal initiatives and hobbies in `personalSide`.

### 4. Education History
Edit [`src/data/education.js`](src/data/education.js):
- Update degree status, terms, CGPA, or marks.

### 5. Certifications
Edit [`src/data/certifications.js`](src/data/certifications.js):
- Add new Microsoft, cloud, or algorithmic certifications.

### 6. Achievements & Honors
Edit [`src/data/achievements.js`](src/data/achievements.js):
- Add new hackathons, competitive programming milestones, or initiatives.

### 7. Gallery Items & Photos
Edit [`src/data/gallery.js`](src/data/gallery.js):
1. Place your photo or certificate graphic into `public/assets/your_image.jpg`.
2. Add an entry to `galleryItems`:
```javascript
{
  id: "gal-new",
  title: "Achievement Title",
  category: "Achievements", // 'Achievements' | 'Certificates' | 'Projects' | 'Academic' | 'Personal'
  categoryBadge: "Hackathon",
  year: "2026",
  description: "Short description of the milestone.",
  image: "/assets/your_image.jpg", // null uses the premium SVG vector placeholder
  aspect: "landscape",
  featured: true
}
```

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Access in browser
# http://127.0.0.1:5173/
```

## 📦 Building for Production

```bash
npm run build
```

The production bundle builds into `dist/` with all 8 HTML entry points ready for deployment to Vercel, Netlify, or GitHub Pages.

---

## 👤 Verified Student Identity
- **Name:** Laxya Gaba
- **UID:** 25BAI10005
- **University:** Chandigarh University
- **Branch:** Computer Science & Engineering (AI)
- **Term:** 2nd Year · 3rd Semester
- **Expected Graduation:** 2029
- **CGPA:** 8.65
- **Email:** `gabalaxya002@gmail.com`
- **GitHub:** `https://github.com/gabalaxya108-stack`
- **LinkedIn:** `https://www.linkedin.com/in/laxya-gaba-36b570376/`
