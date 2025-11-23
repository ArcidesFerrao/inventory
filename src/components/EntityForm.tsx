import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function EntityForm({
  type,
  onClose,
}: {
  type: string;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create");
      }

      setName("");
      onClose();
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to create");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex justify-between gap-4">
        <label htmlFor="name" className="no-wrap">
          {type.charAt(0).toUpperCase() + type.slice(1)} Name
        </label>
        <input
          className="no-wrap text-gray-800"
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`Enter ${type} name`}
          required
        />
      </div>
      {error && <p>{error}</p>}
      <div className="flex justify-between gap-4">
        <label htmlFor="description" className="no-wrap">
          {type.charAt(0).toUpperCase() + type.slice(1)} Description
        </label>
        <input
          className="no-wrap text-gray-800"
          type="text"
          value={description}
          name="description"
          onChange={(e) => setDescription(e.target.value)}
          placeholder={`Enter ${type} description`}
          required
        />
      </div>
      <div className="flex justify-between gap-4">
        <button
          className="border py-1 px-2 rounded-sm"
          type="button"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className="border py-1 px-2 rounded-sm"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}
