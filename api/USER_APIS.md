# oneQlick User APIs Documentation

## Overview
This document outlines all the user-related APIs required for the oneQlick food delivery application. These APIs are designed to be production-ready and follow the FastAPI response format.

## Response Format
All APIs follow this standardized response format:
```json
{
  "code": 0,
  "message": "string",
  "message_id": "string",
  "data": {}
}
```

## Authentication APIs

### 1. User Registration
- **Endpoint**: `POST /api/v1/auth/register`
- **Description**: Register a new user account
- **Request Body**:
  ```json
  {
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "phone": "string",
    "password": "string",
    "date_of_birth": "YYYY-MM-DD",
    "gender": "male|female|other",
    "terms_accepted": true
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "User registered successfully",
    "message_id": "USER_REGISTERED",
    "data": {
      "user": {
        "user_id": "uuid",
        "first_name": "string",
        "last_name": "string",
        "email": "string",
        "phone": "string",
        "profile_image": "string",
        "email_verified": false,
        "phone_verified": false,
        "loyalty_points": 0,
        "created_at": "timestamp"
      },
      "access_token": "string",
      "refresh_token": "string",
      "expires_in": 3600
    }
  }
  ```

### 2. User Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Description**: Authenticate user with email/phone and password
- **Request Body**:
  ```json
  {
    "email": "string", // Optional: either email or phone must be provided
    "phone": "string", // Optional: either email or phone must be provided
    "password": "string"
  }
  ```
  **Note**: Either `email` or `phone` must be provided, but not both.
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Login successful",
    "message_id": "LOGIN_SUCCESS",
    "data": {
      "user": {
        "user_id": "uuid",
        "first_name": "string",
        "last_name": "string",
        "email": "string",
        "phone": "string",
        "profile_image": "string",
        "email_verified": true,
        "phone_verified": true,
        "loyalty_points": 1250
      },
      "access_token": "string",
      "refresh_token": "string",
      "expires_in": 3600
    }
  }
  ```

### 3. OTP Login
- **Endpoint**: `POST /api/v1/auth/send-otp`
- **Description**: Send OTP to phone number for login
- **Request Body**:
  ```json
  {
    "phone": "string"
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "OTP sent successfully",
    "message_id": "OTP_SENT",
    "data": {
      "otp_sent": true,
      "expires_in": 300,
      "retry_after": 60
    }
  }
  ```

### 4. Verify OTP
- **Endpoint**: `POST /api/v1/auth/verify-otp`
- **Description**: Verify OTP and complete login
- **Request Body**:
  ```json
  {
    "phone": "string",
    "otp": "string"
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "OTP verified successfully",
    "message_id": "OTP_VERIFIED",
    "data": {
      "user": {
        "user_id": "uuid",
        "first_name": "string",
        "last_name": "string",
        "email": "string",
        "phone": "string",
        "profile_image": "string",
        "email_verified": true,
        "phone_verified": true,
        "loyalty_points": 1250
      },
      "access_token": "string",
      "refresh_token": "string",
      "expires_in": 3600
    }
  }
  ```

### 5. Refresh Token
- **Endpoint**: `POST /api/v1/auth/refresh`
- **Description**: Refresh access token using refresh token
- **Request Body**:
  ```json
  {
    "refresh_token": "string"
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Token refreshed successfully",
    "message_id": "TOKEN_REFRESHED",
    "data": {
      "access_token": "string",
      "refresh_token": "string",
      "expires_in": 3600
    }
  }
  ```

### 6. Logout
- **Endpoint**: `POST /api/v1/auth/logout`
- **Description**: Logout user and invalidate tokens
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Logged out successfully",
    "message_id": "LOGOUT_SUCCESS",
    "data": {
      "logged_out": true
    }
  }
  ```

### 7. Forgot Password
- **Endpoint**: `POST /api/v1/auth/forgot-password`
- **Description**: Send password reset link to email
- **Request Body**:
  ```json
  {
    "email": "string"
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Password reset link sent successfully",
    "message_id": "RESET_LINK_SENT",
    "data": {
      "reset_link_sent": true,
      "expires_in": 3600
    }
  }
  ```

