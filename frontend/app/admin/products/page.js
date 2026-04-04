"use client";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiPlus, FiGrid, FiShoppingBag, FiStar, FiSettings, FiLogOut, 
  FiImage, FiType, FiFileText, FiDollarSign, FiPercent, FiBox, 
  FiTag, FiTrash2, FiEdit3, FiEye, FiChevronRight, FiUploadCloud,
  FiSearch, FiBell, FiUser, FiX, FiCheck
} from "react-icons/fi";

// --- Reusable UI Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 rounded-xl ${
      active 
        ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
        : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
    }`}
  >
    <Icon size={18} />
    <span className="text-sm font-semibold">{label}</span>
  </button>
);

const FormInput = ({ label, icon: Icon, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-500 ml-1">{label}</label>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
          <Icon size={16} />
        </div>
      )}
      <input
        {...props}
        className={`w-full ${Icon ? 'pl-11' : 'px-4'} pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all`}
      />
    </div>
  </div>
);

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("ADD_PRODUCT");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    mrpPrice: "",
    discountPrice: "",
    gst: "18",
    stock: "",
    category: "",
    images: []
  });

  const [token, setToken] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) setToken(storedToken);
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.error("Fetch Products Error:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setForm({ ...form, images: [...form.images, ...files] });
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const removeImage = (index) => {
    const newImages = [...form.images];
    newImages.splice(index, 1);
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setForm({ ...form, images: newImages });
    setImagePreviews(newPreviews);
  };

  const addProduct = async () => {
    const { title, mrpPrice, discountPrice, stock } = form;
    if (!title || !mrpPrice || !discountPrice || !stock) {
      return alert("Please fill required fields");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => {
        if (key === 'images') {
          form.images.forEach(img => formData.append('images', img));
        } else {
          formData.append(key, form[key]);
        }
      });

      await axios.post("http://localhost:5000/api/products", formData, {
       headers: { 
  Authorization: `Bearer ${token}`
}
      });

      alert("✅ Product Created");
      setForm({ title: "", description: "", mrpPrice: "", discountPrice: "", gst: "18", stock: "", category: "", images: [] });
      setImagePreviews([]);
      fetchProducts();
      setActiveTab("PRODUCT_LIST");
    } catch (err) {
      console.error("Add Product Error:", err.response?.data || err.message);
      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error creating product"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Product Deleted");
      fetchProducts();
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] flex font-sans text-slate-900">
      
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
          <h1 className="text-lg font-bold tracking-tight">Hans Admin</h1>
        </div>

        <nav className="flex-grow space-y-1">
          <SidebarItem icon={FiGrid} label="Dashboard" active={activeTab === "DASHBOARD"} onClick={() => setActiveTab("DASHBOARD")} />
          <SidebarItem icon={FiPlus} label="Add Product" active={activeTab === "ADD_PRODUCT"} onClick={() => setActiveTab("ADD_PRODUCT")} />
          <SidebarItem icon={FiShoppingBag} label="Product List" active={activeTab === "PRODUCT_LIST"} onClick={() => setActiveTab("PRODUCT_LIST")} />
          <SidebarItem icon={FiBox} label="Orders" active={activeTab === "ORDERS"} onClick={() => {}} />
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <SidebarItem icon={FiLogOut} label="Logout" onClick={() => {}} />
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-grow p-8 lg:p-12 overflow-y-auto">
        
        <header className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-slate-900">
            {activeTab === "ADD_PRODUCT" ? "Add New Product" : "Dashboard"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"><FiBell size={18} /></div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">A</div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "ADD_PRODUCT" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="grid grid-cols-1 xl:grid-cols-12 gap-10"
            >
              {/* Form Section */}
              <div className="xl:col-span-8 space-y-6">
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Product Title" name="title" value={form.title} onChange={handleChange} placeholder="Enter product name" />
                    <FormInput label="Category" name="category" value={form.category} onChange={handleChange} placeholder="e.g. Solar Panel" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-500 ml-1">Description</label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Describe the product features..."
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormInput label="MRP Price" name="mrpPrice" value={form.mrpPrice} onChange={handleChange} placeholder="0.00" icon={FiDollarSign} />
                    <FormInput label="Discount Price" name="discountPrice" value={form.discountPrice} onChange={handleChange} placeholder="0.00" icon={FiPercent} />
                    <FormInput label="Stock" name="stock" value={form.stock} onChange={handleChange} placeholder="0" icon={FiBox} />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-500 ml-1">Product Images</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {imagePreviews.map((src, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group">
                          <img src={src} alt="Preview" className="w-full h-full object-cover" />
                          <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <FiX size={14} />
                          </button>
                        </div>
                      ))}
                      <button 
                        onClick={() => fileInputRef.current.click()}
                        className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
                      >
                        <FiUploadCloud size={20} />
                        <span className="text-[10px] font-bold uppercase">Upload</span>
                      </button>
                    </div>
                    <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleImageChange} accept="image/*" />
                  </div>

                  <button 
                    onClick={addProduct}
                    disabled={loading}
                    className="w-full py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-100 hover:bg-green-700 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiCheck size={18} /> Create Product</>}
                  </button>
                </div>
              </div>

              {/* Live Preview Section */}
              <div className="xl:col-span-4">
                <div className="sticky top-28 space-y-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider ml-2">Live Preview</h3>
                  <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-lg shadow-slate-100">
                    <div className="aspect-square bg-slate-50 flex items-center justify-center p-6">
                      {imagePreviews.length > 0 ? (
                        <img src={imagePreviews[0]} alt="Preview" className="max-h-full object-contain" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-slate-300">
                          <FiImage size={48} />
                          <span className="text-[10px] font-bold uppercase">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-md">
                          {form.category || "Category"}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 mt-2 line-clamp-1">{form.title || "Product Name"}</h4>
                      </div>
                      <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Stock: {form.stock || "0"}</span>
                        <span className="text-[10px] font-bold text-green-600 uppercase">GST {form.gst}% Inc.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "PRODUCT_LIST" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p._id} className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-all">
                  <div className="aspect-video bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
                    <img src={`http://localhost:5000/${p.images?.[0]}`} alt={p.title} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 line-clamp-1">{p.title}</h3>
                    <p className="text-blue-600 font-bold mt-1">₹{p.discountPrice}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <span className="text-xs font-bold text-slate-400">Stock: {p.stock}</span>
                    <div className="flex gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><FiEdit3 size={16} /></button>
                      <button onClick={() => deleteProduct(p._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><FiTrash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
