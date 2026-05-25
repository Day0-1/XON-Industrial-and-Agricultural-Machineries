export type ProductImage = {
  imageUrl: string;
  cloudinaryPublicId: string;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  collectionId: string;
  collectionName: string;
  collectionSlug: string;
  images: ProductImage[];
  imageUrl: string;
  cloudinaryPublicId: string;
  featured: boolean;
  active: boolean;
  clickCount: number;
  features: string[];
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = {
  name: string;
  description: string;
  collectionId: string;
  images: ProductImage[];
  imageUrl?: string;
  cloudinaryPublicId?: string;
  featured?: boolean;
  active?: boolean;
  clickCount?: number;
  features?: string[];
};
