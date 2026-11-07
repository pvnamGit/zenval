# Financial data encryption boundary

Yêu cầu của user ngày 07/11/2026: database không lưu raw số tiền, chiều thu/chi,
phân loại giao dịch hoặc nội dung tài chính của transaction, assets, debt/receivable.
Đây là ràng buộc bắt buộc của target architecture. Thiết kế dưới đây chưa được
triển khai; schema hiện tại vẫn lưu plaintext `amount`, `currency`, `event_type`.

## Boundary và đường đi dữ liệu

Một module server-only `FinancialCryptoGateway` trong infrastructure là nơi duy
nhất thực hiện encrypt/decrypt nội dung tài chính. API và worker dùng cùng module,
không tự viết crypto trong controller, domain, SQL function hoặc frontend.

Write: authenticated command → use-case authorization → domain validation bằng
exact Decimal/Money → repository → gateway encrypt → DB ciphertext.
Read: use-case authorization → workspace-scoped repository → gateway decrypt →
domain/application xử lý trong memory → response policy → DTO tối thiểu → UI format.

Gateway chỉ nhận scope đã kiểm tra quyền từ boundary tin cậy, không tin workspace
trong request. Load phải đối chiếu tenant/resource trước giải mã; service jobs có
service actor và purpose cụ thể. Application sở hữu `FinancialResponsePolicyPort`; infrastructure adapter implements port.
Response policy kiểm tra field disclosure theo
actor/purpose cho cả HTTP, export và notification; không serialize domain object
trực tiếp. UI không nhận key và không gọi decrypt trực tiếp.

Chỉ crypto tập trung tại infrastructure; plaintext cần tồn tại tạm trong server
memory cho posting, forecast, reports và response được phép. Đây không phải
end-to-end encryption hay mô hình che dữ liệu khỏi server runtime/KMS principal
đã được cấp quyền. Người chỉ có DB dump/read access không có khóa để đọc payload.

## Phân loại storage

| Dữ liệu                                                                                                                                            | Target storage                                                      |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Amount, sign, currency, income/expense/transfer, event type, category/tag, merchant/counterparty, note, split                                      | Encrypted payload                                                   |
| Account type/name/balance/liquidity, assets, holdings, quantity, cost basis, valuations, debt direction/principal/interest/fees/rates, receivables | Encrypted payload                                                   |
| Commitment/plan/goal values, schedules/due dates, financial status, source details                                                                 | Encrypted payload                                                   |
| Derived balances, reports, forecast/STS, suggestion text/evidence, monthly snapshots                                                               | Encrypted payload, kể cả materialized results                       |
| Financial outbox/inbox payload, import/OCR content, persisted job inputs/results, idempotency responses                                            | Encrypted payload; queue chỉ mang opaque ID                         |
| Receipt/documents, export artifacts, persistent cache/search content                                                                               | Mã hóa qua cùng boundary trước lưu; không lưu plaintext ở temp disk |
| UUID ngẫu nhiên, workspace/owner ID, optimistic version, technical created/updated time, crypto metadata                                           | Plaintext allowlist phục vụ auth/routing/concurrency                |
| Public instrument/provider/market catalog                                                                                                          | Có thể plaintext nếu không gắn vị thế/hoạt động riêng của user      |

Allowlist metadata không chứa tên bảng/routing/event/job/action codes phân biệt
income, expense, payable/receivable hoặc category. Dùng generic financial-record
routing; record kind/business subtype nằm trong ciphertext. Logical domain models
không đồng nghĩa một bảng vật lý cho từng loại nhạy cảm. Opaque relationship IDs,
row count, kích thước và technical timing vẫn có thể lộ access patterns; không hứa
che toàn bộ metadata. Việc thêm bất kỳ plaintext/index field nào phải có review
threat model và quyết định rõ; không tự tạo blind indexes hoặc deterministic
ciphertext cho số tiền, direction hay category.

Audit chỉ để opaque target + generic action; nội dung nhạy cảm được mã hóa. Không
log raw request/response, decrypted values, key, nonce/key material combinations,
financial payload hoặc lỗi provider chứa dữ liệu. Không hash công khai số tiền hay
payload ít entropy để dedup: request fingerprint dùng HMAC keyed, phân tách purpose
và scope; key ngoài DB, có version. Quy tắc replay khi rotate phải được kiểm thử.

## Encrypted envelope và key management

Đề xuất AEAD AES-256-GCM qua thư viện chuẩn, envelope encryption với DEK mới cho
mỗi payload write, KEK do managed KMS giữ. Không lưu plaintext DEK/KEK trong DB,
source, logs hoặc browser. Wrapped DEK được lưu cùng ciphertext.

