import Link from "next/link";

export default function NotFound() {
  return (
    <div className="stack">
      <h1 style={{ margin: 0, fontSize: 22 }}>Not found</h1>
      <p className="muted" style={{ margin: 0, lineHeight: 1.6 }}>
        Trang bạn tìm không tồn tại trong wireframe này.
      </p>
      <div>
        <Link className="chip" href="/">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}

