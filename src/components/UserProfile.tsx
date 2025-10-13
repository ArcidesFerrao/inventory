"use client";

import type { UserProfile } from "@/types/types";
import React, { useState } from "react";

export default function UserProfile({ user }: { user: UserProfile }) {
  const [view, setView] = useState<"personal" | "detail" | "security">(
    "personal"
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="profile-sections">
        <button onClick={() => setView("personal")}>
          Personal Information
        </button>
        {user.Service && (
          <button onClick={() => setView("detail")}>Service Details</button>
        )}
        {user.Supplier && (
          <button onClick={() => setView("detail")}>Supplier Details</button>
        )}
        <button onClick={() => setView("security")}>Security</button>
      </div>
      {view === "personal" && (
        <div className="personal-section flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <p>Full Name</p>
            <div className="flex items-center gap-2">
              <span className="tdesign--user-filled"></span>
              <h4>{user.name}</h4>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p>Email Address</p>
            <div className="flex items-center gap-2">
              <span className="ic--round-mail"></span>
              <h4>{user.email}</h4>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p>Phone Number</p>
            <div className="flex items-center gap-2">
              <span className="solar--phone-bold"></span>
              <h4>{user.phoneNumber}</h4>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p>Member Since</p>
            <div className="flex items-center gap-2">
              <span className="formkit--date"></span>
              <h4>{user.createdAt.toLocaleDateString()}</h4>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p>Last Updated</p>
            <div className="flex items-center gap-2">
              <span className="formkit--date"></span>
              <h4>{user.updatedAt.toLocaleDateString()}</h4>
            </div>
          </div>
        </div>
      )}
      {view === "security" && (
        <div className="security-section flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <p>under construction...</p>
          </div>
        </div>
      )}
      {view === "detail" && (
        <>
          {user.Supplier && (
            <div className="details-section flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <p>Company Name</p>
                <div className="flex items-center gap-2">
                  <span className="mdi--company"></span>
                  <h4>{user.Supplier.name}</h4>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>Company Email Address</p>
                <div className="flex items-center gap-2">
                  <span className="ic--round-mail"></span>
                  <h4>{user.Supplier.email}</h4>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>Address</p>
                <div className="flex items-center gap-2">
                  <span className="tdesign--location-filled"></span>
                  <h4>{user.Supplier.address}</h4>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>Company Phone Number</p>
                <div className="flex items-center gap-2">
                  <span className="solar--phone-bold"></span>
                  <h4>{user.Supplier.phone}</h4>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>Website</p>
                <div className="flex items-center gap-2">
                  <span className="streamline-plump--web"></span>
                  <h4>{user.Supplier.website}</h4>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>Established Year</p>
                <div className="flex items-center gap-2">
                  <span className="proicons--document"></span>
                  <h4>{user.Supplier.establishedYear}</h4>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p>Description</p>
                <div className="flex items-center gap-2">
                  <h4>{user.Supplier.description}</h4>
                </div>
              </div>
            </div>
          )}
          {user.Service && (
            <div className="details-section flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <p>Company Name</p>
                <h4>{user.Service.businessName}</h4>
              </div>
              <div className="flex flex-col gap-2">
                <p>Address</p>
                <h4>{user.Service.location}</h4>
              </div>
              <div className="flex flex-col gap-2">
                <p>Website</p>
                <h4>{user.Service.website}</h4>
              </div>
              <div className="flex flex-col gap-2">
                <p>Established Year</p>
                <h4>{user.Service.businessType}</h4>
              </div>
              <div className="flex flex-col gap-2">
                <p>Description</p>
                <h4>{user.Service.description}</h4>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
