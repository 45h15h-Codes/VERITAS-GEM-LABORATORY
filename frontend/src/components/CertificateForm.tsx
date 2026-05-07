import React, { useState, useCallback, useRef } from "react";
import { Upload, X, Package, ChevronDown, Info, RefreshCw, Search } from "lucide-react";
// import { useData } from '../contexts/DataContext';
import { Button } from "./Button";
import { Input } from "./Input";
import { toast } from "sonner";
import axios from "axios";
import { useEffect } from "react";
import { resolveImageUrl } from "../utils/imageUrl";

interface CertificateFormProps {
  onSuccess: () => void;
  editingCertificate?: any;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

export const CertificateForm: React.FC<CertificateFormProps> = ({
  onSuccess,
  editingCertificate,
}) => {
  // const { addCertificate, updateCertificate } = useData();
  const [stores, setStores] = useState<any[]>([]);

  // ── CRM Order State ──
  const [crmOrders, setCrmOrders] = useState<any[]>([]);
  const [selectedCrmOrder, setSelectedCrmOrder] = useState<any | null>(null);
  const [crmDropdownOpen, setCrmDropdownOpen] = useState(false);
  const [loadingCrmOrders, setLoadingCrmOrders] = useState(false);
  const [imageFromCrm, setImageFromCrm] = useState(false);
  const [crmSearchQuery, setCrmSearchQuery] = useState("");
  const crmSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/stores`)
      .then((res) => setStores(res.data))
      .catch(() => setStores([]));
  }, []);

  useEffect(() => {
    if (!editingCertificate) {
      axios.get(`${API_BASE_URL}/api/certificates/next-number`).then((res) => {
        setFormData((prev) => ({
          ...prev,
          certificate_number: res.data.certificate_number,
        }));
      });
    }
  }, [editingCertificate]);

  // ── Fetch unused CRM orders ──
  const fetchCrmOrders = useCallback(() => {
    setLoadingCrmOrders(true);
    axios
      .get(`${API_BASE_URL}/api/crm-orders`)
      .then((res) => setCrmOrders(res.data))
      .catch(() => setCrmOrders([]))
      .finally(() => setLoadingCrmOrders(false));
  }, []);

  useEffect(() => {
    if (!editingCertificate) {
      fetchCrmOrders();
    }
  }, [editingCertificate, fetchCrmOrders]);

  const [imagePreview, setImagePreview] = useState<string>(
    editingCertificate?.image
      ? resolveImageUrl(editingCertificate.image, API_BASE_URL)
      : "",
  );
  const [formData, setFormData] = useState<{ [key: string]: any }>({
    certificate_number: editingCertificate?.certificate_number || "",
    type: editingCertificate?.type || "jewellery",
    certifier_name: editingCertificate?.certifier_name || "",
    store: editingCertificate?.store || "",
    image: null as File | null,
    title: editingCertificate?.title || "",
    date: editingCertificate?.date || new Date().toISOString().split("T")[0],
    item: editingCertificate?.item || "",
    length: editingCertificate?.length || "",
    weight: editingCertificate?.weight || "",
    carat_weight: editingCertificate?.carat_weight || "",
    gem_stone: editingCertificate?.gem_stone || "",
    color: editingCertificate?.color || "",
    clarity: editingCertificate?.clarity || "",
    metal_purity: editingCertificate?.metal_purity || "",
    value: editingCertificate?.value || "",
    crm_order_id: null as number | null,
    image_url: "" as string,
  });

  const [, /* errors */ setErrors] = useState<{ [key: string]: string }>({});
  const [, /* serverError */ setServerError] = useState<string>("");
  const [, /* success */ setSuccess] = useState<string>("");

  const requiredFields = [
    "certificate_number",
    "type",
    "certifier_name",
    "store",
    "image",
    "title",
    "date",
    "item",
    "length",
    "weight",
    "carat_weight",
    "gem_stone",
    "color",
    "clarity",
  ];

  // metal_purity is required only for jewellery type

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({ ...prev, [name]: value }));
  // };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files![0],
        image_url: "",
      }));
      setImageFromCrm(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // ── CRM Order Auto-Fill Handler ──
  const handleCrmOrderSelect = (orderId: number) => {
    const order = crmOrders.find((o) => o.id === orderId);
    if (!order) return;

    setSelectedCrmOrder(order);
    setCrmDropdownOpen(false);
    setCrmSearchQuery("");

    // Auto-fill 13 fields from CRM order data
    setFormData((prev) => ({
      ...prev,
      certifier_name: order.certifier_name || "",
      type: order.type || "jewellery",
      value: order.value || "",
      metal_purity: order.metal_purity || "",
      date: order.order_date
        ? order.order_date.split("T")[0]
        : new Date().toISOString().split("T")[0],
      title: order.title || "",
      item: order.item || "",
      color: order.diamond_color || "",
      clarity: order.diamond_clarity || "",
      carat_weight: order.diamond_weight || "",
      gem_stone: order.diamond_shape || "",
      length: order.diamond_measurement || "",
      crm_order_id: order.crm_order_id,
      image_url: order.image_url || "",
    }));

    // Image auto-preview from Cloudinary URL
    if (order.image_url) {
      setImagePreview(order.image_url);
      setImageFromCrm(true);
      // Clear any file upload since we're using URL
      setFormData((prev) => ({ ...prev, image: null }));
    }

    toast.success(`Imported data from CRM Order #${order.crm_order_id}`);
  };

