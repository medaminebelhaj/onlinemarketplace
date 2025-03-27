package com.ecommerce.onlinemarketplace.service;


import com.ecommerce.onlinemarketplace.entity.Basket;
import com.ecommerce.onlinemarketplace.model.BasketResponse;

import java.util.List;

public interface BasketService {
    List<BasketResponse> getAllBaskets();
    BasketResponse getBasketById(String basketId);
    void deleteBasketById(String basketId);
    BasketResponse createBasket(Basket basket);
}