export type ProductCategory = "industrial" | "agricultural";

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  imageUrl: string;
  cloudinaryPublicId: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = {
  name: string;
  description: string;
  category: ProductCategory;
  imageUrl: string;
  cloudinaryPublicId: string;
  featured?: boolean;
  active?: boolean;
};
