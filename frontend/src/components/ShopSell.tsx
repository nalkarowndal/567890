import { useState } from 'react';
import { ChevronLeft, Search, ChevronRight, X, PlusCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ShopSell = () => {
  const { setCurrentView, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const brands = [
    { ko: '고야드', en: 'Goyard' },
    { ko: '구찌', en: 'Gucci' },
    { ko: '그라프', en: 'Graff' },
    { ko: '까르띠에', en: 'Cartier' },
    { ko: '끌로에', en: 'Chloe' },
    { ko: '다미아니', en: 'Damiani' },
    { ko: '더 로우', en: 'The Row' },
    { ko: '델보', en: 'Delvaux' },
    { ko: '드래곤 디퓨전', en: 'Dragon Diffusion' },
    { ko: '디젤', en: 'Diesel' },
    { ko: '로로피아나', en: 'Loro Piana' },
    { ko: '로에베', en: 'Loewe' },
    { ko: '루이비통', en: 'Louis Vuitton' },
    { ko: '샤넬', en: 'Chanel' },
    { ko: '디올', en: 'Dior' },
    { ko: '프라다', en: 'Prada' },
  ];

  const filtered = brands.filter(
    b =>
      b.ko.includes(searchQuery.trim()) ||
      b.en.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const handleSelectBrand = (brandName: string) => {
    setSelectedBrand(brandName);
    showToast(`[안내] '${brandName}' 판매 위탁 신청서 작성이 준비 중입니다.`);
  };

  return (
    <div className="flex flex-col h-full bg-white relative pb-24 overflow-hidden">
      {/* 1. 상단 헤더 */}
      <header className="flex items-center justify-between px-3 py-3 bg-white border-b border-gray-100 shrink-0">
        <button 
          type="button"
          aria-label="홈으로 돌아가기"
          onClick={() => setCurrentView('SHOP_MAIN')} 
          className="icon-button"
        >
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="text-sm font-bold text-gray-900 flex-1 text-center pr-10">내 상품 판매</h1>
      </header>

      {/* 본문 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-4">
        {/* 2. 타이틀 & 가이드 안내 */}
        <div className="mb-5">
          <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md inline-block mb-1.5">
            간편 명품 위탁
          </span>
          <h2 className="text-[20px] font-black text-gray-950 leading-snug">
            판매할 상품의<br/>브랜드명을 검색해주세요
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            전문 감정사의 검수를 거쳐 가장 정직한 시세로 위탁 판매됩니다.
          </p>
        </div>

        {/* 3. 검색창 */}
        <div className="mb-4">
          <div className="flex items-center border border-gray-200 rounded-xl px-3.5 py-3 bg-gray-50/70 focus-within:bg-white focus-within:border-gray-900 transition-colors">
            <Search size={18} className="text-gray-400 shrink-0 mr-2" aria-hidden="true" />
            <input 
              type="text" 
              placeholder="한글 또는 영문 브랜드명을 검색해주세요." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm bg-transparent placeholder-gray-400 outline-none font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="검색어 지우기"
                onClick={() => setSearchQuery('')}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* 4. 직접 등록 링크 */}
        <div className="flex justify-center mb-5">
          <button 
            type="button"
            onClick={() => showToast('[안내] 신규 브랜드 직접 등록 신청 창이 준비 중입니다.')}
            className="text-xs text-gray-700 font-bold flex items-center gap-1 hover:text-black py-1 px-2 rounded-lg hover:bg-gray-50 transition"
          >
            <PlusCircle size={14} className="text-gray-500" />
            원하는 브랜드가 없다면 직접 등록해보세요 
            <ChevronRight size={14} className="text-gray-400" />
          </button>
        </div>

        {/* 5. 브랜드 리스트 */}
        <div className="border-t border-gray-100 pt-1">
          {filtered.length > 0 ? (
            <ul className="divide-y divide-gray-50" role="listbox" aria-label="브랜드 선택 목록">
              {filtered.map((brand, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selectedBrand === brand.ko}
                    onClick={() => handleSelectBrand(brand.ko)}
                    className={`w-full flex justify-between items-center py-3.5 px-2 rounded-xl text-left transition ${
                      selectedBrand === brand.ko 
                        ? 'bg-gray-100 font-bold' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-[15px] text-gray-950">{brand.ko}</span>
                      <span className="text-gray-300 font-light text-[13px]">|</span>
                      <span className="text-gray-400 text-[14px] font-medium">{brand.en}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 mt-2">
              <p className="text-sm font-bold text-gray-800">일치하는 브랜드가 없습니다</p>
              <p className="text-xs text-gray-500 mt-1">
                정확한 브랜드명을 확인하거나 직접 등록을 이용해 보세요.
              </p>
              <button
                type="button"
                onClick={() => showToast('[안내] 신규 브랜드 직접 등록 신청이 접수되었습니다.')}
                className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-black transition"
              >
                '{searchQuery}' 브랜드 직접 등록하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};