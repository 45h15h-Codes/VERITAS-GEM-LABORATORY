import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

export const PaymentList: React.FC<{ payments?: any[] }> = ({ payments: propPayments }) => {
  const [payments, setPayments] = useState<any[]>(propPayments || []);

  const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    if (!propPayments) {
      axios.get(`${API_BASE_URL}/api/payments`)
        .then(res => setPayments(res.data))
        .catch(() => setPayments([]));
    }
  }, [propPayments, API_BASE_URL]);

  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const handleStatusChange = async (paymentId: string, newStatus: 'pending' | 'completed' | 'shipped') => {
    try {
      await axios.put(`${API_BASE_URL}/api/payments/${paymentId}`, { status: newStatus });
      setPayments(payments =>
        payments.map(p =>
          p.id === paymentId ? { ...p, status: newStatus } : p
        )
      );
    } catch (err) {
      // Optionally handle error
    }
  };

  return (
    <div className="space-y-4">
      {sortedPayments.map((payment) => (
        <Card key={payment.id} className="p-6" hover>
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{payment.client_name}</h3>
                  <p className="text-sm text-gray-600">{payment.email}</p>
                  <p className="text-sm text-gray-600">{payment.mobile}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">${payment.amount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{payment.payment_id}</p>
                </div>
              </div>

              <div className="mb-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Certificate:</span> {payment.certificate_number}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Item:</span> {payment.title}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Shipping Address:</span>
                </p>
                <p className="text-sm text-gray-600">{payment.address}</p>
              </div>

              <div className="flex items-center space-x-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${payment.status === 'shipped'
                    ? 'bg-blue-100 text-blue-700'
                    : payment.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : payment.status === 'failed' || payment.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : payment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}
                >
                  {payment.status.toUpperCase()}
                </span>

                <div className="flex space-x-2 rounded-full">
                  {payment.status === 'pending' && (
                    <Button
                      variant="secondary"
                      onClick={() => handleStatusChange(payment.id, 'completed')}
                      className="text-sm py-2"
                    >
                      Mark Completed
                    </Button>
                  )}
                  {payment.status === 'completed' && (
                    <Button
                      onClick={() => handleStatusChange(payment.id, 'shipped')}
                      className="text-sm py-2 flex items-center space-x-2 rounded-full"
                    >
                      <Package className="w-4 h-4" />
                      <span>Mark Shipped</span>
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Created: {new Date(payment.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      ))}

      {sortedPayments.length === 0 && (
        <Card className="p-12">
          <p className="text-center text-gray-500 text-lg">No payments found</p>
        </Card>
      )}
    </div>
  );
};