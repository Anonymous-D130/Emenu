package com.trulydesignfirm.emenu.service.impl;

import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.dto.OrderStatusUpdate;
import com.trulydesignfirm.emenu.enums.OrderStatus;
import com.trulydesignfirm.emenu.enums.SubscriptionStatus;
import com.trulydesignfirm.emenu.model.*;
import com.trulydesignfirm.emenu.repository.*;
import com.trulydesignfirm.emenu.service.QrCodeService;
import com.trulydesignfirm.emenu.service.RestaurantService;
import com.trulydesignfirm.emenu.service.utils.CloudinaryService;
import com.trulydesignfirm.emenu.service.utils.Utility;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepo restaurantRepo;
    private final QrCodeService qrCodeService;
    private final CloudinaryService cloudinaryService;
    private final Utility utility;
    private final FoodRepo foodRepo;
    private final SubCategoryRepo subCategoryRepo;
    private final CategoryRepo categoryRepo;
    private final OrderRepo orderRepo;
    private final SimpMessagingTemplate messagingTemplate;

    @Value("${menu.website.url}")
    private String websiteUrl;

    @Value("${menu.customer.route}")
    private String customerRoute;

    @Override
    public Restaurant getRestaurant(String token) {
        return getRestaurantByToken(token);
    }

    @Override
    public SubscriptionStatus getSubscriptionStatus(String token) {
        LoginUser user = utility.getUserFromToken(token);
        Subscription subscription = user.getSubscription();
        if (subscription == null) {
            return SubscriptionStatus.NEW;
        }
        return subscription.isExpired() ? SubscriptionStatus.EXPIRED : SubscriptionStatus.ACTIVE;
    }

    @Override
    public Response createOrUpdateRestaurant(String token, Restaurant restaurantRequest) {
        LoginUser owner = utility.getUserFromToken(token);
        Restaurant restaurant = restaurantRepo.getRestaurantByOwner(owner).orElse(null);
        if(restaurantRepo.existsByPageName(restaurantRequest.getPageName())){
            throw new IllegalArgumentException("Page name already taken. Please choose another one.");
        }
        if (restaurant == null) {
            restaurantRequest.setOwner(owner);
            restaurantRepo.save(restaurantRequest);
            Response response = new Response();
            response.setMessage("Restaurant created successfully.");
            response.setStatus(HttpStatus.CREATED);
            return response;
        } else {
            restaurant.setName(restaurantRequest.getName());
            restaurant.setMobile(restaurantRequest.getMobile());
            restaurant.setPageName(restaurantRequest.getPageName());
            restaurant.setLogo(restaurantRequest.getLogo());
            restaurant.setWelcomeScreen(restaurantRequest.getWelcomeScreen());
            restaurant.setQrCodes(restaurantRequest.getQrCodes());
            restaurantRepo.save(restaurant);
            Response response = new Response();
            response.setMessage("Restaurant updated successfully.");
            response.setStatus(HttpStatus.OK);
            return response;
        }
    }

    @Override
    public Restaurant getRestaurantById(UUID id) {
        return restaurantRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    @Override
    public Map<String, Object> getDashboard(String token) {
        Restaurant restaurant = getRestaurantByToken(token);
        Map<String, Object> dashboard = new LinkedHashMap<>();
        List<OrderStatus> inProgressStatuses = List.of(
                OrderStatus.PREPARING,
                OrderStatus.ACCEPTED,
                OrderStatus.READY_FOR_PICKUP
        );
        long totalOrders = orderRepo.countByRestaurant(restaurant);
        long completedOrders = orderRepo.countByRestaurantAndStatus(restaurant, OrderStatus.COMPLETED);
        long pendingOrders = orderRepo.countByRestaurantAndStatus(restaurant, OrderStatus.PENDING);
        long inProgressOrders = orderRepo.countByRestaurantAndStatusIn(restaurant, inProgressStatuses);
        long rejectedOrders = orderRepo.countByRestaurantAndStatus(restaurant, OrderStatus.REJECTED);
        double totalBillingAmount = orderRepo.sumTotalAmountByRestaurant(restaurant).orElse(0.0);
        List<Integer> tablesFilled = orderRepo.findDistinctTableNumbersByRestaurantAndStatusIn(restaurant, inProgressStatuses);
        int totalTables = restaurant.getTables();
        dashboard.put("totalOrders", totalOrders);
        dashboard.put("completedOrders", completedOrders);
        dashboard.put("pendingOrders", pendingOrders);
        dashboard.put("inProgressOrders", inProgressOrders);
        dashboard.put("rejectedOrders", rejectedOrders);
        dashboard.put("totalBillingAmount", totalBillingAmount);
        dashboard.put("tablesFilled", tablesFilled);
        dashboard.put("totalTables", totalTables);
        return dashboard;
    }

    @Override
    public List<Category> getRestaurantCategories(String token) {
        return categoryRepo.findAllByRestaurantOrderByName(getRestaurantByToken(token));
    }

    @Override
    public Response toggleActive(String token) {
        Restaurant restaurant = getRestaurantByToken(token);
        restaurant.setActive(!restaurant.isActive());
        restaurantRepo.save(restaurant);
        Response response = new Response();
        response.setMessage("Restaurant status updated successfully.");
        response.setStatus(HttpStatus.OK);
        return response;
    }

    @Override
    public Response addRestaurantCategory(String token, Category category) {
        Restaurant restaurant = getRestaurantByToken(token);
        Response response = new Response();
        boolean alreadyExists = restaurant.getCategories()
                .stream()
                .anyMatch(c -> c.getName().equalsIgnoreCase(category.getName()));
        if (alreadyExists) {
            response.setMessage("Category already exists for this restaurant");
            response.setStatus(HttpStatus.CONFLICT);
            return response;
        }
        category.setRestaurant(restaurant);
        restaurant.getCategories().add(category);
        restaurantRepo.save(restaurant);
        response.setMessage("Category added successfully");
        response.setStatus(HttpStatus.CREATED);
        return response;
    }

    @Override
    public Response updateRestaurantCategory(String token, UUID categoryId, Category updatedCategory) {
        Restaurant restaurant = getRestaurantByToken(token);
        Category existingCategory = restaurant.getCategories().stream()
                .filter(category -> category.getId().equals(categoryId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Category not found"));
        existingCategory.setName(updatedCategory.getName());
        restaurantRepo.save(restaurant);
        Response response = new Response();
        response.setMessage("Category updated successfully");
        response.setStatus(HttpStatus.OK);
        return response;
    }

    @Override
    public Response deleteRestaurantCategory(String token, UUID categoryId) {
        Restaurant restaurant = getRestaurantByToken(token);
        boolean removed = restaurant.getCategories().removeIf(category -> category.getId().equals(categoryId));
        if (!removed)
            throw new RuntimeException("Category not found");
        restaurantRepo.save(restaurant);
        Response response = new Response();
        response.setMessage("Category removed successfully");
        response.setStatus(HttpStatus.OK);
        return response;
    }

    @Override
    public List<SubCategory> getCategorySubCategories(String token, UUID categoryId) {
        Restaurant restaurant = getRestaurantByToken(token);
        Category category = restaurant.getCategories().stream()
                .filter(c -> c.getId().equals(categoryId))
                .findFirst().orElseThrow(() -> new RuntimeException("Category not found"));
        List<SubCategory> subCategories = category.getSubCategories();
        subCategories.sort(Comparator.comparing(SubCategory::getName));
        return subCategories;
    }

    @Override
    public Response addCategorySubCategory(String token, SubCategory subCategory, UUID categoryId) {
        Response response = new Response();
        Restaurant restaurant = getRestaurantByToken(token);
        Category category = restaurant.getCategories().stream()
                .filter(c -> c.getId().equals(categoryId))
                .findFirst().orElseThrow(() -> new RuntimeException("Category not found"));
        boolean exist = category.getSubCategories().stream()
                .anyMatch(s -> s.getName().equals(subCategory.getName()));
        if (exist) {
            response.setMessage("This Sub-Category already exists");
            response.setStatus(HttpStatus.CONFLICT);
            return response;
        }
        subCategory.setCategory(category);
        category.getSubCategories().add(subCategory);
        categoryRepo.save(category);
        response.setMessage("SubCategory added successfully");
        response.setStatus(HttpStatus.CREATED);
        return response;
    }

    @Override
    public Response updateCategorySubCategory(String token, UUID subCategoryId, SubCategory updatedSubCategory) {
        Response response = new Response();
        Restaurant restaurant = getRestaurantByToken(token);
        SubCategory subCategory = subCategoryRepo.findById(subCategoryId)
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));
        boolean equals = subCategory.getCategory().getRestaurant().equals(restaurant);
        if (!equals) {
            throw new RuntimeException("SubCategory not found");
        }
        subCategory.setName(updatedSubCategory.getName());
        subCategoryRepo.save(subCategory);
        response.setMessage("SubCategory updated successfully");
        response.setStatus(HttpStatus.OK);
        return response;
    }

    @Override
    public Response deleteCategorySubCategory(String token, UUID id) {
        Response response = new Response();
        Restaurant restaurant = getRestaurantByToken(token);
        SubCategory subCategory = subCategoryRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));
        if (!subCategory.getCategory().getRestaurant().equals(restaurant)) {
            throw new RuntimeException("SubCategory not found");
        } subCategoryRepo.delete(subCategory);
        response.setMessage("SubCategory removed successfully");
        response.setStatus(HttpStatus.OK);
        return response;
    }

    @Override
    public List<Food> getRestaurantFoods(String token) {
        return foodRepo.findAllByRestaurant(getRestaurantByToken(token));
    }

    @Override
    public List<Food> getRestaurantFoodsByCategory(String token, UUID categoryId) {
        Restaurant restaurant = getRestaurantByToken(token);
        Category category = restaurant.getCategories().stream()
                .filter(c -> c.getId().equals(categoryId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Category not found"));
        return foodRepo.findAllBySubCategoryIn(category.getSubCategories());
    }

    @Override
    public List<Food> getRestaurantFoodsBySubCategory(String token, UUID subCategoryId) {
        Restaurant restaurant = getRestaurantByToken(token);
        SubCategory subCategory = subCategoryRepo.findById(subCategoryId)
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));
        return foodRepo.findAllByRestaurantAndSubCategoryOrderByName(restaurant, subCategory);
    }

    @Override
    public Response addRestaurantFood(String token, Food food, UUID subCategoryId) {
        Response response = new Response();
        Restaurant restaurant = getRestaurantByToken(token);
        boolean exists = foodRepo.existsByNameAndRestaurant(food.getName(), restaurant);
        if (exists) {
            response.setMessage("Food already exists");
            response.setStatus(HttpStatus.CONFLICT);
            return response;
        }
        SubCategory subCategory = subCategoryRepo.findById(subCategoryId)
                .orElseThrow(() -> new RuntimeException("SubCategory not found"));
        if(food.getMenuPrice() <= 0 || food.getOfferPrice() <= 0){
            throw new RuntimeException("Price must be greater than 0");
        }
        food.setSubCategory(subCategory);
        food.setRestaurant(restaurant);
        food.setAvailable(true);
        foodRepo.save(food);
        response.setMessage("Food added successfully");
        response.setStatus(HttpStatus.CREATED);
        return response;
    }

    @Override
    public Response updateRestaurantFood(String token, Food updatedFood, UUID foodId) {
        var response = new Response();
        Restaurant restaurant = getRestaurantByToken(token);
        Food existingFood = foodRepo.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food Item not found"));
        if(!existingFood.getRestaurant().equals(restaurant)){
            throw new RuntimeException("Food Item not found");
        }
        if (updatedFood.getName() != null) existingFood.setName(updatedFood.getName());
        if (updatedFood.getImageUrl() != null) existingFood.setImageUrl(updatedFood.getImageUrl());
        if (updatedFood.getMenuPrice() != 0) existingFood.setMenuPrice(updatedFood.getMenuPrice());
        if (updatedFood.getOfferPrice() != 0) existingFood.setOfferPrice(updatedFood.getOfferPrice());
        if (updatedFood.getDescription() != null) existingFood.setDescription(updatedFood.getDescription());
        if (updatedFood.getFoodType() != null) existingFood.setFoodType(updatedFood.getFoodType());
        if (updatedFood.getMeatType() != null) existingFood.setMeatType(updatedFood.getMeatType());
        if (updatedFood.getServingInfo() != null) existingFood.setServingInfo(updatedFood.getServingInfo());
        if (updatedFood.getTag() != null) existingFood.setTag(updatedFood.getTag());
        if (updatedFood.getNutritionInfo() != null) existingFood.setNutritionInfo(updatedFood.getNutritionInfo());
        if (updatedFood.getSubCategory() != null) existingFood.setSubCategory(updatedFood.getSubCategory());
        existingFood.setAvailable(updatedFood.isAvailable());
        foodRepo.save(existingFood);
        response.setMessage("Food item updated successfully");
        response.setStatus(HttpStatus.OK);
        return response;
    }

    @Override
    public Response toggleFoodAvailability(String token, UUID foodId) {
        Restaurant restaurant = getRestaurantByToken(token);
        Food existingFood = foodRepo.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food Item not found"));
        if(!existingFood.getRestaurant().equals(restaurant)){
            throw new RuntimeException("Food Item not found");
        }
        Response response = new Response();
        existingFood.setAvailable(!existingFood.isAvailable());
        foodRepo.save(existingFood);
        response.setMessage("Food item updated successfully");
        response.setStatus(HttpStatus.OK);
        return response;
    }

    @Override
    public Response deleteRestaurantFood(String token, UUID foodId) {
        Response response = new Response();
        Restaurant restaurant = getRestaurantByToken(token);
        Food existingFood = foodRepo.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food Item not found"));
        if(!existingFood.getRestaurant().equals(restaurant)){
            throw new RuntimeException("Food Item not found");
        }
        foodRepo.delete(existingFood);
        response.setMessage("Food item deleted successfully");
        response.setStatus(HttpStatus.OK);
        return response;
    }

    @Override
    public List<String> fetchRestaurantQrCodes(String token) {
        return getRestaurantByToken(token).getQrCodes();
    }

    @Override
    public Response generateTableQRCodes(String token, int tables) {
        Response response = new Response();
        Restaurant restaurant = getRestaurantByToken(token);
        List<String> qrCodePaths = new ArrayList<>();
        for (int tableNumber = 1; tableNumber <= tables; tableNumber++) {
            String qrText = "%s/%s/?restaurantId=%s&tableNumber=%d".formatted(websiteUrl, customerRoute, restaurant.getId(), tableNumber);
            Path localPath = Paths.get("qr-codes");
            qrCodeService.saveQRCodeToFile(qrText, localPath).ifPresent(path -> {
                try {
                    String cloudinaryUrl = cloudinaryService.uploadFile(path.toFile());
                    qrCodePaths.add(cloudinaryUrl);
                } catch (IOException e) {
                    throw new RuntimeException("Failed to upload QR to Cloudinary");
                } finally {
                    try {
                        Files.deleteIfExists(path);
                    } catch (IOException e) {
                        System.err.println("Failed to delete local QR file: " + path);
                    }
                }
            });
        }
        restaurant.setQrCodes(qrCodePaths);
        restaurantRepo.save(restaurant);
        response.setMessage("QR code generated successfully");
        response.setStatus(HttpStatus.CREATED);
        return response;
    }

    @Override
    public List<Order> getOrdersByRestaurant(String token) {
        return orderRepo.findByRestaurantOrderByCreatedAtDesc(getRestaurantByToken(token));
    }

    @Override
    public Response updateOrderStatus(String token, UUID orderId, OrderStatus orderStatus) {
        Restaurant restaurant = getRestaurantByToken(token);
        Order order = orderRepo.findByRestaurantAndId(restaurant, orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if(order.getStatus().equals(OrderStatus.REJECTED)){
            throw new IllegalArgumentException("Canceled Order cannot be updated");
        }
        order.setStatus(orderStatus);
        orderRepo.save(order);
        updateOrderStatus(orderId, orderStatus);
        Response response = new Response();
        response.setMessage("Order updated successfully");
        response.setStatus(HttpStatus.OK);
        return response;
    }

    @Override
    public Response cancelOrder(String token, UUID orderId) {
        Restaurant restaurant = getRestaurantByToken(token);
        Order order = orderRepo.findByRestaurantAndId(restaurant, orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if(order.getStatus().equals(OrderStatus.REJECTED)){
            throw new IllegalArgumentException("Order is already cancelled");
        } if (order.getStatus().equals(OrderStatus.COMPLETED)) {
            throw new IllegalArgumentException("Order is already completed");
        }
        order.setStatus(OrderStatus.REJECTED);
        orderRepo.save(order);
        updateOrderStatus(orderId, OrderStatus.REJECTED);
        Response response = new Response();
        response.setMessage("Order cancelled successfully");
        response.setStatus(HttpStatus.OK);
        return response;
    }

    @Override
    public List<Order> getOrdersByTable(String  token, int tableNumber) {
        return orderRepo.findByRestaurantAndTableNumber(getRestaurantByToken(token), tableNumber);
    }

    @Override
    public boolean checkPageName(String token, String pageName) {
        LoginUser owner = utility.getUserFromToken(token);
        Optional<Restaurant> optionalRestaurant = restaurantRepo.getRestaurantByOwner(owner);
        if (optionalRestaurant.isEmpty()) return restaurantRepo.existsByPageName(pageName);
        Restaurant restaurant = optionalRestaurant.get();
        return restaurantRepo.existsByPageName(pageName) && !pageName.equals(restaurant.getPageName());
    }

    private Restaurant getRestaurantByToken(String token) {
        return restaurantRepo.getRestaurantByOwner(utility.getUserFromToken(token))
                .orElseThrow(() -> new RuntimeException("You haven't registered your restaurant."));
    }

    private void updateOrderStatus(UUID orderId, OrderStatus status) {
        OrderStatusUpdate update = new OrderStatusUpdate(orderId, status);
        messagingTemplate.convertAndSend("/topic/order-status", update);
    }

}