import { ProductCatalog } from './ProductCatalog';
import { useState } from 'react';
import { ChevronLeft, MessageCircle, ShoppingCart, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ShopCategory = () => {
  const { setCurrentView, setActiveOverlay, showToast } = useApp();
  const [mainTab, setMainTab] = useState<'CATEGORY' | 'BRAND'>('CATEGORY');
  const [subTab, setSubTab] = useState<'여성' | '남성' | '아동'>('여성');
  const [leftActive, setLeftActive] = useState('가방/핸드백');
  const [activeBrand, setActiveBrand] = useState('루이비통');
  const [selectedSub, setSelectedSub] = useState<string | null>(null);

  const leftCategories = [
    '가방/핸드백', '의류', '슈즈', '지갑', 
    '패션잡화', '시계/액세서리', '골프', '화장품/향수'
  ];

  const subCategoriesMap: Record<string, string[]> = {
    '가방/핸드백': ['전체', '토트백', '숄더백/호보백', '크로스/메신저백', '버킷백', '클러치/파우치', '백팩', '벨트백/힙색', '서류가방', '여행가방'],
    '의류': ['전체', '자켓/코트', '원피스', '니트/가디건', '탑/블라우스', '팬츠', '스커트', '패딩/다운'],
    '슈즈': ['전체', '스니커즈', '플랫/로퍼', '힐/펌프스', '샌들/슬라이드', '부츠', '뮬/블로퍼'],
    '지갑': ['전체', '반지갑', '장지갑', '카드지갑', '동전지갑/머니클립', '체인지갑'],
    '패션잡화': ['전체', '스카프/머플러', '모자', '벨트', '선글라스/안경', '키링/스트랩', '우산/양산'],
    '시계/액세서리': ['전체', '명품시계', '목걸이/펜던트', '귀걸이', '반지', '팔찌/뱅글', '브로치'],
    '골프': ['전체', '골프백/캐디백', '골프웨어', '골프화', '골프모자', '골프액세서리'],
    '화장품/향수': ['전체', '향수/디퓨저', '스킨케어', '메이크업', '바디/헤어케어']
  };

  const rightSubCategories = subCategoriesMap[leftActive] || subCategoriesMap['가방/핸드백'];

  // DB에 등록된 브랜드와 일치하는 브랜드 아이콘 목록
  const brands = [
    { name: '루이비통', icon: '👜' },
    { name: '디올', icon: '👕' },
    { name: '구찌', icon: '🎒' },
    { name: '샤넬', icon: '👛' },
    { name: '생로랑', icon: '🧥' },
    { name: '셀린느', icon: '🛍️' },
    { name: '프라다', icon: '👝' },
    { name: '발렌시아가', icon: '🧢' },
    { name: '에르메스', icon: '🧣' },
    { name: '까르띠에', icon: '⌚' },
    { name: '불가리', icon: '💎' }
  ];

  return (
    <div className="flex flex-col h-full bg-white relative pb-24 overflow-hidden">
      {/* 1. 상단 헤더 */}
      <header className="flex justify-between items-center px-4 py-3 border-b border-gray-100 bg-white/95 backdrop-blur-md z-20 shrink-0">
        <button 
          type="button"
          aria-label="홈으로 돌아가기"
          onClick={() => setCurrentView('SHOP_MAIN')}
          className="p-1 -ml-1 text-gray-800 hover:text-black transition"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-base font-bold text-gray-900">카테고리</h1>
        <div className="flex gap-2">
          <button 
            type="button" 
            aria-label="고객 문의 채팅"
            onClick={() => showToast('[고객센터] 실시간 1:1 채팅 문의 준비 중입니다.')}
            className="p-1.5 text-gray-800 hover:text-black transition rounded-full hover:bg-gray-100"
          >
            <MessageCircle size={22} />
          </button>
          <button 
            type="button" 
            aria-label="장바구니 및 로그인"
            onClick={() => setActiveOverlay('LOGIN')}
            className="p-1.5 text-gray-800 hover:text-black transition rounded-full hover:bg-gray-100"
          >
            <ShoppingCart size={22} />
          </button>
        </div>
      </header>

      {/* 2. 메인 탭 (카테고리 / 브랜드) */}
      <div className="flex border-b border-gray-200 px-4 shrink-0 bg-white" role="tablist" aria-label="탐색 기준 탭">
        <button 
          type="button"
          role="tab"
          aria-selected={mainTab === 'CATEGORY'}
          onClick={() => setMainTab('CATEGORY')}
          className={`flex-1 py-3 text-[15px] font-bold text-center border-b-2 transition ${
            mainTab === 'CATEGORY' ? 'border-gray-900 text-gray-950' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          카테고리
        </button>
        <button 
          type="button"
          role="tab"
          aria-selected={mainTab === 'BRAND'}
          onClick={() => setMainTab('BRAND')}
          className={`flex-1 py-3 text-[15px] font-bold text-center border-b-2 transition ${
            mainTab === 'BRAND' ? 'border-gray-900 text-gray-950' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          브랜드
        </button>
      </div>

      {/* 3-A. 카테고리 뷰 */}
      {mainTab === 'CATEGORY' && (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* 성별 서브 탭 */}
          <div className="flex px-4 border-b border-gray-100 shrink-0 bg-white" role="tablist" aria-label="대상 구분">
            {(['여성', '남성', '아동'] as const).map(tab => (
              <button 
                type="button"
                key={tab} 
                role="tab"
                aria-selected={subTab === tab}
                onClick={() => { setSubTab(tab); setSelectedSub(null); }}
                className={`py-3 mr-6 text-sm font-bold border-b-2 transition ${
                  subTab === tab ? 'border-gray-900 text-gray-950' : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-1 min-h-0 overflow-hidden">
            {/* 좌측 LNB 카테고리 목록 */}
            <nav aria-label="카테고리 목록" className="w-[104px] bg-gray-100/80 overflow-y-auto scrollbar-hide py-1 shrink-0 border-r border-gray-100">
              {leftCategories.map(cat => (
                <button
                  type="button"
                  key={cat} 
                  aria-pressed={leftActive === cat}
                  onClick={() => { setLeftActive(cat); setSelectedSub(null); }}
                  className={`w-full text-left px-3.5 py-3.5 text-[13px] transition ${
                    leftActive === cat 
                      ? 'bg-white font-black text-gray-950 border-l-2 border-gray-900 shadow-xs' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>

            {/* 우측 콘텐츠 영역 */}
            <div className="flex-1 bg-white overflow-y-auto scrollbar-hide p-4 sm:p-5">
              {/* 상단 3개 추천 카드 (선택 성별 및 카테고리와 연동) */}
              <div className="flex justify-between gap-2.5 mb-6">
                <button
                  type="button"
                  onClick={() => showToast(`[안내] ${subTab} 추천 상품 모음이 준비 중입니다.`)}
                  className="flex flex-col items-center gap-1.5 w-1/3 text-center group"
                >
                  <div className="bg-gray-50 group-hover:bg-gray-100 border border-gray-100 rounded-2xl aspect-square w-full flex items-center justify-center text-3xl shadow-xs transition">
                    👞
                  </div>
                  <span className="text-[11px] text-center font-bold text-gray-800 break-keep leading-tight">
                    {subTab} 추천 스니커즈
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast(`[안내] ${subTab} 베스트셀러 상품 모음이 준비 중입니다.`)}
                  className="flex flex-col items-center gap-1.5 w-1/3 text-center group"
                >
                  <div className="bg-gray-50 group-hover:bg-gray-100 border border-gray-100 rounded-2xl aspect-square w-full flex items-center justify-center text-3xl shadow-xs transition">
                    💍
                  </div>
                  <span className="text-[11px] text-center font-bold text-gray-800 break-keep leading-tight">
                    {subTab} 베스트셀러
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast(`[안내] ${subTab} ${leftActive} 신규 아이템 모음이 준비 중입니다.`)}
                  className="flex flex-col items-center gap-1.5 w-1/3 text-center group"
                >
                  <div className="bg-gray-50 group-hover:bg-gray-100 border border-gray-100 rounded-2xl aspect-square w-full flex items-center justify-center text-3xl shadow-xs transition">
                    🧥
                  </div>
                  <span className="text-[11px] text-center font-bold text-gray-800 break-keep leading-tight">
                    {subTab} 시즌 컬렉션
                  </span>
                </button>
              </div>

              {/* 하위 카테고리 목록 */}
              <div className="border-t border-gray-100 pt-1">
                {rightSubCategories.map((sub, idx) => {
                  const isSelected = selectedSub === sub || (sub === '전체' && selectedSub === null);
                  return (
                    <button
                      type="button"
                      key={idx} 
                      onClick={() => {
                        const target = sub === '전체' ? null : sub;
                        setSelectedSub(target);
                        showToast(`[카테고리] '${subTab} > ${leftActive} > ${sub}' 상품 목록을 탐색합니다.`);
                      }}
                      className={`w-full flex justify-between items-center py-3.5 px-2 border-b border-gray-50 rounded-lg text-left transition ${
                        isSelected ? 'bg-gray-100/80 font-bold text-gray-950' : 'hover:bg-gray-50 text-gray-800'
                      }`}
                    >
                      <span className="text-[13px] font-semibold">{sub}</span>
                      <ChevronRight size={16} className={isSelected ? 'text-gray-900' : 'text-gray-400'} aria-hidden="true" />
                    </button>
                  );
                })}
              </div>

              {/* 선택된 하위 카테고리 실제 상품 결과 영역 */}
              {selectedSub && (
                <div className="mt-6 pt-5 border-t border-gray-200">
                  <div className="flex justify-between items-baseline mb-3">
                    <h3 className="font-extrabold text-sm text-gray-900">
                      '{selectedSub}' 등록 상품
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedSub(null)}
                      className="text-xs text-gray-500 underline hover:text-black"
                    >
                      필터 초기화
                    </button>
                  </div>
                  <ProductCatalog keyword={selectedSub} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3-B. 브랜드 뷰 */}
      {mainTab === 'BRAND' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 scrollbar-hide">
          <div className="flex justify-between items-baseline mb-4">
            <h2 className="font-extrabold text-lg text-gray-950">브랜드별 상품</h2>
            <span className="text-xs text-gray-500 font-semibold">선택: {activeBrand}</span>
          </div>
          
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3 mb-6" role="tablist" aria-label="브랜드 선택">
            {brands.map((brand, i) => (
              <button 
                type="button"
                role="tab"
                aria-selected={activeBrand === brand.name} 
                key={i} 
                onClick={() => setActiveBrand(brand.name)} 
                className="flex flex-col items-center gap-1.5 shrink-0 min-w-[62px] group"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all shadow-xs ${
                  activeBrand === brand.name 
                    ? 'border-2 border-gray-900 bg-gray-900 text-white scale-105' 
                    : 'bg-gray-100 border border-gray-200 group-hover:bg-gray-200'
                }`}>
                  {brand.icon}
                </div>
                <span className={`text-[11px] font-bold transition-colors ${
                  activeBrand === brand.name ? 'text-gray-950' : 'text-gray-600'
                }`}>
                  {brand.name}
                </span>
              </button>
            ))}
          </div>

          <ProductCatalog key={activeBrand} brand={activeBrand} />
        </div>
      )}
    </div>
  );
};