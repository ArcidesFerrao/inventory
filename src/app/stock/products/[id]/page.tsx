"use client";

import { useParams } from "next/navigation";
import React from "react";

export default function ProductPage() {
  const { id } = useParams();
  return (
    <div>
      <h1>Product: {id}</h1>
    </div>
  );
}
