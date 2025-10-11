import type { UserProfile } from "@/types/types";
import React from "react";

export default function UserProfile({ user }: { user: UserProfile }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="profile-sections">
        <button>Personal Information</button>
        <button>Supplier Details</button>
        <button>Security</button>
      </div>
      <div className="personal-section flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <p>Full Name</p>
          <h4>{user.name}</h4>
        </div>
        <div className="flex flex-col gap-2">
          <p>Email Address</p>
          <h4>{user.email}</h4>
        </div>
        <div className="flex flex-col gap-2">
          <p>Phone Number</p>
          <h4>{user.phoneNumber}</h4>
        </div>
        <div className="flex flex-col gap-2">
          <p>Member Since</p>
          <h4>{user.createdAt.toLocaleDateString()}</h4>
        </div>
        <div className="flex flex-col gap-2">
          <p>Last Updated</p>
          <h4>{user.updatedAt.toLocaleDateString()}</h4>
        </div>
      </div>
      {user.Supplier && (
        <div className="details-section flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <p>Company Name</p>
            <h4>{user.Supplier.name}</h4>
          </div>
          <div className="flex flex-col gap-2">
            <p>Company Email Address</p>
            <h4>{user.Supplier.email}</h4>
          </div>
          <div className="flex flex-col gap-2">
            <p>Address</p>
            <h4>{user.Supplier.address}</h4>
          </div>
          <div className="flex flex-col gap-2">
            <p>Company Phone Number</p>
            <h4>{user.Supplier.phone}</h4>
          </div>
          <div className="flex flex-col gap-2">
            <p>Website</p>
            <h4>{user.Supplier.website}</h4>
          </div>
          <div className="flex flex-col gap-2">
            <p>Established Year</p>
            <h4>{user.Supplier.establishedYear}</h4>
          </div>
          <div className="flex flex-col gap-2">
            <p>Description</p>
            <h4>{user.Supplier.description}</h4>
          </div>
        </div>
      )}
    </div>
  );
}
