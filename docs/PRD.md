# PRD — ZENVAL

| Thuộc tính                  | Giá trị                                                                         |
| --------------------------- | ------------------------------------------------------------------------------- |
| Trạng thái                  | Draft for cross-functional review                                               |
| Phiên bản                   | 1.0                                                                             |
| Ngày                        | 01/11/2026                                                                      |
| Tên sản phẩm                | **ZENVAL**                                                                      |
| Cấu trúc tên                | **Zen** (tĩnh tâm, nhẹ đầu) + **Value** (giá trị tài sản)                       |
| Brand tagline               | **Zenval — Calm numbers. Clear decisions.**                                     |
| Brand clearance             | **Chốt nội bộ; pending trademark/domain clearance trước public launch**         |
| Thị trường đầu tiên         | Việt Nam                                                                        |
| Nền tảng đầu tiên           | Responsive web/PWA                                                              |
| Định hướng tiếp theo        | Mobile native qua API độc lập/native wrapper                                    |
| Tiền tệ gốc mặc định        | VND                                                                             |
| Đối tượng review            | Product, Design, Engineering, Data, Security/Legal                              |
| Tài liệu kỹ thuật liên quan | [Technical Architecture](./TECHNICAL-ARCHITECTURE-personal-finance-platform.md) |
| Nghiên cứu thương hiệu      | [Naming Research](./NAMING-RESEARCH-personal-finance-product.md)                |

> Tài liệu này là product specification, không phải đặc tả triển khai cấp API và chưa cho phép build MVP. Mọi giả định chưa được xác thực được đánh dấu **[Giả định]**; mọi câu hỏi chưa khóa được tập trung ở mục 18.

## 1. Executive summary

### 1.0 Brand identity

**ZENVAL** là tên chính thức của sản phẩm, ghép từ **Zen** và **Value**. Tên thể hiện năng lực cốt lõi: giúp người dùng quản lý toàn bộ giá trị tài chính — thu nhập, chi tiêu, tài khoản, nợ, khoản phải thu, đầu tư và tài sản ròng — trong một trải nghiệm bình tĩnh, rõ ràng, không phán xét và có thể kiểm chứng.

**Tagline chính thức:** _Zenval — Calm numbers. Clear decisions._

Brand name dùng dạng viết hoa `ZENVAL` trong wordmark/brand lockup và dạng `Zenval` trong câu văn, UI, App Store và giao tiếp thông thường. “Calm numbers” mô tả cách Zenval trình bày dữ liệu phức tạp một cách bình tĩnh, dễ hiểu; không có nghĩa hệ thống làm đẹp, che giấu hoặc làm giảm mức độ nghiêm trọng của dữ liệu. “Clear decisions” nhấn mạnh user luôn là người quyết định, không phải automation thay user hành động.

### 1.1 Bối cảnh và cơ hội

Người Việt quản lý tiền qua nhiều nơi: tiền mặt, tài khoản ngân hàng, ví điện tử, tiết kiệm, chứng khoán, vàng, crypto, khoản vay và các khoản cho người quen vay. Các công cụ phổ biến thường chỉ giải quyết ghi chép chi tiêu hoặc đầu tư, khiến người dùng không trả lời được ba câu hỏi cùng lúc:

1. Hôm nay tôi có thể chi bao nhiêu mà vẫn an toàn?
2. Tháng tới tôi có thiếu tiền không?
3. Tài sản ròng của tôi đang thay đổi thế nào và vì sao?

Sản phẩm tạo một mô hình tài chính cá nhân thống nhất, manual-first nhưng integration-ready, để biến dữ liệu phân tán thành bức tranh đúng, kế hoạch thực tế và gợi ý có thể kiểm chứng.

### 1.2 Vision

Trở thành lớp điều hành tài chính cá nhân đáng tin cậy cho người Việt: đủ đơn giản để dùng hằng ngày, đủ đúng để ra quyết định dài hạn, và đủ minh bạch để người dùng luôn giữ quyền kiểm soát.

### 1.3 Ba lời hứa sản phẩm

- **Một bức tranh đúng:** phản ánh tiền, tài sản, nghĩa vụ, khoản phải thu và hiệu suất đầu tư theo các quy tắc kế toán nhất quán.
- **Một kế hoạch thực tế:** thích nghi với thu nhập cố định, biến động, hỗn hợp hoặc theo mùa; cho biết dòng tiền dự kiến và mức chi an toàn.
- **Một gợi ý có thể kiểm chứng:** mỗi suggestion nêu phát hiện, lý do, hành động đề xuất, tác động dự kiến, độ tin cậy và dữ liệu nguồn; không tự động thực thi.

### 1.4 Positioning

**Dành cho cá nhân tại Việt Nam muốn hiểu và chủ động với toàn bộ đời sống tài chính mà không bị áp lực bởi những con số, Zenval là một financial control center biến dữ liệu tiền bạc phức tạp thành một bức tranh bình tĩnh, rõ ràng và thống nhất, giúp biết mức có thể chi hôm nay, rủi ro thiếu tiền tháng tới và thay đổi tài sản ròng — thay vì chỉ là sổ chi tiêu, app đầu tư hoặc công cụ ngân sách cứng.**

**Brand promise:** _Calm numbers. Clear decisions._ — dữ liệu có nguồn, có timestamp, drill-down được và trình bày không phán xét; uncertainty luôn được hiển thị, dự báo không bị trình bày như sự thật đã xảy ra.

### 1.5 Product principles

1. **Correct before clever.** Số liệu và quy tắc kế toán phải đúng trước khi đưa ra insight.
2. **User control by default.** Không tự chuyển tiền, sửa ngân sách, mua/bán, vay, cho vay hay thanh toán.
3. **Explain every consequential number.** Số tổng hợp phải drill-down được về giao dịch, nguồn giá, công thức và timestamp.
4. **Manual-first, integration-ready.** Nhập nhanh, recurring, CSV/Excel và receipt scan trước; banking/broker integration sau.
5. **Progressive disclosure.** Người dùng không bị ép dùng ngân sách, đầu tư, nợ hay tất cả module.
6. **Calm and nonjudgmental.** Không dùng ngôn ngữ gây xấu hổ; phân biệt dữ kiện, dự báo và gợi ý.
7. **Adaptive, not one-size-fits-all.** Không áp một tỷ lệ phân bổ cứng cho mọi người.
8. **Privacy is a feature.** Tối thiểu hóa dữ liệu, export/delete rõ ràng, không yêu cầu mật khẩu ngân hàng, không bán dữ liệu.
9. **Fast capture, deliberate review.** Ghi nhận ngoài luồng thật nhanh; các quyết định quan trọng đi qua inbox/review.
10. **Portable architecture.** Business rules ở backend/domain layer, UI responsive và API độc lập để hỗ trợ native sau này.

### 1.6 Pattern thị trường được hấp thụ có chủ đích

| Pattern          | Cách áp dụng                                                      | Giới hạn                                     |
| ---------------- | ----------------------------------------------------------------- | -------------------------------------------- |
| LCTOS            | North-star financial goal, triết lý vận hành, quick capture       | Không biến onboarding thành khóa học dài     |
| Money Lover/MISA | Wallet, danh mục bản địa hóa, recurring, nhập nhanh, receipt scan | Không đồng nhất transfer với chi tiêu        |
| 6pm              | Daily close, capture inbox, safe-to-spend, tone bình tĩnh         | Không ép ritual hằng ngày                    |
| YNAB             | Give money a job, flexible envelopes, education in-context        | Budgeting là optional, không dùng tỷ lệ cứng |
| Simplifi         | Projected cash flow, future bills, adaptive plan                  | Dự báo luôn hiển thị độ tin cậy              |
| Copilot          | To Review, học từ xác nhận, confidence-aware automation           | Không auto-post rủi ro cao nếu chưa review   |
| Monarch          | Unified net worth, goal gắn dữ liệu thật                          | Không double-count tài sản/tài khoản         |
| PocketGuard      | Debt payoff timeline và what-if                                   | Simulation không được trình bày như cam kết  |
| Sharesight/Delta | Performance đúng, income/fee/corporate action/benchmark           | Không đưa tư vấn đầu tư cá nhân hóa ở MVP    |

## 2. Target users, needs và JTBD

### 2.1 Phân khúc theo nhu cầu/hành vi

Không phân khúc chính theo nghề nghiệp. Một người có thể chuyển nhóm theo giai đoạn sống.

| Segment                       | Đặc điểm                                                                  | Nhu cầu chính                                           | Rào cản                                     |
| ----------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------- |
| Người cần kiểm soát dòng tiền | Nhiều chi nhỏ, nhiều ví/tài khoản; thường không biết còn bao nhiêu để chi | Capture nhanh, future bills, safe-to-spend              | Ngại nhập liệu, dữ liệu rời rạc             |
| Người có thu nhập biến động   | Freelancer, sales, chủ hộ nhỏ, mùa vụ hoặc nhiều nguồn                    | Baseline thận trọng, dự báo theo range, buffer          | Dữ liệu lịch sử ngắn, dòng tiền bất thường  |
| Người đang xử lý nợ           | Có thẻ tín dụng, vay tiêu dùng, vay người thân hoặc nhiều kỳ hạn          | Ưu tiên trả nợ, lịch, overdue, debt-free date           | Dễ nhầm gốc với chi phí; stress             |
| Người có khoản phải thu       | Cho người thân/đối tác vay, tạm ứng, khoản thu khó chắc chắn              | Lịch thu, khả năng thu hồi, estimated recoverable value | Thông tin không chuẩn hóa; nhạy cảm         |
| Người tích lũy/đầu tư         | Có tiết kiệm, vàng, cổ phiếu, quỹ, trái phiếu, crypto                     | Net worth, allocation, performance đúng                 | Giá thị trường và corporate action phức tạp |
| Người muốn mục tiêu dài hạn   | Quỹ dự phòng, mua nhà, học tập, hưu trí                                   | Goal liên kết tiền thật, tiến độ và forecast            | Mục tiêu cạnh tranh nhau                    |
| Người “lightweight”           | Chỉ muốn một bức tranh và cảnh báo cơ bản                                 | Setup tối thiểu, import, dashboard gọn                  | Bị ngợp bởi ngân sách/đầu tư                |

### 2.2 Jobs to be Done

- Khi nhận hoặc chi tiền, tôi muốn ghi nhận trong vài giây để bức tranh không bị lệch mà không làm gián đoạn việc đang làm.
- Khi chuẩn bị chi, tôi muốn biết số tiền an toàn có thể dùng đến kỳ thu tiếp theo để tránh thiếu cho nghĩa vụ thiết yếu.
- Khi thu nhập không đều, tôi muốn kế hoạch phản ánh sự bất định thay vì giả định tháng nào cũng giống nhau.
- Khi vay/cho vay hoặc trả/thu tiền, tôi muốn tách gốc, lãi và phí đúng để thu nhập/chi phí và net worth không sai.
- Khi xem tài sản, tôi muốn biết thay đổi đến từ đóng góp, rút tiền, thu nhập đầu tư hay biến động giá.
- Khi lên mục tiêu, tôi muốn liên kết với tiền/tài khoản thực và hiểu đánh đổi với nợ, thanh khoản và mục tiêu khác.
- Khi hệ thống gợi ý, tôi muốn xem lý do, dữ liệu và tác động để tự quyết định có áp dụng vào kế hoạch hay không.
- Khi kết thúc tháng, tôi muốn xác nhận dữ liệu, giải thích chênh lệch và khóa một snapshot đáng tin cậy.
- Khi rời sản phẩm, tôi muốn tải hoặc xóa dữ liệu mà không bị giữ chân cưỡng ép.

### 2.3 Problem statements

1. Dữ liệu tài chính bị phân mảnh khiến tổng tài sản và nghĩa vụ không đáng tin.
2. Các app expense-only làm sai bức tranh khi coi chuyển khoản, vay/cho vay hoặc hoàn gốc là thu/chi.
3. Kế hoạch dựa trên tháng “trung bình” không phù hợp thu nhập biến động và nghĩa vụ theo thời điểm.
4. Investment tracker thiếu cash-flow attribution, fees, dividends hoặc corporate actions làm performance sai.
5. Advice chung chung hoặc automation không giải thích làm giảm trust và có thể gây hại.
6. Chi phí nhập liệu cao khiến dữ liệu nhanh cũ; automation quá sớm lại tạo sai lệch khó phát hiện.

## 3. Goals, non-goals và success metrics

### 3.1 Product goals (12–18 tháng đầu)

- Tạo được balance sheet cá nhân hợp nhất và có thể đối chiếu.
- Làm daily capture/review đủ nhanh để duy trì dữ liệu hữu dụng.
- Tính safe-to-spend và projected cash flow có nguồn gốc rõ ràng.
- Hỗ trợ đầy đủ payable/receivable và đúng quy tắc gốc–lãi–phí.
- Theo dõi portfolio đa tài sản với performance cơ bản đáng tin.
- Đưa suggestion thích nghi sau khi đủ dữ liệu, có explainability và consent.
- Chuẩn bị nền tảng dữ liệu/API cho mobile native và integrations.

### 3.2 Non-goals

- Không là ngân hàng, ví, broker, đơn vị thanh toán hoặc bên giữ tài sản.
- Không thực hiện chuyển tiền, trả nợ, mua/bán tài sản hay auto-invest.
- Không cung cấp tư vấn đầu tư, thuế, pháp lý hoặc tín dụng được cá nhân hóa như chuyên gia được cấp phép.
- Không bảo đảm lợi nhuận, khả năng thu hồi công nợ hoặc độ chính xác tuyệt đối của dự báo.
- Không xây household/shared finance, kế toán doanh nghiệp, hóa đơn điện tử hoặc payroll trong Phase 1.
- Không bắt mọi người dùng envelope budgeting.
- Không triển khai banking/broker sync trong MVP; chỉ thiết kế contract sẵn sàng tích hợp.
- Không hỗ trợ khai thuế hoặc tối ưu thuế trong ba phase hiện tại.

### 3.3 North-star metric

**Weekly Financial Clarity (WFC):** số người dùng active hàng tuần có dữ liệu “đủ mới và đủ đối chiếu” và đã xem ít nhất hai trong ba tín hiệu cốt lõi: safe-to-spend, projected cash-flow risk, net-worth change explanation.

Một user được tính WFC khi trong 7 ngày:

- ≥80% tài khoản được chọn theo dõi có balance freshness đạt ngưỡng tương ứng (manual: ≤14 ngày; imported/connected sau này: ≤72 giờ), **và**
- inbox không có item critical quá 7 ngày hoặc user đã đánh dấu “review later”, **và**
- xem ≥2 core signals, mỗi signal có drill-down/source khả dụng.

WFC đo “clarity có thể hành động”, không thưởng cho thời gian dùng app dài.

### 3.4 Metrics tree và guardrails

