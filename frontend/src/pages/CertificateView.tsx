// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Download, ShoppingCart, Award, X } from 'lucide-react';
// import axios from 'axios';
// import { Button } from '../components/Button';
// import { Card } from '../components/Card';
// import { PaymentModal } from '../components/PaymentModal';
// import CertificateDownload from '../components/CertificateDownload';

// interface CertificateViewProps {
//   certificateNumber: string;
//   onBack: () => void;
// }

// const API_BASE_URL = import.meta.env.VITE_BASE_URL || "https://api.vgllab.com";


// export const CertificateView: React.FC<CertificateViewProps> = ({ certificateNumber, onBack }) => {
//   const [certificate, setCertificate] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [showDownloadModal, setShowDownloadModal] = useState(false);

//   useEffect(() => {
//     setLoading(true);
//     axios.get(`${API_BASE_URL}/api/certificates`)
//       .then(res => {
//         // If API returns an array, find the correct certificate
//         const found = Array.isArray(res.data)
//           ? res.data.find((cert: any) => cert.certificate_number === certificateNumber)
//           : res.data;
//         setCertificate(found || null);
//       })
//       .catch(() => setCertificate(null))
//       .finally(() => setLoading(false));
//   }, [certificateNumber]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-200">
//         <Card className="p-12 rounded-3xl border-4 border-amber-300 shadow-2xl">
//           <p className="text-2xl text-amber-700 font-bold mb-4">Wait While We Fetch Your certificate...</p>
//         </Card>
//       </div>
//     );
//   }

//   if (!certificate) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-200 flex items-center justify-center p-4">
//         <Card className="p-12 rounded-3xl border-4 border-amber-300 shadow-2xl">
//           <p className="text-2xl text-amber-700 font-bold mb-4">Certificate not found</p>
//           <Button onClick={onBack} className="mt-4 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-amber-400 to-yellow-500 text-black border-2 border-amber-300 rounded-xl shadow-lg">
//             Go Back
//           </Button>
//         </Card>
//       </div>
//     );
//   }

//   const handleDownloadPDF = () => {
//     // Open the download modal with certificate preview
//     setShowDownloadModal(true);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-200 font-serif">
//       <nav className="sticky top-0 z-20 bg-gradient-to-r from-black to-gray-900 text-white shadow-2xl">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center">
//           <button
//             onClick={onBack}
//             className="flex items-center space-x-3 text-amber-400 hover:text-amber-500 transition-colors text-xl font-semibold"
//           >
//             <ArrowLeft className="w-6 h-6" />
//             <span>Back to Search</span>
//           </button>
//         </div>
//       </nav>

//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <Card className="overflow-hidden rounded-3xl border-amber-300 shadow-2xl">
//           <div className="bg-gradient-to-r from-amber-400 to-yellow-500 px-12 py-10 text-center rounded-t-3xl border-b-4 border-amber-300">
//             {/* <div className="flex justify-center mb-6">
//               <Shield className="w-20 h-20 text-black" />
//             </div> */}
//             <h1 className="text-5xl font-extrabold text-black mb-4 tracking-wide drop-shadow-xl">Certificate of Authenticity</h1>
//             <p className="text-2xl text-gray-900 font-semibold">{certificate.certificate_number}</p>
//           </div>

//           <div className="p-12">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//               {certificate.image && (
//                 <div>
//                   <img
//                     src={`${API_BASE_URL}/${certificate.image}`}
//                     alt={certificate.title}
//                     className="w-full h-96 object-cover rounded-2xl shadow-2xl border-4 border-amber-200"
//                   />
//                 </div>
//               )}

//               <div className={certificate.image ? '' : 'md:col-span-2'}>
//                 <h2 className="text-4xl font-bold text-amber-600 mb-8 tracking-wide">{certificate.title}</h2>

