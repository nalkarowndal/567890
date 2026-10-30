import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Plus, Trash2, CheckCircle, Clock, Users, MessageSquare } from 'lucide-react';

export const ShopAdmin = () => {
  const { 
    setCurrentView, products, setProducts,
    role, setRole, requests, setRequests,
    messages, setMessages, workerDB
  } = useApp();
  const [mainTab, setMainTab] = useState<'SHOP' | 'RECRUIT'>('RECRUIT');
  const [recruitTab, setRecruitTab] = useState<'dashboard' | 'request' | 'workers' | 'chat'>('dashboard');

  // 쇼핑몰 관리 상태
  const [shopFilter, setShopFilter] = useState<'ALL' | 'RENT' | 'BUY'>('ALL');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    title: '',
    brand: '루이비통',
    type: 'RENT' as 'RENT' | 'BUY',
    price: 50000
  });

  // 근무자 검색 필터
  const [workerSearch, setWorkerSearch] = useState('');

  // 글래스모피즘 커스텀 팝업 상태 관리
  const [modal, setModal] = useState<{ isOpen: boolean; title: string; message: string; onConfirm?: () => void }>({
    isOpen: false,
    title: '',
    message: ''
  });

  const showAlert = (title: string, message: string, onConfirm?: () => void) => {
    setModal({ isOpen: true, title, message, onConfirm });
  };

  const closeModal = () => {
    if (modal.onConfirm) modal.onConfirm();
    setModal({ isOpen: false, title: '', message: '' });
  };

  const workers = workerDB;
  const [selectedWorkers, setSelectedWorkers] = useState<number[]>([1, 2]);

  const toggleWorker = (id: number) => {
    setSelectedWorkers(prev => 
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  const toggleSelectAllWorkers = () => {
    if (selectedWorkers.length === workers.length) {
      setSelectedWorkers([]);
    } else {
      setSelectedWorkers(workers.map(w => w.id));
    }
  };

  const [inputMsg, setInputMsg] = useState('');
  const [newReq, setNewReq] = useState({ 
    storeName: '강남본점', 
    date: '2026-11-02', 
    section: '홀 서빙', 
    time: '10:00 - 15:00', 
    breakTime: '30분', 
    required: 1, 
    partner: '' 
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const chatScrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (recruitTab === 'chat' && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [recruitTab, messages]);

  // 쇼핑몰 상품 등록 핸들러
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.title.trim()) {
      showAlert('입력 확인', '상품명을 입력해 주세요.');
      return;
    }
    const newId = Date.now();
    setProducts(prev => [
      ...prev, 
      { 
        id: newId, 
        title: newProductForm.title.trim(), 
        brand: newProductForm.brand, 
        type: newProductForm.type, 
        price: Number(newProductForm.price) 
      }
    ]);
    setIsProductModalOpen(false);
    setNewProductForm({
      title: '',
      brand: '루이비통',
      type: 'RENT',
      price: 50000
    });
    showAlert(
      '상품 등록 완료 (로컬 메모리)', 
      `'${newProductForm.title}' 상품이 등록되었습니다. 현재 로컬 메모리 상태에 반영되었습니다.`
    );
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showAlert('상품 삭제 완료', '선택한 상품이 로컬 목록에서 삭제되었습니다.');
  };

  // 구인 요청 시간 프리셋 설정
  const setTimePreset = (timeStr: string, breakStr: string) => {
    setNewReq(prev => ({
      ...prev,
      time: timeStr,
      breakTime: breakStr
    }));
  };

  // 구인 요청 등록 핸들러 (인라인 에러 검증)
  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!newReq.date) errors.date = '근무 날짜를 선택해 주세요.';
    if (!newReq.time.trim()) errors.time = '출퇴근 시간을 입력해 주세요.';
    if (newReq.required < 1) errors.required = '필요 인원은 최소 1명 이상이어야 합니다.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showAlert('입력 확인', '필수 입력 항목을 다시 확인해 주세요.');
      return;
    }

    setFormErrors({});
    setRequests(prev => [
      ...prev, 
      { id: Date.now(), ...newReq, hired: 0, status: '채용중' }
    ]);
    showAlert(
      '구인 요청 접수 (로컬)', 
      `${newReq.storeName}의 구인 요청이 관리자 시스템에 접수되었습니다.`, 
      () => setRecruitTab('dashboard')
    );
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend ?? inputMsg).trim();
    if (!text) return;
    setMessages(prev => [
      ...prev, 
      { 
        id: Date.now(), 
        sender: role === 'ADMIN' ? '본사 담당자' : '강남본점 매장', 
        text: text, 
        time: '방금', 
        isMine: true 
      }
    ]);
    if (!textToSend) setInputMsg('');
  };

  const filteredProducts = products.filter(p => {
    if (shopFilter === 'ALL') return true;
    return p.type === shopFilter;
  });

  const filteredWorkers = workers.filter(w => 
    w.name.includes(workerSearch.trim()) || 
    w.exp.includes(workerSearch.trim()) ||
    w.phone.includes(workerSearch.trim())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-black text-gray-100 flex flex-col w-full font-sans relative">
      
      {/* 🌟 글래스모피즘 커스텀 팝업 모달 */}
      {modal.isOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
        >
          <div className="backdrop-blur-2xl bg-zinc-900/90 border border-white/20 w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-4 text-white shadow-inner text-xl">
              ✓
            </div>
            <h3 id="modal-title" className="text-lg font-black text-white mb-2">{modal.title}</h3>
            <p className="text-xs text-gray-300 mb-6 leading-relaxed whitespace-pre-line">{modal.message}</p>
            <button 
              type="button"
              onClick={closeModal} 
              className="w-full bg-white text-black hover:bg-gray-200 font-black py-3.5 rounded-xl shadow-xl transition text-sm active:scale-95"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 🌟 신규 상품 등록 폼 모달 */}
      {isProductModalOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
        >
          <div className="backdrop-blur-2xl bg-zinc-900/95 border border-white/20 w-full max-w-lg p-6 sm:p-8 rounded-3xl shadow-2xl text-left">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-black text-white">신규 상품 등록 (로컬)</h3>
              <button 
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">브랜드 *</label>
                <select 
                  value={newProductForm.brand}
                  onChange={e => setNewProductForm({...newProductForm, brand: e.target.value})}
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-sm text-white outline-none focus:border-white/40"
                >
                  {['루이비통', '샤넬', '디올', '구찌', '프라다', '생로랑', '셀린느'].map(b => (
                    <option key={b} value={b} className="bg-zinc-900">{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">상품명 *</label>
                <input 
                  type="text" 
                  value={newProductForm.title}
                  onChange={e => setNewProductForm({...newProductForm, title: e.target.value})}
                  placeholder="예: 모노그램 온더고 MM 토트백"
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-sm text-white outline-none focus:border-white/40 placeholder-gray-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">상품 유형 *</label>
                  <select 
                    value={newProductForm.type}
                    onChange={e => setNewProductForm({...newProductForm, type: e.target.value as 'RENT' | 'BUY'})}
                    className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-sm text-white outline-none focus:border-white/40"
                  >
                    <option value="RENT" className="bg-zinc-900">👗 렌탈 상품 (RENT)</option>
                    <option value="BUY" className="bg-zinc-900">👜 정품 구매 (BUY)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">
                    {newProductForm.type === 'RENT' ? '1일 렌탈료 (원) *' : '판매 가격 (원) *'}
                  </label>
                  <input 
                    type="number"
                    min="1000"
                    step="1000"
                    value={newProductForm.price}
                    onChange={e => setNewProductForm({...newProductForm, price: Number(e.target.value)})}
                    className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-sm text-white outline-none focus:border-white/40 tabular-nums"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl text-xs"
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-white text-black hover:bg-gray-200 font-extrabold py-3 rounded-xl text-xs shadow-lg"
                >
                  등록 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. 최상단 글래스모피즘 헤더 */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-black/60 border-b border-white/10 shadow-xl w-full">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-3.5 flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 shadow-inner text-white text-sm font-extrabold">
              LR
            </div>
            <div>
              <h1 className="font-black text-base sm:text-lg tracking-tight text-white leading-tight">LUXURY RENTAL</h1>
              <p className="text-[11px] text-gray-400 font-medium">통합 관리자 센터</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl backdrop-blur-sm" role="tablist" aria-label="관리자 메인 모드">
              <button 
                type="button"
                role="tab"
                aria-selected={mainTab === 'SHOP'}
                onClick={() => setMainTab('SHOP')} 
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mainTab === 'SHOP' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                쇼핑몰 관리
              </button>
              <button 
                type="button"
                role="tab"
                aria-selected={mainTab === 'RECRUIT'}
                onClick={() => setMainTab('RECRUIT')} 
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  mainTab === 'RECRUIT' ? 'bg-white text-black shadow-md' : 'text-gray-400 hover:text-white'
                }`}
              >
                구인/채용 관리
              </button>
            </div>

            <button 
              type="button"
              onClick={() => setCurrentView('SHOP_MAIN')} 
              className="text-xs bg-white/10 hover:bg-white/20 border border-white/10 text-white px-3.5 py-2 rounded-xl font-bold transition shadow flex items-center gap-1.5 active:scale-95"
            >
              <span>📱</span> 앱으로 돌아가기
            </button>
          </div>
        </div>
      </header>

      {/* 2. 메인 컨텐츠 영역 */}
      <main className="flex-1 w-full max-w-[1800px] mx-auto p-4 sm:p-6 lg:p-12 flex flex-col">
        
        {/* [A] 쇼핑몰 관리 탭 */}
        {mainTab === 'SHOP' && (
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl">
              <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-white">상품 등록 및 카탈로그 관리</h2>
                  <p className="text-xs text-gray-400 mt-1">
                    스토어에 노출되는 렌탈 및 판매 상품을 관리합니다. (등록 시 로컬 메모리에 즉시 추가됩니다)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => setIsProductModalOpen(true)} 
                    className="inline-flex items-center gap-1.5 text-xs bg-white text-black hover:bg-gray-200 px-4 py-2.5 rounded-xl font-extrabold shadow-lg transition active:scale-95"
                  >
                    <Plus size={15} /> 신규 상품 등록 (로컬)
                  </button>
                </div>
              </div>

              {/* 필터 탭 */}
              <div className="flex gap-2 mb-6">
                {(['ALL', 'RENT', 'BUY'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setShopFilter(tab)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      shopFilter === tab 
                        ? 'bg-white text-black border-white' 
                        : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {tab === 'ALL' ? '전체 보기' : tab === 'RENT' ? '👗 렌탈 상품' : '👜 구매 상품'}
                  </button>
                ))}
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-black/20">
                  <p className="text-sm font-semibold text-gray-300">해당 필터에 등록된 상품이 없습니다.</p>
                  <p className="text-xs text-gray-500 mt-1">상단의 '+ 신규 상품 등록' 버튼을 눌러 테스트 상품을 추가해 보세요.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map(p => (
                    <div key={p.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex justify-between items-center backdrop-blur-md hover:border-white/20 transition">
                      <div className="min-w-0 pr-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            p.type === 'RENT' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {p.type === 'RENT' ? '렌트' : '구매'}
                          </span>
                          <span className="text-xs font-bold text-gray-400">{p.brand}</span>
                        </div>
                        <h4 className="font-bold text-white text-sm truncate">{p.title}</h4>
                        <span className="font-black text-white text-sm tabular-nums mt-1 block">
                          {p.price.toLocaleString()}원 {p.type === 'RENT' ? '/ 1일' : ''}
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label={`${p.title} 상품 삭제`}
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 text-gray-400 hover:text-rose-400 hover:bg-white/10 rounded-xl transition shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* [B] 구인/채용 관리 시스템 */}
        {mainTab === 'RECRUIT' && (
          <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-3xl shadow-2xl flex flex-col flex-1 overflow-hidden">
            
            {/* 서브 헤더 및 모드 전환 */}
            <div className="border-b border-white/10 px-6 sm:px-8 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/[0.02]">
              <div>
                <h3 className="font-extrabold text-white text-base sm:text-lg tracking-tight">
                  스마트 구인·채용 관리 시스템
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  메신저 없이 실시간으로 지점 구인과 충원 현황을 조율합니다.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs bg-white/10 text-gray-300 font-semibold px-3 py-1.5 rounded-full border border-white/10">
                  {role === 'STORE' ? '매장 모드 (지점 화면)' : '본사 담당자 모드 (총괄 관리)'}
                </span>
                <button 
                  type="button"
                  onClick={() => setRole(role === 'STORE' ? 'ADMIN' : 'STORE')} 
                  className="text-xs bg-white text-black hover:bg-gray-200 px-3.5 py-1.5 rounded-xl font-black shadow transition active:scale-95"
                >
                  {role === 'STORE' ? '담당자 화면으로 전환' : '매장 화면으로 전환'}
                </button>
              </div>
            </div>

            {/* 네비게이션 탭 */}
            <div className="flex border-b border-white/10 px-4 sm:px-8 gap-2 overflow-x-auto scrollbar-hide bg-white/[0.01]" role="tablist">
              <button 
                type="button"
                role="tab"
                aria-selected={recruitTab === 'dashboard'}
                onClick={() => setRecruitTab('dashboard')} 
                className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all px-2.5 whitespace-nowrap ${
                  recruitTab === 'dashboard' ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                📊 채용 현황 및 접수 리스트
              </button>

              {role === 'STORE' && (
                <button 
                  type="button"
                  role="tab"
                  aria-selected={recruitTab === 'request'}
                  onClick={() => setRecruitTab('request')} 
                  className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all px-2.5 whitespace-nowrap ${
                    recruitTab === 'request' ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  ✍️ 신규 구인 요청 작성
                </button>
              )}

              <button 
                type="button"
                role="tab"
                aria-selected={recruitTab === 'workers'}
                onClick={() => setRecruitTab('workers')} 
                className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all px-2.5 whitespace-nowrap ${
                  recruitTab === 'workers' ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                👥 근무자 DB & 단체 문자
              </button>

              <button 
                type="button"
                role="tab"
                aria-selected={recruitTab === 'chat'}
                onClick={() => setRecruitTab('chat')} 
                className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all px-2.5 whitespace-nowrap ${
                  recruitTab === 'chat' ? 'border-white text-white' : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                💬 실시간 소통 및 채팅
              </button>
            </div>

            {/* 본문 컨텐츠 */}
            <div className="p-4 sm:p-8 lg:p-12 flex-1 overflow-y-auto space-y-6 sm:space-y-8">
              
              {/* 1. 대시보드 탭 */}
              {recruitTab === 'dashboard' && (
                <div className="space-y-6 sm:space-y-8">
                  {role === 'ADMIN' && (
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 backdrop-blur-md">
                      <div>
                        <h4 className="font-bold text-white text-sm">담당자 전용 엑셀 업로드 도구</h4>
                        <p className="text-xs text-gray-400 mt-0.5">엑셀 파일을 일괄 업로드하여 35개 매장의 구인 현황을 실시간 반영합니다.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => showAlert('엑셀 업로드 (데모)', '엑셀 파일(.xlsx) 업로드 시뮬레이션 창입니다. 연동 시 일괄 파싱됩니다.')} 
                        className="bg-white text-black hover:bg-gray-200 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow transition"
                      >
                        엑셀 구인현황 업로드
                      </button>
                    </div>
                  )}

                  {/* 통계 카드 */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                          <Users size={14} className="text-indigo-400" /> 총 구인 요청
                        </span>
                        <p className="text-2xl sm:text-3xl font-black text-white mt-1 tabular-nums">{requests.length} 건</p>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm" />
                    </div>

                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                          <Clock size={14} className="text-amber-400" /> 진행중 (채용중)
                        </span>
                        <p className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 tabular-nums">
                          {requests.filter(r => r.status === '채용중').length} 건
                        </p>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm animate-pulse" />
                    </div>

                    <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-md flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-400 font-semibold flex items-center gap-1.5">
                          <CheckCircle size={14} className="text-emerald-400" /> 충원 완료
                        </span>
                        <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 tabular-nums">
                          {requests.filter(r => r.hired >= r.required).length} 건
                        </p>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
                    </div>
                  </div>

                  {/* 요청 리스트 */}
                  <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl backdrop-blur-md">
                    <h4 className="font-black text-white text-base mb-5 flex items-center gap-2">
                      <span>📋</span> 
                      {role === 'STORE' ? '우리 매장 구인 신청 및 충원 현황 명단' : '전체 35개 매장 구인 요청 접수 리스트'}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {requests.map(req => (
                        <div key={req.id} className="bg-black/30 border border-white/10 p-5 rounded-2xl flex flex-col justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2.5 mb-2">
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {req.status}
                              </span>
                              <span className="font-black text-base text-white">{req.storeName}</span>
                              <span className="text-xs text-gray-400">| {req.section}</span>
                            </div>
                            <p className="text-xs text-gray-300">
                              일정: {req.date} ({req.time} / 휴게 {req.breakTime})
                            </p>
                            {req.partner && (
                              <p className="text-xs text-indigo-300 font-semibold mt-1">
                                지인파트너: {req.partner}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-white/10">
                            <div>
                              <span className="text-xs text-gray-400">충원 인원: </span>
                              <span className="font-black text-sm text-white ml-1 tabular-nums">{req.hired} / {req.required} 명</span>
                            </div>
                            {role === 'ADMIN' ? (
                              <button 
                                type="button"
                                onClick={() => showAlert('채용 결과 등록 (데모)', `${req.storeName} ${req.section} 근무자 채용 결과가 등록되었습니다.`)} 
                                className="bg-white text-black hover:bg-gray-200 text-xs font-black px-3.5 py-1.5 rounded-xl shadow active:scale-95"
                              >
                                채용 결과 등록
                              </button>
                            ) : (
                              <button 
                                type="button"
                                onClick={() => showAlert('TO 변경 요청 완료', '미충원 TO 변경 요청이 본사 담당자에게 전송되었습니다.')} 
                                className="bg-white/10 hover:bg-white/20 border border-white/10 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition active:scale-95"
                              >
                                TO 변경요청
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. 구인 요청 작성 탭 */}
              {recruitTab === 'request' && role === 'STORE' && (
                <div className="bg-white/5 border border-white/10 p-6 sm:p-10 rounded-3xl backdrop-blur-md w-full max-w-4xl">
                  <h4 className="font-black text-white text-xl mb-1">신규 구인 요청 작성</h4>
                  <p className="text-xs text-gray-400 mb-6">
                    날짜, 근무시간, 파트 및 필요 인원을 선택하여 입력하면 담당자 화면에 즉시 접수됩니다. (로컬 접수)
                  </p>
                  
                  <form onSubmit={handleAddRequest} className="space-y-5">
                    <div>
                      <label htmlFor="req-store" className="block text-xs font-bold text-gray-300 mb-1.5">매장 선택 *</label>
                      <select 
                        id="req-store"
                        value={newReq.storeName} 
                        onChange={e => setNewReq({...newReq, storeName: e.target.value})} 
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm font-medium text-white outline-none focus:border-white/30"
                      >
                        <option value="강남본점" className="bg-zinc-900">강남본점</option>
                        <option value="홍대점" className="bg-zinc-900">홍대점</option>
                        <option value="잠실점" className="bg-zinc-900">잠실점</option>
                        <option value="성수점" className="bg-zinc-900">성수점</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="req-date" className="block text-xs font-bold text-gray-300 mb-1.5">근무 날짜 *</label>
                        <input 
                          id="req-date"
                          type="date" 
                          value={newReq.date} 
                          onChange={e => {
                            setNewReq({...newReq, date: e.target.value});
                            if (formErrors.date) setFormErrors({...formErrors, date: ''});
                          }} 
                          className={`w-full bg-black/40 border rounded-xl p-3.5 text-sm text-white outline-none focus:border-white/30 ${
                            formErrors.date ? 'border-rose-500' : 'border-white/10'
                          }`}
                        />
                        {formErrors.date && <p className="text-xs text-rose-400 mt-1">{formErrors.date}</p>}
                      </div>
                      <div>
                        <label htmlFor="req-section" className="block text-xs font-bold text-gray-300 mb-1.5">파트 (섹션) *</label>
                        <select 
                          id="req-section"
                          value={newReq.section} 
                          onChange={e => setNewReq({...newReq, section: e.target.value})} 
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm font-medium text-white outline-none focus:border-white/30"
                        >
                          <option value="홀 서빙" className="bg-zinc-900">홀 서빙</option>
                          <option value="카운터" className="bg-zinc-900">카운터</option>
                          <option value="주방 보조" className="bg-zinc-900">주방 보조</option>
                        </select>
                      </div>
                    </div>

                    {/* 근무 시간대 프리셋 버튼 */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label htmlFor="req-time" className="text-xs font-bold text-gray-300">출퇴근 시간 *</label>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => setTimePreset('10:00 - 15:00', '30분')}
                            className="text-[10px] bg-white/10 hover:bg-white/20 text-gray-200 px-2 py-0.5 rounded-md"
                          >
                            오전 (10~15시)
                          </button>
                          <button
                            type="button"
                            onClick={() => setTimePreset('15:00 - 21:00', '45분')}
                            className="text-[10px] bg-white/10 hover:bg-white/20 text-gray-200 px-2 py-0.5 rounded-md"
                          >
                            오후 (15~21시)
                          </button>
                          <button
                            type="button"
                            onClick={() => setTimePreset('10:00 - 20:00', '60분')}
                            className="text-[10px] bg-white/10 hover:bg-white/20 text-gray-200 px-2 py-0.5 rounded-md"
                          >
                            종일 (10~20시)
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input 
                          id="req-time"
                          type="text" 
                          value={newReq.time} 
                          onChange={e => {
                            setNewReq({...newReq, time: e.target.value});
                            if (formErrors.time) setFormErrors({...formErrors, time: ''});
                          }} 
                          placeholder="예: 10:00 - 15:00" 
                          className={`w-full bg-black/40 border rounded-xl p-3.5 text-sm text-white outline-none placeholder-gray-600 focus:border-white/30 ${
                            formErrors.time ? 'border-rose-500' : 'border-white/10'
                          }`}
                        />
                        <input 
                          id="req-break"
                          type="text" 
                          value={newReq.breakTime} 
                          onChange={e => setNewReq({...newReq, breakTime: e.target.value})} 
                          placeholder="휴게 시간 (예: 30분)" 
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm text-white outline-none placeholder-gray-600 focus:border-white/30" 
                        />
                      </div>
                      {formErrors.time && <p className="text-xs text-rose-400 mt-1">{formErrors.time}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="req-count" className="block text-xs font-bold text-gray-300 mb-1.5">필요 인원 *</label>
                        <input 
                          id="req-count"
                          type="number" 
                          min="1" 
                          value={newReq.required} 
                          onChange={e => {
                            setNewReq({...newReq, required: Number(e.target.value)});
                            if (formErrors.required) setFormErrors({...formErrors, required: ''});
                          }} 
                          className={`w-full bg-black/40 border rounded-xl p-3.5 text-sm text-white outline-none focus:border-white/30 tabular-nums ${
                            formErrors.required ? 'border-rose-500' : 'border-white/10'
                          }`}
                        />
                        {formErrors.required && <p className="text-xs text-rose-400 mt-1">{formErrors.required}</p>}
                      </div>
                      <div>
                        <label htmlFor="req-partner" className="block text-xs font-bold text-gray-300 mb-1.5">지인파트너 등록 (선택)</label>
                        <input 
                          id="req-partner"
                          type="text" 
                          value={newReq.partner} 
                          onChange={e => setNewReq({...newReq, partner: e.target.value})} 
                          placeholder="추천 지인 이름 입력" 
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-3.5 text-sm text-white outline-none placeholder-gray-600 focus:border-white/30" 
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-white text-black hover:bg-gray-200 font-black py-4 rounded-xl shadow-xl transition mt-4 text-sm active:scale-[0.99]"
                    >
                      구인 요청 즉시 등록 및 전송
                    </button>
                  </form>
                </div>
              )}

              {/* 3. 근무자 DB 탭 */}
              {recruitTab === 'workers' && (
                <div className="space-y-6 w-full">
                  <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 backdrop-blur-md">
                    <div>
                      <h4 className="font-bold text-white text-base">근무자 DB 관리</h4>
                      <p className="text-xs text-gray-400">매장별 파트타임 및 상시 근무자 인적사항을 통합 관리합니다.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => showAlert('근무자 등록 (데모)', '신규 근무자 등록 창입니다. 인적사항과 경력을 추가할 수 있습니다.')} 
                      className="bg-white text-black hover:bg-gray-200 text-xs font-black px-4 py-2.5 rounded-xl shadow active:scale-95"
                    >
                      + 근무자 등록
                    </button>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl backdrop-blur-md">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={toggleSelectAllWorkers}
                          className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/10 font-bold"
                        >
                          {selectedWorkers.length === workers.length ? '전체 해제' : '전체 선택'}
                        </button>
                        <h4 className="font-bold text-white text-sm">
                          등록된 근무자 ({workers.length}명 중 <span className="text-amber-400 font-extrabold">{selectedWorkers.length}명</span> 선택됨)
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-48">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                            type="text"
                            placeholder="근무자 검색..."
                            value={workerSearch}
                            onChange={e => setWorkerSearch(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-gray-500 outline-none"
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => showAlert(
                            '단체 알림톡 발송 (데모 시뮬레이션)', 
                            `선택된 ${selectedWorkers.length}명의 근무자에게 채용/출근 안내 문자가 발송되었습니다. (데모 모드)`
                          )} 
                          disabled={selectedWorkers.length === 0}
                          className="bg-white text-black hover:bg-gray-200 disabled:opacity-40 text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow shrink-0 active:scale-95"
                        >
                          선택 대상({selectedWorkers.length}명) 단체 문자 발송
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {filteredWorkers.map(w => (
                        <div 
                          key={w.id} 
                          className={`border p-4 rounded-xl flex justify-between items-center transition ${
                            selectedWorkers.includes(w.id) 
                              ? 'bg-white/10 border-white/30' 
                              : 'bg-black/30 border-white/10'
                          }`}
                        >
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={selectedWorkers.includes(w.id)}
                              onChange={() => toggleWorker(w.id)}
                              className="w-4 h-4 text-white rounded accent-white cursor-pointer" 
                            />
                            <div>
                              <span className="font-bold text-white text-sm">{w.name}</span>
                              <span className="text-xs text-gray-400 ml-2">({w.phone})</span>
                            </div>
                          </label>
                          <span className="text-xs bg-white/10 text-gray-200 font-semibold px-2.5 py-1 rounded-lg">
                            {w.exp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. 실시간 채팅 탭 */}
              {recruitTab === 'chat' && (
                <div className="bg-white/5 border border-white/10 rounded-3xl shadow-2xl flex flex-col h-[600px] w-full backdrop-blur-md overflow-hidden">
                  <div className="p-4 sm:p-5 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
                    <span className="font-extrabold text-sm text-white flex items-center gap-2">
                      <MessageSquare size={16} className="text-indigo-400" />
                      실시간 소통 채널 (구인·결근·지각·조퇴 문의)
                    </span>
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      실시간 연결됨 (로컬 시뮬레이션)
                    </span>
                  </div>

                  {/* 빠른 응답 프리셋 칩 */}
                  <div className="px-4 py-2 bg-white/[0.01] border-b border-white/5 flex gap-2 overflow-x-auto scrollbar-hide">
                    {[
                      '지원자 이력서 확인했습니다.',
                      '금일 매장 충원 완료되었습니다.',
                      '출근 일정 조율 중입니다.'
                    ].map(preset => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleSendMessage(preset)}
                        className="text-[11px] bg-white/5 hover:bg-white/15 text-gray-300 px-3 py-1 rounded-full whitespace-nowrap transition border border-white/5"
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                  
                  <div ref={chatScrollRef} className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-4">
                    {messages.map(m => (
                      <div key={m.id} className={`flex flex-col ${m.isMine ? 'items-end' : 'items-start'}`}>
                        <span className="text-[10px] text-gray-400 mb-1">{m.sender} · {m.time}</span>
                        <div className={`p-3.5 rounded-2xl text-sm max-w-md shadow-lg ${
                          m.isMine ? 'bg-white text-black font-medium rounded-tr-none' : 'bg-white/10 border border-white/10 text-white rounded-tl-none'
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-white/10 bg-white/[0.02] flex gap-2.5">
                    <input 
                      type="text" 
                      value={inputMsg} 
                      onChange={e => setInputMsg(e.target.value)} 
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="메시지를 입력하세요 (예: 강남본점 조퇴 인원 발생 충원 요청)..." 
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none placeholder-gray-500 focus:border-white/30" 
                    />
                    <button 
                      type="button"
                      onClick={() => handleSendMessage()} 
                      className="bg-white text-black hover:bg-gray-200 px-5 py-3 rounded-xl font-black text-xs shadow-lg transition shrink-0 active:scale-95"
                    >
                      전송
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </main>
    </div>
  );
};