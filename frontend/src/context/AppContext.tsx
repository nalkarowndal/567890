import React, { useState, createContext, useContext, useCallback, type ReactNode } from 'react';
import type { SearchProduct } from '../lib/productSearch.mjs';

export type ViewState = 'SHOP_MAIN' | 'SHOP_ADMIN' | 'RECRUIT_APP' | 'SHOP_CATEGORY' | 'SHOP_SELL';
export type Role = 'STORE' | 'ADMIN';

export interface RecruitRequest {
  id: number;
  storeName: string;
  date: string;
  section: string;
  time: string;
  breakTime: string;
  required: number;
  hired: number;
  status: '채용중' | '완료';
  partner?: string;
  applicants?: string[];
}

export interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  isMine: boolean;
}

export interface Worker {
  id: number;
  name: string;
  phone: string;
  exp: string;
}

export interface Product {
  id: number;
  title: string;
  brand?: string;
  type: 'RENT' | 'BUY';
  price: number;
}

interface AppContextType {
  currentView: ViewState;
  setCurrentView: React.Dispatch<React.SetStateAction<ViewState>>;
  activeOverlay: 'SEARCH' | 'LOGIN' | null;
  setActiveOverlay: React.Dispatch<React.SetStateAction<'SEARCH' | 'LOGIN' | null>>;
  role: Role;
  setRole: React.Dispatch<React.SetStateAction<Role>>;
  requests: RecruitRequest[];
  setRequests: React.Dispatch<React.SetStateAction<RecruitRequest[]>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  workerDB: Worker[];
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  selectedProduct: SearchProduct | null;
  setSelectedProduct: React.Dispatch<React.SetStateAction<SearchProduct | null>>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentView, setCurrentView] = useState<ViewState>('SHOP_MAIN');
  const [activeOverlay, setActiveOverlay] = useState<'SEARCH' | 'LOGIN' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<SearchProduct | null>(null);
  const [role, setRole] = useState<Role>('STORE');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage(current => (current === msg ? null : current));
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const [requests, setRequests] = useState<RecruitRequest[]>([
    {
      id: 1,
      storeName: '강남본점',
      date: '2026-10-31',
      section: '홀 서빙',
      time: '10:00 - 15:00',
      breakTime: '30분',
      required: 2,
      hired: 1,
      status: '채용중',
      partner: '',
      applicants: ['김철수']
    },
    {
      id: 2,
      storeName: '홍대점',
      date: '2026-11-01',
      section: '카운터',
      time: '12:00 - 20:00',
      breakTime: '60분',
      required: 1,
      hired: 0,
      status: '채용중',
      partner: '김지인'
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: '강남본점', text: '오늘 저녁 구인 급합니다!', time: '10:30 AM', isMine: false }
  ]);

  const [products, setProducts] = useState<Product[]>([]);

  const workerDB: Worker[] = [
    { id: 1, name: '김철수', phone: '010-1234-5678', exp: '홀 1년' },
    { id: 2, name: '이영희', phone: '010-8765-4321', exp: '주방 3년' },
  ];

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        activeOverlay,
        setActiveOverlay,
        role,
        setRole,
        requests,
        setRequests,
        messages,
        setMessages,
        workerDB,
        products,
        setProducts,
        selectedProduct,
        setSelectedProduct,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};