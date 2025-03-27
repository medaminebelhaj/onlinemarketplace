package com.ecommerce.onlinemarketplace.controller;

import com.ecommerce.onlinemarketplace.entity.OrderAggregate.Order;
import com.ecommerce.onlinemarketplace.model.OrderDto;
import com.ecommerce.onlinemarketplace.model.OrderResponse;
import com.ecommerce.onlinemarketplace.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrdersController {
    private final OrderService orderService;

    public OrdersController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Integer orderId){
        OrderResponse order = orderService.getOrderById(orderId);
        if(order!=null){
            return ResponseEntity.ok(order);
        }else{
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders(){
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<OrderResponse>> getAllOrdersPaged(Pageable pageable){
        Page<OrderResponse> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }


    @GetMapping("/basket/{basketId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByBasketId(@PathVariable String basketId) {
        List<OrderResponse> orders = orderService.getOrdersByBasketId(basketId);
        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.ok(orders);
        }
    }
    @PostMapping
    public ResponseEntity<Integer> createOrder(@Valid @RequestBody OrderDto orderDto){
        Integer orderId = orderService.createOrder(orderDto);
        if(orderId!=null){
            return ResponseEntity.status(HttpStatus.CREATED).body(orderId);
        }else{
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PutMapping("/{orderId}")
    public ResponseEntity<Order> updateOrder(@PathVariable Integer orderId, @RequestBody Order updatedOrder) {
        Order savedOrder = orderService.updateOrder(orderId, updatedOrder);
        return ResponseEntity.ok(savedOrder);
    }







    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Integer orderId){
        orderService.deleteOrder(orderId);
        return ResponseEntity.noContent().build();
    }
}