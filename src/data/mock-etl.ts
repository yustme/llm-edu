import type { DatasetTable } from "@/types/semantic.types";

/** Column definition for source or target schema */
export interface SchemaColumn {
  name: string;
  type: string;
  description: string;
  nullable: boolean;
  example: string;
}

/** Mapping between a source and target column */
export interface ColumnMapping {
  source: string;
  target: string;
  confidence: number;
  transformType: "direct" | "rename" | "convert" | "derive";
  transformation?: string;
}

/** Messy source system schema */
export const SOURCE_SCHEMA: SchemaColumn[] = [
  { name: "cust_nm", type: "TEXT", description: "Customer name", nullable: true, example: "Acme Corp" },
  { name: "ord_dt", type: "TEXT", description: "Order date as text", nullable: false, example: "2024/12/01" },
  { name: "prd_id", type: "TEXT", description: "Product identifier", nullable: false, example: "P001" },
  { name: "ord_amt", type: "REAL", description: "Order amount", nullable: false, example: "24500.00" },
  { name: "dsc_pct", type: "REAL", description: "Discount percentage", nullable: true, example: "0.05" },
  { name: "tx_amt", type: "REAL", description: "Tax amount", nullable: true, example: "4900.00" },
  { name: "sts", type: "TEXT", description: "Status code", nullable: false, example: "C" },
  { name: "eml_addr", type: "TEXT", description: "Email address", nullable: true, example: "info@acme.com" },
];

/** Clean target schema */
export const TARGET_SCHEMA: SchemaColumn[] = [
  { name: "customer_name", type: "VARCHAR(255)", description: "Customer full name", nullable: false, example: "Acme Corp" },
  { name: "order_date", type: "DATE", description: "Order date as ISO date", nullable: false, example: "2024-12-01" },
  { name: "product_id", type: "VARCHAR(10)", description: "Product identifier", nullable: false, example: "P001" },
  { name: "order_amount", type: "DECIMAL(12,2)", description: "Order amount in CZK", nullable: false, example: "24500.00" },
  { name: "discount_percentage", type: "DECIMAL(5,4)", description: "Discount as decimal", nullable: true, example: "0.0500" },
  { name: "tax_amount", type: "DECIMAL(12,2)", description: "Tax amount in CZK", nullable: true, example: "4900.00" },
  { name: "status", type: "VARCHAR(20)", description: "Order status name", nullable: false, example: "completed" },
  { name: "email_address", type: "VARCHAR(255)", description: "Contact email", nullable: true, example: "info@acme.com" },
];

/** Column mappings with confidence scores */
export const COLUMN_MAPPINGS: ColumnMapping[] = [
  { source: "cust_nm", target: "customer_name", confidence: 0.92, transformType: "rename" },
  { source: "ord_dt", target: "order_date", confidence: 0.95, transformType: "convert", transformation: "TO_DATE(ord_dt, 'YYYY/MM/DD')" },
  { source: "prd_id", target: "product_id", confidence: 0.98, transformType: "rename" },
  { source: "ord_amt", target: "order_amount", confidence: 0.96, transformType: "rename" },
  { source: "dsc_pct", target: "discount_percentage", confidence: 0.88, transformType: "rename" },
  { source: "tx_amt", target: "tax_amount", confidence: 0.94, transformType: "rename" },
  { source: "sts", target: "status", confidence: 0.75, transformType: "convert", transformation: "CASE sts WHEN 'C' THEN 'completed' WHEN 'X' THEN 'cancelled' WHEN 'R' THEN 'returned' WHEN 'P' THEN 'pending' END" },
  { source: "eml_addr", target: "email_address", confidence: 0.91, transformType: "rename" },
];

