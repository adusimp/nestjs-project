# Học NESTJS

## 1.Controller

    +Controller trong nestjs chịu trách nhiệm xử lí HTTP request từ client và trả response lại.
    +Mỗi controller có thể chứa nhiều route (GET, POST, PUT, DELETE, v.v.).
    +Decorator @Controller() giúp Nest định tuyến request đến đúng controller.
    *Code sample :

```ts
import { Controller, Get, Post, Body } from "@nestjs/common";

@Controller("cats") // prefix path: /cats
export class CatsController {
  @Get() // GET /cats
  findAll() {
    return "Tất cả mèo";
  }

  @Post() // POST /cats
  create(@Body() body: any) {
    return `Thêm mèo: ${JSON.stringify(body)}`;
  }
}
```

```ts
import { Controller, Get, Post, Body } from "@nestjs/common";

@Controller("cats") // prefix path: /cats
export class CatsController {
  @Get() // GET /cats
  findAll() {
    return "Tất cả mèo";
  }

  @Post() // POST /cats
  create(@Body() body: any) {
    return `Thêm mèo: ${JSON.stringify(body)}`;
  }
}
```

### 1.2. Routing

+Routing là cách liên kết url từ client tới controller
+Được khai báo qua các HTTP method decorator (@GET(),@POST(),...)

### 1.3. Request Object

+Là 1 object chứa toàn bộ thông tin của 1 HTTP request như :
| Thuộc tính | Ý nghĩa  
|---------------|-------------------------------------------------------------------------
| `req.method` | Phương thức HTTP (GET, POST, PUT, DELETE, ...)  
| `req.url` | Đường dẫn URL yêu cầu  
| `req.params` | Các tham số động từ URL (ví dụ `/users/:id`)  
| `req.query` | Query string (ví dụ `?page=1`)  
| `req.body` | Dữ liệu gửi từ client (POST, PUT, PATCH)  
| `req.headers` | Header của request (Authorization, Content-Type, ...)  
| `req.cookies` | Cookie gửi kèm theo (nếu có)  
| `req.ip` | IP của client
\*code sample:

```ts
import { Controller, Get, Req } from "@nestjs/common";
import { Request } from "express";

@Controller("example")
export class ExampleController {
  @Get()
  getInfo(@Req() request: Request) {
    console.log(request.method); // GET
    console.log(request.url); // /example
    console.log(request.query); // nếu có query string
    return "Check console";
  }
}
```

### 1.4. Route Parameter

+Route Parameter cho phép xử lí các đường dẫn động
\*code sample:

```ts
import { Controller, Get, Param } from "@nestjs/common";
@Controller("cats")
export class CatsController {
  @Get(":id")
  findOne(@Param() params: any): string {
    console.log(params.id); // Ví dụ: "1"
    return `This action returns a #${params.id} cat`;
  }
}
```

\*Cách viết gọn:

```ts
@Get(':id')
findOne(@Param('id') id: string): string {
  return `This action returns a #${id} cat`;
}
```

**Lưu ý:Khai báo route parameter nên để sau các route tĩnh**
Ví dụ:

```ts
@Get('search')
searchCats() {
  // xử lý /cats/search
}

@Get(':id') // Đặt sau, để không “bắt nhầm” search thành id
findOne(@Param('id') id: string) {
  return `Cat ${id}`;
}
```

### 1.5. Querry parameters

+Là các tham số nằm sau dấu ? trên url
+ví dụ: GET /users?page=2&limit=10 (page và limit là 2 querry parameter)
\*code sample:

```ts
@Get()
getUsers(@Query() query: any) {
  console.log(query.page);  // "2"
  console.log(query.limit); // "10"
  return `Trang: ${query.page}, Giới hạn: ${query.limit}`;
}
```

```ts
@Get()
getUsers(@Query('page') page: string, @Query('limit') limit: string) {
  return `Trang: ${page}, Giới hạn: ${limit}`;
}
```

**Kết hợp route và querry parameter**

```ts
@Get(':id')
getUser(@Param('id') id: string, @Query('include') include: string) {
  return `User ${id}, include: ${include}`;
}
```

## 2.Providers và Services

+Service là 1 class chứa logic xử lí dữ liệu được dùng bới controller.
\*code sample:

```ts
import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Hello World!";
  }
}
```

+Provider là bất kì class nào mà Nest có thể inject thông qua decorator @Injectable
\*code sample: 1 service

```ts
// app.controller.ts
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello(); // Gọi logic từ AppService
  }
}
```

## 3.Module

+Là 1 class có decorator @Module()
+Mỗi module gồm có:
-Controllers
-Providers
-Import (các module khác)
-Export (chia sẻ cho các module khác )
\*code sample:
src/
├── user/
│ ├── user.module.ts
│ ├── user.controller.ts
│ └── user.service.ts

```ts
// user.module.ts
@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // nếu module khác cần dùng
})
export class UserModule {}
```

## 4.Middleware

+Trong nestjs middleware là một hàm trung gian chạy trước khi request đến controller,thường dùng cho:
-logging
-xác thực đơn giản (non-auth token)
-Ghi log IP, thời gian
-chặn request nếu cần
\*code sample 1: cách tạo 1 middleware

```ts
// logger.middleware.ts
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
  }
}
```

\*code sample 2:Cách áp dụng middleware

```ts
// app.module.ts hoặc any module
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { LoggerMiddleware } from "./logger.middleware";
import { YourController } from "./your.controller";

