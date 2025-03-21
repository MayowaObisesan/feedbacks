import React, { useEffect, useRef } from "react";
import { cn } from "@heroui/theme";

interface InfiniteFlatListProps<T> {
  renderedData: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T, index?: number) => string;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  className?: string;
  contentContainerClassName?: string;
  ListEmptyComponent?: React.ReactNode;
  ListFooterComponent?: React.ReactNode;
  loading?: boolean;
}

export function InfiniteFlatList<T>({
  renderedData,
  renderItem,
  keyExtractor,
  onEndReached,
  onEndReachedThreshold = 0.5,
  className = "",
  contentContainerClassName = "",
  ListEmptyComponent,
  ListFooterComponent,
  loading = false,
}: InfiniteFlatListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  /*const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const threshold = scrollHeight * onEndReachedThreshold;

    if (scrollHeight - scrollTop - clientHeight <= threshold) {
      onEndReached?.();
      console.log("on end reached", threshold);
    }
  }, [onEndReached, onEndReachedThreshold]);

  useEffect(() => {
    const ref = containerRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (ref) {
        ref.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);*/

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          onEndReached?.();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [onEndReached, loading]);

  if (renderedData.length === 0 && ListEmptyComponent) {
    return <>{ListEmptyComponent}</>;
  }

  return (
    <div ref={containerRef} className={cn("h-full overflow-y-auto", className)}>
      <div className={contentContainerClassName}>
        {renderedData.map((item, index) => (
          <div key={keyExtractor(item, index)}>{renderItem(item)}</div>
        ))}
        <div ref={loadMoreRef}>
          {loading && (
            <div className="p-4 text-center">
              <p>Loading more...</p>
            </div>
          )}
          {ListFooterComponent}
        </div>
      </div>
    </div>
  );
}

// import React, { useState, useEffect, useRef, useCallback } from "react";
//
// interface InfiniteFlatListProps<T> {
//   data: T[];
//   renderItem: (item: T) => React.ReactNode;
//   keyExtractor: (item: T) => string;
//   initialBatchCount?: number;
//   batchCount?: number;
//   onEndReached?: () => void;
//   onEndReachedThreshold?: number;
//   className?: string;
//   contentContainerClassName?: string;
//   ListEmptyComponent?: React.ReactNode;
//   ListFooterComponent?: React.ReactNode;
// }
//
// export function InfiniteFlatList<T>({
//   data,
//   renderItem,
//   keyExtractor,
//   ListEmptyComponent,
//   ListFooterComponent,
//   initialBatchCount = 10,
//   batchCount = 10,
//   onEndReached,
//   onEndReachedThreshold = 0.5,
//   className = "",
//   contentContainerClassName = "",
// }: InfiniteFlatListProps<T>) {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const [renderedData, setRenderedData] = useState<T[]>([]);
//   const [currentIndex, setCurrentIndex] = useState<number>(0);
//   const [loading, setLoading] = useState<boolean>(false);
//
//   const loadMoreData = useCallback(() => {
//     if (loading) return;
//     setLoading(true);
//
//     const nextIndex = currentIndex + batchCount;
//
//     if (currentIndex < data.length) {
//       const newData = data.slice(currentIndex, nextIndex);
//
//       setRenderedData((prev) => [...prev, ...newData]);
//       setCurrentIndex(nextIndex);
//       if (nextIndex >= data.length) {
//         onEndReached?.();
//       }
//     }
//     setLoading(false);
//   }, [currentIndex, data, batchCount, onEndReached, loading]);
//
//   useEffect(() => {
//     setRenderedData(data.slice(0, initialBatchCount));
//     setCurrentIndex(initialBatchCount);
//   }, [data, initialBatchCount]);
//
//   /*useEffect(() => {
//     if (data) {
//       if (data.length === 0) {
//         setLoading(false);
//       } else {
//         setRenderedData(prev => [...prev, ...data]);
//       }
//     }
//   }, [data]);*/
//
//   const handleScroll = useCallback(() => {
//     if (!containerRef.current) return;
//     const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
//     const threshold = scrollHeight * onEndReachedThreshold;
//
//     if (scrollHeight - scrollTop - clientHeight <= threshold) {
//       loadMoreData();
//     }
//   }, [loadMoreData, onEndReachedThreshold]);
//
//   useEffect(() => {
//     const ref = containerRef.current;
//
//     if (ref) {
//       ref.addEventListener("scroll", handleScroll);
//     }
//
//     return () => {
//       if (ref) {
//         ref.removeEventListener("scroll", handleScroll);
//       }
//     };
//   }, [handleScroll]);
//
//   if (data.length === 0 && ListEmptyComponent) {
//     return <>{ListEmptyComponent}</>;
//   }
//
//   return (
//     <div ref={containerRef} className={`h-dvh overflow-y-auto bg-green-950 ${className}`}>
//       <div className={contentContainerClassName}>
//         {renderedData.map((item) => (
//           <div key={keyExtractor(item)}>{renderItem(item)}</div>
//         ))}
//         {loading && (
//           <div className="p-4 text-center">
//             <p>Loading more...</p>
//           </div>
//         )}
//         {ListFooterComponent}
//       </div>
//     </div>
//   );
// }
