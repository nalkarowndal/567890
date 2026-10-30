import { useState } from 'react';
import { ChevronLeft, Search, ChevronRight, X, PlusCircle, CheckCircle2, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ShopSell = () => {
  const { setCurrentView, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  
  // 3단계 위탁 판매 시뮬레이션 상태
  const [sellStep, setSellStep] = useState<'brand' | 'category' | 'condition' | 'complete'>('brand');
  const [selectedCategory, setSelectedCategory] = useState<string>('가방/핸드백');
  const [selectedCondition, setSelectedCondition] = useState<'S급' | 'A급' | 'B급'>('A급');
  const [hasCertificate, setHasCertificate] = useState<boolean>(true);

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
    setSellStep('category');
  };

  const handleResetSell = () => {
    setSellStep('brand');
    setSelectedBrand(null);
  };

  const handleSubmitConsignment = () => {
    setSellStep('complete');
    showToast(`[데모] '${selectedBrand}' 위탁 판매 견적 신청이 접수되었습니다.`);
  };

  return (
    <div className="flex flex-col h-full bg-white relative pb-24 overflow-hidden">
      {/* 1. 상단 헤더 */}
      <header className="flex items-center justify-between px-3 py-3 bg-white border-b border-gray-100 shrink-0">
        <button 
          type="button"
          aria-label="홈으로 돌아가기"
          onClick={() => {
            if (sellStep !== 'brand') {
              setSellStep('brand');
            } else {
              setCurrentView('SHOP_MAIN');
            }
          }} 
          className="icon-button"
        >
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="text-sm font-bold text-gray-900 flex-1 text-center pr-10">
          {sellStep === 'brand' ? '내 상품 판매' : '간편 위탁 신청'}
        </h1>
      </header>

      {/* 본문 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 pt-4">
        
        {/* Step: 브랜드 선택 (기본 화면) */}
        {sellStep === 'brand' && (
          <>
            {/* 2. 타이틀 & 가이드 안내 */}
            <div className="mb-5">
              <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md inline-block mb-1.5 shadow-2xs">
                간편 명품 위탁
              </span>
              <h2 className="text-[20px] font-black text-gray-950 leading-snug tracking-tight">
                판매할 상품의<br/>브랜드명을 검색해주세요
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                전문 감정사의 정품 검수를 거쳐 가장 정직한 시세로 위탁 판매됩니다.
              </p>
            </div>

            {/* 3. 검색창 */}
            <div className="mb-4">
              <div className="flex items-center border border-gray-200 rounded-xl px-3.5 py-3 bg-gray-50/70 focus-within:bg-white focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10 transition-all">
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
                onClick={() => handleSelectBrand(searchQuery.trim() || '기타 명품 브랜드')}
                className="text-xs text-gray-700 font-bold flex items-center gap-1 hover:text-black py-1.5 px-3 rounded-lg hover:bg-gray-50 transition"
              >
                <PlusCircle size={14} className="text-gray-500" />
                원하는 브랜드가 없다면 직접 등록해보세요 
                <ChevronRight size={14} className="text-gray-400" />
              </button>
            </div>

            {/* 5. 브랜드 리스트 */}
            <div className="border-t border-gray-100 pt-1">
              {filtered.length > 0 ? (
                <ul className="divide-y divide-gray-50" aria-label="브랜드 선택 목록">
                  {filtered.map((brand, idx) => (
                    <li key={idx}>
                      <button
                        type="button"
                        aria-pressed={selectedBrand === brand.ko}
                        onClick={() => handleSelectBrand(brand.ko)}
                        className="w-full flex justify-between items-center py-3.5 px-2 rounded-xl text-left transition hover:bg-gray-50 active:scale-[0.99] group"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-black text-gray-950 group-hover:text-green-700 transition-colors">
                            {brand.ko}
                          </span>
                          <span className="text-gray-300 font-light text-[13px]">|</span>
                          <span className="text-gray-500 text-[14px] font-medium">{brand.en}</span>
                        </div>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-600 transition-colors" aria-hidden="true" />
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
                    onClick={() => handleSelectBrand(searchQuery.trim() || '신규 브랜드')}
                    className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-black transition active:scale-95"
                  >
                    '{searchQuery}' 브랜드로 위탁 신청하기
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Step: 카테고리 선택 (1단계) */}
        {sellStep === 'category' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">1단계 / 품목 선택</span>
                <h2 className="text-lg font-black text-gray-950 mt-1">
                  '{selectedBrand}' 위탁 상품 종류
                </h2>
              </div>
              <button 
                type="button" 
                onClick={handleResetSell}
                className="text-xs text-gray-400 hover:text-gray-700 font-medium"
              >
                브랜드 변경
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {['가방/핸드백', '지갑', '시계/주얼리', '의류', '슈즈', '기타 패션잡화'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-3.5 rounded-xl border text-left text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'border-gray-950 bg-gray-950 text-white shadow-xs'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => setSellStep('condition')}
                className="w-full bg-gray-950 hover:bg-black text-white font-bold py-3.5 rounded-xl shadow-xs transition active:scale-[0.985] flex items-center justify-center gap-1.5"
              >
                <span>다음: 상태 및 구성품 확인</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step: 상태 및 구성품 확인 (2단계) */}
        {sellStep === 'condition' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">2단계 / 상태 확인</span>
                <h2 className="text-lg font-black text-gray-950 mt-1">
                  상품 상태 및 정품 구성품
                </h2>
              </div>
              <button 
                type="button" 
                onClick={() => setSellStep('category')}
                className="text-xs text-gray-400 hover:text-gray-700 font-medium"
              >
                이전 단계
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 block">상품 컨디션 등급</label>
              <div className="grid grid-cols-3 gap-2">
                {(['S급', 'A급', 'B급'] as const).map(grade => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => setSelectedCondition(grade)}
                    className={`py-3 rounded-xl border text-center transition-all ${
                      selectedCondition === grade
                        ? 'border-gray-950 bg-gray-950 text-white font-black'
                        : 'border-gray-200 bg-white text-gray-700 font-medium hover:border-gray-400'
                    }`}
                  >
                    <span className="text-sm block">{grade}</span>
                    <span className="text-[10px] opacity-80 block mt-0.5">
                      {grade === 'S급' ? '미사용급' : grade === 'A급' ? '깔끔한 상태' : '사용감 있음'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 space-y-2.5">
              <label className="text-xs font-bold text-gray-800 block">정품 보증서 / 박스 구성품</label>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="has-cert"
                  checked={hasCertificate}
                  onChange={(e) => setHasCertificate(e.target.checked)}
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <label htmlFor="has-cert" className="text-xs text-gray-700 font-medium cursor-pointer">
                  정품 게런티 카드 또는 인보이스(구매 영수증) 보유
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleSubmitConsignment}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl shadow-xs transition active:scale-[0.985] flex items-center justify-center gap-1.5"
              >
                <span>예상 견적 확인 및 신청하기</span>
                <CheckCircle2 size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step: 신청 완료 및 시뮬레이션 안내 (3단계) */}
        {sellStep === 'complete' && (
          <div className="text-center py-6 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-700 mx-auto">
              <ShieldCheck size={36} />
            </div>

            <div>
              <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full inline-block mb-1">
                위탁 접수 시뮬레이션 완료
              </span>
              <h2 className="text-xl font-black text-gray-950 mt-1">
                '{selectedBrand} {selectedCategory}'<br/>위탁 신청이 접수되었습니다!
              </h2>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>선택 브랜드 / 품목</span>
                <span className="font-bold text-gray-900">{selectedBrand} · {selectedCategory}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>선택 상태 등급</span>
                <span className="font-bold text-gray-900">{selectedCondition} (보증서 {hasCertificate ? '포함' : '미포함'})</span>
              </div>
              <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-2">
                <span>예상 위탁 시세</span>
                <span className="font-black text-green-700 text-sm">약 850,000원 ~ 1,300,000원</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-800 text-left leading-relaxed">
              [데모 안내] 본 화면은 판매 위탁 UX 체험을 위한 인터페이스입니다. 실제 감정 택배 수거나 정산 계약은 발생하지 않습니다.
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={handleResetSell}
                className="flex-1 bg-white border border-gray-300 hover:border-gray-900 text-gray-800 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={14} /> 다른 상품 판매하기
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('SHOP_MAIN')}
                className="flex-1 bg-gray-950 text-white font-bold py-3 rounded-xl text-xs hover:bg-black"
              >
                홈으로 돌아가기
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};