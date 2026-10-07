import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng · QuizForge",
  description: "Điều khoản áp dụng khi sử dụng QuizForge.",
};

export default function TermsPage() {
  return (
    <main className="learning-canvas min-h-dvh px-4 py-10 sm:px-6 sm:py-16">
      <article className="mx-auto max-w-3xl rounded-3xl border border-primary/15 bg-card p-6 shadow-sm sm:p-10">
        <Link href="/" className="text-sm font-semibold text-primary">
          ← QuizForge
        </Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[.16em] text-primary">
          Điều khoản
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Điều khoản sử dụng
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Cập nhật lần cuối: 07/10/2026
        </p>

        <div className="mt-9 space-y-8 text-[0.98rem] leading-7 text-muted-foreground [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_strong]:text-foreground">
          <section>
            <h2>1. Chấp nhận điều khoản</h2>
            <p>
              Khi truy cập hoặc sử dụng QuizForge, bạn đồng ý với các điều khoản
              này và{" "}
              <Link
                href="/privacy"
                className="font-semibold text-primary hover:underline"
              >
                Chính sách quyền riêng tư
              </Link>
              . Nếu không đồng ý, bạn nên ngừng sử dụng ứng dụng.
            </p>
          </section>

          <section>
            <h2>2. Mục đích của dịch vụ</h2>
            <p>
              QuizForge hỗ trợ nhập tài liệu, tạo bộ câu hỏi, luyện tập và theo
              dõi tiến độ học. Ứng dụng là công cụ hỗ trợ và không thay thế tài
              liệu chính thức, giáo viên, cố vấn chuyên môn hoặc kết quả đánh
              giá được công nhận.
            </p>
          </section>

          <section>
            <h2>3. Tài khoản</h2>
            <p>
              Bạn có thể đăng nhập bằng Google hoặc Magic Link để sử dụng tính
              năng đồng bộ. Bạn chịu trách nhiệm kiểm soát tài khoản, thiết bị
              và phiên đăng nhập của mình. Không sử dụng tài khoản của người
              khác hoặc tìm cách truy cập dữ liệu không thuộc về bạn.
            </p>
          </section>

          <section>
            <h2>4. Nội dung do người dùng cung cấp</h2>
            <p>
              Bạn giữ quyền đối với tài liệu và bộ đề của mình. Khi nhập, đồng
              bộ hoặc công khai nội dung, bạn xác nhận rằng mình có quyền sử
              dụng nội dung đó và việc sử dụng không vi phạm quyền riêng tư, bản
              quyền hoặc quyền hợp pháp của người khác.
            </p>
          </section>

          <section>
            <h2>5. Bộ đề chung</h2>
            <p>
              Bộ đề được quản trị viên công khai có thể được mọi người truy cập
              và luyện tập. QuizForge có quyền chỉnh sửa trạng thái, gỡ hoặc từ
              chối nội dung vi phạm pháp luật, quyền sở hữu trí tuệ, quyền riêng
              tư hoặc gây hại cho người dùng.
            </p>
          </section>

          <section>
            <h2>6. Sử dụng được phép</h2>
            <p>
              Không sử dụng QuizForge để phát tán mã độc, nội dung bất hợp pháp,
              thông tin cá nhân không được phép, nội dung gian lận hoặc tài liệu
              bạn không có quyền chia sẻ. Không cố gắng phá vỡ phân quyền, làm
              gián đoạn dịch vụ hoặc khai thác hệ thống ngoài mục đích sử dụng
              bình thường.
            </p>
          </section>

          <section>
            <h2>7. Độ chính xác</h2>
            <p>
              Parser PDF, DOCX, CSV và các chức năng nhận dạng có thể đọc sai
              câu hỏi, lựa chọn hoặc đáp án. Bạn cần kiểm tra nội dung trong
              bước preview/editor trước khi sử dụng. QuizForge không bảo đảm mọi
              kết quả parse, đáp án hoặc bộ đề công khai đều chính xác.
            </p>
          </section>

          <section>
            <h2>8. Tính sẵn sàng</h2>
            <p>
              Dịch vụ được cung cấp theo hiện trạng và có thể thay đổi, tạm
              ngừng hoặc gặp lỗi. Các chức năng phụ thuộc trình duyệt, thiết bị,
              GitHub Pages, Supabase, Google và kết nối mạng có thể không luôn
              sẵn sàng.
            </p>
          </section>

          <section>
            <h2>9. Giới hạn trách nhiệm</h2>
            <p>
              Trong phạm vi pháp luật cho phép, người duy trì QuizForge không
              chịu trách nhiệm cho thiệt hại phát sinh từ việc dựa vào nội dung
              câu hỏi, mất dữ liệu local, gián đoạn dịch vụ hoặc sử dụng ứng
              dụng không đúng mục đích. Bạn nên giữ bản sao tài liệu quan trọng.
            </p>
          </section>

          <section>
            <h2>10. Thay đổi điều khoản</h2>
            <p>
              Điều khoản có thể được cập nhật khi sản phẩm thay đổi. Việc tiếp
              tục sử dụng QuizForge sau khi nội dung mới được công bố đồng nghĩa
              với việc bạn chấp nhận phiên bản cập nhật.
            </p>
          </section>

          <section>
            <h2>11. Liên hệ</h2>
            <p>
              Để báo lỗi, báo cáo nội dung hoặc đặt câu hỏi, hãy liên hệ qua{" "}
              <a
                className="font-semibold text-primary hover:underline"
                href="https://github.com/TrDyyy/quizforge.github.io"
                target="_blank"
                rel="noreferrer"
              >
                repository QuizForge trên GitHub
              </a>
              .
            </p>
          </section>
        </div>

        <footer className="mt-10 flex flex-wrap gap-4 border-t border-border pt-6 text-sm">
          <Link
            href="/privacy"
            className="font-semibold text-primary hover:underline"
          >
            Chính sách quyền riêng tư
          </Link>
          <Link
            href="/profile"
            className="font-semibold text-primary hover:underline"
          >
            Đăng nhập
          </Link>
        </footer>
      </article>
    </main>
  );
}