### 8. Reset Password
- **Endpoint**: `POST /api/v1/auth/reset-password`
- **Description**: Reset password using reset token
- **Request Body**:
  ```json
  {
    "token": "string",
    "new_password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Password reset successfully",
    "message_id": "PASSWORD_RESET",
    "data": {
      "password_reset": true
    }
  }
  ```

### 9. Change Password
- **Endpoint**: `POST /api/v1/auth/change-password`
- **Description**: Change password for authenticated user
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "current_password": "string",
    "new_password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Password changed successfully",
    "message_id": "PASSWORD_CHANGED",
    "data": {
      "password_changed": true
    }
  }
  ```

## User Profile APIs

### 10. Get User Profile
- **Endpoint**: `GET /api/v1/user/profile`
- **Description**: Get current user's profile information
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Profile retrieved successfully",
    "message_id": "PROFILE_RETRIEVED",
    "data": {
      "user_id": "uuid",
      "first_name": "string",
      "last_name": "string",
      "email": "string",
      "phone": "string",
      "profile_image": "string",
      "date_of_birth": "YYYY-MM-DD",
      "gender": "male|female|other",
      "email_verified": true,
      "phone_verified": true,
      "loyalty_points": 1250,
      "total_orders": 24,
      "total_spent": 12500,
      "member_since": "2024-01-01",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  }
  ```

### 11. Update User Profile
- **Endpoint**: `PUT /api/v1/user/profile`
- **Description**: Update user's profile information
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "phone": "string",
    "date_of_birth": "YYYY-MM-DD",
    "gender": "male|female|other"
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Profile updated successfully",
    "message_id": "PROFILE_UPDATED",
    "data": {
      "user_id": "uuid",
      "first_name": "string",
      "last_name": "string",
      "email": "string",
      "phone": "string",
      "profile_image": "string",
      "date_of_birth": "YYYY-MM-DD",
      "gender": "male|female|other",
      "email_verified": true,
      "phone_verified": true,
      "loyalty_points": 1250,
      "updated_at": "timestamp"
    }
  }
  ```


## Address Management APIs

### 12. Get User Addresses
- **Endpoint**: `GET /api/v1/user/addresses`
- **Description**: Get all addresses for the current user
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `type`: `home|work|restaurant|other` (optional)
  - `limit`: `integer` (default: 20)
  - `offset`: `integer` (default: 0)
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Addresses retrieved successfully",
    "message_id": "ADDRESSES_RETRIEVED",
    "data": {
      "addresses": [
        {
          "address_id": "uuid",
          "title": "string",
          "address_type": "home|work|restaurant|other",
          "address_line1": "string",
          "address_line2": "string",
          "landmark": "string",
          "city": "string",
          "state": "string",
          "postal_code": "string",
          "latitude": 0.0,
          "longitude": 0.0,
          "is_default": true,
          "created_at": "timestamp"
        }
      ],
      "total_count": 3,
      "has_more": false
    }
  }
  ```

### 13. Add New Address
- **Endpoint**: `POST /api/v1/user/addresses`
- **Description**: Add a new address for the user
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "string",
    "address_type": "home|work|restaurant|other",
    "address_line1": "string",
    "address_line2": "string",
    "landmark": "string",
    "city": "string",
    "state": "string",
    "postal_code": "string",
    "latitude": 0.0,
    "longitude": 0.0,
    "is_default": false
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Address added successfully",
    "message_id": "ADDRESS_ADDED",
    "data": {
      "address_id": "uuid",
      "title": "string",
      "address_type": "home|work|restaurant|other",
      "address_line1": "string",
      "address_line2": "string",
      "landmark": "string",
      "city": "string",
      "state": "string",
      "postal_code": "string",
      "latitude": 0.0,
      "longitude": 0.0,
      "is_default": true,
      "created_at": "timestamp"
    }
  }
  ```

### 14. Update Address
- **Endpoint**: `PUT /api/v1/user/addresses/{address_id}`
- **Description**: Update an existing address
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "title": "string",
    "address_type": "home|work|restaurant|other",
    "address_line1": "string",
    "address_line2": "string",
    "landmark": "string",
    "city": "string",
    "state": "string",
    "postal_code": "string",
    "latitude": 0.0,
    "longitude": 0.0,
    "is_default": false
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Address updated successfully",
    "message_id": "ADDRESS_UPDATED",
    "data": {
      "address_id": "uuid",
      "title": "string",
      "address_type": "home|work|restaurant|other",
      "address_line1": "string",
      "address_line2": "string",
      "landmark": "string",
      "city": "string",
      "state": "string",
      "postal_code": "string",
      "latitude": 0.0,
      "longitude": 0.0,
      "is_default": true,
      "updated_at": "timestamp"
    }
  }
  ```

