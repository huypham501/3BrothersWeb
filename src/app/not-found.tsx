import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">404</p>
      <h1 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">Trang không tồn tại</h1>
      <p className="mt-4 max-w-xl text-base text-slate-600">
        Đường dẫn bạn truy cập không hợp lệ hoặc nội dung đã được di chuyển.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Về trang chủ
        </Link>
        <Link
          href="/contact"
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Liên hệ hỗ trợ
        </Link>
      </div>
    </main>
  );
}
