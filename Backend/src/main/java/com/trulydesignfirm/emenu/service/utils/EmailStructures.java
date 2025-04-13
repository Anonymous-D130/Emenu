package com.trulydesignfirm.emenu.service.utils;

import com.trulydesignfirm.emenu.model.SubscriptionPlan;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailStructures {

    @Value("${menu.support.email}")
    private String supportEmail;

    @Value("${menu.support.phone}")
    private String supportPhone;

    @Value("${menu.website.url}")
    private String websiteUrl;

    @Value("${menu.company.name}")
    private String companyName;

    public String generateOtpEmail(String otp, long validTime) {
        return """
            <html>
               <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                   <div style="max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; text-align: center;">
                       <h2 style="color: #007bff;">🔐 OTP Verification</h2>
        
                       <p>Dear User,</p>
                       <p>Your <b>One-Time Password (OTP)</b> for <b>%s</b> is:</p>
        
                       <p style="font-size: 22px; font-weight: bold; color: #d9534f; background-color: #f8d7da; display: inline-block; padding: 10px 20px; border-radius: 5px;">%s</p>
        
                       <p>This OTP is valid for <b>%d minutes</b>.</p>
                       <p style="color: red; font-weight: bold;">⚠ Do not share this OTP with anyone for security reasons.</p>
        
                       <p>If you did not request this OTP, please ignore this email or contact our support team immediately.</p>
        
                       <hr>
        
                       <p style="text-align: center; font-size: 14px; color: #555;">
                           <b>The %s Team</b> <br>
                           📧 Email: <a href="mailto:%s" style="color: #007bff;">%s</a> <br>
                           📞 Phone: %s <br>
                           🌐 Website: <a href="%s" style="color: #007bff;">%s</a>
                       </p>
                   </div>
               </body>
           </html>
        """.formatted(companyName, otp, validTime, companyName, supportEmail, supportEmail, supportPhone, websiteUrl, websiteUrl);
    }

    public String resetPassword(String token, long expiryTime, String email) {
        return """
        <html>
           <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
               <div style="max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; text-align: center;">
                   <h2 style="color: #007bff;">🔑 Reset Your Password</h2>
    
                   <p>Dear User,</p>
                   <p>We received a request to reset your password for your account.</p>
   
                   <p style="font-size: 18px; font-weight: bold; color: #5bc0de;">To reset your password, click the button below:</p>
   
                   <a href="%s/reset-password?token=%s&email=%s" style="display: inline-block; padding: 12px 30px; background-color: #28a745; color: white; font-size: 16px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Reset Password</a>
    
                   <p>This link will expire in <b>%d minutes</b>.</p>
                   <p style="color: red; font-weight: bold;">⚠ Please ignore this email if you did not request a password reset.</p>
    
                   <p style="margin-top: 15px;">
                       Or you can manually copy and paste this link into your browser:
                   </p>
                   <p style="font-size: 12px; font-weight: bold; color: #555;">
                       %s/reset-password?token=%s&email=%s
                   </p>
    
                   <hr>
   
                   <p style="text-align: center; font-size: 14px; color: #555;">
                       <b>The %s Team</b> <br>
                       📧 Email: <a href="mailto:%s" style="color: #007bff;">%s</a> <br>
                       📞 Phone: %s <br>
                       🌐 Website: <a href="%s" style="color: #007bff;">%s</a>
                   </p>
               </div>
           </body>
       </html>
    """.formatted(websiteUrl, token, email, expiryTime, websiteUrl, token, email, companyName, supportEmail, supportEmail, supportPhone, websiteUrl, websiteUrl);
    }

    public String generateEventInquiryEmail(String name, String email, String mobile, String eventDetails) {
        return """
        <html>
           <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
               <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                   <h2 style="color: #007bff; text-align: center;">📋 New Catering Service Inquiry</h2>

                   <p>Dear Admin,</p>
                   <p>You’ve received a new inquiry for catering services. Below are the details:</p>

                   <table style="width: 100%%; margin-top: 20px; border-collapse: collapse;">
                       <tr>
                           <td style="padding: 8px; font-weight: bold; border: 1px solid #eee;">Full Name:</td>
                           <td style="padding: 8px; border: 1px solid #eee;">%s</td>
                       </tr>
                       <tr>
                           <td style="padding: 8px; font-weight: bold; border: 1px solid #eee;">Email:</td>
                           <td style="padding: 8px; border: 1px solid #eee;">%s</td>
                       </tr>
                       <tr>
                           <td style="padding: 8px; font-weight: bold; border: 1px solid #eee;">Mobile:</td>
                           <td style="padding: 8px; border: 1px solid #eee;">%s</td>
                       </tr>
                       <tr>
                           <td style="padding: 8px; font-weight: bold; border: 1px solid #eee;">Event Details:</td>
                           <td style="padding: 8px; border: 1px solid #eee;">%s</td>
                       </tr>
                   </table>

                   <p style="margin-top: 30px;">Please reach out to the customer at your earliest convenience.</p>

                   <hr style="margin-top: 40px;">

                   <p style="text-align: center; font-size: 14px; color: #555;">
                       <b>The %s Team</b> <br>
                       📧 Email: <a href="mailto:%s" style="color: #007bff;">%s</a> <br>
                       📞 Phone: %s <br>
                       🌐 Website: <a href="%s" style="color: #007bff;">%s</a>
                   </p>
               </div>
           </body>
       </html>
    """.formatted(name, email, mobile, eventDetails, companyName, supportEmail, supportEmail, supportPhone, websiteUrl, websiteUrl);
    }

    public String generateRestaurantRegistrationEmail(String restaurantName) {
        return """
        <html>
           <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
               <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9; text-align: center;">
                   <h2 style="color: #28a745;">🎉 Congratulations on Your Successful Registration!</h2>

                   <p>Dear %s Team,</p>
                   <p>We are excited to inform you that your restaurant, <b>%s</b>, has been successfully registered with <b>%s</b>!</p>

                   <p>We believe that this marks the beginning of a fruitful partnership, and we are thrilled to have you on board. You can now start managing your menu, receiving orders, and providing your customers with an enhanced dining experience!</p>

                   <p>If you need any assistance or have questions, feel free to reach out to our support team. We’re always here to help!</p>

                   <hr style="margin-top: 40px;">

                   <p style="text-align: center; font-size: 14px; color: #555;">
                       <b>The %s Team</b> <br>
                       📧 Email: <a href="mailto:%s" style="color: #007bff;">%s</a> <br>
                       📞 Phone: %s <br>
                       🌐 Website: <a href="%s" style="color: #007bff;">%s</a>
                   </p>
               </div>
           </body>
       </html>
    """.formatted(restaurantName, restaurantName, companyName, companyName, supportEmail, supportEmail, supportPhone, websiteUrl, websiteUrl);
    }

    public String generateSubscriptionSuccessEmail(String owner, SubscriptionPlan plan) {
        StringBuilder featuresList = new StringBuilder();
        if (plan.getFeatures() != null && !plan.getFeatures().isEmpty()) {
            featuresList.append("<li><strong>Features Included:</strong><ul>");
            for (String feature : plan.getFeatures()) {
                featuresList.append("<li>").append(feature).append("</li>");
            }
            featuresList.append("</ul></li>");
        }

        return """
    <html>
    <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
            <h2 style="color: #4CAF50;">🎉 Subscription Purchased Successfully!</h2>
            <p>Dear %s,</p>
            <p>Thank you for subscribing to our <strong>%s</strong> plan.</p>
            <p>Here are the details of your subscription:</p>
            <ul>
                <li><strong>Plan Name:</strong> %s</li>
                <li><strong>Price:</strong> ₹%s</li>
                <li><strong>Duration:</strong> %d day(s)</li>
                %s
                <li><strong>Description:</strong> %s</li>
            </ul>
            <p>We’re excited to have you on board. Enjoy the premium features and feel free to reach out if you have any questions.</p>
            <hr style="margin-top: 40px;">

               <p style="text-align: center; font-size: 14px; color: #555;">
                   <b>The %s Team</b> <br>
                   📧 Email: <a href="mailto:%s" style="color: #007bff;">%s</a> <br>
                   📞 Phone: %s <br>
                   🌐 Website: <a href="%s" style="color: #007bff;">%s</a>
               </p>
        </div>
    </body>
    </html>
    """.formatted(
            owner,
            plan.getTitle(),
            plan.getTitle(),
            plan.getPrice().toPlainString(),
            plan.getDuration(),
            featuresList.toString(),
            plan.getDescription(),
            companyName, supportEmail, supportEmail, supportPhone, websiteUrl, websiteUrl
        );
    }
}