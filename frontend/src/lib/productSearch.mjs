export function searchProducts(data, query) {
 if (!Array.isArray(data)) throw new Error('Invalid product response');
 const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
 return data.map(row => {
  if (!row || typeof row !== 'object' || (typeof row.title !== 'string' && typeof row.name !== 'string')) throw new Error('Invalid product');
  const price = row.price === null || row.price === undefined || row.price === '' ? null : Number(row.price);
  return { type: row.type === 'RENT' ? 'RENT' : row.type === 'BUY' ? 'BUY' : null, id: String(row.id ?? ''), title: row.title || row.name, brand: typeof row.brand === 'string' ? row.brand : '', price: Number.isFinite(price) && price >= 0 ? price : null };
 }).filter(row => terms.every(term => `${row.brand} ${row.title}`.toLocaleLowerCase().includes(term)));
}
