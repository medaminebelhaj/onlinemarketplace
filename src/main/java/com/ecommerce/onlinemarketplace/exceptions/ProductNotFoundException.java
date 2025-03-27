package com.ecommerce.onlinemarketplace.exceptions;

public class ProductNotFoundException extends RuntimeException{
    public ProductNotFoundException(String message){super(message);}
}