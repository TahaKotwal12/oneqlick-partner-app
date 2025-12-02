export interface CarouselItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  gradientColors: string[];
  actionText: string;
  badge?: string;
  offerCode?: string;
  discount?: string;
}

export const carouselItems: CarouselItem[] = [
  {
    id: '1',
    title: 'MEGA SALE',
    subtitle: 'Up to 60% OFF',
    description: 'On your first 3 orders above ₹199',
    icon: 'fire',
    gradientColors: ['#4F46E5', '#6366F1', '#818CF8'],
    actionText: 'Order Now',
    badge: 'LIMITED TIME',
    offerCode: 'MEGA60',
    discount: '60%',
  },
  {
    id: '2',
    title: 'FREE DELIVERY',
    subtitle: 'No delivery charges',
    description: 'On orders above ₹299 from top restaurants',
    icon: 'truck-delivery',
    gradientColors: ['#10B981', '#34D399', '#6EE7B7'],
    actionText: 'Browse Restaurants',
    badge: 'POPULAR',
    offerCode: 'FREEDEL',
  },
  {
    id: '3',
    title: 'FLAT ₹100 OFF',
    subtitle: 'Weekend Special',
    description: 'Valid on minimum order of ₹500',
    icon: 'percent',
    gradientColors: ['#3B82F6', '#60A5FA', '#93C5FD'],
    actionText: 'Grab Deal',
    badge: 'WEEKEND',
    offerCode: 'WEEK100',
    discount: '₹100',
  },
  {
    id: '4',
    title: 'CASHBACK ₹50',
    subtitle: 'Pay with UPI',
    description: 'Get instant cashback on UPI payments',
    icon: 'wallet',
    gradientColors: ['#8B5CF6', '#A78BFA', '#C4B5FD'],
    actionText: 'Pay Now',
    badge: 'INSTANT',
    offerCode: 'UPI50',
    discount: '₹50',
  },
  {
    id: '5',
    title: 'COMBO DEALS',
    subtitle: 'Buy 1 Get 1 FREE',
    description: 'On selected items from partner restaurants',
    icon: 'food-variant',
    gradientColors: ['#FB923C', '#FDBA74', '#FED7AA'],
    actionText: 'View Combos',
    badge: 'HOT DEAL',
  },
]; 