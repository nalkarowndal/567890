import { StrictMode, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

// 1. 단일 AppContext 및 AppProvider 임포트
import { AppProvider, useApp } from './context/AppContext';

// 2. 컴포넌트 임포트
import { ShopMain } from './components/ShopMain';
import { ShopCategory } from './components/ShopCategory';
import { ShopSell } from './components/ShopSell';
import { ShopAdmin } from './components/ShopAdmin';
import { RecruitApp } from './components/RecruitApp';
import { ShopSearch } from './components/ShopSearch';
import { ShopLike } from './components/ShopLike';
import { BottomNav } from './components/BottomNav';

// 3. 메인 라우터 (관리자 화면은 전체 화면 반응형, 쇼핑몰은 모바일 앱 비율 뷰 적용)
const MainRouter = () => {
  const { currentView, activeOverlay, setActiveOverlay, toastMessage } = useApp();
  const overlayRef = useRef<HTMLDivElement>(null);

  // 오버레이 활성화 시 포커스 트랩 및 ESC 닫기
  useEffect(() => {
    if (!activeOverlay) return;
    const previous = document.activeElement as HTMLElement | null;
    const panel = overlayRef.current;
    const focusable = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('button, input, [tabindex="0"]') ?? []).filter(
        el => !el.hasAttribute('disabled')
      );
    focusable()[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setActiveOverlay(null);
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [activeOverlay, setActiveOverlay]);

  // 관리자 화면일 때는 PC, 태블릿, 모바일 해상도에 맞춰 화면 전체(100%)를 유연하게 활용
  if (currentView === 'SHOP_ADMIN') {
    return (
      <div className="min-h-screen bg-gray-100 w-full flex flex-col">
        <ShopAdmin />
      </div>
    );
  }

  // 쇼핑몰 메인 및 기타 화면일 때는 모바일 앱 뷰(max-w-md) 유지 + 슬라이딩 오버레이 & 하단 고정 내비게이션 지원
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center font-sans text-gray-900">
      <div className="shop-shell w-full max-w-md h-dvh sm:h-[90dvh] bg-white relative flex flex-col overflow-hidden shadow-2xl sm:rounded-2xl">
        
        {/* 토스트 알림 안내 바 */}
        {toastMessage && (
          <div
            role="alert"
            aria-live="polite"
            className="absolute top-4 left-4 right-4 z-[120] bg-gray-900/90 backdrop-blur-md text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-lg text-center animate-fadeIn"
          >
            {toastMessage}
          </div>
        )}

        {/* 메인 콘텐츠 뷰 영역 */}
        <div inert={activeOverlay ? true : undefined} className="flex min-h-0 flex-1 flex-col relative overflow-hidden">
          {currentView === 'SHOP_MAIN' && <ShopMain />}
          {currentView === 'SHOP_CATEGORY' && <ShopCategory />}
          {currentView === 'SHOP_SELL' && <ShopSell />}
          {currentView === 'RECRUIT_APP' && <RecruitApp />}
          
          {/* 고객용 스토어 공통 하단 내비게이션 바 */}
          <BottomNav />
        </div>

        {/* 슬라이딩 오버레이 (검색, 로그인) */}
        <div ref={overlayRef}>
          <ShopSearch />
          <ShopLike />
        </div>
        
      </div>
    </div>
  );
};

createRoot(getElementByIdRoot()).render(
  <StrictMode>
    <AppProvider>
      <MainRouter />
    </AppProvider>
  </StrictMode>
);

function getElementByIdRoot() {
  return document.getElementById('root')!;
}