| Nhóm                      | Metric                                                           | Mục tiêu thử nghiệm Phase 1 | Ghi chú                          |
| ------------------------- | ---------------------------------------------------------------- | --------------------------: | -------------------------------- |
| Activation                | Hoàn tất setup tối thiểu + account đầu tiên + 5 giao dịch/import |                        ≥55% | Trong 24 giờ                     |
| Time-to-value             | Median thời gian đến dashboard có net worth/safe-to-spend sơ bộ  |                    <10 phút | Không tính upload processing dài |
| Habit                     | WAU hoàn thành ≥1 capture/review                                 |        ≥45% activated users | Tuần 4                           |
| Data quality              | Tỷ lệ transaction được review/confirmed                          |                        ≥85% | Trong 14 ngày                    |
| Reconciliation            | Tài khoản active được reconcile/tháng                            |                        ≥60% | Với user dùng monthly close      |
| Forecast utility          | User xem forecast rồi cập nhật plan/bill                         |                  ≥20%/tháng | Không tối ưu click vô nghĩa      |
| Suggestion trust          | Helpful/apply-to-plan trên suggestion đủ điều kiện               |                        ≥35% | Theo loại suggestion             |
| Suggestion harm guardrail | “Not relevant/incorrect”                                         |            <25% và giảm dần | Điều tra theo cohort             |
| Retention                 | Activated D30 retained                                           |                        ≥30% | [Giả định] cần benchmark beta    |
| Trust                     | Export success, delete SLA, complaint rate                       |               99%; theo NFR | Guardrail bắt buộc               |
| Correctness               | Critical accounting defects                                      |                 0 open >24h | Có kill switch calculation       |

Không dùng “số giao dịch nhập” hay time-in-app làm north star. Tất cả target là **[Giả định để pilot]**, cần recalibrate sau private beta.

## 4. Phạm vi, giả định và constraints

### 4.1 Giả định đã dùng để viết PRD

- Phase 1 là single-user, một workspace cá nhân, tuổi tối thiểu 18 **[Giả định pháp lý cần xác thực]**.
- Onboarding yêu cầu user tự chọn ngôn ngữ và base currency; không suy diễn hai lựa chọn này từ IP/location. VND chỉ là lựa chọn được gợi ý cho thị trường Việt Nam.
- Manual entry, recurring template và CSV/XLSX import là input chính; OCR receipt là beta/Should.
- Giá tài sản có thể từ provider hoặc manual; số manual luôn được gắn nhãn.
- Safe-to-spend là decision-support, không phải balance khả dụng của ngân hàng.
- Month close tạo snapshot có version; không khóa cứng dữ liệu vĩnh viễn, nhưng chỉnh sửa hồi tố phải để audit và recompute.
- Budget period mặc định theo tháng dương lịch; hỗ trợ payday/custom cycle ở Phase 2.
- Giao diện tiếng Việt trước; cấu trúc i18n, timezone và locale chuẩn bị từ đầu. Theme và timezone ban đầu theo OS/browser; location không tự thu thập hoặc lưu nếu user chưa cấp quyền cho một use case cụ thể.

### 4.2 Constraints

- Dữ liệu Việt Nam có mô tả giao dịch thiếu chuẩn hóa; không phụ thuộc hoàn toàn vào merchant matching.
- API open banking/broker chưa đồng nhất; integration phải theo adapter và consent riêng.
- Market data license/cost khác nhau theo asset; không được ngầm dùng nguồn không có quyền phân phối.
- Độ chính xác forecast bị giới hạn bởi freshness, completeness, volatility và one-off events.

## 5. Information architecture và navigation

### 5.1 IA cấp cao

```text
Home
├── Hôm nay: safe-to-spend, due soon, cash-flow alerts
├── Bức tranh: net worth, assets/liabilities, change explanation
└── Kế hoạch: goals, spending plan, suggestions
Inbox / To Review
Transactions
├── Giao dịch
├── Chi phí cố định, recurring & bills
└── Import history
Accounts
├── Cash / bank / e-wallet
├── Savings / deposits
└── Reconciliation
Investments
├── Portfolios / holdings
├── Activity / corporate actions
└── Performance / allocation
Debts & Receivables
├── Payables
├── Receivables
└── Timeline / simulation
Plan
├── Safe-to-spend / spending plan
├── Goals
├── Forecast
└── Suggestions
Reports
Settings
├── Profile, locale, currency
├── Categories & rules
├── Data sources / import
├── Privacy, export, delete
└── Security & audit log
```

### 5.2 Web navigation

- Desktop: left rail cố định với Home, Inbox, Transactions, Accounts, Plan, Reports; Investments và Debts xuất hiện khi user bật module/có dữ liệu. Global quick-add ở header.
- Tablet: collapsible rail; detail dạng drawer hoặc split view.
- Search toàn cục cho transaction/account/asset/debt; command quick-add hỗ trợ bàn phím.
- Context panel giải thích công thức, nguồn và freshness mà không rời task.

### 5.3 Mobile/PWA/native navigation

- Bottom nav tối đa 5 mục: Home, Transactions, `+`, Plan, More.
- Inbox badge đặt trên Transactions/Home khi có critical review.
- More chứa Accounts, Investments, Debts, Reports, Settings; module thường dùng có thể pin.
- Quick capture hỗ trợ amount-first, recent categories/accounts, duplicate last, offline queue.
- Deep link/shortcut tương lai: “Ghi chi 50k”, capture widget/share sheet; không đặt business logic trong client.

### 5.4 Progressive disclosure

- Onboarding chỉ cần base currency, account đầu tiên, opening balance/date và mục tiêu sử dụng.
- Budget, investment, debt và receivable được giới thiệu theo nhu cầu hoặc khi hệ thống thấy dữ liệu liên quan.
- Advanced fields (FX rate, lot, amortization, recoverability) nằm sau “Chi tiết”.
- Mọi dashboard card có trạng thái: complete, estimated, stale, missing data hoặc not configured.

## 6. Domain/module specifications và business rules

### 6.1 Identity, profile và preferences

- Sau đăng nhập lần đầu, user chủ động chọn **ngôn ngữ** và **base currency**; hệ thống không tự set hai giá trị này từ location/IP. Base currency change có preview và không sửa original amount.
- Theme dùng `prefers-color-scheme` và timezone dùng IANA timezone từ OS/browser làm giá trị hiệu lực ban đầu, không tạo profile preference cho đến khi user override. Location không phải field onboarding và chỉ được xin quyền đúng lúc cho use case đã giải thích.
- Profile preference có thể gồm language, base currency, timezone override, theme override, cycle preference, first day of week và notification preferences; mỗi override có thể “Dùng theo thiết bị”.
- Một user sở hữu một personal workspace Phase 1; mọi entity gắn `workspace_id` để mở rộng household sau này.
- Module opt-in độc lập. Tắt module không xóa dữ liệu.
- Consent được version hóa theo purpose/source; revoke không làm mất quyền export.

### 6.2 Accounts, wallets, cash và savings

**Account types:** cash, bank/payment, e-wallet, savings/deposit, brokerage cash, crypto wallet, loan clearing/other. Mỗi account có currency, opening balance/date, inclusion in net worth, liquidity class, status và source.

**Rules:**

- Balance ledger = opening balance + posted transaction effects đến thời điểm t.
- Displayed current balance có thể là ledger, reconciled hoặc imported balance; phải ghi rõ loại và timestamp.
- Tài khoản cùng bản chất không được tính hai lần, ví dụ brokerage cash vừa là account vừa nằm trong portfolio total.
- Savings transfer không phải expense; lãi tiền gửi là income, phí/tax là expense/withholding theo cấu hình.
- Account archive giữ lịch sử; delete chỉ khi chưa có dependency hoặc qua cascade preview.
- Reconciliation lưu statement date, expected balance, calculated balance, difference và adjustment nếu user xác nhận.

### 6.3 Transactions, income/expense và categories

**Transaction types:** income, expense, transfer, balance adjustment, refund/reversal, debt disbursement/repayment, receivable disbursement/collection, investment activity, fee, interest, tax/withholding.

**Core fields:** occurred_at, posted_at, amount/currency, account, counter-account khi có, category, merchant/payee, note, tags, status, source, confidence, review_state, attachments, recurrence link.

**Rules:**

- Transfer là một business event có hai legs cân bằng; không tác động P&L.
- Vay tiền: tăng cash asset và tăng payable liability; không là income.
- Cho vay: giảm cash và tăng receivable asset; không là expense.
- Trả gốc: giảm cash và giảm payable; không là expense. Interest/fee mới là expense.
- Thu gốc: tăng cash và giảm receivable; không là income. Interest/fee thu được mới là income.
- Refund nên liên kết original expense và giảm net expense của category theo policy, không mặc định là income.
- Credit-card purchase là expense tại ngày mua và tăng card payable; payment card là transfer/repayment principal, không expense lần hai.
- Split transaction cho phép nhiều category, tax/fee/debt components; tổng legs phải cân bằng theo currency và rounding policy.
- Pending không tác động ledger posted nhưng có thể tác động forecast; duplicate detection không auto-delete.
- Imported item confidence thấp đi vào To Review; user confirmation tạo feedback signal.
- Category tree có system defaults bản địa hóa và custom categories; đổi category không làm đổi transaction type ngầm.

### 6.4 Chi phí cố định, recurring transactions, bills và capture inbox

#### 6.4.1 Fixed commitments — các khoản phải dành tiền trước

Sản phẩm phải có một khu vực **Chi phí cố định/Cam kết hàng tháng** để user chủ động cấu hình những khoản gần như không đổi và cần được giữ tiền trước, ví dụ: tiền thuê nhà, phí quản lý, học phí, bảo hiểm, internet, thuê bao, tiền gửi gia đình và khoản thanh toán ngân hàng. Đây là input trực tiếp cho projected cash flow và safe-to-spend, không chỉ là một giao dịch được lặp lại.

**Fields cấu hình:**

- Tên khoản, loại `fixed expense` / `debt installment` / `transfer-to-own-account` / `saving contribution`.
- Số tiền chuẩn; currency; mức biến động cho phép theo amount hoặc %; optional minimum/maximum.
- Tần suất: tuần, tháng, quý, năm hoặc custom; ngày đến hạn; quy tắc cho ngày không tồn tại/cuối tuần/ngày lễ.
- Ngày bắt đầu/kết thúc; account thanh toán; category; payee; essential/non-essential; priority.
- Cách xử lý: reminder only, tạo expected transaction, hoặc auto-match với giao dịch thực tế. Phase 1 không tự post hoặc thanh toán.
- Lead time nhắc hạn; nguồn cấu hình `user/import/detected`; trạng thái active/paused/ended.
- Với khoản trả ngân hàng: liên kết bắt buộc/được khuyến nghị tới `payable obligation` và installment để tách **gốc–lãi–phí**; không ghi toàn bộ thành expense.

**Rules và UX:**

- Setup dạng danh sách theo tháng, hiển thị `Tổng cam kết`, `Đã thanh toán`, `Sắp đến hạn`, `Còn phải dành`, và tác động lên safe-to-spend.
- User có thể `Bỏ qua kỳ này`, `Đổi riêng kỳ này`, `Đổi từ kỳ này trở đi`, `Tạm dừng` hoặc `Kết thúc`; hệ thống phải giữ lịch sử phiên bản.
- Mỗi actual transaction chỉ được match với tối đa một expected occurrence; một occurrence có thể được thanh toán bằng nhiều actual transactions nếu user xác nhận. Matching dựa trên account/payee/date/amount tolerance và luôn cho phép undo.
- Nếu actual amount nằm trong tolerance, kỳ được đánh dấu paid và forecast thay expected bằng actual. Nếu ngoài tolerance, item vào To Review; không âm thầm thay template.
- Nếu đến hạn chưa có actual match, trạng thái chuyển due/overdue theo grace period và vẫn được giữ trong forecast cho đến khi user pay/skip/reschedule.
- Fixed commitment không đồng nghĩa expense: chuyển vào tài khoản tiết kiệm của chính user là transfer/allocation; trả khoản vay phải split principal/interest/fee; chỉ tiền thuê/dịch vụ tiêu dùng mới là expense theo bản chất.
- Hệ thống có thể phát hiện một chuỗi giao dịch giống nhau và **đề xuất** tạo fixed commitment sau tối thiểu 2–3 occurrences; user phải xác nhận amount, due date, type và scope trước khi tạo.
- Month baseline = tổng fixed expenses + minimum debt installments + essential variable commitments theo conservative amount. Baseline được hiển thị tách khỏi flexible spending.

#### 6.4.2 Recurring, bills và capture inbox

- Recurring rule hỗ trợ amount cố định/range, cadence, start/end, next occurrence, account/category, auto-create policy.
- `Fixed commitment` là recurring rule có reservation/priority semantics; recurring income hoặc giao dịch tham khảo không mặc định là commitment.
- Phase 1 chỉ “create as expected/pending” hoặc reminder; không auto-post nếu amount biến động hay confidence thấp.
- Capture inbox nhận quick entry, import rows, OCR draft, duplicate candidates và uncategorized items.
- Review batch cho phép approve, edit, split, merge transfer pair, link debt/investment/fixed commitment và create rule.
- Daily close là optional ritual: xử lý critical inbox, xác nhận today balance signal và xem tomorrow obligations; hoàn thành dưới 2 phút với dữ liệu bình thường.

### 6.5 Spending plan, safe-to-spend và cash-flow forecast

**Spending plan:** optional, hỗ trợ fixed commitments, flexible envelopes, goals và buffers. User có thể plan category-level hoặc chỉ aggregate.

User có thể tạo và version hóa một **allocation policy** cá nhân gồm tỷ lệ/amount cho `needs`, `wants`, `saving`, `investing`, `debt extra` và custom bucket. Không có tỷ lệ bắt buộc toàn hệ thống. Tổng các bucket percentage-based phải bằng 100%; bucket amount-based được kiểm tra không vượt nguồn phân bổ. Template phổ biến chỉ là điểm bắt đầu có thể sửa, reset hoặc bỏ qua.

Fixed commitments đã active được nạp tự động vào plan/forecast theo occurrence và priority. User có thể exclude một occurrence hoặc đổi scenario, nhưng UI phải cảnh báo nếu thao tác này làm nghĩa vụ tối thiểu biến mất khỏi conservative forecast.

**Safe-to-spend (STS):** số ước tính có thể chi cho discretionary spending trong horizon mà không chạm các khoản đã dành riêng.

```text
STS = eligible liquid cash
    + conservative expected inflows within horizon
    - essential/committed outflows within horizon
    - reserved goal contributions due within horizon
    - minimum debt payments due
    - minimum cash buffer
    - already-spent discretionary amount not yet reflected
```

- Horizon mặc định đến kỳ thu nhập đáng tin cậy kế tiếp hoặc 30 ngày nếu không xác định; user thấy được horizon.
- Expected inflow được haircut theo confidence; receivable không chắc chắn không tự động tính 100%.
- STS âm hiển thị shortfall và drivers, không dùng thông điệp phán xét.
- Mọi component drill-down được; user có thể exclude/include và hệ thống ghi audit.
- Forecast hiển thị base, conservative và optimistic range khi thu nhập biến động; không chỉ một con số giả chính xác.
- One-off plan override không sửa lịch sử và có expiry.

