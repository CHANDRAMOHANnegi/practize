import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CodingWorkspace } from "@/features/frontend/components/coding-workspace";
import {
  frontendProblems,
  getFrontendProblem,
} from "@/features/frontend/data/problems";

type FrontendProblemPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return frontendProblems.map((problem) => ({ slug: problem.slug }));
}

export default async function FrontendProblemPage({
  params,
}: FrontendProblemPageProps) {
  const { slug } = await params;
  const problem = getFrontendProblem(slug);

  if (!problem) {
    notFound();
  }

  return (
    <>
      <div className="workspaceSubnav">
        <Link href="/frontend">
          <ArrowLeft size={16} />
          Back to problems
        </Link>
      </div>
      <CodingWorkspace problem={problem} />
    </>
  );
}

