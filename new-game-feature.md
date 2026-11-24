Đặc tả nghiệp vụ game: GIẢI MÃ Ô CHỮ – Crossword Battle
Cậu chủ chọn mô hình Hybrid + Progressive + Everyone. Mình sẽ thiết kế game theo hướng một chương trình truyền hình tương tác trực tiếp trên TikTok LIVE, trong đó tất cả người xem đều có thể tham gia trả lời, cạnh tranh điểm số và giành quyền giải mã từ khóa bí mật.

Tên game đề xuất: CROSSWORD BATTLE – Giải mã bí ẩn.






















12














1. Tổng quan trò chơi
1.1. Mục tiêu
Người chơi cần:
1. Giải các câu hỏi hàng ngang.
2. Mở các ô chữ tương ứng.
3. Thu thập từng ký tự của từ khóa bí mật.
4. Sử dụng các ký tự đã mở và gợi ý để suy luận từ khóa.
5. Bình luận đáp án từ khóa trước những người chơi khác để giành điểm thưởng lớn.
1.2. Cấu trúc một ván
Số hàng ngang mặc định
5

Từ khóa bí mật
5 ký tự

Người tham gia
Không giới hạn*

Phương thức
TikTok LIVE


* Giới hạn thực tế phụ thuộc khả năng tiếp nhận bình luận của hệ thống.
Mỗi hàng ngang có một câu hỏi riêng. Mỗi hàng chứa một ô chữ đặc biệt tương ứng với một ký tự trong từ khóa bí mật.

Ví dụ:
- Hàng ngang 1 lấy ký tự thứ 1.
- Hàng ngang 2 lấy ký tự thứ 2.
- Hàng ngang 3 lấy ký tự thứ 3.
- Hàng ngang 4 lấy ký tự thứ 4.
- Hàng ngang 5 lấy ký tự thứ 5.
Đây là cách thiết kế mặc định, có thể cấu hình vị trí ký tự khác nhau cho từng hàng.
2. Luật chơi chi tiết
Giai đoạn 1: Khởi động
- MC khởi tạo ván chơi.
- Hệ thống hiển thị bảng ô chữ bị khóa.
- Hiển thị chủ đề của từ khóa, ví dụ: Công nghệ, Động vật, Địa lý, Lịch sử.
- Tất cả người xem có thể tham gia ngay khi ván bắt đầu.
- Hệ thống hiển thị điểm số hiện tại của người chơi.
Giai đoạn 2: Giải mã hàng ngang
MC chọn một hàng ngang chưa được giải.








b92.tv


Ví dụ:

Hàng ngang số 1

Câu hỏi: Ngôn ngữ lập trình phổ biến dùng để phát triển ứng dụng web backend, có framework Laravel?

Đáp án: PHP.

Luồng hoạt động:
1. MC bấm chọn hàng ngang 1.
2. Hệ thống hiển thị câu hỏi trên overlay.
3. AI Voice đọc câu hỏi.
4. Bộ đếm thời gian bắt đầu, mặc định 20 giây.
5. Người xem bình luận đáp án.
6. Backend nhận comment và kiểm tra đáp án.
7. Người trả lời đúng đầu tiên được ghi nhận.
8. Hệ thống mở hàng ngang và công bố người thắng.
Quy tắc quan trọng:
- Mỗi người chỉ được tính một đáp án hợp lệ cho mỗi câu hỏi.
- Có thể cho phép sửa đáp án trước khi hết giờ, nhưng mặc định nên khóa đáp án đầu tiên.
- Người trả lời sai không bị trừ điểm.
- Một hàng ngang chỉ được mở một lần.
- Khi hết giờ mà không ai trả lời đúng, MC có quyền công bố đáp án hoặc bỏ qua.
Giai đoạn 3: Hé lộ từ khóa bí mật
Sau khi hàng ngang được giải:
- Các ô chữ của hàng ngang được lật mở.
- Ô chữ đặc biệt được đánh dấu bằng màu vàng.
- Ký tự tại vị trí đặc biệt được đưa vào khu vực từ khóa.
- Người xem có thể sử dụng thông tin này để suy luận.








telewizja.jastrzabpost.pl


Ví dụ minh họa:
Hàng	Đáp án	Ký tự đặc biệt
1	PHP	P
2	API	A
3	REDIS	R
4	CACHE	A
5	MYSQL	S

Từ khóa minh họa: PARAS.

Đây chỉ là ví dụ minh họa cơ chế lấy ký tự, không phải bộ câu hỏi thực tế.
Giai đoạn 4: Đoán từ khóa bí mật
Đây là vòng quan trọng nhất của game.

Tất cả người xem có thể đoán từ khóa bất cứ lúc nào, không cần chờ MC mở hết hàng ngang.

Ví dụ:
KEYWORD LARAVEL


Quy trình:
1. Người xem bình luận theo cú pháp.
2. Backend kiểm tra người chơi có hợp lệ không.
3. Chuẩn hóa đáp án.
4. So sánh với từ khóa chính xác.
5. Nếu đúng, ghi nhận người thắng.
6. Kết thúc ván và công bố kết quả.
Điểm đặc biệt: Từ khóa đúng đầu tiên được xác định theo thứ tự hệ thống tiếp nhận và xử lý hợp lệ, không dựa vào thời gian hiển thị bình luận trên màn hình.

