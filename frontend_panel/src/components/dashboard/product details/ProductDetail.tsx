import { X } from "lucide-react";
import { Product } from "../../../types/data/datatype";
import { useTheme } from "../../../custom hooks/Hooks";

interface ProductDetailSidebarProps {
  product: Product;
  onClose: () => void;
}

function ProductDetailSidebar({ product, onClose }: ProductDetailSidebarProps) {
  const { theme } = useTheme();

  const getStatusInfo = (stock: number, demand: number) => {
    if (stock > demand)
      return {
        status: "Healthy",
        color: "green",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        darkBgColor: "bg-green-900",
        darkTextColor: "text-green-300",
      };
    if (stock === demand)
      return {
        status: "Low",
        color: "orange",
        bgColor: "bg-orange-100",
        textColor: "text-orange-800",
        darkBgColor: "bg-orange-900",
        darkTextColor: "text-orange-300",
      };
    return {
      status: "Critical",
      color: "red",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      darkBgColor: "bg-red-900",
      darkTextColor: "text-red-300",
    };
  };

  const statusInfo = getStatusInfo(product.stock, product.demand);

  return (
    <div
      className={`w-96 h-full shadow-xl w-full max-w-[480px] transition-transform duration-200 ease-in-out ${
        theme === "dark" ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className=" h-full flex flex-col">
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
                  defaultValue={product.demand}
                  className="flex-1 h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
                <button className="h-9 outline-none text-sm px-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
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
                  <select className="h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                    <option>Select source warehouse</option>
                    {/* Warehouse options would go here */}
                  </select>
                  <select className="h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white">
                    <option>Select destination warehouse</option>
                    {/* Warehouse options would go here */}
                  </select>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Quantity"
                    className="flex-1 h-9 outline-none text-sm px-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                  <button className="h-9 outline-none text-sm px-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
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
