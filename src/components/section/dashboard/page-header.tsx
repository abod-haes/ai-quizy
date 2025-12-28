"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/providers/TranslationsProvider";
import { formatEntityName } from "@/utils/format";

type PageHeaderProps = {
  title: string;
  description?: string;
  entityName: string;
  onCreateClick: () => void;
  createButtonLabel?: string;
  className?: string;
};

export function PageHeader({
  title,
  description,
  entityName,
  onCreateClick,
  className,
}: PageHeaderProps) {
  const t = useTranslation();
  const buttonLabel = formatEntityName(
    entityName,
    t.dashboard.common.addEntity,
  );

  return (
    <div
      className={cn(
        "bg-sidebar border-border flex items-end justify-between rounded-lg border p-5",
        className,
      )}
    >
      <div className="flex flex-col">
        <h1 className="mb-2 text-2xl font-semibold">{title}</h1>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>

      <Button variant="ghost" onClick={onCreateClick} aria-label={buttonLabel}>
        <Plus className="h-4 w-4" />
        {buttonLabel}
      </Button>
    </div>
  );
}
