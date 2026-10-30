import { useState, useEffect } from 'react';
import { ChevronLeft, X, ShoppingBag, ShieldCheck, Truck, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProductDetailModal = () => {
  const { selectedProduct, setSelectedProduct, showToast } = useApp();
  const [selectedDays, setSelectedDays] = useState<number>(3);
  const [depositAgreement, setDepositAgreement] = useState(true);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedProduct) {
        setSelectedProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProduct, setSelectedProduct]);

  if (!selectedProduct) return null;

  const isRent = selectedProduct.type === 'RENT';
  const unitPrice = selectedProduct.price ?? 50000;
  const totalPrice = unitPrice * selectedDays;

  // 반납 예정일 계산
  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + selectedDays);
  const returnDateString = `${returnDate.getMonth() + 1}월 ${returnDate.getDate()}일`;

  const handleAction = () => {
    if (isRent) {
      showToast(`[데모] '${selectedProduct.title}' ${selectedDays}일 렌탈 예약 시뮬레이션이 완료되었습니다.`);
    } else {
      showToast(`[데모] '${selectedProduct.title}' 바로 구매 주문 시뮬레이션이 완료되었습니다.`);
    }
    setSelectedProduct(null);
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
      className="absolute inset-0 bg-black/60 backdrop-blur-xs z-[120] flex flex-col justify-end animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedProduct(null);
      }}
    >
      <div 
        className="w-full bg-white rounded-t-3xl max-h-[92%] flex flex-col overflow-hidden shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 상단 헤더 */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-10 shrink-0">
          <button 
            type="button"
            aria-label="상품 상세 닫기"
            onClick={() => setSelectedProduct(null)}
            className="p-1.5 -ml-1 text-gray-800 hover:text-black hover:bg-gray-100 rounded-full transition"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-center min-w-0 px-2">
            <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider block">
              {selectedProduct.brand || 'LUXURY'}
            </span>
            <span className="text-xs font-bold text-gray-900 truncate block max-w-[200px]">
              {selectedProduct.title}
            </span>
          </div>
          <button 
            type="button"
            aria-label="닫기"
            onClick={() => setSelectedProduct(null)}
            className="p-1.5 -mr-1 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </header>

        {/* 본문 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-hide space-y-5">
          {/* 상품 이미지 영역 */}
          <div className="aspect-4/3 rounded-2xl bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-xs flex items-center justify-center text-gray-700 mb-2">
              <ShoppingBag size={34} strokeWidth={1.5} />
            </div>
            <span className="text-xs font-black tracking-widest text-gray-400">LUXURY COLLECTION</span>
            <span className={`absolute top-3 left-3 text-xs font-black px-2.5 py-1 rounded-lg shadow-2xs border ${
              isRent 
                ? 'bg-pink-50 text-pink-700 border-pink-200' 
                : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              {isRent ? '👗 명품 렌탈' : '👜 정품 구매'}
            </span>
          </div>

          {/* 기본 상품 정보 */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black text-gray-950 uppercase tracking-tight">
                {selectedProduct.brand || '명품 셀렉션'}
              </span>
              <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-1.5 py-0.5 rounded">
                정품 감정 완료
              </span>
            </div>
            <h2 id="product-detail-title" className="text-base font-extrabold text-gray-950 leading-snug">
              {selectedProduct.title}
            </h2>
          </div>

          {/* 렌탈 조건 및 기간 선택기 (RENT 상품 전용) */}
          {isRent ? (
            <div className="bg-gray-50/80 border border-gray-200/80 rounded-2xl p-4 space-y-4">
              <div className="flex justify-between items-baseline border-b border-gray-200/60 pb-3">
                <span className="text-xs text-gray-600 font-bold">1일 기준 렌탈 요금</span>
                <span className="text-sm font-black text-gray-950 tabular-nums">
                  {unitPrice.toLocaleString('ko-KR')}원
                </span>
              </div>

              {/* 대여 기간 선택 버튼 그룹 */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                    <Clock size={14} className="text-pink-600" />
                    대여 기간 선택
                  </label>
                  <span className="text-[11px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                    {selectedDays}일 대여
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-1.5" role="group" aria-label="렌탈 일수 선택">
                  {[3, 5, 7, 14, 30].map((days) => (
                    <button
                      key={days}
                      type="button"
                      aria-pressed={selectedDays === days}
                      onClick={() => setSelectedDays(days)}
                      className={`py-2 rounded-xl text-xs font-extrabold transition-all border ${
                        selectedDays === days
                          ? 'bg-gray-950 text-white border-gray-950 shadow-xs scale-[1.02]'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {days}일
                    </button>
                  ))}
                </div>
              </div>

              {/* 실시간 요금 계산 및 반납 일정 */}
              <div className="space-y-2 pt-2 border-t border-gray-200/60 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>총 예상 대여 금액 ({unitPrice.toLocaleString()}원 × {selectedDays}일)</span>
                  <span className="font-bold text-gray-950 tabular-nums">
                    {totalPrice.toLocaleString('ko-KR')}원
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>반납 수거 예정일</span>
                  <span className="font-bold text-indigo-600">
                    {returnDateString} (무료 자동 수거)
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>보증금</span>
                  <span className="font-bold text-green-700">
                    0원 (보증금 면제 프로모션)
                  </span>
                </div>
              </div>

              <div className="pt-1 flex items-center gap-1.5 text-[11px] text-gray-500">
                <input 
                  type="checkbox" 
                  id="deposit-agree" 
                  checked={depositAgreement} 
                  onChange={(e) => setDepositAgreement(e.target.checked)}
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <label htmlFor="deposit-agree" className="cursor-pointer">
                  렌트 케어 및 반납 약관에 동의합니다 (자동 수거)
                </label>
              </div>
            </div>
          ) : (
            /* 구매 조건 안내 (BUY 상품 전용) */
            <div className="bg-gray-50/80 border border-gray-200/80 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-baseline border-b border-gray-200/60 pb-3">
                <span className="text-xs text-gray-600 font-bold">판매 가격</span>
                <span className="text-base font-black text-gray-950 tabular-nums">
                  {selectedProduct.price === null ? '가격 문의' : `${selectedProduct.price.toLocaleString('ko-KR')}원`}
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <ShieldCheck size={16} className="text-blue-600 shrink-0" />
                  <span>한국명품감정원 200% 정품 보증서 동봉</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <Truck size={16} className="text-blue-600 shrink-0" />
                  <span>우체국 안심 택배 무료 배송 (당일 발송)</span>
                </div>
              </div>
            </div>
          )}

          {/* 데모 고지문 */}
          <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-3 flex items-start gap-2 text-[11px] text-amber-800 leading-relaxed">
            <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
            <span>
              [데모 안내] 본 화면은 렌탈 기간 선택 및 요금 산출 시뮬레이션 인터페이스이며, 실제 결제나 과금은 발생하지 않습니다.
            </span>
          </div>
        </div>

        {/* 하단 고정 CTA 버튼 바 */}
        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
          <button
            type="button"
            onClick={handleAction}
            className="w-full bg-gray-950 hover:bg-black text-white font-extrabold py-3.5 rounded-2xl shadow-md transition active:scale-[0.985] flex items-center justify-center gap-2 text-sm"
          >
            {isRent ? (
              <span>{selectedDays}일 렌탈 예약하기 ({totalPrice.toLocaleString('ko-KR')}원)</span>
            ) : (
              <span>즉시 구매하기 ({selectedProduct.price?.toLocaleString('ko-KR') ?? '가격 문의'}원)</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
