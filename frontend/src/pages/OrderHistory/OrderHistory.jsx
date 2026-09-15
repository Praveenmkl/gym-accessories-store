import React, { useEffect, useState } from 'react';
import api from '../../api/client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/orders/myorders');
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to load order history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order? This will process a refund if payment was already made.")) {
      return;
    }
    
    try {
      const { data } = await api.put(`/orders/${orderId}/cancel`);
      alert(data.msg);
      fetchOrders(); // refresh list
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to cancel order.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-10 tracking-wider uppercase text-gray-900">MY ORDERS</h2>
      
      {error && <p className="text-red-500 text-center mb-6">{error}</p>}
      
      {orders.length === 0 && !error ? (
        <p className="text-center text-gray-500">You have no past orders.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 border-b pb-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg">Order #{order._id}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Badge variant={
                      order.status === 'confirmed' || order.status === 'delivered' ? 'default' : 
                      order.status === 'cancelled' ? 'destructive' : 'secondary'
                    } className="uppercase px-3 py-1">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">Rs. {item.price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-end sm:items-center border-t pt-4">
                  <div className="text-sm text-gray-500 mb-4 sm:mb-0 w-full sm:w-auto">
                    Payment Method: <span className="font-semibold text-gray-900">{order.paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="text-lg">
                      Total: <span className="font-bold">Rs. {order.total.toFixed(2)}</span>
                    </div>
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <Button variant="destructive" onClick={() => handleCancelOrder(order._id)}>
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
