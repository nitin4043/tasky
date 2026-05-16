"use client";

import { useState } from "react";
import CreateProjectModal from "../projects/CreateProjectModal";

type ApiProject = {
  _id: string;
  name: string;
  description?: string;
  userRole?: "ADMIN" | "MEMBER";
};

type ProjectsClientProps = {
  projects: ApiProject[];
};

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* ✅ Modal — state yahan manage hoti hai */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm">
        {/* Header with working button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Portfolio
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">
              Active projects
            </h2>
          </div>
          {/* ✅ onClick connected — button actually works ab */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition"
          >
            + New project
          </button>
        </div>

        {/* Projects list */}
        {projects.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-slate-200 bg-white/70 p-8 text-center">
            <p className="text-lg font-semibold text-slate-900">
              No projects yet
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Create your first project to start tracking tasks and milestones.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 rounded-full bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
            >
              Create project
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <a
                key={project._id}
                href={`/projects/${project._id}`}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:border-indigo-200 hover:bg-indigo-50"
              >
                <div className="flex items-center justify-between">
                  {/* ✅ project.name (not project.title) */}
                  <h3 className="text-lg font-semibold text-slate-900">
                    {project.name}
                  </h3>
                  {/* ✅ Role badge */}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      project.userRole === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {project.userRole ?? "MEMBER"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {project.description || "No description added yet."}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>Click to view tasks</span>
                  <span className="font-semibold text-amber-600">
                    Open →
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