//                 <div className="space-y-6">
//                   <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl border-2 border-amber-300 shadow-lg">
//                     <Award className="w-8 h-8 text-amber-500" />
//                     <div>
//                       <p className="text-lg text-gray-600">Certifier</p>
//                       <p className="font-semibold text-gray-900 text-xl">{certificate.certifier_name}</p>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-6">
//                     <div className="p-6 bg-white border-2 border-amber-200 rounded-xl shadow">
//                       <p className="text-lg text-gray-600">Store</p>
//                       <p className="font-semibold text-gray-900 text-xl">{certificate.store_name}</p>
//                     </div>
//                     <div className="p-6 bg-white border-2 border-amber-200 rounded-xl shadow">
//                       <p className="text-lg text-gray-600">Date</p>
//                       <p className="font-semibold text-gray-900 text-xl">{new Date(certificate.date).toLocaleDateString()}</p>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-2 gap-6">
//                     <div className="p-6 bg-white border-2 border-amber-200 rounded-xl shadow">
//                       <p className="text-lg text-gray-600">Item</p>
//                       <p className="font-semibold text-gray-900 text-xl">{certificate.item}</p>
//                     </div>
//                     <div className="p-6 bg-white border-2 border-amber-200 rounded-xl shadow">
//                       <p className="text-lg text-gray-600">Weight</p>
//                       <p className="font-semibold text-gray-900 text-xl">{certificate.weight}</p>
//                     </div>
//                   </div>

//                   {certificate.gem_stone && (
//                     <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl shadow-lg">
//                       <p className="text-lg text-gray-600 mb-4">Gemstone Details</p>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <p className="text-md text-gray-500">Stone</p>
//                           <p className="font-semibold text-gray-900 text-lg">{certificate.gem_stone}</p>
//                         </div>
//                         {certificate.carat_weight && (
//                           <div>
//                             <p className="text-md text-gray-500">Carat</p>
//                             <p className="font-semibold text-gray-900 text-lg">{certificate.carat_weight} ct</p>
//                           </div>
//                         )}
//                         {certificate.color && (
//                           <div>
//                             <p className="text-md text-gray-500">Color</p>
//                             <p className="font-semibold text-gray-900 text-lg">{certificate.color}</p>
//                           </div>
//                         )}
//                         {certificate.clarity && (
//                           <div>
//                             <p className="text-md text-gray-500">Clarity</p>
//                             <p className="font-semibold text-gray-900 text-lg">{certificate.clarity}</p>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   <div className="grid grid-cols-2 gap-6">
//                     <div className="p-6 bg-white border-2 border-amber-200 rounded-xl shadow">
//                       <p className="text-lg text-gray-600">Metal Purity</p>
//                       <p className="font-semibold text-gray-900 text-xl">{certificate.metal_purity}</p>
//                     </div>
//                     <div className="p-6 bg-gradient-to-br from-green-100 to-emerald-100 border-2 border-green-300 rounded-xl shadow-lg">
//                       <p className="text-lg text-gray-600">Certified Value</p>
//                       <p className="text-3xl font-bold text-green-600">
//                         ${Number(certificate.value || 0).toFixed(2)}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-12 flex flex-col sm:flex-row gap-6">
//               <Button onClick={handleDownloadPDF} className="flex-1 flex items-center justify-center space-x-3 px-8 py-4 text-lg font-bold bg-gradient-to-r from-amber-400 to-yellow-500 text-black border-2 border-amber-300 rounded-xl shadow-lg">
//                 <Download className="w-6 h-6" />
//                 <span>Download PDF Certificate</span>
//               </Button>
//               <Button
//                 onClick={() => setShowPaymentModal(true)}
//                 variant="secondary"
//                 className="flex-1 flex items-center justify-center space-x-3 px-8 py-4 text-lg font-bold border-2 border-amber-300 rounded-xl shadow-lg"
//               >
//                 <ShoppingCart className="w-6 h-6" />
//                 <span>Buy Physical Copy of Certificate</span>
//               </Button>
//             </div>

//             <div className="mt-8 p-8 bg-gradient-to-br from-amber-100 to-yellow-100 border-2 border-amber-300 rounded-2xl shadow-lg">
//               <p className="text-lg text-gray-700 text-center font-light">
//                 This certificate confirms the authenticity and quality of the jewelry item described above.
//                 <br />
//                 Certificate issued on {new Date(certificate.created_at).toLocaleDateString()}
//               </p>
//             </div>
//           </div>
//         </Card>
//       </div>

