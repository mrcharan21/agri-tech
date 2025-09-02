import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/ProformaInvoice.css";
import AddProduct from "./AddProduct"; // ✅ import AddProduct component

export default function ProformaInvoice() {
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(null);
  const [printMode, setPrintMode] = useState(false);

  const API_URL = "http://localhost:5000/proformaInvoice"; // ✅ single invoice

  // Fetch data
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => setForm(res.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  // Root field change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Product change + auto calculations
  const handleProductChange = (idx, e) => {
    const { name, value } = e.target;
    const updatedProducts = form.product.map((item, i) =>
      i === idx ? { ...item, [name]: value } : item
    );

    updatedProducts[idx].amount = (
      parseFloat(updatedProducts[idx].quantity || 0) *
      parseFloat(updatedProducts[idx].rate || 0)
    ).toFixed(2);

    const grossTotal = updatedProducts.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );
    const gst = (grossTotal * 0.05).toFixed(2);
    const netTotal = (grossTotal + parseFloat(gst)).toFixed(2);

    setForm({ ...form, product: updatedProducts, grossTotal, gst, netTotal });
  };

  // Add new product
  const handleAddProduct = (newProduct) => {
    const updatedProducts = [...(form.product || []), newProduct];

    const grossTotal = updatedProducts.reduce(
      (sum, item) => sum + parseFloat(item.amount || 0),
      0
    );
    const gst = (grossTotal * 0.05).toFixed(2);
    const netTotal = (grossTotal + parseFloat(gst)).toFixed(2);

    setForm({ ...form, product: updatedProducts, grossTotal, gst, netTotal });
  };

  // Edit row
  const handleEditRow = (idx) => setEditing(idx);


  // Delete row
const handleDeleteRow = (idx) => {
  const updatedProducts = form.product.filter((_, i) => i !== idx);

  const grossTotal = updatedProducts.reduce(
    (sum, item) => sum + parseFloat(item.amount || 0),
    0
  );
  const gst = (grossTotal * 0.05).toFixed(2);
  const netTotal = (grossTotal + parseFloat(gst)).toFixed(2);

  setForm({ ...form, product: updatedProducts, grossTotal, gst, netTotal });
};


  // Save invoice (persist to db.json)
  const handleSave = () => {
    axios
      .put(API_URL, form) // ✅ send updated invoice
      .then((res) => {
        setForm(res.data);
        setEditing(null);
        alert("Invoice updated & saved to db.json!");
      })
      .catch((err) => console.error("Error updating invoice:", err));
  };

  // Print invoice
  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
      setPrintMode(false);
    }, 500);
  };

  if (!form.product) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-6 my-8">
      {/* Header */}
      <div className="flex flex-col items-center mb-4">
        <h1 className="text-3xl font-bold text-green-700">AGRI SCIENCE CO.</h1>
        <h2 className="text-lg font-semibold text-green-900 uppercase">
          FARMING THE FUTURE, TODAY
        </h2>
      </div>

      {/* Invoice Info */}
      <div className="bg-green-200 p-2 flex justify-between text-xs font-bold mb-2">
        <div>
          DATE :{" "}
          {printMode ? (
            <span>{form.date || new Date().toLocaleDateString()}</span>
          ) : (
            <input
              className="bg-green-100 px-1"
              name="date"
              value={form.date || new Date().toLocaleDateString()}
              onChange={handleChange}
            />
          )}
        </div>
      </div>

      {/* Consigner / Consignee */}
      <div className="grid grid-cols-2 gap-2 bg-green-50 p-2 rounded mb-2">
        <div>
          <h3 className="text-green-700 font-bold">CONSIGNER DETAILS:</h3>
          <p>
            Name:{" "}
            {printMode ? (
              <span>{form.consignerName}</span>
            ) : (
              <input
                className="bg-yellow-50 px-1 w-full"
                name="consignerName"
                value={form.consignerName || ""}
                onChange={handleChange}
              />
            )}
          </p>
          <p>
            Address:{" "}
            {printMode ? (
              <span>{form.consignerAddress}</span>
            ) : (
              <input
                className="bg-yellow-50 px-1 w-full"
                name="consignerAddress"
                value={form.consignerAddress || ""}
                onChange={handleChange}
              />
            )}
          </p>
          <p>
            Email:{" "}
            {printMode ? (
              <span>{form.consignerEmail}</span>
            ) : (
              <input
                className="bg-yellow-50 px-1 w-full"
                name="consignerEmail"
                value={form.consignerEmail || ""}
                onChange={handleChange}
              />
            )}
          </p>
        </div>

        <div>
          <h3 className="text-yellow-700 font-bold">CONSIGNEE DETAILS:</h3>
          <p>
            Name:{" "}
            {printMode ? (
              <span>{form.consigneeName}</span>
            ) : (
              <input
                className="bg-green-100 px-1 w-full"
                name="consigneeName"
                value={form.consigneeName || ""}
                onChange={handleChange}
              />
            )}
          </p>
          <p>
            Location:{" "}
            {printMode ? (
              <span>{form.consigneeLocation}</span>
            ) : (
              <input
                className="bg-green-100 px-1 w-full"
                name="consigneeLocation"
                value={form.consigneeLocation || ""}
                onChange={handleChange}
              />
            )}
          </p>
          <p>
            GST No:{" "}
            {printMode ? (
              <span>{form.consigneeGst}</span>
            ) : (
              <input
                className="bg-green-100 px-1 w-full"
                name="consigneeGst"
                value={form.consigneeGst || ""}
                onChange={handleChange}
              />
            )}
          </p>
        </div>
      </div>

      {/* Add Product Form */}
      {!printMode && <AddProduct onAdd={handleAddProduct} />}

      {/* Product Table */}
      <div className="responsive-table">
      <table className="w-full border text-sm sm:text-base">
        <thead>
          <tr className="bg-yellow-300">
            <th>SR.NO.</th>
            <th>PRODUCT NAME</th>
            <th>QUANTITY</th>
            <th>PACKING</th>
            <th>PCS/NOS</th>
            <th>RATE</th>
            <th>AMOUNT</th>
            {!printMode && <th>Edit</th>}
          </tr>
        </thead>
        <tbody>
          {form.product.map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>
                {editing === i ? (
                  <input
                    name="productName"
                    value={item.productName}
                    onChange={(e) => handleProductChange(i, e)}
                  />
                ) : (
                  item.productName
                )}
              </td>
              <td>
                {editing === i ? (
                  <input
                    name="quantity"
                    value={item.quantity}
                    onChange={(e) => handleProductChange(i, e)}
                  />
                ) : (
                  item.quantity
                )}
              </td>
              <td>
                {editing === i ? (
                  <input
                    name="packing"
                    value={item.packing}
                    onChange={(e) => handleProductChange(i, e)}
                  />
                ) : (
                  item.packing
                )}
              </td>
              <td>
                {editing === i ? (
                  <input
                    name="pcs"
                    value={item.pcs}
                    onChange={(e) => handleProductChange(i, e)}
                  />
                ) : (
                  item.pcs
                )}
              </td>
              <td>
                {editing === i ? (
                  <input
                    name="rate"
                    value={item.rate}
                    onChange={(e) => handleProductChange(i, e)}
                  />
                ) : (
                  item.rate
                )}
              </td>
              <td>{item.amount}</td>
              {!printMode && (
  <td>
    <div className="flex gap-2 action-buttons">
      {editing === i ? (
        <button
          className="bg-blue-500 text-white px-2 py-1 rounded"
          onClick={handleSave}
        >
          Save
        </button>
      ) : (
        <button
          className="bg-gray-500 text-white px-2 py-1 rounded"
          onClick={() => handleEditRow(i)}
        >
          Edit
        </button>
      )}

      <button
        className="bg-red-500 text-white px-2 py-1 rounded"
        onClick={() => handleDeleteRow(i)}
      >
        Delete
      </button>
    </div>
  </td>
)}


        
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      {/* Totals */}
      <div className="mb-2 grid grid-cols-3 gap-2">
        <div>
          GROSS TOTAL:{" "}
          {printMode ? (
            <span>{form.grossTotal}</span>
          ) : (
            <input
              className="bg-yellow-50 px-1 w-full"
              name="grossTotal"
              value={form.grossTotal || ""}
              readOnly
            />
          )}
        </div>
        <div>
          GST @5%:{" "}
          {printMode ? (
            <span>{form.gst}</span>
          ) : (
            <input
              className="bg-yellow-50 px-1 w-full"
              name="gst"
              value={form.gst || ""}
              readOnly
            />
          )}
        </div>
        <div>
          NET TOTAL:{" "}
          {printMode ? (
            <span>{form.netTotal}</span>
          ) : (
            <input
              className="bg-yellow-50 px-1 w-full"
              name="netTotal"
              value={form.netTotal || ""}
              readOnly
            />
          )}
        </div>
      </div>

      {/* Transport / Note */}
      <div className="mb-2">
        Transport:{" "}
        {printMode ? (
          <span>{form.transport}</span>
        ) : (
          <input
            className="bg-green-100 px-1 w-full"
            name="transport"
            value={form.transport || ""}
            onChange={handleChange}
          />
        )}
      </div>

      <div className="mb-2">
        Note:{" "}
        {printMode ? (
          <span>{form.note}</span>
        ) : (
          <input
            className="bg-green-100 px-1 w-full"
            name="note"
            value={form.note || ""}
            onChange={handleChange}
          />
        )}
      </div>

      {/* Terms */}
      <div className="bg-green-300 p-2 text-xs rounded mb-2">
        <strong>Terms & Conditions :</strong>
        <ul className="list-disc ml-4">
          <li>Subject to our home Jurisdiction & delivery Ex-premises.</li>
          <li>Goods once sold will not taken back.</li>
          <li>Payment term : 100% advance against the Proforma Invoice.</li>
          <li>Delivery : Immediately subject to fulfilment of payment terms.</li>
        </ul>
      </div>

      {/* Bank Details */}
      <div className="grid grid-cols-3 gap-2 bg-yellow-200 p-2 mb-2 text-xs rounded">
        <div>
          <strong>AGRI SCIENCE CO.</strong>
          <br />
          <span className="text-sm">BANK NAME: ICICI BANK LTD.</span>
          <br />
          <span className="text-sm">BRANCH: MAHABUBABAD</span>
          <br />
          <span className="text-sm">A/C No: 123456789122</span>
          <br />
          <span className="text-sm">IFSC Code: ICIC00013432</span>
        </div>
        <div className="col-span-2">
          <strong>
            We appreciate your business and look forward to work with you
            forever...
          </strong>
          <hr />
          <span>This is computer generated Invoice no signature required</span>
          <div className="font-bold mt-2">MR. GUGULOTH RAVINDER</div>
        </div>
      </div>

      {/* Buttons */}
      {!printMode && (
        <>
          <button
            onClick={handleSave}
            className="bg-green-700 hover:bg-green-900 text-white py-2 px-4 rounded block mx-auto my-2"
          >
            Update Invoice
          </button>

          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-800 text-white py-2 px-4 rounded block mx-auto"
          >
            Print Invoice
          </button>
        </>
      )}
    </div>
  );
}
