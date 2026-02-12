export interface Query {
  id: string;
  text: string;
  description: string;
}

export interface QueryResult {
  queryId: string;
  sql: string;
  value: number;
  formattedValue: string;
  problem?: string;
  isCorrect: boolean;
}

export interface SemanticDefinition {
  metricName: string;
  displayName: string;
  description: string;
  calculation: string;
  filters: string[];
  expectedResult: number;
  formattedResult: string;
}

export interface DatasetColumn {
  name: string;
  type: string;
  description: string;
}

export interface DatasetTable {
  name: string;
  columns: DatasetColumn[];
  rows: Record<string, unknown>[];
  rowCount: number;
}
