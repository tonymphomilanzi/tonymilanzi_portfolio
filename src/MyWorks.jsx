import React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import project1 from "./assets/1.jpg";
import project2 from "./assets/shooped-1.png";
import project5 from "./assets/MOVIE_1.jpg";
import project4 from "./assets/elision.jpg";
import project3 from "./assets/smartpay1.jpg";



const projects = [
  {
    title: "FileFlow",
    description: "A modern free browser based media conversion tool.",
    tech: ["React", "Node.js", "FFmpeg", "Tailwind"],
    image: project1,
  },
  {
    title: "Shopped",
    description: "Android E-cormmerce app.",
    tech: ["Flutter", "Firebase"],
    image: project2,
  },
  {
    title: "SmartPay",
    description: "SmartPay landing page.",
    tech: ["React", "GSAP", "Vercel","Tailwind"],
    image: project3,
  },
   {
    title: "Elision Ai",
    description: "Elision Ai landing page.",
    tech: ["React", "GSAP", "Vercel","Tailwind"],
    image: project4,
  },
  {
    title: "Movie Nest",
    description: "Discover, latest and trending movies.",
    tech: ["React", "GSAP", "Vercel","Tailwind","TMDB Api"],
    image: project5,
  },
];

export default function MyWorks() {
  useGSAP(() => {
    gsap.fromTo(
      ".work-card",
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
      }
    );
  }, []);

  return (
    <section className="min-h-screen py-20 px-6 text-white">
      <div className="text-center mb-12">
        <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-gray-900 text-transparent bg-clip-text">
         Selected Works
        </h2>
        <p className="text-gray-400 mt-3 max-w-xl mx-auto">
          A selection of projects I’ve built—focusing on clean design,
          performance, and great user experience.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
        {projects.map((project, index) => (
          <div
            key={index}
            className="work-card  overflow-hidden shadow-lg bg-gray-900 hover:shadow-yellow-400/20 transition-shadow duration-300"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-300">
                {project.title}
              </h3>
              <p className="text-gray-400 text-sm mt-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tech.map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full bg-gray-800 text-lime-300 border border-lime-500/30"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
