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

    @Value("${menu.company.logo}")
    private String companyLogo;

    public String generateOtpEmail(String otp, long validTime) {
        return """
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px; color: #333;">
            <div style="max-width: 550px; margin: auto; background: #ffffff; border: 1px solid #ddd; padding: 30px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); text-align: center;">
                
                <img src="%s" alt="%s Logo" style="max-width: 150px; margin-bottom: 20px;" />
                
                <h2 style="color: #007bff;">🔐 OTP Verification</h2>
                
                <p>Dear User,</p>
                <p>Your <b>One-Time Password (OTP)</b> for <b>%s</b> is:</p>
                
                <p style="font-size: 24px; font-weight: bold; color: #d9534f; background-color: #f8d7da; display: inline-block; padding: 12px 24px; border-radius: 6px; margin: 15px 0;">%s</p>
                
                <p>This OTP is valid for <b>%d minutes</b>.</p>
                <p style="color: red; font-weight: bold;">⚠ Never share this OTP with anyone.</p>
                
                <p>If you did not request this OTP, please ignore this email or contact our support team immediately.</p>
                
                <hr style="margin: 30px 0;">
                
                <p style="text-align: center; font-size: 14px; color: #555;">
                    <b>The %s Team</b><br>
                    📧 Email: <a href="mailto:%s" style="color: #007bff;">%s</a><br>
                    📞 Phone: %s<br>
                    🌐 Website: <a href="%s" style="color: #007bff;">%s</a>
                </p>
            </div>
        </body>
        </html>
        """.formatted(
                companyLogo, companyName,
                companyName, otp, validTime,
                companyName, supportEmail, supportEmail, supportPhone, websiteUrl, websiteUrl
        );
    }

    public String resetPassword(String token, long expiryTime, String email) {
        return """
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px; color: #333;">
            <div style="max-width: 550px; margin: auto; background: #ffffff; border: 1px solid #ddd; padding: 30px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); text-align: center;">
                
                <img src="%s" alt="%s Logo" style="max-width: 150px; margin-bottom: 20px;" />
                
                <h2 style="color: #007bff;">🔑 Reset Your Password</h2>
                
                <p>Hello,</p>
                <p>We received a request to reset the password for your account.</p>
                
                <p style="font-size: 18px; font-weight: bold; color: #5bc0de;">Click the button below to reset your password:</p>
                
                <a href="%s/reset-password?token=%s&email=%s" style="display: inline-block; padding: 12px 30px; background-color: #28a745; color: white; font-size: 16px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Reset Password</a>
                
                <p style="margin-top: 20px;">This link will expire in <b>%d minutes</b>.</p>
                
                <p style="color: red; font-weight: bold; margin-top: 10px;">⚠ If you did not request this, please ignore this email.</p>
                
                <p style="margin-top: 25px;">Or copy and paste this link into your browser:</p>
                
                <p style="word-break: break-all; font-size: 12px; font-weight: bold; color: #555;">
                    %s/reset-password?token=%s&email=%s
                </p>
                
                <hr style="margin: 30px 0;">
                
                <p style="text-align: center; font-size: 14px; color: #555;">
                    <b>The %s Team</b><br>
                    📧 Email: <a href="mailto:%s" style="color: #007bff;">%s</a><br>
                    📞 Phone: %s<br>
                    🌐 Website: <a href="%s" style="color: #007bff;">%s</a>
                </p>
            </div>
        </body>
        </html>
        """.formatted(
                companyLogo, companyName,
                websiteUrl, token, email,
                expiryTime,
                websiteUrl, token, email,
                companyName, supportEmail, supportEmail, supportPhone, websiteUrl, websiteUrl
        );
    }

    public String generateEventInquiryEmail(String name, String email, String mobile, String eventDetails) {
        return """
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px; color: #333;">
            <div style="max-width: 650px; margin: auto; background: #ffffff; border: 1px solid #ddd; padding: 30px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        
                <div style="text-align: center;">
                    <img src="%s" alt="%s Logo" style="max-width: 150px; margin-bottom: 20px;" />
                </div>
        
                <h2 style="color: #007bff; text-align: center;">📋 New Catering Service Inquiry</h2>
        
                <p>Dear Admin,</p>
                <p>You’ve received a new inquiry for catering services. Below are the submitted details:</p>
        
                <table style="width: 100%%; margin-top: 20px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd; background-color: #f2f2f2;">Full Name:</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd; background-color: #f2f2f2;">Email:</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd; background-color: #f2f2f2;">Mobile:</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd; background-color: #f2f2f2;">Event Details:</td>
                        <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
                    </tr>
                </table>
        
                <p style="margin-top: 30px;">Please follow up with the customer as soon as possible to provide further assistance or gather additional information.</p>
        
                <hr style="margin-top: 40px;">
        
                <p style="text-align: center; font-size: 14px; color: #555;">
                    <b>The %s Team</b><br>
                    📧 Email: <a href="mailto:%s" style="color: #007bff;">%s</a><br>
                    📞 Phone: %s<br>
                    🌐 Website: <a href="%s" style="color: #007bff;">%s</a>
                </p>
            </div>
        </body>
        </html>
        """.formatted(
                companyLogo, companyName,
                name, email, mobile, eventDetails,
                companyName, supportEmail, supportEmail, supportPhone, websiteUrl, websiteUrl
        );
    }

    public String generateRestaurantRegistrationEmail(String restaurantName) {
        return """
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px; color: #333;">
            <div style="max-width: 650px; margin: auto; background: #ffffff; border: 1px solid #ddd; padding: 30px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        
                <div style="text-align: center;">
                    <img src="%s" alt="%s Logo" style="max-width: 150px; margin-bottom: 20px;" />
                </div>
        
                <h2 style="color: #28a745; text-align: center;">🎉 Welcome to %s!</h2>
        
                <p>Dear <strong>%s Team</strong>,</p>
        
                <p>We’re delighted to let you know that your restaurant, <strong>%s</strong>, has been successfully registered with <strong>%s</strong>.</p>
        
                <p>You can now log in to your dashboard to configure your menu, manage orders, and access all the features designed to help you serve your customers better.</p>
        
                <p>If you have any questions or need assistance, our support team is here for you anytime.</p>
        
                <p>We look forward to a successful partnership!</p>
        
                <hr style="margin: 40px 0;">
        
                <p style="text-align: center; font-size: 14px; color: #555;">
                    <strong>The %s Team</strong><br>
                    📧 Email: <a href="mailto:%s" style="color: #007bff;">%s</a><br>
                    📞 Phone: %s<br>
                    🌐 Website: <a href="%s" style="color: #007bff;">%s</a>
                </p>
            </div>
        </body>
        </html>
        """.formatted(
                companyLogo, companyName, companyName,
                restaurantName, restaurantName, companyName,
                companyName, supportEmail, supportEmail, supportPhone, websiteUrl, websiteUrl
        );
    }

    public String generateSubscriptionSuccessEmail(String owner, SubscriptionPlan plan, boolean isAnnual) {
        StringBuilder featuresList = details(plan);
        long duration = isAnnual ? plan.getDuration() * 12 : plan.getDuration();
        String price = isAnnual ? plan.getDisPrice() + " × 12" : plan.getPrice().toPlainString();

        return """
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 30px;">
            <div style="max-width: 650px; margin: auto; background: #ffffff; border: 1px solid #e0e0e0; padding: 30px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        
                <div style="text-align: center;">
                    <img src="%s" alt="%s Logo" style="max-width: 150px; margin-bottom: 20px;" />
                </div>
        
                <h2 style="color: #4CAF50; text-align: center;">🎉 Subscription Purchased Successfully!</h2>
        
                <p>Dear <strong>%s</strong>,</p>
                <p>Thank you for subscribing to our <strong>%s</strong> plan.</p>
                <p>Here are the details of your subscription:</p>
        
                <div style="background-color: #e8f5e9; padding: 20px; border-left: 4px solid #4CAF50; border-radius: 6px; margin-top: 20px;">
                    <ul style="padding-left: 20px; line-height: 1.6;">
                        <li><strong>Plan Name:</strong> %s</li>
                        <li><strong>Price:</strong> ₹%s</li>
                        <li><strong>Duration:</strong> %d day(s)</li>
                        %s
                        <li><strong>Description:</strong> %s</li>
                    </ul>
                </div>
        
                <p style="margin-top: 30px;">We’re excited to have you on board! Enjoy the premium features and feel free to reach out to us anytime.</p>
        
                <hr style="margin: 40px 0;">
        
                <p style="text-align: center; font-size: 14px; color: #555;">
                    <strong>The %s Team</strong><br>
                    📧 Email: <a href="mailto:%s" style="color: #007bff;">%s</a><br>
                    📞 Phone: %s<br>
                    🌐 Website: <a href="%s" style="color: #007bff;">%s</a>
                </p>
            </div>
        </body>
        </html>
        """.formatted(
                companyLogo, companyName, owner, plan.getTitle(),
                plan.getTitle(), price, duration, featuresList.toString(), plan.getDescription(),
                companyName, supportEmail, supportEmail, supportPhone, websiteUrl, websiteUrl
        );
    }

    public String generateTrialSubscriptionEmail(String owner, SubscriptionPlan plan) {
        StringBuilder featuresList = details(plan);

        return """
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 30px;">
            <div style="max-width: 650px; margin: auto; background: #ffffff; border: 1px solid #e0e0e0; padding: 30px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        
                <div style="text-align: center;">
                    <img src="%s" alt="%s Logo" style="max-width: 150px; margin-bottom: 20px;" />
                </div>
        
                <h2 style="color: #2196F3; text-align: center;">🚀 Your Free Trial Has Started!</h2>
        
                <p>Dear <strong>%s</strong>,</p>
                <p>We're thrilled to offer you a <strong>free trial</strong> of our <strong>%s</strong> plan.</p>
                <p>Here are the details of your trial:</p>
        
                <div style="background-color: #e3f2fd; padding: 20px; border-left: 4px solid #2196F3; border-radius: 6px; margin-top: 20px;">
                    <ul style="padding-left: 20px; line-height: 1.6;">
                        <li><strong>Plan Name:</strong> %s</li>
                        <li><strong>Trial Duration:</strong> %d day(s)</li>
                        %s
                        <li><strong>Description:</strong> %s</li>
                    </ul>
                </div>
        
                <p style="margin-top: 30px;">Take full advantage of the premium features during your trial period. If you love it, upgrading is just a click away.</p>
                <p>If you need any help or have questions, we’re just a message away!</p>
        
                <hr style="margin: 40px 0;">
        
                <p style="text-align: center; font-size: 14px; color: #555;">
                    <strong>The %s Team</strong><br>
                    📧 Email: <a href="mailto:%s" style="color: #007bff;">%s</a><br>
                    📞 Phone: %s<br>
                    🌐 Website: <a href="%s" style="color: #007bff;">%s</a>
                </p>
            </div>
        </body>
        </html>
        """.formatted(
                companyLogo, companyName, owner, plan.getTitle(),
                plan.getTitle(), plan.getTrialDuration(), featuresList.toString(), plan.getDescription(),
                companyName, supportEmail, supportEmail, supportPhone, websiteUrl, websiteUrl
        );
    }

    public String generateSubscriptionUpdateEmail(String owner, SubscriptionPlan plan, long duration) {
        StringBuilder newFeatures = details(plan);
        String newPrice = plan.getDisPrice() + " × 12";

        return """
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; padding: 30px;">
            <div style="max-width: 650px; margin: auto; background: #ffffff; border: 1px solid #e0e0e0; padding: 30px; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                
                <div style="text-align: center;">
                    <img src="%s" alt="%s Logo" style="max-width: 140px; margin-bottom: 20px;" />
                </div>
        
                <h2 style="color: #ff9800; text-align: center;">🔁 Subscription Plan Updated</h2>
        
                <p>Dear <strong>%s</strong>,</p>
                <p>We would like to inform you that there have been some updates to your subscription plan. Below are the details:</p>
        
                <div style="background-color: #f1f9ff; padding: 20px; border-left: 4px solid #2196F3; border-radius: 6px; margin-top: 20px;">
                    <h3 style="color: #2196F3;">🚀 New Plan Details</h3>
                    <ul style="padding-left: 20px; line-height: 1.6;">
                        <li><strong>Plan Name:</strong> %s</li>
                        <li><strong>Price:</strong> ₹%s</li>
                        <li><strong>Duration:</strong> %d day(s)</li>
                        %s
                        <li><strong>Description:</strong> %s</li>
                    </ul>
                </div>
        
                <p style="margin-top: 30px;">We’re excited for you to experience the improved features. If you have any questions or concerns, our support team is here to help you anytime.</p>
        
                <hr style="margin: 40px 0;">
        
                <p style="text-align: center; font-size: 14px; color: #777;">
                    <strong>The %s Team</strong><br>
                    📧 Email: <a href="mailto:%s" style="color: #007bff;">%s</a><br>
                    📞 Phone: %s<br>
                    🌐 Website: <a href="%s" style="color: #007bff;">%s</a>
                </p>
            </div>
        </body>
        </html>
        """.formatted(
                companyLogo, companyName, owner,
                plan.getTitle(), newPrice, duration, newFeatures.toString(), plan.getDescription(),
                companyName, supportEmail, supportEmail, supportPhone, websiteUrl, websiteUrl
        );
    }

    private StringBuilder details(SubscriptionPlan plan) {
        StringBuilder featuresList = new StringBuilder();
        if (plan.getFeatures() != null && !plan.getFeatures().isEmpty()) {
            featuresList.append("<li><strong>Features Included:</strong><ul>");
            for (String feature : plan.getFeatures()) {
                featuresList.append("<li>").append(feature).append("</li>");
            }
            featuresList.append("</ul></li>");
        }
        return featuresList;
    }
}