Nếu người chơi đoán sai:
- Không bị trừ điểm mặc định.
- Có thể giới hạn một lần đoán mỗi người trong một ván hoặc một khoảng cooldown.
- Vẫn được tham gia trả lời hàng ngang.
Giai đoạn 5: Kết thúc
Ván chơi kết thúc khi:
- Có người giải đúng từ khóa.
- MC chủ động kết thúc.
- Hết thời gian toàn ván.
- MC bỏ qua từ khóa và công bố đáp án.
Hệ thống hiển thị:
- Người giải được từ khóa.
- Điểm thưởng.
- Top 10 người chơi.
- Tổng số câu hỏi được giải.
- Thống kê người tham gia.

3. Cơ chế tính điểm
Mình đề xuất hệ thống tính điểm theo hướng vừa khuyến khích trả lời nhanh, vừa tạo động lực ở vòng từ khóa.
3.1. Bảng điểm mặc định
Hành động	Điểm
Trả lời đúng hàng ngang đầu tiên	+100
Trả lời đúng hàng ngang sau người đầu tiên	+20
Đoán đúng từ khóa bí mật	+500
Trả lời sai	0
Xin gợi ý	0
Trả lời đúng câu hỏi bonus	+50

Các quy tắc:
- Người trả lời đúng đầu tiên nhận điểm chính.
- Những người trả lời đúng sau đó, trước khi hàng ngang đóng, nhận điểm tham gia.
- Mỗi người chỉ nhận điểm một lần cho mỗi hàng ngang.
- Mỗi ván chỉ có một người nhận thưởng giải mã từ khóa.
- Điểm được cộng ngay sau khi backend xác nhận kết quả.
- Không cho phép cộng điểm hai lần khi nhận lại cùng một sự kiện comment.
3.2. Bảng xếp hạng








interacty.me


Ví dụ:
Hạng	Người chơi	Điểm
1	VinhDev	850
2	Nguyen123	320
3	MinhAnh	220
4	CodeMaster	120
5	Tester99	100

Có hai loại bảng xếp hạng:
- Trong ván: Điểm của ván hiện tại.
- Trong phiên LIVE: Tổng điểm tích lũy qua nhiều ván.
Nên có tùy chọn reset bảng xếp hạng khi bắt đầu một phiên LIVE mới.
4. Quy tắc thiết kế bảng ô chữ
Đây là phần quan trọng nhất khi xây dựng hệ thống quản lý câu hỏi.
4.1. Cấu trúc bảng
Một bảng gồm:
- N hàng ngang.
- Mỗi hàng có một câu hỏi.
- Mỗi hàng có một đáp án.
- Mỗi hàng có một vị trí ký tự đặc biệt.
- Các ký tự đặc biệt ghép lại thành từ khóa.
Ví dụ cấu trúc:
       1  2  3  4  5  6  7
     ┌──┬──┬──┬──┬──┬──┬──┐
  1  │P │H │P │  │  │  │  │
     └──┴──┴──┴──┴──┴──┴──┘
  2  │  │A │P │I │  │  │  │
     └──┴──┴──┴──┴──┴──┴──┘
  3  │  │  │R │E │D │  │  │
     └──┴──┴──┴──┴──┴──┴──┘

              ↓
        TỪ KHÓA BÍ MẬT


Lưu ý: Đây là minh họa cách bố trí. Khi tạo bộ câu hỏi thực tế, hệ thống phải kiểm tra các chữ cái giao nhau chính xác với từ khóa.
4.2. Cấu hình từng hàng ngang
Mỗi hàng ngang cần các trường:
Thuộc tính	Ý nghĩa
row_number	Số thứ tự hàng
question	Nội dung câu hỏi
answer	Đáp án chính
accepted_answers	Các đáp án thay thế
hint	Gợi ý
answer_position	Vị trí ký tự đặc biệt
time_limit	Thời gian trả lời
points	Điểm thưởng
status	Trạng thái hàng

Ví dụ:
{
  "row_number": 1,
  "question": "Ngôn ngữ lập trình sử dụng Laravel?",
  "answer": "PHP",
  "accepted_answers": ["PHP"],
  "hint": "Ngôn ngữ backend",
  "answer_position": 1,
  "time_limit": 20,
  "points": 100
}