**Công thức projected cash flow (daily closing balance):**

```text
projected_balance[d] = projected_balance[d-1]
  + sum(weighted_expected_inflows occurring on d)
  - sum(expected_cash_outflows occurring on d)

weighted_expected_inflow[i] = amount[i] × confidence_weight[i, scenario]
expected_cash_outflow[o] = committed_amount[o] + scenario_adjustment[o]
```

- `projected_balance[d0]` lấy từ closing available cash đã posted/reconciled tại `as_of`; pending bank item chỉ được cộng/trừ một lần theo dedup policy.
- Base dùng expected occurrence hiện hành và confidence từ nguồn/lịch sử; conservative giảm inflow không chắc chắn, dùng upper bound của variable essential outflow và loại receivable chưa đủ confidence; optimistic chỉ thêm inflow có evidence, không tự giả định lợi nhuận thị trường.
- Dự báo **chi phí category** dùng hierarchy: scheduled/committed amount → user-entered plan → robust historical estimate. Historical estimate mặc định là median của tối đa 3–6 chu kỳ hoàn chỉnh gần nhất, loại transfer/principal/refund duplicate; category mùa vụ hoặc one-off không được extrapolate nếu chưa có rule. Khi dữ liệu ít hơn 2 chu kỳ, hiển thị “chưa đủ dữ liệu” hoặc range rộng thay vì số điểm.
- Range chi phí dùng empirical quantile khi đủ dữ liệu (`P25/P50/P75` theo scenario); nếu chưa đủ, dùng user tolerance/range. Không dùng average đơn giản khi outlier làm sai ý nghĩa.
- Mỗi run lưu `as_of`, horizon, timezone, scenario, input/source IDs, confidence weights, assumption overrides và `calculation_version`; thay đổi transaction, commitment, goal allocation hoặc plan policy phải invalidate/recompute idempotently.
- Không tự đưa unrealized investment gain vào cash forecast. FX/market-price movement chỉ ảnh hưởng valuation scenario riêng, không tạo cash inflow.

### 6.6 Goals

- Goal types: emergency fund, purchase, debt payoff, education, home, retirement/custom.
- Fields: target amount/currency/date, priority, linked accounts/holdings, contribution plan, allowed overlap, status.
- Một số tiền không được tính 100% cho nhiều goal trừ khi user chủ động cho phép overlap và UI cảnh báo.
- Goal progress = value of allocated eligible assets / target value; hiển thị contributed vs market gain khi có investment.
- Goal projection dùng expected contributions, returns **[nếu user nhập]**, inflation **[optional]**, confidence và scenario; không mặc định hứa lợi nhuận.
- User tự tạo/sửa/pause/archive goal và chọn cách liên kết: phần trăm/số tiền của account balance, quantity/value của holding, tagged transactions, recurring contribution hoặc plan bucket. Link là allocation/projection, không di chuyển tiền và không sửa posted fact.
- Contribution thực tế được match từ linked transfer/investment activity hoặc user xác nhận; projection tách `actual contributed`, `market movement`, `planned contribution` và `gap`. Một source allocation không được tính 100% cho nhiều goal trừ khi user cho phép overlap sau cảnh báo.
- Goal có thể sinh plan draft cho khoản đóng góp định kỳ; mọi thay đổi hiển thị diff và cần user xác nhận. Xóa link không xóa account, holding hay transaction nguồn.

### 6.7 Debts payable và receivables

**Unified obligation model** với direction `payable` hoặc `receivable`.

Fields: counterparty alias, principal original/outstanding, currency, disbursement date, interest method/rate, fee, schedule, due date, payment allocation rule, collateral note, status, reminder, documents. Receivable thêm recoverability status/probability, estimated recoverable value, last contact, expected collection date.

**Rules:**

- Schedule installment tách principal, interest, fee, tax; actual payment có thể partial/extra/late.
- Allocation mặc định do product policy hiển thị rõ; user có thể override theo hợp đồng. **[Giả định Phase 1: fee → interest → principal].**
- Overdue dựa trên timezone và due date; grace period configurable.
- Payable value trong net worth là principal outstanding + accrued recognized interest/fee nếu user bật accrual; mặc định cash basis cho P&L Phase 1.
- Receivable gross value tách khỏi estimated recoverable value. Net worth mặc định dùng estimated recoverable value đối với receivable có uncertainty; nếu chưa đánh giá, dùng gross nhưng gắn cảnh báo “chưa điều chỉnh khả năng thu hồi”.
- Estimated recoverable value = outstanding principal × recovery probability + recoverable accrued interest (nếu được đánh dấu), capped theo claim; mọi override lưu rationale.
- Bad debt write-off giảm receivable và ghi expense/loss riêng; recovery sau write-off ghi recovery income theo policy, có liên kết.
- Debt-free date dựa trên schedule + planned extra payment; what-if thay đổi amount/rate/date là simulation không ghi ledger cho đến khi Apply to plan.
- Reminder không gửi thông tin nhạy cảm đầy đủ trên lock screen theo mặc định.

### 6.8 Investments

**Asset classes:** cash/money-market, term deposit, gold/precious metal, listed equity, ETF, mutual/open-ended fund certificate, closed-end fund, bond (government/corporate), crypto/tokenized asset, REIT, pension/insurance cash value, employee equity/RSU, collectibles (art/watch/diamond), business/private equity, real estate và other asset. Portfolio chứa accounts/holdings; instrument định danh tách khỏi position.

**Activity types:** buy, sell, dividend/distribution, interest/coupon, fee, tax, deposit/withdrawal, transfer-in/out, split, bonus/right issue, merger/spin-off/manual corporate action, valuation adjustment.

**Rules:**

- Holdings được dựng từ activity ledger; không chỉ lưu current quantity.
- Cost basis Phase 1 dùng weighted average theo instrument/account **[Giả định cần legal/tax review]**; Phase 2 có lot-level/FIFO option.
- Realized P&L = proceeds − allocated cost basis − selling fees/taxes.
- Unrealized P&L = current market value − remaining cost basis.
- Income tách dividend/coupon/interest; fees và taxes tách riêng.
- Total return có cash-flow adjustment; Phase 1 hiển thị money-weighted return (XIRR khi đủ dữ liệu) và simple gain, Phase 2 thêm time-weighted return.
- Transfer giữa portfolios không tạo gain/loss; giữ cost basis và acquisition date.
- Corporate actions phải điều chỉnh quantity/cost basis mà không tạo P&L giả; item chưa hỗ trợ vào review queue.
- Giá có source, observed_at, fetched_at, currency, quality/staleness và manual/provider flag.
- Asset không có market price dùng manual valuation; UI không trộn “live” và “manual” mà không nhãn.
- Với asset có giá/NAV/benchmark niêm yết công khai, Market Data phải ưu tiên tìm provider API có quyền sử dụng trước khi dùng manual valuation. UI chọn instrument qua searchable dropdown/catalog (`provider_id`, symbol, exchange, ISIN/contract khi có), không dựa vào free-text symbol làm định danh chính; free-text chỉ là fallback “không tìm thấy” và đi To Review.
- Provider coverage tối thiểu phải được đánh giá theo nhóm: HOSE/HNX/UPCoM equity/ETF, quỹ/NAV Việt Nam, trái phiếu, vàng/kim loại quý, crypto, FX và global securities. Không có coverage hoặc license phù hợp phải hiển thị manual/last-known + stale, tuyệt đối không thay bằng 0.
- Benchmark là optional; so sánh cùng period/currency, không bỏ qua cash flows.
- Asset location/account được giữ để phân biệt nơi sở hữu và tránh double-count.

### 6.9 Dashboard, reports và monthly close

**Home cards:** STS, cash-flow next 30 days, due soon, inbox, net worth, month-to-date inflow/outflow, goal/debt progress, suggestions. User customize/reorder.

**Reports:** income/expense by period/category, cash flow, balance sheet/net worth, debt/receivable aging, investment performance/allocation, goal progress. Filter theo account, currency, category, tags; export CSV/XLSX/PDF ở phase phù hợp.

**Monthly close:**

1. Review unresolved critical transactions.
2. Reconcile selected accounts.
3. Confirm debts/receivables and stale valuations.
4. Review actual vs plan and explain major variances.
5. Generate versioned monthly snapshot and carry-forward plan.

Reopening month yêu cầu reason, tạo snapshot version mới và recompute downstream summaries; không xóa version cũ.

### 6.10 Notifications

- Channels Phase 1: in-app và email optional; push khi native/PWA capability ổn định.
- Types: due soon/overdue, recurring expected, cash shortfall, stale data, import complete, suggestion follow-up, security.
- Quiet hours, digest và per-type opt-out; security notices không tắt hoàn toàn.
- Không hiển thị amount/counterparty ngoài lock screen nếu user chưa opt-in.

## 7. End-to-end user journeys

### 7.1 Onboarding đến first value

1. User tạo tài khoản, tự chọn ngôn ngữ và base currency, rồi xác nhận consent cần thiết. Theme/timezone dùng theo OS/browser; không hỏi hoặc tự lưu location trong onboarding.
2. Chọn 1–3 ưu tiên: kiểm soát chi, tránh thiếu tiền, trả nợ, tích lũy, đầu tư, tổng tài sản.
3. Tạo account đầu tiên hoặc import file; nhập opening balance/date.
4. Hệ thống đề xuất category mapping và duplicate review; không auto-commit item confidence thấp.
5. User chọn nhanh các fixed commitments phổ biến (tiền nhà, trả ngân hàng, học phí, bảo hiểm, internet) hoặc tạo custom; có thể bỏ qua và cấu hình sau.
6. User xác nhận amount, due date và bản chất kế toán của từng khoản; khoản trả ngân hàng được link với hồ sơ nợ để tách gốc/lãi/phí.
7. User xác nhận bills/thu nhập recurring quan trọng hoặc bỏ qua.
8. Home hiển thị net worth sơ bộ, `Tổng cam kết tháng`, dữ liệu còn thiếu, STS “estimated” hoặc chưa đủ dữ liệu.
9. Sản phẩm đưa next best action duy nhất: thêm account, review inbox hoặc xác nhận bill/commitment.

**Success:** có một bức tranh sơ bộ trong <10 phút và user hiểu mức confidence/completeness.

### 7.2 Daily capture và review

1. User bấm `+`, nhập amount trước, chọn expense/income/transfer hoặc để hệ thống đề xuất.
2. Recent account/category/payee giảm thao tác; receipt attachment optional.
3. Item được save ngay hoặc vào inbox nếu draft/import/OCR.
4. To Review gom uncategorized, transfer candidate, duplicate, debt/investment candidate.
5. User approve/edit/split/link; hệ thống học rule nhưng cho preview scope.
6. Home recalculates signals và ghi timestamp.

### 7.3 Monthly close

1. Hệ thống báo readiness và liệt kê blocker, không ép close.
2. User reconcile balances, xử lý critical inbox và stale prices.
3. Review từng fixed commitment: paid, skipped, rescheduled hoặc unmatched; actual-vs-expected variance được giải thích.
4. Review variance, cash-flow, net-worth bridge và debt progress.
5. User ghi note cho one-off events và confirm close.
6. Snapshot được tạo; active commitments và next occurrences được carry forward, không copy lại actual transactions.

### 7.4 Payable debt journey

1. Tạo khoản vay từ template hoặc liên kết cash inflow hiện có.
2. Nhập principal, rate/method, fees, schedule; preview total and due dates.
3. Giao dịch giải ngân tạo cash + payable, không income.
4. Mỗi kỳ, reminder và expected split principal/interest/fee xuất hiện.
5. User link payment; hệ thống phân bổ và cập nhật outstanding.
6. Simulation cho extra payment hiển thị debt-free date, interest delta và cash-flow tradeoff.
7. Apply to plan chỉ cập nhật planned payment; không thực hiện thanh toán.

### 7.5 Receivable journey

1. User tạo khoản phải thu hoặc chuyển một cash outflow thành loan-to-other.
2. Nhập schedule, recoverability, expected recovery và reminder.
3. Net worth hiển thị gross và recoverable value; uncertainty badge.
4. Khi thu tiền, user split principal/interest/fee; principal không income.
5. Overdue flow cho phép reschedule, change recovery estimate hoặc write-off với rationale.

### 7.6 Investment journey

1. User tạo portfolio/account, chọn currency và import activity/manual buy.
2. Mapping instrument được review; unknown ticker không auto-match.
3. System builds holdings/cost basis and flags missing prices/actions.
4. Overview tách contributions, withdrawals, income, fees, realized/unrealized P&L.
5. User drill-down source price và activity ledger.
6. Corporate action/transfer được review trước khi performance thay đổi đáng kể.

### 7.7 Suggestion journey

1. Sau 30–45 ngày và đủ transaction cycles, eligibility job đánh giá completeness/stability.
2. Candidate suggestion chạy deterministic rules/model; guardrails và conflict check.
3. User nhận card: **Phát hiện → Vì sao → Gợi ý → Tác động dự kiến**, kèm confidence, horizon và nguồn.
4. User mở evidence, chỉnh assumptions và xem scenario.
5. Chọn `Apply to plan`, `Remind later`, `Not relevant` hoặc dismiss.
6. Apply tạo plan change draft với diff và confirm; không tạo giao dịch/hành động tài chính.
7. Outcome được đo sau horizon và có thể feedback “helpful/not helpful”.

## 8. Functional requirements và acceptance criteria

Priority: **M** Must, **S** Should, **C** Could. Phase ghi `P1/P2/P3`.

### 8.1 Identity, setup và data rights

| ID     | Pri/Phase | Requirement                         | Acceptance criteria                                                                                                                                                                                                   |
| ------ | --------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-001 | M/P1      | Tạo tài khoản và personal workspace | Given user hợp lệ, when signup hoàn tất, then workspace riêng được tạo; user tự chọn language/base currency, timezone/theme hiệu lực ban đầu theo OS/browser, không suy diễn location; không lộ dữ liệu cross-tenant. |
| FR-002 | M/P1      | Onboarding theo mục tiêu            | User có thể chọn/bỏ qua nhu cầu; chỉ module liên quan được ưu tiên; bỏ qua không chặn first value.                                                                                                                    |
| FR-003 | M/P1      | Preferences/locale                  | Đổi language, timezone/theme override và base currency có preview tác động; timezone/theme có thể quay về `Theo thiết bị`; base-currency change không sửa original amounts.                                           |
| FR-004 | M/P1      | Export dữ liệu                      | User request export machine-readable; bundle chứa entities, attachments manifest, schema/version và hoàn thành theo SLA NFR.                                                                                          |
| FR-005 | M/P1      | Delete account/data                 | UI hiển thị scope, retention ngoại lệ pháp lý và confirm; dữ liệu bị soft-delete ngay khỏi UI, hard-delete theo SLA, có receipt không chứa dữ liệu nhạy cảm.                                                          |
| FR-006 | S/P2      | Module opt-in/pin                   | Bật/tắt/pin module không xóa dữ liệu và navigation cập nhật trên web/mobile.                                                                                                                                          |

