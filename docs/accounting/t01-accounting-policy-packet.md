# T01 — Accounting policies và golden cases: gói chuẩn bị

Status: DRAFT cho review · Verdict: **chưa có** (GO/REVISE/STOP thuộc Product/Finance/Engineering) · Issue: [#8](https://github.com/pvnamGit/zenval/issues/8)
Nguồn code: `main@10d0858`, 07/11/2026. Đây là kiểm kê nguồn và gói quyết định, không phải kết quả test mới, chính sách kế toán đã duyệt hay tư vấn tài chính/thuế.

> Tài liệu này chỉ chuẩn bị. Không chốt công thức, classification, rounding, FX, STS horizon, interest
> treatment, payment allocation hay cost basis thay Product/Finance. Mọi quyết định ở §4 giữ **Open** cho tới
> khi owner ghi ngày + kết luận. Mọi số liệu là ví dụ tổng hợp lấy từ PRD §20.5, không phải dữ liệu người dùng.

## 1. Kiểm kê Money/BusinessEvent hiện có (quan sát từ code)

| #   | Thành phần                   | Bằng chứng                                                                                                                                  | Đã kiểm thử                                                                                                                                                               |
| --- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| E1  | `Money` (decimal.js)         | [`money.ts`](../../packages/shared-kernel/src/money/money.ts): `from`, `zero`, `add`, `negate`, `isZero`, `equals`                          | [`money.test.ts`](../../packages/shared-kernel/src/money/money.test.ts): `0.1+0.2=0.3`; cộng khác currency bị chặn                                                        |
| E2  | `Currency`                   | [`currency.ts`](../../packages/shared-kernel/src/money/currency.ts): regex `^[A-Z]{3}$`                                                     | Không có test riêng                                                                                                                                                       |
| E3  | `BusinessEvent.post`         | [`business-event.ts`](../../packages/contexts/ledger/src/domain/business-event.ts): ≥2 entries, tổng bằng 0                                 | [`business-event.test.ts`](../../packages/contexts/ledger/src/domain/business-event.test.ts): transfer cân bằng; event lệch bị chặn                                       |
| E4  | Ràng buộc workspace trong DB | `migrations/0002_ledger_workspace_integrity.sql`: FK `(business_event_id, workspace_id)`                                                    | [`ledger-workspace.integration.test.ts`](../../packages/database/src/ledger-workspace.integration.test.ts), chỉ chạy khi `ZENVAL_DATABASE_INTEGRATION=1` + `DATABASE_URL` |
| E5  | Lưu trữ số tiền              | `ledger_entry.amount numeric(38,12)`, `currency text CHECK (currency ~ '^[A-Z]{3}$')` — chỉ kiểm định dạng (xem M3); plaintext (xem T02 G1) | Không có test precision/scale                                                                                                                                             |

### Khoảng cách so với PRD §20.3/§10.4 (để T11 xử lý sau khi T01 có quyết định)

| Gap | Hiện trạng                                                                                      | Yêu cầu nguồn                                                          | Phụ thuộc quyết định |
| --- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------- |
| M1  | `Money.from("0.5", "VND")` được chấp nhận; không kiểm minor unit theo currency                  | §20.3: amount dùng minor unit ISO; VND không decimal                   | R-01                 |
| M2  | Không có API rounding/allocate/multiply; không có rounding entry                                | §20.3: rounding ở leg cuối theo policy, ghi rounding entry, không drop | R-01                 |
| M3  | `Currency` chỉ kiểm định dạng, không kiểm danh mục ISO 4217 hay số chữ số thập phân             | §20.3                                                                  | R-01                 |
| M4  | Không có kiểu quantity/price riêng cho crypto/chứng khoán/vàng                                  | §20.3: quantity dùng precision riêng, không ép minor unit fiat         | R-02, OQ-06          |
| M5  | `BusinessEvent` khác currency chỉ bị chặn gián tiếp qua `add` (không có test); không mô hình FX | §20.3: FX có original/source/destination amount, rate, fee             | R-02                 |
| M6  | Không có classification (income/expense/transfer/principal) trên entry/account                  | D-004, §10.4                                                           | R-03, R-05           |
| M7  | Entry không mang `workspaceId` trong domain; entry 0 và account trùng không bị chặn             | AGENTS invariant; §10.4                                                | Engineering (T11)    |
| M8  | Không có reversal/correction, lineage hay `calculation_version`                                 | §10.4, §20.6                                                           | R-07                 |

Kết luận kiểm kê: hiện chỉ có **2 golden-like assertion** cho ledger (transfer cân bằng, event lệch bị chặn). Không case nào trong PRD §20.4 (1–60) được bao phủ đầy đủ. Demo idempotency trong API (`demo-finance.service.ts`) không phải ledger evidence.

## 2. Phương trình kế toán trước/sau theo loại movement

Quy ước: `Assets = Liabilities + Equity`; ΔEquity trong kỳ = P&L (+ valuation). Receivable là asset. Ví dụ từ PRD §20.5 (đơn vị m = triệu VND, tổng hợp). Cột "Trạng thái" phân biệt quy tắc PRD đã **Chốt** với chỗ cần quyết định.

| Movement                                | ΔAssets                                 | ΔLiabilities              | ΔEquity / P&L                    | Âm tính bắt buộc (không được xảy ra)         | Trạng thái                                                 |
| --------------------------------------- | --------------------------------------- | ------------------------- | -------------------------------- | -------------------------------------------- | ---------------------------------------------------------- |
| Nhận lương 30m                          | Cash +30                                | 0                         | Income +30                       | —                                            | Chốt (§20.5)                                               |
| Chuyển 5m bank → savings                | Bank −5, Savings +5                     | 0                         | 0                                | Không tạo income/expense                     | Chốt (D-004)                                               |
| Vay 100m                                | Cash +100                               | Payable +100              | 0                                | Không ghi income 100                         | Chốt (D-004)                                               |
| Trả kỳ 6m: gốc 5, lãi 0.8, phí 0.2      | Cash −6                                 | Payable −5                | Expense −1 (lãi 0.8 + phí 0.2)   | Không ghi expense 6                          | Chốt hướng; allocation OQ-04, ghi nhận OQ-03               |
| Cho vay 20m                             | Cash −20, Receivable +20                | 0                         | 0                                | Không ghi expense 20                         | Chốt (D-004)                                               |
| Thu 10.5m: gốc 10, lãi 0.5              | Cash +10.5, Receivable −10              | 0                         | Income +0.5                      | Không ghi income 10.5                        | Chốt hướng; allocation OQ-04                               |
| Mua thẻ tín dụng 2m, sau đó trả thẻ 2m  | (1) 0 · (2) Cash −2                     | (1) Card +2 · (2) Card −2 | (1) Expense −2 · (2) 0           | Trả thẻ không phải expense thứ hai           | Chốt (PRD §20.4 #3, skill invariant); mô hình account R-05 |
| Rút ATM 2m + phí 0.01m                  | Bank −2.01, Cash +2                     | 0                         | Expense −0.01                    | Rút tiền không phải expense                  | Chốt hướng (§20.4 #4)                                      |
| Refund 0.5m của khoản chi kỳ trước      | Cash +0.5                               | 0                         | +0.5                             | Không ghi income mới nếu policy là giảm chi  | **Open** R-03                                              |
| Mua cổ phiếu 10m + phí 0.02m            | Cash −10.02, Investment +10 hoặc +10.02 | 0                         | 0 hoặc −0.02                     | Phí không là chi tiêu sinh hoạt              | **Open** R-04, OQ-06                                       |
| Giá cổ phiếu tăng 2m chưa bán           | Investment value +2                     | 0                         | Unrealized +2 (không operating)  | Không vào cash forecast/STS                  | Chốt (§20.5, §6.5)                                         |
| Xóa nợ phải thu 5m (write-off)          | Receivable −5                           | 0                         | Loss −5                          | —                                            | Chốt hướng (§6.7); chi tiết R-09, T43                      |
| Thu hồi 2m sau write-off                | Cash +2                                 | 0                         | Recovery income +2 (liên kết)    | Không double-count với principal đã xóa      | Chốt hướng (§6.7); R-09                                    |
| Chuyển FX 100 USD → VND, có phí hai đầu | USD −(100+fee), VND +x                  | 0                         | Fee expense; chênh lệch tỷ giá ? | Report conversion không sửa transaction fact | **Open** R-02                                              |
| Trả dư làm payable âm                   | Cash −y                                 | Payable −y (âm?)          | 0                                | Không tự đổi thành income                    | **Open** R-06 (§20.4 #27)                                  |

Mỗi dòng sẽ thành một golden fixture có assertion hai phía (entries + P&L + Δnet worth) và một negative case.

## 3. Golden-case coverage matrix (PRD §20.4 + §20.5)

Cột "Quyết định" là ID ở §4 cần chốt trước khi viết expected value. "Task" là nơi test chạy được. Coverage hiện tại: **—** = không có; **partial** = có một phần assertion.

| #     | Case (rút gọn)                                        | Quyết định             | Task        | Coverage                       |
| ----- | ----------------------------------------------------- | ---------------------- | ----------- | ------------------------------ |
| 1     | Transfer cùng currency; edit leg; reverse             | R-07                   | T11/T12     | partial (E3: posting cân bằng) |
| 2     | FX transfer, phí hai đầu, rate ≠ market               | R-01, R-02             | T11/T12     | —                              |
| 3     | Mua thẻ tín dụng rồi trả thẻ                          | R-05                   | T12         | —                              |
| 4     | Rút ATM + phí                                         | —                      | T12         | —                              |
| 5     | Refund partial/full kỳ khác, original đã split        | R-03                   | T13         | —                              |
| 6     | Pending import → posted, amount/date đổi              | R-07                   | T16         | —                              |
| 7     | Duplicate manual + CSV + connector                    | —                      | T16         | —                              |
| 8     | Opening balance sai, adjustment sau reconcile         | R-07                   | T17         | —                              |
| 9     | Archive account còn recurring/goal link               | —                      | T12/T23     | —                              |
| 10    | Backdated sau monthly close, snapshot revision        | R-07                   | T20/T42     | —                              |
| 11    | Freelancer 2 khoản lớn rồi 45 ngày không thu          | OQ-02                  | T21         | —                              |
| 12    | Lương trễ qua tháng, không tính hai lần               | OQ-02                  | T21         | —                              |
| 13    | Income mùa vụ, thiếu cycle → withhold                 | OQ-02                  | T21/T45     | —                              |
| 14    | Bill cuối tuần/lễ, timezone, leap day                 | R-08                   | T14         | —                              |
| 15    | STS âm, receivable 30%, bill range                    | OQ-02                  | T21         | —                              |
| 16    | One-off y tế bị hiểu là recurring                     | —                      | T14/T15     | —                              |
| 17    | Hai goal cùng link một savings, >100%                 | —                      | T23         | —                              |
| 18    | Không budgeting vẫn xem forecast/net worth            | OQ-02                  | T21         | —                              |
| 19    | Vay 100m                                              | — (D-004)              | T18         | —                              |
| 20    | Cho vay 20m                                           | — (D-004)              | T18         | —                              |
| 21    | Installment gốc/lãi/phí, partial, late fee            | OQ-03, OQ-04           | T18         | —                              |
| 22    | Extra payment có prepayment fee                       | OQ-04                  | T18/T26     | —                              |
| 23    | Variable rate đổi giữa kỳ, schedule version           | OQ-03, R-07            | T18         | —                              |
| 24    | Forgiveness/restructure/refinance                     | OQ-03                  | T18         | —                              |
| 25    | Receivable overdue, probability 100→20%, thu một phần | —                      | T18         | —                              |
| 26    | Write-off rồi recovery                                | R-09                   | T43         | —                              |
| 27    | Overpayment làm payable âm                            | R-06                   | T18         | —                              |
| 28    | Payable + receivable cùng counterparty, không net     | —                      | T18         | —                              |
| 29    | Buy/sell partial nhiều lần, fee khác currency         | OQ-06, R-02, R-04      | T25         | —                              |
| 30    | Dividend cash vs reinvest, withholding tax            | OQ-06                  | T25         | —                              |
| 31    | Split 2:1, reverse split, cash-in-lieu                | OQ-06                  | T44         | —                              |
| 32    | Bonus/right, merger/spin-off thiếu allocation         | OQ-06                  | T44         | —                              |
| 33    | Chuyển holding giữa broker giữ cost basis             | OQ-06                  | T25         | —                              |
| 34    | Symbol đổi/delisted, provider correction              | R-07                   | T24         | —                              |
| 35    | Crypto 8+ decimals, fee bằng token khác               | R-01, OQ-06            | T25         | —                              |
| 36    | Vàng giá thủ công chỉ/lượng/gram                      | R-01                   | T24/T25     | —                              |
| 37    | Bond coupon/accrued, clean/dirty                      | OQ-06                  | T25         | —                              |
| 38    | Fund NAV stale qua cuối tuần/lễ                       | R-02                   | T24         | —                              |
| 39    | BĐS định giá thủ công + khoản vay, không tự net       | —                      | T25/T20     | —                              |
| 40    | XIRR không/nhiều nghiệm                               | —                      | T25         | —                              |
| 41    | Export khi import đang chạy, cutoff nhất quán         | —                      | T28         | —                              |
| 42    | Delete user với attachment/audit/backup               | (T02 OQ-01d)           | T28         | —                              |
| 43    | Retry save sau timeout, idempotency                   | —                      | T11         | — (demo Map không tính)        |
| 44    | Provider outage, net worth không về 0                 | R-02                   | T24/T20     | —                              |
| 45    | Offline edit hai thiết bị, conflict                   | —                      | T31/T41     | —                              |
| 46    | Admin support access, audit/redaction                 | (T02)                  | T30         | —                              |
| 47    | 29 ngày dữ liệu → không suggestion                    | (OQ-08)                | T45         | —                              |
| 48    | Nợ quá hạn lãi cao + mục tiêu đầu tư                  | (OQ-09)                | T45         | —                              |
| 49    | Input suggestion đổi → invalidate                     | R-07                   | T45         | —                              |
| 50    | Apply to plan rồi undo, ledger không đổi              | —                      | T45/T22     | —                              |
| 51    | Not relevant suppress; material change cho phép       | —                      | T45         | —                              |
| 52    | Conservative shortfall dù base dương                  | OQ-02                  | T21/T45     | —                              |
| 53    | Tiền nhà ngày 31, tháng 2 last-day                    | R-08                   | T14         | —                              |
| 54    | Thuê 10m → 11m `this and future`                      | R-07                   | T14         | —                              |
| 55    | Actual vượt tolerance → review                        | —                      | T15         | —                              |
| 56    | Debt schedule trùng fixed commitment → link, không x2 | OQ-04                  | T19         | —                              |
| 57    | Trả vay khác schedule → review split                  | OQ-03, OQ-04           | T19         | —                              |
| 58    | Skip commitment essential, conservative cảnh báo      | OQ-02                  | T14/T21     | —                              |
| 59    | Commitment trả bằng account khác/hai giao dịch        | —                      | T15         | —                              |
| 60    | Recurring phát hiện nhưng one-off/seasonal            | —                      | T15         | —                              |
| X1–X8 | 8 accounting examples PRD §20.5                       | §2 ở trên; X7 cần R-04 | T11/T18/T25 | —                              |

Các case 41–52 thuộc privacy/reliability/suggestion: T01 chỉ cung cấp invariant (ledger không đổi, không double-count); expected behavior cụ thể thuộc owner của task tương ứng.

## 4. Decision packet (Open — chờ owner)

| ID    | Câu hỏi                                                                                                        | Lựa chọn và hệ quả cần cân nhắc                                                                                                                                                                   | Cần bởi        | Owner đề xuất       | Trạng thái |
| ----- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ------------------- | ---------- |
| OQ-02 | STS horizon mặc định khi có cả "kỳ thu nhập đáng tin cậy kế tiếp" và rolling 30 ngày                           | (a) next reliable income: sát nhịp lương, ngắn khi lương sắp về; (b) rolling 30 ngày: ổn định cho freelancer; (c) min/max của hai. Cần định nghĩa "reliable" (số cycle, độ lệch ngày) và timezone | T21 design     | Product/Data        | Open       |
| OQ-03 | Lãi vay trong report mặc định: cash basis hay accrual (D-011 là giả định cash)                                 | Cash: đơn giản, khớp sao kê; net worth thiếu lãi tích lũy. Accrual: đúng nghĩa vụ hơn, cần schedule/rate tin cậy và entry accrual/reversal. Ảnh hưởng case 21, 23, 24, 57                         | T18 signoff    | Product/Finance     | Open       |
| OQ-04 | Payment allocation mặc định (PRD giả định fee → interest → principal)                                          | Cần đối chiếu hợp đồng phổ biến VN (ngân hàng, công ty tài chính, vay cá nhân); quy định override theo hợp đồng; xử lý late fee, prepayment fee, partial payment                                  | T18 design     | Legal/Finance       | Open       |
| OQ-06 | Cost basis P1: weighted average (D-010) hay lot-level                                                          | WAC: đơn giản, đủ cho tổng quan; không hỗ trợ FIFO/specific-lot cho thuế. Lot-level: chính xác hơn, tăng scope T25/T44 và dữ liệu nhập                                                            | T25 scope lock | Product/Finance     | Open       |
| R-01  | Rounding: minor unit theo currency, rounding mode (half-even/half-up), vị trí rounding leg, precision quantity | Cần bảng currency → số chữ số; mode cho phân bổ/chia (split, FX, allocation); account nhận rounding residual; precision lưu trữ vs hiển thị (hiện DB `numeric(38,12)`)                            | T11            | Finance/Engineering | Open       |
| R-02  | FX: rate type ưu tiên, nguồn rate, chênh lệch rate giao dịch vs market, base currency đổi                      | Chênh lệch ghi FX gain/loss, fee hay chỉ phản ánh ở valuation; tolerance stale theo asset class; thứ tự fallback user/last-known (§12.3–12.4)                                                     | T11/T24        | Finance/Data        | Open       |
| R-03  | Refund: giảm expense (contra) theo category gốc hay income riêng; kỳ ghi nhận                                  | Contra-expense theo category gốc giữ báo cáo chi tiêu thật; refund kỳ khác có thể làm chi tiêu kỳ đó âm. Cần quy tắc khi original đã split/đổi category (case 5)                                  | T13            | Product/Finance     | Open       |
| R-04  | Phí mua tài sản đầu tư: vốn hóa vào cost basis hay ghi expense đầu tư riêng                                    | Vốn hóa: realized P&L phản ánh phí; expense riêng: dễ thấy chi phí giao dịch. Ảnh hưởng X7, case 29, 35                                                                                           | T25            | Product/Finance     | Open       |
| R-05  | Mô hình thẻ tín dụng: account liability riêng, statement/due, trả tối thiểu                                    | Liability account là điều kiện để case 3 không double-count; cần quyết định cách hiển thị dư nợ thẻ trong STS/net worth                                                                           | T12            | Product/Finance     | Open       |
| R-06  | Overpayment payable                                                                                            | Cho phép payable âm có state rõ, chuyển thành receivable/credit, hoặc chặn và yêu cầu user chọn (case 27)                                                                                         | T18            | Product/Finance     | Open       |
| R-07  | Correction/lineage: reversal entry vs revision, `calculation_version`, snapshot revision                       | Đề xuất kỹ thuật: posted fact chỉ sửa bằng reversal + repost có liên kết; derived value mang source, `as_of`, version. Cần Finance xác nhận ý nghĩa báo cáo khi backdated sau close               | T11/T20        | Engineering/Finance | Open       |
| R-08  | Lịch due date: last-day-of-month, cuối tuần/lễ, timezone người dùng                                            | Giữ ngày gốc + ngày hiệu lực; dời trước/sau ngày lễ; lịch lễ VN lấy từ đâu (case 14, 53)                                                                                                          | T14            | Product             | Open       |
| R-09  | Write-off/recovery: phân loại loss và recovery income, liên kết với claim gốc                                  | §6.7 ghi "theo policy": cần quyết định loại P&L (bad-debt expense vs contra-income), kỳ ghi nhận, cách report để không double-count (case 26)                                                     | T43            | Product/Finance     | Open       |

Không cần quyết định mới (đã **Chốt** trong PRD §18.3): D-001 VND default/multi-currency-ready; D-004 transfer/principal không tác động P&L. D-005 (**Chốt định hướng**, chưa chốt chi tiết) net worth dùng recoverable value khi có assessment (cần disclosure).

## 5. Định dạng golden fixture đề xuất (chưa triển khai)

Fixture tổng hợp, framework-free, đặt cạnh domain test khi T11/T18/T25 bắt đầu. Mỗi fixture tham chiếu policy version đã duyệt; không có expected value cho case phụ thuộc quyết định Open. Ví dụ dùng quy ước dấu debit dương / credit âm (khớp `BusinessEvent` tổng bằng 0); quy ước này là đề xuất kỹ thuật, chốt trong T11. Riêng `pnl`/`net_worth_delta` dùng dấu kinh tế: âm = lỗ/giảm.

> Ví dụ X4 dưới đây **chỉ minh họa định dạng**: số lấy nguyên văn từ PRD §20.5 theo giả định cash basis D-011, allocation được đưa vào làm input. Không phải expected value đã duyệt; OQ-03/OQ-04 vẫn Open.

```yaml
id: X4-installment-split
policy_refs: [D-004, OQ-03@<approved-version>, OQ-04@<approved-version>]
workspace: ws-synthetic-1
given:
  - event: debt_payment
    currency: VND
    amount: "6000000"
    allocation: { principal: "5000000", interest: "800000", fee: "200000" }
expect:
  entries:
    - { account: cash, amount: "-6000000" }
    - { account: payable, amount: "5000000" } # giảm nợ
    - { account: interest_expense, amount: "800000" }
    - { account: fee_expense, amount: "200000" }
  pnl: "-1000000"
  net_worth_delta: "-1000000"
negative:
  - "expense total must not equal 6000000"
  - "entries must balance to zero in VND"
```

## 6. Việc cần con người

1. Chỉ định owner cá nhân Product, Finance, Engineering (hiện chỉ là vai trò đề xuất).
2. Finance/Product review §2 (đúng nghĩa kế toán từng dòng) và trả lời §4 với ngày + kết luận GO/REVISE/STOP.
3. Legal/Finance đối chiếu OQ-04 với mẫu hợp đồng vay phổ biến tại VN.
4. Sau quyết định: ghi ADR trong `architecture/adr`, cập nhật PRD §18.3, rồi mở child slice golden suite cho T11 (Money/rounding/posting), T18 (debt), T21 (STS), T25 (investment).

## Handoff

Đã làm: kiểm kê Money/BusinessEvent/DB, gap M1–M8, bảng phương trình kế toán theo movement, coverage matrix 60 case + 8 ví dụ, decision packet và định dạng fixture đề xuất.
Chưa làm và **không được tự làm**: chốt công thức/classification/policy, viết expected value cho case phụ thuộc quyết định Open, đổi code Money/Ledger, accept T01. Issue #8 giữ Draft/In progress cho tới khi owner review; không chuyển Done.
