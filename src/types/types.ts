import { ActivityLog, BusinessType, Category, Delivery, DeliveryItem, Order, OrderItem, Product, Purchase, PurchaseItem, RecipeItem, Sale, SaleItem,  Service,  Supplier,  SupplierOrder, SupplierProduct, User } from "@prisma/client";


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
  product: Product | null
}

export type PurchaseWithItems = Purchase & {
  PurchaseItem: PurchaseWithProduct[]
}

export type OrderWithSupplierOrders = Order & {
  supplierOrders: SupplierOrderWithItems[]
  confirmedDeliveries: Delivery[]
}

export type SupplierOrderWithItems = SupplierOrder & {
  items: OrderItem[]
}
export type SupplierOrderWithOrderAndItems = SupplierOrder & {
  order: Order & {
    Service: Service | null;
  } | null;
  items: OrderItem[]
}
export type SupplierOrderWithOrderAndDeliveries = SupplierOrder & {
  order: Order & {
    Service: Service | null;
    confirmedDeliveries: Delivery[]
  } | null;
  items: OrderItem[]
}

export type ProductWithCategory = Product & {
  Category: Category | null
}

export type SaleWithItems = Sale & {
  SaleItem : SaleItemWithProducts[]
}
export type SupplierSaleWithItems = Sale & {
  SaleItem : SaleItemWithSupplierProducts[]
}

export type SaleItemWithProducts = SaleItem & {
  product: Product | null
}
export type SaleItemWithSupplierProducts = SaleItem & {
  supplierProduct: SupplierProduct | null
}

export type ActivityLogsWithSupplier = ActivityLog & {
  Supplier: {
    id: string; name: string; phone: string | null;
  } | null
}
export type ActivityLogsWithService = ActivityLog & {
  Service: {
    id: string; businessName: string; businessType: BusinessType;
  } | null
}

export type UserProfile = User & {
  Service: Service | null;
  Supplier: Supplier | null;
}

export type SupplierWithProducts = Supplier & {
  products: SupplierProductsWithUnit[]
}

export type SupplierProductsWithUnit = SupplierProduct & {
  supplier: Supplier
}

export type SupplierDeliveryItemsWithOrderItem = DeliveryItem & {
  orderItem: OrderItem & {
    product: Product;
  };
};
export type DeliveryItemsWithOrderItem = DeliveryItem & {
  orderItem: OrderItem & {
    product: Product;
  };
};

export type ConfirmedDeliveryLogs = {
  deliveryId: string;
  orderId: string;
  supplierOrderId: string;
  totalItems: number;
  deliveryItems: DeliveryItemsWithOrderItem[];
};
export type ArrivedDeliveryLogs = {
  deliveryId: string;
  supplierOrderId: string;
  deliveredAt: Date;
  deliveryItems: OrderItem & {
   product: Product 
  }[];
  
};

export type UpdateOrderLogs = {
  supplierOrderId: string;
  update: string;
}

export type CreateOrderLogs = {
  total: number;
  groupedItems: {
    supplierId: string;
    items: {
      name: string,
      productId: string,
      orderedQty: number,
      price: number
    }[]
  }[];
}

export type CreateSaleLogs = {
  totalPrice: number;
  items: {
    id: string,
    name: string,
    quantity: number,
    price: number
  }[]
}
