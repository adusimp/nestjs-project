# Các bước làm bài tập nestjs : Task Management
## 1. Phần Authentication
- Tạo user entity gồm các trường sau:
    - id
    - email
    - password 
    - createdAt
    - updatedAt
- Tạo các dto để validate dữ liệu: SignInDto,RegisterDto.
- Gồm các api sau :
  - POST /auth/login

  - POST /auth/register

  - POST /auth/refresh

- Yêu cầu:
  - Khi gọi auth/register lưu dữ liệu vào bảng user và trả về access token + refresh token, valiate dữ liệu và trả về lỗi khi nhập trùng email.

  - Khi gọi auth/login check email có trong db hay không , nếu không trả về lỗi , nếu có trả về access token + refresh token.

  - Khi gọi auth/refresh nhận refresh token và trả về access token mới.
- Lưu ý : cần có 1 custom guard AuthGuard để đọc và verify token.
## 2. Phần Task management 
- Tạo task entity có các trường sau:
    - id
    - name
    - time
    - description
    - file_path
    - createdAt
    - updatedAt
- Tạo các dto để validate dữ liệu: CreateTaskDto.
- Gồm các api sau: 
    - GET /task
    - POST /task
    - POST /task/:id/upload 
- Yêu cầu:
    - Khi gọi GET /task cần có pagination 
    - Khi gọi POST /task cần có validate kiểu dữ liệu , báo lỗi nhập thiếu trường , kiểu không hợp lệ
    - Khi gọi POST /task/:id/upload cần sử dụng FileInterceptor để ràng buộc kiểu dữ liệu file và dung lượng file, cập nhập đường dẫn vào trường file_path, báo lỗi không tìm thấy task .
    
