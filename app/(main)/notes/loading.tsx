import { CardSkeleton } from "@/components/ui/Skeleton";

export default function NotesLoading() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-32 bg-parchment-dark rounded-lg animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-parchment-dark via-parchment to-parchment-dark" />
          <div className="h-4 w-48 bg-parchment-dark rounded-lg animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-parchment-dark via-parchment to-parchment-dark" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
