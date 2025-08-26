// Dashboard.tsx
import TableComponent from "./table/Table";
import Widget from "./widget/Widget";
import { useDateRange, useTheme } from "../../custom hooks/Hooks";
import ChartComponent from "./chart/Chart";
import { useState, useEffect, useMemo } from "react";
import { mockKpiData, mockProducts } from "../../data/data";
import {
  calculateFillRate,
  calculateTotalDemand,
  calculateTotalStock,
} from "../../utilities/utils/Utils";
import { KPI, Product } from "../../types/data/datatype";
import FilterBox from "./filters/FilterBox";

function Dashboard() {
  const { theme } = useTheme();
  const { selectedDateRange } = useDateRange();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [kpiData, setKpiData] = useState({
    totalStock: 0,
    totalDemand: 0,
    fillRate: 0,
  });
  const [kpiChartData, setKpiChartData] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter products based on filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      const matchesSearch =
        searchFilter === "" ||
        product.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchFilter.toLowerCase()) ||
        product.id.toLowerCase().includes(searchFilter.toLowerCase());

      // Warehouse filter
      const matchesWarehouse =
        warehouseFilter === "all" || product.warehouse === warehouseFilter;

      // Status filter
      let matchesStatus = true;
      if (statusFilter !== "all") {
        const status =
          product.stock > product.demand
            ? "healthy"
            : product.stock === product.demand
            ? "low"
            : "critical";
        matchesStatus = status === statusFilter;
      }

      return matchesSearch && matchesWarehouse && matchesStatus;
    });
  }, [products, searchFilter, warehouseFilter, statusFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilter, warehouseFilter, statusFilter]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch product data
        setProducts(mockProducts);

        // Calculate KPIs from product data
        const totalStock = calculateTotalStock(mockProducts);
        const totalDemand = calculateTotalDemand(mockProducts);
        const fillRate = calculateFillRate(mockProducts);

        setKpiData({
          totalStock,
          totalDemand,
          fillRate,
        });

        // Simulate fetching KPI data based on date range
        const filteredData = filterKpiDataByRange(
          mockKpiData,
          selectedDateRange
        );

        setKpiChartData(filteredData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDateRange]);

  // Function to filter KPI data based on date range
  const filterKpiDataByRange = (data: KPI[], range: string): KPI[] => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const startDate = new Date();

    switch (range) {
      case "7d":
        startDate.setDate(today.getDate() - 7);
        break;
      case "14d":
        startDate.setDate(today.getDate() - 14);
        break;
      case "30d":
        startDate.setDate(today.getDate() - 30);
        break;
      default:
        startDate.setDate(today.getDate() - 7);
    }

    startDate.setHours(0, 0, 0, 0);

    return data.filter((kpi) => {
      const kpiDate = new Date(kpi.date);
      kpiDate.setHours(12, 0, 0, 0);
      return kpiDate >= startDate && kpiDate <= today;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }
  return (
    <div className={`w-full overflow-hidden ${theme === "dark" ? "dark" : ""}`}>
      <div
        className={`w-full overflow-hidden ${theme === "dark" ? "dark" : ""}`}
      >
        {/* Welcome message */}
        <div className="mb-2 max-480px:mb-1">
          <div className="content max-900px:px-2 max-480px:p-2 max-480px:pb-0">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 max-480px:text-xl ">
              Welcome back Tunji!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-3xl text-sm leading-6">
              Track inventory levels, demand patterns, and fulfillment metrics
              in one place.
            </p>
          </div>
        </div>
      </div>
      {/* KPI Widgets */}
      <div
        className="grid grid-cols-3 gap-5 py-5 w-full 
               max-1045px:grid-cols-2 
               max-630px:grid-cols-1 
               max-900px:px-2"
      >
        <Widget type="stock" value={kpiData.totalStock} />
        <Widget type="demand" value={kpiData.totalDemand} />
        <Widget type="fillRate" value={kpiData.fillRate} />
      </div>

      {/* Chart Section */}
      <div className="mb-5 max-900px:px-2">
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Stock vs Demand trend
        </h4>
        <div className="lg:grid-cols-2 gap-5 mt-1 w-full max-900px:grid-cols-1">
          <div className="w-full border border-gray-200 dark:border-gray-700 p-2 rounded-md h-[360px] overflow-hidden bg-white dark:bg-gray-800">
            {kpiChartData.length > 0 ? (
              <ChartComponent data={kpiChartData} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500 dark:text-gray-400">
                  No data available for the selected date range
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-900px:px-2 relative">
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Inventory Overview
        </h4>
        <div className="mt-1">
          <FilterBox
            onSearchChange={setSearchFilter}
            onWarehouseChange={setWarehouseFilter}
            onStatusChange={setStatusFilter}
          />
          <TableComponent
            products={filteredProducts}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
