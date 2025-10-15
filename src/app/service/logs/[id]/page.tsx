import React from "react";

export default function LogPage({ params }: { params: { id: string } }) {
  return <div>{params.id}</div>;
}