4.3. Kiểm tra tính hợp lệ của bộ ô chữ
Khi MC tạo hoặc nhập bộ câu hỏi, backend cần kiểm tra:
1. Số lượng hàng ngang phải bằng số ký tự của từ khóa (theo cấu hình mặc định).
2. Vị trí ký tự đặc biệt phải nằm trong phạm vi đáp án.
3. Ký tự tại vị trí đặc biệt phải trùng với ký tự tương ứng trong từ khóa.
4. Mỗi hàng phải có câu hỏi và đáp án.
5. Không cho phép đáp án rỗng.
6. Không cho phép hai hàng trùng số thứ tự.
Đề xuất: Cho phép từ khóa tiếng Việt có dấu, nhưng cần quy định rõ cách chuẩn hóa. Với phiên bản đầu tiên, nên hỗ trợ chữ cái A–Z, số và từ khóa tiếng Việt không dấu để tránh lỗi nhập liệu.
5. Luồng nghiệp vụ tổng thể
Đây là flow chính từ lúc MC khởi tạo game đến lúc kết thúc.
#chatgpt-mermaid-_r_15v_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-_r_15v_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_15v_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_15v_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-_r_15v_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-_r_15v_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-_r_15v_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-_r_15v_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-_r_15v_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-_r_15v_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-_r_15v_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-_r_15v_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_15v_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_15v_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-_r_15v_ p{margin:0;}#chatgpt-mermaid-_r_15v_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_15v_ .cluster-label text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-_r_15v_ .cluster-label span{color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_15v_ .cluster-label span p{background-color:transparent;}#chatgpt-mermaid-_r_15v_ .label text,#chatgpt-mermaid-_r_15v_ span{fill:rgb(237, 237, 237);color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_15v_ .node rect,#chatgpt-mermaid-_r_15v_ .node circle,#chatgpt-mermaid-_r_15v_ .node ellipse,#chatgpt-mermaid-_r_15v_ .node polygon,#chatgpt-mermaid-_r_15v_ .node path{fill:rgb(9, 23, 44);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-_r_15v_ .rough-node .label text,#chatgpt-mermaid-_r_15v_ .node .label text,#chatgpt-mermaid-_r_15v_ .image-shape .label,#chatgpt-mermaid-_r_15v_ .icon-shape .label{text-anchor:middle;}#chatgpt-mermaid-_r_15v_ .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#chatgpt-mermaid-_r_15v_ .rough-node .label,#chatgpt-mermaid-_r_15v_ .node .label,#chatgpt-mermaid-_r_15v_ .image-shape .label,#chatgpt-mermaid-_r_15v_ .icon-shape .label{text-align:center;}#chatgpt-mermaid-_r_15v_ .node.clickable{cursor:pointer;}#chatgpt-mermaid-_r_15v_ .root .anchor path{fill:rgb(175, 175, 175)!important;stroke-width:0;stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_15v_ .arrowheadPath{fill:rgb(175, 175, 175);}#chatgpt-mermaid-_r_15v_ .edgePath .path{stroke:rgb(175, 175, 175);stroke-width:1px;}#chatgpt-mermaid-_r_15v_ .flowchart-link{stroke:rgb(175, 175, 175);fill:none;}#chatgpt-mermaid-_r_15v_ .edgeLabel{background-color:rgb(0, 0, 0);text-align:center;}#chatgpt-mermaid-_r_15v_ .edgeLabel p{background-color:rgb(0, 0, 0);}#chatgpt-mermaid-_r_15v_ .edgeLabel rect{opacity:0.5;background-color:rgb(0, 0, 0);fill:rgb(0, 0, 0);}#chatgpt-mermaid-_r_15v_ .labelBkg{background-color:rgba(0, 0, 0, 0.5);}#chatgpt-mermaid-_r_15v_ .cluster rect{fill:rgb(48, 48, 48);stroke:rgba(255, 255, 255, 0.15);stroke-width:1px;}#chatgpt-mermaid-_r_15v_ .cluster text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-_r_15v_ .cluster span{color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_15v_ div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:12px;background:rgb(48, 48, 48);border:1px solid rgba(255, 255, 255, 0.15);border-radius:2px;pointer-events:none;z-index:100;}#chatgpt-mermaid-_r_15v_ .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgb(237, 237, 237);}#chatgpt-mermaid-_r_15v_ rect.text{fill:none;stroke-width:0;}#chatgpt-mermaid-_r_15v_ .icon-shape,#chatgpt-mermaid-_r_15v_ .image-shape{background-color:rgb(0, 0, 0);text-align:center;}#chatgpt-mermaid-_r_15v_ .icon-shape p,#chatgpt-mermaid-_r_15v_ .image-shape p{background-color:rgb(0, 0, 0);padding:2px;}#chatgpt-mermaid-_r_15v_ .icon-shape .label rect,#chatgpt-mermaid-_r_15v_ .image-shape .label rect{opacity:0.5;background-color:rgb(0, 0, 0);fill:rgb(0, 0, 0);}#chatgpt-mermaid-_r_15v_ .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#chatgpt-mermaid-_r_15v_ .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#chatgpt-mermaid-_r_15v_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-_r_15v_ [data-look="neo"].node rect,#chatgpt-mermaid-_r_15v_ [data-look="neo"].cluster rect,#chatgpt-mermaid-_r_15v_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-_r_15v_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_15v_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-_r_15v_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-_r_15v_-gradient);stroke-width:1px;}#chatgpt-mermaid-_r_15v_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_15v_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-_r_15v_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-_r_15v_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_15v_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-_r_15v_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-_r_15v_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_15v_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-_r_15v_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_15v_ .node text{font-size:14px;font-weight:600;letter-spacing:normal;fill:rgb(153, 206, 255);}#chatgpt-mermaid-_r_15v_ .edgeLabels text{font-size:13px;font-weight:600;letter-spacing:-0.08px;fill:rgb(153, 206, 255);}#chatgpt-mermaid-_r_15v_ .node tspan[font-weight="normal"],#chatgpt-mermaid-_r_15v_ .edgeLabels tspan[font-weight="normal"]{font-weight:600;}#chatgpt-mermaid-_r_15v_ .edgeLabel .label rect{opacity:1;rx:13px;ry:13px;fill:rgb(0, 14, 26);stroke:rgb(26, 62, 95);stroke-width:1px;}#chatgpt-mermaid-_r_15v_ .node rect,#chatgpt-mermaid-_r_15v_ .node circle,#chatgpt-mermaid-_r_15v_ .node ellipse,#chatgpt-mermaid-_r_15v_ .node polygon,#chatgpt-mermaid-_r_15v_ .node path{fill:rgb(0, 40, 77);stroke:rgba(255, 255, 255, 0.1);stroke-width:1px;}#chatgpt-mermaid-_r_15v_ .node rect{rx:16px;ry:16px;}#chatgpt-mermaid-_r_15v_ .mermaid-decision .label-container{fill:rgb(0, 14, 26);stroke:rgb(26, 62, 95);stroke-dasharray:2,2;}#chatgpt-mermaid-_r_15v_ .edgePaths .flowchart-link{stroke:rgb(175, 175, 175);stroke-width:1px;stroke-linecap:round;stroke-linejoin:round;}#chatgpt-mermaid-_r_15v_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_15v_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}MC tạo ván chơiChọn bộ câu hỏiKiểm tra bảng ô chữHợp lệ?Bắt đầu vánHiển thị bảng ô chữMC chọn hàng ngangHiển thị câu hỏi + phát giọngAINhận bình luận TikTokComment là gì?Kiểm tra đáp ánKiểm tra từ khóaĐúng?Ghi điểm + mở hàngLật ô chữ + mở ký tựĐã có người giải từ khóa?Kết thúc vánCòn hàng ngang?Vòng giải mã cuốiTừ khóa đúng?Công bố kết quả + BXHKhôngCóĐáp án hàng ngangĐoán từ khóaCóKhôngCóKhôngCóKhôngCóKhông





