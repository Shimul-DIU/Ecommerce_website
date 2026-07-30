import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

export default function UserProfile() {
  // profile/setProfile UserDashboardLayout theke Outlet context er madhome ashche,
  // tai topbar-e (Welcome back, ...) update ta reflect hoye jabe
  const { profile, setProfile } = useOutletContext();
  const [savedMsg, setSavedMsg] = useState("");

  const saveProfile = (e) => {
    e.preventDefault();

    // TODO: api call diye profile update koro
    // fetch("/api/user/me", {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(profile),
    // }).then(() => {
    //   setSavedMsg("Profile updated");
    //   setTimeout(() => setSavedMsg(""), 2000);
    // });

    setSavedMsg("Profile updated");
    setTimeout(() => setSavedMsg(""), 2000);
  };

  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-slate-900">Profile Settings</h2>
      <form
        onSubmit={saveProfile}
        className="flex max-w-md flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6"
      >
        <div>
          <label className="text-xs text-slate-500">Full name</label>
          <input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500">Email</label>
          <input
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500">Phone</label>
          <input
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-fit rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Save changes
        </button>
        {savedMsg && <p className="text-sm text-emerald-600">{savedMsg}</p>}
      </form>
    </>
  );
}
