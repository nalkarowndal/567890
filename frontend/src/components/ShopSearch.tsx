import { useEffect, useRef, useState } from 'react';
import { searchProducts, type SearchProduct } from '../lib/productSearch.mjs';
import { ChevronLeft, Search, X, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ShopSearch = () => {
  const { activeOverlay, setActiveOverlay, setSelectedProduct } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [retry, setRetry] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(['샤넬', '루이비통', '시계']);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const isOpen = activeOverlay === 'SEARCH';

  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !query.trim()) {
      setResults([]);
      setStatus('idle');
      return;
    }

    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    setStatus('loading');

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch('/api/products', { signal: controller.signal });
        if (!response.ok) throw new Error('Products unavailable');
        const items = searchProducts(await response.json(), query);
        if (active) {
          setResults(items);
          setStatus('success');
          // 최근 검색어 추가 (중복 방지, 최대 5개)
          if (query.trim().length >= 2) {
            setRecentSearches(prev => [query.trim(), ...prev.filter(q => q !== query.trim())].slice(0, 5));
          }
        }
      } catch {
        if (active) setStatus('error');
      } finally {
        window.clearTimeout(timeout);
      }
    }, 250);

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timer);
      window.clearTimeout(timeout);
    };
  }, [isOpen, query, retry]);

  const updateQuery = (value: string) => {
    setQuery(value);
    if (!value.trim()) {
      setStatus('idle');
      setResults([]);
    }
  };

  const handleClear = () => {
    updateQuery('');
    inputRef.current?.focus();
  };

  const removeRecent = (target: string) => {
    setRecentSearches(prev => prev.filter(item => item !== target));
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
  };

  if (!isOpen) return null;

  const recommended = [
    'Supreme', 'Matin', 'Chrome', '불가리', 'Essentials', 
    '목걸이', '까르띠에', '시계', '르메르', 'BAPE', 'The'
  ];

  const trendingLeft = [
    { rank: 1, name: '샤넬', status: null }, 
    { rank: 2, name: '셀린느', status: null },
    { rank: 3, name: '발렌시아가', status: { type: 'new', text: 'new' } },
    { rank: 4, name: '디올', status: { type: 'up', text: '▲ 1' } },
    { rank: 5, name: '프라다', status: { type: 'down', text: '▼ 1' } },
  ];

  const trendingRight = [
    { rank: 6, name: '루이비통', status: { type: 'down', text: '▼ 3' } },
    { rank: 7, name: '에르메스', status: { type: 'up', text: '▲ 1' } },
    { rank: 8, name: '더로우', status: { type: 'new', text: 'new' } },
    { rank: 9, name: '고야드', status: { type: 'new', text: 'new' } },
    { rank: 10, name: '구찌', status: { type: 'new', text: 'new' } },
  ];

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-label="상품 검색 화면" 
      onKeyDown={event => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          setActiveOverlay(null);
        }
      }} 
      className="absolute inset-0 bg-white z-[110] flex flex-col animate-fadeIn"
    >
      {/* 상단 검색바 헤더 */}
      <header className="flex items-center px-3 py-3 gap-2 bg-white border-b border-gray-100 shadow-2xs">
        <button 
          type="button"
          aria-label="검색 닫기" 
          onClick={() => setActiveOverlay(null)} 
          className="icon-button shrink-0"
        >
          <ChevronLeft size={24} className="text-gray-900" />
        </button>

        <div className="flex-1 bg-gray-50 border border-gray-300 focus-within:border-gray-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-gray-900/10 rounded-xl px-3.5 py-2.5 flex items-center gap-2 transition-all">
          <Search size={18} className="text-gray-400 shrink-0" aria-hidden="true" />
          <input 
            ref={inputRef} 
            type="search"
            aria-label="브랜드 또는 상품 검색"
            value={query}
            onChange={event => updateQuery(event.target.value)} 
            placeholder="브랜드명 또는 상품명을 검색해주세요" 
            className="w-full text-sm outline-none bg-transparent placeholder-gray-400 font-medium" 
          />
          {query && (
            <button
              type="button"
              aria-label="검색어 지우기"
              onClick={handleClear}
              className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </header>

      {/* 스크롤 콘텐츠 영역 */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-20 scrollbar-hide">
        {query.trim() ? (
          <section aria-label="검색 결과" aria-busy={status === 'loading'}>
            <div className="flex justify-between items-baseline mb-4">
              <h2 className="text-base font-extrabold text-gray-900">검색 결과</h2>
              {status === 'success' && (
                <span className="text-xs text-gray-500 font-semibold">
                  총 <span className="text-gray-900 font-bold tabular-nums">{results.length}</span>개
                </span>
              )}
            </div>

            <div role="status" aria-live="polite">
              {status === 'loading' && (
                <div className="rounded-2xl bg-gray-50 p-6 text-center my-3 border border-gray-100">
                  <div className="inline-block w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-2" />
                  <p className="text-xs text-gray-600 font-medium">일치하는 상품을 찾고 있어요…</p>
                </div>
              )}

              {status === 'error' && (
                <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 text-center my-3">
                  <p className="text-sm font-semibold text-gray-800">상품을 불러오지 못했어요.</p>
                  <p className="text-xs text-gray-500 mt-1">잠시 후 다시 시도해 주세요.</p>
                  <button 
                    type="button"
                    className="mt-4 rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-black transition active:scale-95" 
                    onClick={() => { setStatus('loading'); setRetry(v => v + 1); }}
                  >
                    다시 시도
                  </button>
                </div>
              )}
            </div>

            {status === 'success' && (
              results.length > 0 ? (
                <ul className="space-y-3">
                  {results.map((item, index) => (
                    <li 
                      key={`${item.id}-${index}`} 
                      data-testid="search-result-item"
                      data-product-id={item.id}
                      tabIndex={0}
                      onClick={() => {
                        setSelectedProduct(item);
                        setActiveOverlay(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedProduct(item);
                          setActiveOverlay(null);
                        }
                      }}
                      className="rounded-2xl border border-gray-100 p-4 hover:border-gray-300 transition-all flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs bg-white interactive-card cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                          <ShoppingBag size={20} strokeWidth={1.5} />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11px] font-black text-gray-950">{item.brand}</span>
                          <h3 className="text-xs font-medium text-gray-700 truncate mt-0.5">{item.title}</h3>
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${
                            item.type === 'RENT'
                              ? 'text-pink-700 bg-pink-50 border border-pink-100'
                              : 'text-blue-700 bg-blue-50 border border-blue-100'
                          }`}>
                            {item.type === 'RENT' ? '렌탈 상품' : '구매 상품'}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-black text-gray-950 tabular-nums shrink-0 text-right">
                        {item.price === null ? '가격 문의' : `${item.price.toLocaleString('ko-KR')}원`}
                        {item.type === 'RENT' && <span className="text-[11px] font-normal text-gray-500 block">/ 1일</span>}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-2xl bg-gray-50 border border-dashed border-gray-200 p-8 text-center my-4">
                  <p className="font-bold text-gray-800 text-sm">검색 결과가 없어요</p>
                  <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
                    브랜드명(예: 샤넬, 루이비통, 구찌)이나<br/>더 짧은 검색어로 다시 입력해 보세요.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {['샤넬', '루이비통', '구찌'].map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => updateQuery(b)}
                        className="px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-900 rounded-lg text-xs font-bold text-gray-800 transition"
                      >
                        '{b}' 검색하기
                      </button>
                    ))}
                  </div>
                  <button 
                    type="button"
                    className="mt-4 text-xs font-bold text-gray-900 underline hover:text-black inline-block"
                    onClick={handleClear}
                  >
                    추천 검색어 목록 보기
                  </button>
                </div>
              )
            )}
          </section>
        ) : (
          <>
            {/* 최근 검색어 */}
            {recentSearches.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2.5">
                  <h3 className="font-extrabold text-[14px] text-gray-900">최근 검색어</h3>
                  <button
                    type="button"
                    onClick={clearAllRecent}
                    className="text-[11px] text-gray-400 hover:text-gray-700 font-medium"
                  >
                    전체 삭제
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map(word => (
                    <div
                      key={word}
                      className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200/80 hover:border-gray-300 text-gray-800 text-xs px-3 py-1.5 rounded-full font-medium transition"
                    >
                      <button
                        type="button"
                        onClick={() => { updateQuery(word); inputRef.current?.focus(); }}
                        className="hover:font-bold"
                      >
                        {word}
                      </button>
                      <button
                        type="button"
                        aria-label={`${word} 검색어 삭제`}
                        onClick={() => removeRecent(word)}
                        className="text-gray-400 hover:text-gray-700 p-0.5 rounded-full"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 추천 검색어 */}
            <h3 className="font-extrabold text-[15px] mb-3 text-gray-900">추천 검색어</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {recommended.map(word => (
                <button 
                  type="button"
                  onClick={() => { updateQuery(word); inputRef.current?.focus(); }} 
                  key={word} 
                  className="bg-gray-100/80 hover:bg-gray-200 text-gray-800 text-xs px-3.5 py-2 rounded-full font-semibold transition active:scale-95"
                >
                  {word}
                </button>
              ))}
            </div>

            {/* 인기 브랜드 */}
            <div className="flex justify-between items-baseline mb-4">
              <h3 className="font-extrabold text-[15px] text-gray-900">인기 브랜드</h3>
              <span className="text-[11px] text-gray-500 font-medium">실시간 검색 랭킹 예시</span>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-3.5">
                {trendingLeft.map(item => (
                  <button 
                    type="button"
                    onClick={() => { updateQuery(item.name); inputRef.current?.focus(); }} 
                    key={item.rank} 
                    className="flex min-h-[38px] items-center justify-between text-left p-1 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-black text-sm w-4 text-gray-900 tabular-nums">{item.rank}</span>
                      <span className="text-xs font-bold text-gray-800">{item.name}</span>
                    </div>
                    {item.status && (
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {item.status.text}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex-1 flex flex-col gap-3.5">
                {trendingRight.map(item => (
                  <button 
                    type="button"
                    onClick={() => { updateQuery(item.name); inputRef.current?.focus(); }} 
                    key={item.rank} 
                    className="flex min-h-[38px] items-center justify-between text-left p-1 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-black text-sm w-4 text-gray-900 tabular-nums">{item.rank}</span>
                      <span className="text-xs font-bold text-gray-800">{item.name}</span>
                    </div>
                    {item.status && (
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        {item.status.text}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};