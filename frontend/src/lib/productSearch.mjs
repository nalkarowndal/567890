const BRAND_ALIASES = {
  'chanel': '샤넬',
  '샤넬': 'chanel',
  'louis vuitton': '루이비통',
  '루이비통': 'louis vuitton',
  'dior': '디올',
  '디올': 'dior',
  'gucci': '구찌',
  '구찌': 'gucci',
  'prada': '프라다',
  '프라다': 'prada',
  'saint laurent': '생로랑',
  '생로랑': 'saint laurent',
  'celine': '셀린느',
  '셀린느': 'celine',
  'balenciaga': '발렌시아가',
  '발렌시아가': 'balenciaga',
  'bottega veneta': '보테가 베네타',
  '보테가 베네타': 'bottega veneta',
  'hermes': '에르메스',
  '에르메스': 'hermes',
  'cartier': '까르띠에',
  '까르띠에': 'cartier',
  'bvlgari': '불가리',
  'bulgari': '불가리',
  '불가리': 'bvlgari'
};

export function searchProducts(data, query) {
  if (!Array.isArray(data)) throw new Error('Invalid product response');
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return data.map(row => {
    if (!row || typeof row !== 'object' || (typeof row.title !== 'string' && typeof row.name !== 'string')) throw new Error('Invalid product');
    const price = row.price === null || row.price === undefined || row.price === '' ? null : Number(row.price);
    const brand = typeof row.brand === 'string' ? row.brand : '';
    const brandAlias = BRAND_ALIASES[brand.toLowerCase()] || '';
    return {
      type: row.type === 'RENT' ? 'RENT' : row.type === 'BUY' ? 'BUY' : null,
      id: String(row.id ?? ''),
      title: row.title || row.name,
      brand,
      brandAlias,
      price: Number.isFinite(price) && price >= 0 ? price : null
    };
  }).filter(row => terms.every(term => {
    const aliasForTerm = BRAND_ALIASES[term] || '';
    const searchable = `${row.brand} ${row.brandAlias} ${row.title}`.toLocaleLowerCase();
    return searchable.includes(term) || (aliasForTerm && searchable.includes(aliasForTerm));
  }));
}
