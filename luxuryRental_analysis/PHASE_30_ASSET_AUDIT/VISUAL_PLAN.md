# luxuryRental — PHASE 30 그래픽 에셋 구축 및 비주얼 시스템 계획서 (VISUAL PLAN)

## 1. 비주얼 아트 디렉션 (Visual Art Direction)

luxuryRental의 브랜드 정체성인 **"화이트 기반의 미니멀 모바일 럭셔리 룩"**과 **"파스텔톤 서비스 카드"**를 조화롭게 연결하기 위해 다음과 같은 시각 원칙을 적용합니다.

```
+--------------------------------------------------------------------------+
|                        LUXURYRENTAL ART DIRECTION                         |
+--------------------------------------------------------------------------+
|  1. 에디토리얼 미니멀리즘: 불필요한 장식을 배제하고 절제된 선과 면 구성     |
|  2. 시그니처 파스텔 팔레트: 로즈 핑크, 스카이 블루, 세이지 그린 계열 유지   |
|  3. 일관된 광원 & 은은한 입체감: 상단 45도 소프트 라이팅과 미세한 그라디언트|
|  4. 정밀한 벡터 일러스트: 해상도 독립적이며 선명한 SVG 에셋 활용            |
|  5. 중립적 럭셔리 실루엣: 특정 상표 무단 모조 배제, 품격 있는 패션 실루엣   |
+--------------------------------------------------------------------------+
```

---

## 2. 에셋 관리 디렉토리 구조 (Directory Architecture)

`frontend/public/assets/` 내에 다음과 같이 체계적인 분류 구조를 구축합니다.

```text
frontend/public/assets/
├── illustrations/                 # 메인 3대 서비스 일러스트
│   ├── rental-dress.svg           # 렌트하기 (핑크 카드용 럭셔리 드레스)
│   ├── purchase-handbag.svg       # 구매하기 (블루 카드용 럭셔리 핸드백)
│   ├── sell-box.svg               # 판매하기 (그린 카드용 컨사이먼트 패키지 박스)
│   └── membership-card.svg        # 구독 및 멤버십 일러스트
│
├── shortcuts/                     # 메인 8-Grid 바로가기 전용 아이콘
│   ├── rental-guide.svg           # 1. 렌트 소개 (골드 행거)
│   ├── discount.svg               # 2. 70% 할인 (럭셔리 태그 바우처)
│   ├── new-arrival.svg            # 3. 오늘신규입고 (뉴어라이벌 박스)
│   ├── membership.svg             # 4. 베이직멤버십 (엠보싱 VIP 카드)
│   ├── rental-care.svg            # 5. 렌트잇 케어 (프로텍트 쉴드)
│   ├── vip.svg                    # 6. VIP (미니멀 티아라 크라운)
│   ├── buyback.svg                # 7. 바이백 (순환 루프 & 토트)
│   └── invite.svg                 # 8. 친구 초대 (실링 왁스 레터)
│
├── banners/                       # 배너 및 프로모션용 그래픽
│   ├── signup-event.svg           # 회원가입 이벤트 (리본 기프트 박스)
│   └── rental-promotion.svg       # 70% 첫 대여 프로모션 비주얼
│
├── products/                      # 상품 비주얼 시스템
│   └── placeholders/              # 카테고리별 중립 명품 플레이스홀더
│       ├── handbag.svg            # 핸드백 / 가방
│       ├── dress.svg              # 원피스 / 의류
│       ├── watch.svg              # 럭셔리 시계
│       ├── jewelry.svg            # 파인 주얼리 / 목걸이
│       ├── shoes.svg              # 슈즈 / 스니커즈 / 힐
│       ├── wallet.svg             # 지갑 / 카드케이스
│       └── accessories.svg        # 스카프 / 모자 / 패션 소품
│
├── ui/                            # 인터페이스 상태 그래픽
│   ├── empty-search.svg           # 검색 결과 없음
│   ├── empty-wishlist.svg         # 찜한 상품 없음
│   ├── empty-cart.svg             # 장바구니 비어있음
│   └── order-complete.svg         # 신청/결제 완료
│
└── manifest.json                  # 전체 에셋 메타데이터 및 라이선스 매니페스트
```

---