Một điểm quan trọng: Người xem có thể đoán từ khóa trong toàn bộ thời gian ván chơi, kể cả khi MC đang đọc câu hỏi hoặc đang chuyển hàng. Không được giới hạn việc đoán từ khóa chỉ ở giai đoạn cuối.

6. Thiết kế các trạng thái game
Backend cần quản lý trạng thái rõ ràng để tránh xử lý sai khi có nhiều bình luận đồng thời.
Trạng thái	Ý nghĩa
WAITING	Chờ MC bắt đầu
READY	Đã tải bộ câu hỏi
QUESTION_ACTIVE	Đang nhận đáp án hàng ngang
QUESTION_REVEAL	Đang mở hàng ngang
KEYWORD_ACTIVE	Đang nhận đoán từ khóa
PAUSED	Tạm dừng
FINISHED	Kết thúc
CANCELLED	Hủy ván

Luồng chuyển trạng thái:
WAITING
   ↓
READY
   ↓
QUESTION_ACTIVE
   ↓
QUESTION_REVEAL
   ↓
QUESTION_ACTIVE
   ↓
...
   ↓
KEYWORD_ACTIVE
   ↓
FINISHED


KEYWORD_ACTIVE không nhất thiết chỉ xuất hiện cuối ván. Về mặt nghiệp vụ, nó có thể được xem là một chế độ nhận câu trả lời song song với QUESTION_ACTIVE.

Vì vậy, mình khuyến nghị triển khai theo hai trạng thái độc lập:
- Trạng thái vòng chơi: đang chờ, đang chơi, tạm dừng, kết thúc.
- Trạng thái hàng ngang: chưa mở, đang hỏi, đã giải, hết thời gian, bỏ qua.
Cách này tránh việc một người đoán từ khóa làm gián đoạn câu hỏi hàng ngang đang diễn ra.
7. Kiến trúc kỹ thuật
Với hệ thống TikTok LIVE mini-game hiện tại của cậu chủ, mình đề xuất tiếp tục dùng NestJS, WebSocket và giao diện Browser Overlay thay vì xây dựng một ứng dụng độc lập khác.
Kiến trúc hệ thống
TikTok LIVE
Người xem bình luận / tặng quà

TikTok Comment Adapter
Nhận và chuẩn hóa sự kiện comment

NestJS Backend
Game Engine
Quản lý ván chơi
Answer Engine
Kiểm tra đáp án
Score Engine
Tính điểm
Keyword Engine
Giải mã từ khóa



WebSocket
Đồng bộ realtime
Database / Redis
Dữ liệu và trạng thái


LIVE Overlay
Hiển thị game
Admin / MC
Điều khiển trò chơi


7.1. Các module backend
Đề xuất cấu trúc:
src/
├── games/
│   ├── crossword/
│   │   ├── crossword.module.ts
│   │   ├── crossword.controller.ts
│   │   ├── crossword.gateway.ts
│   │   ├── crossword.service.ts
│   │   ├── crossword.engine.ts
│   │   ├── crossword-state.service.ts
│   │   ├── crossword-scoring.service.ts
│   │   ├── crossword-keyword.service.ts
│   │   ├── crossword-answer.service.ts
│   │   ├── crossword-comment.service.ts
│   │   └── dto/
│   ├── shared/
│   └── games.module.ts
├── questions/
├── tiktok/
└── websocket/


Nhiệm vụ từng module:
Module	Trách nhiệm
crossword.engine	Điều phối logic ván chơi
crossword-state	Quản lý trạng thái
crossword-scoring	Tính điểm và xếp hạng
crossword-keyword	Xử lý từ khóa
crossword-answer	Chuẩn hóa và kiểm tra đáp án
crossword-comment	Tiếp nhận comment
crossword.gateway	Phát sự kiện realtime

7.2. Công nghệ đề xuất
Thành phần	Công nghệ
Backend	NestJS
Frontend	Nuxt/Vue hoặc frontend hiện tại
Realtime	Socket.IO
Database	MySQL
Cache và lock	Redis
Animation	CSS Animation / GSAP
Giọng đọc	TTS hiện tại
TikTok	Adapter nhận comment hiện tại

Redis không bắt buộc ở phiên bản đầu nếu chỉ chạy một instance. Tuy nhiên, nếu triển khai nhiều instance backend thì nên dùng Redis để đồng bộ trạng thái và chống xử lý trùng.
8. Nghiệp vụ tiếp nhận bình luận TikTok
Đây là phần cần thiết kế kỹ nhất vì game cho phép tất cả người xem cùng tham gia.
8.1. Cú pháp comment
Đề xuất hỗ trợ hai cách trả lời.

Cách 1: Trả lời trực tiếp
PHP
LARAVEL
MYSQL


Backend sẽ hiểu đây là đáp án hàng ngang đang hoạt động.

