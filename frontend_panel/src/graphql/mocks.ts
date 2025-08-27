import { mockProducts, mockWarehouses } from "../data/data";
import { generateRecentKpiData } from "../utilities/utils/Utils";
import { Product } from "../types/data/datatype";

export const mocks = {
  Query: {
    products: () => mockProducts,
    warehouses: () => mockWarehouses,
    kpis: (_: unknown, { range }: { range: string }) => {
      let days = 7; // default to 7 days
      if (range === "14d") days = 14;
      if (range === "30d") days = 30;

      return generateRecentKpiData(days);
    },
  },
  Mutation: {
    updateDemand: (
      _: unknown,
      { productId, newDemand }: { productId: string; newDemand: number }
    ) => {
      const productIndex = mockProducts.findIndex((p) => p.id === productId);
      if (productIndex === -1) {
        throw new Error("Product not found");
      }

      mockProducts[productIndex].demand = newDemand;
      return mockProducts[productIndex];
    },
    transferStock: (
      _: unknown,
      {
        productId,
        sourceWarehouse,
        destinationWarehouse,
        quantity,
      }: {
        productId: string;
        sourceWarehouse: string;
        destinationWarehouse: string;
        quantity: number;
      }
    ) => {
      const productIndex = mockProducts.findIndex(
        (p) => p.id === productId && p.warehouse === sourceWarehouse
      );

      if (productIndex === -1) {
        throw new Error("Product not found in source warehouse");
      }

      if (mockProducts[productIndex].stock < quantity) {
        throw new Error("Insufficient stock for transfer");
      }

      // Update source warehouse stock
      mockProducts[productIndex].stock -= quantity;

      // Find or create product in destination warehouse
      const destProductIndex = mockProducts.findIndex(
        (p) => p.id === productId && p.warehouse === destinationWarehouse
      );

      if (destProductIndex === -1) {
        // Create new entry in destination warehouse
        const newProduct: Product = {
          ...mockProducts[productIndex],
          warehouse: destinationWarehouse,
          stock: quantity,
        };
        mockProducts.push(newProduct);
        return newProduct;
      } else {
        // Update existing product in destination warehouse
        mockProducts[destProductIndex].stock += quantity;
        return mockProducts[destProductIndex];
      }
    },
  },
};