  // ── Clear CRM Order Selection ──
  const handleClearCrmOrder = () => {
    setSelectedCrmOrder(null);
    setFormData((prev) => ({
      ...prev,
      crm_order_id: null,
      image_url: "",
      certifier_name: "",
      type: "jewellery",
      value: "",
      metal_purity: "",
      date: new Date().toISOString().split("T")[0],
      title: "",
      item: "",
      color: "",
      clarity: "",
      carat_weight: "",
      gem_stone: "",
      length: "",
      weight: "",
    }));
    setImagePreview("");
    setImageFromCrm(false);

    // Refetch next certificate number
    axios.get(`${API_BASE_URL}/api/certificates/next-number`).then((res) => {
      setFormData((prev) => ({
        ...prev,
        certificate_number: res.data.certificate_number,
      }));
    });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    let fieldsToCheck = [...requiredFields];

    if (editingCertificate) {
      fieldsToCheck = fieldsToCheck.filter((field) => field !== "image");
    }

    // Image is not required if we have image_url from CRM
    if (formData.image_url) {
      fieldsToCheck = fieldsToCheck.filter((field) => field !== "image");
    }

    // Add metal_purity to required fields only if type is jewellery
    if (formData.type === "jewellery") {
      fieldsToCheck.push("metal_purity");
    }

    fieldsToCheck.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required.";
      }
    });

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError("");
    setSuccess("");

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill all required fields correctly.");
      return;
    }
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "image") {
          if (formData.image instanceof File) {
            data.append("image", formData.image);
          }
        } else if (key === "crm_order_id") {
          if (value !== null && value !== "") {
            data.append(key, String(value));
          }
        } else if (key === "image_url") {
          if (value && imageFromCrm) {
            data.append("image_url", value);
          }
        } else if (value !== null && value !== "") {
          data.append(key, value as any);
        }
      });

      let res;
      if (editingCertificate) {
        // PUT for update
        res = await axios.post(
          `${API_BASE_URL}/api/certificates/${editingCertificate.id}?_method=PUT`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
        setSuccess("Certificate updated successfully!");
      } else {
        // POST for create
        res = await axios.post(`${API_BASE_URL}/api/certificates`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Certificate created successfully!");
        setFormData({
          certificate_number: "",
          type: "jewellery",
          certifier_name: "",
          store: "",
          image: null,
          title: "",
          date: "",
          item: "",
          length: "",
          weight: "",
          carat_weight: "",
          gem_stone: "",
          color: "",
          clarity: "",
          metal_purity: "",
          value: "",
          crm_order_id: null,
          image_url: "",
        });
        setImagePreview("");
        setSelectedCrmOrder(null);
        setImageFromCrm(false);
      }
      toast.success(
        editingCertificate
          ? "Certificate updated successfully!"
          : "Certificate created successfully!",
      );
      onSuccess();
    } catch (err: any) {
      console.error("Error creating certificate:", err);
      if (err.response && err.response.status === 422) {
        const errors = err.response.data.errors;
        setErrors(errors || {});
        if (errors) {
          const firstErrorKey = Object.keys(errors)[0];
          const errorMessage = errors[firstErrorKey][0];
          toast.error(errorMessage);
        } else {
          toast.error("Validation error. Please check your inputs.");
        }
      } else if (err.response && err.response.status === 500) {
        setServerError("Server error. Please try again later.");
        toast.error("Server error occurred. Please try again.");
      } else {
        setServerError("An error occurred. Please try again.");
        toast.error("An error occurred. Please try again.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      encType="multipart/form-data"
    >
      {/* ── CRM Order Import Section (only on create, not edit) ── */}
      {!editingCertificate && (
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">
                Import from CRM Order
              </span>
              <div className="ml-auto flex items-center gap-2">
                {crmOrders.length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    {crmOrders.length} available
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    fetchCrmOrders();
                    toast.info("CRM orders refreshed");
                  }}
                  disabled={loadingCrmOrders}
                  className="text-blue-500 hover:text-blue-700 p-1 rounded-md hover:bg-blue-100 transition-colors disabled:opacity-50"
                  title="Refresh CRM orders"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loadingCrmOrders ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            </div>

            {selectedCrmOrder ? (
              <div className="bg-white rounded-lg p-3 border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-800">
                    Order #{selectedCrmOrder.crm_order_id}
                  </span>
                  <span className="text-sm text-gray-500 mx-2">—</span>
                  <span className="text-sm text-gray-600">
                    {selectedCrmOrder.certifier_name || "Unknown"}
                  </span>
                  {selectedCrmOrder.title && (
                    <>
                      <span className="text-sm text-gray-500 mx-2">—</span>
                      <span className="text-sm text-gray-500">
                        {selectedCrmOrder.title}
                      </span>
                    </>
                  )}
                  <span className="inline-block ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    ✅ Imported
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleClearCrmOrder}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Clear
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCrmDropdownOpen(!crmDropdownOpen)}
                  disabled={loadingCrmOrders || crmOrders.length === 0}
                  className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 text-left hover:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-gray-500">
                    {loadingCrmOrders
                      ? "Loading CRM orders..."
                      : crmOrders.length === 0
                        ? "No CRM orders available"
                        : "Select a CRM order to auto-fill form..."}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${crmDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {crmDropdownOpen && crmOrders.length > 0 && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {/* ── Search Input ── */}
                    <div className="sticky top-0 bg-white border-b border-gray-100 p-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          ref={crmSearchRef}
                          type="text"
                          value={crmSearchQuery}
                          onChange={(e) => setCrmSearchQuery(e.target.value)}
                          placeholder="Search by order #, name, SKU..."
                          className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-md focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-100 transition-colors"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                        {crmSearchQuery && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCrmSearchQuery("");
                              crmSearchRef.current?.focus();
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* ── Filtered Results ── */}
                    <div className="max-h-52 overflow-y-auto">
                      {(() => {
                        const q = crmSearchQuery.toLowerCase().trim();
                        const filtered = q
                          ? crmOrders.filter((order: any) =>
                              String(order.crm_order_id).includes(q) ||
                              (order.certifier_name || "").toLowerCase().includes(q) ||
                              (order.title || "").toLowerCase().includes(q) ||
                              (order.company_name || "").toLowerCase().includes(q) ||
                              (order.diamond_skus || []).some((sku: string) =>
                                sku.toLowerCase().includes(q)
                              )
                            )
                          : crmOrders;

                        if (filtered.length === 0) {
                          return (
                            <div className="px-4 py-6 text-center text-sm text-gray-400">
                              <Search className="w-5 h-5 mx-auto mb-2 opacity-40" />
                              No orders matching "{crmSearchQuery}"
                            </div>
                          );
                        }

                        return (
                          <>
                            {q && (
                              <div className="px-3 py-1.5 text-xs text-gray-400 bg-gray-50 border-b border-gray-100">
                                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                              </div>
                            )}
                            {filtered.map((order: any) => (
                              <button
                                key={order.id}
                                type="button"
                                onClick={() => handleCrmOrderSelect(order.id)}
                                className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-50 last:border-b-0 transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="font-medium text-gray-800">
                                      #{order.crm_order_id}
                                    </span>
                                    <span className="text-gray-400 mx-2">—</span>
                                    <span className="text-gray-600">
                                      {order.certifier_name || "Unknown Client"}
                                    </span>
                                  </div>
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${
                                      order.type === "diamond"
                                        ? "bg-cyan-100 text-cyan-700"
                                        : "bg-amber-100 text-amber-700"
                                    }`}
                                  >
                                    {order.type || "jewellery"}
                                  </span>
                                </div>
                                {order.title && (
                                  <p className="text-sm text-gray-500 mt-1 truncate">
                                    {order.title}
                                  </p>
                                )}
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                                  {order.value && (
                                    <span>${Number(order.value).toLocaleString()}</span>
                                  )}
                                  {order.order_date && (
                                    <span>{order.order_date.split("T")[0]}</span>
                                  )}
                                  {order.company_name && (
                                    <span>{order.company_name}</span>
                                  )}
                                </div>
                              </button>
                            ))}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* <Input
        label="Certificate Number"
        value={formData.certificate_number}
        placeholder="e.g., VGL-A12345"
        onChange={e => setFormData({ ...formData, certificate_number: e.target.value })}

      /> */}

      <Input
        label="Certificate Number"
        value={formData.certificate_number}
        readOnly={!editingCertificate}
        className={editingCertificate ? "" : "bg-gray-100 cursor-not-allowed"}
        onChange={(e) => {
          if (editingCertificate) {
            setFormData({ ...formData, certificate_number: e.target.value });
          }
        }}
      />

      {editingCertificate && (
        <button
          type="button"
          className="text-blue-600 underline text-sm"
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to change the certificate number?",
              )
            ) {
              const inputElem = document.querySelector(
                "#cert-number-input",
              ) as HTMLInputElement;
              if (inputElem) inputElem.removeAttribute("readonly");
              toast.info("Now you can edit the certificate number.");
            }
          }}
        >
          Edit Certificate Number
        </button>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Certificate Type <span className="text-red-500">*</span>
        </label>
        <select
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors duration-300 bg-white"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        >
          <option value="jewellery">Jewellery Certificate</option>
          <option value="diamond">Diamond Certificate</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {formData.type === "diamond"
            ? "For diamond certificates, weight will be displayed as width and metal purity will be hidden"
            : "For jewellery certificates, all fields including metal purity will be displayed"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Input
          label="Certifier Name"
          placeholder="e.g., Jhon Doe"
          value={formData.certifier_name}
          onChange={(e) =>
            setFormData({ ...formData, certifier_name: e.target.value })
          }
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors duration-300 bg-white"
            value={formData.store}
            onChange={(e) =>
              setFormData({ ...formData, store: e.target.value })
            }
          >
            <option value="">Select a store</option>
            {stores.map((store: any) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
          {/* {errors.store && <p className="text-red-500 text-xs mt-1">{errors.store}</p>} */}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Jewelry Image <span className="text-red-500">*</span>
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg shadow-lg"
              />
              {imageFromCrm && (
                <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  📷 CRM Image
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setImagePreview("");
                  setFormData((prev) => ({
                    ...prev,
                    image: null,
                    image_url: "",
                  }));
                  setImageFromCrm(false);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 mb-2">Upload jewelry image</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer text-amber-600 hover:text-amber-700 font-medium"
              >
                Choose file
              </label>
            </div>
          )}
        </div>
      </div>

      <Input
        label="Title"
        placeholder="e.g., Diamond Engagement Ring"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
        <Input
          label="Item"
          placeholder="e.g., Engagement Ring"
          value={formData.item}
          onChange={(e) => setFormData({ ...formData, item: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Input
          label="Length"
          placeholder="e.g., 18 inches"
          value={formData.length}
          onChange={(e) => setFormData({ ...formData, length: e.target.value })}
        />
        <Input
          label={formData.type === "diamond" ? "Width" : "Weight"}
          placeholder={formData.type === "diamond" ? "e.g., 5mm" : "e.g., 4.5g"}
          value={formData.weight}
          onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
        />
        <Input
          label="Carat Weight"
          type="number"
          placeholder="e.g., 2.5"
          value={formData.carat_weight}
          onChange={(e) =>
            setFormData({ ...formData, carat_weight: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Input
          label="Gem Stone"
          placeholder="e.g., Diamond"
          value={formData.gem_stone}
          onChange={(e) =>
            setFormData({ ...formData, gem_stone: e.target.value })
          }
        />
        <Input
          label="Color"
          placeholder="e.g., D (Colorless)"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Input
          label="Clarity"
          placeholder="e.g., VVS1"
          value={formData.clarity}
          onChange={(e) =>
            setFormData({ ...formData, clarity: e.target.value })
          }
        />
        {formData.type === "jewellery" && (
          <Input
            label="Metal Purity"
            placeholder="e.g., 24K Gold"
            value={formData.metal_purity}
            onChange={(e) =>
              setFormData({ ...formData, metal_purity: e.target.value })
            }
          />
        )}
      </div>

      <Input
        label="Product Value"
        type="number"
        placeholder="e.g., 1500.00"
        value={formData.value}
        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
      />

      {/* ── CRM Order Reference Info (shown when order is selected) ── */}
      {selectedCrmOrder && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600">
              CRM Order Reference Info
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {selectedCrmOrder.client_email && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📧</span>
                <span className="text-gray-600">
                  {selectedCrmOrder.client_email}
                </span>
              </div>
            )}
            {selectedCrmOrder.client_mobile && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">📱</span>
                <span className="text-gray-600">
                  {selectedCrmOrder.client_mobile}
                </span>
              </div>
            )}
            {selectedCrmOrder.client_address && (
              <div className="flex items-center gap-2 md:col-span-2">
                <span className="text-gray-400">📍</span>
                <span className="text-gray-600">
                  {selectedCrmOrder.client_address}
                </span>
              </div>
            )}
            {selectedCrmOrder.diamond_skus &&
              selectedCrmOrder.diamond_skus.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">💎</span>
                  <span className="text-gray-600">
                    SKU: {selectedCrmOrder.diamond_skus.join(", ")}
                  </span>
                </div>
              )}
            {selectedCrmOrder.company_name && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">🏢</span>
                <span className="text-gray-600">
                  {selectedCrmOrder.company_name}
                </span>
              </div>
            )}
            {selectedCrmOrder.special_notes && (
              <div className="flex items-center gap-2 md:col-span-2">
                <span className="text-gray-400">📝</span>
                <span className="text-gray-600">
                  {selectedCrmOrder.special_notes}
                </span>
              </div>
            )}
            {selectedCrmOrder.diamond_cut && (
              <div className="flex items-center gap-2">
                <span className="text-gray-400">✂️</span>
                <span className="text-gray-600">
                  Cut: {selectedCrmOrder.diamond_cut}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          className="rounded-lg"
          variant="outline"
          onClick={onSuccess}
        >
          Cancel
        </Button>
        <Button type="submit" className="rounded-lg">
          {editingCertificate ? "Update Certificate" : "Create Certificate"}
        </Button>
      </div>
    </form>
  );
};
