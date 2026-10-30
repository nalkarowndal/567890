import { List, Home, Heart, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ShoppingBagNavIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

export const BottomNav = () => {
  const { currentView, setCurrentView, setActiveOverlay } = useApp();

  return (
    <nav aria-label="하단 주요 내비게이션" className="shop-bottom-nav">
      <button
        type="button"
        aria-current={currentView === 'SHOP_CATEGORY' ? 'page' : undefined}
        onClick={() => {
          if (currentView !== 'SHOP_CATEGORY') setCurrentView('SHOP_CATEGORY');
        }}
        className="transition-colors"
      >
        <List size={20} aria-hidden="true" />
        <span>카테고리</span>
      </button>

      <button
        type="button"
        aria-current={currentView === 'SHOP_SELL' ? 'page' : undefined}
        onClick={() => {
          if (currentView !== 'SHOP_SELL') setCurrentView('SHOP_SELL');
        }}
        className="transition-colors"
      >
        <ShoppingBagNavIcon size={20} />
        <span>내 상품 판매</span>
      </button>

      <button
        type="button"
        aria-current={currentView === 'SHOP_MAIN' ? 'page' : undefined}
        onClick={() => {
          if (currentView !== 'SHOP_MAIN') setCurrentView('SHOP_MAIN');
        }}
        className="transition-colors"
      >
        <Home size={20} aria-hidden="true" />
        <span>홈</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveOverlay('LOGIN')}
        className="transition-colors"
      >
        <Heart size={20} aria-hidden="true" />
        <span>좋아요</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveOverlay('LOGIN')}
        className="transition-colors"
      >
        <User size={20} aria-hidden="true" />
        <span>마이페이지</span>
      </button>
    </nav>
  );
};
