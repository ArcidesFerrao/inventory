import { useParams } from "next/navigation";
import React from "react";

export default function EditProductPage() {
  const { id } = useParams();
  return (
    <div>
      <h1>Edit Product: {id}</h1>
    </div>
  );
}
