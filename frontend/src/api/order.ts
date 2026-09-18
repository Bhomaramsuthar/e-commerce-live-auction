import api from './axios';

export interface OrderLineItem {
    id: number;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: number;
    orderNumber: string;
    userId: string;
    orderLineItemsList: OrderLineItem[];
}

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
    const response = await api.get(`/order/user/${userId}`);
    return response.data;
};
