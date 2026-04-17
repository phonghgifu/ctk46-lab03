import Link from "next/link";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Dự án</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="border rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 whitespace-nowrap ml-2">
                {project.date}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4 flex-1">{project.shortDescription}</p>
            
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span
                    key={t}
                    className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            
            <Link
              href={`/projects/${project.id}`}
              className="inline-block text-blue-600 text-sm hover:underline font-semibold"
            >
              Xem chi tiết →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
