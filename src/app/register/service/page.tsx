import { ServiceRegisterForm } from "@/components/RegisterForm";
import React from "react";

export default function ServiceRegisterPage() {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-2xl font-medium">Service Register</h2>
      <ServiceRegisterForm />
    </div>
  );
}
