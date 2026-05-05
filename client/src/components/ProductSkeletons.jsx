const shimmer = "animate-pulse rounded-2xl bg-secondary";

export const ProductCardSkeleton = () => (
  <div className="space-y-4">
    <div className={`aspect-[4/5] ${shimmer}`} />
    <div className="space-y-2">
      <div className="h-3 w-20 animate-pulse rounded bg-secondary" />
      <div className="h-6 w-4/5 animate-pulse rounded bg-secondary" />
      <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
      <div className="h-5 w-28 animate-pulse rounded bg-secondary" />
    </div>
  </div>
);

export const ProductCardSkeletonGrid = ({ count = 4, className = "grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 lg:grid-cols-4" }) => (
  <div className={className}>
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

export const ProductSectionSkeleton = ({ title = "Loading products", eyebrow = "Please wait" }) => (
  <section className="py-20 lg:py-28">
    <div className="container-luxe">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
          <h2 className="font-display text-4xl md:text-5xl">{title}</h2>
        </div>
      </div>
      <ProductCardSkeletonGrid />
    </div>
  </section>
);

export const CategoryGridSkeleton = ({ count = 6 }) => (
  <div className="container-luxe grid grid-cols-1 gap-6 py-16 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className={`aspect-[4/3] ${shimmer}`} />
    ))}
  </div>
);

export const ProductListSkeleton = ({ count = 6 }) => (
  <div className="space-y-6">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="grid grid-cols-[140px_1fr] gap-6 border-b border-border pb-6 md:grid-cols-[220px_1fr]">
        <div className="aspect-square animate-pulse rounded-xl bg-secondary" />
        <div className="space-y-3 py-1">
          <div className="h-3 w-20 animate-pulse rounded bg-secondary" />
          <div className="h-8 w-2/3 animate-pulse rounded bg-secondary" />
          <div className="h-4 w-full animate-pulse rounded bg-secondary" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
          <div className="h-6 w-24 animate-pulse rounded bg-secondary" />
        </div>
      </div>
    ))}
  </div>
);

export const ProductDetailsSkeleton = () => (
  <div className="container-luxe py-16">
    <div className="mb-6 h-4 w-56 animate-pulse rounded bg-secondary" />
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="grid grid-cols-[80px_1fr] gap-4">
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-square animate-pulse rounded-lg bg-secondary" />
          ))}
        </div>
        <div className="aspect-square animate-pulse rounded-2xl bg-secondary" />
      </div>
      <div className="space-y-5">
        <div className="h-3 w-24 animate-pulse rounded bg-secondary" />
        <div className="h-14 w-4/5 animate-pulse rounded bg-secondary" />
        <div className="h-5 w-40 animate-pulse rounded bg-secondary" />
        <div className="h-10 w-36 animate-pulse rounded bg-secondary" />
        <div className="h-20 w-full animate-pulse rounded-2xl bg-secondary" />
        <div className="h-16 w-full animate-pulse rounded-2xl bg-secondary" />
        <div className="h-14 w-full animate-pulse rounded-full bg-secondary" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-20 animate-pulse rounded-2xl bg-secondary" />
          ))}
        </div>
      </div>
    </div>
  </div>
);
