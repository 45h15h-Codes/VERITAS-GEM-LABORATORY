import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CreditCard,
  FileText,
  LogOut,
  Package,
  Plus,
  BarChart,
  Truck,
  ClipboardList,
  TrendingUp,
  Clock,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CertificateList } from "../components/CertificateList";
import { PaymentList } from "../components/PaymentList";
import { CertificateForm } from "../components/CertificateForm";
import { BlogList } from "../components/BlogList";
import { BlogForm } from "../components/BlogForm";
import { BlogView } from "../components/BlogView";
import { Modal } from "../components/Modal";
import Swal from "sweetalert2";

type TabType = "overview" | "certificates" | "payments" | "tracking" | "blogs";

type TrackingStatus =
  | "processing"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "delayed";

interface TrackingShipment {
  trackingNumber: string;
  orderId: string;
  client: string;
  destination: string;
  status: TrackingStatus;
  eta: string;
  lastMilestone: string;
  lastUpdatedAt: string;
}

interface TrackingActivity {
  id: string;
  timestamp: string;
  title: string;
  detail: string;
  status: TrackingStatus | "synced";
}

const TRACKING_OVERVIEW = {
  totalShipments: 128,
  inTransit: 42,
  outForDelivery: 12,
  delivered: 68,
  delayed: 6,
  onTimePercentage: 92,
  avgTransitTime: "4.2 days",
  manualUpdatesThisWeek: 18,
  awaitingDispatch: 8,
  lastSync: "Oct 17, 2025 · 09:45 AM",
};

const TRACKING_STATUS_DISTRIBUTION = [
  { label: "Delivered", value: 68, color: "bg-emerald-500" },
  { label: "In Transit", value: 42, color: "bg-sky-500" },
  { label: "Out for Delivery", value: 12, color: "bg-amber-500" },
  { label: "Delayed", value: 6, color: "bg-rose-500" },
];

const TRACKING_SHIPMENTS: TrackingShipment[] = [
  {
    trackingNumber: "VGL-192837465",
    orderId: "VGL-2025-1042",
    client: "Aria Jewelry",
    destination: "New York, USA",
    status: "out_for_delivery",
    eta: "Oct 20, 2025",
    lastMilestone: "Departed distribution center · Newark, NJ",
    lastUpdatedAt: "Oct 17, 2025 · 08:55 AM",
  },
  {
    trackingNumber: "VGL-857493620",
    orderId: "VGL-2025-1027",
    client: "Nova Gems",
    destination: "Toronto, CA",
    status: "in_transit",
    eta: "Oct 22, 2025",
    lastMilestone: "Arrived at customs · Toronto Gateway",
    lastUpdatedAt: "Oct 16, 2025 · 05:12 PM",
  },
  {
    trackingNumber: "VGL-493856720",
    orderId: "VGL-2025-1009",
    client: "Kairo Boutique",
    destination: "Dubai, UAE",
    status: "delayed",
    eta: "Oct 24, 2025",
    lastMilestone: "Held for documentation · DXB Hub",
    lastUpdatedAt: "Oct 15, 2025 · 11:34 AM",
  },
  {
    trackingNumber: "VGL-028374956",
    orderId: "VGL-2025-0998",
    client: "Luna Accessories",
    destination: "Austin, USA",
    status: "delivered",
    eta: "Oct 14, 2025",
    lastMilestone: "Delivered · Signed by M. Diaz",
    lastUpdatedAt: "Oct 14, 2025 · 02:18 PM",
  },
  {
    trackingNumber: "VGL-675849302",
    orderId: "VGL-2025-0993",
    client: "Sapphire Co.",
    destination: "Sydney, AU",
    status: "processing",
    eta: "Oct 23, 2025",
    lastMilestone: "Label generated · Awaiting carrier pickup",
    lastUpdatedAt: "Oct 17, 2025 · 07:05 AM",
  },
  {
    trackingNumber: "VGL-948576203",
    orderId: "VGL-2025-1011",
    client: "Gemstone Hub",
    destination: "London, UK",
    status: "in_transit",
    eta: "Oct 21, 2025",
    lastMilestone: "Departed facility · Heathrow Logistics",
    lastUpdatedAt: "Oct 16, 2025 · 11:02 PM",
  },
];

