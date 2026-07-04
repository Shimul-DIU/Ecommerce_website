import useProducts from "../../hooks/useProducts";

const NewArrivals = () => {
  const [products, loading, error] = useProducts();

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div>
      {loading && (
        <div className="flex flex-wrap gap-4 animate-pulse">
          <div className="h-24 w-24 rounded-2xl bg-gray-200"></div>
          <div className="h-24 w-24 rounded-2xl bg-gray-200"></div>
          <div className="h-24 w-24 rounded-2xl bg-gray-200"></div>
          <div className="h-24 w-24 rounded-2xl bg-gray-200"></div>
          <div className="h-24 w-24 rounded-2xl bg-gray-200"></div>
          <div className="h-24 w-24 rounded-2xl bg-gray-200"></div>
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-4 gap-6">
          {products.map((item) => (
            <div key={item._id} className="border rounded-lg p-4">
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt={item.name}
                className="w-full h-48 object-cover"
              />

              <h2 className="text-xl font-bold mt-3">{item.name}</h2>

              <p>Category: {item.category}</p>

              <p>Price: ৳{item.price}</p>

              <p>Stock: {item.stock}</p>

              <p>Status: {item.status}</p>

              <p>{item.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewArrivals;