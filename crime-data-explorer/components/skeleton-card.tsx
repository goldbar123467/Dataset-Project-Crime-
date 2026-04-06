import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
          <div className="h-40 w-full animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonChart() {
  return <div className="h-[400px] w-full animate-pulse rounded-lg bg-muted" />;
}

export function SkeletonTable() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 w-full animate-pulse rounded bg-muted" />
      ))}
    </div>
  );
}
