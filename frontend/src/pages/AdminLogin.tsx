// // import React, { useState } from 'react';
// // import { Gem, Lock, Mail, ArrowLeft } from 'lucide-react';
// // import { useAuth } from '../contexts/AuthContext';
// // import { Button } from '../components/Button';
// // // import { Input } from '../components/Input';

// // interface AdminLoginProps {
// //   onBackToSite: () => void;
// // }

// // export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToSite }) => {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const { login } = useAuth();

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setError('');
// //     setLoading(true);

// //     const success = await login(email, password);

// //     if (!success) {
// //       setError('Invalid email or password');
// //     }

// //     setLoading(false);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 flex items-center justify-center p-4 relative">
// //       <button
// //         onClick={onBackToSite}
// //         className="absolute top-6 left-6 flex items-center space-x-2 text-amber-600 hover:text-amber-700 transition-colors font-medium"
// //       >
// //         <ArrowLeft className="w-5 h-5" />
// //         <span>Back to Site</span>
// //       </button>

// //       <div className="max-w-md w-full">
// //         <div className="text-center mb-8">
// //           <div className="flex justify-center mb-4">
// //             <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-xl">
// //               <Gem className="w-10 h-10 text-white" />
// //             </div>
// //           </div>
// //           <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
// //           <p className="text-gray-600">Luxury Jewelry Certificate Management</p>
// //         </div>

// //         <div className="bg-white rounded-2xl shadow-2xl p-8 border border-amber-100">
// //           <form onSubmit={handleSubmit}>
// //             <div className="mb-6">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 <Mail className="w-4 h-4 inline mr-2" />
// //                 Email Address
// //               </label>
// //               <input
// //                 type="email"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 placeholder="admin@jewelcert.com"
// //                 required
// //                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors duration-300"
// //               />
// //             </div>

// //             <div className="mb-6">
// //               <label className="block text-sm font-medium text-gray-700 mb-2">
// //                 <Lock className="w-4 h-4 inline mr-2" />
// //                 Password
// //               </label>
// //               <input
// //                 type="password"
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 placeholder="Enter your password"
// //                 required
// //                 className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-amber-400 focus:outline-none transition-colors duration-300"
// //               />
// //             </div>

// //             {error && (
// //               <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
// //                 {error}
// //               </div>
// //             )}

// //             <Button type="submit" disabled={loading} className="w-full rounded-lg">
// //               {loading ? 'Signing In...' : 'Sign In'}
// //             </Button>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };


// import React, { useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { Shield, Lock, Mail, ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// const API_BASE_URL = "http://localhost:8000";

// export default function AdminLogin() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);

//   const { login } = useAuth();
//   const navigate = useNavigate();

//   React.useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const success = await login(email, password);

//       if (success) {
//         // Redirect to admin dashboard on successful login
//         navigate('/admin');
//       } else {
//         setError('Invalid email or password. Please check your credentials and try again.');
//       }
//     } catch (err) {
//       setError('An error occurred during login. Please try again.');
//       console.error('Submit error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">

//       {/* NAV */}
//       <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
//         isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm py-4' : 'bg-transparent py-6'
//       }`}>
//         <div className="max-w-7xl mx-auto px-6 lg:px-12">
//           <div className="flex justify-between items-center">
            
//             {/* LOGO */}
//             <div
//               className="flex items-center space-x-4 cursor-pointer"
//               onClick={() => (window.location.href = '/')}
//             >
//               <img
//                 src={`${API_BASE_URL}/images/VGL-LOGO.png`}
//                 className="w-20 h-20 rounded-full shadow-lg object-cover"
//               />
//               <div className="flex flex-col">
//                 <span className="text-xl font-light text-slate-900">VGL</span>
//                 <span className="text-[9px] tracking-[0.2em] text-slate-500 uppercase">
//                   Veritas Gem Laboratory
//                 </span>
//               </div>
//             </div>

//             <button
//               onClick={() => (window.location.href = '/')}
//               className="hidden md:flex items-center space-x-2 text-slate-600 hover:text-slate-900 text-sm"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               <span>Back to Site</span>
//             </button>

//           </div>
//         </div>
//       </nav>

//       {/* LOGIN */}
//       <div className="relative pt-32 pb-24 px-6 lg:px-12 flex items-center min-h-screen">

//         <div className="max-w-md mx-auto w-full">

//           <div className="text-center mb-10">
//             <div className="inline-flex items-center px-6 py-2 rounded-full bg-white border mb-6">
//               <Shield className="w-4 h-4 text-[#465B5D]" />
//               <span className="ml-2 text-xs text-slate-700 uppercase">Secure Access</span>
//             </div>