## 3. 에셋 매니페스트 스키마 (`manifest.json`) 규격

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "version": "1.0.0",
  "lastUpdated": "2026-10-30",
  "assets": [
    {
      "id": "illustration-rental-dress",
      "path": "/assets/illustrations/rental-dress.svg",
      "category": "illustration",
      "title": "럭셔리 렌탈 드레스 일러스트",
      "usage": "ShopMain.tsx 렌트하기 카드",
      "format": "image/svg+xml",
      "aspectRatio": "1:1",
      "isSample": true,
      "license": "Custom Proprietary (Zero Trademark Risk)"
    }
  ]
}
```

---

## 4. PHASE 31 ~ 35 상세 개발 로드맵

### [PHASE 31] 이모지 교체 및 프리미엄 그래픽 적용
1. **SVG 그래픽 리소스 13종 제작 및 탑재**:
   - 서비스 카드 3종 (`rental-dress.svg`, `purchase-handbag.svg`, `sell-box.svg`)
   - 바로가기 8종 (`rental-guide.svg`, `discount.svg`, `new-arrival.svg`, `membership.svg`, `rental-care.svg`, `vip.svg`, `buyback.svg`, `invite.svg`)
   - 이벤트 배너 1종 (`signup-event.svg`)
   - 카테고리 큐레이션 3종 (`curation-shoes.svg`, `curation-jewelry.svg`, `curation-coat.svg`)
2. **ShopMain.tsx & ShopCategory.tsx 컴포넌트 리팩터링**:
   - 기존 유니코드 이모지 태그를 깨끗한 `<img>` 및 전용 래퍼로 교체
   - hover/active 마이크로 인터랙션(scale 1.05, 미세 lift) 부여
3. **Playwright 시각 검증**: 변경 전후 캡처 비교 및 이모지 완전 제거 확인

### [PHASE 32] 상품 이미지 및 카탈로그 비주얼 고도화
1. **카테고리별 중립 플레이스홀더 7종 제작**:
   - `handbag.svg`, `dress.svg`, `watch.svg`, `jewelry.svg`, `shoes.svg`, `wallet.svg`, `accessories.svg`
2. **`ProductImage.tsx` 공통 컴포넌트 개발**:
   - 스켈레톤 로딩 shimmer 애니메이션
   - 이미지 로딩 실패 시 자동 카테고리 fallback
   - aspect-ratio 고정 (카탈로그 1:1, 상세 4:3)
3. **카탈로그 & 모달 & 검색 화면 연동**:
   - `ProductCatalog.tsx`, `ProductDetailModal.tsx`, `ShopSearch.tsx`에 `ProductImage` 일괄 적용
4. **관리자 이미지 업로드 & 미리보기 UI (ShopAdmin.tsx)**:
   - 파일 선택(JPG/PNG/WebP), 클라이언트 Object URL 미리보기, 이미지 삭제/교체 기능 탑재

### [PHASE 33] 애니메이션 및 마이크로 인터랙션 고도화
1. **모션 디자인 시스템 구현 (`index.css`)**:
   - 부드러운 스태거 진입 애니메이션 (`@keyframes fadeInUpStagger`)
   - 카드 호버 리프트 & 탭 슬라이더 인디케이터
   - 바텀시트 슬라이드 업 & 딤 페이드
2. **접근성 준수**:
   - `prefers-reduced-motion: reduce` 미디어 쿼리 철저 보장

### [PHASE 34] 팝업·토스트 및 사용자 피드백 시스템
1. **통합 토스트 시스템 (`useApp().showToast`) 고도화**:
   - `success`, `info`, `warning`, `error` 상태 지원 및 디자인 고도화
2. **서비스 안내 모달 & 이벤트 팝업 구현**:
   - 바로가기 클릭 시 실제 서비스 설명 모달 오픈 (렌트 소개, 70% 할인, 멤버십, 케어, 바이백 등)
   - 회원가입 이벤트 팝업 및 관리자 확인 모달 구축

### [PHASE 35] 시각적 완성도 검수 및 최종 통합
1. **다중 뷰포트(6개) 반응형 검증**: 320x568, 375x812, 430x932, 768x1024, 1366x768, 1920x1080
2. **시각적 전후 비교 및 품질 게이트 통과 검증**
3. **최종 분석 보고서 작성 및 ZIP 내보내기**
