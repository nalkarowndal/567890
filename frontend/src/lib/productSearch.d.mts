export interface SearchProduct { type: 'RENT' | 'BUY' | null; id: string; title: string; brand: string; price: number | null }
export function searchProducts(data: unknown, query: string): SearchProduct[];