### 15. Delete Address
- **Endpoint**: `DELETE /api/v1/user/addresses/{address_id}`
- **Description**: Delete an address
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Address deleted successfully",
    "message_id": "ADDRESS_DELETED",
    "data": {
      "address_deleted": true
    }
  }
  ```

### 16. Set Default Address
- **Endpoint**: `POST /api/v1/user/addresses/{address_id}/set-default`
- **Description**: Set an address as default
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Default address set successfully",
    "message_id": "DEFAULT_ADDRESS_SET",
    "data": {
      "default_address_set": true
    }
  }
  ```

## User Preferences APIs

### 17. Get User Preferences
- **Endpoint**: `GET /api/v1/user/preferences`
- **Description**: Get user's app preferences and settings
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Preferences retrieved successfully",
    "message_id": "PREFERENCES_RETRIEVED",
    "data": {
      "notifications_enabled": true,
      "location_services_enabled": true,
      "language": "en",
      "currency": "INR",
      "dark_mode": false,
      "email_notifications": true,
      "sms_notifications": true,
      "push_notifications": true,
      "marketing_emails": false,
      "order_updates": true,
      "promotional_offers": true
    }
  }
  ```

### 18. Update User Preferences
- **Endpoint**: `PUT /api/v1/user/preferences`
- **Description**: Update user's app preferences
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "notifications_enabled": true,
    "location_services_enabled": true,
    "language": "en|hi|ta|te|bn",
    "currency": "INR|USD",
    "dark_mode": false,
    "email_notifications": true,
    "sms_notifications": true,
    "push_notifications": true,
    "marketing_emails": false,
    "order_updates": true,
    "promotional_offers": true
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Preferences updated successfully",
    "message_id": "PREFERENCES_UPDATED",
    "data": {
      "preferences_updated": true,
      "updated_at": "timestamp"
    }
  }
  ```

## Payment Methods APIs

### 19. Get Payment Methods
- **Endpoint**: `GET /api/v1/user/payment-methods`
- **Description**: Get user's saved payment methods
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Payment methods retrieved successfully",
    "message_id": "PAYMENT_METHODS_RETRIEVED",
    "data": {
      "payment_methods": [
        {
          "payment_method_id": "uuid",
          "payment_type": "card|upi|wallet|netbanking|cod",
          "name": "string",
          "last_four_digits": "1234",
          "upi_id": "string",
          "bank_name": "string",
          "is_default": true,
          "is_active": true,
          "created_at": "timestamp"
        }
      ]
    }
  }
  ```

### 20. Add Payment Method
- **Endpoint**: `POST /api/v1/user/payment-methods`
- **Description**: Add a new payment method
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "payment_type": "card|upi|wallet|netbanking",
    "name": "string",
    "card_number": "string", // for card
    "expiry_month": "string", // for card
    "expiry_year": "string", // for card
    "cvv": "string", // for card
    "upi_id": "string", // for upi
    "bank_name": "string", // for netbanking
    "is_default": false
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Payment method added successfully",
    "message_id": "PAYMENT_METHOD_ADDED",
    "data": {
      "payment_method_id": "uuid",
      "payment_type": "card|upi|wallet|netbanking",
      "name": "string",
      "last_four_digits": "1234",
      "is_default": true,
      "is_active": true,
      "created_at": "timestamp"
    }
  }
  ```

