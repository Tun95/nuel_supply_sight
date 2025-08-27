// ProductDetailSidebar.tsx
import { X } from "lucide-react";
import { Product } from "../../../types/data/datatype";
import { useTheme } from "../../../custom hooks/Hooks";
import { getStatusInfo } from "../../../utilities/status/status";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  UPDATE_DEMAND,
  TRANSFER_STOCK,
  GET_PRODUCTS,
} from "../../../graphql/queries";
import { useQuery } from "@apollo/client";
import { GET_WAREHOUSES } from "../../../graphql/queries";
import { WarehousesQueryData } from "../../../types/graphql/graphql";

interface ProductDetailSidebarProps {
  product: Product;
  onClose: () => void;
  onProductUpdate?: (updatedProduct: Product) => void;
}

// Create a type for the products query result
interface ProductsQueryResult {
  products: Product[];
}

function ProductDetailSidebar({
  product,
  onClose,
  onProductUpdate,
}: ProductDetailSidebarProps) {
  const { theme } = useTheme();
  const [newDemand, setNewDemand] = useState(product.demand.toString());
  const [transferQuantity, setTransferQuantity] = useState("");
  const [sourceWarehouse, setSourceWarehouse] = useState("");
  const [destinationWarehouse, setDestinationWarehouse] = useState("");

  const statusInfo = getStatusInfo(product.stock, product.demand);

  // GraphQL Mutations with cache updates
  const [updateDemand] = useMutation(UPDATE_DEMAND, {
    update: (cache, { data }) => {
      if (!data) return;

      const updatedProduct = data.updateDemand;
      const existingProducts = cache.readQuery<ProductsQueryResult>({
        query: GET_PRODUCTS,
      });

      if (existingProducts) {
        cache.writeQuery({
          query: GET_PRODUCTS,
          data: {
            products: existingProducts.products.map((p) =>
              p.id === updatedProduct.id
                ? { ...p, demand: updatedProduct.demand }
                : p
            ),
          },
        });
      }

      if (onProductUpdate) {
        onProductUpdate(updatedProduct);
      }
    },
  });

  const [transferStock] = useMutation(TRANSFER_STOCK, {
    update: (cache, { data }) => {
      if (!data) return;

      const updatedProduct = data.transferStock;
      const existingProducts = cache.readQuery<ProductsQueryResult>({
        query: GET_PRODUCTS,
      });

      if (existingProducts) {
        // Find if the destination product already exists
        const destinationProductExists = existingProducts.products.some(
          (p) =>
            p.id === updatedProduct.id &&
            p.warehouse === updatedProduct.warehouse
        );

        let updatedProducts;

        if (destinationProductExists) {
          // Update both source and destination products
          updatedProducts = existingProducts.products.map((p) => {
            if (p.id === updatedProduct.id && p.warehouse === sourceWarehouse) {
              // This is the source product - reduce stock
              return { ...p, stock: p.stock - parseInt(transferQuantity) };
            } else if (
              p.id === updatedProduct.id &&
              p.warehouse === destinationWarehouse
            ) {
              // This is the destination product - increase stock
              return { ...p, stock: p.stock + parseInt(transferQuantity) };
            }
            return p;
          });
        } else {
          // Destination product doesn't exist yet - add it and update source
          updatedProducts = [
            ...existingProducts.products.map((p) =>
              p.id === updatedProduct.id && p.warehouse === sourceWarehouse
                ? { ...p, stock: p.stock - parseInt(transferQuantity) }
                : p
            ),
            updatedProduct,
          ];
        }

        cache.writeQuery({
          query: GET_PRODUCTS,
          data: { products: updatedProducts },
        });
      }

      if (onProductUpdate) {
        onProductUpdate(updatedProduct);
      }
    },
  });

  // Get warehouses for dropdowns
  const { data: warehousesData } =
    useQuery<WarehousesQueryData>(GET_WAREHOUSES);
  const warehouses = warehousesData?.warehouses || [];

  const handleUpdateDemand = async () => {
    try {
      await updateDemand({
        variables: {
          productId: product.id,
          newDemand: parseInt(newDemand),
        },
      });
      alert("Demand updated successfully!");
    } catch (error) {
      console.error("Error updating demand:", error);
      alert("Failed to update demand");
    }
  };

  const handleTransferStock = async () => {
    if (!sourceWarehouse || !destinationWarehouse || !transferQuantity) {
      alert("Please fill all transfer fields");
      return;
    }

    if (sourceWarehouse === destinationWarehouse) {
      alert("Source and destination warehouses cannot be the same");
      return;
    }

    try {
      await transferStock({
        variables: {
          productId: product.id,
          sourceWarehouse,
          destinationWarehouse,
          quantity: parseInt(transferQuantity),
        },
      });
      alert("Stock transferred successfully!");
      setTransferQuantity("");
      setSourceWarehouse("");
      setDestinationWarehouse("");
    } catch (error) {
      console.error("Error transferring stock:", error);
      alert("Failed to transfer stock");
    }
  };

  return (
    <div
      className={`max-900px:h-[100vh] w-96 h-full shadow-xl max-w-[480px] transition-transform duration-200 ease-in-out ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      } max-480px:w-full`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-l h-16 border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Product Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ID: {product.id}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  SKU
                </p>
                <p className="text-gray-900 dark:text-white">{product.sku}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Warehouse
                </p>
                <p className="text-gray-900 dark:text-white">
                  {product.warehouse}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Stock
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.stock.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Demand
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {product.demand.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Status
              </p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  theme === "dark"
                    ? `${statusInfo.darkBgColor} ${statusInfo.darkTextColor}`
                    : `${statusInfo.bgColor} ${statusInfo.textColor}`
                }`}
              >
                {statusInfo.status}
              </span>
            </div>

            {/* Update Demand Form */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                Update Demand
              </h4>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={newDemand}
                  onChange={(e) => setNewDemand(e.target.value)}
                  className="flex-1 h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={handleUpdateDemand}
                  className="h-9 outline-none text-sm px-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Update
                </button>
              </div>
            </div>

            {/* Transfer Stock Form */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
                Transfer Stock
              </h4>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={sourceWarehouse}
                    onChange={(e) => setSourceWarehouse(e.target.value)}
                    className="h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select source warehouse</option>
                    {warehouses.map((wh) => (
                      <option key={wh.code} value={wh.code}>
                        {wh.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={destinationWarehouse}
                    onChange={(e) => setDestinationWarehouse(e.target.value)}
                    className="h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select destination warehouse</option>
                    {warehouses.map((wh) => (
                      <option key={wh.code} value={wh.code}>
                        {wh.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={transferQuantity}
                    onChange={(e) => setTransferQuantity(e.target.value)}
                    className="flex-1 h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={handleTransferStock}
                    className="h-9 outline-none text-sm px-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Transfer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailSidebar;
