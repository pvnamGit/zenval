# T00 — Đề cương nghiên cứu discovery

Trạng thái: **dự thảo chuẩn bị**, chưa tuyển người, chưa thu thập dữ liệu, chưa được Product/Design review. Chủ trì, lịch, consent, công cụ lưu trữ và ngưỡng vận hành phải được người phụ trách xác nhận trước khi nghiên cứu. Nguồn: [backlog T00](../spec-kit/tasks.md), [PRD §14.1, §15.4 và §16.4](../PRD.md), [Features §1](../FEATURES.md). Tài liệu này không xác nhận Phase 0 exit, scope P1 hay quy tắc tài chính.

## Mục tiêu và tuyển mẫu

Tìm hiểu cách người dùng ghi chép, thời điểm hóa đơn và quản lý vay/cho vay; kiểm tra khả năng sử dụng và diễn giải prototype. Dự kiến phỏng vấn **15–20 người**, bao phủ thu nhập cố định, biến động/hỗn hợp và mức độ trải nghiệm nợ/đầu tư khác nhau. Đây là nghiên cứu định tính, không đại diện cho toàn bộ thị trường. Lập bảng tuyển mẫu theo mã nghiên cứu và nhóm rộng; không ghi tên, liên hệ hoặc dữ liệu tài chính cá nhân vào repo. Ghi số được mời, đồng ý, hoàn thành và lý do bỏ dở ở dạng tổng hợp; không suy đoán các ô trống.

Diary kéo dài **2–4 tuần** về capture, thời điểm hóa đơn và vay/cho vay không chính thức. Người phụ trách chọn thời lượng, nhóm diary, lịch nhắc và tiêu chí tuyển trước khi chạy; ghi rõ lựa chọn và số thực tế trong báo cáo. Không suy ra số người diary từ mục tiêu phỏng vấn.

## An toàn dữ liệu và điều kiện chạy

Trước khi tuyển hoặc thu thập, Product/Design phối hợp Security/Legal xác định nội dung đồng ý tham gia, độ tuổi đủ điều kiện, nơi lưu và quyền truy cập, thời hạn lưu/xóa, xử lý rút consent, ghi âm và phương thức bồi dưỡng. Các quyết định T02 vẫn đang mở; không coi đề cương này là phê duyệt pháp lý. Thông báo rằng tham gia là tự nguyện, có thể bỏ qua câu hỏi/dừng; không yêu cầu số tài khoản, ảnh sao kê, mật khẩu, số tiền hay thông tin định danh thật. Dùng dữ liệu giả do người nghiên cứu cung cấp. Không đưa ghi âm, transcript thô, ảnh màn hình chứa dữ liệu cá nhân hoặc thông tin liên hệ vào repo. Chỉ công bố tổng hợp đã rà soát riêng tư; nhóm quá nhỏ hoặc trích dẫn có thể nhận diện cần được xử lý theo quyết định của người phụ trách.

## Phỏng vấn và prototype

Dùng câu hỏi mở, không gợi ý câu trả lời: lần gần đây bạn ghi lại khoản tiền là khi nào và điều gì khiến việc đó khó? Bạn nhớ hoặc kiểm tra hóa đơn sắp đến như thế nào? Nếu phù hợp, bạn theo dõi khoản vay/cho vay ra sao? Khi cân nhắc chi tiêu, bạn cần biết điều gì và tin vào nguồn nào? Yêu cầu kể hành vi thực tế mà không cung cấp số tiền hay danh tính. Ghi các tình huống không phù hợp và câu hỏi người tham gia bỏ qua.

Chạy [prototype cục bộ](../../design/README.md) với fixture synthetic; đây là mô phỏng trong phiên, không phải hệ thống production. Người điều phối kiểm tra trước phiên rằng luồng và dữ liệu hiển thị phù hợp; nếu thao tác chưa được hỗ trợ, ghi **không đo được**, không chấm thất bại hay tự sửa kết quả. Không yêu cầu nhập dữ liệu thật. Với từng người, ghi mã phiên, thiết bị, phiên bản prototype/commit và thay đổi local nếu có, nhiệm vụ, kết quả, thời gian và mức hỗ trợ; không ghi dữ liệu cá nhân.