const TRACKING_ACTIVITY: TrackingActivity[] = [
  {
    id: "activity-1",
    timestamp: "Oct 17, 2025 · 09:20 AM",
    title: "Manual update added",
    detail: "Out for delivery — Aria Jewelry (VGL-192837465)",
    status: "out_for_delivery",
  },
  {
    id: "activity-2",
    timestamp: "Oct 17, 2025 · 08:10 AM",
    title: "Carrier scan received",
    detail: "Shipment cleared customs — Nova Gems (VGL-857493620)",
    status: "in_transit",
  },
  {
    id: "activity-3",
    timestamp: "Oct 16, 2025 · 10:45 PM",
    title: "System sync completed",
    detail: "18 tracking records synchronized from courier API",
    status: "synced",
  },
  {
    id: "activity-4",
    timestamp: "Oct 16, 2025 · 05:55 PM",
    title: "Delay flagged",
    detail: "Documentation required — Kairo Boutique (VGL-493856720)",
    status: "delayed",
  },
  {
    id: "activity-5",
    timestamp: "Oct 16, 2025 · 03:30 PM",
    title: "Delivered",
    detail: "Signed by recipient — Luna Accessories (VGL-028374956)",
    status: "delivered",
  },
];

interface AdminDashboardProps {
  onBackToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({}) => {
  const { logout, user } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [viewingBlog, setViewingBlog] = useState<any | null>(null);
  const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

  // Fetch certificates, payments, and blogs from backend
  const fetchData = () => {
    axios
      .get(`${API_BASE_URL}/api/certificates`)
      .then((res) => setCertificates(res.data))
      .catch(() => setCertificates([]));
    axios
      .get(`${API_BASE_URL}/api/payments`)
      .then((res) => setPayments(res.data))
      .catch(() => setPayments([]));
    fetchBlogs();
  };

  const fetchBlogs = () => {
    const token = localStorage.getItem("jewelry_admin_token");
    axios
      .get(`${API_BASE_URL}/api/admin/blogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setBlogs(res.data))
      .catch(() => setBlogs([]));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Refetch after adding a certificate
  useEffect(() => {
    if (!showAddModal) {
      fetchData();
    }
  }, [showAddModal]);

  // Refetch after adding/editing a blog
  useEffect(() => {
    if (!showBlogModal) {
      fetchBlogs();
      setEditingBlog(null);
    }
  }, [showBlogModal]);

  const handleEditBlog = (blog: any) => {
    setEditingBlog(blog);
    setShowBlogModal(true);
  };

  const handleViewBlog = (blog: any) => {
    setViewingBlog(blog);
  };

  const handleDeleteBlog = async (id: number) => {
    try {
      const token = localStorage.getItem("jewelry_admin_token");
      await axios.delete(`${API_BASE_URL}/api/admin/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchBlogs();
      Swal.fire({
        title: "Deleted!",
        text: "Blog post has been deleted successfully.",
        icon: "success",
        confirmButtonColor: "#f59e0b",
        background: "#fff8e1",
        customClass: { popup: "rounded-2xl shadow-xl" },
      });
    } catch (error) {
      console.error("Error deleting blog:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete blog post.",
        icon: "error",
        confirmButtonColor: "#f59e0b",
        background: "#fff8e1",
        customClass: { popup: "rounded-2xl shadow-xl" },
      });
    }
  };

  const activeCertificates = certificates.filter((cert) => !cert.deleted_at);
  const totalSales = payments
    .filter((p) => p.status === "completed" || p.status === "shipped")
    .reduce((sum, p) => sum + p.amount, 0);

  const recentPayments = [...payments]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(0, 5);

  const shipmentStatusConfig: Record<
    TrackingStatus,
    { label: string; className: string }
  > = {
    processing: { label: "Processing", className: "bg-gray-100 text-gray-700" },
    in_transit: { label: "In Transit", className: "bg-sky-100 text-sky-700" },
    out_for_delivery: {
      label: "Out for Delivery",
      className: "bg-amber-100 text-amber-700",
    },
    delivered: {
      label: "Delivered",
      className: "bg-emerald-100 text-emerald-700",
    },
    delayed: { label: "Delayed", className: "bg-rose-100 text-rose-700" },
  };

