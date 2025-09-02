import React, { useState } from "react";

export default function AddProduct({ onAdd }) {
  const [product, setProduct] = useState({
    productName: "",
    quantity: "",
    packing: "",
    pcs: "",
    rate: "",
    amount: "0.00",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...product, [name]: value };

    // Auto calculate amount
    updated.amount = (
      parseFloat(updated.quantity || 0) * parseFloat(updated.rate || 0)
    ).toFixed(2);

    setProduct(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product.productName) {
      alert("Please enter product name");
      return;
    }
    onAdd(product); // send product to parent
    setProduct({
      productName: "",
      quantity: "",
      packing: "",
      pcs: "",
      rate: "",
      amount: "0.00",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-green-50 border p-4 rounded shadow mb-4"
    >
      <h3 className="font-bold mb-2">Add New Product</h3>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <input
          name="productName"
          placeholder="Product Name"
          value={product.productName}
          onChange={handleChange}
          className="border px-2 py-1"
        />
        <input
          name="quantity"
          placeholder="Quantity"
          value={product.quantity}
          onChange={handleChange}
          className="border px-2 py-1"
        />
        <input
          name="packing"
          placeholder="Packing"
          value={product.packing}
          onChange={handleChange}
          className="border px-2 py-1"
        />
        <input
          name="pcs"
          placeholder="PCS/NOS"
          value={product.pcs}
          onChange={handleChange}
          className="border px-2 py-1"
        />
        <input
          name="rate"
          placeholder="Rate"
          value={product.rate}
          onChange={handleChange}
          className="border px-2 py-1"
        />
        <input
          name="amount"
          placeholder="Amount"
          value={product.amount}
          readOnly
          className="border px-2 py-1 bg-gray-100"
        />
      </div>

      <button
        type="submit"
        className="mt-3 bg-green-600 hover:bg-green-800 text-white py-1 px-3 rounded"
      >
        Add Product
      </button>
    </form>
  );
}