### 21. Update Payment Method
- **Endpoint**: `PUT /api/v1/user/payment-methods/{payment_method_id}`
- **Description**: Update an existing payment method
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "string",
    "is_default": false
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Payment method updated successfully",
    "message_id": "PAYMENT_METHOD_UPDATED",
    "data": {
      "payment_method_id": "uuid",
      "payment_type": "card|upi|wallet|netbanking",
      "name": "string",
      "last_four_digits": "1234",
      "is_default": true,
      "is_active": true,
      "updated_at": "timestamp"
    }
  }
  ```

### 22. Delete Payment Method
- **Endpoint**: `DELETE /api/v1/user/payment-methods/{payment_method_id}`
- **Description**: Delete a payment method
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Payment method deleted successfully",
    "message_id": "PAYMENT_METHOD_DELETED",
    "data": {
      "payment_method_deleted": true
    }
  }
  ```

### 23. Set Default Payment Method
- **Endpoint**: `POST /api/v1/user/payment-methods/{payment_method_id}/set-default`
- **Description**: Set a payment method as default
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Default payment method set successfully",
    "message_id": "DEFAULT_PAYMENT_METHOD_SET",
    "data": {
      "default_payment_method_set": true
    }
  }
  ```

## Wallet APIs

### 24. Get Wallet Balance
- **Endpoint**: `GET /api/v1/user/wallet`
- **Description**: Get user's wallet balance and details
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Wallet balance retrieved successfully",
    "message_id": "WALLET_BALANCE_RETRIEVED",
    "data": {
      "wallet_id": "uuid",
      "balance": 2450.00,
      "currency": "INR",
      "is_active": true,
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
  }
  ```

### 25. Get Wallet Transactions
- **Endpoint**: `GET /api/v1/user/wallet/transactions`
- **Description**: Get user's wallet transaction history
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `limit`: `integer` (default: 20)
  - `offset`: `integer` (default: 0)
  - `transaction_type`: `credit|debit|refund` (optional)
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Wallet transactions retrieved successfully",
    "message_id": "WALLET_TRANSACTIONS_RETRIEVED",
    "data": {
      "transactions": [
        {
          "transaction_id": "uuid",
          "amount": 100.00,
          "transaction_type": "credit|debit|refund",
          "description": "string",
          "order_id": "uuid",
          "created_at": "timestamp"
        }
      ],
      "total_count": 50,
      "has_more": true
    }
  }
  ```

### 26. Add Money to Wallet
- **Endpoint**: `POST /api/v1/user/wallet/add-money`
- **Description**: Add money to user's wallet
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "amount": 100.00,
    "payment_method_id": "uuid"
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Money added to wallet successfully",
    "message_id": "WALLET_MONEY_ADDED",
    "data": {
      "transaction_id": "uuid",
      "amount": 100.00,
      "new_balance": 2550.00,
      "payment_status": "success",
      "created_at": "timestamp"
    }
  }
  ```

## Favorite Restaurants APIs

### 27. Get Favorite Restaurants
- **Endpoint**: `GET /api/v1/user/favorites/restaurants`
- **Description**: Get user's favorite restaurants
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `limit`: `integer` (default: 20)
  - `offset`: `integer` (default: 0)
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Favorite restaurants retrieved successfully",
    "message_id": "FAVORITE_RESTAURANTS_RETRIEVED",
    "data": {
      "favorite_restaurants": [
        {
          "restaurant_id": "uuid",
          "name": "string",
          "cuisine": "string",
          "rating": 4.5,
          "delivery_time": "25-35 mins",
          "image": "string",
          "last_ordered": "2 days ago",
          "added_at": "timestamp"
        }
      ],
      "total_count": 8,
      "has_more": false
    }
  }
  ```

### 28. Add Favorite Restaurant
- **Endpoint**: `POST /api/v1/user/favorites/restaurants`
- **Description**: Add a restaurant to favorites
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "restaurant_id": "uuid"
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Restaurant added to favorites successfully",
    "message_id": "RESTAURANT_ADDED_TO_FAVORITES",
    "data": {
      "restaurant_id": "uuid",
      "added_to_favorites": true,
      "added_at": "timestamp"
    }
  }
  ```