@Module({
  controllers: [YourController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*"); // forRoutes('*') áp dụng cho tất cả routes
  } // hoặc { path: 'users', method: RequestMethod.GET }
}
```

```ts
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: "cats", method: RequestMethod.GET },
    { path: "cats", method: RequestMethod.POST }, //ko áp dụng middleware cho các route này
    "cats/{*splat}"
  )
  .forRoutes(CatsController);
```

### 4.1. Functional middleware

+Một middleware có thể khai báo dưới dạng function gọi là functional middleware
\*code sample:

```ts
import { Request, Response, NextFunction } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
}
```

```ts
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(logger) //có thể consumer.apply(nhiều middleware)
      .forRoutes("cat");
  }
}
```

**Nếu muốn áp dụng middleware cho tất cả các route thì ta thêm `app.use('middleware');` vào main.ts**

## 5. Exception filter

+Nest hỗ trợ 1 lớp tích hợp exception layer để xử lý tất cả các exception trong app.
+Khi 1 exception chưa được xử lí bởi code của bạn nó sẽ được bắt bởi layer này và sau đó gửi 1 response về cho client.
+ví dụ:

```ts
{
"statusCode": 500,
"message": "Internal server error"
}
```

### 5.1. Exception logging và custom exceptions

+Mặc định exception filter sẽ ko ghi lại các HttpException(sẽ ko ghi lại ở console) nó được hiểu như là 1 luồng bình thường.
+Nếu bạn muốn ghi lại những lỗi này thì phải tạo custom exception filter
\*code sample:

```ts
export class ForbiddenException extends HttpException {
  constructor() {
    super("Forbidden", HttpStatus.FORBIDDEN);
  }
}
```

```ts
@Get()
async findAll() {
  throw new ForbiddenException(); //custom exception
}
```

+custom exception filter:
\*code sample:

```ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

+sau đó đăng kí nơi dùng filter : có thể ở global (đăng kí ở main.ts) hoặc binding filter cho routes cụ thể

