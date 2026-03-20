interface ProjectsCommandProps {
  tags: string[];
}

export default function ProjectsCommand({ tags }: ProjectsCommandProps) {
  return (
    <div className="space-y-1">
      <div>Opening Projects page...</div>
      <div className="text-[var(--terminal-secondary)]">Available tags: {tags.join(", ")}</div>
    </div>
  );
}