### 29. Remove Favorite Restaurant
- **Endpoint**: `DELETE /api/v1/user/favorites/restaurants/{restaurant_id}`
- **Description**: Remove a restaurant from favorites
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Restaurant removed from favorites successfully",
    "message_id": "RESTAURANT_REMOVED_FROM_FAVORITES",
    "data": {
      "restaurant_id": "uuid",
      "removed_from_favorites": true
    }
  }
  ```

## User Analytics APIs

### 30. Get User Analytics
- **Endpoint**: `GET /api/v1/user/analytics`
- **Description**: Get user's analytics and statistics
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "code": 0,
    "message": "User analytics retrieved successfully",
    "message_id": "USER_ANALYTICS_RETRIEVED",
    "data": {
      "total_orders": 24,
      "total_spent": 12500.00,
      "loyalty_points": 1250,
      "favorite_cuisine": "North Indian",
      "last_order_date": "2024-01-15T14:30:00Z",
      "average_order_value": 520.83,
      "orders_this_month": 5,
      "spent_this_month": 2100.00,
      "member_since": "2024-01-01",
      "profile_completion": 85
    }
  }
  ```

### 31. Get Order Statistics
- **Endpoint**: `GET /api/v1/user/analytics/orders`
- **Description**: Get detailed order statistics
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `period`: `week|month|year|all` (default: month)
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Order statistics retrieved successfully",
    "message_id": "ORDER_STATISTICS_RETRIEVED",
    "data": {
      "period": "month",
      "total_orders": 5,
      "total_spent": 2100.00,
      "average_order_value": 420.00,
      "orders_by_status": {
        "delivered": 4,
        "cancelled": 1,
        "pending": 0
      },
      "orders_by_restaurant": [
        {
          "restaurant_id": "uuid",
          "restaurant_name": "string",
          "order_count": 2,
          "total_spent": 800.00
        }
      ]
    }
  }
  ```

## Search History APIs

### 32. Get Search History
- **Endpoint**: `GET /api/v1/user/search-history`
- **Description**: Get user's search history
- **Headers**: `Authorization: Bearer <token>`
- **Query Parameters**:
  - `search_type`: `restaurant|food|general` (optional)
  - `limit`: `integer` (default: 20)
  - `offset`: `integer` (default: 0)
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Search history retrieved successfully",
    "message_id": "SEARCH_HISTORY_RETRIEVED",
    "data": {
      "search_history": [
        {
          "search_id": "uuid",
          "search_query": "string",
          "search_type": "restaurant|food|general",
          "results_count": 15,
          "created_at": "timestamp"
        }
      ],
      "total_count": 50,
      "has_more": true
    }
  }
  ```

### 33. Clear Search History
- **Endpoint**: `DELETE /api/v1/user/search-history`
- **Description**: Clear all search history
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Search history cleared successfully",
    "message_id": "SEARCH_HISTORY_CLEARED",
    "data": {
      "search_history_cleared": true
    }
  }
  ```

### 34. Delete Search History Item
- **Endpoint**: `DELETE /api/v1/user/search-history/{search_id}`
- **Description**: Delete a specific search history item
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Search history item deleted successfully",
    "message_id": "SEARCH_HISTORY_ITEM_DELETED",
    "data": {
      "search_item_deleted": true
    }
  }
  ```

## Account Management APIs