/** Raw data with messy formatting */
export const RAW_DATA: DatasetTable = {
  name: "source_orders",
  columns: [
    { name: "cust_nm", type: "TEXT", description: "Customer name" },
    { name: "ord_dt", type: "TEXT", description: "Order date" },
    { name: "prd_id", type: "TEXT", description: "Product ID" },
    { name: "ord_amt", type: "REAL", description: "Amount" },
    { name: "dsc_pct", type: "REAL", description: "Discount %" },
    { name: "tx_amt", type: "REAL", description: "Tax" },
    { name: "sts", type: "TEXT", description: "Status" },
    { name: "eml_addr", type: "TEXT", description: "Email" },
  ],
  rows: [
    { cust_nm: "Acme Corp", ord_dt: "2024/10/05", prd_id: "P001", ord_amt: 24500.0, dsc_pct: 0.05, tx_amt: 4900.0, sts: "C", eml_addr: "info@acme.com" },
    { cust_nm: "Beta Systems", ord_dt: "2024/10/12", prd_id: "P003", ord_amt: 18900.0, dsc_pct: null, tx_amt: 3780.0, sts: "C", eml_addr: "contact@beta.com" },
    { cust_nm: "Gamma Tech", ord_dt: "2024/10/18", prd_id: "P002", ord_amt: 32000.0, dsc_pct: 0.1, tx_amt: 6400.0, sts: "X", eml_addr: "hello@gamma.com" },
    { cust_nm: "Acme Corp", ord_dt: "2024/11/02", prd_id: "P005", ord_amt: 12800.0, dsc_pct: 0.05, tx_amt: 2560.0, sts: "C", eml_addr: "info@acme.com" },
    { cust_nm: "Delta Solutions", ord_dt: "2024/11/08", prd_id: "P001", ord_amt: 24500.0, dsc_pct: 0.1, tx_amt: 4900.0, sts: "C", eml_addr: "sales@delta.com" },
    { cust_nm: "Epsilon Labs", ord_dt: "2024/11/15", prd_id: "P004", ord_amt: 45000.0, dsc_pct: 0.1, tx_amt: 9000.0, sts: "R", eml_addr: "team@epsilon.com" },
    { cust_nm: "Beta Systems", ord_dt: "2024/11/20", prd_id: "P006", ord_amt: 8900.0, dsc_pct: null, tx_amt: 1780.0, sts: "C", eml_addr: "contact@beta.com" },
    { cust_nm: "Zeta Industries", ord_dt: "2024/12/01", prd_id: "P002", ord_amt: 32000.0, dsc_pct: 0.05, tx_amt: 6400.0, sts: "C", eml_addr: "orders@zeta.com" },
  ],
  rowCount: 8,
};

/** Transformed data with clean formatting */
export const TRANSFORMED_DATA: DatasetTable = {
  name: "target_orders",
  columns: [
    { name: "customer_name", type: "VARCHAR", description: "Customer name" },
    { name: "order_date", type: "DATE", description: "Order date" },
    { name: "product_id", type: "VARCHAR", description: "Product ID" },
    { name: "order_amount", type: "DECIMAL", description: "Amount" },
    { name: "discount_percentage", type: "DECIMAL", description: "Discount" },
    { name: "tax_amount", type: "DECIMAL", description: "Tax" },
    { name: "status", type: "VARCHAR", description: "Status" },
    { name: "email_address", type: "VARCHAR", description: "Email" },
  ],
  rows: [
    { customer_name: "Acme Corp", order_date: "2024-10-05", product_id: "P001", order_amount: 24500.0, discount_percentage: 0.05, tax_amount: 4900.0, status: "completed", email_address: "info@acme.com" },
    { customer_name: "Beta Systems", order_date: "2024-10-12", product_id: "P003", order_amount: 18900.0, discount_percentage: null, tax_amount: 3780.0, status: "completed", email_address: "contact@beta.com" },
    { customer_name: "Gamma Tech", order_date: "2024-10-18", product_id: "P002", order_amount: 32000.0, discount_percentage: 0.1, tax_amount: 6400.0, status: "cancelled", email_address: "hello@gamma.com" },
    { customer_name: "Acme Corp", order_date: "2024-11-02", product_id: "P005", order_amount: 12800.0, discount_percentage: 0.05, tax_amount: 2560.0, status: "completed", email_address: "info@acme.com" },
    { customer_name: "Delta Solutions", order_date: "2024-11-08", product_id: "P001", order_amount: 24500.0, discount_percentage: 0.1, tax_amount: 4900.0, status: "completed", email_address: "sales@delta.com" },
    { customer_name: "Epsilon Labs", order_date: "2024-11-15", product_id: "P004", order_amount: 45000.0, discount_percentage: 0.1, tax_amount: 9000.0, status: "returned", email_address: "team@epsilon.com" },
    { customer_name: "Beta Systems", order_date: "2024-11-20", product_id: "P006", order_amount: 8900.0, discount_percentage: null, tax_amount: 1780.0, status: "completed", email_address: "contact@beta.com" },
    { customer_name: "Zeta Industries", order_date: "2024-12-01", product_id: "P002", order_amount: 32000.0, discount_percentage: 0.05, tax_amount: 6400.0, status: "completed", email_address: "orders@zeta.com" },
  ],
  rowCount: 8,
};

/** SQL transformation query */
export const TRANSFORM_SQL = `INSERT INTO target_orders (
  customer_name, order_date, product_id,
  order_amount, discount_percentage, tax_amount,
  status, email_address
)
SELECT
  cust_nm AS customer_name,
  TO_DATE(ord_dt, 'YYYY/MM/DD') AS order_date,
  prd_id AS product_id,
  ord_amt AS order_amount,
  dsc_pct AS discount_percentage,
  tx_amt AS tax_amount,
  CASE sts
    WHEN 'C' THEN 'completed'
    WHEN 'X' THEN 'cancelled'
    WHEN 'R' THEN 'returned'
    WHEN 'P' THEN 'pending'
  END AS status,
  eml_addr AS email_address
FROM source_orders;`;