### 8.2 Accounts và transactions

| ID     | Pri/Phase | Requirement                  | Acceptance criteria                                                                                                                                                                                                |
| ------ | --------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FR-010 | M/P1      | CRUD account đa currency     | Tạo account với type/currency/opening balance; ledger tính đúng; archive giữ history; dependency được cảnh báo trước delete.                                                                                       |
| FR-011 | M/P1      | CRUD transaction             | Tạo/sửa income, expense, transfer với amount/date/account/category; save <2s p95 excluding upload; totals update idempotently.                                                                                     |
| FR-012 | M/P1      | Double-entry legs nội bộ     | Mọi posted event tạo legs cân bằng; nếu invariant không đạt, event không post và được log/alert.                                                                                                                   |
| FR-013 | M/P1      | Transfer pairing             | Transfer giữa accounts không xuất hiện trong income/expense; FX transfer lưu rate/fees và chênh lệch rõ ràng.                                                                                                      |
| FR-014 | M/P1      | Split/refund                 | Split sum bằng total theo rounding; refund link original và report net/gross tùy toggle.                                                                                                                           |
| FR-015 | M/P1      | Categories/tags              | System/local categories và custom category hoạt động; re-category lưu audit; category change không đổi type ngoài explicit action.                                                                                 |
| FR-016 | M/P1      | Recurring/bill               | Tạo expected item/reminder theo cadence; edit “this/this and future/all”; không auto-post variable amount mặc định.                                                                                                |
| FR-017 | M/P1      | CSV/XLSX import              | Preview mapping, validation, duplicate candidates và row errors trước commit; retry không tạo duplicate; import có rollback window.                                                                                |
| FR-018 | M/P1      | To Review inbox              | Lọc theo reason/confidence/source; batch approve an toàn; destructive merge/delete cần preview.                                                                                                                    |
| FR-019 | S/P1      | Reconciliation               | Nhập statement balance/date, thấy difference, link/adjust; adjustment bắt buộc reason và audit.                                                                                                                    |
| FR-020 | S/P2      | Receipt OCR                  | OCR tạo draft với image/fields/confidence; user xác nhận trước posted; xóa image độc lập nếu được phép.                                                                                                            |
| FR-021 | C/P2      | Offline quick capture        | Capture offline queue sync idempotent; conflict hiển thị, không âm thầm ghi đè.                                                                                                                                    |
| FR-022 | M/P1      | Cấu hình fixed commitment    | User tạo tiền nhà/trả ngân hàng/chi phí cố định với amount, tolerance, cadence, due date, account, type, priority và reminder; occurrence tương lai xuất hiện trong plan/forecast mà không tạo posted transaction. |
| FR-023 | M/P1      | Theo dõi và match commitment | Actual transaction được auto-suggest match trong tolerance nhưng user có thể undo; ngoài tolerance đi To Review; trạng thái paid/due/overdue/skipped/rescheduled và history phải đúng.                             |
| FR-024 | M/P1      | Version và ngoại lệ theo kỳ  | User có thể edit this occurrence/this and future, pause/end; change không sửa occurrence đã paid; audit lưu before/after và forecast recompute idempotently.                                                       |
| FR-025 | M/P1      | Debt-installment commitment  | Khoản trả ngân hàng link payable/installment; actual payment split principal/interest/fee và chỉ interest/fee tác động P&L; không double-count giữa commitment và debt schedule.                                   |

### 8.3 Plan, dashboard, goals và reports

| ID     | Pri/Phase | Requirement                      | Acceptance criteria                                                                                                                                                      |
| ------ | --------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FR-030 | M/P1      | Home dashboard                   | Hiển thị core cards theo dữ liệu; card có as-of/freshness/status và drill-down đến drivers.                                                                              |
| FR-031 | M/P1      | Projected cash flow              | Tính daily/weekly balance từ posted + expected; user xem source và toggle scenarios; stale/missing data hạ confidence.                                                   |
| FR-032 | M/P1      | Safe-to-spend                    | Áp công thức đã định; horizon và components hiển thị; số âm thành shortfall; recompute khi input đổi.                                                                    |
| FR-033 | S/P1      | Spending plan optional           | Tạo commitments/flexible limits/buffer; user không dùng budget vẫn có dashboard cơ bản; carry-over có policy rõ.                                                         |
| FR-034 | M/P1      | Goals                            | Tạo target/date/link account; cảnh báo double allocation; progress và projection phân biệt actual/assumption.                                                            |
| FR-035 | M/P1      | Net-worth report                 | Assets + recoverable receivables − liabilities; drill-down và bridge giữa hai dates; tránh double-count known linked values.                                             |
| FR-036 | M/P1      | Income/expense/cash-flow reports | Filters nhất quán; transfer/principal excluded khỏi P&L; totals khớp transaction ledger.                                                                                 |
| FR-037 | S/P2      | Monthly close                    | Readiness checklist, versioned snapshot, reopen with reason và downstream recompute.                                                                                     |
| FR-038 | S/P2      | Custom cycle                     | Payday/custom cycle affects plan/forecast without changing ledger dates.                                                                                                 |
| FR-039 | M/P1      | Monthly commitment baseline      | Dashboard/plan hiển thị tổng fixed commitments, đã trả, sắp đến hạn và còn phải dành; STS trừ remaining committed amount; user drill-down tới từng occurrence và source. |

### 8.4 Debts và receivables

| ID     | Pri/Phase | Requirement                   | Acceptance criteria                                                                                                       |
| ------ | --------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| FR-040 | M/P1      | Payable profile               | Tạo principal/rate/fees/schedule; preview schedule totals; disbursement link không tạo income.                            |
| FR-041 | M/P1      | Receivable profile            | Tạo/link cash outflow; set recoverability; net worth shows gross vs estimated recoverable.                                |
| FR-042 | M/P1      | Payment/collection split      | Một actual event tách principal/interest/fee; reports chỉ interest/fee ảnh hưởng P&L đúng direction.                      |
| FR-043 | M/P1      | Due/overdue/reminders         | Status đúng theo date/grace period/timezone; partial payment giữ remaining due; reminder privacy settings được tôn trọng. |
| FR-044 | M/P1      | Outstanding và history        | Sau extra/partial/reversal, outstanding/schedule/history reconcile; không âm ngoài explicit overpayment state.            |
| FR-045 | S/P1      | Debt-free simulation          | User thay extra amount/date/rate và thấy date/interest/cash impact; scenario không ghi ledger; Apply chỉ tạo plan draft.  |
| FR-046 | S/P2      | Receivable write-off/recovery | Write-off yêu cầu reason, giữ claim history; later recovery link được và report đúng.                                     |

### 8.5 Investments và market data

| ID     | Pri/Phase | Requirement                     | Acceptance criteria                                                                                                                |
| ------ | --------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| FR-050 | M/P1      | Portfolio/instrument/holding    | Tạo portfolio, instrument mapping và activity; quantity/cost basis rebuild từ ledger cho cùng kết quả.                             |
| FR-051 | M/P1      | Buy/sell/income/fees            | Realized/unrealized P&L theo formula; dividend/coupon/fee/tax tách; transaction totals reconcile.                                  |
| FR-052 | M/P1      | Price snapshot/manual valuation | Mọi valuation có source/observed timestamp/currency/staleness; manual override không xóa provider value.                           |
| FR-053 | M/P1      | Performance attribution cơ bản  | Overview tách external cash flows, investment income, fees, realized/unrealized change; period change khớp bridge trong tolerance. |
| FR-054 | S/P2      | Corporate actions               | Split/bonus/right/merger supported hoặc routed to manual review; cost basis không tạo gain giả.                                    |
| FR-055 | S/P2      | Lot-level/TWR/benchmark         | User chọn lot method; TWR/benchmark cùng period/currency và disclosure methodology.                                                |
| FR-056 | C/P3      | Broker/crypto integrations      | OAuth/API/token consent riêng; read-only; revoke works; sync provenance/idempotency đáp ứng NFR.                                   |

### 8.6 Suggestions và notifications

| ID     | Pri/Phase | Requirement                 | Acceptance criteria                                                                                                                             |
| ------ | --------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-060 | M/P2      | Eligibility gate            | Không phát hành personalized allocation suggestion trước min 30 ngày và đủ cycles/completeness; lý do chưa eligible được xem.                   |
| FR-061 | M/P2      | Explainable suggestion card | Card có detection, reason, recommendation, expected impact, confidence, horizon, sources và assumptions.                                        |
| FR-062 | M/P2      | User controls               | Apply to plan tạo diff/confirm; Remind later respects date; Not relevant captures optional reason và suppresses similar suggestion theo policy. |
| FR-063 | M/P2      | Conflict/guardrails         | Suggestion không làm projected liquidity dưới buffer/minimum obligations; conflict giữa goals/debt được nêu; không có execution CTA mơ hồ.      |
| FR-064 | M/P2      | Feedback/outcome            | Log exposure/action/edit và evaluate outcome after horizon; user có thể xem/xóa feedback-linked personalization data.                           |
| FR-065 | M/P1      | Notifications               | Per-type/channel/quiet-hours; due/security priority; no sensitive lock-screen content by default.                                               |

## 9. Non-functional requirements

### 9.1 Security

- NFR-SEC-01: TLS 1.2+ in transit; encryption at rest bằng managed KMS; secrets không nằm trong client/log/source.
- NFR-SEC-02: Password hashing bằng Argon2id/bcrypt phù hợp; MFA optional P1, required cho high-risk actions/admin P2.
- NFR-SEC-03: Tenant isolation enforced ở authorization layer và database policy/tests; IDOR test bắt buộc.
- NFR-SEC-04: Export, delete, email/MFA change và integration connect cần recent authentication/risk check.
- NFR-SEC-05: OWASP ASVS-aligned SDLC, dependency scanning, SAST/DAST, pentest trước public launch và sau material architecture change.
- NFR-SEC-06: Rate limit, session revocation, device/session list, anomaly alert; audit admin access.
- NFR-SEC-07: Không thu thập bank password; future integrations dùng redirect/OAuth hoặc read-only token, scope tối thiểu.
- NFR-SEC-08: Incident response có severity, on-call, containment, notification workflow và postmortem.

### 9.2 Privacy và data governance

- Purpose limitation, data minimization và retention schedule theo data class; legal review luật Việt Nam hiện hành trước launch.
- Không bán dữ liệu cá nhân/tài chính; không ad targeting dựa trên financial vulnerability; không chia sẻ cho lender/insurer/employer nếu không có explicit, granular consent.
- Export target: request acknowledged ngay, 95% hoàn thành <24h, hard limit 7 ngày trừ sự cố.
- Delete target: inaccessible to product ngay; production hard-delete ≤30 ngày, backup aging ≤90 ngày **[subject to legal retention]**.
- Analytics dùng pseudonymous IDs; raw amount/counterparty/note không vào product analytics mặc định.
- Attachment/OCR vendor cần DPA, region/retention disclosure; raw receipt không dùng train model nếu chưa opt-in riêng.
- Privacy center liệt kê data categories, source, purpose, retention, consent và processors.

### 9.3 Accessibility và inclusive UX

- WCAG 2.2 AA target; keyboard complete, visible focus, semantic landmarks, screen-reader labels.
- Không truyền ý nghĩa chỉ bằng màu; chart có table/text alternative; contrast và zoom 200% không mất chức năng.
- Touch target ≥44×44 CSS px; copy tiếng Việt rõ, tránh thuật ngữ khi không cần.
- Amount/date input chịu được định dạng Việt Nam và alternative; error chỉ rõ cách sửa, không xóa input.
- Motion giảm theo OS preference; timeout có cảnh báo/gia hạn.

### 9.4 Performance và scalability

- LCP p75 <2.5s trên mobile 4G cho cached dashboard; INP p75 <200ms; CLS <0.1.
- API read p95 <500ms, write p95 <800ms excluding bulk import/third-party.
- Quick-add acknowledgement p95 <1s; final save <2s khi online.
- Dashboard first meaningful data <2s cached/<4s cold p95 với 5 năm/50k transactions **[load-test profile]**.
- Import 10k rows preview <60s và async progress; jobs idempotent/retryable.
- Partition/index strategy phải hỗ trợ 1M users/100k events per heavy user mà không đổi domain contract **[capacity hypothesis]**.

### 9.5 Reliability và data integrity

- Target availability P1 99.9% monthly cho core read/write; market data không làm core ledger unavailable.
- RPO ≤15 phút, RTO ≤4 giờ P1; restore drill ít nhất hàng quý.
- Money dùng decimal/integer minor unit theo currency, không floating point; quantity/rate có precision policy.
- Idempotency keys cho imports/sync/write retry; outbox/event processing đảm bảo at-least-once với dedup.
- Financial calculation versioned và regression “golden cases”; invariant ledger balance monitored.
- Provider outage circuit breaker; last-known value được gắn stale, không biến thành zero.

### 9.6 Localization

- Vietnamese-first; Unicode names/notes, VND no decimal display nhưng storage theo ISO 4217 minor unit policy.
- Timezone per user, store timestamps UTC + event local date; DST-ready dù VN không có DST.
- Category labels tách stable code khỏi translation; i18n extraction từ đầu.
- FX conversion theo rate source/date/method; reports ghi base currency và original currency.

### 9.7 Auditability/observability

- Immutable audit event cho create/update/delete/reconcile/close/import/mapping/suggestion apply/admin access; before/after redacted hợp lý.
- User-facing activity log cho thay đổi quan trọng; internal trace liên kết request/job/calculation version.
- Mọi derived number có lineage đến input IDs, rate/price snapshot và calculation version.
- Logs không chứa raw financial notes, full account numbers, tokens hoặc attachments.

## 10. Domain data model

### 10.1 Modeling principles

- Event/ledger là source of truth cho money movement; snapshot/materialized views để đọc nhanh, có thể rebuild.
- Tách `business event` khỏi `ledger entries`; một transfer/debt payment có nhiều legs.
- Mọi amount: `amount_original`, `currency`, optional `amount_base`, `fx_rate_id`, `conversion_method`.
- Soft-delete + audit cho entity có dependency; immutable identifiers; optimistic concurrency/version.
- Derived fields không được là nguồn duy nhất nếu có thể recompute.

### 10.2 Entity catalog

