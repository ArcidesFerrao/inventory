import React, { useState } from "react";

export const ServiceRegisterForm = () => {
  const [businessName, setBusinessName] = useState("");
  const [location, setLocation] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [error, setError] = useState("");

  return (
    <form>
      <label>
        Business Name
        <input
          type="text"
          name="businessName"
          id="businessName"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        />
      </label>
      <label>
        Location
        <input
          type="text"
          name="location"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </label>
      <label>
        Business Type
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
      </label>

      <button type="submit">Register</button>
    </form>
  );
};