//             <h1 className="text-4xl font-extralight text-slate-900">
//               Admin
//               <span className="block bg-gradient-to-r from-[#465B5D] via-[#9CA56A] to-[#465B5D] bg-clip-text text-transparent">
//                 Panel
//               </span>
//             </h1>
//           </div>

//           <div className="bg-white rounded-2xl shadow-xl border p-8 lg:p-10">

//             {/* ✔ FORM ADDED */}
//             <form onSubmit={handleSubmit}>

//               {/* EMAIL */}
//               <div className="mb-6">
//                 <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 uppercase mb-3">
//                   <Mail className="w-4 h-4 text-slate-500" />
//                   <span>Email Address</span>
//                 </label>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="admin@vgl.com"
//                   required
//                   className="w-full px-5 py-4 bg-slate-50 border rounded-xl"
//                 />
//               </div>

//               {/* PASSWORD */}
//               <div className="mb-6">
//                 <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 uppercase mb-3">
//                   <Lock className="w-4 h-4 text-slate-500" />
//                   <span>Password</span>
//                 </label>
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   placeholder="Enter password"
//                   className="w-full px-5 py-4 bg-slate-50 border rounded-xl"
//                 />
//               </div>

//               {/* ERROR */}
//               {error && (
//                 <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl">
//                   {error}
//                 </div>
//               )}

//               {/* SUBMIT */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-[#465B5D] via-[#597678] to-[#465B5D] text-white"
//               >
//                 {loading ? "Signing In..." : "Sign In"}
//               </button>

//             </form>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Lock, Mail, ArrowLeft, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);

      if (success) {
        navigate('/admin');
      } else {
        setError('Invalid email or password. Please check your credentials and try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
      console.error('Submit error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Mobile-First Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/95 backdrop-blur-xl shadow-sm py-3 md:py-4' : 'bg-transparent py-4 md:py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div
              className="flex items-center space-x-2 sm:space-x-4 cursor-pointer"
              onClick={() => (window.location.href = '/')}
            >
              <img
                src={`${API_BASE_URL}/images/VGL-LOGO.svg`}
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full shadow-lg object-cover"
                alt="VGL Logo"
              />
              <div className="flex flex-col">
                <span className="text-base sm:text-lg md:text-xl font-light text-slate-900">VGL</span>
                <span className="text-[8px] sm:text-[9px] tracking-[0.2em] text-slate-500 uppercase hidden sm:block">
                  Veritas Gem Laboratory
                </span>
              </div>
            </div>

            {/* Desktop Back Button */}
            <button
              onClick={() => (window.location.href = '/')}
              className="hidden md:flex items-center space-x-2 text-slate-600 hover:text-slate-900 text-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Site</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-200">
              <button
                onClick={() => {
                  window.location.href = '/';
                  setMobileMenuOpen(false);
                }}
                className="flex items-center w-full text-left px-4 py-3 text-sm font-light text-slate-600 hover:bg-slate-50 rounded-lg mt-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Site
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Login Form - Mobile First */}
      <div className="relative pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 lg:px-12 flex items-center min-h-screen">
        <div className="max-w-md mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center px-4 sm:px-6 py-2 rounded-full bg-white border mb-4 sm:mb-6">
              <Shield className="w-3 sm:w-4 h-3 sm:h-4 text-[#465B5D]" />
              <span className="ml-2 text-[10px] sm:text-xs text-slate-700 uppercase">Secure Access</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extralight text-slate-900">
              Admin
              <span className="block bg-gradient-to-r from-[#465B5D] via-[#9CA56A] to-[#465B5D] bg-clip-text text-transparent">
                Panel
              </span>
            </h1>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border p-6 sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-5 sm:mb-6">
                <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 uppercase mb-3">
                  <Mail className="w-3 sm:w-4 h-3 sm:h-4 text-slate-500" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vgl.com"
                  required
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50 border rounded-xl text-sm sm:text-base focus:outline-none focus:border-[#465B5D] transition-colors"
                />
              </div>

              {/* Password */}
              <div className="mb-5 sm:mb-6">
                <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 uppercase mb-3">
                  <Lock className="w-3 sm:w-4 h-3 sm:h-4 text-slate-500" />
                  <span>Password</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-50 border rounded-xl text-sm sm:text-base focus:outline-none focus:border-[#465B5D] transition-colors"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="mb-5 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs sm:text-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-[#465B5D] via-[#597678] to-[#465B5D] text-white text-sm sm:text-base font-medium hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}