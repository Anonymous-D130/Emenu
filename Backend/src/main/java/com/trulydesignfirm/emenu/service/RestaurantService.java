package com.trulydesignfirm.emenu.service;

import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.enums.OrderStatus;
import com.trulydesignfirm.emenu.enums.SubscriptionStatus;
import com.trulydesignfirm.emenu.model.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public interface RestaurantService {
    Restaurant getRestaurant(String token);
    SubscriptionStatus getSubscriptionStatus(String token);
    Response createOrUpdateRestaurant(String token, Restaurant restaurantRequest);
    Restaurant getRestaurantById(UUID id);
    Map<String, ?> getDashboard(String token);
    List<Category> getRestaurantCategories(String token);
    Response toggleActive(String token);
    Response addRestaurantCategory(String token, Category category);
    Response updateRestaurantCategory(String token, UUID categoryId, Category updatedCategory);
    Response deleteRestaurantCategory(String token, UUID id);
    List<SubCategory> getCategorySubCategories(String token, UUID categoryId);
    Response addCategorySubCategory(String token, SubCategory subCategory, UUID categoryId);
    Response updateCategorySubCategory(String token, UUID subCategoryId, SubCategory updatedSubCategory);
    Response deleteCategorySubCategory(String token, UUID id);
    List<Food> getRestaurantFoods(String token);
    List<Food> getRestaurantFoodsByCategory(String token, UUID categoryId);
    List<Food> getRestaurantFoodsBySubCategory(String token, UUID subCategoryId);
    Response addRestaurantFood(String token, Food food, UUID subCategoryId);
    Response updateRestaurantFood(String token, Food food, UUID foodId);
    Response toggleFoodAvailability(String token, UUID foodId);
    Response deleteRestaurantFood(String token, UUID foodId);
    List<String> fetchRestaurantQrCodes(String token);
    Response generateTableQRCodes(String token, int tables);
    List<Order> getOrdersByRestaurant(String token);
    List<Order> getRestaurantTodayOrders(String token);
    Response updateOrderStatus(String token, UUID orderId, OrderStatus orderStatus);
    Response cancelOrder(String token, UUID orderId);
    List<Order> getOrdersByTable(String token, int tableNumber);
    boolean checkPageName(String token, String pageName);
}
