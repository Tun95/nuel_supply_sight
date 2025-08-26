// TableComponent.tsx
import { useState } from "react";
import { Pagination } from "antd";
import ProductDetailSidebar from "../product details/ProductDetail";
import { useTheme } from "../../../custom hooks/Hooks";
import { Product } from "../../../types/data/datatype";
import { DesktopTableView, MobileTableView } from "./tableviews/TableViews";

interface TableComponentProps {
  products: Product[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

function TableComponent({
  products,
  currentPage,
  onPageChange,
}: TableComponentProps) {
  const { theme } = useTheme();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const pageSize = 10;

  const getStatus = (stock: number, demand: number) => {
    if (stock > demand) return { status: "Healthy", color: "green" };
    if (stock === demand) return { status: "Low", color: "orange" };
    return { status: "Critical", color: "red" };
  };

  const handleRowClick = (product: Product) => {
    setSelectedProduct(product);
  };

  // Pagination logic
  const paginatedData = products.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <>
      <div className="w-full">
        <div
          className={`rounded-lg overflow-hidden ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Desktop View */}
          <div className="hidden md:block">
            <DesktopTableView
              data={paginatedData}
              onRowClick={handleRowClick}
              getStatus={getStatus}
              theme={theme}
            />
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            <MobileTableView
              data={paginatedData}
              onRowClick={handleRowClick}
              getStatus={getStatus}
              theme={theme}
            />
          </div>

          {/* Pagination */}
          <div className="p-4 flex justify-end">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={products.length}
              onChange={(page) => onPageChange(page)}
              showSizeChanger={false}
              className={`pagination-custom ${
                theme === "dark"
                  ? "dark-pagination [&_.ant-pagination-item]:bg-gray-700 [&_.ant-pagination-item]:border-gray-600 [&_.ant-pagination-item_a]:text-white [&_.ant-pagination-item-active]:bg-gray-800 [&_.ant-pagination-item-active]:border-indigo-600 [&_.ant-pagination-item-active_a]:text-white [&_.ant-pagination-item:hover]:bg-gray-600 [&_.ant-pagination-item-active:hover]:bg-indigo-700 [&_.ant-pagination-prev_button]:text-white [&_.ant-pagination-next_button]:text-white [&_.ant-pagination-disabled_button]:text-gray-500 [&_.ant-pagination-jump-next]:text-white [&_.ant-pagination-jump-prev]:text-white"
                  : "[&_.ant-pagination-item:hover]:bg-gray-100 [&_.ant-pagination-item-active]:bg-indigo-600 [&_.ant-pagination-item-active]:border-indigo-600 [&_.ant-pagination-item-active_a]:text-white [&_.ant-pagination-item-active:hover]:bg-indigo-700"
              }`}
            />
          </div>
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="absolute inset-y-0 right-0 pointer-events-auto">
            <ProductDetailSidebar
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default TableComponent;
