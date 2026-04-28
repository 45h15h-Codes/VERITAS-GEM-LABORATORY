// import React, { useState } from "react";
// import { CreditCard, AlertCircle, X, Shield, Package } from "lucide-react";

// interface Certificate {
//   id?: number;
//   certificate_number: string;
//   title: string;
//   [key: string]: any;
// }

// interface PaymentModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   certificate: Certificate;
// }

// const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

// export const PaymentModal: React.FC<PaymentModalProps> = ({
//   isOpen,
//   onClose,
//   certificate,
// }) => {
//   const [step, setStep] = useState<"form" | "processing">("form");
//   const [formData, setFormData] = useState({
//     client_name: "",
//     email: "",
//     mobile: "",
//     address: "",
//   });
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setStep("processing");

//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/api/certificates/${certificate.id}/physical-orders`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             client_name: formData.client_name.trim(),
//             email: formData.email.trim(),
//             mobile: formData.mobile.trim(),
//             address: formData.address.trim(),
//           }),
//         }
//       );

//       // If the backend returned an error status, try to parse and show it
//       if (!response.ok) {
//         const errorText = await response.text();
//         let errorMessage = "Failed to process payment request.";
//         try {
//           const errorData = JSON.parse(errorText);
//           errorMessage = errorData.message || errorMessage;
//         } catch {
//           errorMessage = errorText || errorMessage;
//         }
//         throw new Error(errorMessage);
//       }

//       const data = await response.json();
//       const approval_url = data?.approval_url || data?.approvalUrl || data?.approvalUrl;

//       if (!approval_url) {
//         throw new Error("Missing approval URL from payment provider.");
//       }

//       // Redirect the browser to PayPal approval URL
//       window.location.href = approval_url;
//       return;
//     } catch (err: unknown) {
//       const errorMessage =
//         err instanceof Error
//           ? err.message
//           : "We could not start the PayPal checkout. Please check your details and try again.";
//       setError(errorMessage);
//       setStep("form");
//     }
//   };

//   const handleClose = () => {
//     setStep("form");
//     setFormData({
//       client_name: "",
//       email: "",
//       mobile: "",
//       address: "",
//     });
//     setError(null);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b border-slate-200/50 p-8 rounded-t-2xl flex justify-between items-center z-10">
//           <div>
//             <h2 className="text-3xl font-light text-slate-900 tracking-tight mb-1">
//               Purchase Physical Certificate
//             </h2>
//             <p className="text-sm font-light text-slate-500 tracking-wide">
//               Securely delivered to your doorstep
//             </p>
//           </div>
//           <button
//             onClick={handleClose}
//             className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-lg hover:bg-slate-100"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         <div className="p-8">
//           {step === "form" && (
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Certificate Summary */}
//               <div className="relative p-6 bg-gradient-to-br from-slate-50 to-white border border-slate-200/50 rounded-xl overflow-hidden">
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-100/30 to-transparent rounded-full blur-2xl"></div>
//                 <div className="relative space-y-3">
//                   <div className="flex items-start justify-between">
//                     <div className="flex items-center space-x-3">
//                       <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#465B5D] via-[#597678] to-[#465B5D] flex items-center justify-center shadow-lg">
//                         <Package className="w-5 h-5 text-white" />
//                       </div>
//                       <div>
//                         <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
//                           Certificate
//                         </p>
//                         <p className="text-sm font-medium text-slate-900">
//                           {certificate.certificate_number}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
//                         Total
//                       </p>
//                       <p className="text-2xl font-light text-slate-900">
//                         $25.00
//                       </p>
//                     </div>
//                   </div>
//                   <div className="pt-3 border-t border-slate-200/50">
//                     <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
//                       Item
//                     </p>
//                     <p className="text-sm font-light text-slate-900">
//                       {certificate.title}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Form Fields */}
//               <div className="space-y-5">
//                 {/* Full Name */}
//                 <div>
//                   <label className="block text-sm font-light text-slate-700 mb-2 tracking-wide">
//                     Full Name <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.client_name}
//                     onChange={(e) =>
//                       setFormData({ ...formData, client_name: e.target.value })
//                     }
//                     placeholder="John Doe"
//                     required
//                     className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 focus:outline-none transition-all font-light text-slate-900 placeholder:text-slate-400"
//                   />
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-light text-slate-700 mb-2 tracking-wide">
//                     Email Address <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) =>
//                       setFormData({ ...formData, email: e.target.value })
//                     }
//                     placeholder="john@example.com"
//                     required
//                     className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 focus:outline-none transition-all font-light text-slate-900 placeholder:text-slate-400"
//                   />
//                 </div>

