# QuizForge — Tiến độ thực hiện

> Cập nhật lần cuối: 2026-09-15. `plan.md` là tài liệu yêu cầu; file này theo dõi phần đã triển khai.

| Giai đoạn | Trạng thái | Ghi chú |
| --- | --- | --- |
| 1. Nền tảng dự án | Hoàn thành | Next.js, TypeScript, Tailwind, static export |
| 2. Domain models | Đang làm | Đã có Question, QuestionSet, ParseResult |
| 3–7. Parser & test | Đang làm | Có parser MVP cho câu/options/inline/key và automated tests |
| 8–9. Import, preview, editor | Đang làm | Paste/upload/preview và editor cơ bản đã có; cần hoàn thiện option reorder/explanation |
| 10–13. Quiz, kết quả, review | Đang làm | Quiz session thực tế Practice/Exam và score cơ bản đã có |
| 14. Lưu local | Đang làm | Question Set, session, progress và bookmark đã lưu bằng IndexedDB |
| 15. Import/export | Chưa làm | |
| UI study workspace | Đang làm | shadcn/ui, theme/accent và quiz player mẫu đã dựng |
| Cloud sync / auth | Đang làm | Magic Link, schema/RLS và upload sync từ IndexedDB đã sẵn sàng; download/merge chưa nối |

## Đã hoàn thành

- [x] Khởi tạo Next.js + TypeScript + Tailwind.
- [x] Cấu hình static export cho GitHub Pages/static host.
- [x] Cài Dexie, Zustand và Zod.
- [x] Dựng Home và Import UI ban đầu.
- [x] Tạo type nền tảng cho question và parser.
- [x] Bắt đầu module chuẩn hóa input, gồm dash Unicode, Markdown bold và escaped punctuation.
- [x] Thiết lập Vitest và test normalizer đầu tiên.
- [x] Khởi tạo shadcn/ui primitives: Button, Badge, Progress, Sheet, Tabs, Tooltip.
- [x] Thêm light/dark mode, đổi accent runtime và token ngữ nghĩa cho trạng thái quiz.
- [x] Dựng responsive quiz workspace mẫu với Practice/Exam, timer, navigator, progress và bookmark.
- [x] Nối trang Import với parser MVP và summary/warning thực tế.
- [x] Thêm upload TXT/MD/CSV và preview 8 câu đầu sau khi parse.
- [x] Thêm DOCX local-only: trích text trong browser trước khi parse.
- [x] Thêm Preview → Editor flow dùng session browser: sửa câu/lựa chọn/đáp án, thêm/xóa câu.
- [x] Tạo Dexie database/repository và lưu Question Set thật từ editor.
- [x] Nối `/quiz` với Question Set IndexedDB; Practice/Exam, random thứ tự và kết quả cơ bản.
- [x] Thêm `/study`: chọn bộ đề đã lưu, Practice/Exam, thứ tự tuần tự/ngẫu nhiên, khoảng số câu và số câu tối đa.
- [x] Khóa đáp án sau lần chọn đầu tiên; lưu quiz session, đúng/sai và bookmark vào IndexedDB.
- [x] Thêm `/history` với lịch sử phiên học và retry câu sai theo bộ đề.
- [x] Thêm Supabase browser client, Magic Link profile và SQL schema với RLS per-user.
- [x] Thêm one-way cloud sync: Question Set, quiz sessions, progress và bookmark từ thiết bị lên Supabase.

## Việc tiếp theo

- [ ] Hoàn thiện parser question blocks/options/inline answers.
- [ ] Parse answer key cuối file và merge có conflict warning.
- [ ] Viết tests dùng file ngân hàng 240 câu TVU làm fixture.
- [ ] Nối Parse vào preview/editor.
- [ ] Thêm Dexie repositories và quiz engine.
- [ ] Kết nối player với quiz engine/session thật; hoàn thiện review, result analysis, chapter/random filters và retry-wrong flow.
- [ ] PDF text parser và OCR scan (phase hoàn thiện cuối cùng).

## Quy ước kiểm tra

- Mỗi mốc hoàn thành phải chạy `npm run lint` và `npm run build`.
- Parser không tự chọn đáp án khi dữ liệu mơ hồ; thay vào đó phát warning.

## Xác minh hiện tại

- `npm run lint` và `npx tsc --noEmit` đã đạt.
- `npm run build` hiện bị lỗi nội bộ của Next.js 16.3.5/Turbopack trong môi trường này khi PostCSS tạo tiến trình. Cần kiểm tra lại trên máy phát triển/CI trước khi đánh dấu static build hoàn thành.
