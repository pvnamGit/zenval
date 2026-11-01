const signals = [
  { label: "Có thể chi an toàn", value: "Chưa có dữ liệu" },
  { label: "Dòng tiền 30 ngày", value: "Chưa cấu hình" },
  { label: "Tài sản ròng", value: "Thêm tài khoản đầu tiên" },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-12 md:px-10">
      <nav className="mb-16 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-[0.18em]">ZENVAL</span>
        <span className="text-sm text-[var(--muted)]">Architecture runway</span>
      </nav>

      <section className="max-w-2xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.16em] text-[var(--accent)]">
          Tổng quan hôm nay
        </p>
        <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
          Bình tĩnh với con số. Rõ ràng trong quyết định.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">
          Bắt đầu bằng một tài khoản để Zenval tạo bức tranh tài chính có nguồn gốc và thời điểm rõ
          ràng.
        </p>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-3" aria-label="Tín hiệu tài chính">
        {signals.map((signal) => (
          <article key={signal.label} className="rounded-2xl bg-[var(--surface)] p-6 shadow-sm">
            <h2 className="text-sm font-medium text-[var(--muted)]">{signal.label}</h2>
            <p className="mt-8 text-xl font-semibold">{signal.value}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