| Nhiệm vụ dùng dữ liệu giả                    | Quan sát và cách chấm                                                                                                                                                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Quick-add một khoản chi                      | Đo từ lúc đọc xong nhiệm vụ đến khi xác nhận hoàn tất; ghi lỗi, hỗ trợ, thời gian và hoàn tất. Tách novice/returning theo quy định trước phiên; ghi cả trường hợp không hoàn tất.                      |
| Chuyển giữa hai tài khoản của cùng một người | Sau tương tác, hỏi khoản này có phải chi phí không và vì sao; ghi đúng/sai/không trả lời và hỗ trợ đã dùng.                                                                                            |
| Xem khoản trả nợ gồm gốc, lãi, phí           | Hỏi phần gốc có phải chi phí không và vì sao; ghi đúng/sai/không trả lời và hỗ trợ. Không xác nhận thứ tự phân bổ hay công thức chưa duyệt.                                                            |
| Xem giải thích safe-to-spend                 | Hỏi khoảng thời gian áp dụng và các yếu tố chính làm thay đổi số; ghi các yếu tố và horizon người dùng tự nêu, đúng/sai/không trả lời và hỗ trợ. Không trình bày con số demo như công thức được duyệt. |

Kịch bản cụ thể, định nghĩa novice/returning, mức “minimal guidance”, bắt đầu/kết thúc đồng hồ, định nghĩa completion, đáp án theo nội dung demo và cách xử lý thiếu dữ liệu cần được Product/Design thống nhất **trước** phiên, lưu kèm phiên bản nghiên cứu. Không đổi quy tắc chấm sau khi xem kết quả mà không báo cáo cả hai phiên bản.

PRD §15.4 đặt mục tiêu transfer ≥90% phân loại đúng sau minimal guidance, debt split ≥85% hiểu gốc không phải expense, STS ≥80% nêu ít nhất hai yếu tố chính và horizon, quick-add median <20 giây novice và <8 giây returning. Báo cáo tử số/mẫu số, số không đo được, hướng dẫn đã dùng và phân bố thời gian; không loại phiên thất bại khỏi mẫu một cách âm thầm. Với mẫu nhỏ, công bố số đếm và hạn chế bất định, không diễn giải định tính thành bằng chứng đại diện. Product/Design phải chốt quy tắc mẫu số và xử lý timeout trước khi chạy; mục tiêu không tự biến thành Phase 0 exit.

## Diary và tổng hợp

Đề xuất nhịp ghi ngắn theo sự kiện và check-in định kỳ do người phụ trách chọn. Mỗi mục chỉ cần loại tình huống, ngày tương đối, cách theo dõi, khó khăn và điều gì đã làm; không ghi số tiền, tên, ngân hàng hoặc chứng từ. Người tham gia có thể bỏ qua bất kỳ mục nào. Theo dõi số ngày/tuần tham gia và bỏ dở để diễn giải giới hạn; không suy luận phần thiếu.

Sau nghiên cứu, tạo báo cáo tổng hợp riêng gồm: thời gian và phiên bản, phương pháp và sai lệch, cơ cấu mẫu rộng, số hoàn thành/bỏ dở, kết quả từng nhiệm vụ với tử số/mẫu số và thời gian, chủ đề có bằng chứng đã khử nhận diện, phản ví dụ, rủi ro và thay đổi scope **đề xuất**. Phân biệt quan sát với diễn giải; không bịa trích dẫn hoặc kết quả. Bao gồm bằng chứng Product/Design review với người, ngày, phạm vi và kết luận thực tế; không tự ghi acceptance. Các kết quả này là đầu vào T03, không thay thế Finance/Product/Engineering signoff khác của Phase 0.

PRD §16.4 còn yêu cầu kiểm chứng độ nhạy giá Van Westendorp cho Plus/Pro và MaxDiff. Đây là nhánh nghiên cứu bổ sung: Product cần định nghĩa gói, bộ câu hỏi, phân tích và phương pháp trước khi chạy; không coi giá, tính năng hay kết quả là đã được xác thực. Báo giá và quyền market data thuộc T02, không thể suy ra từ phỏng vấn.
