import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function App() {
  const [products, setProducts] = useState([]);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(200000);

  const navigate = useNavigate();
  const location = useLocation(); // ✅ important

  // URL change হলে data fetch
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const price = params.get("filter_price");

    fetch(`http://localhost:5000/products?filter_price=${price || ""}`)
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, [location.search]); // ✅ correct dependency

  // filter apply
  const applyFilter = () => {
    if (min > max) {
      alert("Min cannot be greater than Max");
      return;
    }

    navigate(`?filter_price=${min}-${max}`);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Price Filter</h2>
      <h1>Product List</h1>

      <div>
        <p>Min: {min}</p>
        <input
          type="range"
          min="0"
          max="200000"
          value={min}
          onChange={(e) => setMin(Number(e.target.value))}
        />
      </div>

      <div>
        <p>Max: {max}</p>
        <input
          type="range"
          min="0"
          max="200000"
          value={max}
          onChange={(e) => setMax(Number(e.target.value))}
        />
      </div>

      <button onClick={applyFilter}>Apply Filter</button>

      <hr />

      <h3>Products</h3>

      {products.length > 0 ? (
        products.map((p) => (
          <p key={p.id}>
            {p.name} - {p.price} tk
          </p>
        ))
      ) : (
        <p>No products found</p>
      )}
    </div>
  );
}

export default App;