| Domain               | Entities chính                                                                                                       | Quan hệ/ghi chú                                                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identity             | User, Workspace, Membership, Preference, Consent, Session                                                            | User 1—N workspace-ready; P1 một personal workspace                                                                                                                  |
| Money                | Account, AccountBalanceSnapshot, BusinessEvent, LedgerEntry, Transaction, Split, TransferLink                        | Event 1—N entries; entries cân bằng theo event/currency policy                                                                                                       |
| Classification       | Category, Tag, Merchant/Counterparty, CategorizationRule                                                             | Transaction N—M tags; category stable code/local label                                                                                                               |
| Capture              | ImportJob, ImportRow, Attachment, OCRResult, ReviewItem, DuplicateCandidate                                          | Provenance từ source đến committed event                                                                                                                             |
| Recurring/commitment | RecurringRule, FixedCommitment, ExpectedOccurrence, CommitmentMatch, Bill                                            | FixedCommitment tham chiếu rule và optional Obligation; occurrence có thể link một/nhiều actual events nhưng mỗi actual chỉ thuộc một occurrence, giữ status/version |
| Plan                 | Plan, PlanLine, Allocation, CashBufferPolicy, ForecastRun, ForecastPoint                                             | Forecast versioned theo input/calculation version                                                                                                                    |
| Goal                 | Goal, GoalFundingLink, GoalProjection                                                                                | N—M account/holding với allocation share                                                                                                                             |
| Obligation           | Obligation, ObligationSchedule, Installment, ObligationEvent, RecoverabilityAssessment, Reminder, SimulationScenario | direction payable/receivable; payment links ledger event                                                                                                             |
| Investment           | Portfolio, InvestmentAccount, Instrument, InstrumentIdentifier, Activity, Lot, HoldingSnapshot, CorporateAction      | Holding rebuild từ activity/lot                                                                                                                                      |
| Market               | PriceSnapshot, FXRate, DataProvider, ProviderSymbolMapping, DataQualityFlag                                          | Source/timestamps/license metadata                                                                                                                                   |
| Insight              | MetricSnapshot, Suggestion, SuggestionEvidence, SuggestionAction, Feedback                                           | Evidence links immutable input snapshot                                                                                                                              |
| Close/Audit          | Reconciliation, PeriodClose, SnapshotVersion, AuditEvent, CalculationRun                                             | Reopen creates new version                                                                                                                                           |
| Notification         | Notification, DeliveryAttempt, Preference                                                                            | Sensitive payload minimized                                                                                                                                          |

### 10.3 Relationship overview

```text
Workspace
 ├─ Accounts ──< LedgerEntries >── BusinessEvent ── Transaction/Transfer/etc.
 │                  │                       └── ReviewItem / ImportRow
 │                  └── Reconciliation
 ├─ Obligations ──< Installments ──< ObligationEvents ── BusinessEvent
 ├─ Portfolios ──< InvestmentAccounts ──< Activities >── Instrument
 │                                              └── PriceSnapshots (via Instrument)
 ├─ Goals ──< GoalFundingLinks >── Account/Holding
 ├─ Plans ──< PlanLines ── ForecastRuns
 └─ Suggestions ──< Evidence >── Snapshot/Input entities
```

### 10.4 Key invariants

1. Posted business event phải cân bằng theo accounting policy; tổng debit = tổng credit trong base ledger representation.
2. Original amount/currency không thay đổi khi base currency hoặc FX source đổi.
3. Một external transaction không được committed hai lần cùng source ID/idempotency key.
4. Principal movement không xuất hiện trong income/expense aggregates.
5. Net worth không double-count linked brokerage cash/portfolio/account.
6. Holding quantity tại t = tổng quantity effects đến t, có corporate actions.
7. Snapshot luôn gắn input cutoff và calculation version.
8. Audit event không thể bị user sửa; privacy deletion dùng tombstone/minimized proof theo policy.

## 11. Suggestion engine

### 11.1 Phạm vi

Suggestion engine hỗ trợ quyết định về cash buffer, timing dòng tiền, mức chi linh hoạt, đóng góp mục tiêu và kịch bản trả nợ. Nó không phải robo-advisor, không ra lệnh giao dịch, không chấm điểm đạo đức và không dùng “một tỷ lệ vàng” áp cho mọi người.

### 11.2 Eligibility

Một personalized allocation suggestion chỉ được phát hành khi tất cả điều kiện tối thiểu đạt:

- Account age/data history ≥30 ngày; ưu tiên 45 ngày với thu nhập biến động.
- Có ít nhất 2 transaction cycles có ý nghĩa hoặc 1 full income cycle + recurring obligations đã xác nhận. Với income theo quý/mùa, cần user xác nhận pattern hoặc dùng mode “limited evidence”.
- ≥80% giao dịch ảnh hưởng forecast trong lookback đã categorized/reviewed.
- Ít nhất một nguồn thu hoặc user-declared income range và các fixed obligations chính đã được xác nhận.
- Liquid account balances không stale quá 14 ngày manual/72 giờ connected.
- Không có critical unresolved duplicate/transfer/debt event có thể thay đổi kết luận đáng kể.
- Confidence tổng ≥ threshold theo loại suggestion; high-impact suggestion đòi threshold cao hơn.

Nếu chưa đủ điều kiện, hệ thống chỉ đưa **data-quality prompt** (ví dụ “Xác nhận tiền thuê nhà để dự báo chính xác hơn”), không giả dạng financial advice.

### 11.3 Input features

- Income: cadence, median, quantiles, volatility, seasonality, source concentration, next expected date/confidence.
- Expense: essential/flexible, recurring, one-off, trend, category variance, due timing.
- Commitments: fixed monthly baseline, remaining committed amount, due-date concentration, actual-vs-expected variance và skipped/overdue states.
- Liquidity: eligible balances, restrictions, minimum buffer, account freshness.
- Obligations: minimum payment, APR/rate, due/overdue, penalties, secured/unsecured, receivable uncertainty.
- Goals: priority, target date, gap, contribution flexibility.
- Portfolio: only liquidity/risk metadata necessary for cash planning in P2; không dùng để khuyến nghị chứng khoán cụ thể.
- Behavior: confirmed changes và relevance feedback; không suy diễn sensitive traits.
- Data quality: completeness, recency, reconciliation, anomaly and model coverage.

### 11.4 Pipeline

```text
Eligibility gate
  → Candidate detection
  → Scenario calculation
  → Safety/conflict guardrails
  → Confidence calibration
  → Rank by expected user value and urgency
  → Explanation assembly from evidence snapshot
  → User review/action
  → Outcome and feedback evaluation
```

MVP của engine nên rule/scenario-first, deterministic và testable. ML chỉ dùng sau khi có labeled feedback đủ chất lượng, trước hết cho categorization/ranking, không cho autonomous financial action.

### 11.5 Suggestion classes

| Class           | Ví dụ                                            | Eligibility bổ sung             | Không được làm                                                  |
| --------------- | ------------------------------------------------ | ------------------------------- | --------------------------------------------------------------- |
| Liquidity       | Tăng buffer vì 2 kỳ thu gần đây lệch 10–15 ngày  | Income volatility đủ quan sát   | Tự chuyển sang savings                                          |
| Cash timing     | Dời planned contribution sau kỳ bill cao         | Recurring obligations confirmed | Sửa due date hợp đồng                                           |
| Spending plan   | Giảm discretionary range tháng tới               | Category completeness tốt       | Phán xét category/lifestyle                                     |
| Debt plan       | Thử thêm 500k/tháng vào khoản lãi cao            | Rate/schedule/minimum verified  | Tự trả nợ hoặc khẳng định “tốt nhất” nếu thiếu tax/penalty data |
| Goal allocation | Giảm contribution goal B để giữ emergency buffer | Goal priorities confirmed       | Dùng tỷ lệ 50/30/20 mặc định như chân lý                        |
| Data quality    | Review 6 giao dịch để tăng forecast confidence   | Có material uncertainty         | Gọi đây là financial suggestion                                 |

### 11.6 Confidence

Confidence là calibrated ordinal score, không chỉ xác suất model:

```text
confidence = f(data completeness, recency, cycle coverage,
               pattern stability, source reliability,
               scenario sensitivity, historical calibration)
```

- **High:** conclusion ổn định qua conservative/base scenarios; inputs quan trọng verified/fresh.
- **Medium:** có uncertainty nhưng direction ổn định; impact hiển thị range rộng.
- **Low:** chỉ dùng cho “explore scenario” hoặc data prompt; không push notification như recommendation.

UI hiển thị label + lý do cụ thể (“Trung bình — có 2 kỳ thu nhập nhưng số tiền biến động mạnh”), không chỉ phần trăm dễ gây hiểu nhầm.

### 11.7 Explainability contract

Mỗi suggestion lưu và hiển thị:

1. **Phát hiện:** quan sát định lượng, time window.
2. **Lý do:** những drivers quyết định, không dùng correlation mơ hồ.
3. **Gợi ý:** hành động plan-level cụ thể, editable.
4. **Tác động dự kiến:** range, horizon, tradeoff và assumptions.
5. **Confidence:** level và các yếu tố nâng/hạ confidence.
6. **Dữ liệu nguồn:** accounts/transactions/bills/debts/snapshot, timestamp, calculation version.
7. **Controls:** Apply to plan, Remind later, Not relevant; secondary “Why am I seeing this?” và feedback.

### 11.8 Guardrails

- Không suggestion nếu dữ liệu material stale, conflict unresolved hoặc eligibility không đạt.
- Không đề xuất tăng flexible spending nếu fixed commitments chưa được reserve hoặc có commitment essential/loan installment overdue.
- Không làm projected available cash thấp hơn essential obligations + user buffer trong conservative scenario.
- Không đề xuất bỏ minimum debt payment, bỏ bảo hiểm/medical essential, vay mới hoặc bán tài sản cụ thể.
- Không đưa nhận định dựa trên protected/sensitive attribute.
- Không dùng dark pattern, urgency giả hoặc notification lặp gây stress.
- Mọi Apply là draft diff có undo; không tạo posted financial event.
- Một suggestion có TTL và input snapshot; input material đổi thì invalidate/recompute.
- Có global kill switch theo suggestion class/calculation version và human review workflow cho incident.
- Copy bắt buộc phân biệt “ước tính”, “kịch bản” và “cam kết”; nêu rủi ro khi range rộng.
- Feedback “Not relevant” suppress cùng class/context tối thiểu 30 ngày hoặc đến khi material change; user có thể reset.

### 11.9 Validation và monitoring

- Offline replay trên anonymized/synthetic golden cohorts: fixed income, freelancer, seasonal, heavy debt, sparse data.
- Counterfactual/sensitivity tests: thay một input trong tolerance không làm recommendation nhảy phi lý.
- Calibration theo class/cohort, false-positive/rejection rate, helpfulness, plan reversals trong 7 ngày.
- Fairness review theo proxies hợp pháp và user needs; không tối ưu engagement bằng financial anxiety.
- Sample explanations được Product/Risk review trước rollout; staged release 1% → 10% → 50% → 100% với guardrails.

## 12. Market data, external API và fallback

### 12.1 Adapter strategy

Backend định nghĩa canonical interfaces độc lập provider:

- `InstrumentSearch/Resolve`
- `LatestPrice` và `HistoricalPrices`
- `FXRate`
- `CorporateActions`
- `AccountTransactionImport` (future banking/broker)

Mỗi adapter chịu mapping symbol/exchange/currency, rate limit, license, freshness, error taxonomy và provenance. Provider payload gốc được lưu tối thiểu theo license/retention; canonical record có checksum/version.

Instrument catalog/resolution là contract riêng với price snapshots: dropdown tìm kiếm theo name/symbol/exchange nhưng lưu stable internal instrument ID + provider mapping. Catalog refresh không được đổi mapping của holding đã có mà không review.

Candidate evaluation ban đầu: SSI cho symbol/catalog và market data chứng khoán Việt Nam; FiinGroup cho fund/NAV và coverage tài sản Việt Nam; CoinGecko cho crypto; licensed ICE/LBMA-compatible feed cho gold benchmark. Đây là shortlist để spike coverage/license/SLA, không phải provider đã chốt.

### 12.2 Provider selection criteria

- Coverage Việt Nam: HOSE/HNX/UPCoM, funds/bonds/gold nếu khả dụng; crypto và FX.
- Data rights: display, cache, derived analytics và historical retention.
- Latency/freshness phù hợp use case; EOD đủ cho P1 portfolio tracking nếu disclosure rõ.
- Corporate actions, symbol history, delisted instruments và identifiers.
- SLA, rate limits, cost per active user, data quality/support.
- Security/privacy; market-price provider không cần nhận user holdings nếu có thể tránh.

Không chốt vendor trong PRD. Product/Data Engineering phải chạy bake-off với sample instruments và legal license review.

### 12.3 Price and FX policy

- Price snapshot fields: provider, instrument, value, quote currency, market status, observed_at, fetched_at, adjustment type, quality flags.
- Valuation chọn snapshot gần `as_of` nhất trong tolerance theo asset class; không forward-fill vô hạn.
- FX reports phải ghi rate type: provider close, transaction rate, user rate hoặc fallback; original amount luôn giữ.
- Manual price có precedence chỉ trong scope user chọn và không overwrite provider history.
- Corrected provider data tạo revision và recompute affected snapshots; user thấy material revision.

### 12.4 Degraded/manual fallback

| Failure                     | Behavior                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| Provider timeout/rate limit | Dùng last-known value trong staleness window, badge “cũ”, background retry; ledger vẫn hoạt động |
| Price quá stale             | Exclude khỏi “current” total hoặc giữ với cảnh báo tùy user policy; không dùng zero              |
| Instrument không map được   | Review queue; manual instrument/price; không auto-match gần giống                                |
| Corporate action thiếu      | Freeze affected performance confidence, yêu cầu manual review; quantity không tự đoán            |
| FX thiếu                    | Dùng user-provided/last-known rate với disclosure; original currency reports vẫn hoạt động       |
| Import/API lỗi một phần     | Commit atomic per batch policy, row errors downloadable, retry idempotent                        |
| Full external outage        | App chuyển “manual mode”; capture, ledger, plans và old reports vẫn dùng được                    |

### 12.5 Banking/broker integrations về sau

- Read-only và consent granular theo institution/account/data type; OAuth/redirect, không thu bank password.
- Raw source transaction giữ external ID, status và provenance; normalize không xóa raw facts.
- Sync cursor/idempotency, pending→posted lifecycle, deletion/reversal và duplicate across manual/import/connection.
- Connection health, last sync, revoke/delete rõ ràng; degraded state không làm số dư biến mất.
- Triển khai từng connector sau security/legal/operational readiness, không block core roadmap.

## 13. Architecture direction

### 13.1 Logical architecture

```text
Responsive Web/PWA ─┐
Future Native App ──┼── Public/API Gateway + Auth
Admin/Ops ──────────┘          │
                  Domain application services
   Ledger | Planning | Debt | Investment | Insights | Reporting
             │          │          │
        Relational DB  Job/Queue  Object storage
             │          │
        Audit/Outbox  Worker/Scheduler
                         │
          Market data / OCR / future connectors adapters
```

### 13.2 Architecture decisions

- API-first, versioned contracts; web không truy cập database trực tiếp.
- Modular monolith được ưu tiên P1 để giữ transaction integrity và delivery speed; bounded contexts rõ để tách service khi có bằng chứng.
- Background jobs cho import, forecast, snapshot, price fetch, notifications và suggestion eligibility.
- Capacitor/native wrapper là option distribution, không phải nơi chứa logic nghiệp vụ; native app có thể thay client mà giữ API/domain.
- Relational database ưu tiên cho money integrity; decimal precision, constraints và transactional outbox.
- Calculation engine có version + reproducible inputs; reports/cache là projections rebuildable.

