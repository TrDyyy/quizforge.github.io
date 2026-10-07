import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chính sách quyền riêng tư · QuizForge",
  description: "Cách QuizForge xử lý dữ liệu, tài liệu và thông tin tài khoản.",
};

export default function PrivacyPage() {
  return (
    <main className="learning-canvas min-h-dvh px-4 py-10 sm:px-6 sm:py-16">
      <article className="mx-auto max-w-3xl rounded-3xl border border-primary/15 bg-card p-6 shadow-sm sm:p-10">
        <Link href="/" className="text-sm font-semibold text-primary">
          ← QuizForge
        </Link>
        <p className="mt-8 text-sm font-semibold uppercase tracking-[.16em] text-primary">
          Quyền riêng tư
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Chính sách quyền riêng tư
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Cập nhật lần cuối: 07/10/2026
        </p>

        <div className="mt-9 space-y-8 text-[0.98rem] leading-7 text-muted-foreground [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_strong]:text-foreground">
          <section>
            <h2>1. Tổng quan</h2>
            <p>
              QuizForge là công cụ tạo và luyện câu hỏi trắc nghiệm. Chính sách
              này giải thích dữ liệu nào được xử lý khi bạn sử dụng ứng dụng, dữ
              liệu nằm ở đâu và bạn có thể kiểm soát dữ liệu đó như thế nào.
            </p>
          </section>

          <section>
            <h2>2. Dữ liệu được lưu trên thiết bị</h2>
            <p>
              Bộ đề, lịch sử làm bài, tiến độ, ghi chú, câu đánh dấu và lựa chọn
              giao diện được lưu trong trình duyệt của bạn bằng IndexedDB, local
              storage hoặc session storage. Bạn có thể sử dụng phần lớn chức
              năng mà không cần tài khoản.
            </p>
          </section>

          <section>
            <h2>3. File được nhập</h2>
            <p>
              File PDF, DOCX, TXT, Markdown và CSV được đọc trực tiếp trong
              trình duyệt để trích nội dung câu hỏi.{" "}
              <strong>QuizForge không tự động tải file gốc lên máy chủ.</strong>{" "}
              Nếu bạn chủ động dùng chức năng đồng bộ, dữ liệu câu hỏi đã được
              trích và chỉnh sửa có thể được gửi tới Supabase; file nguồn vẫn
              không được tải lên.
            </p>
          </section>

          <section>
            <h2>4. Đăng nhập và tài khoản</h2>
            <p>
              Khi đăng nhập bằng Google hoặc Magic Link, Supabase Auth xử lý
              phiên đăng nhập. QuizForge có thể nhận và lưu mã định danh tài
              khoản, địa chỉ email và thông tin hồ sơ cơ bản do nhà cung cấp
              đăng nhập trả về. QuizForge không nhận mật khẩu Google của bạn.
            </p>
          </section>

          <section>
            <h2>5. Đồng bộ cloud</h2>
            <p>
              Đồng bộ là hành động do bạn chủ động thực hiện. Khi đồng bộ, bộ đề
              riêng, phiên học, tiến độ, ghi chú và dấu trang được lưu trong
              Supabase và gắn với tài khoản của bạn. Chính sách phân quyền của
              cơ sở dữ liệu giới hạn dữ liệu riêng cho đúng chủ tài khoản.
            </p>
          </section>

          <section>
            <h2>6. Bộ đề công khai</h2>
            <p>
              Quản trị viên có thể đăng bộ đề vào thư viện chung. Tên bộ đề, mô
              tả và nội dung câu hỏi được đánh dấu công khai sẽ hiển thị cho mọi
              người, kể cả người chưa đăng nhập. Không đưa thông tin cá nhân, bí
              mật hoặc tài liệu không có quyền chia sẻ vào bộ đề công khai.
            </p>
          </section>

          <section>
            <h2>7. Dịch vụ bên thứ ba</h2>
            <p>
              QuizForge sử dụng GitHub Pages để phân phối ứng dụng, Supabase để
              xác thực và đồng bộ, và Google khi bạn chọn đăng nhập bằng Google.
              Các dịch vụ này có thể xử lý dữ liệu kỹ thuật theo chính sách
              riêng của họ. QuizForge hiện không tích hợp công cụ quảng cáo hoặc
              theo dõi hành vi của bên thứ ba.
            </p>
          </section>

          <section>
            <h2>8. Lưu giữ và xóa dữ liệu</h2>
            <p>
              Bạn có thể xóa bộ đề và dữ liệu liên quan trên thiết bị từ giao
              diện ứng dụng, hoặc xóa dữ liệu trang web trong cài đặt trình
              duyệt. Đăng xuất không tự động xóa dữ liệu local hoặc dữ liệu đã
              đồng bộ. Để yêu cầu xóa tài khoản hoặc dữ liệu cloud, hãy liên hệ
              người duy trì dự án qua repository QuizForge.
            </p>
          </section>

          <section>
            <h2>9. Bảo mật và giới hạn</h2>
            <p>
              QuizForge áp dụng phân quyền Supabase và chỉ sử dụng kết nối HTTPS
              trên môi trường production. Tuy nhiên, không có hệ thống lưu trữ
              hoặc truyền tải nào bảo đảm an toàn tuyệt đối. Bạn chịu trách
              nhiệm bảo vệ thiết bị và tài khoản đăng nhập của mình.
            </p>
          </section>

          <section>
            <h2>10. Thay đổi chính sách</h2>
            <p>
              Chính sách có thể được cập nhật khi tính năng hoặc cách xử lý dữ
              liệu thay đổi. Ngày cập nhật mới nhất sẽ được ghi ở đầu trang.
            </p>
          </section>

          <section>
            <h2>11. Liên hệ</h2>
            <p>
              Bạn có thể đặt câu hỏi hoặc yêu cầu liên quan đến dữ liệu tại{" "}
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
            href="/terms"
            className="font-semibold text-primary hover:underline"
          >
            Điều khoản sử dụng
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