Cách 2: Trả lời có chỉ định
1 PHP
2 MYSQL
KEYWORD LARAVEL


Cách 2 hữu ích khi người chơi muốn trả lời hàng ngang cụ thể hoặc đoán từ khóa.

Để tránh comment thông thường bị nhận nhầm thành đáp án, nên cấu hình:
- Chỉ nhận đáp án trực tiếp khi đang có câu hỏi hàng ngang hoạt động.
- Cú pháp KEYWORD luôn được ưu tiên nhận diện.
- Nếu có prefix số hàng thì kiểm tra đúng hàng đang được mở.
- Comment không hợp lệ không làm thay đổi game state.
8.2. Quy trình xử lý comment
#chatgpt-mermaid-_r_178_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-_r_178_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_178_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-_r_178_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-_r_178_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-_r_178_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-_r_178_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-_r_178_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-_r_178_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-_r_178_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-_r_178_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-_r_178_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_178_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_178_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-_r_178_ p{margin:0;}#chatgpt-mermaid-_r_178_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_178_ .cluster-label text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-_r_178_ .cluster-label span{color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_178_ .cluster-label span p{background-color:transparent;}#chatgpt-mermaid-_r_178_ .label text,#chatgpt-mermaid-_r_178_ span{fill:rgb(237, 237, 237);color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_178_ .node rect,#chatgpt-mermaid-_r_178_ .node circle,#chatgpt-mermaid-_r_178_ .node ellipse,#chatgpt-mermaid-_r_178_ .node polygon,#chatgpt-mermaid-_r_178_ .node path{fill:rgb(9, 23, 44);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-_r_178_ .rough-node .label text,#chatgpt-mermaid-_r_178_ .node .label text,#chatgpt-mermaid-_r_178_ .image-shape .label,#chatgpt-mermaid-_r_178_ .icon-shape .label{text-anchor:middle;}#chatgpt-mermaid-_r_178_ .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#chatgpt-mermaid-_r_178_ .rough-node .label,#chatgpt-mermaid-_r_178_ .node .label,#chatgpt-mermaid-_r_178_ .image-shape .label,#chatgpt-mermaid-_r_178_ .icon-shape .label{text-align:center;}#chatgpt-mermaid-_r_178_ .node.clickable{cursor:pointer;}#chatgpt-mermaid-_r_178_ .root .anchor path{fill:rgb(175, 175, 175)!important;stroke-width:0;stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_178_ .arrowheadPath{fill:rgb(175, 175, 175);}#chatgpt-mermaid-_r_178_ .edgePath .path{stroke:rgb(175, 175, 175);stroke-width:1px;}#chatgpt-mermaid-_r_178_ .flowchart-link{stroke:rgb(175, 175, 175);fill:none;}#chatgpt-mermaid-_r_178_ .edgeLabel{background-color:rgb(0, 0, 0);text-align:center;}#chatgpt-mermaid-_r_178_ .edgeLabel p{background-color:rgb(0, 0, 0);}#chatgpt-mermaid-_r_178_ .edgeLabel rect{opacity:0.5;background-color:rgb(0, 0, 0);fill:rgb(0, 0, 0);}#chatgpt-mermaid-_r_178_ .labelBkg{background-color:rgba(0, 0, 0, 0.5);}#chatgpt-mermaid-_r_178_ .cluster rect{fill:rgb(48, 48, 48);stroke:rgba(255, 255, 255, 0.15);stroke-width:1px;}#chatgpt-mermaid-_r_178_ .cluster text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-_r_178_ .cluster span{color:rgb(237, 237, 237);}#chatgpt-mermaid-_r_178_ div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:12px;background:rgb(48, 48, 48);border:1px solid rgba(255, 255, 255, 0.15);border-radius:2px;pointer-events:none;z-index:100;}#chatgpt-mermaid-_r_178_ .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgb(237, 237, 237);}#chatgpt-mermaid-_r_178_ rect.text{fill:none;stroke-width:0;}#chatgpt-mermaid-_r_178_ .icon-shape,#chatgpt-mermaid-_r_178_ .image-shape{background-color:rgb(0, 0, 0);text-align:center;}#chatgpt-mermaid-_r_178_ .icon-shape p,#chatgpt-mermaid-_r_178_ .image-shape p{background-color:rgb(0, 0, 0);padding:2px;}#chatgpt-mermaid-_r_178_ .icon-shape .label rect,#chatgpt-mermaid-_r_178_ .image-shape .label rect{opacity:0.5;background-color:rgb(0, 0, 0);fill:rgb(0, 0, 0);}#chatgpt-mermaid-_r_178_ .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#chatgpt-mermaid-_r_178_ .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#chatgpt-mermaid-_r_178_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-_r_178_ [data-look="neo"].node rect,#chatgpt-mermaid-_r_178_ [data-look="neo"].cluster rect,#chatgpt-mermaid-_r_178_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-_r_178_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_178_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-_r_178_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-_r_178_-gradient);stroke-width:1px;}#chatgpt-mermaid-_r_178_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_178_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-_r_178_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-_r_178_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_178_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-_r_178_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-_r_178_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_178_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-_r_178_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-_r_178_ .node text{font-size:14px;font-weight:600;letter-spacing:normal;fill:rgb(153, 206, 255);}#chatgpt-mermaid-_r_178_ .edgeLabels text{font-size:13px;font-weight:600;letter-spacing:-0.08px;fill:rgb(153, 206, 255);}#chatgpt-mermaid-_r_178_ .node tspan[font-weight="normal"],#chatgpt-mermaid-_r_178_ .edgeLabels tspan[font-weight="normal"]{font-weight:600;}#chatgpt-mermaid-_r_178_ .edgeLabel .label rect{opacity:1;rx:13px;ry:13px;fill:rgb(0, 14, 26);stroke:rgb(26, 62, 95);stroke-width:1px;}#chatgpt-mermaid-_r_178_ .node rect,#chatgpt-mermaid-_r_178_ .node circle,#chatgpt-mermaid-_r_178_ .node ellipse,#chatgpt-mermaid-_r_178_ .node polygon,#chatgpt-mermaid-_r_178_ .node path{fill:rgb(0, 40, 77);stroke:rgba(255, 255, 255, 0.1);stroke-width:1px;}#chatgpt-mermaid-_r_178_ .node rect{rx:16px;ry:16px;}#chatgpt-mermaid-_r_178_ .mermaid-decision .label-container{fill:rgb(0, 14, 26);stroke:rgb(26, 62, 95);stroke-dasharray:2,2;}#chatgpt-mermaid-_r_178_ .edgePaths .flowchart-link{stroke:rgb(175, 175, 175);stroke-width:1px;stroke-linecap:round;stroke-linejoin:round;}#chatgpt-mermaid-_r_178_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-_r_178_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}TikTok comment eventValidate eventĐã xử lý event ID?Bỏ quaLưu hoặc đánh dấu eventChuẩn hóa commentPhân loạiKeyword EngineAnswer EngineĐúng từ khóa?Đúng đáp án?Atomic claim winnerKiểm tra người đã trả lờiGhi điểmBroadcast WebSocketCông bố người chiến thắngCập nhật bảng xếp hạngKết thúc vánCóKhôngKeywordAnswerKhácCóKhôngCóKhông





