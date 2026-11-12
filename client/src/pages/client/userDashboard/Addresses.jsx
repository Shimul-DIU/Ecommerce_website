import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useTranslation } from "../../../utils/translations";
import axiosInstance from "../../../utils/axiosInstance";

const emptyAddress = {
  label: "",
  line: "",
  city: "",
  phone: "",
  isDefault: false,
};

export default function Addresses() {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState(emptyAddress);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    const fetchAddresses = async () => {
      try {
        const response = await axiosInstance.get("/api/user/addresses", {
          signal: controller.signal,
        });
        if (active) {
          setAddresses(response.data.addresses || []);
          setLoadError("");
        }
      } catch (error) {
        if (active && !controller.signal.aborted) {
          console.error("Error fetching addresses:", error);
          setLoadError("Could not load addresses.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAddresses();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const openNewAddressForm = () => {
    setEditingId(null);
    setForm({ ...emptyAddress, isDefault: addresses.length === 0 });
    setFormError("");
    setFormOpen(true);
  };

  const openEditAddressForm = (address) => {
    setEditingId(address._id);
    setForm({
      label: address.label || "",
      line: address.line || "",
      city: address.city || "",
      phone: address.phone || "",
      isDefault: Boolean(address.isDefault),
    });
    setFormError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm(emptyAddress);
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError("");

    try {
      const response = editingId
        ? await axiosInstance.patch(`/api/user/addresses/${editingId}`, form)
        : await axiosInstance.post("/api/user/addresses", form);
      setAddresses(response.data.addresses || []);
      setLoadError("");
      setActionError("");
      closeForm();
    } catch (error) {
      console.error("Error saving address:", error);
      setFormError(
        error.response?.data?.message || t("Could not save address.")
      );
    } finally {
      setSaving(false);
    }
  };

  const removeAddress = async (id) => {
    try {
      const response = await axiosInstance.delete(`/api/user/addresses/${id}`);
      setAddresses(response.data.addresses || []);
      setActionError("");
    } catch (error) {
      console.error("Error deleting address:", error);
      setActionError(
        error.response?.data?.message || t("Could not delete address.")
      );
    }
  };

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">{t("Saved Addresses")}</h2>
        <button
          type="button"
          onClick={openNewAddressForm}
          className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm text-white"
        >
          <Plus size={15} /> {t("Add new")}
        </button>
      </div>

      {actionError && (
        <p role="alert" className="mb-4 text-sm text-rose-600">{actionError}</p>
      )}

      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="mb-5 grid max-w-2xl grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2"
        >
          <div>
            <label className="text-xs text-slate-500">{t("Label")}</label>
            <input
              required
              maxLength={40}
              value={form.label}
              onChange={(event) => setForm({ ...form, label: event.target.value })}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
              placeholder={t("Home, Office")}
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">{t("Phone")}</label>
            <input
              required
              maxLength={20}
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">{t("Address")}</label>
            <input
              required
              maxLength={200}
              value={form.line}
              onChange={(event) => setForm({ ...form, line: event.target.value })}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500">{t("City")}</label>
            <input
              required
              maxLength={80}
              value={form.city}
              onChange={(event) => setForm({ ...form, city: event.target.value })}
              className="mt-1 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(event) =>
                setForm({ ...form, isDefault: event.target.checked })
              }
            />
            {t("Set as default")}
          </label>
          {formError && (
            <p role="alert" className="text-sm text-rose-600 sm:col-span-2">
              {formError}
            </p>
          )}
          <div className="flex gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? t("Saving...") : t("Save address")}
            </button>
            <button
              type="button"
              onClick={closeForm}
              disabled={saving}
              className="flex items-center gap-1 rounded-md border border-slate-200 px-4 py-2 text-sm"
            >
              <X size={14} /> {t("Cancel")}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">{t("Loading...")}</p>
      ) : loadError ? (
        <p role="alert" className="text-sm text-rose-600">{t(loadError)}</p>
      ) : addresses.length === 0 ? (
        <p className="text-sm text-slate-500">{t("No addresses saved yet.")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="relative rounded-lg border border-slate-200 bg-white p-4"
            >
              {address.isDefault && (
                <span className="absolute right-4 top-4 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-600">
                  {t("Default")}
                </span>
              )}
              <p className="font-semibold text-slate-900">{address.label}</p>
              <p className="mt-1 text-[13px] text-slate-700">
                {address.line}, {address.city}
              </p>
              <p className="text-[13px] text-slate-500">{address.phone}</p>
              <div className="mt-3 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => openEditAddressForm(address)}
                  className="flex items-center gap-1 text-xs text-slate-700"
                >
                  <Pencil size={12} /> {t("Edit")}
                </button>
                <button
                  type="button"
                  onClick={() => removeAddress(address._id)}
                  className="flex items-center gap-1 text-xs text-rose-600"
                >
                  <Trash2 size={12} /> {t("Delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
