import { useEffect, useState } from 'react';
import { ShoppingBag, RefreshCw } from 'lucide-react';
import { searchProducts, type SearchProduct } from '../lib/productSearch.mjs';

export function ProductCatalog({ 
  brand = '', 
  rentalOnly = false,
  keyword = '' 
}: { 
  brand?: string; 
  rentalOnly?: boolean;
  keyword?: string;
}) {
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');
  const [retry, setRetry] = useState(0);
  const [filter, setFilter] = useState<'전체' | '렌트' | '구매'>('전체');

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    setState('loading');

    fetch('/api/products', { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('Unavailable');
        return response.json();
      })
      .then(data => {
        if (active) {
          setProducts(searchProducts(data, ''));
          setState('success');
        }
      })
      .catch(() => {
        if (active) setState('error');
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [retry]);

  const visible = products.filter(item => {
    const matchBrand = !brand || item.brand === brand;
    const matchRentalOnly = !rentalOnly || item.type === 'RENT';
    const matchFilter = filter === '전체' || item.type === (filter === '렌트' ? 'RENT' : 'BUY');
    const cleanKw = keyword.trim().replace(/백|가방/g, ''); // 키워드 정규화
    const matchKeyword = !keyword.trim() || 
      item.title.includes(keyword.trim()) || 
      (cleanKw && item.title.includes(cleanKw)) ||
      (item.brand && item.brand.includes(keyword.trim()));
    return matchBrand && matchRentalOnly && matchFilter && matchKeyword;
  });

  return (
    <section aria-label="등록 상품 카탈로그" className="w-full">
      <div className="mb-4 px-3 py-2.5 bg-gray-50 border border-gray-200/80 rounded-xl flex items-center gap-2 text-[11px] text-gray-600 font-medium">
        <span className="font-bold text-gray-900 bg-white px-1.5 py-0.5 rounded text-[10px] shadow-2xs border border-gray-200">데모 안내</span>
        <span className="truncate">표시 상품은 화면 확인용 예시이며 클릭하여 상세 렌탈·구매 조건을 확인할 수 있습니다.</span>
      </div>

      {!rentalOnly && (
        <div className="flex gap-2 mb-4" role="tablist" aria-label="상품 유형 필터">
          {(['전체', '렌트', '구매'] as const).map(tab => (
            <button
              key={tab}
              role="tab"
              aria-selected={filter === tab}
              onClick={() => setFilter(tab)}
              className={`min-h-[38px] rounded-full border px-4 text-xs font-bold transition-all active:scale-95 ${
                filter === tab
                  ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      <div role="status" aria-live="polite">
        {state === 'loading' && (
          <div className="py-8 text-center">
            <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-2" />
            <p className="text-xs text-gray-500 font-medium">상품을 불러오고 있어요…</p>
          </div>
        )}

        {state === 'error' && (
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-5 text-center my-4">
            <p className="text-sm font-semibold text-gray-800">상품을 불러오지 못했어요.</p>
            <p className="text-xs text-gray-500 mt-1">네트워크 상태를 확인하고 다시 시도해 주세요.</p>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition active:scale-95"
              onClick={() => setRetry(v => v + 1)}
            >
              <RefreshCw size={14} /> 다시 시도
            </button>
          </div>
        )}

        {state === 'success' && visible.length === 0 && (
          <div className="py-12 text-center bg-gray-50/70 rounded-xl border border-dashed border-gray-200">
            <p className="text-sm font-semibold text-gray-700">해당 조건의 등록 상품이 없습니다.</p>
            <p className="text-xs text-gray-500 mt-1">다른 필터나 브랜드를 선택해 보세요.</p>
          </div>
        )}
      </div>

      {state === 'success' && visible.length > 0 && (
        <ul className="grid grid-cols-2 gap-x-3.5 gap-y-6">
          {visible.slice(0, rentalOnly ? 4 : 12).map(item => (
            <li 
              key={item.id} 
              data-testid="product-card"
              data-product-id={item.id}
              tabIndex={0}
              role="button"
              aria-label={`${item.brand || '명품 셀렉션'} ${item.title}`}
              className="min-w-0 flex flex-col group cursor-pointer interactive-card rounded-2xl p-1 -m-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
            >
              {/* 상품 이미지 플레이스홀더 */}
              <div className="aspect-square rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100 border border-gray-100 mb-2.5 flex flex-col items-center justify-center gap-1.5 text-gray-400 group-hover:border-gray-300 transition-all relative overflow-hidden shadow-2xs group-hover:shadow-sm">
                <div className="w-10 h-10 rounded-full bg-white/90 shadow-2xs flex items-center justify-center text-gray-600 transition-transform group-hover:scale-105">
                  <ShoppingBag size={22} strokeWidth={1.5} />
                </div>
                <span className="text-[10px] font-semibold tracking-wider text-gray-400">LUXURY</span>
                <span className={`absolute top-2 left-2 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-2xs border ${
                  item.type === 'RENT'
                    ? 'bg-pink-50 text-pink-700 border-pink-200/80'
                    : 'bg-blue-50 text-blue-700 border-blue-200/80'
                }`}>
                  {item.type === 'RENT' ? '렌트' : '구매'}
                </span>
              </div>

              {/* 상품 정보 */}
              <p className="text-xs font-black text-gray-900 tracking-tight">{item.brand || '명품 셀렉션'}</p>
              <h4 className="text-xs text-gray-600 mt-0.5 leading-snug line-clamp-2 min-h-[32px] break-words font-medium group-hover:text-gray-900 transition-colors">
                {item.title}
              </h4>
              <p className="text-sm font-black text-gray-950 mt-1.5 tabular-nums flex items-baseline">
                {item.price === null ? '가격 문의' : `${item.price.toLocaleString('ko-KR')}원`}
                <span className="font-medium text-[11px] text-gray-500 ml-1">
                  {item.type === 'RENT' ? '/ 1일' : '· 구매'}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
