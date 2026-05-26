# IC3 GS6 Level 2 Web Exam

Website React/Vite làm bài tổng hợp toàn bộ câu hỏi `ic3gs6lv2_` từ Firebase Realtime Database.

## Tính năng

- Không dashboard
- Không đăng nhập
- Không nộp bài
- Không lưu kết quả lên Firebase
- Đọc toàn bộ câu hỏi Level 2 từ Firebase
- Hỗ trợ: single, multi, hotspot, matching, ordering, matrix, fill_blank
- Chấm đúng/sai ngay sau khi hoàn thành từng câu
- Cuối bài hiển thị số câu đúng / tổng số câu
- UI responsive cho máy tính, tablet, điện thoại

## Chạy local

```bash
npm install
npm run dev
```

Mở link Vite hiện ra, thường là `http://localhost:5173/`.

## Firebase Rules bắt buộc

Vì bản này không dùng Anonymous Auth nữa, hãy cho public read riêng node `exams`:

```json
"exams": {
  ".read": true,
  ".write": "auth != null && (auth.token.email === 'hoangsang.nguyen2001a@gmail.com' || root.child('admin_whitelist').child(auth.token.email.replace('.', ',')).exists())"
}
```

Các node khác giữ nguyên.