### 13.3 API quality requirements

- OpenAPI/schema contract, backward compatibility window, pagination/cursor, field-level authorization.
- Idempotency cho create/import/sync; optimistic concurrency cho edit.
- Error model có stable code, user-safe message và correlation ID.
- Mobile-conscious payload, conditional requests, incremental sync và offline conflict metadata.

## 14. Roadmap và prioritization

### 14.1 Phase 0 — Discovery/foundation (trước build)

- 15–20 qualitative interviews phủ các income patterns và debt/investment maturity.
- Diary study 2–4 tuần về capture, bill timing và khoản vay/cho vay phi chính thức.
- Prototype usability cho quick-add, transfer, debt split, safe-to-spend explanation.
- Accounting golden cases, data model spike, provider bake-off, threat/privacy assessment.
- Chốt legal basis, age policy, data retention và market-data licenses.

**Exit:** problem/solution evidence, accounting cases được Finance/Product/Engineering ký duyệt, prototype task success đạt ngưỡng, scope P1 được khóa.

### 14.2 Phase 1 — Trusted financial picture (MVP)

**Must:**

- Identity, personal workspace, VND base + multi-currency model.
- Accounts/cash/savings; transaction ledger; income/expense/transfer/refund/split.
- Fixed commitments (tiền nhà, trả ngân hàng và khoản gần như cố định), recurring expected items, matching/variance, To Review, CSV/XLSX import và duplicate handling.
- Dashboard, basic forecast, explainable STS, net-worth/cash-flow/P&L reports.
- Payable/receivable profiles, schedules, principal/interest/fee, overdue/reminders, basic simulation.
- Portfolio manual/import activity, gold/equity/bond/crypto/fund/other, price provenance, basic performance.
- Goals, privacy center, export/delete, audit, Vietnamese responsive web/PWA.

**Should:** reconciliation, flexible spending plan, debt-free what-if, email digest, manual valuation reminders.

**Could:** receipt attachment without OCR, installable PWA/offline draft, PDF report.

**Won't in P1:** bank/broker sync, auto-execution, personalized allocation suggestions, household sharing, native binary app, tax module.

**Exit:** accounting golden suite passes; critical security/privacy findings closed; beta WFC/data-quality targets show sustained value; zero known critical calculation defect.

### 14.3 Phase 2 — Adaptive planning and trusted guidance

- Suggestion engine eligibility, explanation, confidence, feedback và apply-to-plan.
- Monthly close/versioned snapshot, custom pay cycles, richer scenario planning.
- Receipt OCR, smarter review rules, progressive categorization automation.
- Corporate actions, lots/FIFO option, TWR/benchmark and better asset coverage.
- Receivable write-off/recovery, more amortization methods.
- Offline-first enhancements, PWA push; native wrapper feasibility/pilot.
- Limited read-only integration pilots nếu readiness đạt.

**Exit:** calibrated suggestion quality and harm guardrails, cohort retention lift without trust regression, integration security/ops readiness.

### 14.4 Phase 3 — Connected ecosystem and native experience

- Native iOS/Android experience hoặc wrapper đã chứng minh, biometric/session controls, widgets/share sheet.
- Scaled bank/broker/e-wallet connectors theo institution; sync health/reconciliation.
- Advanced multi-currency, portfolio analytics và tax-aware data export (không tax advice).
- Optional household/shared planning với permission/consent model riêng.
- Partner/API ecosystem chỉ khi privacy and conflict-of-interest rules được bảo đảm.

### 14.5 MoSCoW tổng hợp

| Must                                                                                                                                            | Should                                                                                                        | Could                                                                    | Won't (3 phases nếu chưa tái quyết định)                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| Correct ledger, transfer/debt rules, net worth, capture/import, forecast/STS, debt/receivable, basic investments, goals, privacy/security/audit | Reconciliation, monthly close, adaptive suggestions P2, OCR, corporate actions, offline, limited integrations | Widgets, advanced benchmark, household P3, partner API, richer education | Custody, money movement, trade execution, guaranteed returns, selling financial data, ads exploiting vulnerability, business accounting |

## 15. Analytics và experimentation

### 15.1 Measurement principles

- Analytics là privacy-by-design: không gửi amount, free-text note, account number, counterparty hoặc attachment.
- `user_id` pseudonymous; workspace/cohort properties coarse; consent và deletion propagate.
- Financial correctness được đo từ server-side audit/aggregates, không chỉ UI event.
- Event schema có owner, version, description, allowed properties và retention.

### 15.2 Core event taxonomy

Naming: `object_action` ở past tense cho completed events; properties dùng snake_case.

| Domain            | Events chính                                                                                                                      | Properties an toàn                                                                                            |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Acquisition/setup | `signup_completed`, `onboarding_goal_selected`, `account_created`, `import_started/completed`                                     | method, module, account_type, currency_count_bucket, row_count_bucket, duration_bucket                        |
| Capture/review    | `quick_add_opened`, `transaction_saved`, `review_item_resolved`, `rule_created`, `duplicate_decision_made`                        | transaction_type, source, confidence_band, review_reason, action, latency_bucket                              |
| Fixed commitments | `commitment_created/updated/paused`, `commitment_occurrence_matched`, `commitment_variance_reviewed`, `commitment_status_changed` | commitment_type, cadence, essential_flag, source, match_method, variance_band, status; không gửi amount/payee |
| Clarity           | `core_signal_viewed`, `signal_drilldown_opened`, `freshness_warning_viewed`                                                       | signal_type, state, confidence_band, age_bucket                                                               |
| Plan/forecast     | `forecast_viewed`, `scenario_changed`, `plan_change_drafted/applied`, `goal_created`                                              | horizon_bucket, scenario, change_type, goal_type                                                              |
| Debt              | `obligation_created`, `installment_linked`, `simulation_run`, `overdue_resolved`                                                  | direction, rate_type, status, scenario_change_type                                                            |
| Investment        | `portfolio_created`, `activity_added`, `price_source_viewed`, `performance_viewed`                                                | asset_class, source_type, freshness_band, metric_type                                                         |
| Close             | `reconciliation_completed`, `monthly_close_started/completed/reopened`                                                            | account_type, difference_bucket, blocker_count_bucket, reason_code                                            |
| Suggestion        | `suggestion_eligible`, `suggestion_shown/opened`, `suggestion_actioned`, `suggestion_outcome_evaluated`                           | class, confidence_band, action, impact_band, reason_code, outcome_band                                        |
| Trust             | `privacy_center_viewed`, `export_requested/completed`, `delete_requested/completed`, `security_setting_changed`                   | request_type, completion_time_bucket, setting_type                                                            |
| Errors            | `import_failed`, `calculation_warning_shown`, `sync_failed`                                                                       | stable_error_code, provider_class, retry_state; không raw payload                                             |

### 15.3 Key funnels/cohorts

- Signup → first account/import → first reviewed data → first core signal → WFC week 1/week 4.
- Import → mapping preview → commit → review completion → reconciliation.
- Suggestion shown → evidence opened → action → plan retained after 7/30 days → outcome/helpfulness.
- Cohorts: manual vs import, fixed vs variable income (self-selected), activated module mix, data completeness; tránh tạo sensitive segmentation không cần thiết.

### 15.4 Experimentation plan

**Phase 0 usability tests:**

- Transfer vs expense comprehension: ≥90% classify correctly after minimal guidance.
- Debt repayment split: ≥85% understand principal is not expense.
- STS explanation: ≥80% identify at least 2 major drivers and horizon.
- Quick-add: median <20s novice, <8s returning in prototype target.

**Phase 1 experiments:**

- Onboarding: goal-first vs account-first; primary metric activation, guardrail wrong opening balance/import abandonment.
- Inbox batching vs guided single review; primary review completion, guardrail incorrect batch approval/undo.
- Setup fixed commitments bằng checklist phổ biến vs phát hiện từ lịch sử; primary metric là tỷ lệ baseline được xác nhận, guardrails là phân loại sai khoản trả nợ và commitment bị tạo trùng.
- STS card presentation range vs single conservative number; primary comprehension/trust, guardrail risky planned spending.
- Daily-close prompt timing; primary voluntary completion, guardrail notification opt-out/stress feedback.

**Phase 2 experiments:**

- Suggestion explanation depth progressive vs full; helpfulness and evidence-open rate, guardrail not-relevant/reversal.
- Confidence label wording; calibrated understanding, not click-through.
- Default scenario base vs conservative cho variable income; plan stability/shortfall avoidance.

Không A/B test làm giảm security/privacy, che nguồn dữ liệu, dùng urgency giả hoặc áp auto-action. High-impact financial experiments cần pre-registration, risk review và rollback threshold.

## 16. Monetization hypothesis

### 16.1 Nguyên tắc

- User trả tiền cho utility, compute, convenience và service — không trả bằng việc bán dữ liệu.
- Core data rights (`FR-004` export, `FR-005` delete), basic double-entry ledger (`FR-012`), quy tắc hạch toán đúng (transfer `FR-013`, tách gốc–lãi–phí `FR-042`) và đối chiếu/sửa sai cơ bản không bao giờ bị paywall.
- Không giới hạn số lượng giao dịch nhập thủ công ở bản Free để tránh làm hỏng tính đầy đủ của dữ liệu — điều kiện tiên quyết của North-star metric **Weekly Financial Clarity (WFC)**.
- Không nhận commission làm thay đổi thứ tự suggestion mà không disclosure; ưu tiên không có ads/lender lead-gen trong giai đoạn đầu.
- Pricing không khai thác khó khăn tài chính hoặc tạo “pay to avoid harm” (ví dụ: không khóa cảnh báo quá hạn nợ/thẻ tín dụng cơ bản hay cảnh báo âm Safe-to-spend).

### 16.2 Value metric và phân tầng gói (Packaging hypothesis)

Đơn vị phân tách giá trị (Value Metric) giữa Free và Paid dựa trên **Tầm nhìn thời gian, Độ sâu tài sản/đầu tư và Mức độ tự động hóa**, chia làm 2 nấc trả phí phù hợp với khả năng chi trả tại Việt Nam:
- **Zenval Core (Free Forever) — “Bức tranh đúng hôm nay”:** Ghi chép thủ công không giới hạn, sổ cái đúng bản chất kế toán, nhắc thói quen 21:00 và nhắc hạn nợ cơ bản, Safe-to-spend cơ bản, dự báo dòng tiền ngắn hạn (14–30 ngày, Base scenario) và theo dõi danh mục đầu tư với giá cập nhật thủ công.
- **Zenval Plus (`39k VND/tháng` | `349k VND/năm`) — “Dòng tiền, Trả nợ & Kế hoạch thích nghi”:** Dành cho đa số người dùng cần kiểm soát dòng tiền, thu nhập biến động, trả nợ và lập kế hoạch mục tiêu với mức giá chỉ `~29.000 VND/tháng` (`<1.000 VND/ngày`). Mở khóa dự báo đa kịch bản (`P25/P50/P75`), Monthly Close, mô phỏng trả nợ What-If, Explainable Suggestions cho dòng tiền/nợ/mục tiêu và 50 lượt Receipt OCR/tháng.
- **Zenval Pro (`79k VND/tháng` | `690k VND/năm`) — “Đầu tư đa tài sản & Tự động hóa chuyên sâu”:** Dành cho nhà đầu tư nắm giữ cổ phiếu, ETF, chứng chỉ quỹ, trái phiếu, vàng/bạc, crypto và đa tiền tệ (`~57.500 VND/tháng` khi mua năm). Bao gồm toàn bộ gói Plus cộng với tự động cập nhật giá thị trường & FX từ provider catalog, hiệu suất XIRR/TWR/Benchmark, cầu nối phân rã hiệu suất, corporate actions, lot-level/FIFO, 150 lượt Receipt OCR/tháng và xuất báo cáo PDF.
- **Zenval Family / Connected (Phase 3, `149k–199k VND/tháng`) — “Hệ sinh thái & Gia đình”:** Không gian tài chính chung có phân quyền riêng tư và đồng bộ tự động read-only với ngân hàng/công ty chứng khoán/ví điện tử.

| Nhóm năng lực | Zenval Core (Free) | Zenval Plus (`39k/tháng` \| `349k/năm`) **[price hypothesis]** | Zenval Pro (`79k/tháng` \| `690k/năm`) **[price hypothesis]** | Zenval Family / Connected (Phase 3) |
| --- | --- | --- | --- | --- |
| **Sổ cái & Nhập liệu** | Giao dịch thủ công không giới hạn (`FR-011`), double-entry (`FR-012`), transfer/split/refund (`FR-013`–`014`), danh mục tiếng Việt (`ADD-02`), CSV/XLSX import cơ bản (`FR-017`), nhắc 21:00 (`ADD-06`) | **Receipt OCR** (`FR-020`, fair-use **50 bill/tháng**), smart review rules & phân loại tự động hàng loạt, reconciliation nâng cao (`FR-019`) | Toàn bộ Plus + **Receipt OCR mở rộng (150 bill/tháng)** | Toàn bộ quyền lợi Pro cho các thành viên trong hộ gia đình |
| **Cam kết, Nợ & Phải thu** | Fixed commitments (`FR-022`–`025`), hồ sơ vay/cho vay & tách gốc–lãi–phí (`FR-040`–`044`), nhắc hạn thẻ tín dụng/khoản vay (`ADD-05`) | **Mô phỏng trả nợ What-If** (Snowball/Avalanche, trả thêm gốc, đổi lãi suất `FR-045`, `ADD-11`), quản lý write-off & thu hồi nợ xấu (`FR-046`) | Toàn bộ quyền lợi Plus | Chia sẻ nghĩa vụ nợ/hóa đơn chung với quyền hiển thị theo vai trò |
| **Kế hoạch, Dự báo & Đóng sổ** | Safe-to-spend cơ bản (`FR-032`), dự báo dòng tiền ngắn hạn (Base scenario), 1–2 mục tiêu hoạt động (`FR-034`), báo cáo Net worth & P&L chuẩn (`FR-035`–`036`) | **Dự báo đa kịch bản** (`Conservative/Base/Optimistic`, dải `P25/P50/P75`, tầm nhìn 3–12 tháng `FR-031`, `ADD-11`), chu kỳ lương tùy chỉnh (`FR-038`), thư viện template tài chính (`ADD-11`), không giới hạn Goals & kiểm tra overlap (`ADD-09`), **Monthly Close** khóa snapshot (`FR-037`) | Toàn bộ quyền lợi Plus + liên kết biến động danh mục đầu tư đa tài sản vào tiến độ Goals | Mục tiêu & ngân sách gia đình với mô hình domestic safety (`OQ-11`) |
| **Đầu tư & Market Data** | Nhập theo đơn giá/tổng giá trị (`ADD-03`), cập nhật giá thủ công (`FR-052`), lãi/lỗ cơ bản (Simple gain) | Theo dõi danh mục cơ bản, nhắc cập nhật định giá thủ công định kỳ, tỷ giá FX tham chiếu EOD cơ bản | **Tự động cập nhật giá thị trường & FX** theo catalog (`FR-057`, `ADD-04`, `ADD-08`), hiệu suất **XIRR, TWR & Benchmark** (`FR-055`), cầu nối phân rã hiệu suất (`FR-053`), corporate actions & lot-level/FIFO (`FR-054`–`055`) | **Đồng bộ tự động Read-only** với Bank/Broker/E-wallet (`FR-056`), xuất dữ liệu phục vụ thuế |
| **Gợi ý & Báo cáo** | Cảnh báo thiếu hụt tiền mặt cơ bản & nhắc chất lượng dữ liệu (`Data quality prompt`) | **Explainable Suggestion Engine** (`FR-060`–`064`) cho thanh khoản, dòng tiền, trả nợ và mục tiêu kèm 1-click *Apply to plan* diff | Toàn bộ Plus + gợi ý cân đối thanh khoản danh mục & xuất báo cáo PDF định kỳ | Gợi ý tối ưu dòng tiền cấp hộ gia đình; B2B2C employee wellness option |
| **Quyền dữ liệu** | Full machine-readable Export (`FR-004`) & Delete (`FR-005`) | Full Export/Delete + lưu trữ lịch sử snapshot/attachment | Full Export/Delete + lịch sử snapshot/attachment & audit mở rộng | Kiểm soát consent và thu hồi quyền chia sẻ độc lập |