//       <PaymentModal
//         isOpen={showPaymentModal}
//         onClose={() => setShowPaymentModal(false)}
//         certificate={certificate}
//       />

//       {/* Download Modal */}
//       {showDownloadModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
//           <div className="bg-white rounded-3xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto relative">
//             <div className="sticky top-0 bg-gradient-to-r from-amber-400 to-yellow-500 p-6 rounded-t-3xl border-b-4 border-amber-300 flex justify-between items-center z-10">
//               <h2 className="text-3xl font-bold text-black">Download Certificate</h2>
//               <button
//                 onClick={() => setShowDownloadModal(false)}
//                 className="text-black hover:text-gray-700 transition-colors p-2 rounded-full hover:bg-black hover:bg-opacity-10"
//               >
//                 <X className="w-8 h-8" />
//               </button>
//             </div>
//             <div className="p-6">
//               <CertificateDownload
//                 certificate={{
//                   id: certificate.id,
//                   certificate_number: certificate.certificate_number,
//                   store: certificate.store,
//                   date: certificate.date,
//                   item: certificate.item,
//                   length: certificate.length,
//                   weight: certificate.weight,
//                   gem_stone: certificate.gem_stone,
//                   carat_weight: certificate.carat_weight,
//                   color: certificate.color,
//                   clarity: certificate.clarity,
//                   metal_purity: certificate.metal_purity,
//                   value: certificate.value,
//                   certifier_name: certificate.certifier_name,
//                   image_url: `${API_BASE_URL}/${certificate.image}`,
//                   // image_url: certificate.image ? `${API_BASE_URL}/${certificate.image}` : undefined,
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

/* ----------------------------------------------------------------------------------------------------------------------------------------------------------------- */

// import React, { useState, useEffect } from 'react';
// import CertificateDownload from "../components/CertificateDownload";
// import { ArrowLeft, Download, ShoppingCart, Award, X, Sparkles, Shield, Calendar, Gem, ArrowDownToLine } from 'lucide-react';
// import { PaymentModal } from '../components/PaymentModal';

// interface CertificateViewProps {
//   certificateNumber: string;
//   onBack: () => void;
// }

// const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

// export const CertificateView: React.FC<CertificateViewProps> = ({ certificateNumber, onBack }) => {
//   const [certificate, setCertificate] = useState<any>(null);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [showDownloadModal, setShowDownloadModal] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     setLoading(true);
//     fetch(`${API_BASE_URL}/api/search/${certificateNumber}`)
//       .then(res => {
//         if (!res.ok) throw new Error('Certificate not found');
//         return res.json();
//       })
//       .then(data => {
//         setCertificate(data);
//       })
//       .catch((error) => {
//         console.error('Error fetching certificate:', error);
//         setCertificate(null);
//       })
//       .finally(() => setLoading(false));
//   }, [certificateNumber]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white">
//         <div className="bg-white p-12 rounded-2xl border border-slate-200/50 shadow-xl">
//           <div className="flex flex-col items-center">
//             <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-6"></div>
//             <p className="text-lg text-slate-700 font-light tracking-wide">Loading certificate...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!certificate) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-6">
//         <div className="bg-white p-12 rounded-2xl border border-slate-200/50 shadow-xl text-center max-w-md">
//           <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
//             <X className="w-8 h-8 text-red-500" />
//           </div>
//           <p className="text-2xl text-slate-900 font-light mb-3">Certificate Not Found</p>
//           <p className="text-slate-600 font-light mb-8 leading-relaxed">
//             The certificate you're looking for doesn't exist or has been removed.
//           </p>
//           <button
//             onClick={onBack}
//             className="px-8 py-3 text-sm font-medium bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//           >
//             Return to Search
//           </button>
//         </div>
//       </div>
//     );
//   }

//     const handleDownloadPDF = () => {
//       setShowDownloadModal(true);
//       };

