# 3bro web (3BROTHERS clone)

Clone trang Home của `3brothers.net` vào Next.js (App Router) để bạn chỉnh sửa.

Hiện tại Home không còn đọc/parsing HTML từ `src/3brothers/*.html` khi chạy runtime nữa — markup đã được generate thành JSX/TSX trong các components (không dùng `dangerouslySetInnerHTML`).

## Requirements

- Node.js 18+ (recommended)

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Sync 3BROTHERS Home

Tải HTML + assets của Home về local:

```bash
npm run sync:3brothers:home
```

Lệnh trên sẽ:
- sync HTML/assets từ `3brothers.net`
- generate các section components trong `src/components/home/sections/*` (JSX/TSX)

Nếu muốn force tải lại tất cả (kể cả file đã tồn tại):

```bash
npm run sync:3brothers:home -- --force
```

Nếu chỉ muốn generate lại file sections (không sync):

```bash
npm run gen:3brothers:home
```

## Files

- `src/app/page.tsx` — render Home
- `src/app/layout.tsx` — include CSS của 3BROTHERS
- `src/components/home/sections/*` — Home sections (generated)
- `src/3brothers/original/home.html` — HTML gốc (tham khảo)
- `src/3brothers/home-body.html` — body HTML đã sync (input để generate)
- `public/metub/template/*` — CSS/JS/fonts/images/video đã mirror