//                 {/* Mobile */}
//                 <div>
//                   <label className="block text-sm font-light text-slate-700 mb-2 tracking-wide">
//                     Mobile Number <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="tel"
//                     value={formData.mobile}
//                     onChange={(e) =>
//                       setFormData({ ...formData, mobile: e.target.value })
//                     }
//                     placeholder="+1 (555) 123-4567"
//                     required
//                     className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 focus:outline-none transition-all font-light text-slate-900 placeholder:text-slate-400"
//                   />
//                 </div>

//                 {/* Address */}
//                 <div>
//                   <label className="block text-sm font-light text-slate-700 mb-2 tracking-wide">
//                     Shipping Address <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     value={formData.address}
//                     onChange={(e) =>
//                       setFormData({ ...formData, address: e.target.value })
//                     }
//                     placeholder="123 Main St, City, State, ZIP Code"
//                     required
//                     rows={3}
//                     className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 focus:outline-none transition-all font-light text-slate-900 placeholder:text-slate-400 resize-none"
//                   />
//                 </div>
//               </div>

//               {/* Error Message */}
//               {error && (
//                 <div className="flex items-start space-x-3 rounded-xl border border-red-200 bg-red-50 p-4">
//                   <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
//                   <span className="text-sm font-light text-red-700 leading-relaxed">
//                     {error}
//                   </span>
//                 </div>
//               )}

//               {/* Payment Info */}
//               <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50 rounded-xl p-5">
//                 <div className="flex items-start space-x-3">
//                   <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg">
//                     <Shield className="w-5 h-5 text-white" />
//                   </div>
//                   <div className="flex-1">
//                     <p className="font-medium text-blue-900 mb-1 tracking-wide">
//                       Secure Payment
//                     </p>
//                     <p className="text-sm font-light text-blue-800 leading-relaxed">
//                       You will be redirected to PayPal to complete your purchase
//                       securely. Your payment information is protected with
//                       industry-standard encryption.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-slate-200/50">
//                 <button
//                   type="button"
//                   onClick={handleClose}
//                   className="px-8 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="flex items-center justify-center space-x-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#465B5D] via-[#597678] to-[#465B5D] text-white font-medium shadow-lg hover:shadow-xl hover:from-[#465B5D] hover:via-[#465B5D] hover:to-[#465B5D] transition-all duration-300"
//                 >
//                   <CreditCard className="w-5 h-5" />
//                   <span className="tracking-wide">Proceed to Payment</span>
//                 </button>
//               </div>
//             </form>
//           )}

//           {step === "processing" && (
//             <div className="text-center py-20">
//               <div className="inline-block relative mb-8">
//                 <div className="w-20 h-20 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
//                 <div
//                   className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-amber-300 rounded-full animate-spin"
//                   style={{
//                     animationDirection: "reverse",
//                     animationDuration: "1s",
//                   }}
//                 ></div>
//               </div>
//               <h3 className="text-3xl font-light text-slate-900 mb-3 tracking-tight">
//                 Processing Payment
//               </h3>
//               <p className="text-slate-600 font-light leading-relaxed max-w-md mx-auto">
//                 Please wait while we securely connect you to PayPal. Do not
//                 close this window.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };


import React, { useState } from "react";
import { CreditCard, AlertCircle, X, Shield, Package } from "lucide-react";

