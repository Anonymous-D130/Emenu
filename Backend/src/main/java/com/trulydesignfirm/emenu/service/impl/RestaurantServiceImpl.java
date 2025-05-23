package com.trulydesignfirm.emenu.service.impl;

import com.trulydesignfirm.emenu.actions.Response;
import com.trulydesignfirm.emenu.dto.OrderStatusUpdate;
import com.trulydesignfirm.emenu.enums.OrderStatus;
import com.trulydesignfirm.emenu.enums.SubscriptionStatus;
import com.trulydesignfirm.emenu.model.*;
import com.trulydesignfirm.emenu.repository.*;
import com.trulydesignfirm.emenu.service.FileService;
import com.trulydesignfirm.emenu.service.QrCodeService;
import com.trulydesignfirm.emenu.service.RestaurantService;
import com.trulydesignfirm.emenu.service.utils.EmailService;
import com.trulydesignfirm.emenu.service.utils.EmailStructures;
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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepo restaurantRepo;
    private final QrCodeService qrCodeService;
    private final Utility utility;
    private final FoodRepo foodRepo;
    private final SubCategoryRepo subCategoryRepo;
    private final CategoryRepo categoryRepo;
    private final OrderRepo orderRepo;
    private final SimpMessagingTemplate messagingTemplate;
    private final EmailService emailService;
    private final EmailStructures emailStructures;
    private final OrderItemRepo orderItemRepo;
    private final FileService fileService;

    @Value("${menu.website.url}")
    private String websiteUrl;

    @Value("${backend_url}")
    private String baseUrl;

    private final Path localPath = Paths.get("qr-codes");

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
    public Response createOrUpdateRestaurant(String token, Restaurant restaurantRequest) throws IOException {
        LoginUser owner = utility.getUserFromToken(token);
        Restaurant restaurant = restaurantRepo.getRestaurantByOwner(owner).orElse(null);
        if(checkPageName(token, restaurantRequest.getPageName())) {
            throw new IllegalArgumentException("Page name not available. Please choose another one.");
        }
        if (restaurant == null) {
            restaurantRequest.setOwner(owner);
            restaurantRequest.setActive(true);
            Restaurant savedRestro = restaurantRepo.save(restaurantRequest);
            Response response = new Response();
            response.setMessage("Restaurant created successfully.");
            response.setStatus(HttpStatus.CREATED);
            String body = emailStructures.generateRestaurantRegistrationEmail(savedRestro.getName());
            String subject = "Congratulations on Your Successful Registration!";
            emailService.sendEmail(savedRestro.getOwner().getEmail(), subject, body);
            return response;
        } else {
            restaurant.setName(restaurantRequest.getName());
            restaurant.setMobile(restaurantRequest.getMobile());
            restaurant.setQrCodes(
                    Objects.equals(restaurantRequest.getPageName(), restaurant.getPageName())
                            ? restaurant.getQrCodes()
                            : regenerateQrCodes(restaurantRequest)
            );
            restaurant.setPageName(restaurantRequest.getPageName());
            restaurant.setLogo(restaurantRequest.getLogo());
            restaurant.setWelcomeScreen(restaurantRequest.getWelcomeScreen());
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
        Category category = restaurant.getCategories().stream()
                .filter(cat -> cat.getId().equals(categoryId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.getSubCategories()
                .forEach(subCategory -> subCategory.getFoods()
                        .forEach(food -> orderItemRepo.findByFood(food)
                                .forEach(item -> item.setFood(null))));

        restaurant.getCategories().remove(category);
        categoryRepo.delete(category);
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
        }
        subCategory.getFoods().forEach(food -> orderItemRepo.findByFood(food).forEach(item -> item.setFood(null)));
        subCategoryRepo.delete(subCategory);
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
        LoginUser user = utility.getUserFromToken(token);
        if (user.getSubscription() == null) {
            if (getRestaurantFoods(token).size() >= 3) {
                throw new RuntimeException("Please complete the process to add more food items.");
            }
            SubCategory subCategory = subCategoryRepo.findById(subCategoryId)
                    .orElseThrow(() -> new RuntimeException("SubCategory not found"));

            if(food.getMenuPrice() <= 0 || food.getOfferPrice() <= 0){
                throw new RuntimeException("Price must be greater than 0");
            }

            Restaurant restaurant = getRestaurantByToken(token);
            boolean exists = foodRepo.existsByNameAndRestaurant(food.getName(), restaurant);
            if (exists) {
                response.setMessage("Food already exists");
                response.setStatus(HttpStatus.CONFLICT);
                return response;
            }

            food.setSubCategory(subCategory);
            food.setRestaurant(restaurant);
            food.setAvailable(true);
            foodRepo.save(food);
            response.setMessage("Food added successfully");
            response.setStatus(HttpStatus.CREATED);
            return response;
        }
        if (user.getSubscription().isExpired()) {
            throw new RuntimeException("Your subscription is not active.");
        }
        Integer menuLimit = user.getSubscription().getPlan().getMenuCount();
        if (menuLimit != null && getRestaurantFoods(token).size() >= menuLimit) {
            response.setMessage("Your subscription plan allows only " + menuLimit + " menu items.");
            response.setStatus(HttpStatus.FORBIDDEN);
            return response;
        }
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
        orderItemRepo.findByFood(existingFood).forEach(orderItem -> orderItem.setFood(null));
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
    public Response generateTableQRCodes(String token, int tables) throws IOException {
        LoginUser user = utility.getUserFromToken(token);
        if (user.getSubscription() == null){
            if (tables > 3) {
                throw new RuntimeException("Please try less with 3 or less.");
            }
            return saveQrCode(token, tables);
        }

        if(user.getSubscription().isExpired()) {
            throw new RuntimeException("Your subscription is not active.");
        }
        Integer allowedQrs = user.getSubscription().getPlan().getQrCount();
        if (allowedQrs != null && tables > allowedQrs) {
            throw new RuntimeException("Your plan allows a maximum of " + allowedQrs + " tables.");
        }
        return saveQrCode(token, tables);
    }

    @Override
    public List<Order> getOrdersByRestaurant(String token) {
        return orderRepo.findByRestaurantOrderByCreatedAtDesc(getRestaurantByToken(token));
    }

    @Override
    public List<Order> getOrdersByRestaurant(Restaurant restaurant) {
        return orderRepo.findByRestaurantOrderByCreatedAtDesc(restaurant);
    }

    @Override
    public List<Order> getRestaurantTodayOrders(String token) {
        return orderRepo.findByRestaurantAndCreatedAtBetweenOrderByCreatedAtDesc(
                getRestaurant(token),
                LocalDate.now().atStartOfDay(),
                LocalDate.now().atTime(23, 59, 59)
        );
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
        if (Utility.reservedWords().contains(pageName.toLowerCase())) return true;
        LoginUser owner = utility.getUserFromToken(token);
        Optional<Restaurant> optionalRestaurant = restaurantRepo.getRestaurantByOwner(owner);
        if (optionalRestaurant.isEmpty()) return restaurantRepo.existsByPageName(pageName);
        Restaurant restaurant = optionalRestaurant.get();
        return restaurantRepo.existsByPageName(pageName) && !pageName.equals(restaurant.getPageName());
    }

    @Override
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepo.findAll();
    }

    @Override
    public boolean isPlanUpgradable(String token) {
        if (getSubscriptionStatus(token) == SubscriptionStatus.ACTIVE) {
            Subscription subscription = utility.getUserFromToken(token).getSubscription();
            long remainingDays = ChronoUnit.DAYS.between(LocalDateTime.now(), subscription.getEndDate());
            return remainingDays > 30;
        }
        return false;
    }

    @Override
    public Restaurant getRestaurantByPage(String pageName) {
        return restaurantRepo.findByPageName(pageName)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));
    }

    @Override
    public Map<UUID, String> getOfferedServices(String token) {
        return getRestaurant(token).getServices();
    }

    @Override
    public Map<UUID, String> getRestaurantServices(String pageName) {
        return getRestaurantByPage(pageName).getServices();
    }

    @Override
    public Response addService(String token, String service) {
        Response response = new Response();
        Restaurant restaurant = getRestaurantByToken(token);
        if (restaurant.getServices().size() >= 10) {
            response.setMessage("Cannot add more than 10 services.");
            response.setStatus(HttpStatus.BAD_REQUEST);
            return response;
        }
        restaurant.getServices().put(UUID.randomUUID(), service);
        restaurantRepo.save(restaurant);
        response.setMessage("Service added successfully");
        response.setStatus(HttpStatus.OK);
        return response;
    }

    @Override
    public Response removeService(String token, UUID id) {
        Response response = new Response();
        Restaurant restaurant = getRestaurantByToken(token);
        restaurant.getServices().remove(id);
        restaurantRepo.save(restaurant);
        response.setMessage("Service removed successfully");
        response.setStatus(HttpStatus.OK);
        return response;
    }

    private Restaurant getRestaurantByToken(String token) {
        return restaurantRepo.getRestaurantByOwner(utility.getUserFromToken(token))
                .orElseThrow(() -> new RuntimeException("You haven't registered your restaurant."));
    }

    private void updateOrderStatus(UUID orderId, OrderStatus status) {
        OrderStatusUpdate update = new OrderStatusUpdate(orderId, status);
        messagingTemplate.convertAndSend("/topic/order-status", update);
    }

    private Response saveQrCode(String token, int tables) throws IOException {
        Response response = new Response();
        Restaurant restaurant = getRestaurantByToken(token);
        List<String> qrCodeUrls = new ArrayList<>(restaurant.getQrCodes() != null ? restaurant.getQrCodes() : new ArrayList<>());
        if (qrCodeUrls.size() > tables) {
            List<String> excessQrCodes = qrCodeUrls.subList(tables, qrCodeUrls.size());
            for (String excessQrCode : excessQrCodes) {
                String fileId = utility.extractIdFromUrl(excessQrCode);
                String info = fileService.deleteFile(UUID.fromString(fileId));
                log.info("Successfully deleted QR code: {}", info);
            }
            excessQrCodes.clear();
        } else for (int tableNumber = qrCodeUrls.size() + 1; tableNumber <= tables; tableNumber++) createQr(restaurant, qrCodeUrls, tableNumber);
        restaurant.setQrCodes(qrCodeUrls);
        restaurantRepo.save(restaurant);
        response.setMessage("QR code(s) generated successfully");
        response.setStatus(HttpStatus.CREATED);
        return response;
    }

    private List<String> regenerateQrCodes(Restaurant restaurant) throws IOException {
        int tables = restaurant.getQrCodes().size();
        List<String> oldQrCodes = new ArrayList<>(restaurant.getQrCodes());
        for (String oldQr : oldQrCodes) {
            String fileId = utility.extractIdFromUrl(oldQr);
            String info = fileService.deleteFile(UUID.fromString(fileId));
            log.info("Successfully deleted old QR code: {}", info);
        }
        List<String> newQrCodes = new ArrayList<>();
        Files.createDirectories(localPath);

        for (int tableNumber = 1; tableNumber <= tables; tableNumber++) createQr(restaurant, newQrCodes, tableNumber);
        return newQrCodes;
    }

    private void createQr(Restaurant restaurant, List<String> qrCodeUrls, int tableNumber) throws IOException {
        String qrText = "%s/%s?tableNumber=%d".formatted(websiteUrl, restaurant.getPageName(), tableNumber);
        Path savedPath = qrCodeService.saveQRCodeToFile(qrText, localPath)
                .orElseThrow(() -> new IOException("Failed to save QR code file"));
        String url = baseUrl + "/api/files/get-image/" + fileService.uploadFile(savedPath).getId();
        qrCodeUrls.add(url);
        Files.deleteIfExists(savedPath);
    }

}