Envelope gồm `ciphertext`, `nonce`, `auth_tag`, `wrapped_dek`, `kek_key_ref`,
`crypto_version`, `payload_schema_version`. Nonce do CSPRNG tạo; không tái sử dụng
cặp key/nonce. AAD bind workspace ID, record ID, purpose cố định và envelope/schema
version qua encoding canonical. Payload business subtype nằm bên trong ciphertext.
Binding chống chuyển ciphertext sang row/workspace khác; không tự chống replay cả
row cùng version. Concurrency và immutable history phải bảo vệ version tại trusted
application boundary; chống DB rollback độc hại cần external integrity anchor riêng.

KMS unwrap chỉ cho identity của gateway runtime; DB reader/admin role không có
quyền đó. Gateway kiểm tra policy trước unwrap. Rotate KEK qua rewrap DEK và rotate
DEK qua decrypt/re-encrypt trong bounded job; giữ key/version cũ trong thời gian
recovery hợp lệ. Bản backup chỉ có ciphertext; restore cần key/version tương ứng.
Key unavailable, wrong AAD, unknown version hoặc tag failure phải fail closed, trả
lỗi an toàn; tuyệt đối không fallback plaintext, zero amount hay bỏ qua ledger leg.
Không hứa crypto-erasure bằng xóa DB row vì wrapped keys còn trong backup.

## Ledger, query và hiệu năng

Domain entities vẫn dùng exact Money/Decimal trong memory; chỉ representation tại
persistence đổi thành encrypted envelope. Balancing, principal/P&L, reversal,
tenant-safe references, version và lineage giữ nguyên. Ledger application tiếp tục
là nơi duy nhất ghi posted facts, cùng transaction obligation/outbox/idempotency.

DB không SUM, range filter, sort, group-by hoặc CHECK financial contents trực tiếp
trên ciphertext. Quy tắc balance được kiểm tra trong trusted domain/application;
DB chỉ enforce metadata FK/unique/version. Query adapters đọc tập records theo
metadata được phép, decrypt trong scope rồi lọc/tính; pagination/filtering nghiệp vụ
phải xảy ra trên tập đã được giải mã đủ, không lọc từng page rồi coi là kết quả đầy đủ.
Large reports dùng bounded jobs và encrypted projections/snapshots có source IDs,
cutoff và calculation version bên trong payload. Không tạo plaintext read replica,
view, cache hay analytics pipeline để né chi phí giải mã. Cần benchmark trước khi
chốt query/index strategy; không hứa hiệu năng SQL aggregate hiện tại.

## Migration và acceptance trước production

Chưa có migration/code trong thay đổi tài liệu này. Không coi schema hiện tại là
compliant. Rollout cần slice riêng: kiểm kê mọi write/read/side store; encrypted
schema mới; gateway + KMS; backfill trong môi trường kiểm soát; verify exact
round-trip/reports; chuyển writers/readers; xử lý legacy plaintext và backup theo
recovery/retention plan. Không bật financial-user writes cho slice chưa compliant.
Việc loại plaintext cũ/destructive migration phải có phê duyệt human và recovery
plan; không làm trong task PUML này. Không downgrade về raw storage khi gặp lỗi.

Acceptance cần test thực thi trước khi đánh dấu implemented:

- DB dump/driver bind values không có raw amount/sign/type/category/private data;
  kiểm tra cả projections, outbox/jobs, audit, caches, files, temp và logs.
- Exact decimal round-trip, golden transfer/debt/receivable và reports không đổi;
  encrypted aggregate + Ledger + outbox rollback atomic, retry không duplicate.
- Wrong actor/workspace, substituted ciphertext/AAD, tampered tag, truncated payload,
  unknown key/version và KMS outage bị từ chối, không lộ thông tin.
- Nonce/key lifecycle, rotate/rewrap, concurrent update, backup/restore và replay
  idempotency với key versions có bằng chứng.
- API/export/notification chỉ công bố field được phép; worker dùng service scope;
  không có decrypt path ngoài gateway hay key trong client.

## Nguồn thiết kế

- [OWASP Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html): authenticated encryption, storage layer và key separation.
- [Google Cloud KMS envelope encryption](https://docs.cloud.google.com/kms/docs/envelope-encryption): DEK/KEK, wrapped keys và quy trình envelope encryption.

Nguồn này hỗ trợ kỹ thuật crypto; phạm vi bảo vệ dữ liệu là yêu cầu riêng của Zenval.
