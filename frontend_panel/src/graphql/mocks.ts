// src/graphql/mockResolvers.ts
import { mockProducts, mockWarehouses } from "../data/data";
import { generateRecentKpiData } from "../utilities/utils/Utils";
import { Product } from "../types/data/datatype";

export const mockResolvers = {
  Query: {
    products: () => mockProducts,
    warehouses: () => mockWarehouses,
    kpis: (_: unknown, args: { range?: string }) => {
      const range = args?.range || "7d";
      console.log("Received range:", range);
      const days = parseInt(range.replace("d", ""), 10);
      return generateRecentKpiData(days);
    },
  },
  Mutation: {
    updateDemand: (_: unknown, args: { productId: string; newDemand: number }) => {
      const { productId, newDemand } = args;
      
      console.log("Update demand args:", args);
      
      const productIndex = mockProducts.findIndex((p) => p.id === productId);
      if (productIndex === -1) {
        throw new Error(`Product not found with ID: ${productId}`);
      }

      mockProducts[productIndex].demand = newDemand;
      console.log("Updated product demand:", mockProducts[productIndex]);
      return mockProducts[productIndex];
    },
    transferStock: (_: unknown, args: {
      productId: string;
      sourceWarehouse: string;
      destinationWarehouse: string;
      quantity: number;
    }) => {
      const { productId, sourceWarehouse, destinationWarehouse, quantity } = args;
      
      console.log("Transfer stock args:", args);
      
      const productIndex = mockProducts.findIndex(
        (p) => p.id === productId && p.warehouse === sourceWarehouse
      );

      if (productIndex === -1) {
        throw new Error(`Product not found in source warehouse: ${sourceWarehouse}`);
      }

      if (mockProducts[productIndex].stock < quantity) {
        throw new Error(`Insufficient stock for transfer. Available: ${mockProducts[productIndex].stock}, Requested: ${quantity}`);
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
        console.log("Created new product in destination:", newProduct);
        return newProduct;
      } else {
        // Update existing product in destination warehouse
        mockProducts[destProductIndex].stock += quantity;
        console.log("Updated destination product:", mockProducts[destProductIndex]);
        return mockProducts[destProductIndex];
      }
    },
  },
};