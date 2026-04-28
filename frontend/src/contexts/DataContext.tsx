import React, { createContext, useContext, useState, useEffect } from 'react';
import { Certificate, Payment } from '../types';

interface DataContextType {
  certificates: Certificate[];
  payments: Payment[];
  addCertificate: (certificate: Omit<Certificate, 'id' | 'certificate_number' | 'created_at' | 'updated_at'>) => void;
  updateCertificate: (id: string, certificate: Partial<Certificate>) => void;
  deleteCertificate: (id: string) => void;
  getCertificateByNumber: (certificateNumber: string) => Certificate | undefined;
  addPayment: (payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) => void;
  updatePaymentStatus: (id: string, status: Payment['status']) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const savedCertificates = localStorage.getItem('jewelry_certificates');
    const savedPayments = localStorage.getItem('jewelry_payments');

    if (savedCertificates) {
      setCertificates(JSON.parse(savedCertificates));
    } else {
      const mockCertificates = generateMockCertificates();
      setCertificates(mockCertificates);
      localStorage.setItem('jewelry_certificates', JSON.stringify(mockCertificates));
    }

    if (savedPayments) {
      setPayments(JSON.parse(savedPayments));
    }
  }, []);

  const generateCertificateNumber = (): string => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    return `CERT-${year}-${random}`;
  };

  const addCertificate = (certificate: Omit<Certificate, 'id' | 'certificate_number' | 'created_at' | 'updated_at'>) => {
    const newCertificate: Certificate = {
      ...certificate,
      id: crypto.randomUUID(),
      certificate_number: generateCertificateNumber(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updatedCertificates = [...certificates, newCertificate];
    setCertificates(updatedCertificates);
    localStorage.setItem('jewelry_certificates', JSON.stringify(updatedCertificates));
  };

  const updateCertificate = (id: string, updates: Partial<Certificate>) => {
    const updatedCertificates = certificates.map(cert =>
      cert.id === id
        ? { ...cert, ...updates, updated_at: new Date().toISOString() }
        : cert
    );
    setCertificates(updatedCertificates);
    localStorage.setItem('jewelry_certificates', JSON.stringify(updatedCertificates));
  };

  const deleteCertificate = (id: string) => {
    const updatedCertificates = certificates.map(cert =>
      cert.id === id
        ? { ...cert, deleted_at: new Date().toISOString() }
        : cert
    );
    setCertificates(updatedCertificates);
    localStorage.setItem('jewelry_certificates', JSON.stringify(updatedCertificates));
  };

  const getCertificateByNumber = (certificateNumber: string): Certificate | undefined => {
    return certificates.find(
      cert => cert.certificate_number === certificateNumber && !cert.deleted_at
    );
  };

  const addPayment = (payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) => {
    const newPayment: Payment = {
      ...payment,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    localStorage.setItem('jewelry_payments', JSON.stringify(updatedPayments));
  };

  const updatePaymentStatus = (id: string, status: Payment['status']) => {
    const updatedPayments = payments.map(payment =>
      payment.id === id
        ? { ...payment, status, updated_at: new Date().toISOString() }
        : payment
    );
    setPayments(updatedPayments);
    localStorage.setItem('jewelry_payments', JSON.stringify(updatedPayments));
  };

  return (
    <DataContext.Provider
      value={{
        certificates,
        payments,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        getCertificateByNumber,
        addPayment,
        updatePaymentStatus,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const generateMockCertificates = (): Certificate[] => {
  return [
    {
      id: '1',
      certificate_number: 'CERT-2025-000001',
      certifier_name: 'International Gemological Institute',
      store: 'Luxury Jewels Boutique',
      image_url: 'https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Diamond Engagement Ring',
      date: '2025-09-15',
      item: 'Engagement Ring',
      length: undefined,
      weight: '4.5g',
      carat_weight: 2.5,
      gem_stone: 'Diamond',
      color: 'D (Colorless)',
      clarity: 'VVS1',
      metal_purity: '18K White Gold',
      value: 15000.00,
      created_at: '2025-09-15T10:00:00Z',
      updated_at: '2025-09-15T10:00:00Z',
    },
    {
      id: '2',
      certificate_number: 'CERT-2025-000002',
      certifier_name: 'Gemological Institute of America',
      store: 'Elite Diamond Gallery',
      image_url: 'https://images.pexels.com/photos/1457838/pexels-photo-1457838.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Sapphire Necklace',
      date: '2025-09-20',
      item: 'Necklace',
      length: '18 inches',
      weight: '12.3g',
      carat_weight: 5.2,
      gem_stone: 'Blue Sapphire',
      color: 'Royal Blue',
      clarity: 'VS',
      metal_purity: '24K Gold',
      value: 28000.00,
      created_at: '2025-09-20T14:30:00Z',
      updated_at: '2025-09-20T14:30:00Z',
    },
    {
      id: '3',
      certificate_number: 'CERT-2025-000003',
      certifier_name: 'International Gemological Institute',
      store: 'Royal Gems & Jewelry',
      image_url: 'https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Emerald Earrings',
      date: '2025-09-25',
      item: 'Earrings',
      length: undefined,
      weight: '6.8g',
      carat_weight: 3.0,
      gem_stone: 'Emerald',
      color: 'Vivid Green',
      clarity: 'VVS2',
      metal_purity: '22K Gold',
      value: 18500.00,
      created_at: '2025-09-25T09:15:00Z',
      updated_at: '2025-09-25T09:15:00Z',
    },
  ];
};
