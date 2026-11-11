export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'dresses' | 'tops' | 'bottoms' | 'outerwear' | 'co-ords' | 'accessories';
  gender?: 'unisex' | 'women' | 'men';
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  colors: ProductColor[];
  sizes: string[];
  description: string;
  details: {
    material: string;
    care: string;
    fit: string;
    origin: string;
  };
  image: string;
  hoverImage?: string;
  gallery: string[];
  tags: string[];
  inStock: boolean;
  stockCount?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
  sizePurchased?: string;
  fitFeedback?: 'Runs small' | 'True to size' | 'Runs large';
}