//       return (
//       <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
//       {/* Elegant Navigation */}
//       <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm py-4' : 'bg-transparent py-6'
//         }`}>
//         <div className="max-w-7xl mx-auto px-6 lg:px-12">
//           <div className="flex justify-between items-center">
//             <div
//               className="flex items-center space-x-4 group cursor-pointer"
//               role="button"
//               tabIndex={0}
//               onClick={() => (window.location.href = '/')}
//               onKeyDown={(e) => { if (e.key === 'Enter') (window.location.href = '/'); }}
//             >
//               <div className="relative">
//                 <img
//                   src={`${API_BASE_URL}/images/VGL-LOGO.png`}
//                   alt="VGL Logo"
//                   className="w-20 h-20  rounded-full shadow-lg object-cover group-hover:shadow-xl transition-all duration-300"
//                 />
//                 <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-white opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-xl font-light  text-slate-900">VGL</span>
//                 <span className="text-[9px] font-medium tracking-[0.2em] text-slate-500 uppercase">Veritas Gem Laboratory</span>
//               </div>
//             </div>

//             <div className="hidden md:flex items-center space-x-8">
//               <button
//                 onClick={onBack}
//                 className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-light group"
//               >
//                 <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
//                 <span className="tracking-wide">Back to Search</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section with Certificate Details */}
//       <div className="relative py-16 px-6 lg:px-12 overflow-hidden">
//         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-amber-50 via-transparent to-transparent rounded-full blur-3xl opacity-30 -z-10"></div>

//         <div className="max-w-6xl mx-auto">
//           {/* Certificate Header */}
//           <div className="text-center mb-12">
//             <div className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-sm mb-6">
//               <Shield className="w-3.5 h-3.5 text-[#465B5D]" />
//               <span className="text-xs font-medium tracking-wider text-slate-700 uppercase">Verified Authenticity</span>
//             </div>
//             <h1 className="text-4xl md:text-5xl font-light tracking-tight text-slate-900 mb-4">
//               Certificate of Authenticity
//             </h1>
//             <p className="text-xl font-light text-slate-600 tracking-wide">{certificate.certificate_number}</p>
//           </div>

//           {/* Main Certificate Card */}
//           <div className="bg-white rounded-3xl border border-slate-200/50 shadow-2xl overflow-hidden">
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
//               {/* Image Section */}
//               {certificate.image && (
//                 <div className="relative bg-gradient-to-br from-slate-50 to-white p-8 flex items-center justify-center">
//                   <div className="relative group">
//                     <div className="absolute inset-0 bg-gradient-to-br from-[#405254] to-[#405254] rounded-2xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
//                     <img
//                       src={`${API_BASE_URL}/${certificate.image}`}
//                       alt={certificate.title}
//                       className="relative w-full h-96 object-cover rounded-2xl shadow-xl border border-slate-200/50"
//                     />
//                   </div>
//                 </div>
//               )}