interface Certificate {
  id?: number;
  certificate_number: string;
  title: string;
  [key: string]: any;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  certificate,
}) => {
  const [step, setStep] = useState<"form" | "processing">("form");
  const [formData, setFormData] = useState({
    client_name: "",
    email: "",
    mobile: "",
    address: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStep("processing");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/certificates/${certificate.id}/physical-orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_name: formData.client_name.trim(),
            email: formData.email.trim(),
            mobile: formData.mobile.trim(),
            address: formData.address.trim(),
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Failed to process payment request.";
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const approval_url = data?.approval_url || data?.approvalUrl;

      if (!approval_url) {
        throw new Error("Missing approval URL from payment provider.");
      }

      window.location.href = approval_url;
      return;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "We could not start the PayPal checkout. Please try again.";
      setError(errorMessage);
      setStep("form");
    }
  };

  const handleClose = () => {
    setStep("form");
    setFormData({
      client_name: "",
      email: "",
      mobile: "",
      address: "",
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header - Responsive */}
        <div className="sticky top-0 bg-white border-b border-slate-200/50 p-5 sm:p-6 md:p-8 rounded-t-xl sm:rounded-t-2xl flex justify-between items-start z-10">
          <div className="pr-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-slate-900 tracking-tight mb-1">
              Purchase Physical Certificate
            </h2>
            <p className="text-xs sm:text-sm font-light text-slate-500 tracking-wide">
              Securely delivered to your doorstep
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-lg hover:bg-slate-100 flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-5 sm:p-6 md:p-8">
          {step === "form" && (
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Certificate Summary - Responsive */}
              <div className="relative p-4 sm:p-5 md:p-6 bg-gradient-to-br from-slate-50 to-white border border-slate-200/50 rounded-xl overflow-hidden">
                <div className="relative space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-[#465B5D] via-[#597678] to-[#465B5D] flex items-center justify-center shadow-lg flex-shrink-0">
                        <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mb-1">
                          Certificate
                        </p>
                        <p className="text-xs sm:text-sm font-medium text-slate-900 truncate">
                          {certificate.certificate_number}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mb-1">
                        Total
                      </p>
                      <p className="text-xl sm:text-2xl font-light text-slate-900">
                        $25.00
                      </p>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-200/50">
                    <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mb-1">
                      Item
                    </p>
                    <p className="text-xs sm:text-sm font-light text-slate-900 truncate">
                      {certificate.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields - Responsive */}
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-xs sm:text-sm font-light text-slate-700 mb-2 tracking-wide">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.client_name}
                    onChange={(e) =>
                      setFormData({ ...formData, client_name: e.target.value })
                    }
                    placeholder="John Doe"
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 focus:outline-none transition-all font-light text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-light text-slate-700 mb-2 tracking-wide">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 focus:outline-none transition-all font-light text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-light text-slate-700 mb-2 tracking-wide">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) =>
                      setFormData({ ...formData, mobile: e.target.value })
                    }
                    placeholder="+1 (555) 123-4567"
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 focus:outline-none transition-all font-light text-slate-900 placeholder:text-slate-400 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-light text-slate-700 mb-2 tracking-wide">
                    Shipping Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="123 Main St, City, State, ZIP"
                    required
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 focus:outline-none transition-all font-light text-slate-900 placeholder:text-slate-400 resize-none text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start space-x-2 sm:space-x-3 rounded-xl border border-red-200 bg-red-50 p-3 sm:p-4">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 text-red-600 mt-0.5" />
                  <span className="text-xs sm:text-sm font-light text-red-700 leading-relaxed">
                    {error}
                  </span>
                </div>
              )}

              {/* Payment Info */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50 rounded-xl p-4 sm:p-5">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-blue-900 mb-1 tracking-wide text-sm sm:text-base">
                      Secure Payment
                    </p>
                    <p className="text-xs sm:text-sm font-light text-blue-800 leading-relaxed">
                      You will be redirected to PayPal to complete your purchase securely.
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons - Stack on mobile */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 sm:pt-6 border-t border-slate-200/50">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-all duration-300 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center space-x-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#465B5D] via-[#597678] to-[#465B5D] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
                >
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="tracking-wide">Proceed to Payment</span>
                </button>
              </div>
            </form>
          )}

          {step === "processing" && (
            <div className="text-center py-12 sm:py-16 md:py-20">
              <div className="inline-block relative mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-light text-slate-900 mb-2 sm:mb-3 tracking-tight">
                Processing Payment
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-light leading-relaxed max-w-md mx-auto px-4">
                Please wait while we securely connect you to PayPal. Do not close this window.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};