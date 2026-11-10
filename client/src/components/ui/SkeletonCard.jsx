export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
      <div className="aspect-[3/4] bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-7 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-12" />
        </div>
      </div>
    </div>
  )
}

