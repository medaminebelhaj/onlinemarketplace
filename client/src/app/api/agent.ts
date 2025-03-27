import axios, {  AxiosError, AxiosResponse } from "axios";
import { router } from "../router/Routes";
import { toast } from "react-toastify";
import { Dispatch } from "redux";
import { Product } from "../models/product";
import type { Basket } from "../models/basket";
import basketService from "./basketService";
import { clearBasket } from "../features/basket/basketSlice";
import { store } from "../store/configureStors";



axios.defaults.baseURL = 'http://localhost:8081/api/';
const idle = () => new Promise(resolve => setTimeout(resolve, 100));
const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(async response => {
    await idle();
    return response;
}, (error: AxiosError) => {
    const { status } = error.response as AxiosResponse;
    switch (status) {
        case 404:
            toast.error("Ressource nicht gefunden");
            router.navigate('/not-found');
            break;
        case 500:
            toast.error("Interner Serverfehler aufgetreten");
            router.navigate('/server-error');
            break;
        default:
            break;
    }
    return Promise.reject(error.message);
});

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    patch: (url: string, body: object) =>
        fetch(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }).then(async (res) => {
          if (res.status === 204 || res.status === 205) {
            console.log(`Response for ${url} returned ${res.status} No Content`);
            return null;
          }
          if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            const errorMessage = errorData?.message || res.statusText;
            console.error(`Error for ${url}: ${errorMessage}`);
            throw new Error(errorMessage);
          }
          return res.json();
        }),
      
      
      
      
    delete: (url: string) => axios.delete(url).then(responseBody)
};

const Store = {
    apiUrl: 'http://localhost:8081/api/products',
    list: (page: number, size: number, brandId?: number, typeId?: number, url?: string) => {
        let requestUrl = url || `products?page=${page - 1}&size=${size}`;
        if (brandId !== undefined) {
            requestUrl += `&brandId=${brandId}`;
        }
        if (typeId !== undefined) {
            requestUrl += `&typeId=${typeId}`;
        }
        return requests.get(requestUrl);
    },
    details: (id: number) => requests.get(`products/${id}`),
    types: () => requests.get('products/types').then(types => [{ id: 0, name: 'Alle' }, ...types]),
    brands: () => requests.get('products/brands').then(brands => [{ id: 0, name: 'Alle' }, ...brands]),
    search: (keyword: string) => requests.get(`products?keyword=${keyword}`),
    createProduct: async (product: any) => {
        try {
            return await requests.post('products', product);
        } catch (error: any) {
            const response = error?.response;
            if (response) {
                console.error("Error creating product:", response.data || response.message);
            } else {
                console.error("Network or unexpected error:", error.message);
            }
            throw error;
        }
    },
    updateProduct: async (id: number, product: any) => {
        try {
            return await requests.put(`products/${id}`, product);
        } catch (error: any) {
            console.error("Error updating product:", error?.response?.data || error.message);
            throw error;
        }
    },
    deleteProduct: async (id: number) => {
        try {
            return await requests.delete(`products/${id}`);
        } catch (error: any) {
            console.error("Error deleting product:", error?.response?.data || error.message);
            throw error;
        }
    },
};

const Basket = {
    get: async () => {
        try {
            return await basketService.getBasket();
        } catch (error) {
            console.error("Fehler beim Abrufen des Warenkorbs: ", error);
            throw error;
        }
    },
    addItem: async (product: Product, dispatch: Dispatch) => {
        try {
            const result = await basketService.addItemToBasket(product, 1, dispatch);
            console.log(result);
            return result;
        } catch (error) {
            console.error("Fehler beim Hinzufügen eines Artikels zum Warenkorb:", error);
            throw error;
        }
    },
    removeItem: async (itemId: number, dispatch: Dispatch) => {
        try {
            await basketService.remove(itemId, dispatch);
        } catch (error) {
            console.error("Fehler beim Entfernen eines Artikels aus dem Warenkorb:", error);
            throw error;
        }
    },
    incrementItemQuantity: async (itemId: number, quantity: number = 1, dispatch: Dispatch) => {
        try {
            await basketService.incrementItemQuantity(itemId, quantity, dispatch);
        } catch (error) {
            console.error("Fehler beim Erhöhen der Artikelmenge im Warenkorb:", error);
            throw error;
        }
    },
    decrementItemQuantity: async (itemId: number, quantity: number = 1, dispatch: Dispatch) => {
        try {
            await basketService.decrementItemQuantity(itemId, quantity, dispatch);
        } catch (error) {
            console.error("Fehler beim Verringern der Artikelmenge im Warenkorb:", error);
            throw error;
        }
    },
    setBasket: async (basket: Basket, dispatch: Dispatch) => {
        try {
            await basketService.setBasket(basket, dispatch);
        } catch (error) {
            console.error("Fehler beim Aktualisieren des Warenkorbs:", error);
            throw error;
        }
    },
    deleteBasket: async (basketId: string) => {
        try {
            await basketService.deleteBasket(basketId);
        } catch (error) {
            console.log("Fehler beim Löschen des Warenkorbs");
            throw error;
        }
    }
};

