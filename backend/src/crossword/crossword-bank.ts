import { CrosswordQuestionSet, CrosswordRowConfig } from './crossword.service';

export interface ClueTemplate {
  question: string;
  answer: string;
  cleanAnswer: string;
  baseChars: string; // Chuỗi không dấu chữ hoa của cleanAnswer để tìm giao điểm nhanh
  acceptedAnswers: string[];
  hint: string;
  topic: string;
}

export interface KeywordSeed {
  keyword: string;
  topic: string;
  hint: string;
}

function toAsciiUpper(s: string): string {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

function toCleanUpper(s: string): string {
  return String(s || '')
    .trim()
    .toUpperCase()
    .replace(/[^\p{L}\p{N}]/gu, '');
}

/**
 * Ngân hàng Câu hỏi Hàng ngang chất lượng cao đa chủ đề (Địa lý, Lịch sử, Ẩm thực, Khoa học, Công nghệ, Thể thao, Văn hóa)
 */
const RAW_CLUES: Array<{ q: string; a: string; h: string; t: string; alt?: string[] }> = [
  // === ĐỊA LÝ & DU LỊCH VIỆT NAM ===
  { q: 'Thủ đô ngàn năm văn hiến của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam?', a: 'HÀ NỘI', h: 'Thành phố vì hòa bình bên sông Hồng', t: 'Địa lý Việt Nam' },
  { q: 'Vịnh biển kỳ quan thiên nhiên thế giới thuộc tỉnh Quảng Ninh với hàng nghìn đảo đá vôi?', a: 'HẠ LONG', h: 'Nơi rồng đáp xuống theo truyền thuyết', t: 'Địa lý Việt Nam' },
  { q: 'Thành phố biển miền Trung nổi tiếng với Cầu Rồng phun lửa và Bà Nà Hills?', a: 'ĐÀ NẴNG', h: 'Thành phố đáng sống bên dòng sông Hàn', t: 'Địa lý Việt Nam' },
  { q: 'Đỉnh núi cao 3.143m ở Lào Cai được mệnh danh là "Nóc nhà Đông Dương"?', a: 'FANSIPAN', h: 'Nằm trên dãy Hoàng Liên Sơn', t: 'Địa lý Việt Nam' },
  { q: 'Phố cổ nổi tiếng ở Quảng Nam lung linh đèn lồng bên dòng sông Hoài?', a: 'HỘI AN', h: 'Di sản văn hóa thế giới có Chùa Cầu', t: 'Địa lý Việt Nam' },
  { q: 'Hòn đảo lớn nhất Việt Nam thuộc tỉnh Kiên Giang, được mệnh danh là Đảo Ngọc?', a: 'PHÚ QUỐC', h: 'Nổi tiếng với nước mắm, ngọc trai và bãi Sao', t: 'Địa lý Việt Nam' },
  { q: 'Thành phố ngàn hoa nằm trên cao nguyên Lâm Viên thuộc tỉnh Lâm Đồng?', a: 'ĐÀ LẠT', h: 'Thành phố sương mù và hồ Xuân Hương', t: 'Địa lý Việt Nam' },
  { q: 'Hang động tự nhiên lớn nhất thế giới nằm tại Vườn quốc gia Phong Nha - Kẻ Bàng, Quảng Bình?', a: 'SƠN ĐOÒNG', h: 'Hang động kỳ vĩ có hệ sinh thái riêng bên trong', t: 'Địa lý Việt Nam' },
  { q: 'Thành phố trực thuộc trung ương ở trung tâm vùng Đồng bằng sông Cửu Long, nổi tiếng với Bến Ninh Kiều?', a: 'CẦN THƠ', h: 'Tây Đô, nổi tiếng với chợ nổi Cái Răng', t: 'Địa lý Việt Nam' },
  { q: 'Tỉnh cực Bắc của Việt Nam nơi có Cột cờ Lũng Cú và Cao nguyên đá Đồng Văn?', a: 'HÀ GIANG', h: 'Nổi tiếng với mùa hoa tam giác mạch và đèo Mã Pí Lèng', t: 'Địa lý Việt Nam' },
  { q: 'Tỉnh cực Nam trên đất liền của Tổ quốc Việt Nam với hệ sinh thái rừng ngập mặn?', a: 'CÀ MAU', h: 'Mũi đất thiêng liêng cuối cùng trên bản đồ chữ S', t: 'Địa lý Việt Nam' },
  { q: 'Thành phố cảng lớn nhất miền Bắc Việt Nam, còn được gọi là Thành phố Hoa Phượng Đỏ?', a: 'HẢI PHÒNG', h: 'Nổi tiếng với bánh đa cua và đảo Cát Bà', t: 'Địa lý Việt Nam' },
  { q: 'Tỉnh miền Tây Nam Bộ được mệnh danh là "Xứ Dừa" của Việt Nam?', a: 'BẾN TRE', h: 'Quê hương phong trào Đồng Khởi và đặc sản kẹo dừa', t: 'Địa lý Việt Nam' },
  { q: 'Quần thể danh thắng Tràng An, Tam Cốc - Bích Động và Cố đô Hoa Lư thuộc tỉnh nào?', a: 'NINH BÌNH', h: 'Vịnh Hạ Long trên cạn của miền Bắc', t: 'Địa lý Việt Nam' },
  { q: 'Thác nước tự nhiên hùng vĩ nằm trên biên giới Việt - Trung thuộc tỉnh Cao Bằng?', a: 'BẢN GIỐC', h: 'Thác nước đẹp bậc nhất Đông Nam Á trên sông Quây Sơn', t: 'Địa lý Việt Nam' },
  { q: 'Hồ nước ngọt tự nhiên trên núi lớn nhất miền Bắc thuộc tỉnh Bắc Kạn?', a: 'BA BỂ', h: 'Nằm trong vườn quốc gia cùng tên ở Bắc Kạn', t: 'Địa lý Việt Nam' },
  { q: 'Thành phố biển thuộc tỉnh Khánh Hòa được mệnh danh là Hòn ngọc Biển Đông?', a: 'NHA TRANG', h: 'Nổi tiếng với tháp Bà Ponagar và Vinpearl', t: 'Địa lý Việt Nam' },
  { q: 'Thị xã du lịch vùng cao thuộc tỉnh Lào Cai nổi tiếng với ruộng bậc thang và tuyết rơi mùa đông?', a: 'SA PA', h: 'Nơi giao thoa văn hóa các dân tộc Tây Bắc', t: 'Địa lý Việt Nam' },
  { q: 'Tỉnh có diện tích tự nhiên lớn nhất Việt Nam, quê hương của Chủ tịch Hồ Chí Minh?', a: 'NGHỆ AN', h: 'Vùng đất địa linh nhân kiệt bên dòng sông Lam', t: 'Địa lý Việt Nam' },
  { q: 'Dòng sông lớn chảy qua Thủ đô Hà Nội mang nặng phù sa màu đỏ?', a: 'SÔNG HỒNG', h: 'Còn gọi là Hồng Hà hay Nhị Hà', t: 'Địa lý Việt Nam' },
  { q: 'Dòng sông thơ mộng chảy qua cố đô Huế và đi qua cầu Trường Tiền?', a: 'SÔNG HƯƠNG', h: 'Ai đã đặt tên cho dòng sông?', t: 'Địa lý Việt Nam' },
  { q: 'Quần đảo tiền tiêu thiêng liêng của Việt Nam thuộc thành phố Đà Nẵng?', a: 'HOÀNG SA', h: 'Cùng với Trường Sa là máu thịt của Tổ quốc', t: 'Địa lý Việt Nam' },
  { q: 'Quần đảo tiền tiêu thiêng liêng của Tổ quốc thuộc tỉnh Khánh Hòa?', a: 'TRƯỜNG SA', h: 'Huyện đảo anh hùng giữa Biển Đông', t: 'Địa lý Việt Nam' },
  { q: 'Bán đảo nổi tiếng ở Đà Nẵng được ví như lá phổi xanh với tượng Phật Bà Quan Âm cao nhất Việt Nam?', a: 'SƠN TRÀ', h: 'Nơi sinh sống của loài Voọc chà vá chân nâu', t: 'Địa lý Việt Nam' },
  { q: 'Thành phố biên giới thuộc tỉnh Quảng Ninh có mũi Sa Vĩ — nơi đặt nét bút đầu tiên vẽ chữ S?', a: 'MÓNG CÁI', h: 'Cửa khẩu quốc tế sầm uất phía Đông Bắc', t: 'Địa lý Việt Nam' },

  // === LỊCH SỬ & VĂN HÓA DÂN TỘC ===
  { q: 'Vị vua đã ban Chiếu dời đô từ Hoa Lư về thành Đại La và đổi tên thành Thăng Long năm 1010?', a: 'LÝ THÁI TỔ', h: 'Tên thật là Lý Công Uẩn, vị vua sáng lập nhà Lý', t: 'Lịch sử Việt Nam' },
  { q: 'Vị anh hùng dân tộc đánh tan quân Nam Hán trên sông Bạch Đằng năm 938, mở ra kỷ nguyên độc lập?', a: 'NGÔ QUYỀN', h: 'Người dùng kế đóng cọc gỗ bịt sắt trên sông Bạch Đằng', t: 'Lịch sử Việt Nam' },
  { q: 'Hưng Đạo Đại Vương chỉ huy quân dân nhà Trần 3 lần đại thắng quân Nguyên Mông là ai?', a: 'TRẦN QUỐC TUẤN', h: 'Tác giả của Hịch Tướng Sĩ bất hủ', t: 'Lịch sử Việt Nam' },
  { q: 'Người anh hùng áo vải cờ đào đại phá 29 vạn quân Thanh vào mùa xuân năm Kỷ Dậu 1789?', a: 'QUANG TRUNG', h: 'Tên thật là Nguyễn Huệ', t: 'Lịch sử Việt Nam' },
  { q: 'Khởi nghĩa Lam Sơn đánh đuổi quân Minh xâm lược gắn liền với vị anh hùng dân tộc nào?', a: 'LÊ LỢI', h: 'Sau khi thắng lợi lên ngôi hiệu là Lê Thái Tổ', t: 'Lịch sử Việt Nam' },
  { q: 'Danh nhân văn hóa thế giới, tác giả của Bình Ngô Đại Cáo thời hậu Lê?', a: 'NGUYỄN TRÃI', h: 'Hiệu là Ức Trai, quân sư của Lê Lợi', t: 'Lịch sử Việt Nam' },
  { q: 'Đại thi hào dân tộc Việt Nam, tác giả kiệt tác Truyện Kiều?', a: 'NGUYỄN DU', h: 'Tên chữ là Tố Như, hiệu là Thanh Hiên', t: 'Lịch sử Việt Nam' },
  { q: 'Quốc hiệu đầu tiên của nước ta thời các Vua Hùng dựng nước là gì?', a: 'VĂN LANG', h: 'Kinh đô đặt tại Phong Châu (Phú Thọ)', t: 'Lịch sử Việt Nam' },
  { q: 'Quốc hiệu của nước ta thời An Dương Vương với kinh đô Cổ Loa là gì?', a: 'ÂU LẠC', h: 'Gắn với truyền thuyết nỏ thần Liên Châu', t: 'Lịch sử Việt Nam' },
  { q: 'Trường đại học đầu tiên của Việt Nam được xây dựng tại Hà Nội từ thời nhà Lý?', a: 'QUỐC TỬ GIÁM', h: 'Nằm trong quần thể Văn Miếu - Quốc Tử Giám', t: 'Lịch sử Việt Nam' },
  { q: 'Nhạc cụ cổ truyền bằng đồng tiêu biểu nhất của nền văn minh Đông Sơn thời Vua Hùng?', a: 'TRỐNG ĐỒNG', h: 'Trên mặt có hình ngôi sao nhiều cánh và chim Lạc', t: 'Lịch sử Việt Nam' },
  { q: 'Trang phục truyền thống tôn vinh vẻ đẹp dịu dàng, thướt tha của người phụ nữ Việt Nam?', a: 'ÁO DÀI', h: 'Thường mặc trong các dịp lễ Tết, sự kiện trang trọng', t: 'Văn hóa Việt Nam' },
  { q: 'Loài hoa thanh cao sống trong đầm lầy nhưng tỏa hương thơm ngát, biểu tượng văn hóa Việt Nam?', a: 'HOA SEN', h: 'Trong đầm gì đẹp bằng sen', t: 'Văn hóa Việt Nam' },
  { q: 'Loài cây dẻo dai gắn liền với làng quê Việt Nam và truyền thuyết Thánh Gióng nhổ đánh giặc Ân?', a: 'CÂY TRE', h: 'Thân gầy guộc, lá mong manh mà sao nên lũy nên thành tre ơi', t: 'Văn hóa Việt Nam' },
  { q: 'Chiến dịch lịch sử năm 1954 "lừng lẫy năm châu, chấn động địa cầu" diễn ra tại đâu?', a: 'ĐIỆN BIÊN PHỦ', h: 'Do Đại tướng Võ Nguyên Giáp trực tiếp chỉ huy', t: 'Lịch sử Việt Nam' },

  // === ẨM THỰC & ĐỜI SỐNG ===
  { q: 'Món ăn quốc hồn quốc túy của Việt Nam với bánh phở trắng, nước dùng ninh xương thơm lừng và thịt bò?', a: 'PHỞ BÒ', h: 'Món súp sợi gạo nổi tiếng nhất Việt Nam trên bản đồ ẩm thực thế giới', t: 'Ẩm thực Việt Nam' },
  { q: 'Thức uống truyền thống pha bằng phin nhỏ giọt giúp tỉnh táo mỗi buổi sáng của người Việt?', a: 'CÀ PHÊ', h: 'Thủ phủ của loại hạt này nằm tại Buôn Ma Thuột', t: 'Ẩm thực Việt Nam' },
  { q: 'Món ăn đường phố Việt Nam nổi tiếng toàn cầu với vỏ bánh nướng giòn rụm kẹp nhân pate, thịt, đồ chua?', a: 'BÁNH MÌ', h: 'Từ tiếng Việt được đưa nguyên bản vào từ điển Oxford', t: 'Ẩm thực Việt Nam' },
  { q: 'Món ăn đặc trưng của Hà Nội gồm bún tươi, chả thịt lợn nướng trên than hoa và nước chấm chua ngọt?', a: 'BÚN CHẢ', h: 'Món ăn nổi tiếng khắp phố cổ Hà Nội', t: 'Ẩm thực Việt Nam' },
  { q: 'Loại bánh hình vuông gói bằng lá dong xanh mướt, tượng trưng cho Đất trong ngày Tết cổ truyền?', a: 'BÁNH CHƯNG', h: 'Thịt mỡ dưa hành câu đối đỏ / Cây nêu tràng pháo bánh chưng xanh', t: 'Ẩm thực Việt Nam' },
  { q: 'Món cơm trứ danh của Sài Gòn nấu từ hạt gạo vỡ ăn kèm sườn nướng, bì, chả, trứng ốp la?', a: 'CƠM TẤM', h: 'Đặc sản bình dân được yêu thích bậc nhất miền Nam', t: 'Ẩm thực Việt Nam' },
  { q: 'Món cuốn thanh mát gồm tôm, thịt luộc, bún, rau thơm cuộn trong bánh tráng mỏng?', a: 'GỎI CUỐN', h: 'Chấm cùng tương đen hoặc nước mắm chua ngọt', t: 'Ẩm thực Việt Nam' },
  { q: 'Đặc sản cố đô Huế với sợi bún to, chân giò heo, thịt bò và hương sả, mắm ruốc đậm đà?', a: 'BÚN BÒ HUẾ', h: 'Món bún cay nồng trứ danh miền Trung', t: 'Ẩm thực Việt Nam' },
  { q: 'Món mì đặc sản của xứ Quảng Nam với sợi mì vàng nghệ, tôm, thịt, trứng cút và bánh tráng nướng giòn?', a: 'MÌ QUẢNG', h: 'Chan xâm xấp nước nhân đậm đà chứ không chan đầy nước như phở', t: 'Ẩm thực Việt Nam' },
  { q: 'Món ăn truyền thống miền Bắc gói bằng bánh đa nem và chiên vàng giòn rụm trên chảo dầu?', a: 'NEM RÁN', h: 'Miền Nam thường gọi món này là Chả giò', t: 'Ẩm thực Việt Nam' },
  { q: 'Loại bánh dẻo thơm hình vuông màu xanh lá dứa nhân đậu xanh dừa nạo, đặc sản của tỉnh Hải Dương?', a: 'BÁNH ĐẬU XANH', h: 'Hải Dương nổi tiếng với bánh đậu xanh và bánh gai', t: 'Ẩm thực Việt Nam' },
  { q: 'Loại quả nhiệt đới có lớp vỏ nhiều gai nhọn và mùi hương nồng nàn đặc trưng, được mệnh danh là Vua của các loại trái cây?', a: 'SẦU RIÊNG', h: 'Loại quả người thích thì mê mẩn, người không quen thì ngại mùi', t: 'Ẩm thực Việt Nam' },
  { q: 'Loại quả thanh mát có ruột trắng hoặc đỏ với nhiều hạt nhỏ màu đen, vỏ màu hồng có tai xanh?', a: 'THANH LONG', h: 'Trồng rất nhiều ở tỉnh Bình Thuận và Long An', t: 'Ẩm thực Việt Nam' },
  { q: 'Loại hạt lương thực quan trọng nhất gắn liền với nền văn minh nông nghiệp của Việt Nam?', a: 'LÚA GẠO', h: 'Hạt ngọc trời nuôi sống con người', t: 'Ẩm thực Việt Nam' },

  // === CÔNG NGHỆ & LẬP TRÌNH ===
  { q: 'Ngôn ngữ lập trình phổ biến dùng để phát triển web backend, nổi tiếng với framework Laravel?', a: 'PHP', h: 'Biểu tượng chú voi màu xanh tím', t: 'Công nghệ thông tin' },
  { q: 'Viết tắt 3 chữ cái của Giao diện lập trình ứng dụng giúp các phần mềm giao tiếp với nhau?', a: 'API', h: 'Application Programming Interface', t: 'Công nghệ thông tin' },
  { q: 'Hệ quản trị cơ sở dữ liệu lưu trữ trên bộ nhớ RAM cực nhanh, thường dùng làm Cache và Pub/Sub?', a: 'REDIS', h: 'Logo hình khối màu đỏ bắt đầu bằng chữ R', t: 'Công nghệ thông tin' },
  { q: 'Kỹ thuật lưu trữ dữ liệu tạm thời để tăng tốc độ truy xuất và giảm tải cho hệ thống?', a: 'CACHE', h: '5 chữ cái tiếng Anh bắt đầu bằng chữ C', t: 'Công nghệ thông tin' },
  { q: 'Hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở phổ biến nhất thế giới có biểu tượng chú cá heo?', a: 'MYSQL', h: 'Ghép từ MY và SQL', t: 'Công nghệ thông tin' },
  { q: 'Ngôn ngữ lập trình thống trị trong lĩnh vực Trí tuệ nhân tạo (AI) và Khoa học dữ liệu, có biểu tượng con trăn?', a: 'PYTHON', h: '6 chữ cái, cú pháp cực kỳ ngắn gọn và dễ đọc', t: 'Công nghệ thông tin' },
  { q: 'Nền tảng đóng gói ứng dụng vào các Container có biểu tượng chú cá voi chở các thùng hàng?', a: 'DOCKER', h: 'Giúp chạy ứng dụng đồng nhất trên mọi môi trường', t: 'Công nghệ thông tin' },
  { q: 'Nền tảng lưu trữ mã nguồn Git lớn nhất thế giới thuộc sở hữu của Microsoft có biểu tượng mèo bạch tuộc?', a: 'GITHUB', h: 'Nơi hàng triệu lập trình viên chia sẻ mã nguồn mở', t: 'Công nghệ thông tin' },
  { q: 'Hệ điều hành mã nguồn mở nổi tiếng có linh vật là chú chim cánh cụt Tux?', a: 'LINUX', h: 'Do Linus Torvalds sáng lập năm 1991', t: 'Công nghệ thông tin' },
  { q: 'Môi trường chạy JavaScript phía máy chủ (Server-side) được xây dựng trên V8 Engine của Google?', a: 'NODEJS', h: 'Biểu tượng hình lục giác màu xanh lá cây', t: 'Công nghệ thông tin' },
  { q: 'Thư viện giao diện người dùng (UI) bằng JavaScript phổ biến nhất do Meta (Facebook) phát triển?', a: 'REACT', h: 'Biểu tượng hình nguyên tử màu xanh cyan', t: 'Công nghệ thông tin' },
  { q: 'Framework JavaScript tiến bộ (Progressive) dùng để xây dựng giao diện web hiện đại với file .vue?', a: 'VUEJS', h: 'Do Evan You sáng lập, logo chữ V màu xanh lục', t: 'Công nghệ thông tin' },
  { q: 'Ngôn ngữ lập trình hiện đại do Google phát triển năm 2009 nổi tiếng về xử lý đồng thời (Goroutines)?', a: 'GOLANG', h: 'Còn gọi là ngôn ngữ Go, linh vật chuột Gopher màu xanh', t: 'Công nghệ thông tin' },
  { q: 'Định dạng trao đổi dữ liệu văn bản gọn nhẹ phổ biến nhất cho các REST API hiện nay?', a: 'JSON', h: 'JavaScript Object Notation (4 chữ cái)', t: 'Công nghệ thông tin' },
  { q: 'Giao thức truyền tải siêu văn bản bảo mật có biểu tượng ổ khóa trên trình duyệt web?', a: 'HTTPS', h: 'HyperText Transfer Protocol Secure', t: 'Công nghệ thông tin' },
  { q: 'Máy chủ cung cấp tài nguyên, dữ liệu và dịch vụ cho các máy khách (Client) qua mạng gọi là gì?', a: 'SERVER', h: 'Từ tiếng Anh 6 chữ cái bắt đầu bằng chữ S', t: 'Công nghệ thông tin' },
  { q: 'Nền tảng video ngắn và livestream tương tác trực tiếp phổ biến hàng đầu thế giới hiện nay?', a: 'TIKTOK', h: 'Biểu tượng hình nốt nhạc trên nền đen', t: 'Công nghệ thông tin' },

  // === KHOA HỌC, TỰ NHIÊN & VŨ TRỤ ===
  { q: 'Hành tinh thứ ba tính từ Mặt Trời, ngôi nhà chung duy nhất được biết đến có sự sống?', a: 'TRÁI ĐẤT', h: 'Hành tinh xanh của nhân loại', t: 'Khoa học & Vũ trụ' },
  { q: 'Ngôi sao nằm ở trung tâm Hệ Mặt Trời, cung cấp ánh sáng và nhiệt năng cho Trái Đất?', a: 'MẶT TRỜI', h: 'Quả cầu plasma khổng lồ mọc ở hướng Đông', t: 'Khoa học & Vũ trụ' },
  { q: 'Vệ tinh tự nhiên duy nhất của Trái Đất, tỏa sáng lung linh vào ban đêm và gây ra hiện tượng thủy triều?', a: 'MẶT TRĂNG', h: 'Gắn liền với Tết Trung Thu và chú Cuội, chị Hằng', t: 'Khoa học & Vũ trụ' },
  { q: 'Hành tinh lớn nhất trong Hệ Mặt Trời, nổi tiếng với Vết Đỏ Lớn?', a: 'SAO MỘC', h: 'Trong tiếng Anh gọi là Jupiter', t: 'Khoa học & Vũ trụ' },
  { q: 'Hành tinh nổi tiếng với hệ thống vành đai băng và đá tuyệt đẹp bao quanh?', a: 'SAO THỔ', h: 'Trong tiếng Anh gọi là Saturn', t: 'Khoa học & Vũ trụ' },
  { q: 'Hành tinh láng giềng của Trái Đất được mệnh danh là "Hành tinh Đỏ"?', a: 'SAO HỎA', h: 'Trong tiếng Anh gọi là Mars', t: 'Khoa học & Vũ trụ' },
  { q: 'Nguyên tố hóa học cần thiết nhất cho sự hô hấp của sinh vật và sự cháy, chiếm 21% không khí?', a: 'OXY', h: 'Ký hiệu hóa học là O', t: 'Khoa học & Vũ trụ' },
  { q: 'Kim loại màu vàng óng quý giá, không bị gỉ sét, có ký hiệu hóa học là Au?', a: 'VÀNG', h: 'Dùng làm trang sức và dự trữ giá trị', t: 'Khoa học & Vũ trụ' },
  { q: 'Kim loại phổ biến nhất dùng để luyện gang thép trong xây dựng và chế tạo máy, ký hiệu là Fe?', a: 'SẮT', h: '3 chữ cái, có tính nhiễm từ mạnh', t: 'Khoa học & Vũ trụ' },
  { q: 'Kim loại dẫn điện tốt nhất trong tất cả các kim loại, có màu trắng sáng và ký hiệu hóa học là Ag?', a: 'BẠC', h: 'Đứng trước Vàng trong thành ngữ Vàng Bạc Đá Quý', t: 'Khoa học & Vũ trụ' },
  { q: 'Khoáng vật tự nhiên cứng nhất trong thang độ cứng Mohs, được tạo thành từ nguyên tố Cacbon?', a: 'KIM CƯƠNG', h: 'Loại đá quý lấp lánh đắt giá nhất', t: 'Khoa học & Vũ trụ' },
  { q: 'Hiện tượng quang học xuất hiện trên bầu trời sau cơn mưa với 7 dải màu rực rỡ?', a: 'CẦU VỒNG', h: 'Đỏ, cam, vàng, lục, lam, chàm, tím', t: 'Khoa học & Vũ trụ' },
  { q: 'Loài động vật có vú lớn nhất hành tinh hiện nay đang sinh sống dưới đại dương?', a: 'CÁ VOI XANH', h: 'Trái tim của loài này nặng bằng cả một chiếc ô tô nhỏ', t: 'Khoa học & Tự nhiên' },
  { q: 'Loài thú săn mồi trên cạn chạy nhanh nhất thế giới với vận tốc có thể đạt tới 110 km/h?', a: 'BÁO SĂN', h: 'Trong tiếng Anh gọi là Cheetah', t: 'Khoa học & Tự nhiên' },
  { q: 'Loài chim biểu tượng của hòa bình thế giới thường mang cành ô liu?', a: 'BỒ CÂU', h: 'Loài chim hiền lành thường được thả trong các lễ kỷ niệm lớn', t: 'Khoa học & Tự nhiên' },
  { q: 'Loài thú oai phong được mệnh danh là "Chúa tể sơn lâm" trong rừng xanh?', a: 'CON HỔ', h: 'Con giáp thứ 3 (Chi Dần) trong 12 con giáp', t: 'Khoa học & Tự nhiên' },
  { q: 'Loài chim săn mồi cỡ lớn sải cánh rộng được mệnh danh là "Chúa tể bầu trời"?', a: 'ĐẠI BÀNG', h: 'Biểu tượng của sức mạnh, tầm nhìn xa và sự dũng mãnh', t: 'Khoa học & Tự nhiên' },

  // === THỂ THAO, NGHỆ THUẬT & ĐỜI SỐNG ===
  { q: 'Môn thể thao vua thu hút hàng tỷ người hâm mộ trên toàn thế giới với 11 cầu thủ mỗi đội?', a: 'BÓNG ĐÁ', h: 'Sôi động nhất với giải đấu World Cup 4 năm một lần', t: 'Thể thao' },
  { q: 'Môn thể thao dưới nước giúp rèn luyện toàn diện hệ hô hấp, tim mạch và chiều cao?', a: 'BƠI LỘI', h: 'Có các kiểu bơi ếch, bơi sải, bơi bướm, bơi ngửa', t: 'Thể thao' },
  { q: 'Môn thể thao trí tuệ đối kháng trên bàn cờ 64 ô vuông đen trắng với Vua, Hậu, Xe, Tượng, Mã, Tốt?', a: 'CỜ VUA', h: 'Môn thể thao trí tuệ phổ biến nhất thế giới', t: 'Thể thao' },
  { q: 'Phần thưởng cao quý nhất trao cho vận động viên giành vị trí số 1 tại Thế vận hội Olympic?', a: 'HUY CHƯƠNG VÀNG', h: 'Tấm huy chương danh giá nhất trên bục vinh quang', t: 'Thể thao' },
  { q: 'Sân vận động quốc gia lớn nhất Việt Nam nằm tại quận Nam Từ Liêm, Thủ đô Hà Nội?', a: 'MỸ ĐÌNH', h: 'Nơi diễn ra các trận đấu lớn của Đội tuyển Quốc gia Việt Nam', t: 'Thể thao' },
  { q: 'Nhạc cụ dân tộc Việt Nam chỉ có duy nhất một sợi dây nhưng tạo ra âm thanh ngân nga sâu lắng?', a: 'ĐÀN BẦU', h: 'Còn gọi là Độc huyền cầm', t: 'Nghệ thuật & Văn hóa' },
  { q: 'Loại hình sân khấu truyền thống độc đáo trên mặt nước chỉ có ở Việt Nam?', a: 'MÚA RỐI NƯỚC', h: 'Các con rối gỗ biểu diễn tại thủy đình trên mặt hồ', t: 'Nghệ thuật & Văn hóa' },
  { q: 'Mùa đầu tiên trong năm gắn liền với Tết Nguyên Đán, trăm hoa đua nở và chồi non lộc biếc?', a: 'MÙA XUÂN', h: 'Mùa của sự khởi đầu và đoàn viên', t: 'Đời sống' },
  { q: 'Mùa có thời tiết nắng ấm, tiếng ve kêu râm ran và hoa phượng đỏ nở rộ khắp sân trường?', a: 'MÙA HÈ', h: 'Còn gọi là mùa hạ, mùa nghỉ hè của học sinh', t: 'Đời sống' },
  { q: 'Mùa lãng mạn nhất trong năm ở Hà Nội với hương hoa sữa, cốm làng Vòng và lá vàng rơi?', a: 'MÙA THU', h: 'Mùa của Tết Trung Thu và ngày tựu trường', t: 'Đời sống' },
  { q: 'Đức tính quý báu của con người luôn nói đúng sự thật, ngay thẳng và không gian dối?', a: 'TRUNG THỰC', h: 'Một trong 5 điều Bác Hồ dạy thiếu niên nhi đồng: Khiêm tốn, thật thà, dũng cảm', t: 'Đời sống' },
  { q: 'Sức mạnh gắn kết tập thể cùng chung sức, đồng lòng vượt qua mọi thử thách gọi là gì?', a: 'ĐOÀN KẾT', h: 'Đoàn kết, đoàn kết, đại đoàn kết / Thành công, thành công, đại thành công', t: 'Đời sống' },
  { q: 'Vốn hiểu biết, kiến thức khoa học và kinh nghiệm quý báu mà con người tích lũy được qua học tập?', a: 'TRI THỨC', h: 'Tri thức là sức mạnh', t: 'Đời sống' },
  { q: 'Khả năng tìm tòi, phát minh ra những ý tưởng mới mẻ, độc đáo và hữu ích?', a: 'SÁNG TẠO', h: 'Yếu tố cốt lõi của đổi mới và phát triển', t: 'Đời sống' },
];

export const CROSSWORD_CLUE_BANK: ClueTemplate[] = RAW_CLUES.map((c) => {
  const cleanAnswer = toCleanUpper(c.a);
  const baseChars = toAsciiUpper(cleanAnswer);
  const accepted = Array.from(new Set([c.a.toUpperCase(), cleanAnswer, baseChars, ...(c.alt || [])]));
  return {
    question: c.q,
    answer: c.a.toUpperCase(),
    cleanAnswer,
    baseChars,
    acceptedAnswers: accepted,
    hint: c.h,
    topic: c.t,
  };
});

/**
 * Danh sách Từ khóa bí mật đa dạng chủ đề để sinh 200+ Bộ Ô Chữ (1,000+ Câu hỏi hàng ngang)
 */
export const CROSSWORD_KEYWORD_SEEDS: KeywordSeed[] = [
  { keyword: 'HÀNỘI', topic: 'Địa lý & Lịch sử Việt Nam', hint: 'Thủ đô ngàn năm văn hiến, trái tim của cả nước' },
  { keyword: 'ĐÀNẴNG', topic: 'Du lịch Việt Nam', hint: 'Thành phố biển đáng sống miền Trung với Cầu Rồng' },
  { keyword: 'SÀIGÒN', topic: 'Đô thị Việt Nam', hint: 'Hòn ngọc Viễn Đông năng động bậc nhất phía Nam' },
  { keyword: 'HẠLONG', topic: 'Kỳ quan Thiên nhiên', hint: 'Vịnh biển di sản thiên nhiên thế giới tại Quảng Ninh' },
  { keyword: 'HỘIAN', topic: 'Di sản Văn hóa', hint: 'Phố cổ lung linh đèn lồng bên dòng sông Hoài' },
  { keyword: 'CẦNTHƠ', topic: 'Miền Tây Sông Nước', hint: 'Thủ phủ miền Tây với bến Ninh Kiều và chợ nổi Cái Răng' },
  { keyword: 'ĐÀLẠT', topic: 'Du lịch Cao nguyên', hint: 'Thành phố ngàn hoa và sương mù trên cao nguyên Lâm Viên' },
  { keyword: 'PHÚQUỐC', topic: 'Biển đảo Việt Nam', hint: 'Đảo Ngọc lớn nhất Việt Nam thuộc tỉnh Kiên Giang' },
  { keyword: 'TRƯỜNGSA', topic: 'Biển đảo Tổ quốc', hint: 'Quần đảo tiền tiêu thiêng liêng thuộc tỉnh Khánh Hòa' },
  { keyword: 'HOÀNGSA', topic: 'Chủ quyền Biển đảo', hint: 'Quần đảo thiêng liêng thuộc thành phố Đà Nẵng' },
  { keyword: 'VIỆTNAM', topic: 'Tự hào Dân tộc', hint: 'Đất nước hình chữ S thân thương bên bờ Biển Đông' },
  { keyword: 'ĐỘCLẬP', topic: 'Lịch sử Dân tộc', hint: 'Không có gì quý hơn Độc lập, Tự do' },
  { keyword: 'TỰHÀO', topic: 'Tinh thần Việt Nam', hint: 'Cảm xúc kiêu hãnh về truyền thống hào hùng của dân tộc' },
  { keyword: 'ĐOÀNKẾT', topic: 'Sức mạnh Dân tộc', hint: 'Truyền thống quý báu tạo nên mọi chiến thắng của người Việt' },
  { keyword: 'TRITHỨC', topic: 'Giáo dục & Khoa học', hint: 'Chìa khóa mở cánh cửa tương lai và chinh phục đỉnh cao' },
  { keyword: 'SÁNGTẠO', topic: 'Đổi mới & Phát triển', hint: 'Khả năng tạo ra giá trị mới và bứt phá giới hạn' },
  { keyword: 'THÀNHCÔNG', topic: 'Khát vọng Chinh phục', hint: 'Kết quả rực rỡ đạt được sau những nỗ lực bền bỉ' },
  { keyword: 'VINHQUANG', topic: 'Đỉnh cao Chiến thắng', hint: 'Danh dự và niềm tự hào của nhà vô địch trên bục trao giải' },
  { keyword: 'HOASEN', topic: 'Quốc hoa & Văn hóa', hint: 'Loài hoa thanh cao tỏa ngát hương thơm từ đầm nước' },
  { keyword: 'ÁODÀI', topic: 'Trang phục Truyền thống', hint: 'Biểu tượng duyên dáng của người phụ nữ Việt Nam' },
  { keyword: 'PHỞBÒ', topic: 'Tinh hoa Ẩm thực Việt', hint: 'Món ăn truyền thống Việt Nam nổi tiếng toàn cầu' },
  { keyword: 'BÁNHMÌ', topic: 'Ẩm thực Đường phố', hint: 'Món bánh giòn rụm của Việt Nam lọt Top ngon nhất thế giới' },
  { keyword: 'CÀPHÊ', topic: 'Văn hóa Thưởng thức', hint: 'Thức uống thơm nồng mỗi sáng pha bằng phin của người Việt' },
  { keyword: 'CƠMTẤM', topic: 'Đặc sản Phương Nam', hint: 'Món cơm sườn bì chả trứ danh của người Sài Gòn' },
  { keyword: 'BÚNCHẢ', topic: 'Ẩm thực Hà Thành', hint: 'Món bún ăn kèm thịt nướng than hoa đặc trưng của Hà Nội' },
  { keyword: 'PYTHON', topic: 'Công nghệ & AI', hint: 'Ngôn ngữ lập trình hàng đầu cho Trí tuệ nhân tạo và Data Science' },
  { keyword: 'DOCKER', topic: 'Kỹ thuật Phần mềm', hint: 'Nền tảng Container hóa ứng dụng có biểu tượng cá voi xanh' },
  { keyword: 'NODEJS', topic: 'Lập trình Backend', hint: 'Môi trường chạy JavaScript tốc độ cao trên máy chủ' },
  { keyword: 'GITHUB', topic: 'Cộng đồng Lập trình', hint: 'Nền tảng lưu trữ mã nguồn mở lớn nhất thế giới' },
  { keyword: 'SERVER', topic: 'Hạ tầng Mạng & Cloud', hint: 'Hệ thống máy chủ xử lý và cung cấp dịch vụ qua Internet' },
  { keyword: 'TIKTOK', topic: 'Mạng xã hội & Livestream', hint: 'Nền tảng video ngắn và livestream tương tác sôi động nhất' },
  { keyword: 'VŨTRỤ', topic: 'Thiên văn học', hint: 'Không gian bao la chứa hàng tỷ thiên hà và các vì sao' },
  { keyword: 'TRÁIĐẤT', topic: 'Khoa học Tự nhiên', hint: 'Hành tinh xanh nuôi dưỡng sự sống của nhân loại' },
  { keyword: 'MẶTTRỜI', topic: 'Hệ Mặt Trời', hint: 'Ngôi sao trung tâm chiếu sáng và sưởi ấm các hành tinh' },
  { keyword: 'CẦUVỒNG', topic: 'Hiện tượng Tự nhiên', hint: 'Dải 7 sắc màu rực rỡ xuất hiện trên bầu trời sau cơn mưa' },
  { keyword: 'KIMLOẠI', topic: 'Hóa học & Vật liệu', hint: 'Nhóm nguyên tố dẫn điện, dẫn nhiệt tốt như Vàng, Bạc, Sắt, Đồng' },
  { keyword: 'BÓNGĐÁ', topic: 'Thể thao Vua', hint: 'Môn thể thao hấp dẫn nhất hành tinh với trái bóng tròn' },
  { keyword: 'MÙAXUÂN', topic: 'Thiên nhiên & Lễ hội', hint: 'Mùa khởi đầu năm mới với trăm hoa đua nở và Tết đoàn viên' },
  { keyword: 'MÙATHU', topic: 'Thiên nhiên & Văn học', hint: 'Mùa của lá vàng rơi, hương cốm mới và Tết Trung Thu' },
  { keyword: 'HÒABÌNH', topic: 'Khát vọng Nhân loại', hint: 'Cuộc sống yên vui, hữu nghị có biểu tượng chim bồ câu trắng' },
];

/**
 * Sinh hàng loạt Bộ Câu Hỏi Giải Mã Ô Chữ (CrosswordQuestionSet) đảm bảo:
 * - Mỗi bộ có 1 Từ khóa bí mật và N hàng ngang (N = số chữ cái của từ khóa).
 * - Đáp án của hàng ngang thứ i chắc chắn chứa chữ cái thứ i của Từ khóa tại `answerPosition`.
 * - Các câu hỏi trong cùng 1 bộ không trùng lặp nhau.
 * - Có thể sinh từ 100 đến 200+ bộ ô chữ (500 đến 1,000+ câu hỏi hàng ngang)!
 */
export function generateBulkCrosswordQuestionSets(targetQuestionCount = 1000): CrosswordQuestionSet[] {
  const generatedSets: CrosswordQuestionSet[] = [];
  let totalRowsGenerated = 0;
  let setIndex = 0;

  // Nhóm trước các câu hỏi theo từng chữ cái không dấu (A-Z) mà đáp án có chứa
  const cluesByChar = new Map<string, ClueTemplate[]>();
  for (const clue of CROSSWORD_CLUE_BANK) {
    const uniqueChars = new Set(Array.from(clue.baseChars));
    for (const ch of uniqueChars) {
      const list = cluesByChar.get(ch) || [];
      list.push(clue);
      cluesByChar.set(ch, list);
    }
  }

  const questionStyles = [
    (q: string, _t: string) => q,
    (q: string, t: string) => `[${t}] ${q}`,
    (q: string, _t: string) => `Đố nhanh: ${q}`,
    (q: string, t: string) => `Khám phá ${t}: ${q}`,
    (q: string, _t: string) => `Thử thách tri thức: ${q}`,
  ];

  while (totalRowsGenerated < targetQuestionCount && setIndex < 300) {
    const seed = CROSSWORD_KEYWORD_SEEDS[setIndex % CROSSWORD_KEYWORD_SEEDS.length];
    const variantRound = Math.floor(setIndex / CROSSWORD_KEYWORD_SEEDS.length);
    const cleanKeyword = toCleanUpper(seed.keyword);
    const asciiKeyword = toAsciiUpper(cleanKeyword);
    const keyChars = Array.from(asciiKeyword);

    const usedAnswersInSet = new Set<string>();
    const rows: CrosswordRowConfig[] = [];
    let validSet = true;

    for (let i = 0; i < keyChars.length; i++) {
      const targetChar = keyChars[i];
      const candidates = cluesByChar.get(targetChar) || [];
      if (candidates.length === 0) {
        validSet = false;
        break;
      }

      // Xoay vòng ứng viên theo setIndex và vị trí hàng để mỗi bộ ô chữ có tổ hợp câu hỏi khác nhau
      let picked: ClueTemplate | null = null;
      const offset = (setIndex * 7 + i * 3) % candidates.length;
      for (let k = 0; k < candidates.length; k++) {
        const cand = candidates[(offset + k) % candidates.length];
        if (!usedAnswersInSet.has(cand.cleanAnswer)) {
          picked = cand;
          break;
        }
      }
      if (!picked) {
        picked = candidates[offset];
      }

      usedAnswersInSet.add(picked.cleanAnswer);

      // Tìm vị trí ký tự giao với từ khóa (1-based)
      const baseArr = Array.from(picked.baseChars);
      const posIdx = baseArr.findIndex((c) => c === targetChar);
      const answerPosition = posIdx >= 0 ? posIdx + 1 : 1;

      const styleFn = questionStyles[(variantRound + i) % questionStyles.length];
      const formattedQuestion = variantRound === 0 ? picked.question : styleFn(picked.question, picked.topic);

      rows.push({
        id: `xr-bulk-${setIndex + 1}-${i + 1}`,
        rowNumber: i + 1,
        question: formattedQuestion,
        answer: picked.answer,
        cleanAnswer: picked.cleanAnswer,
        acceptedAnswers: picked.acceptedAnswers,
        hint: picked.hint,
        answerPosition,
        keywordIndex: i + 1,
        timeLimit: 20,
        points: 100,
      });
    }

    if (validSet && rows.length === keyChars.length) {
      const suffix = variantRound > 0 ? ` #${variantRound + 1}` : '';
      generatedSets.push({
        id: `xword-bulk-${String(setIndex + 1).padStart(3, '0')}`,
        name: `${seed.topic}: Giải mã "${seed.keyword}"${suffix}`,
        topic: seed.topic,
        keyword: seed.keyword,
        cleanKeyword,
        keywordHint: `${seed.hint} (${cleanKeyword.length} chữ cái)`,
        description: `Bộ ô chữ gồm ${rows.length} câu hỏi hàng ngang ghép thành từ khóa "${seed.keyword}".`,
        status: 'PUBLISHED',
        rows,
        createdAt: new Date(Date.now() - setIndex * 60000).toISOString(),
      });
      totalRowsGenerated += rows.length;
    }

    setIndex++;
  }

  return generatedSets;
}