### 16.3 Cơ chế chuyển đổi, mức giá và Unit Economics (Cost-to-Serve guardrails)

- **Mức giá giả thuyết cần kiểm chứng (Mô hình 2 nấc trả phí Plus & Pro):**
  - **Zenval Plus (Dòng tiền & Kế hoạch):** `39.000 VND/tháng` hoặc **`349.000 VND/năm`** (~`29.080 VND/tháng` — dưới `1.000 VND/ngày`, tiết kiệm ~25%). Giải quyết rào cản tâm lý cho đại đa số người Việt, trong khi không phát sinh chi phí bản quyền dữ liệu chứng khoán/trái phiếu chuyên sâu.
  - **Zenval Pro (Đầu tư đa tài sản & Tự động hóa):** `79.000 VND/tháng` hoặc **`690.000 VND/năm`** (~`57.500 VND/tháng`, tiết kiệm ~27%). Hướng đúng vào nhóm nhà đầu tư có danh mục tài sản thực tế, sẵn sàng chi trả cho tự động hóa giá thị trường và phân tích XIRR/TWR/Corporate actions.
  - **Không bán gói Lifetime (Trọn đời) đại trà:** Do Zenval có chi phí biến đổi định kỳ theo người dùng (Market Data API, OCR, lưu trữ và connector sau này), chỉ cân nhắc gói *Founding Member có thời hạn (2–3 năm)* hoặc ưu đãi giá năm đầu cho early adopters.
- **Reverse Trial 45 ngày (thay vì 7–14 ngày):**
  - Theo `FR-060`, hệ thống cần tối thiểu 30 ngày và đủ chu kỳ dữ liệu để mở khóa gợi ý cá nhân hóa, đồng thời user cần đi qua kỳ `Monthly Close` đầu tiên (`FR-037`).
  - User mới được trải nghiệm đầy đủ tính năng **Plus/Pro trong 45 ngày** (không yêu cầu thẻ trước). Khi hết hạn mà không nâng cấp, tài khoản hạ về **Zenval Core (Free)** êm ái: giữ nguyên toàn bộ dữ liệu lịch sử, giữ snapshot giá gần nhất (chuyển sang trạng thái manual/stale) và không khóa bất kỳ quyền export/delete nào.
- **Ràng buộc Unit Economics (Cost-to-Serve) để giữ biên lợi nhuận gộp >75% ở cả gói Plus (39k) và Pro (79k):**
  1. **Tách chi phí Market Data (`ADD-04`, `ADD-08`) sang gói Pro:** Chỉ gói Pro mới tiêu thụ dữ liệu giá thị trường tự động đa tài sản. Worker chỉ đồng bộ giá ở cấp độ danh mục mã (`instrument_id`) và lưu vào `PriceSnapshot` dùng chung toàn hệ thống theo lịch EOD hoặc 2–4 mốc/ngày; không dùng real-time tick streaming tính phí royalty trên từng user và không gọi provider API trực tiếp theo từng request của user.
  2. **Tối ưu Receipt OCR bằng On-Device Text Extraction + LLM JSON Parse (`FR-020`):** Nhận diện chữ ngay trên thiết bị/trình duyệt (Apple Vision / ML Kit / WebAssembly) hoặc nén ảnh WebP nhẹ trước khi bóc tách JSON để kéo chi phí xuống `~15–30 VND/hóa đơn`, kết hợp **Fair-Use Quota: 50 hóa đơn/tháng cho Plus** (chi phí `<1.500 VND/tháng`) và **150 hóa đơn/tháng cho Pro** (chi phí `<4.500 VND/tháng`).
  3. **Forecast & Suggestion Engine (`FR-031`, `FR-060`):** Vận hành bằng deterministic rule/scenario engine (`D-008`), không phụ thuộc gọi LLM trên mỗi lần tính toán nên chi phí marginal compute của gói Plus chỉ `~1.800 VND/user/tháng` (đạt biên lợi nhuận gộp **>80%** ngay cả ở mức giá `349k/năm`).
  4. **Kênh thanh toán ưu tiên VietQR:** Ưu tiên thanh toán trực tiếp trên Web/PWA qua **VietQR chuyển khoản định danh tự động** (phí `~0,5%–1,2%`) để không bị phí cố định của cổng thẻ quốc tế ăn mòn giao dịch nhỏ `39.000 VND`. Ở Phase 3, đồng bộ tự động Bank/Broker (`FR-056`) có chi phí aggregator theo kết nối được tách vào gói **Connected/Family (`149k–199k VND/tháng`)** hoặc add-on riêng.

### 16.4 Monetization validation và lộ trình bật theo Phase

- **Phase 0:** Đưa bài kiểm tra **Van Westendorp** (4 câu hỏi độ nhạy giá cho cả 2 nấc Plus 39k và Pro 79k) và phân nhóm tính năng (**MaxDiff**) vào vòng phỏng vấn 15–20 người dùng & Diary Study; chốt báo giá bản quyền B2B Market Data (`ADD-04`) để xác nhận sàn chi phí (cost floor).
- **Phase 1 (MVP):** Chưa xây hệ thống billing/paywall phức tạp để tránh phình scope; gắn nhãn nhẹ `Plus` / `Pro (Miễn phí trong bản Beta)` trên các tính năng nâng cao đã có ở P1 (dự báo đa kịch bản `ADD-11`, mô phỏng trả nợ `FR-045` → nhãn `Plus`; auto market price `ADD-08` → nhãn `Pro`) để đo tỷ lệ sử dụng thực tế của từng phân khúc.
- **Phase 2:** Chính thức bật gói **Zenval Plus** và **Zenval Pro** kèm cơ chế **45-Day Reverse Trial** khi hoàn tất Suggestion Engine (`FR-060`–`064`), Monthly Close (`FR-037`), Receipt OCR (`FR-020`) và Portfolio TWR/Corporate Actions (`FR-054`–`055`).
- **Metrics & Kill criteria:** Đo conversion theo từng gói (Plus vs. Pro), tỷ lệ nâng cấp từ Plus lên Pro, voluntary retention, refund/churn reason, trust score và WFC giữa nhóm Paid vs. Free. Dừng hoặc điều chỉnh ngay nếu monetization làm giảm tỷ lệ hoàn tất nhập liệu cơ bản, giảm export visibility, tăng misleading suggestion hoặc tạo xung đột lợi ích không thể kiểm soát.

## 17. Risks và mitigations

| Risk                                      | Likelihood/Impact | Mitigation                                                                         | Owner đề xuất     |
| ----------------------------------------- | ----------------- | ---------------------------------------------------------------------------------- | ----------------- |
| Sai accounting làm mất trust              | M/H               | Ledger invariants, golden cases, calculation version, kill switch, expert review   | Eng + Product     |
| User bỏ vì nhập liệu nhiều                | H/H               | Fast capture, import, recurring, progressive setup, value before completeness      | Product/Design    |
| Forecast/suggestion gây tự tin giả        | M/H               | Ranges, eligibility, confidence/explanation, conservative guardrails, no execution | Product/Data/Risk |
| Double-count tài sản                      | M/H               | Canonical ownership links, reconciliation, integrity tests                         | Eng/Data          |
| Market data thiếu/sai/license             | H/M-H             | Adapter, bake-off, provenance, stale fallback, legal review                        | Data/Legal        |
| Data breach hoặc insider access           | L-M/H             | Encryption, least privilege, audit, pentest, incident response                     | Security          |
| Quy định Việt Nam thay đổi                | M/H               | Local counsel checkpoints, data map, configurable retention/consent                | Legal             |
| Receivable valuation bị hiểu là chắc chắn | M/M               | Gross vs recoverable, user assumption, warning/confidence                          | Product/Design    |
| Thu nhập mùa vụ không đủ data             | H/M               | Longer horizon, user-declared pattern, limited-evidence mode                       | Data/Product      |
| Scope quá rộng làm chậm MVP               | H/H               | Phase gates, must-have vertical slices, no integrations in P1                      | Leadership        |
| Cross-platform complexity                 | M/M               | API-first/domain logic server-side, responsive PWA first                           | Eng               |
| Notification gây stress/shame             | M/M               | Calm copy, quiet hours, digest, user research                                      | Design/Content    |
| OCR/import tạo duplicate                  | H/M               | Preview, idempotency, duplicate review, rollback                                   | Eng/Data          |

## 18. Assumptions, open questions và decision log

### 18.1 Assumptions requiring validation

1. Người dùng sẵn sàng nhập opening balances và 5–10 transactions để nhận first value.
2. STS có giá trị ngay cả khi chưa có full budgeting.
3. 30–45 ngày và 2 cycles là threshold hợp lý; seasonal users cần ngoại lệ rõ.
4. EOD prices đủ cho P1; realtime không phải core value.
5. Weighted-average cost basis phù hợp default product reporting, không tuyên bố là tax basis.
6. Manual receivable recovery probability có thể hữu ích nếu UI giải thích tốt.
7. Subscription willingness-to-pay tồn tại khi product chứng minh clarity/trust.

### 18.2 Open questions (không block PRD review, phải chốt trước build tương ứng)

| ID    | Câu hỏi                                                                                 | Needed by             | Owner đề xuất   |
| ----- | --------------------------------------------------------------------------------------- | --------------------- | --------------- |
| OQ-01 | Legal age, lawful basis, data residency/retention cụ thể tại Việt Nam?                  | P0 exit               | Legal/Security  |
| OQ-02 | Safe-to-spend horizon mặc định: next reliable income hay rolling 30 ngày khi cả hai có? | P1 design             | Product/Data    |
| OQ-03 | Cash vs accrual treatment cho debt interest trong reports default?                      | P1 accounting signoff | Product/Finance |
| OQ-04 | Payment allocation default có phù hợp hợp đồng phổ biến tại VN?                         | P1 debt design        | Legal/Finance   |
| OQ-05 | Source/provider nào có license phù hợp cho chứng khoán/quỹ/vàng VN?                     | P1 vendor             | Data/Legal      |
| OQ-06 | P1 investment cost basis cần lot-level ngay hay weighted average đủ?                    | P1 scope lock         | Product/Finance |
| OQ-07 | Export format/attachment retention nào đáp ứng portability tốt nhất?                    | P1 privacy design     | Security/Eng    |
| OQ-08 | Threshold completeness/freshness cho suggestion theo cohort?                            | P2 model review       | Data/Product    |
| OQ-09 | Có đưa debt APR-based prioritization vào P2 nếu thiếu prepayment penalty/tax info?      | P2 scope              | Product/Risk    |
| OQ-10 | Native wrapper đủ hay cần full native client theo performance/offline evidence?         | P2 exit               | Eng/Product     |
| OQ-11 | Household permissions và domestic safety model?                                         | Trước P3              | Trust/Safety    |

### 18.3 Decision log

| ID    | Decision                                                                                            | Status                                             | Rationale                                                                                                                                                                                                    |
| ----- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D-001 | Personal-first, Việt Nam-first, VND default, multi-currency-ready                                   | Chốt                                               | Giữ focus nhưng không khóa data model                                                                                                                                                                        |
| D-002 | Web/PWA responsive trước; API độc lập; native về sau                                                | Chốt                                               | Speed + portability                                                                                                                                                                                          |
| D-003 | Manual-first/import; integrations sau                                                               | Chốt                                               | Reliability/market constraints                                                                                                                                                                               |
| D-004 | Transfer và principal movements không tác động P&L                                                  | Chốt                                               | Accounting correctness                                                                                                                                                                                       |
| D-005 | Net worth dùng recoverable receivable value khi có assessment                                       | Chốt định hướng                                    | Tránh thổi phồng; disclosure bắt buộc                                                                                                                                                                        |
| D-006 | Suggestions chỉ sau đủ dữ liệu, explainable, no execution                                           | Chốt                                               | User control/trust                                                                                                                                                                                           |
| D-007 | Budgeting/investment/debt modules optional                                                          | Chốt                                               | Progressive disclosure                                                                                                                                                                                       |
| D-008 | Rule/scenario-first suggestion engine                                                               | Đề xuất                                            | Auditability trước ML complexity                                                                                                                                                                             |
| D-009 | Modular monolith P1                                                                                 | Đề xuất                                            | Transaction integrity và delivery speed                                                                                                                                                                      |
| D-010 | Weighted-average cost basis P1                                                                      | Giả định cần chốt                                  | Scope hợp lý, cần finance/legal review                                                                                                                                                                       |
| D-011 | Cash-basis P&L debt interest default P1                                                             | Giả định cần chốt                                  | Đơn giản cho cá nhân; vẫn theo dõi schedule                                                                                                                                                                  |
| D-012 | Tên sản phẩm chính thức nội bộ là ZENVAL; tagline “Calm numbers. Clear decisions.”; thay thế CLARIX | Chốt nội bộ; public launch pending legal clearance | Kết hợp Zen và Value, phản ánh UX bình tĩnh, không phán xét và quản lý giá trị tài chính toàn diện; public search cho thấy ít collision software/finance hơn CLARIX nhưng vẫn bắt buộc counsel/domain review |

## 19. Launch readiness và cross-functional review checklist

### Product/Design

- Ba core questions trả lời được và có state thiếu dữ liệu.
- User hiểu transfer, principal, STS horizon và net-worth composition.
- Copy calm/nonjudgmental; progressive disclosure; error/recovery paths hoàn chỉnh.
- Empty, loading, stale, offline, error và partial-data states được thiết kế.

### Engineering/Data

- Ledger invariants, idempotency, rounding/FX và golden cases pass.
- Calculation lineage/version/rebuild tested; import rollback/retry tested.
- Load/performance/recovery targets đạt; provider outage không block core.
- API contract và mobile/offline considerations reviewed.

### Security/Privacy/Legal

