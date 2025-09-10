import { Product, RecipeItem } from "@prisma/client";


export type ProductWithMenuItems = Product & {
  MenuItems: RecipeItem[];
};
export interface ProductsProps {
  initialProducts: ProductWithMenuItems[];
  userId: string;
};