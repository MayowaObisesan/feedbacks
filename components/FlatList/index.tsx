// components/FlatList/index.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";

interface FlatListProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
  ListEmptyComponent?: React.ReactNode;
  ListFooterComponent?: React.ReactNode;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  className?: string;
  contentContainerClassName?: string;
  initialNumToRender?: number;
  maxToRenderPerBatch?: number;
}

export function FlatList<T>({
  data,
  renderItem,
  keyExtractor,
  ListEmptyComponent,
  ListFooterComponent,
  onEndReached,
  onEndReachedThreshold = 0.5,
  className = "",
  contentContainerClassName = "",
  initialNumToRender = 10,
  maxToRenderPerBatch = 10,
}: FlatListProps<T>) {
  const [renderedItems, setRenderedItems] = useState<T[]>([]);
  const [visibleRange, setVisibleRange] = useState({
    start: 0,
    end: initialNumToRender,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(false);
  const loadingRef = useRef(false);

  // Initialize rendered items
  useEffect(() => {
    setRenderedItems(data.slice(0, initialNumToRender));
    setVisibleRange({ start: 0, end: initialNumToRender });
  }, [data, initialNumToRender]);

  const loadMoreItems = useCallback(() => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const currentLength = renderedItems.length;

    if (currentLength >= data.length) {
      loadingRef.current = false;

      return;
    }

    const nextItems = data.slice(
      currentLength,
      currentLength + maxToRenderPerBatch,
    );

    if (nextItems.length > 0) {
      setRenderedItems((prev) => [...prev, ...nextItems]);
      setVisibleRange((prev) => ({
        start: prev.start,
        end: prev.end + nextItems.length,
      }));
    }

    if (currentLength + nextItems.length >= data.length) {
      onEndReached?.();
    }

    loadingRef.current = false;
  }, [data, maxToRenderPerBatch, onEndReached, renderedItems.length]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    // Calculate visible range based on scroll position
    const itemHeight = 100; // Approximate height of each item
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      Math.ceil((scrollTop + clientHeight) / itemHeight),
      data.length,
    );

    setVisibleRange({ start, end });

    // Check if near bottom for infinite scroll
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const threshold = scrollHeight * onEndReachedThreshold;

    if (
      distanceFromBottom <= threshold &&
      !isNearBottom &&
      !loadingRef.current
    ) {
      setIsNearBottom(true);
      loadMoreItems();
    } else if (distanceFromBottom > threshold && isNearBottom) {
      setIsNearBottom(false);
    }
  }, [data.length, isNearBottom, loadMoreItems, onEndReachedThreshold]);

  useEffect(() => {
    const currentRef = containerRef.current;

    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial check
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  if (data.length === 0 && ListEmptyComponent) {
    return <>{ListEmptyComponent}</>;
  }

  // Only render items in the visible range
  const itemsToRender = renderedItems.slice(
    Math.max(0, visibleRange.start - maxToRenderPerBatch),
    Math.min(renderedItems.length, visibleRange.end + maxToRenderPerBatch),
  );

  return (
    <div ref={containerRef} className={`h-full overflow-y-auto ${className}`}>
      <div
        className={contentContainerClassName}
        /*style={{
          // Maintain scroll height with padding
          paddingTop: Math.max(0, visibleRange.start) * 100,
          paddingBottom:
            Math.max(0, renderedItems.length - visibleRange.end) * 100,
        }}*/
      >
        {itemsToRender.map((item) => (
          <div key={keyExtractor(item)}>{renderItem(item)}</div>
        ))}
        {ListFooterComponent}
      </div>
    </div>
  );
}
