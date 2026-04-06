"use client";

import { Suspense } from "react";
import ShopContent from "./ShopContent";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}