import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrdersByUserId, Order } from '../api/order';
import { Link } from 'react-router-dom';

const OrdersPage: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        
        const fetchOrders = async () => {
            try {
                const data = await getOrdersByUserId(user.sub);
                setOrders(data);
            } catch (err) {
                setError('Failed to load orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
                <p>Please log in to view your orders.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
                <p className="animate-pulse">Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
                <p className="text-red-500 font-semibold">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white py-12 px-6 lg:px-24">
            <h1 className="text-4xl font-bold mb-10 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-200">
                Your Invoices
            </h1>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-[#121212] rounded-xl border border-white/5">
                    <p className="text-gray-400 text-lg mb-6">You have no orders yet.</p>
                    <Link to="/auctions" className="px-6 py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition-colors">
                        Browse Auctions
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {orders.map((order) => {
                        const total = order.orderLineItemsList.reduce((acc, item) => acc + item.price * item.quantity, 0);

                        return (
                            <div key={order.id} className="bg-[#121212] rounded-xl border border-white/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-gold-500/30 transition-all">
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Order {order.orderNumber}</h3>
                                    <div className="space-y-1">
                                        {order.orderLineItemsList.map(item => (
                                            <p key={item.id} className="text-gray-400">
                                                {item.productName} (x{item.quantity}) - ${item.price.toFixed(2)}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500 mb-1">Total</p>
                                    <p className="text-2xl font-semibold text-gold-400">${total.toFixed(2)}</p>
                                    <button className="mt-4 px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded font-medium transition-colors text-sm">
                                        Pay Now
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