//               {/* Details Section */}
//               <div className="p-8 lg:p-12">
//                 <h2 className="text-3xl font-light text-slate-900 mb-8 tracking-tight">{certificate.title}</h2>
//                 <div className="space-y-4">
//                   {/* Certifier */}
//                   <div className="flex items-center space-x-4 p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200/50">
//                     <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#465B5D] via-[#597678] to-[#465B5D] flex items-center justify-center flex-shrink-0 shadow-lg">
//                       <Award className="w-6 h-6 text-white" />
//                     </div>
//                     <div>
//                       <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Certifier</p>
//                       <p className="font-light text-slate-900 text-lg">{certificate.certifier_name}</p>
//                     </div>
//                   </div>
//                    {/* Store & Date */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="p-5 bg-white border border-slate-200/50 rounded-xl group hover:border-slate-300 transition-colors">
//                       <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Store</p>
//                       <p className="font-light text-slate-900">{certificate.store_name}</p>
//                     </div>
//                     <div className="p-5 bg-white border border-slate-200/50 rounded-xl group hover:border-slate-300 transition-colors">
//                       <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Date</p>
//                       <p className="font-light text-slate-900">{new Date(certificate.date).toLocaleDateString()}</p>
//                     </div>
//                   </div>
//                   {/* Item & Weight */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="p-5 bg-white border border-slate-200/50 rounded-xl group hover:border-slate-300 transition-colors">
//                       <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Item</p>
//                       <p className="font-light text-slate-900">{certificate.item}</p>
//                     </div>
//                     <div className="p-5 bg-white border border-slate-200/50 rounded-xl group hover:border-slate-300 transition-colors">
//                       <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Weight</p>
//                       <p className="font-light text-slate-900">{certificate.weight}</p>
//                     </div>
//                   </div>
//                   {/* Gemstone Details */}
//                   {certificate.gem_stone && (
//                     <div className="p-6 bg-gradient-to-br from-grey to-black border border-slate-200/50 rounded-xl">
//                       <div className="flex items-center space-x-2 mb-4">
//                         {/* <Gem className="w-5 h-5 text-[465B5D]" /> */}
//                         <p className="text-sm text-[#97a0ab] font-medium tracking-wide">Gemstone Analysis</p>
//                       </div>
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">Stone</p>
//                           <p className="font-light text-slate-900 text-sm">{certificate.gem_stone}</p>
//                         </div>
//                         {certificate.carat_weight && (
//                           <div>
//                             <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">Carat</p>
//                             <p className="font-light text-slate-900 text-sm">{certificate.carat_weight} ct</p>
//                           </div>
//                         )}
//                         {certificate.color && (
//                           <div>
//                             <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">Color</p>
//                             <p className="font-light text-slate-900 text-sm">{certificate.color}</p>
//                             </div>
//                             )}
//                         {certificate.clarity && (
//                           <div>
//                             <p className="text-xs text-slate-600 uppercase tracking-wider mb-1">Clarity</p>
//                             <p className="font-light text-slate-900 text-sm">{certificate.clarity}</p>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                   {/* Metal & Value */}
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="p-5 bg-white border border-slate-200/50 rounded-xl group hover:border-slate-300 transition-colors">
//                       <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Metal Purity</p>
//                       <p className="font-light text-slate-900">{certificate.metal_purity}</p>
//                     </div>
//                     <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-xl">
//                       <p className="text-xs text-slate-600 uppercase tracking-wider mb-2">Certified Value</p>
//                       <p className="text-2xl font-light text-emerald-600">
//                         ${Number(certificate.value || 0).toFixed(2)}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="p-8 lg:p-12 bg-gradient-to-br from-slate-50 to-white border-t border-slate-200/50">
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <button
//                   onClick={handleDownloadPDF}
//                   className="flex-1 flex items-center justify-center space-x-3 px-8 py-4 text-sm font-medium bg-gradient-to-r from-[#465B5D] via-[#597678] to-[#465B5D] text-white rounded-xl shadow-lg hover:from-[#405254] hover:via-[#405254] hover:to-[#405254] transition-all duration-300"
//                 >
//                   <ArrowDownToLine className="w-5 h-5" />
//                   <span className="tracking-wide">Download Certificate</span>
//                 </button>
//                 <button
//                   onClick={() => setShowPaymentModal(true)}
//                   className="flex-1 flex items-center justify-center space-x-3 px-8 py-4 text-sm font-medium bg-white border-2 border-gray-300 text-gray-700 rounded-xl shadow hover:bg-gray-50 transition-all duration-300"
//                 >
//                   <ShoppingCart className="w-5 h-5" />
//                   <span className="tracking-wide">Order Physical Copy</span>
//                 </button>
//               </div>
//               <div className="mt-6 p-5 bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-xl">
//                 <p className="text-sm font-light text-slate-600 text-center leading-relaxed">
//                   This certificate confirms the authenticity and quality of the jewelry item described above.
//                   <br />
//                   Certificate issued on {new Date(certificate.created_at).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>
//           </div>
//           </div>
//       </div>
//       {/* Trust Footer */}
//       <div className="relative py-16 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
//         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzIxMjEyMSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
//         <div className="relative max-w-7xl mx-auto text-center">
//           <p className="text-white/90 text-lg font-light tracking-wide">
//             Trusted by luxury jewelry boutiques and gemological institutes worldwide
//           </p>
//         </div>
//       </div>

