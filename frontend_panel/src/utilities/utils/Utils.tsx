import { KPI, Product } from "../../types/data/datatype";

// Format numbers with commas (e.g., 2,300,454)
export const formatNumberWithCommas = (num: number): string => {
  const validNumber = isNaN(num) || num === null || num === undefined ? 0 : num;
  return validNumber.toLocaleString();
};

// Format date in "YYYY-MM-DD" format
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// FORMAT NUMBER With no Decimal
export const formatNumberNoDecimalShort = (value: number): string => {
  const suffixes = ["", "k", "M", "B", "T"];
  let suffixIndex = 0;

  while (value >= 1000 && suffixIndex < suffixes.length - 1) {
    value /= 1000;
    suffixIndex++;
  }

  return `${Math.floor(value)}${suffixes[suffixIndex]}`;
};

// FORMAT NUMBER WITH 2 DECIMAL PLACES WITHOUT SUFFIXES
export const formatNumberWithTwoDecimalsNoSuffix = (
  value: number | string | null | undefined
): string => {
  const numericValue = parseFloat(value as string);

  if (isNaN(numericValue)) {
    return "0";
  }

  const formattedValue = numericValue.toFixed(2);

  return formattedValue.endsWith(".00")
    ? formattedValue.slice(0, -3)
    : formattedValue;
};

// Calculate Total Stock
export const calculateTotalStock = (products: Product[]): number => {
  return products.reduce((total, product) => total + product.stock, 0);
};

// Calculate Total Demand
export const calculateTotalDemand = (products: Product[]): number => {
  return products.reduce((total, product) => total + product.demand, 0);
};

// Calculate Fill Rate
export const calculateFillRate = (products: Product[]): number => {
  const totalDemand = calculateTotalDemand(products);
  if (totalDemand === 0) return 100;

  const fulfilledDemand = products.reduce((total, product) => {
    return total + Math.min(product.stock, product.demand);
  }, 0);

  return (fulfilledDemand / totalDemand) * 100;
};

// GENERATE RECENT KPI DATA FOR THE PAST 'n' DAYS
export const generateRecentKpiData = (days: number = 7): KPI[] => {
  const data: KPI[] = [];
  const today = new Date();
  
  // Clear time part to avoid timezone issues
  today.setHours(0, 0, 0, 0);

  // Generate data for the specified number of days
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    const dateStr = date.toISOString().split('T')[0];

    // Generate data with some randomness and trend
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
    const trend = 1 + ((days - 1 - i) / days) * 0.3; // Increase over time
    
    const stock = Math.floor((9000 + Math.random() * 2000) * randomFactor * trend);
    const demand = Math.floor((7000 + Math.random() * 3000) * randomFactor * trend);

    data.push({ date: dateStr, stock, demand });
  }

  console.log(`Generated ${data.length} days of KPI data for ${days} day request`);
  return data;
};