const Account = {
    login: async (values: any) => {
        try {
            const response = await requests.post("auth/login", values);
            const { token, username } = response;
    
            // Store token and username in localStorage
            localStorage.setItem("jwtToken", token);
            localStorage.setItem("username", username);
    
            // Set Authorization header for subsequent requests
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
            // Fetch user details using the username
            const user = await Account.fetchUserByUsername(username);
    
            // Store user ID and details in localStorage
            localStorage.setItem("userId", user.id);
            localStorage.setItem("user", JSON.stringify(user));
      
            // Log user ID in console
            console.log("User ID after login:", user.id);
            
            return user;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    },
    
    
    fetchUserByUsername: async (username: string): Promise<any> => {
        try {
            const response = await requests.get(`users/by-username/${username}`);
            const user = response; // Ensure the response contains id, username, and role
            localStorage.setItem("userRole", user.role); // Store the role in localStorage
            return user;
        } catch (error) {
            console.error("Fetching user by username failed:", error);
            throw error;
        }
    },
    

    fetchCurrentUser: async () => {
        try {
            const token = localStorage.getItem("jwtToken");
            if (token) {
                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                const user = localStorage.getItem("user");
                return user ? JSON.parse(user) : null; // Retrieve user details from localStorage
            } else {
                throw new Error("No token found. Please log in.");
            }
        } catch (error) {
            console.error("Fetching current user failed:", error);
            throw error;
        }
    },

    logout: () => {
        try {
            console.log("Logout function called.");
            // Clear basket-related data from localStorage
            localStorage.removeItem("basket_id");
            localStorage.removeItem("basket");

            // Clear user authentication data
            localStorage.removeItem("jwtToken");
            localStorage.removeItem("username");
            localStorage.removeItem("user");
            localStorage.removeItem("userId");
            localStorage.removeItem("userId");


            store.dispatch(clearBasket());
            localStorage.clear();
            // Remove the Authorization header
            delete axios.defaults.headers.common["Authorization"];
    
            console.log("User logged out, and basket cleared.");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    },
};
const Orders = {
    create: async (values: any) => {
        try {
            const response = await requests.post('orders', values);
            return response;
        } catch (error) {
            console.error("Failed to create order:", error);
            throw error;
        }
    },
    list: () => requests.get('orders'),
    fetch: (id: number) => requests.get(`orders/${id}`),
    fetchByBasketId: async (basketId: string) => {
        try {
            const response = await requests.get(`orders/basket/${basketId}`);
            return response;
        } catch (error) {
            console.error("Failed to fetch orders by basket ID:", error);
            throw error;
        }
    },
    updateOrder: async (id: number, updatedOrder: any) => {
        try {
            const response = await requests.put(`orders/${id}`, updatedOrder); // Use PUT for full updates
            return response;
        } catch (error: any) {
            console.error("Failed to update the order:", error);
    
            if (error.response) {
                console.error("Error response data:", error.response.data);
                console.error("Error response status:", error.response.status);
            } else {
                console.error("Error details:", error.message || error);
            }
    
            throw error; // Re-throw the error for further handling if needed
        }
    },
    
    
    delete: async (id: number) => {
        try {
            const response = await requests.delete(`orders/${id}`);
            return response;
        } catch (error) {
            console.error("Failed to delete order:", error);
            throw error;
        }
    },
    
};
const Admin = {
    listUsers: async () => {
        try {
            const response = await requests.get('users'); // Fetch all users
            return response;
        } catch (error) {
            console.error("Failed to fetch users:", error);
            throw error;
        }
    },
    createUser: async (user: any) => {
        try {
            const response = await requests.post('users', user); // Create a new user
            return response;
        } catch (error) {
            console.error("Failed to create user:", error);
            throw error;
        }
    },
    updateUser: async (id: number, user: any) => {
        try {
            const response = await requests.put(`users/${id}`, user); // Update an existing user
            return response;
        } catch (error) {
            console.error("Failed to update user:", error);
            throw error;
        }
    },
    deleteUser: async (id: number) => {
        try {
            const response = await requests.delete(`users/${id}`); // Delete a user
            return response;
        } catch (error) {
            console.error("Failed to delete user:", error);
            throw error;
        }
    }
};


const agent = {
    Store,
    Basket,
    Account,
    Orders,
    Admin,

};

export default agent;

function dispatch(arg0: any) {
    throw new Error("Function not implemented.");
}
