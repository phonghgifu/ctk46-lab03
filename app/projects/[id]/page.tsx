import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById, projects } from "@/data/projects";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/projects"
        className="text-blue-600 hover:underline text-sm mb-6 inline-block"
      >
        ← Quay lại danh sách dự án
      </Link>

      <article>
        <h1 className="text-3xl font-bold mb-3">{project.title}</h1>
        <p className="text-sm text-gray-500 mb-4">Hoàn thành: {project.date}</p>

        <p className="text-lg text-gray-700 mb-6">{project.description}</p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Công nghệ sử dụng:</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Chi tiết dự án:</h2>
          <div className="prose max-w-none text-gray-700 whitespace-pre-line">
            {project.details}
          </div>
        </div>
      </article>
    </div>
  );
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}
