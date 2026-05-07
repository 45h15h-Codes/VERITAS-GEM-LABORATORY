import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, Pen, Trash } from 'lucide-react';
import { Card } from './Card';
// import { Button } from './Button';
import { Modal } from './Modal';
import Swal from 'sweetalert2';
import { CertificateForm } from './CertificateForm';
import { resolveImageUrl } from '../utils/imageUrl';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

export const CertificateList: React.FC<{ certificates?: any[] }> = ({ certificates: propCertificates }) => {
  const [certificates, setCertificates] = useState<any[]>(propCertificates || []);
  const [editingCertificate, setEditingCertificate] = useState<any>(null);
  const [viewingCertificate, setViewingCertificate] = useState<any>(null);

  useEffect(() => {
    if (propCertificates) {
      setCertificates(propCertificates);
    } else {
      axios.get(`${API_BASE_URL}/api/certificates`)
        .then(res => setCertificates(res.data))
        .catch(() => setCertificates([]));
    }
  }, [propCertificates]);

  const activeCertificates = certificates.filter(cert => !cert.deleted_at);

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Delete Certificate?',
      text: 'Are you sure you want to delete this certificate?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f59e0b', // amber-400
      cancelButtonColor: '#d1d5db', // gray-300
      confirmButtonText: 'Yes, delete it!',
      background: '#fff8e1', // light amber
      customClass: {
        popup: 'rounded-2xl shadow-xl',
        confirmButton: 'font-bold',
        cancelButton: 'font-bold'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_BASE_URL}/api/certificates/${id}`);
          setCertificates(prev => prev.filter(cert => cert.id !== id));
          Swal.fire({
            title: 'Deleted!',
            text: 'Certificate has been deleted.',
            icon: 'success',
            confirmButtonColor: '#f59e0b',
            background: '#fff8e1',
            customClass: { popup: 'rounded-2xl shadow-xl' }
          });
        } catch (err) {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete certificate.',
            icon: 'error',
            confirmButtonColor: '#f59e0b',
            background: '#fff8e1',
            customClass: { popup: 'rounded-2xl shadow-xl' }
          });
        }
      }
    });
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-6">
        {activeCertificates.map((cert) => (
          <Card key={cert.id} className="p-6" hover>
            <div className="flex flex-col md:flex-row gap-6">
              {cert.image && (
                <img
                  src={resolveImageUrl(cert.image, API_BASE_URL)}
                  alt={cert.title}
                  className="w-full md:w-48 h-48 object-cover rounded-lg shadow-md"
                />
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{cert.title}</h3>
                    <p className="text-sm text-amber-600 font-semibold">{cert.certificate_number}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setViewingCertificate(cert)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setEditingCertificate(cert)}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pen className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cert.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Store</p>
                    <p className="font-semibold text-gray-900">{cert.store_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Item</p>
                    <p className="font-semibold text-gray-900">{cert.item}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Metal Purity</p>
                    <p className="font-semibold text-gray-900">{cert.metal_purity}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Value</p>
                    <p className="font-semibold text-green-600">${Number(cert.value).toFixed(2)}</p>
                  </div>
                </div>

                {cert.gem_stone && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                      {cert.gem_stone}
                    </span>
                    {cert.carat_weight && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {cert.carat_weight} ct
                      </span>
                    )}
                    {cert.clarity && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {cert.clarity}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}

        {activeCertificates.length === 0 && (
          <Card className="p-12">
            <p className="text-center text-gray-500 text-lg">No certificates found</p>
          </Card>
        )}
      </div>

      <Modal
        isOpen={editingCertificate !== null}
        onClose={() => setEditingCertificate(null)}
        title="Edit Certificate"
        maxWidth="max-w-4xl"
      >
        <CertificateForm
          editingCertificate={editingCertificate}
          onSuccess={() => {
            setEditingCertificate(null);
            axios.get(`${API_BASE_URL}/api/certificates`).then(res => setCertificates(res.data));
          }}
        />
      </Modal>

      <Modal
        isOpen={viewingCertificate !== null}
        onClose={() => setViewingCertificate(null)}
        title="Certificate Details"
        maxWidth="max-w-3xl"
      >
        {viewingCertificate && (
          <div className="space-y-4">
            {viewingCertificate.image && (
              <div className="flex justify-center">
                <img
                  src={resolveImageUrl(viewingCertificate.image, API_BASE_URL)}
                  alt={viewingCertificate.title}
                  className="max-h-96 object-contain rounded-lg shadow-lg"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Certificate Number</p>
                <p className="font-bold text-amber-600">{viewingCertificate.certificate_number}</p>
              </div>
              <div>
                <p className="text-gray-500">Certifier</p>
                <p className="font-semibold">{viewingCertificate.certifier_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Store</p>
                <p className="font-semibold">{viewingCertificate.store_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Date</p>
                <p className="font-semibold">{new Date(viewingCertificate.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Item</p>
                <p className="font-semibold">{viewingCertificate.item}</p>
              </div>
              <div>
                <p className="text-gray-500">Weight</p>
                <p className="font-semibold">{viewingCertificate.weight}</p>
              </div>
              {viewingCertificate.carat_weight && (
                <div>
                  <p className="text-gray-500">Carat Weight</p>
                  <p className="font-semibold">{viewingCertificate.carat_weight} ct</p>
                </div>
              )}
              {viewingCertificate.gem_stone && (
                <div>
                  <p className="text-gray-500">Gem Stone</p>
                  <p className="font-semibold">{viewingCertificate.gem_stone}</p>
                </div>
              )}
              {viewingCertificate.color && (
                <div>
                  <p className="text-gray-500">Color</p>
                  <p className="font-semibold">{viewingCertificate.color}</p>
                </div>
              )}
              {viewingCertificate.clarity && (
                <div>
                  <p className="text-gray-500">Clarity</p>
                  <p className="font-semibold">{viewingCertificate.clarity}</p>
                </div>
              )}
              <div>
                <p className="text-gray-500">Metal Purity</p>
                <p className="font-semibold">{viewingCertificate.metal_purity}</p>
              </div>
              <div>
                <p className="text-gray-500">Value</p>
                <p className="font-bold text-green-600 text-lg">${Number(viewingCertificate.value || 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