//       {/* Payment Modal Placeholder */}
//       <PaymentModal
//         isOpen={showPaymentModal}
//         onClose={() => setShowPaymentModal(false)}
//         certificate={certificate}
//       />

//       {/* Download Modal Placeholder */}
//       {showDownloadModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b border-slate-200/50 p-8 rounded-t-2xl flex justify-between items-center z-10">
//               <h2 className="text-3xl font-light text-slate-900 tracking-tight">Download Certificate</h2>
//               <button
//                 onClick={() => setShowDownloadModal(false)}
//                 className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-lg hover:bg-slate-100"
//               ><X className="w-6 h-6" />
//               </button>
//               </div>
//               <div className="p-8">
//               <CertificateDownload
//                 certificate={{
//                   id: certificate.id,
//                   certificate_number: certificate.certificate_number,
//                   store: certificate.store,
//                   date: certificate.date,
//                   item: certificate.item,
//                   length: certificate.length,
//                   weight: certificate.weight,
//                   gem_stone: certificate.gem_stone,
//                   carat_weight: certificate.carat_weight,
//                   color: certificate.color,
//                   clarity: certificate.clarity,
//                   metal_purity: certificate.metal_purity,
//                   value: certificate.value,
//                   certifier_name: certificate.certifier_name,
//                   image_url: `${API_BASE_URL}/${certificate.image}`,
//                   // image_url: certificate.image ? `${API_BASE_URL}/${certificate.image}` : undefined,
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

/* ----------------------------------------------------------------------------------------------------------------------------------------------------------------- */

import React, { useState, useEffect } from 'react';
import CertificateDownload from "../components/CertificateDownload";
import { ArrowLeft, Download, ShoppingCart, Award, X, Shield, ArrowDownToLine, Menu } from 'lucide-react';
import { PaymentModal } from '../components/PaymentModal';

interface CertificateViewProps {
  certificateNumber: string;
  onBack: () => void;
}

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

