import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "../../../utils/translations";
import axiosInstance from "../../../utils/axiosInstance";

export default function UserProfile() {
  const { t } = useTranslation();
  const { profile, setProfile, profileLoading, profileError } =
    useOutletContext();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedMsg, setSavedMsg] = useState("");

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSavedMsg("");

    try {
      const response = await axiosInstance.put("/api/user/profile", {
        fullname: profile.name,
        phone: profile.phone,
      });
      const user = response.data.user;
      setProfile({
        id: user.id,
        name: user.fullname,
        email: user.email,
        phone: user.phone || "",
      });
      setSavedMsg(t("Profile updated"));
    } catch (saveError) {
      console.error("Error updating profile:", saveError);
      setError(
        saveError.response?.data?.message || t("Could not update profile.")
      );
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading) {
    return <p className="text-sm text-slate-500">{t("Loading...")}</p>;
  }

  if (profileError || !profile) {
    return (
      <p className="text-sm text-rose-600">
        {t(profileError || "Profile unavailable.")}
      </p>
    );
  }

  return (
    <>
      <h2 className="mb-4 text-lg font-bold text-slate-900">{t("Profile Settings")}</h2>
      <form
        onSubmit={saveProfile}
        className="flex max-w-md flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6"
      >
        <div>
          <label className="text-xs text-slate-500">{t("Full name")}</label>
          <input
            required
            minLength={2}
            maxLength={100}
            value={profile.name || ""}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500">{t("Email")}</label>
          <input
            value={profile.email}
            readOnly
            className="mt-1 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-xs text-slate-500">{t("Phone")}</label>
          <input
            maxLength={20}
            value={profile.phone || ""}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-fit rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
        >
          {saving ? t("Saving...") : t("Save changes")}
        </button>
        {error && <p className="text-sm text-rose-600">{error}</p>}
        {savedMsg && <p className="text-sm text-emerald-600">{savedMsg}</p>}
      </form>
    </>
  );
}
