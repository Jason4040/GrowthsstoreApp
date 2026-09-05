import Skeleton from "../../components/Skeleton";

const ProductCardSkeleton = ({ imgClassName = "aspect-[4/3]" }) => (
  <div className="w-full bg-white dark:bg-[#121212] rounded-sm overflow-hidden flex flex-col h-full">
    <Skeleton className={`w-full ${imgClassName}`} />
    <div className="p-4 flex flex-col gap-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

export default ProductCardSkeleton;
