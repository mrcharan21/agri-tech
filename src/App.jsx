import React from 'react'
import ProformaInvoice from './Components/ProformaInvoice'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AddProduct from './Components/AddProduct.jsx'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProformaInvoice />} />   {/* 👈 Default route */}
        <Route path="/agri-tech" element={<ProformaInvoice />} />
        <Route path="/add-task" element={<AddProduct />} />
      </Routes>
    </Router>
  )
}
