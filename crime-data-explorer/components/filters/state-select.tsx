"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useCallback } from "react";

interface StateSelectProps {
  states: string[];
  param?: string;
  label?: string;
}

export function StateSelect({
  states,
  param = "states",
  label = "State",
}: StateSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selected = searchParams.get(param)?.split(",").filter(Boolean) ?? [];

  const handleAdd = useCallback(
    (value: string | null) => {
      if (!value) return;
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get(param)?.split(",").filter(Boolean) ?? [];
      if (!current.includes(value)) {
        current.push(value);
        params.set(param, current.join(","));
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }
    },
    [router, pathname, searchParams, param]
  );

  const handleRemove = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get(param)?.split(",").filter(Boolean) ?? [];
      const updated = current.filter((s) => s !== value);
      if (updated.length) {
        params.set(param, updated.join(","));
      } else {
        params.delete(param);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams, param]
  );

  return (
    <div className="space-y-2">
      <Select onValueChange={handleAdd}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent>
          {states
            .filter((s) => !selected.includes(s))
            .map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selected.map((s) => (
            <Badge key={s} variant="secondary" className="gap-1">
              {s}
              <button onClick={() => handleRemove(s)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
