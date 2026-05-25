export type Collection = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CollectionInput = {
  name: string;
  description?: string;
  active?: boolean;
  sortOrder?: number;
};
