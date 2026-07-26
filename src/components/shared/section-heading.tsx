import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</span>
      )}
      <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-muted-foreground">{description}</p>}
    </div>
  );
}
