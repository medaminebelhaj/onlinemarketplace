package com.ecommerce.onlinemarketplace.repository;

import com.ecommerce.onlinemarketplace.entity.Basket;
import org.springframework.data.repository.CrudRepository;

public interface BasketRepository extends CrudRepository<Basket , String> {
}
