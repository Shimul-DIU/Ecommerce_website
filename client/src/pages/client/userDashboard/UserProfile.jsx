import React, { useState } from "react";

// ---- Local design tokens ----
const C = {
  ink: "#14213D",
  card: "#FBF8F0",
  stamp: "#B23A48",
  sage: "#4F7A57",
  muted: "#7A7266",
  line: "#D8C9A3",
};

export default function UserProfile({ profile, setProfile }) {
  const [savedMsg, setSavedMsg] = useState("");

  const saveProfile = (e) => {
    e.preventDefault();
    setSavedMsg("Profile updated");
    setTimeout(() => setSavedMsg(""), 2000);
  };

  if (!profile) return null;

  return (
    <>
      <h2 style={{ color: C.ink, fontWeight: 700 }} className="mb-4 text-lg">
        Profile Settings
      </h2>
      <form
        onSubmit={saveProfile}
        style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 10, maxWidth: 480 }}
        className="p-6 flex flex-col gap-4"
      >
        <div>
          <label style={{ color: C.muted, fontSize: 12 }}>Full name</label>
          <input
            value={profile.name || ""}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            style={{ border: `1px solid ${C.line}`, background: "#fff" }}
            className="w-full mt-1 px-3 py-2 rounded-md text-sm outline-none"
          />
        </div>
        <div>
          <label style={{ color: C.muted, fontSize: 12 }}>Email</label>
          <input
            value={profile.email || ""}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            style={{ border: `1px solid ${C.line}`, background: "#fff" }}
            className="w-full mt-1 px-3 py-2 rounded-md text-sm outline-none"
          />
        </div>
        <div>
          <label style={{ color: C.muted, fontSize: 12 }}>Phone</label>
          <input
            value={profile.phone || ""}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            style={{ border: `1px solid ${C.line}`, background: "#fff" }}
            className="w-full mt-1 px-3 py-2 rounded-md text-sm outline-none"
          />
        </div>
        <button
          type="submit"
          style={{ background: C.stamp, color: "#fff" }}
          className="px-4 py-2 rounded-md text-sm font-semibold w-fit"
        >
          Save changes
        </button>
        {savedMsg && <p style={{ color: C.sage, fontSize: 13 }}>{savedMsg}</p>}
      </form>
    </>
  );
}
