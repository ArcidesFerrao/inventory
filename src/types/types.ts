import { Category, Product, RecipeItem } from "@prisma/client";


export type ProductWithMenuItems = Product & {
  MenuItems: RecipeItem[];
  Category: Category | null;
};
export interface ProductsProps {
  initialProducts: ProductWithMenuItems[];
  userId: string;
};
export interface FilteredProductsProps {
  initialProducts: {
    refeicao: ProductWithMenuItems[];
    lanche: ProductWithMenuItems[];
    bebidas: ProductWithMenuItems[];
  };
  userId: string;
};

export type StockProduct = Product & {
  quantity: number;
  stock: number;
}

export interface PurchasesProps {
  initialProducts: StockProduct[];
  userId: string;
}


