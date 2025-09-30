"use client";

import { registerService } from "@/app/actions/register";
import { serviceSchema } from "@/schemas/roleSchema";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { useRouter } from "next/navigation";
import React, { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const ServiceRegisterForm = () => {
  const [state, action, isPending] = useActionState(registerService, undefined);
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: serviceSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onSubmit",
  });
  const router = useRouter();

  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [operationStart, setOperationStart] = useState("");
  const [operationEnd, setOperationEnd] = useState("");
  const [businessType, setBusinessType] = useState("");

  useEffect(() => {
    if (state?.status === "success") {
      toast.success("Registered successfully!");
      router.push("/service");
    }
  }, [state, router]);

  return (
    <form
      id={form.id}
      action={action}
      onSubmit={form.onSubmit}
      className="flex flex-col gap-2 min-w-96"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          <label>Business Name</label>
          <input
            type="text"
            name="businessName"
            id="businessName"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>
        {fields.businessName.allErrors && <p>{fields.businessName.errors}</p>}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          <label>Location</label>
          <input
            type="text"
            name="location"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        {fields.location.allErrors && <p>{fields.location.errors}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <label>Description</label>
          <textarea
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {fields.description.allErrors && <p>{fields.description.errors}</p>}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          <label>Business Type</label>
          <select
            name="businessType"
            id="businessType"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
          >
            <option value="RESTAURANT">Restaurant</option>
            <option value="SHOP">Shop</option>
            <option value="TAKEAWAY">Take Away</option>
          </select>
        </div>
        {fields.businessType.allErrors && <p>{fields.businessType.errors}</p>}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          <label>Website</label>
          <input
            type="text"
            name="website"
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        {fields.website.allErrors && <p>{fields.website.errors}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <label>Operation Hours</label>
          <div className="flex gap-2 items-center">
            <input
              type="time"
              name="operationStart"
              id="operationStart"
              value={operationStart}
              onChange={(e) => setOperationStart(e.target.value)}
              required
            />
            -
            <input
              type="time"
              name="operationEnd"
              id="operationEnd"
              value={operationEnd}
              onChange={(e) => setOperationEnd(e.target.value)}
              required
            />
          </div>
          <input
            type="hidden"
            name="operationHours"
            id="operationHours"
            value={`${operationStart} - ${operationEnd}`}
          />
        </div>
        {fields.operationHours.allErrors && (
          <p>{fields.operationHours.errors}</p>
        )}
      </div>
      <button type="submit" disabled={isPending} className="submit-button">
        {isPending ? "..." : "Register"}
      </button>
    </form>
  );
};

export const SupplierRegisterForm = () => {
  const [state, action, isPending] = useActionState(registerService, undefined);
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: serviceSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onSubmit",
  });
  const router = useRouter();

  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [operationStart, setOperationStart] = useState("");
  const [operationEnd, setOperationEnd] = useState("");
  const [businessType, setBusinessType] = useState("");

  useEffect(() => {
    if (state?.status === "success") {
      toast.success("Registered successfully!");
      router.push("/service");
    }
  }, [state, router]);

  return (
    <form
      id={form.id}
      action={action}
      onSubmit={form.onSubmit}
      className="flex flex-col gap-2 min-w-96"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          <label>Business Name</label>
          <input
            type="text"
            name="businessName"
            id="businessName"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>
        {fields.businessName.allErrors && <p>{fields.businessName.errors}</p>}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          <label>Location</label>
          <input
            type="text"
            name="location"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        {fields.location.allErrors && <p>{fields.location.errors}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <label>Description</label>
          <textarea
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {fields.description.allErrors && <p>{fields.description.errors}</p>}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          <label>Business Type</label>
          <select
            name="businessType"
            id="businessType"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
          >
            <option value="RESTAURANT">Restaurant</option>
            <option value="SHOP">Shop</option>
            <option value="TAKEAWAY">Take Away</option>
          </select>
        </div>
        {fields.businessType.allErrors && <p>{fields.businessType.errors}</p>}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          <label>Website</label>
          <input
            type="text"
            name="website"
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>
        {fields.website.allErrors && <p>{fields.website.errors}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <label>Operation Hours</label>
          <div className="flex gap-2 items-center">
            <input
              type="time"
              name="operationStart"
              id="operationStart"
              value={operationStart}
              onChange={(e) => setOperationStart(e.target.value)}
              required
            />
            -
            <input
              type="time"
              name="operationEnd"
              id="operationEnd"
              value={operationEnd}
              onChange={(e) => setOperationEnd(e.target.value)}
              required
            />
          </div>
          <input
            type="hidden"
            name="operationHours"
            id="operationHours"
            value={`${operationStart} - ${operationEnd}`}
          />
        </div>
        {fields.operationHours.allErrors && (
          <p>{fields.operationHours.errors}</p>
        )}
      </div>
      <button type="submit" disabled={isPending} className="submit-button">
        {isPending ? "..." : "Register"}
      </button>
    </form>
  );
};
