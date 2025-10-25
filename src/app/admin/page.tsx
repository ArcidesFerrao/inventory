"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import React from "react";

export default function AdminPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session?.user.isAdmin) {
    redirect("/");
  }

  return (
    <>
      <div className="admin-header">
        <h1 className="text-4xl font-medium">Admin Dashboard</h1>
      </div>
      <div className="admin-info flex justify-between">
        <div className="admin-user flex flex-col gap-5">
          <h2 className="text-2xl font-bold underline">Users</h2>
          <div className="flex  gap-5">
            <div className="flex flex-col ">
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-normal">Total</p>
                  <h4 className="text-xl py-1 whitespace-nowrap font-bold"></h4>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-normal">Active</p>
                  <h4 className="text-xl py-1 whitespace-nowrap font-bold"></h4>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <p className="text-lg font-normal">Services</p>
                <h4 className="text-xl py-1 whitespace-nowrap font-bold"></h4>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-lg font-normal">Suppliers</p>
                <h4 className="text-xl py-1 whitespace-nowrap font-bold"></h4>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-orders flex flex-col gap-2">
          <h2 className="text-2xl font-bold underline">Orders</h2>
          <div className="flex gap-5">
            <div className="flex flex-col gap-1">
              <p className="text-lg font-normal">Total</p>
              <h4 className="text-xl py-1 whitespace-nowrap font-bold"></h4>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-normal">Delivered</p>
              <h4 className="text-xl py-1 whitespace-nowrap font-bold"></h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
