import { ActivityLog, BusinessType, Category, Delivery, DeliveryItem, Item, StockItem, Order, OrderItem,  Purchase, PurchaseItem, RecipeItem, Sale, SaleItem,  Service,  Supplier, User, ServiceStockItem, AuditLog} from "@/generated/prisma/client";


export type SaleItemWithCatalogItems = Item & {
  quantity: number;
  CatalogItems: (RecipeItem & {serviceStockItem: ServiceStockItem & {
    stockItem: StockItem
  }})[] ;
  category: Category | null;
};
export type ItemWithCatalogItems = Item & {
  quantity: number;
  catalogItems: RecipeItem[] ;
  Category: Category | null;
};
export interface SaleProductsProps {
  initialItems: SaleItemWithCatalogItems[];
  serviceId: string;
};
export interface ProductsProps {
  initialProducts: ItemWithCatalogItems[];
  serviceId: string;
};
export interface FilteredProductsProps {
  initialProducts: {
    refeicao: ItemWithCatalogItems[];
    lanche: ItemWithCatalogItems[];
    bebidas: ItemWithCatalogItems[];
  };
  userId: string;
};

export type StockProduct = StockItem & {
  quantity: number;
}
export type ServiceStockProduct = ServiceStockItem & {
  stockItem: StockItem;
  quantity: number;
  price: number
}

// export interface PurchasesProps {
//   initialStockItems: StockProduct[];
//   serviceId: string;
// }
export interface PurchasesProps {
  initialStockItems: ServiceStockProduct[];
  serviceId: string;
}


export type PurchaseWithProduct = PurchaseItem & {
  item: Item | null
  stockItem: StockItem | null
}

export type PurchaseWithItems = Purchase & {
  PurchaseItem: PurchaseWithProduct[]
}

export type OrderWithStockItems = Order & {
  orderItems: OrderItem[];
  delivery: Delivery;
  Service: Service;
}
export type OrderWithDelivery = Order & {
  confirmedDeliveries: Delivery[]
}


export type OrderWithItems = Order & {
    Service: Service | null;
  } | null;
  

export type OrderWithDeliveries = Order & {
   
    Service: Service | null;
    confirmedDeliveries: Delivery[]
  } 
  

export type ItemWithCategory = Item & {
  category: Category | null
}

// export type ExpenseList = Sale & {
//   SaleItem : SaleItemWithProducts[]
// }
export type SaleWithItems = Sale & {
  SaleItem : SaleItemWithProducts[]
}
export type SupplierSaleWithItems = Sale & {
  SaleItem : SaleItemWithStockItems[]
}

export type SaleItemWithProducts = SaleItem & {
  item: Item | null
}
export type SaleItemWithStockItems = SaleItem & {
  stockItem: StockItem | null
}

export type ActivityLogsWithSupplier = ActivityLog & {
  Supplier: {
    id: string; businessName: string; phoneNumber: string | null;
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

export type StockItems = Supplier & {
  products: StockItemsWithUnit[]
}

export type StockItemsWithUnit = StockItem & {
  supplier: Supplier
}

export type SupplierDeliveryItemsWithOrderItem = DeliveryItem & {
  orderItem: OrderItem & {
    item: Item;
  };
};
export type DeliveryItemsWithOrderItem = DeliveryItem & {
  orderItem: OrderItem & {
    stockItem: StockItem;
  };
};

export type OrderItemWithStockItems = OrderItem & {
    stockItem: StockItem;
  };

export type ConfirmedDeliveryLogs = {
  deliveryId: string;
  orderId: string;
  stockItemId: string;
  totalItems: number;
  deliveryItems: DeliveryItemsWithOrderItem[];
};
export type ArrivedDeliveryLogs = {
  deliveryId: string;
  supplierOrderId: string;
  deliveredAt: Date;
  // deliveryItems: OrderItem & {
  //  stockItem: StockItem 
  // }[];
  
};
export type CreateDeliveryLogs = {
  orderId: string;
  scheduledAt: Date;
  totalItems: number;
  items: OrderItemWithStockItems[]
  // items: DeliveryItemsWithOrderItem[]
  
};

export type UpdateOrderLogs = {
  supplierOrderId: string;
  update: string;
}

export type ErrorDeliveryLogs = {
  serviceId: string | null;
  supplierOrderId: string;
  error: string;
}

export type CreateOrderLogs = {
  total: number;
    items: {
      name: string,
      itemId: string,
      orderedQty: number,
      price: number
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

export type SupplierWithItems = Supplier & {
  StockItems: StockItem[]
}

export type SupplierStockItems = StockItem


export type ItemWithUnit = Item & {
  Unit: {
    name: string;
    id: string;
    description: string | null;
  } | null;
  Category: {
    name: string;
    id: string;
    // type: $Enums.CategoryType;
  } | null;
};


export type Period = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'annualy'


export type AuditSearchParams = {
  userId?: string;
  entityType?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: string;
}

export interface AuditLogStatsProps {
  totalLogs: number;
  last24Hours: number;
  actionStats: Array<{ action: string; _count: number }>;
  entityTypeStats: Array<{ 
    // entityType: string; 
    _count: number 
  }>
}

export interface AuditLogFilterProps {
  currentFilters: {
    userId?: string;
    entityType?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  };
  users: Array<{ id: string; name: string | null; email: string | null }>;
  entityTypes: string[];
  actions: string[];
}

export type WhereClause = {
    userId?: string;
    entityType?: string;
    action?: string;
    createdAt?: {
      gte?: Date;
      lte?: Date;
    };
    OR?: Array<{
      entityName?: { contains: string; mode: "insensitive" };
      entityId?: { contains: string; mode: "insensitive" };
    }>;
  };


export interface AuditLogTableProps {
  logs: AuditLog[]
}