8.3. Chuẩn hóa đáp án
Backend nên xử lý các trường hợp:
Người chơi nhập	Đáp án chuẩn	Kết quả
php	PHP	Đúng
PHP	PHP	Đúng
Php	PHP	Đúng
lArAvEl	LARAVEL	Đúng
LARAVEL!!!	LARAVEL	Tùy cấu hình
PH P	PHP	Không nên tự động chấp nhận

Các quy tắc chuẩn hóa:
1. Trim khoảng trắng đầu cuối.
2. Chuyển chữ thường thành chữ hoa.
3. Chuẩn hóa Unicode.
4. Loại bỏ dấu tiếng Việt nếu cấu hình đáp án không dấu.
5. Xử lý dấu câu theo cấu hình.
6. Không tự ý xóa tất cả khoảng trắng bên trong đáp án vì có thể gây trùng lặp ngoài ý muốn.
Nên có danh sách accepted_answers thay vì dùng fuzzy matching. Không nên cho AI tự phán đoán đáp án trong luồng realtime vì có thể tạo kết quả không nhất quán.
8.4. Chống spam và xử lý đồng thời
Các quy tắc cần có:
- Một người không được ghi điểm nhiều lần cho cùng một hàng ngang.
- Một comment event chỉ được xử lý một lần.
- Có cooldown cho việc đoán từ khóa.
- Không nhận đáp án khi ván đã kết thúc.
- Không nhận câu trả lời hàng ngang khi câu hỏi chưa được kích hoạt.
- Không cộng điểm nếu người chơi không tồn tại hoặc thiếu định danh hợp lệ.
- Không cho phép comment cũ được xử lý như comment mới sau khi reconnect.
Đặc biệt: xử lý hai người trả lời từ khóa cùng lúc.

Ví dụ người A và B cùng gửi đáp án đúng gần như đồng thời.

Backend phải sử dụng một thao tác atomic để chỉ có một người giành được quyền chiến thắng:
async claimKeywordWinner(
  gameId: string,
  userId: string,
): Promise<boolean> {
  // Atomic compare-and-set:
  // Chỉ người đầu tiên claim thành công
  // mới trở thành người chiến thắng.
}


Không nên chỉ kiểm tra winner === null rồi cập nhật bằng hai câu query riêng biệt vì có thể xảy ra race condition.
9. Thiết kế database
Đề xuất các bảng chính:
crossword_question_sets
Lưu bộ câu hỏi.
Column	Type	Ý nghĩa
id	BIGINT	ID
name	VARCHAR	Tên bộ câu hỏi
topic	VARCHAR	Chủ đề
keyword	VARCHAR	Từ khóa bí mật
description	TEXT	Mô tả
status	VARCHAR	Trạng thái
created_at	DATETIME	Ngày tạo

crossword_rows
Lưu các hàng ngang.
Column	Type	Ý nghĩa
id	BIGINT	ID
question_set_id	BIGINT	Bộ câu hỏi
row_number	INT	Số hàng
question	TEXT	Câu hỏi
answer	VARCHAR	Đáp án
accepted_answers	JSON	Đáp án thay thế
hint	TEXT	Gợi ý
answer_position	INT	Vị trí ký tự đặc biệt
time_limit	INT	Thời gian
points	INT	Điểm
status	VARCHAR	Trạng thái

crossword_games
Lưu từng ván chơi.
Column	Type	Ý nghĩa
id	BIGINT	ID
question_set_id	BIGINT	Bộ câu hỏi
room_id	VARCHAR	Phòng LIVE
status	VARCHAR	Trạng thái
current_row_id	BIGINT	Hàng đang chơi
winner_id	VARCHAR	Người giải mã
started_at	DATETIME	Bắt đầu
finished_at	DATETIME	Kết thúc

crossword_players
Lưu người tham gia.
Column	Type	Ý nghĩa
id	BIGINT	ID
game_id	BIGINT	Ván chơi
tiktok_user_id	VARCHAR	ID TikTok
username	VARCHAR	Username
display_name	VARCHAR	Tên hiển thị
total_score	INT	Tổng điểm
joined_at	DATETIME	Thời gian tham gia

