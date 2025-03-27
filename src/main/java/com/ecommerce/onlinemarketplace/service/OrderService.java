package com.ecommerce.onlinemarketplace.service;

import com.ecommerce.onlinemarketplace.entity.OrderAggregate.Order;
import com.ecommerce.onlinemarketplace.model.OrderDto;
import com.ecommerce.onlinemarketplace.model.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface OrderService {
    OrderResponse getOrderById(Integer orderId);
    List<OrderResponse> getAllOrders();
    Page<OrderResponse> getAllOrders(Pageable pageable);
    Integer createOrder(OrderDto order);
    void deleteOrder(Integer orderId);
    public List<OrderResponse> getOrdersByBasketId(String basketId);

    public Order updateOrder(Integer id, Order updatedOrder);

}