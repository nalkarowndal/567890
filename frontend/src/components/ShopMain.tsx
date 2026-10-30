import { ProductCatalog } from './ProductCatalog';
import { 
  Search, ShoppingCart, Settings, ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// ==========================================
// 커스텀 SVG 아이콘 (브랜드 및 SNS 아이콘)
// ==========================================
const InstagramIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <path d="m10 15 5-3-5-3z"/>
  </svg>
);

export const ShopMain = () => {
  const { setCurrentView, setActiveOverlay, showToast } = useApp();

  return (
    <div className="flex flex-col h-full bg-gray-50 relative pb-28 overflow-y-auto scrollbar-hide w-full">
      
      {/* 🌟 PC 화면 좌측에 고정되는 앱 다운로드 & QR 배너 */}
      <aside aria-label="앱 다운로드 배너" className="hidden xl:flex flex-col fixed left-[calc(50%-520px)] top-1/2 -translate-y-1/2 bg-white border border-gray-200 p-5 rounded-2xl shadow-xl w-64 z-40">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-bold text-xs">LR</div>
          <div>
            <h5 className="font-extrabold text-xs text-gray-900">명품 구매, 렌트, 판매까지</h5>
            <p className="font-black text-sm text-gray-900">럭셔리 (LUXURYRENTAL)</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 p-4 rounded-xl mb-4 text-center">
          <p className="text-xs text-gray-600 font-bold mb-1">럭셔리앱 다운로드하면</p>
          <p className="text-sm font-black text-indigo-600">최대 10만원 더블 할인!</p>
          <div className="my-3 bg-white p-2 rounded-lg shadow-inner inline-block">
            <div className="w-24 h-24 bg-gray-900 text-white rounded flex items-center justify-center text-xs font-bold">
              QR CODE
            </div>
          </div>
        </div>
        <div className="flex justify-around text-xs font-bold text-gray-700">
          <button type="button" onClick={() => showToast('[안내] Google Play 다운로드 페이지 준비 중입니다.')} className="flex items-center gap-1 hover:text-black">
            Google Play
          </button>
          <button type="button" onClick={() => showToast('[안내] App Store 다운로드 페이지 준비 중입니다.')} className="flex items-center gap-1 hover:text-black">
            App Store
          </button>
        </div>
      </aside>

      {/* 1. Header */}
      <header className="sticky top-0 bg-white/95 backdrop-blur-md z-40 px-4 py-3 flex justify-between items-center border-b border-gray-100/80 shadow-2xs">
        <button
          type="button"
          aria-label="LUXURYRENTAL 홈으로 이동"
          onClick={() => setCurrentView('SHOP_MAIN')}
          className="text-xl font-black tracking-tighter text-gray-950 text-left hover:opacity-85 transition"
        >
          LUXURYRENTAL
        </button>
        <div className="flex items-center gap-1.5 text-gray-800">
          <button
            type="button"
            aria-label="상품 검색 열기"
            className="icon-button"
            onClick={() => setActiveOverlay('SEARCH')}
          >
            <Search size={22} aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="장바구니 및 로그인"
            className="icon-button"
            onClick={() => setActiveOverlay('LOGIN')}
          >
            <ShoppingCart size={22} aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="관리자 화면으로 이동"
            onClick={() => setCurrentView('SHOP_ADMIN')}
            className="text-indigo-600 bg-indigo-50/90 hover:bg-indigo-100 p-2 rounded-full transition ml-0.5 active:scale-95"
          >
            <Settings size={20} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* 2. 상단 로그인 인사말 & 간편 로그인 */}
      <section aria-label="로그인 안내 및 서비스 선택" className="p-5 bg-white mb-2 shadow-xs">
        <h2 className="text-xl font-bold text-gray-900 leading-snug mb-4">
          어서오세요, <span className="text-orange-600 font-extrabold">로그인</span> 후<br/>럭셔리렌탈을 이용해보세요
        </h2>
        
        <button 
          type="button"
          onClick={() => setActiveOverlay('LOGIN')} 
          className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl mb-6 shadow-sm transition active:scale-[0.99] flex items-center justify-center gap-1.5"
        >
          <span>간편 로그인하기</span>
          <ChevronRight size={16} aria-hidden="true" />
        </button>

        {/* 렌트하기 / 구매하기 / 판매하기 카드 */}
        <div className="space-y-3 mb-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setActiveOverlay('LOGIN')}
              className="bg-pink-50/70 hover:bg-pink-50/90 border border-pink-100/90 p-4 rounded-2xl flex flex-col justify-between text-left transition-all interactive-card shadow-xs min-h-[148px] group"
            >
              <div>
                <span className="text-[11px] bg-pink-600 text-white font-bold px-2 py-0.5 rounded-md inline-block mb-2 shadow-2xs">
                  첫 렌트 70% 할인
                </span>
                <h3 className="font-black text-gray-900 text-base">렌트하기</h3>
                <p className="text-xs text-gray-500 mt-1 leading-snug">특별한 날,<br/>마음껏 렌트하기</p>
              </div>
              <div className="flex justify-end mt-1">
                <img 
                  src="/assets/illustrations/rental-dress.svg" 
                  alt="렌트 드레스 일러스트" 
                  width="56" 
                  height="56" 
                  className="w-14 h-14 object-contain transition-transform group-hover:scale-105 group-hover:-translate-y-0.5" 
                />
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveOverlay('LOGIN')}
              className="bg-blue-50/70 hover:bg-blue-50/90 border border-blue-100/90 p-4 rounded-2xl flex flex-col justify-between text-left transition-all interactive-card shadow-xs min-h-[148px] group"
            >
              <div>
                <span className="text-[11px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-md inline-block mb-2 shadow-2xs">
                  정품 보증
                </span>
                <h3 className="font-black text-gray-900 text-base">구매하기</h3>
                <p className="text-xs text-gray-500 mt-1 leading-snug">내 마음에 쏙,<br/>지금 바로 구매하기</p>
              </div>
              <div className="flex justify-end mt-1">
                <img 
                  src="/assets/illustrations/purchase-handbag.svg" 
                  alt="구매 가방 일러스트" 
                  width="56" 
                  height="56" 
                  className="w-14 h-14 object-contain transition-transform group-hover:scale-105 group-hover:-translate-y-0.5" 
                />
              </div>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setCurrentView('SHOP_SELL')}
            className="w-full bg-green-50/70 hover:bg-green-50/90 border border-green-100/90 p-4 rounded-2xl flex justify-between items-center text-left transition-all interactive-card shadow-xs group"
          >
            <div>
              <span className="text-[11px] bg-green-700 text-white font-bold px-2 py-0.5 rounded-md inline-block mb-1.5 shadow-2xs">
                간편 위탁
              </span>
              <h3 className="font-black text-gray-900 text-base">판매하기</h3>
              <p className="text-xs text-gray-500 mt-0.5">내 명품, 쉽고 빠르게 판매하기</p>
            </div>
            <div className="pr-1 shrink-0">
              <img 
                src="/assets/illustrations/sell-box.svg" 
                alt="위탁 판매 패키지 일러스트" 
                width="52" 
                height="52" 
                className="w-13 h-13 object-contain transition-transform group-hover:scale-105 group-hover:-translate-y-0.5" 
              />
            </div>
          </button>
        </div>

        {/* 회원가입 이벤트 배너 카드 */}
        <button
          type="button"
          onClick={() => setActiveOverlay('LOGIN')}
          className="w-full bg-gradient-to-r from-gray-900 via-gray-950 to-indigo-950 text-white p-5 rounded-2xl flex justify-between items-center shadow-md mb-6 text-left transition-all hover:shadow-lg interactive-card group"
        >
          <div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-bold tracking-wider backdrop-blur-xs">EVENT</span>
            <h3 className="font-extrabold text-lg mt-1 tracking-tight">회원가입 이벤트</h3>
            <p className="text-xs text-gray-300 mt-0.5">간단하게 가입하고 가볍게 쇼핑!</p>
          </div>
          <div className="w-13 h-13 bg-white/10 rounded-2xl flex items-center justify-center shadow-inner p-1 shrink-0 backdrop-blur-xs group-hover:scale-105 transition-transform" aria-hidden="true">
            <img src="/assets/banners/signup-event.svg" alt="회원가입 이벤트 선물" width="48" height="48" className="w-11 h-11 object-contain" />
          </div>
        </button>

        {/* 럭셔리렌탈만의 서비스 */}
        <h3 className="font-bold text-lg mb-3 text-gray-900">럭셔리렌탈만의 서비스</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => showToast('[안내] 명품 구독하기 서비스 상세 안내가 준비 중입니다.')}
            className="bg-gray-50/80 hover:bg-gray-100 border border-gray-100/80 p-4 rounded-xl text-left transition-all interactive-card"
          >
            <h4 className="font-bold text-gray-900 text-sm">명품 구독하기</h4>
            <p className="text-xs text-gray-500 mt-1">1달 구독료로 무제한 사용</p>
          </button>
          
          <button
            type="button"
            onClick={() => showToast('[안내] 중고명품 구매 서비스 상세 안내가 준비 중입니다.')}
            className="bg-gray-50/80 hover:bg-gray-100 border border-gray-100/80 p-4 rounded-xl text-left transition-all interactive-card"
          >
            <h4 className="font-bold text-gray-900 text-sm">중고명품 구매</h4>
            <p className="text-xs text-gray-500 mt-1">합리적인 명품 소비의 시작</p>
          </button>
        </div>

        {/* 8-Grid 아이콘 메뉴 */}
        <div className="grid grid-cols-4 gap-y-5 gap-x-2 text-center bg-white rounded-2xl shadow-xs border border-gray-100 p-4">
          {[
            { iconUrl: '/assets/shortcuts/rental-guide.svg', title: '렌트 소개' },
            { iconUrl: '/assets/shortcuts/discount.svg', title: '70% 할인' },
            { iconUrl: '/assets/shortcuts/new-arrival.svg', title: '오늘신규입고' },
            { iconUrl: '/assets/shortcuts/membership.svg', title: '베이직멤버십' },
            { iconUrl: '/assets/shortcuts/rental-care.svg', title: '렌트잇 케어' },
            { iconUrl: '/assets/shortcuts/vip.svg', title: 'VIP' },
            { iconUrl: '/assets/shortcuts/buyback.svg', title: '바이백' },
            { iconUrl: '/assets/shortcuts/invite.svg', title: '친구 초대' }
          ].map((menu, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => showToast(`[안내] '${menu.title}' 상세 페이지가 준비 중입니다.`)}
              className="flex flex-col items-center gap-1.5 p-1 rounded-xl hover:bg-gray-50/80 transition active:scale-95 group"
            >
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center p-2 shadow-2xs border border-gray-100/80 group-hover:bg-white group-hover:border-gray-200 transition-all">
                <img 
                  src={menu.iconUrl} 
                  alt="" 
                  width="32" 
                  height="32" 
                  className="w-8 h-8 object-contain transition-transform group-hover:scale-110" 
                />
              </div>
              <span className="text-[11px] font-bold text-gray-800 tracking-tight group-hover:text-gray-950">{menu.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. 가이드 한눈에 */}
      <section aria-label="이용 가이드" className="p-5 bg-white mb-2 shadow-xs">
        <h3 className="font-bold text-lg mb-3 text-gray-900">가이드 한눈에</h3>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => showToast('[가이드] 예약부터 반납까지 30초 안내문이 곧 오픈됩니다.')}
            className="flex-1 bg-white border border-gray-100 hover:border-gray-200 rounded-xl p-4 flex justify-between items-center shadow-xs text-left transition"
          >
            <div>
              <h4 className="font-bold text-sm text-gray-900">렌트 이용 가이드</h4>
              <p className="text-xs text-gray-500 mt-1 leading-snug">예약부터 반납까지<br/>30초 만에 알아보기</p>
            </div>
            <ChevronRight size={16} className="text-gray-400 shrink-0 ml-1" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() => showToast('[가이드] 명품 무제한 교환 가이드가 곧 오픈됩니다.')}
            className="flex-1 bg-white border border-gray-100 hover:border-gray-200 rounded-xl p-4 flex justify-between items-center shadow-xs text-left transition"
          >
            <div>
              <h4 className="font-bold text-sm text-gray-900">구독 가이드</h4>
              <p className="text-xs text-gray-500 mt-1 leading-snug">명품 무제한 교환<br/>30초 만에 알아보기</p>
            </div>
            <ChevronRight size={16} className="text-gray-400 shrink-0 ml-1" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* 4. 지금 둘러볼 상품 */}
      <section aria-label="지금 둘러볼 상품" className="p-5 bg-white mb-2 shadow-xs">
        <h3 className="font-bold text-lg mb-3 text-gray-900">지금 둘러볼 상품</h3>
        <ProductCatalog />
      </section>

      {/* 5. Rent New Arrivals */}
      <section aria-label="신규 렌탈 상품" className="p-5 bg-white mb-2 shadow-xs">
        <h3 className="font-bold text-lg mb-3 text-gray-900">Rent New Arrivals</h3>
        <ProductCatalog rentalOnly />
      </section>

      {/* 6. 전체보기 버튼 & 푸터 */}
      <div className="bg-white p-5 pt-6">
        <button 
          type="button"
          onClick={() => setCurrentView('SHOP_CATEGORY')} 
          className="w-full border border-gray-300 hover:border-gray-800 py-3.5 rounded-xl text-sm font-bold text-gray-800 flex justify-center items-center gap-1 mb-10 transition"
        >
          전체보기 <ChevronRight size={16} aria-hidden="true" />
        </button>

        <footer className="text-xs text-gray-500 border-t border-gray-100 pt-6">
          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6 font-semibold">
            <button type="button" onClick={() => showToast('고객센터: 1588-0000')}>고객센터</button>
            <button type="button" onClick={() => showToast('정책안내 준비 중입니다.')}>정책안내</button>
            <button type="button" onClick={() => showToast('이용약관 준비 중입니다.')}>이용약관</button>
            <button type="button" onClick={() => showToast('개인정보처리방침을 준수합니다.')} className="font-extrabold text-gray-800">개인정보처리방침</button>
            <button type="button" onClick={() => showToast('입점신청 문의 접수 중입니다.')}>입점신청</button>
            <button type="button" onClick={() => showToast('제휴문의 접수 중입니다.')}>제휴문의</button>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <button 
              type="button" 
              onClick={() => showToast('(주)럭셔리 렌탈 | 사업자등록번호: 000-00-00000')} 
              className="flex items-center gap-1 font-bold border border-gray-200 px-2.5 py-1.5 rounded-lg text-xs"
            >
              (주)럭셔리 렌탈 <ChevronRight size={14} className="rotate-90" aria-hidden="true" />
            </button>
            <div className="flex gap-2">
              <button type="button" aria-label="Instagram" onClick={() => showToast('Instagram 공식 채널 연결 준비 중')} className="w-8 h-8 border border-gray-200 rounded-lg flex justify-center items-center hover:bg-gray-50">
                <InstagramIcon size={16} />
              </button>
              <button type="button" aria-label="YouTube" onClick={() => showToast('YouTube 공식 채널 연결 준비 중')} className="w-8 h-8 border border-gray-200 rounded-lg flex justify-center items-center hover:bg-gray-50">
                <YoutubeIcon size={16} />
              </button>
              <button type="button" aria-label="럭셔리 앱" onClick={() => showToast('럭셔리 공식 앱 다운로드 페이지 준비 중')} className="w-8 h-8 border border-gray-200 rounded-lg flex justify-center items-center font-bold text-[10px] hover:bg-gray-50">
                APP
              </button>
            </div>
          </div>

          <div className="space-y-1 mb-4 text-[10px]">
            <p className="font-bold text-gray-700">토스페이먼츠 매매보호(에스크로)서비스</p>
            <p>럭셔리렌탈은 고객님이 현금 결제한 금액에 대해 토스페이먼츠와 매매보호 계약을 체결하여 안전거래를 보장하고 있습니다.</p>
            <p className="flex items-center gap-1 text-gray-600 mt-1 cursor-pointer">서비스 가입 확인 <ChevronRight size={10} aria-hidden="true" /></p>
          </div>
          
          <p className="text-[10px] text-gray-400">© 2011-2026 Luxury CO.,LTD ALL RIGHTS RESERVED.</p>
        </footer>
      </div>

    </div>
  );
};