crossword_answers
Lưu lịch sử trả lời.
Column	Type	Ý nghĩa
id	BIGINT	ID
game_id	BIGINT	Ván chơi
row_id	BIGINT	Hàng ngang
player_id	BIGINT	Người trả lời
answer	VARCHAR	Nội dung
is_correct	BOOLEAN	Đúng/sai
points_earned	INT	Điểm
answered_at	DATETIME	Thời gian

crossword_events
Lưu event để chống xử lý trùng và truy vết.
Column	Type	Ý nghĩa
id	BIGINT	ID
game_id	BIGINT	Ván chơi
external_event_id	VARCHAR	ID event TikTok
event_type	VARCHAR	Loại event
payload	JSON	Dữ liệu gốc cần thiết
processed_at	DATETIME	Thời gian xử lý

Nên có unique index:
UNIQUE (game_id, external_event_id)
UNIQUE (game_id, tiktok_user_id)
UNIQUE (game_id, row_id, player_id)


Lưu ý: crossword_answers cần có unique constraint cho mỗi người và mỗi hàng nếu chỉ cho phép ghi nhận một đáp án đúng đầu tiên của người đó. Nếu muốn lưu cả lịch sử đáp án sai thì cần tách bảng lượt trả lời khỏi bảng kết quả hợp lệ.

10. API và WebSocket
10.1. REST API dành cho MC/Admin
Method	Endpoint	Chức năng
POST	/crossword/games	Tạo ván
GET	/crossword/question-sets	Danh sách bộ câu hỏi
POST	/crossword/question-sets	Tạo bộ câu hỏi
GET	/crossword/question-sets/:id	Chi tiết bộ câu hỏi
PUT	/crossword/question-sets/:id	Cập nhật bộ câu hỏi
POST	/crossword/games/:id/start	Bắt đầu ván
POST	/crossword/games/:id/rows/:rowId/open	Mở hàng ngang
POST	/crossword/games/:id/rows/:rowId/skip	Bỏ qua hàng
POST	/crossword/games/:id/rows/:rowId/reveal	Công bố đáp án
POST	/crossword/games/:id/pause	Tạm dừng
POST	/crossword/games/:id/resume	Tiếp tục
POST	/crossword/games/:id/hint	Hiển thị gợi ý
POST	/crossword/games/:id/finish	Kết thúc ván
GET	/crossword/games/:id/leaderboard	Lấy bảng xếp hạng

10.2. WebSocket Events
Backend phát sự kiện cho Overlay và Admin.
Event	Ý nghĩa
crossword:game:started	Bắt đầu game
crossword:question:opened	Mở câu hỏi
crossword:question:timer	Đồng bộ thời gian
crossword:answer:correct	Có người trả lời đúng
crossword:answer:revealed	Mở đáp án
crossword:row:revealed	Mở hàng ngang
crossword:keyword:updated	Hé lộ ký tự từ khóa
crossword:keyword:attempt	Có người đoán từ khóa
crossword:keyword:winner	Có người giải mã
crossword:leaderboard:updated	Cập nhật điểm
crossword:game:paused	Tạm dừng
crossword:game:finished	Kết thúc

Ví dụ payload khi mở một hàng:
{
  "gameId": "KB2026",
  "rowNumber": 1,
  "answer": "PHP",
  "revealed": true,
  "keywordCharacter": "P",
  "keywordPosition": 1,
  "player": {
    "username": "vinh_dev",
    "displayName": "Vinh"
  },
  "pointsEarned": 100
}


Không gửi đáp án của những hàng chưa mở hoặc từ khóa bí mật xuống client Overlay. Backend phải giữ các dữ liệu này ở phía server để tránh người xem kiểm tra DevTools và biết đáp án trước.
11. Thiết kế giao diện
Mình đề xuất 2 giao diện chính.
11.1. Giao diện LIVE Overlay






















9











Bố cục từ trên xuống:
1. Logo CROSSWORD BATTLE.
2. Chủ đề câu hỏi.
3. Bảng ô chữ.
4. Từ khóa bí mật.
5. Câu hỏi hiện tại.
6. Đồng hồ đếm ngược.
7. Người trả lời đúng gần nhất.
8. Top 5 người chơi.
9. Hiệu ứng chiến thắng.
Overlay nên có hai chế độ hiển thị:
- Chế độ câu hỏi: bảng ô chữ thu nhỏ, câu hỏi và thời gian là trung tâm.
- Chế độ giải mã: bảng ô chữ và các ký tự bí mật chiếm phần lớn màn hình.
11.2. Giao diện Admin/MC








esl-buzzer-game-systems.com


Các chức năng:
Khu vực	Chức năng
Game Control	Bắt đầu, tạm dừng, kết thúc
Crossword Board	Chọn hàng ngang
Question Editor	Quản lý câu hỏi
Keyword	Xem từ khóa bí mật
Timer	Điều chỉnh thời gian
Hint	Bật/tắt gợi ý
Leaderboard	Xem người chơi và điểm
Comment Monitor	Theo dõi bình luận
Audio	Bật/tắt giọng đọc