- Threat model, DPIA/data map, consent/retention, vendor DPA/license hoàn tất.
- Pentest critical/high closed; export/delete/incident drills pass.
- Financial claims/disclaimers và regulatory perimeter reviewed.

### Operations/Support

- Runbook cho calculation incident, provider outage, import corruption, account takeover.
- Support có user-safe diagnostic view không lộ sensitive data.
- Status page/communication templates và escalation owner rõ.

## 20. Phụ lục

### 20.1 Thuật ngữ

| Thuật ngữ         | Định nghĩa trong sản phẩm                                                                                                          |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Account           | Nơi giữ tiền/tài sản hoặc technical account trong ledger                                                                           |
| Business event    | Sự kiện tài chính cấp người dùng tạo một hay nhiều ledger entries                                                                  |
| Ledger entry      | Bút toán nguyên tử tác động account/balance                                                                                        |
| Transfer          | Dịch chuyển giữa tài khoản/tài sản của cùng user; không là income/expense                                                          |
| Payable           | Nghĩa vụ user phải trả                                                                                                             |
| Receivable        | Khoản user có quyền thu                                                                                                            |
| Principal         | Gốc vay/cho vay, không phải income/expense khi giải ngân/hoàn trả                                                                  |
| P&L               | Thu nhập/chi phí/lãi lỗ trong kỳ                                                                                                   |
| Net worth         | Tài sản + khoản phải thu có thể thu hồi − nghĩa vụ nợ                                                                              |
| Safe-to-spend     | Ước tính discretionary cash có thể dùng trong horizon sau reserves/obligations                                                     |
| Fixed commitment  | Khoản user chủ động phải dành trước theo lịch; có thể là expense, debt installment, transfer hoặc saving contribution tùy bản chất |
| Recoverable value | Giá trị khoản phải thu ước tính có thể thu, không phải cam kết                                                                     |
| Realized P&L      | Lãi/lỗ đã hiện thực khi disposal/settlement theo cost basis                                                                        |
| Unrealized P&L    | Chênh lệch giá trị hiện tại và cost basis của holdings còn nắm giữ                                                                 |
| Freshness         | Tuổi của dữ liệu so với thời điểm dùng                                                                                             |
| Confidence        | Mức tin cậy dựa trên completeness, recency, stability và sensitivity                                                               |
| Apply to plan     | Chấp nhận thay đổi kế hoạch; không thực hiện giao dịch thật                                                                        |

### 20.2 Công thức tài chính chuẩn

#### Các khung tài chính cá nhân phổ biến — chỉ là template tùy chỉnh

Zenval có thể cung cấp các template dưới đây để user bắt đầu nhanh, nhưng luôn hiển thị assumptions, cho phép đổi mọi tỷ lệ và không đánh giá user “đúng/sai” theo template:

| Khung                              | Công thức khởi tạo                                                                           | Cách dùng an toàn trong Zenval                                                                   |
| ---------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| 50/30/20                           | 50% needs, 30% wants, 20% saving/debt goals trên take-home income                            | Template ngân sách; user sửa bucket/tỷ lệ, tổng = 100%                                           |
| Fidelity 50/15/5                   | ≤50% essential, 15% retirement trên pretax income, 5% emergency saving trên take-home income | Không cộng trực tiếp các denominator khác nhau; UI giải thích pretax vs take-home                |
| Emergency fund                     | 3–6 tháng essential expenses                                                                 | Goal range, cá nhân hóa theo biến động thu nhập, người phụ thuộc và bảo hiểm                     |
| Pay yourself first                 | `saving/investing contribution` được reserve trước discretionary spending                    | Allocation policy, không tự chuyển tiền                                                          |
| Zero-based / give every unit a job | `income − planned buckets = 0`                                                               | Optional envelope plan; transfer giữa account vẫn non-P&L                                        |
| Debt snowball                      | Ưu tiên dư nợ nhỏ nhất sau minimum payments                                                  | Simulation only; có thể tốn nhiều lãi hơn avalanche                                              |
| Debt avalanche                     | Ưu tiên APR hiệu lực cao nhất sau minimum payments                                           | Simulation dùng rate/fee/penalty thực; không tự trả nợ                                           |
| Retirement milestones              | 1× salary @30, 3× @40, 6× @50, 8× @60, 10× @67                                               | Benchmark tham khảo, không phù hợp mọi quốc gia/thu nhập                                         |
| 4% withdrawal rule                 | Năm đầu rút khoảng 4% portfolio, các năm sau điều chỉnh inflation                            | Scenario tham khảo cho horizon khoảng 30 năm; không phải mức “an toàn” được bảo đảm tại Việt Nam |

Nguồn nghiên cứu ban đầu: CFPB 50/30/20; Fidelity 50/15/5, emergency fund và retirement milestones; Bengen/Trinity research cho withdrawal-rate scenarios. Product/Legal phải review nội dung, thị trường áp dụng và disclaimer trước khi public.

#### Forecast chi phí và dòng tiền

```text
historical_category_estimate = median(eligible actuals in last N complete cycles)
scenario_cost_conservative = max(committed/user upper bound, historical P75)
scenario_cost_base = committed/user plan if present, else historical P50
scenario_cost_optimistic = committed/user lower bound if valid, else historical P25

projected_balance[d] = opening_projected_balance
  + cumulative(weighted inflows through d)
  - cumulative(expected cash outflows through d)
```

`N` mặc định 3–6 và được version hóa; calculation loại transfer, debt/receivable principal, duplicated pending/posted pair và accounting reversal đã net. Tax/fee/interest giữ đúng P&L/cash meaning. Kết quả luôn kèm source, `as_of`, range/confidence và version.

**Net worth**

```text
Net worth(t) = Σ market/liquid value of assets(t)
             + Σ estimated recoverable receivables(t)
             - Σ recognized payable obligations(t)
```

**Net-worth bridge**

```text
NW_end - NW_start
= net earned/saved cash flow
 + investment income
 + realized/unrealized market movement
 + FX effect
 + receivable recovery estimate change
 - fees/taxes/interest expense
 + other valuation adjustments
```

Các components phải tránh double-count và có reconciliation residual; residual vượt tolerance là data-quality warning.

**Debt outstanding**

```text
Principal_outstanding = original principal
                      + additional draws
                      - principal repayments
                      - principal write-offs/forgiveness
```

**Receivable estimated recoverable value (simplified)**

```text
ERV = outstanding principal × recovery_probability
    + eligible accrued interest × interest_recovery_probability
```

Giới hạn bởi claim hợp lệ; probability là input/estimate có timestamp và rationale.

**Investment market value**

```text
Market value = quantity × selected price snapshot × FX rate to base
```

**Realized P&L**

```text
Realized P&L = net sale proceeds - allocated cost basis - disposal fees/taxes
```

**Unrealized P&L**

```text
Unrealized P&L = current market value - remaining cost basis
```

**Money-weighted return/XIRR**

Tìm `r` để NPV của dated external cash flows và ending value bằng 0. Chỉ hiển thị khi có nghiệm hợp lệ; nếu multiple/no solution, giải thích và fallback metric.

**Safe-to-spend**: xem mục 6.5; formula version và policy values phải được lưu cùng result.

### 20.3 Rounding và multi-currency

- Amount money dùng minor unit theo ISO currency; VND display không decimal. Crypto/quantity dùng decimal precision riêng, không ép minor unit fiat.
- Rounding ở leg cuối theo explicit policy và ghi rounding entry nếu cần; không silently drop imbalance.
- Transaction FX có original/source/destination amounts, applied rate và fee. Report conversion không thay transaction fact.
- Khi base currency đổi, historical base views recompute theo selected policy; original amounts giữ nguyên.

### 20.4 Edge cases bắt buộc trong golden test suite

#### Transactions/accounts

1. Transfer giữa hai account cùng currency; edit một leg; delete/reverse transfer.
2. FX transfer có fee ở source và destination, rate khác market rate.
3. Credit-card purchase rồi card payment; không double-count expense.
4. Cash withdrawal/ATM fee; transfer + fee expense.
5. Refund partial/full ở kỳ khác; original đã split/category đổi.
6. Pending import chuyển posted với amount/date thay đổi.
7. Duplicate từ manual + CSV + future connector; user chọn keep both.
8. Opening balance sai và adjustment sau reconciliation.
9. Account archive với recurring rule/goal link còn active.
10. Transaction backdated sau monthly close; snapshot revision.

#### Income/plan/forecast

11. Freelancer nhận hai khoản lớn rồi 45 ngày không thu.
12. Lương bị trễ qua tháng; không tính hai lần expected + actual.
13. Income theo mùa; insufficient cycles, suggestion withheld.
14. Bill cuối tuần/lễ, timezone boundary, leap day.
15. STS âm; receivable probability 30%; bill amount range.
16. One-off medical expense bị hiểu nhầm recurring; user corrects.
17. Hai goals cùng link một savings account; allocation >100% bị chặn/cảnh báo.
18. User không dùng budgeting nhưng vẫn xem forecast/net worth.

#### Debt/receivable

19. Vay 100m: cash +100m, payable +100m, income 0.
20. Cho vay 20m: cash −20m, receivable +20m, expense 0.
21. Installment split gốc/lãi/phí, partial payment và late fee.
22. Extra payment có prepayment fee; debt-free simulation vs actual.
23. Variable-rate loan đổi rate giữa kỳ; schedule version.
24. Debt forgiveness/restructuring/refinance; không tạo transfer giả.
25. Receivable overdue, recovery probability từ 100% xuống 20%, sau đó thu lại một phần.
26. Write-off rồi recovery; report không double-count income.
27. Overpayment làm payable âm; chuyển thành receivable/credit hay explicit state.
28. User vừa payable vừa receivable cùng counterparty; không net tự động nếu không xác nhận/pháp lý.

#### Investments/market data

29. Buy/sell partial nhiều lần, fees in different currency.
30. Dividend cash vs reinvested dividend; withholding tax.
31. Stock split 2:1, reverse split và fractional cash-in-lieu.
32. Bonus/right issue, merger/spin-off không đủ cost allocation.
33. Transfer holding giữa brokers giữ acquisition/cost basis.
34. Symbol đổi/delisted; provider correction/backfill.
35. Crypto 8+ decimals; fee paid bằng một token khác.
36. Gold manual price theo chỉ/lượng/gram; unit conversion rõ.
37. Bond coupon/accrued interest/maturity; price clean/dirty ambiguity phải disclosure/manual.
38. Fund NAV stale nhiều ngày; weekend/holiday.
39. Real estate manual valuation và loan liên quan; không tự net nếu user cần xem gross.
40. XIRR không có nghiệm/nhiều nghiệm; không hiển thị con số sai.

#### Privacy/reliability

41. Export khi background import đang chạy; consistent cutoff.
42. Delete user với attachments, audit, backup và future provider token.
43. Retry save sau timeout; idempotency prevents duplicate.
44. Provider outage: last price stale, net worth không về 0.
45. Offline edits cùng transaction trên hai devices; conflict resolution.
46. Admin support access; approval/audit/redaction.

#### Suggestions

47. Dữ liệu 29 ngày/thiếu cycle: no allocation suggestion.
48. User có high-interest overdue debt và mục tiêu đầu tư: conflict disclosed, no instrument advice.
49. Suggestion input thay đổi sau phát hành: invalidate/refresh.
50. Apply to plan rồi undo; ledger unchanged.
51. Not relevant suppresses repeat; material change permits new suggestion with explanation.
52. Conservative scenario cho thấy shortfall dù base positive: suggestion không tăng discretionary allocation.
53. Tiền nhà ngày 31 hằng tháng: tháng 2 dùng last-day policy, lịch sử due date vẫn truy vết được.
54. Khoản thuê tăng từ 10m lên 11m từ tháng sau: `this and future` không sửa các kỳ đã paid.
55. Actual tiền internet cao hơn tolerance: occurrence vào review, không tự sửa amount chuẩn.
56. Khoản trả ngân hàng xuất hiện đồng thời từ debt schedule và fixed commitment: merge/link, không reserve hoặc report hai lần.
57. Trả khoản vay gồm gốc/lãi/phí khác schedule: match được nhưng bắt user review split; P&L chỉ nhận lãi/phí.
58. User skip/tạm dừng commitment essential: conservative forecast cảnh báo nhưng tôn trọng quyết định và giữ audit.
59. Commitment thanh toán bằng account khác dự kiến hoặc chia thành hai giao dịch: hỗ trợ manual multi-transaction match mà không vượt occurrence total.
60. Giao dịch định kỳ được phát hiện từ lịch sử nhưng là one-off/seasonal: suggestion không tự tạo rule; user chọn Not recurring.

### 20.5 Accounting examples

| Sự kiện                               |                      Tác động assets | Tác động liabilities/receivables |                                                       P&L |
| ------------------------------------- | -----------------------------------: | -------------------------------: | --------------------------------------------------------: |
| Nhận lương 30m                        |                            Cash +30m |                                — |                                               Income +30m |
| Chuyển 5m bank → savings              |                Bank −5m, savings +5m |                                — |                                                         0 |
| Vay 100m nhận vào bank                |                           Cash +100m |                    Payable +100m |                                                         0 |
| Trả kỳ 6m: gốc 5m, lãi 0.8m, phí 0.2m |                             Cash −6m |                      Payable −5m |                                                Expense 1m |
| Cho bạn vay 20m                       |                            Cash −20m |                  Receivable +20m |                                                         0 |
| Thu 10.5m: gốc 10m, lãi 0.5m          |                          Cash +10.5m |                  Receivable −10m |                                               Income 0.5m |
| Mua cổ phiếu 10m + phí 20k            | Cash −10.02m, investment asset +cost |                                — | Fee theo performance/cost policy, không expense tiêu dùng |
| Giá cổ phiếu tăng 2m chưa bán         |                 Investment value +2m |                                — |                Unrealized gain 2m, không operating income |

### 20.6 Definition of Done cho một financial feature

Một feature chỉ “Done” khi:

- Business/accounting rule và examples được sign off.
- Happy path, empty/error/stale/offline/reversal/backdated states có spec.
- Authorization, audit, export/delete và analytics impacts được review.
- Calculation golden tests + property/invariant tests pass.
- Accessibility và Vietnamese content QA pass.
- Observability, runbook, rollback/kill switch (nếu consequential) sẵn sàng.
- User-facing source, timestamp, assumptions và limitations hiển thị nơi cần.

---

## Kết luận đề xuất cho review

Phase 1 nên được đánh giá như một **trusted financial picture + planning foundation**, không phải một expense tracker mở rộng. Ranh giới quan trọng nhất là: sổ cái và provenance phải đúng; STS/forecast phải giải thích được; debt/receivable và investment không làm sai P&L/net worth; automation tăng dần sau review; suggestion chỉ xuất hiện khi đủ bằng chứng và chỉ thay đổi kế hoạch sau xác nhận. Mọi quyết định scope tiếp theo nên được kiểm tra against ba lời hứa: **bức tranh đúng, kế hoạch thực tế, gợi ý có thể kiểm chứng**.
