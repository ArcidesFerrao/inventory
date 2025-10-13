"use client";

import { registerService, registerSupplier } from "@/app/actions/register";
import { serviceSchema, supplierSchema } from "@/schemas/roleSchema";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { signIn } from "next-auth/react";
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

  const handleWebsiteOnChange = (e: { target: { value: string } }) => {
    let value = e.target.value.trim();

    if (value) {
      if (!value.match(/^https?:\/\//i)) {
        value = `https://${value}`;
      }
    }

    setWebsite(value);
  };
  useEffect(() => {
    if (state?.status === "success") {
      toast.success("Service Registered Successfully!");
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
            <option value="STORE">Store</option>
            <option value="SUPERMARKET">Super Market</option>
            <option value="RETAIL">Retail</option>
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
            onChange={handleWebsiteOnChange}
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
      <button
        type="submit"
        disabled={isPending}
        className="submit-button border px-4 py-2 rounded mt-4"
      >
        {isPending ? "..." : "Register"}
      </button>
    </form>
  );
};

export const SupplierRegisterForm = () => {
  const [state, action, isPending] = useActionState(
    registerSupplier,
    undefined
  );
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: supplierSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onSubmit",
  });
  const router = useRouter();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [establishedYear, setEstablishedYear] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleWebsiteOnChange = (e: { target: { value: string } }) => {
    let value = e.target.value.trim();

    if (value) {
      if (!value.match(/^https?:\/\//i)) {
        value = `https://${value}`;
      }
    }

    setWebsite(value);
  };

  useEffect(() => {
    if (state?.status === "success") {
      toast.success("Supplier Registered Successfully!");

      signIn("credentials", { redirect: false });

      router.push("/supply");
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
          <label>Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {fields.name.allErrors && <p>{fields.name.errors}</p>}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          <label>Email</label>
          <input
            type="text"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {fields.email.allErrors && <p>{fields.email.errors}</p>}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        {fields.phone.allErrors && <p>{fields.phone.errors}</p>}
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex justify-between items-center">
          <label>Address</label>
          <input
            type="text"
            name="address"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        {fields.address.allErrors && <p>{fields.address.errors}</p>}
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
          <label>Website</label>
          <input
            type="text"
            name="website"
            id="website"
            value={website}
            onChange={handleWebsiteOnChange}
          />
        </div>
        {fields.website.allErrors && <p>{fields.website.errors}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <label>Established Year</label>
          <input
            type="number"
            name="establishedYear"
            id="establishedYear"
            value={establishedYear}
            onChange={(e) => setEstablishedYear(e.target.value)}
            required
          />
        </div>
        {fields.establishedYear.allErrors && (
          <p>{fields.establishedYear.errors}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="submit-button border px-4 py-2 rounded mt-4"
      >
        {isPending ? "..." : "Register"}
      </button>
    </form>
  );
};