MC cần có nút điều khiển thủ công để xử lý trường hợp AI Voice đọc lỗi, comment không nhận được hoặc hệ thống bị trễ.
12. Các tình huống ngoại lệ
Đây là những trường hợp nên xử lý ngay từ phiên bản đầu.
Tình huống	Cách xử lý
Không ai trả lời đúng	Hết giờ, cho MC công bố đáp án
Hai người trả lời đúng đồng thời	Atomic claim xác định người thắng
Người chơi spam đáp án	Cooldown
Comment bị nhận trùng	Idempotency
TikTok mất kết nối	Tạm dừng nhận comment, hiển thị trạng thái
WebSocket mất kết nối	Client reconnect và lấy lại snapshot
MC bấm mở hàng hai lần	Kiểm tra trạng thái, không mở trùng
Ván đã kết thúc	Từ chối mọi câu trả lời
Người chơi đoán sai từ khóa	Không trừ điểm
Hết hàng ngang nhưng chưa có người thắng	Chuyển vòng giải mã cuối
MC đóng trình duyệt	Khôi phục game state từ backend
TTS bị lỗi	MC có thể đọc thủ công

Một quy tắc rất quan trọng
Nếu MC đóng trang Admin hoặc refresh trình duyệt, game không được tự động kết thúc.

Game state phải được lưu phía backend. Khi Admin mở lại, hệ thống phải lấy được:
- Ván đang chơi.
- Hàng ngang hiện tại.
- Những hàng đã mở.
- Các ký tự từ khóa đã hé lộ.
- Người chơi và điểm.
- Thời gian còn lại.
- Người chiến thắng nếu đã có.
13. Bộ cấu hình game
Mình đề xuất cho phép MC cấu hình các thông số sau:
Cấu hình mặc định cho một ván
Số hàng ngang
5 hàng

7 hàng

10 hàng



Thời gian mỗi câu hỏi
20s




Thời gian vòng giải mã cuối
60s





Điểm người trả lời đúng đầu tiên

Điểm người trả lời đúng tiếp theo

Điểm giải mã từ khóa

Cooldown đoán từ khóa
5s




[x] Cho phép MC cung cấp gợi ý

Cấu hình hiện tại

Đây là cấu hình xem trước, chưa được lưu vào backend.
 Sao chép cấu hình JSON
14. Kế hoạch triển khai
Mình khuyên không nên triển khai tất cả cùng lúc. Chia thành 4 giai đoạn để tránh ảnh hưởng game Knowledge Battle hiện tại.
Giai đoạn	Công việc	Ưu tiên
Phase 1	Game engine, bảng ô chữ, câu hỏi, đáp án, mở ký tự	Cao nhất
Phase 2	Nhận comment, kiểm tra đáp án, tính điểm, keyword	Cao nhất
Phase 3	Overlay, animation, TTS, leaderboard	Cao
Phase 4	Gợi ý, thống kê, nhiều chủ đề, hiệu ứng nâng cao	Sau

Tiêu chí hoàn thành MVP
- [ ] MC tạo được bộ câu hỏi.
- [ ] Backend kiểm tra tính hợp lệ của ô chữ.
- [ ] MC bắt đầu và điều khiển được ván.
- [ ] Người xem trả lời hàng ngang bằng comment.
- [ ] Hệ thống xác định người đúng đầu tiên.
- [ ] Hệ thống lật hàng ngang và mở ký tự.
- [ ] Người xem đoán từ khóa bất cứ lúc nào.
- [ ] Hệ thống xác định người giải mã đầu tiên.
- [ ] Tính điểm chính xác.
- [ ] Bảng xếp hạng cập nhật realtime.
- [ ] TTS đọc câu hỏi.
- [ ] Overlay hoạt động ổn định trên TikTok LIVE Studio.
- [ ] Có thể khôi phục game sau khi refresh Admin.
- [ ] Không xử lý trùng comment và không cộng điểm hai lần.

15. Những quyết định nghiệp vụ mình khuyến nghị chốt
Có 4 điểm quan trọng mình muốn cậu chủ lưu ý trước khi giao AI lập trình.
1. Không khóa đoán từ khóa đến cuối: Người xem được quyền giải mã từ lúc game bắt đầu. Điều này tạo sự cạnh tranh liên tục.
2. Không dùng AI để quyết định đáp án: Sử dụng đáp án chuẩn và danh sách đáp án thay thế để đảm bảo công bằng.
3. Tách Game State và Question State: Cho phép đoán từ khóa song song với trả lời hàng ngang.
4. Server là nguồn dữ liệu chính: Overlay và Admin chỉ hiển thị, không tự quyết định người chiến thắng hay điểm.
16. Phạm vi phát triển mình đề xuất
Khuyến nghị MVP
Mình chọn cấu hình triển khai đầu tiên như sau:
- 5 hàng ngang.
- Từ khóa 5 ký tự.
- Tất cả người xem đều tham gia.
- Mỗi hàng 20 giây.
- Từ khóa được hé lộ từng ký tự.
- Được đoán từ khóa bất cứ lúc nào.
- Đúng hàng ngang đầu tiên: 100 điểm.
- Đúng hàng ngang tiếp theo: 20 điểm.
- Giải mã từ khóa: 500 điểm.
- Có TTS, hiệu ứng lật ô và bảng xếp hạng.
- Không tích hợp quà tặng vào logic tính điểm ở MVP.
Thứ tự phát triển: Backend Game Engine → Comment Processing → WebSocket → Admin → Overlay → TikTok LIVE test.

Với cấu trúc NestJS và hệ thống TikTok LIVE hiện tại, có thể phát triển thành một module độc lập, không cần viết lại hệ thống nhận comment hoặc hệ thống giọng đọc. 

Bước tiếp theo mình có thể viết cho cậu chủ một bản Technical Specification (SRS) kèm database migration, API contract, WebSocket payload và danh sách task triển khai theo từng file NestJS, đủ chi tiết để đưa vào Claude Code hoặc Antigravity thực hiện.