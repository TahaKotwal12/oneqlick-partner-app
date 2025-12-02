# oneQlick - Food Delivery App

A React Native Expo app built for rural Indian users, competing with Swiggy/Zomato. Built with modern architecture using Expo Router, TypeScript, and React Native Paper.

## 🚀 Features

- **Authentication System**: Login, signup, and password recovery
- **Restaurant Discovery**: Browse restaurants by cuisine, rating, and location
- **Food Ordering**: Add items to cart, customize orders, and checkout
- **Order Tracking**: Real-time order status and delivery tracking
- **User Profile**: Manage personal information, addresses, and preferences
- **Location Services**: GPS-based delivery location and restaurant discovery
- **Multi-language Support**: Support for Indian languages (planned)  

## 🏗️ Project Structure  

```
oneQlick/
├── app/                          # Expo Router file-based routing
│   ├── (auth)/                  # Authentication screens
│   │   ├── _layout.tsx         # Auth navigation layout
│   │   ├── login.tsx           # Login screen
│   │   ├── signup.tsx          # Signup screen
│   │   └── forgot-password.tsx # Password recovery
│   ├── (tabs)/                 # Main app tab navigation
│   │   ├── _layout.tsx         # Tab navigation layout
│   │   ├── home.tsx            # Home screen with featured content
│   │   ├── search.tsx          # Restaurant search and filters
│   │   ├── orders.tsx          # Order history and tracking
│   │   └── profile.tsx         # User profile and settings
│   ├── (modals)/               # Modal screens
│   │   ├── _layout.tsx         # Modal navigation layout
│   │   ├── cart.tsx            # Shopping cart (to be implemented)
│   │   ├── filter.tsx          # Advanced search filters (to be implemented)
│   │   └── location-picker.tsx # Location selection (to be implemented)
│   ├── _layout.tsx             # Root navigation layout
│   └── index.tsx               # App entry point
├── components/                  # Reusable UI components
│   ├── ui/                     # Basic UI components
│   ├── common/                 # Common app components
│   └── forms/                  # Form components
├── hooks/                      # Custom React hooks
│   ├── useAuth.ts             # Authentication state management
│   └── useCart.ts             # Shopping cart management
├── services/                   # API and external services
├── utils/                      # Utility functions
│   └── helpers.ts             # Common helper functions
├── constants/                  # App constants
│   └── colors.ts              # Color scheme definitions
├── types/                      # TypeScript type definitions
│   └── index.ts               # Main type definitions
├── assets/                     # Static assets
│   ├── images/                 # App images
│   ├── icons/                  # App icons
│   └── fonts/                  # Custom fonts
└── package.json                # Dependencies and scripts
```

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Language**: TypeScript
- **UI Library**: React Native Paper (Material Design)
- **State Management**: React Hooks + Context
- **Storage**: AsyncStorage for local data persistence
- **Icons**: Expo Vector Icons
- **Maps**: React Native Maps
- **Location**: React Native Geolocation
- **Image Picker**: React Native Image Picker
- **Animations**: React Native Reanimated

## 📱 Screen Descriptions

### Authentication Screens
- **Login**: Email/password authentication with validation
- **Signup**: User registration with profile information
- **Forgot Password**: Password recovery via email

### Main App Screens
- **Home**: Featured restaurants, food categories, quick actions
- **Search**: Restaurant search with filters and sorting
- **Orders**: Current and past orders with status tracking
- **Profile**: User information, settings, and preferences

### Modal Screens
- **Cart**: Shopping cart management and checkout
- **Filters**: Advanced search and filter options
- **Location Picker**: GPS and manual location selection

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Android Studio / Xcode (for device testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd oneQlick
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # Android
   npm run android
   
   # iOS
   npm run ios
   
   # Web
   npm run web
   ```

## 📱 App Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_API_URL=your_api_url_here
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### App Configuration
Update `app.json` with your app details:
```json
{
  "expo": {
    "name": "oneQlick",
    "slug": "oneqlick",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#4F46E5"
    }
  }
}
```

## 🎨 Design System

### Color Palette
- **Primary**: #4F46E5 (Deep Indigo Blue)
- **Secondary**: #FFD93D (Yellow)
- **Accent**: #6BCF7F (Green)
- **Success**: #4CAF50
- **Warning**: #FF9800
- **Error**: #F44336

### Typography
- **Headings**: Bold, 18-32px
- **Body**: Regular, 14-16px
- **Captions**: Regular, 12px

### Spacing
- **Small**: 8px
- **Medium**: 16px
- **Large**: 24px
- **Extra Large**: 32px

## 🔒 Security Features

- Secure authentication with JWT tokens
- Input validation and sanitization
- Secure storage of sensitive data
- API rate limiting (planned)
- SSL/TLS encryption (planned)

## 📊 Performance Optimizations

- Lazy loading of screens and components
- Image optimization and caching
- Efficient state management
- Minimal re-renders with React.memo
- Optimized bundle size

## 🧪 Testing

### Unit Testing
```bash
npm test
```

### E2E Testing
```bash
npm run test:e2e
```

## 📦 Build & Deployment

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

### Web Build
```bash
expo build:web
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Basic authentication
- ✅ Restaurant browsing
- ✅ Order management
- ✅ User profile

### Phase 2 (Next)
- 🔄 Advanced search and filters
- 🔄 Shopping cart and checkout
- 🔄 Payment integration
- 🔄 Order tracking

### Phase 3 (Future)
- 📋 Multi-language support
- 📋 Push notifications
- 📋 Social features
- 📋 Analytics dashboard

---

**Built with ❤️ for rural Indian communities** # oneQlick-User-App
"# oneqlick-partner-app" 