### 35. Deactivate Account
- **Endpoint**: `POST /api/v1/user/deactivate`
- **Description**: Deactivate user account
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "reason": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Account deactivated successfully",
    "message_id": "ACCOUNT_DEACTIVATED",
    "data": {
      "account_deactivated": true,
      "deactivated_at": "timestamp"
    }
  }
  ```

### 36. Reactivate Account
- **Endpoint**: `POST /api/v1/user/reactivate`
- **Description**: Reactivate user account
- **Request Body**:
  ```json
  {
    "email": "string",
    "phone": "string"
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Account reactivated successfully",
    "message_id": "ACCOUNT_REACTIVATED",
    "data": {
      "account_reactivated": true,
      "reactivated_at": "timestamp"
    }
  }
  ```

### 37. Delete Account
- **Endpoint**: `DELETE /api/v1/user/account`
- **Description**: Permanently delete user account
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "password": "string",
    "confirmation": "DELETE"
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Account deleted successfully",
    "message_id": "ACCOUNT_DELETED",
    "data": {
      "account_deleted": true,
      "deleted_at": "timestamp"
    }
  }
  ```

## Verification APIs

### 38. Send Email Verification
- **Endpoint**: `POST /api/v1/user/verify/email/send`
- **Description**: Send email verification link
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Email verification sent successfully",
    "message_id": "EMAIL_VERIFICATION_SENT",
    "data": {
      "verification_email_sent": true,
      "expires_in": 3600
    }
  }
  ```

### 39. Verify Email
- **Endpoint**: `POST /api/v1/user/verify/email`
- **Description**: Verify email with token
- **Request Body**:
  ```json
  {
    "token": "string"
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Email verified successfully",
    "message_id": "EMAIL_VERIFIED",
    "data": {
      "email_verified": true,
      "verified_at": "timestamp"
    }
  }
  ```

### 40. Send Phone Verification
- **Endpoint**: `POST /api/v1/user/verify/phone/send`
- **Description**: Send phone verification OTP
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Phone verification OTP sent successfully",
    "message_id": "PHONE_VERIFICATION_SENT",
    "data": {
      "verification_otp_sent": true,
      "expires_in": 300
    }
  }
  ```

### 41. Verify Phone
- **Endpoint**: `POST /api/v1/user/verify/phone`
- **Description**: Verify phone with OTP
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "otp": "string"
  }
  ```
- **Response**:
  ```json
  {
    "code": 0,
    "message": "Phone verified successfully",
    "message_id": "PHONE_VERIFIED",
    "data": {
      "phone_verified": true,
      "verified_at": "timestamp"
    }
  }
  ```

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 0 | Success | Request completed successfully |
| 1001 | Invalid credentials | Invalid email/phone or password |
| 1002 | User not found | User does not exist |
| 1003 | User already exists | User with email/phone already registered |
| 1004 | Invalid token | Access token is invalid or expired |
| 1005 | Token expired | Access token has expired |
| 1006 | Invalid OTP | OTP is invalid or expired |
| 1007 | OTP expired | OTP has expired |
| 1008 | Email not verified | Email address not verified |
| 1009 | Phone not verified | Phone number not verified |
| 1010 | Account deactivated | User account is deactivated |
| 1011 | Account suspended | User account is suspended |
| 1012 | Invalid password | Password does not meet requirements |
| 1013 | Address not found | Address does not exist |
| 1014 | Payment method not found | Payment method does not exist |
| 1015 | Insufficient wallet balance | Not enough balance in wallet |
| 1016 | Invalid payment method | Payment method is invalid |
| 1017 | Restaurant not found | Restaurant does not exist |
| 1018 | Validation error | Request validation failed |
| 1019 | Rate limit exceeded | Too many requests |
| 1020 | Server error | Internal server error |

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute per IP
- **Profile endpoints**: 60 requests per minute per user
- **Address endpoints**: 30 requests per minute per user
- **Payment endpoints**: 20 requests per minute per user
- **Wallet endpoints**: 30 requests per minute per user
- **General endpoints**: 100 requests per minute per user

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Pagination

List endpoints support pagination with these query parameters:
- `limit`: Number of items per page (default: 20, max: 100)
- `offset`: Number of items to skip (default: 0)

## Response Headers

All responses include these headers:
- `Content-Type: application/json`
- `X-Request-ID: <unique_request_id>`
- `X-Rate-Limit-Limit: <limit>`
- `X-Rate-Limit-Remaining: <remaining>`
- `X-Rate-Limit-Reset: <reset_timestamp>`