export const CertificateView: React.FC<CertificateViewProps> = ({ certificateNumber, onBack }) => {
  const [certificate, setCertificate] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/api/search/${certificateNumber}`)
      .then(res => {
        if (!res.ok) throw new Error('Certificate not found');
        return res.json();
      })
      .then(data => {
        setCertificate(data);
      })
      .catch((error) => {
        console.error('Error fetching certificate:', error);
        setCertificate(null);
      })
      .finally(() => setLoading(false));
  }, [certificateNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200/50 shadow-xl">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4 sm:mb-6"></div>
            <p className="text-base sm:text-lg text-slate-700 font-light tracking-wide text-center">Loading certificate...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200/50 shadow-xl text-center max-w-md w-full">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <X className="w-6 h-6 sm:w-8 sm:h-8 text-red-500" />
          </div>
          <p className="text-xl sm:text-2xl text-slate-900 font-light mb-2 sm:mb-3">Certificate Not Found</p>
          <p className="text-sm sm:text-base text-slate-600 font-light mb-6 sm:mb-8 leading-relaxed">
            The certificate you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 text-sm font-medium bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Return to Search
          </button>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    setShowDownloadModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Mobile-First Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm py-3 md:py-4' : 'bg-transparent py-4 md:py-6'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between items-center">
            {/* Logo - Responsive */}
            <div
              className="flex items-center space-x-2 sm:space-x-4 group cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => (window.location.href = '/')}
              onKeyDown={(e) => { if (e.key === 'Enter') (window.location.href = '/'); }}
            >
              <div className="relative">
                <img
                  src={`${API_BASE_URL}/images/VGL-LOGO.svg`}
                  alt="VGL Logo"
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full shadow-lg object-cover group-hover:shadow-xl transition-all duration-300"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg md:text-xl font-light text-slate-900">VGL</span>
                <span className="text-[8px] sm:text-[9px] font-medium tracking-[0.2em] text-slate-500 uppercase hidden sm:block">
                  Veritas Gem Laboratory
                </span>
              </div>
            </div>

            {/* Desktop Back Button */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-light group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span className="tracking-wide">Back to Search</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-200">
              <button
                onClick={() => {
                  onBack();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full text-left px-4 py-3 text-sm font-light text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors mt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Search</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Certificate Details - Mobile First */}
      <div className="relative py-12 sm:py-16 px-4 sm:px-6 lg:px-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-gradient-to-bl from-amber-50 via-transparent to-transparent rounded-full blur-3xl opacity-30 -z-10"></div>

        <div className="max-w-6xl mx-auto">
          {/* Certificate Header - Responsive */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-sm mb-4 sm:mb-6">
              <Shield className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#465B5D]" />
              <span className="text-[10px] sm:text-xs font-medium tracking-wider text-slate-700 uppercase">
                Verified Authenticity
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-slate-900 mb-3 sm:mb-4 px-4">
              Certificate of Authenticity
            </h1>
            <p className="text-lg sm:text-xl font-light text-slate-600 tracking-wide">{certificate.certificate_number}</p>
          </div>

          {/* Main Certificate Card - Responsive Grid */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/50 shadow-2xl overflow-hidden">
            {/* Mobile: Stack, Desktop: 2-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image Section */}
              {certificate.image && (
                <div className="relative bg-gradient-to-br from-slate-50 to-white p-6 sm:p-8 flex items-center justify-center">
                  <div className="relative group w-full">
                    <img
                      src={`${API_BASE_URL}/${certificate.image}`}
                      alt={certificate.title}
                      className="relative w-full h-64 sm:h-80 md:h-96 object-cover rounded-xl sm:rounded-2xl shadow-xl border border-slate-200/50"
                    />
                  </div>
                </div>
              )}

              {/* Details Section - Responsive Spacing */}
              <div className="p-6 sm:p-8 lg:p-12">
                <h2 className="text-2xl sm:text-3xl font-light text-slate-900 mb-6 sm:mb-8 tracking-tight">{certificate.title}</h2>

                <div className="space-y-3 sm:space-y-4">
                  {/* Certifier */}
                  <div className="flex items-center space-x-3 sm:space-x-4 p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-white rounded-xl border border-slate-200/50">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#465B5D] via-[#597678] to-[#465B5D] flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Award className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mb-1">Certifier</p>
                      <p className="font-light text-slate-900 text-base sm:text-lg truncate">{certificate.certifier_name}</p>
                    </div>
                  </div>

                  {/* Store & Date - Responsive Grid */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-4 sm:p-5 bg-white border border-slate-200/50 rounded-xl group hover:border-slate-300 transition-colors">
                      <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mb-2">Store</p>
                      <p className="font-light text-slate-900 text-sm sm:text-base truncate">{certificate.store_name}</p>
                    </div>
                    <div className="p-4 sm:p-5 bg-white border border-slate-200/50 rounded-xl group hover:border-slate-300 transition-colors">
                      <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mb-2">Date</p>
                      <p className="font-light text-slate-900 text-sm sm:text-base">{new Date(certificate.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}</p>
                    </div>
                  </div>

                  {/* Item & Weight */}
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-4 sm:p-5 bg-white border border-slate-200/50 rounded-xl group hover:border-slate-300 transition-colors">
                      <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mb-2">Item</p>
                      <p className="font-light text-slate-900 text-sm sm:text-base truncate">{certificate.item}</p>
                    </div>
                    <div className="p-4 sm:p-5 bg-white border border-slate-200/50 rounded-xl group hover:border-slate-300 transition-colors">
                      <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mb-2">
                        {certificate.type === 'diamond' ? 'Width' : 'Weight'}
                      </p>
                      <p className="font-light text-slate-900 text-sm sm:text-base">{certificate.weight}</p>
                    </div>
                  </div>

                  {/* Gemstone Details */}
                  {certificate.gem_stone && (
                    <div className="p-5 sm:p-6 bg-gradient-to-br from-slate-50 to-white border border-slate-200/50 rounded-xl">
                      <p className="text-xs sm:text-sm text-slate-600 font-medium tracking-wide mb-3 sm:mb-4">Gemstone Analysis</p>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <p className="text-[10px] sm:text-xs text-slate-600 uppercase tracking-wider mb-1">Stone</p>
                          <p className="font-light text-slate-900 text-xs sm:text-sm truncate">{certificate.gem_stone}</p>
                        </div>
                        {certificate.carat_weight && (
                          <div>
                            <p className="text-[10px] sm:text-xs text-slate-600 uppercase tracking-wider mb-1">Carat</p>
                            <p className="font-light text-slate-900 text-xs sm:text-sm">{certificate.carat_weight} ct</p>
                          </div>
                        )}
                        {certificate.color && (
                          <div>
                            <p className="text-[10px] sm:text-xs text-slate-600 uppercase tracking-wider mb-1">Color</p>
                            <p className="font-light text-slate-900 text-xs sm:text-sm truncate">{certificate.color}</p>
                          </div>
                        )}
                        {certificate.clarity && (
                          <div>
                            <p className="text-[10px] sm:text-xs text-slate-600 uppercase tracking-wider mb-1">Clarity</p>
                            <p className="font-light text-slate-900 text-xs sm:text-sm">{certificate.clarity}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Metal & Value */}
                  {/* <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {certificate.type !== 'diamond' && (
                      <div className="p-4 sm:p-5 bg-white border border-slate-200/50 rounded-xl group hover:border-slate-300 transition-colors">
                        <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider mb-2">Metal Purity</p>
                        <p className="font-light text-slate-900 text-sm sm:text-base truncate">{certificate.metal_purity}</p>
                      </div>
                    )}
                    <div className={`p-4 sm:p-5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-xl ${certificate.type === 'diamond' ? 'col-span-2' : ''}`}>
                      <p className="text-[10px] sm:text-xs text-slate-600 uppercase tracking-wider mb-2">Certified Value</p>
                      <p className="text-xl sm:text-2xl font-light text-emerald-600">
                        ${Number(certificate.value || 0).toFixed(2)}
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Action Buttons - Mobile Responsive */}
            <div className="p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-slate-50 to-white border-t border-slate-200/50">
              {/* Mobile: Stack, Tablet+: Side by side */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 text-sm font-medium bg-gradient-to-r from-[#465B5D] via-[#597678] to-[#465B5D] text-white rounded-xl shadow-lg hover:from-[#405254] hover:via-[#405254] hover:to-[#405254] transition-all duration-300"
                >
                  <ArrowDownToLine className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="tracking-wide">Download Certificate</span>
                </button>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="flex-1 flex items-center justify-center space-x-2 sm:space-x-3 px-6 sm:px-8 py-3 sm:py-4 text-sm font-medium bg-white border-2 border-gray-300 text-gray-700 rounded-xl shadow hover:bg-gray-50 transition-all duration-300"
                >
                  <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="tracking-wide whitespace-nowrap">Order Physical Copy</span>
                </button>
              </div>

              <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-xl">
                <p className="text-xs sm:text-sm font-light text-slate-600 text-center leading-relaxed">
                  This certificate confirms the authenticity and quality of the jewelry item described above.
                  <br className="hidden sm:block" />
                  Certificate issued on {new Date(certificate.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Footer - Responsive */}
      <div className="relative py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzIxMjEyMSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="relative max-w-7xl mx-auto text-center">
          <p className="text-white/90 text-sm sm:text-base md:text-lg font-light tracking-wide">
            Trusted by luxury jewelry boutiques worldwide
          </p>
        </div>
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        certificate={certificate}
      />

      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200/50 p-6 sm:p-8 rounded-t-xl sm:rounded-t-2xl flex justify-between items-center z-10">
              <h2 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">Download Certificate</h2>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 md:p-8">
              <CertificateDownload
                certificate={{
                  id: certificate.id,
                  certificate_number: certificate.certificate_number,
                  type: certificate.type,
                  store: certificate.store,
                  date: certificate.date,
                  item: certificate.item,
                  length: certificate.length,
                  weight: certificate.weight,
                  gem_stone: certificate.gem_stone,
                  carat_weight: certificate.carat_weight,
                  color: certificate.color,
                  clarity: certificate.clarity,
                  metal_purity: certificate.metal_purity,
                  value: certificate.value,
                  certifier_name: certificate.certifier_name,
                  image_url: `${API_BASE_URL}/${certificate.image}`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};