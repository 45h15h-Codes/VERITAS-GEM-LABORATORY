import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

const statusCopy = {
    success: {
        title: 'Payment Successful',
        message: 'Thank you! Your order has been confirmed and will be processed shortly.',
        icon: CheckCircle2,
        iconClass: 'text-green-500',
    },
    cancelled: {
        title: 'Payment Cancelled',
        message: 'The PayPal checkout was cancelled. You can try again whenever you are ready.',
        icon: XCircle,
        iconClass: 'text-amber-500',
    },
    error: {
        title: 'Something Went Wrong',
        message: 'We could not verify your payment. Please contact support or try again.',
        icon: AlertCircle,
        iconClass: 'text-red-500',
    },
};

export const PaymentStatus: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const statusParam = (params.get('status') || 'error') as keyof typeof statusCopy;
    const copy = statusCopy[statusParam] ?? statusCopy.error;
    const Icon = copy.icon;
    const orderReference = params.get('order');

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-200 flex items-center justify-center px-4 py-16">
            <Card className="max-w-lg w-full p-10 rounded-3xl border-amber-300 shadow-2xl text-center">
                <div className="flex justify-center mb-6">
                    <div className={`rounded-full bg-white shadow-lg p-4 ${copy.iconClass}`}>
                        <Icon className="w-12 h-12" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{copy.title}</h1>
                <p className="text-gray-700 mb-8">{copy.message}</p>
                {orderReference && (
                    <p className="mb-8 text-sm text-gray-500">Reference ID: {orderReference}</p>
                )}
                <div className="space-y-3">
                    <Button onClick={() => { window.location.href = '/'; }} className='rounded-lg mr-2'>Go to Home</Button>
                    <Button variant="outline" onClick={() => navigate(-2)} className='rounded-lg mr-2' >
                        Go Back
                    </Button>
                </div>
            </Card>
        </div>
    );
};
