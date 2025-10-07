import { Category, Product, Purchase, PurchaseItem, RecipeItem } from "@prisma/client";


export type ProductWithMenuItems = Product & {
  quantity: number;
  MenuItems: RecipeItem[];
  Category: Category | null;
};
export interface ProductsProps {
  initialProducts: ProductWithMenuItems[];
  serviceId: string;
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
}

export interface PurchasesProps {
  initialProducts: StockProduct[];
  serviceId: string;
}


export type PurchaseWithProduct = PurchaseItem & {
  product: Product
}

export type PurchaseWithItems = Purchase & {
  PurchaseItems: PurchaseWithProduct[]
}