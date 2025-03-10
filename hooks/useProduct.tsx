"use client";

import { useState } from "react";

import { IProduct } from "@/types";

export const useProduct = (id: number) => {
  const [productData, setProductData] = useState<IProduct[]>([]);
  /*const fetchProduct = useCallback(() => {
    const brandId = Number(id);

    if (Number.isNaN(brandId)) {
      return;
    }
    const { data, isFetching, isSuccess } = useRead({
      functionName: "getAllProducts",
      args: [brandId, ""],
    });

    console.log("Fetched product data", data);

    setProductData(data);
  }, []);*/

  return { productData };
};