```ts
@Post()
@UseFilters( HttpExceptionFilter)// thêm decorator @UseFilter()
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter()); //đăng kí toàn cục
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

+Nên đăng kí bên trong module để cỏ thể inject các dependencies khác

```ts
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```

### 5.2. Built-in exceptions

+Ngoài Httpexception, còn có các class exception dựng sẵn để throw lỗi nhanh hơn tránh truyền httpstatus thủ công.
| Class | Status code | Mô tả |
|----------------------------------|-------------|------------------------------------------------------------|
| `BadRequestException` | 400 | Dữ liệu gửi lên không hợp lệ |
| `UnauthorizedException` | 401 | Không có quyền truy cập |
| `ForbiddenException` | 403 | Có auth nhưng bị cấm |
| `NotFoundException` | 404 | Không tìm thấy tài nguyên |
| `MethodNotAllowedException` | 405 | Không hỗ trợ method này |
| `NotAcceptableException` | 406 | Không chấp nhận định dạng |
| `RequestTimeoutException` | 408 | Request quá lâu |
| `ConflictException` | 409 | Trùng lặp dữ liệu |
| `GoneException` | 410 | Tài nguyên đã bị xoá |
| `PayloadTooLargeException` | 413 | Body quá lớn |
| `UnsupportedMediaTypeException` | 415 | Không hỗ trợ định dạng gửi lên |
| `UnprocessableEntityException` | 422 | Dữ liệu hợp lệ về cú pháp, nhưng không xử lý được |
| `InternalServerErrorException` | 500 | Lỗi server |
| `NotImplementedException` | 501 | Chưa cài chức năng này |
| `BadGatewayException` | 502 | Gateway trả về lỗi |
| `ServiceUnavailableException` | 503 | Service tạm không hoạt động |
| `GatewayTimeoutException` | 504 | Timeout khi gọi service khác |

## 6. Pipes

+Pipes là một class trung gian để biến đổi và kiểm tra dữ liệu đầu vào
+Đảm bảo dữ liệu vào controller luôn đúng định dạng và hợp lệ.

-Các built-in pipes:

+ValidationPipe

+ParseIntPipe

+ParseFloatPipe

+ParseBoolPipe

+ParseArrayPipe

+ParseUUIDPipe

+ParseEnumPipe

+DefaultValuePipe

+ParseFilePipe

+ParseDatePipe

+Để dùng 1 pipe thì ta cần gắn instance của class pipe vào ngữ cảnh thích hợp.ví dụ như 1 route hanler
\*code sample:

```ts
@Get(':id')
getUser(@Param('id', ParseIntPipe) id: number) { // gắn pipe vào route parameter id
  return this.userService.findById(id);
}
```

\*Cơ chế hoạt động của ví dụ trên:
1.Khi một request đến /users/abc, ParseIntPipe sẽ được gọi với value = 'abc'.

2.Pipe cố gắng ép kiểu 'abc' sang number.

3.Nếu ép kiểu thất bại → throw BadRequestException.

4.Nếu thành công → giá trị id truyền vào controller sẽ là number.

### 6.1. Custom pipe

\*code sample:

```ts
import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
```

```ts
export interface ArgumentMetadata {
  type: "body" | "query" | "param" | "custom";
  metatype?: Type<unknown>;
  data?: string;
}
```

### 6.2. Class Validator

+Class-validator là 1 thư viện để xác thực dữ liệu đầu vào thông qua các decorator áp dụng lên các class(DTO)
+Cài đặt :

```bash
npm install class-validator class-transformer
```

\*Code sample : 1 dto class

```ts
// create-user.dto.ts
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

## 7. Guard

+Guard là 1 class được ký hiệu bằng decorator @Injectable() , kế thừa CanActive interface.
+Quyết định 1 request có được xử lí bới route handler hay không .
+So sánh với middleware:
| | **Middleware** | **Guard** |
|-----------------------|-----------------------------------------|--------------------------------------------------|
| **Chạy khi nào** | Trước routing | Sau routing |
| **Biết handler?** | ❌ Không biết route cụ thể | ✅ Biết handler + controller |
| **Dùng để làm gì?** | Sửa request, logging | Chặn request, xác thực, phân quyền |
| **Dừng request?** | Có thể, nhưng không khuyến khích | Có thể dừng request dễ dàng (return `false`) |

\*code sample:

```ts
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

+Từ ví dụ trên ta thấy mỗi guard đều phải implements canActive() function trả về 1 giá trị kiểu boolean.Nếu true ,request sẽ được xử lí , ngược lại Nest sẽ từ chối request đó.

### 7.1. Binding guard

+Giống như pipes và exception filter, guard có thể là dùng ở khối controller , method hoặc global .
\*code sample:

```ts
@Controller("cats")
@UseGuards(RolesGuard) // sử dụng decorator @UseGuards()
export class CatsController {}
```

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard()); // dùng guard ở cấp độ global
```

## 8. Lifecycle events

+Lifecycle events là vòng đời của 1 class(module,controller,provider,guard,...)

## 9. Interceptor

+Can thiệp trước và sau khi request
+Transform dữ liệu response
\*code sample:

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log("Before handler...");
    const now = Date.now();

    return next
      .handle()
      .pipe(tap(() => console.log(`After handler... ${Date.now() - now}ms`)));
  }
}
```

| Tính năng                              | Middleware | Guard | Interceptor |
| -------------------------------------- | ---------- | ----- | ----------- |
| Xử lý trước handler                    | ✅         | ✅    | ✅          |
| Quyết định cho phép hay từ chối        | ❌         | ✅    | ❌          |
| Xử lý sau handler (transform response) | ❌         | ❌    | ✅          |
| Can thiệp stream dữ liệu               | ❌         | ❌    | ✅          |