  const activityStatusConfig: Record<
    TrackingActivity["status"],
    { border: string; badge: string; label: string }
  > = {
    processing: {
      border: "border-gray-200",
      badge: "bg-gray-100 text-gray-700",
      label: "Processing",
    },
    in_transit: {
      border: "border-sky-200",
      badge: "bg-sky-100 text-sky-700",
      label: "In Transit",
    },
    out_for_delivery: {
      border: "border-amber-200",
      badge: "bg-amber-100 text-amber-700",
      label: "Out for Delivery",
    },
    delivered: {
      border: "border-emerald-200",
      badge: "bg-emerald-100 text-emerald-700",
      label: "Delivered",
    },
    delayed: {
      border: "border-rose-200",
      badge: "bg-rose-100 text-rose-700",
      label: "Delayed",
    },
    synced: {
      border: "border-indigo-200",
      badge: "bg-indigo-100 text-indigo-700",
      label: "Synced",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50 to-yellow-50">
      <nav className="sticky top-0 z-20 bg-transperent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => (window.location.href = "/")}
              onKeyDown={(e) => {
                if (e.key === "Enter") window.location.href = "/";
              }}
            >
              <img
                src={`${API_BASE_URL}/images/VGL-LOGO.svg`}
                alt="Logo"
                className="w-14 h-14 rounded-full shadow-xl object-cover"
              />
              <div>
                <h1 className="text-xl font-bold"> VGL </h1>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div
                role="button"
                onClick={logout}
                className="px-6 py-3 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed from-amber-400 to-yellow-500 text-black hover:from-amber-500 hover:to-yellow-600 hover:shadow-xl flex items-center space-x-2 rounded-full bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 mb-8 border-b-2 border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-3 font-medium transition-all duration-300 ${
              activeTab === "overview"
                ? "border-b-4 border-amber-400 text-amber-600"
                : "text-gray-600 hover:text-amber-600"
            }`}
          >
            <BarChart className="w-5 h-5 inline mr-2" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab("certificates")}
            className={`px-6 py-3 font-medium transition-all duration-300 ${
              activeTab === "certificates"
                ? "border-b-4 border-amber-400 text-amber-600"
                : "text-gray-600 hover:text-amber-600"
            }`}
          >
            <FileText className="w-5 h-5 inline mr-2" />
            Certificates
          </button>

          <button
            onClick={() => setActiveTab("blogs")}
            className={`px-6 py-3 font-medium transition-all duration-300 ${
              activeTab === "blogs"
                ? "border-b-4 border-amber-400 text-amber-600"
                : "text-gray-600 hover:text-amber-600"
            }`}
          >
            <BookOpen className="w-5 h-5 inline mr-2" />
            Blog
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`px-6 py-3 font-medium transition-all duration-300 ${
              activeTab === "payments"
                ? "border-b-4 border-amber-400 text-amber-600"
                : "text-gray-600 hover:text-amber-600"
            }`}
          >
            <CreditCard className="w-5 h-5 inline mr-2" />
            Payments
          </button>

          {/* <button
            onClick={() => setActiveTab("tracking")}
            className={`px-6 py-3 font-medium transition-all duration-300 ${
              activeTab === "tracking"
                ? "border-b-4 border-amber-400 text-amber-600"
                : "text-gray-600 hover:text-amber-600"
            }`}
          >
            <Truck className="w-5 h-5 inline mr-2" />
            Tracking
          </button> */}
        </div>

        {activeTab === "overview" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">
                      Total Certificates
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {activeCertificates.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Sales</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${totalSales.toFixed(2)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Shipped</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {payments.filter((p) => p.status === "shipped").length}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Completed</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {payments.filter((p) => p.status === "completed").length}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Failed</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {payments.filter((p) => p.status === "failed").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-900">
                Recent Payments
              </h2>
              {recentPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-amber-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Client
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPayments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-b border-gray-100 hover:bg-amber-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm">
                            {payment.client_name}
                          </td>
                          <td className="px-4 py-3 text-sm">{payment.email}</td>
                          <td className="px-4 py-3 text-sm font-semibold">
                            ${payment.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                payment.status === "shipped"
                                  ? "bg-blue-100 text-blue-700"
                                  : payment.status === "completed"
                                    ? "bg-green-100 text-green-700"
                                    : payment.status === "failed" ||
                                        payment.status === "cancelled"
                                      ? "bg-red-100 text-red-700"
                                      : payment.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No payments yet
                </p>
              )}
            </Card>
          </div>
        )}

        {activeTab === "certificates" && (
          <div>
            <div className="mb-6 flex justify-end">
              <Button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 rounded-lg"
              >
                <Plus className="w-5 h-5 " />
                <span>Add Certificate</span>
              </Button>
            </div>
            <CertificateList certificates={certificates} />
          </div>
        )}

        {activeTab === "payments" && <PaymentList payments={payments} />}

        {activeTab === "tracking" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">
                      Total Shipments (30 days)
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {TRACKING_OVERVIEW.totalShipments}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Last sync · {TRACKING_OVERVIEW.lastSync}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                    <ClipboardList className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">In Transit</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {TRACKING_OVERVIEW.inTransit}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {TRACKING_OVERVIEW.awaitingDispatch} awaiting pickup
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Delivered</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {TRACKING_OVERVIEW.delivered}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {TRACKING_OVERVIEW.manualUpdatesThisWeek} manual updates
                      this week
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">
                      On-Time Delivery
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {TRACKING_OVERVIEW.onTimePercentage}%
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Avg transit {TRACKING_OVERVIEW.avgTransitTime}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-300 to-orange-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <Card className="p-6 xl:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Active Shipments
                    </h2>
                    <p className="text-sm text-gray-500">
                      Snapshot of shipments that still need attention
                    </p>
                  </div>
                  <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                    Manual entries ready to go dynamic
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-amber-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Tracking No.
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Client
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Destination
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          ETA
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Last update
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {TRACKING_SHIPMENTS.map((shipment) => (
                        <tr
                          key={shipment.trackingNumber}
                          className="border-b border-gray-100 hover:shadow-xl  hover:bg-amber-50 transition-colors"
                        >
                          <td className="px-4 py-3 text-sm font-mono text-gray-900">
                            {shipment.trackingNumber}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {shipment.client}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {shipment.destination}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {shipment.eta}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                shipmentStatusConfig[shipment.status].className
                              }`}
                            >
                              {shipmentStatusConfig[shipment.status].label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            <p className="text-gray-700">
                              {shipment.lastMilestone}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {shipment.lastUpdatedAt}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Status Distribution
                </h2>
                <div className="space-y-5">
                  {TRACKING_STATUS_DISTRIBUTION.map((item) => {
                    const percentage = Math.round(
                      (item.value / TRACKING_OVERVIEW.totalShipments) * 100,
                    );
                    return (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span className="font-medium text-gray-800">
                            {item.label}
                          </span>
                          <span>
                            {item.value} | {percentage}%
                          </span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8 bg-amber-50 border border-amber-100 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-8 h-8 text-amber-500" />
                    <div>
                      <p className="text-sm font-semibold text-amber-700">
                        Upcoming manual check-in
                      </p>
                      <p className="text-xs text-amber-600">
                        Review delayed shipments and confirm courier updates
                        before EOD.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Tracking Activity
                </h2>
                <span className="text-xs uppercase tracking-wide text-gray-400">
                  Manual + courier feed
                </span>
              </div>
              <div className="space-y-5">
                {TRACKING_ACTIVITY.map((activity) => (
                  <div
                    key={activity.id}
                    className={`border ${
                      activityStatusConfig[activity.status].border
                    } rounded-lg p-4 bg-white shadow-sm`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-400">
                          {activity.timestamp}
                        </p>
                        <p className="text-base font-semibold text-gray-900 mt-1">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.detail}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activityStatusConfig[activity.status].badge
                        }`}
                      >
                        {activityStatusConfig[activity.status].label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === "blogs" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Blogs</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {blogs.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Published</p>
                    <p className="text-3xl font-bold text-green-600">
                      {blogs.filter((b) => b.status === "published").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Drafts</p>
                    <p className="text-3xl font-bold text-amber-600">
                      {blogs.filter((b) => b.status === "draft").length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </Card>
            </div>

            <div className="mb-6 flex justify-end">
              <Button
                onClick={() => {
                  setEditingBlog(null);
                  setShowBlogModal(true);
                }}
                className="flex items-center space-x-2 rounded-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Blog</span>
              </Button>
            </div>

            <BlogList
              blogs={blogs}
              onView={handleViewBlog}
              onEdit={handleEditBlog}
              onDelete={handleDeleteBlog}
            />
          </div>
        )}
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Certificate"
        maxWidth="max-w-4xl"
      >
        <CertificateForm
          onSuccess={() => {
            setShowAddModal(false);
            fetchData(); // Immediately fetch updated data
          }}
        />
      </Modal>

      <Modal
        isOpen={showBlogModal}
        onClose={() => {
          setShowBlogModal(false);
          setEditingBlog(null);
        }}
        title={editingBlog ? "Edit Blog" : "Create New Blog"}
        maxWidth="max-w-4xl"
      >
        <BlogForm
          blog={editingBlog}
          onSuccess={() => setShowBlogModal(false)}
        />
      </Modal>

      {viewingBlog && (
        <BlogView blog={viewingBlog} onClose={() => setViewingBlog(null)} />
      )}
    </div>
  );
};
