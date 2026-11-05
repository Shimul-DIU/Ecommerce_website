import { useState, useMemo } from "react";

const initialCustomers = [
  { id: 1, name: "Rahim Uddin", email: "rahim@gmail.com", phone: "01711223344", city: "Dhaka", orders: 12, totalSpent: 45200, status: "Active", joined: "2026-01-12" },
  { id: 2, name: "Karima Akter", email: "karima@gmail.com", phone: "01822334455", city: "Chattogram", orders: 5, totalSpent: 18700, status: "Active", joined: "2026-02-03" },
  { id: 3, name: "Sajid Hasan", email: "sajid@gmail.com", phone: "01933445566", city: "Sylhet", orders: 0, totalSpent: 0, status: "Inactive", joined: "2026-03-21" },
  { id: 4, name: "Nusrat Jahan", email: "nusrat@gmail.com", phone: "01644556677", city: "Rajshahi", orders: 8, totalSpent: 32100, status: "Active", joined: "2026-04-15" },
  { id: 5, name: "Tanvir Ahmed", email: "tanvir@gmail.com", phone: "01555667788", city: "Khulna", orders: 3, totalSpent: 9400, status: "Blocked", joined: "2026-05-09" },
  { id: 6, name: "Mitu Rahman", email: "mitu@gmail.com", phone: "01366778899", city: "Dhaka", orders: 15, totalSpent: 61800, status: "Active", joined: "2026-05-30" },
  { id: 7, name: "Arif Hossain", email: "arif@gmail.com", phone: "01777889900", city: "Mymensingh", orders: 2, totalSpent: 5600, status: "Inactive", joined: "2026-06-18" },
  { id: 8, name: "Sumaiya Islam", email: "sumaiya@gmail.com", phone: "01888990011", city: "Barishal", orders: 6, totalSpent: 21900, status: "Active", joined: "2026-07-07" },
  { id: 9, name: "Fahim Reza", email: "fahim@gmail.com", phone: "01999001122", city: "Dhaka", orders: 9, totalSpent: 38500, status: "Active", joined: "2026-08-22" },
  { id: 10, name: "Lamia Sultana", email: "lamia@gmail.com", phone: "01611002233", city: "Cumilla", orders: 1, totalSpent: 2300, status: "Active", joined: "2026-09-10" },
  { id: 11, name: "Imran Khan", email: "imran@gmail.com", phone: "01522113344", city: "Rangpur", orders: 4, totalSpent: 14800, status: "Blocked", joined: "2026-10-01" },
  { id: 12, name: "Rima Begum", email: "rima@gmail.com", phone: "01433224455", city: "Dhaka", orders: 7, totalSpent: 26300, status: "Active", joined: "2026-10-20" },
];

const statusStyles = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-yellow-100 text-yellow-700",
  Blocked: "bg-red-100 text-red-700",
};

const PAGE_SIZE = 5;

const Customers = () => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const result = customers.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q);
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      return matchSearch && matchStatus;
    });

    result.sort((a, b) => {
      const x = a[sortKey];
      const y = b[sortKey];
      if (typeof x === "number") return sortDir === "asc" ? x - y : y - x;
      return sortDir === "asc"
        ? String(x).localeCompare(String(y))
        : String(y).localeCompare(String(x));
    });

    return result;
  }, [customers, search, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const SortIcon = ({ column }) =>
    sortKey === column ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  const headers = [
    { key: "name", label: "Customer" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City" },
    { key: "orders", label: "Orders" },
    { key: "totalSpent", label: "Total Spent" },
    { key: "status", label: "Status" },
    { key: "joined", label: "Joined" },
  ];

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Customers</h2>
            <p className="text-sm text-gray-500">
              Total {filtered.length} customer{filtered.length !== 1 && "s"}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search name, email or phone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">#</th>
                {headers.map((h) => (
                  <th
                    key={h.key}
                    onClick={() => handleSort(h.key)}
                    className="px-4 py-3 cursor-pointer select-none whitespace-nowrap hover:text-blue-600"
                  >
                    {h.label}
                    <SortIcon column={h.key} />
                  </th>
                ))}
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {paginated.length > 0 ? (
                paginated.map((c, index) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">
                      {(currentPage - 1) * PAGE_SIZE + index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{c.name}</p>
                          <p className="text-xs text-gray-500">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{c.phone}</td>
                    <td className="px-4 py-3 text-gray-700">{c.city}</td>
                    <td className="px-4 py-3 text-gray-700">{c.orders}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      ৳{c.totalSpent.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[c.status]}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                      {c.joined}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100">
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-gray-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1.5 text-sm border rounded-lg ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;