import { ChevronLeft, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ShopLike = () => {
  const { activeOverlay, setActiveOverlay, showToast } = useApp();
  
  const isOpen = activeOverlay === 'LOGIN';

  if (!isOpen) return null;

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-label="간편 로그인 화면" 
      onKeyDown={event => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          setActiveOverlay(null);
        }
      }}
      className="absolute inset-0 bg-white z-[110] flex flex-col animate-fadeIn"
    >
      {/* 상단 닫기 헤더 */}
      <header className="px-3 py-3 bg-white border-b border-gray-100 flex items-center justify-between">
        <button 
          type="button"
          aria-label="로그인 화면 닫기" 
          onClick={() => setActiveOverlay(null)} 
          className="icon-button"
        >
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <span className="text-xs text-gray-600 font-bold pr-3">로그인 / 회원가입</span>
      </header>

      {/* 로그인 본문 영역 */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center pt-12 px-6 pb-12 scrollbar-hide text-center">
        <p className="text-gray-500 text-xs font-semibold mb-2">명품을 경험하는 가장 쉬운 방법</p>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tighter mb-8 text-gray-950">
          LUXURYRENTAL
        </h1>

        {/* 첫 렌트 할인 배너 */}
        <div className="relative mb-6 flex flex-col items-center">
          <div className="bg-[#4C51F7] text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm">
            지금 가입하면 첫 렌트 70% 할인!
          </div>
          <div className="w-2.5 h-2.5 bg-[#4C51F7] rotate-45 -mt-1 shadow-xs" aria-hidden="true" />
        </div>

        {/* 주요 소셜 간편 로그인 버튼 */}
        <div className="w-full max-w-xs space-y-3 mb-6">
          <button 
            type="button"
            onClick={() => showToast('[데모] 카카오 간편 로그인 연동 준비 중입니다.')}
            className="w-full bg-[#FEE500] hover:bg-[#ebd300] text-black text-sm font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition active:scale-[0.99]"
          >
            카카오로 3초만에 계속하기
          </button>

          <button 
            type="button"
            onClick={() => showToast('[데모] Apple ID 로그인 연동 준비 중입니다.')}
            className="w-full bg-white hover:bg-gray-50 border border-gray-900 text-black text-sm font-extrabold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition active:scale-[0.99]"
          >
            APPLE로 계속하기
          </button>
        </div>

        {/* 보조 소셜 로그인 아이콘 3종 */}
        <div className="flex gap-4 mb-8" role="group" aria-label="기타 로그인 방식">
          <button 
            type="button"
            aria-label="네이버로 로그인"
            onClick={() => showToast('[데모] 네이버 로그인 연동 준비 중입니다.')}
            className="w-11 h-11 bg-[#03C75A] hover:opacity-90 rounded-full flex items-center justify-center text-white font-black text-lg shadow-xs transition active:scale-95"
          >
            N
          </button>
          <button 
            type="button"
            aria-label="페이코로 로그인"
            onClick={() => showToast('[데모] 페이코 로그인 연동 준비 중입니다.')}
            className="w-11 h-11 bg-[#EA3323] hover:opacity-90 rounded-full flex items-center justify-center text-white font-black text-lg shadow-xs transition active:scale-95"
          >
            P
          </button>
          <button 
            type="button"
            aria-label="이메일로 로그인"
            onClick={() => showToast('[데모] 이메일 로그인 연동 준비 중입니다.')}
            className="w-11 h-11 bg-[#4C51F7] hover:opacity-90 rounded-full flex items-center justify-center text-white shadow-xs transition active:scale-95"
          >
            <Mail size={20} />
          </button>
        </div>

        {/* 계정 찾기 */}
        <p className="text-xs text-gray-500 mb-6">
          계정이 기억나지 않나요?{' '}
          <button 
            type="button"
            onClick={() => showToast('[안내] 계정 및 비밀번호 찾기 기능이 준비 중입니다.')} 
            className="font-bold underline text-gray-800 ml-1 hover:text-black"
          >
            계정 찾기
          </button>
        </p>

        {/* 데모 환경 안내 */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-[11px] text-gray-500 leading-relaxed max-w-xs">
          [데모 안내] 본 화면은 소셜 간편 로그인 및 계정 연동 인터페이스 예시이며, 실제 결제나 회원 정보는 저장되지 않습니다.
        </div>
      </div>
    </div>
  );
};