export type HotPick = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  /** Internal path (/products/…) or full URL — optional */
  linkUrl: string | null;
  active: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type HotPickInput = {
  title: string;
  description?: string;
  imageUrl: string;
  cloudinaryPublicId: string;
  linkUrl?: string | null;
  active?: boolean;
  sortOrder?: number;
};
