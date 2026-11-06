const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.resolve(__dirname, '../../data/knowledge_battle.sqlite');
const db = new DatabaseSync(dbPath);

const questions45 = [
  // 15 Ẩm thực
  {
    cat: 'cat-life',
    q: 'Món đặc sản Cơm cháy Ninh Bình truyền thống thường được dùng kèm với loại nước xốt chế biến từ thịt gì?',
    a: 'Thịt dê núi',
    b: 'Thịt bò phi lê',
    c: 'Thịt lợn nạc',
    d: 'Thịt vịt cỏ',
    ans: 'A',
    diff: 'MEDIUM',
    exp: 'Cơm cháy Ninh Bình ngon nhất là khi ăn cùng nước xốt tim cật hoặc nước xốt thịt dê núi đậm đà.',
    tags: ['Ẩm thực', 'Ninh Bình', 'Đặc sản']
  },
  {
    cat: 'cat-life',
    q: 'Món "Bánh tét mặt trăng" với màu xanh lam và tím bắt mắt từ lá cẩm và hoa đậu biếc là đặc sản của địa phương nào?',
    a: 'Cần Thơ',
    b: 'Trà Vinh',
    c: 'Tiền Giang',
    d: 'Sóc Trăng',
    ans: 'B',
    diff: 'HARD',
    exp: 'Bánh tét Trà Vinh (nhất là bánh tét Trà Cuôn) nức tiếng với nhân thịt mỡ, trứng muối và hình dáng đẹp mắt.',
    tags: ['Ẩm thực', 'Bánh tét', 'Miền Tây']
  },
  {
    cat: 'cat-life',
    q: 'Món "Bún rạm" đậm đà vị ngọt thanh tự nhiên là món ăn đặc sản nức tiếng của tỉnh thành nào?',
    a: 'Nghệ An',
    b: 'Quảng Trị',
    c: 'Bình Định',
    d: 'Phú Yên',
    ans: 'C',
    diff: 'MEDIUM',
    exp: 'Bún rạm Phù Mỹ (Bình Định) là đặc sản trứ danh xứ Nẫu, rạm đồng được xay nhuyễn nấu nước dùng thơm ngọt.',
    tags: ['Ẩm thực', 'Bình Định', 'Món ngon']
  },
  {
    cat: 'cat-life',
    q: 'Món Lẩu mắm miền Tây Nam Bộ thường dùng loại mắm cá nào làm linh hồn cho nồi nước dùng?',
    a: 'Mắm cá linh hoặc cá sặc',
    b: 'Mắm tôm chua',
    c: 'Mắm nhum',
    d: 'Mắm tép đồng',
    ans: 'A',
    diff: 'EASY',
    exp: 'Mắm cá linh và mắm cá sặc nước ngọt là hai loại mắm đặc trưng nhất tạo nên hương vị béo thơm cho lẩu mắm.',
    tags: ['Ẩm thực', 'Miền Tây', 'Lẩu mắm']
  },
  {
    cat: 'cat-life',
    q: 'Món "Chả mực nang giã tay" nức tiếng thơm ngon, giòn sần sật là đặc sản trứ danh của thành phố nào?',
    a: 'Quy Nhơn',
    b: 'Vũng Tàu',
    c: 'Nha Trang',
    d: 'Hạ Long',
    ans: 'D',
    diff: 'EASY',
    exp: 'Chả mực Hạ Long (Quảng Ninh) giã tay truyền thống là một trong những món ăn đặc sản hàng đầu Việt Nam.',
    tags: ['Ẩm thực', 'Hạ Long', 'Quảng Ninh']
  },
  {
    cat: 'cat-life',
    q: 'Bánh bò thốt nốt thơm lừng, màu vàng ươm là món đặc sản gắn liền với địa danh nào ở tỉnh An Giang?',
    a: 'Tri Tôn và Châu Đốc',
    b: 'Long Xuyên',
    c: 'Chợ Mới',
    d: 'Thoại Sơn',
    ans: 'A',
    diff: 'MEDIUM',
    exp: 'Tri Tôn và Châu Đốc thuộc vùng Thất Sơn An Giang là thủ phủ của cây thốt nốt và các món bánh thốt nốt.',
    tags: ['Ẩm thực', 'An Giang', 'Bánh bò']
  },
  {
    cat: 'cat-life',
    q: 'Món Bánh căn Nam Trung Bộ (Ninh Thuận, Khánh Hòa, Đà Lạt) được nướng chín trong khuôn làm bằng vật liệu gì?',
    a: 'Khuôn gang đúc',
    b: 'Khuôn nhôm sáng',
    c: 'Khuôn đất nung',
    d: 'Khuôn đá cuội',
    ans: 'C',
    diff: 'EASY',
    exp: 'Bánh căn nướng trong các chén đất nung nhỏ trên lò than hồng không dùng dầu mỡ, tạo độ xốp giòn đặc biệt.',
    tags: ['Ẩm thực', 'Bánh căn', 'Trung Bộ']
  },
  {
    cat: 'cat-life',
    q: 'Bánh gai Tứ Trụ với hương thơm lá gai và mật mía ngọt dịu là đặc sản truyền thống của tỉnh nào?',
    a: 'Bắc Ninh',
    b: 'Thanh Hóa',
    c: 'Hải Dương',
    d: 'Nam Định',
    ans: 'B',
    diff: 'MEDIUM',
    exp: 'Làng Tứ Trụ, xã Thọ Diên, huyện Thọ Xuân, tỉnh Thanh Hóa nổi tiếng cả nước với nghề làm bánh gai truyền thống.',
    tags: ['Ẩm thực', 'Thanh Hóa', 'Bánh gai']
  },
  {
    cat: 'cat-life',
    q: 'Món canh chua cá lóc truyền thống miền Nam thường dùng nguyên liệu gì để tạo vị chua thanh dịu nhẹ?',
    a: 'Me chín ngâm lấy nước cốt',
    b: 'Giấm gạo lên men',
    c: 'Quả sấu tươi',
    d: 'Mẻ chua',
    ans: 'A',
    diff: 'EASY',
    exp: 'Canh chua Nam Bộ không thể thiếu nước cốt me chín hòa quyện cùng bạc hà (dọc mùng), đậu bắp, thơm và giá.',
    tags: ['Ẩm thực', 'Canh chua', 'Nam Bộ']
  },
  {
    cat: 'cat-life',
    q: 'Loại trái cây nhiệt đới nào của miền Tây được mệnh danh là "Nữ hoàng của các loại trái cây"?',
    a: 'Sầu riêng',
    b: 'Măng cụt',
    c: 'Chôm chôm',
    d: 'Vú sữa',
    ans: 'B',
    diff: 'EASY',
    exp: 'Nếu sầu riêng được coi là vua các loại quả thì măng cụt với vị ngọt thanh mát được xưng tụng là nữ hoàng.',
    tags: ['Ẩm thực', 'Trái cây', 'Măng cụt']
  },
  {
    cat: 'cat-life',
    q: 'Bánh đa cua với sợi bánh đỏ dẻo và chả lá lốt thơm lừng là món ăn biểu tượng của thành phố nào?',
    a: 'Hà Nội',
    b: 'Nam Định',
    c: 'Hải Phòng',
    d: 'Hưng Yên',
    ans: 'C',
    diff: 'EASY',
    exp: 'Bánh đa cua Hải Phòng nổi tiếng với sợi bánh đa đỏ tráng thủ công và nước dùng riêu cua đồng béo ngậy.',
    tags: ['Ẩm thực', 'Hải Phòng', 'Bánh đa cua']
  },
  {
    cat: 'cat-life',
    q: 'Vịt quay Thất Khê với hương vị lá móc mật đặc trưng là đặc sản của tỉnh nào?',
    a: 'Cao Bằng',
    b: 'Hà Giang',
    c: 'Bắc Kạn',
    d: 'Lạng Sơn',
    ans: 'D',
    diff: 'MEDIUM',
    exp: 'Thất Khê thuộc huyện Tràng Định, tỉnh Lạng Sơn, nổi tiếng với món vịt quay nhồi lá móc mật nướng than hoa.',
    tags: ['Ẩm thực', 'Lạng Sơn', 'Đặc sản']
  },
  {
    cat: 'cat-life',
    q: 'Rượu cần - thức uống lên men men lá cây tự nhiên trong chum sành là nét văn hóa đặc sắc của đồng bào vùng nào?',
    a: 'Vùng cao Tây Nguyên và miền núi Tây Bắc',
    b: 'Đồng bằng sông Cửu Long',
    c: 'Duyên hải Nam Trung Bộ',
    d: 'Đồng bằng sông Hồng',
    ans: 'A',
    diff: 'EASY',
    exp: 'Rượu cần là nét văn hóa hiếu khách của các dân tộc Ê Đê, Ba Na, Mường, Thái trong các dịp lễ hội lớn.',
    tags: ['Ẩm thực', 'Rượu cần', 'Văn hóa']
  },
  {
    cat: 'cat-life',
    q: 'Chè bà ba - món chè béo ngậy nước cốt dừa, thơm bùi khoai lang và bột báng có nguồn gốc từ vùng nào?',
    a: 'Bắc Bộ',
    b: 'Nam Bộ',
    c: 'Trung Bộ',
    d: 'Tây Bắc',
    ans: 'B',
    diff: 'EASY',
    exp: 'Chè bà ba là món chè dân dã trứ danh của vùng đất Nam Bộ, kết hợp khoai mì, khoai lang, đậu xanh và nước dừa.',
    tags: ['Ẩm thực', 'Nam Bộ', 'Chè']
  },
  {
    cat: 'cat-life',
    q: 'Gia vị thảo mộc thiên nhiên nào tạo nên sắc vàng rực rỡ và mùi thơm đặc trưng của món Chả cá Lã Vọng Hà Nội?',
    a: 'Nghệ tươi giã nhuyễn',
    b: 'Hạt điều màu',
    c: 'Hoa hồi rang thơm',
    d: 'Bột ớt Paprika',
    ans: 'A',
    diff: 'EASY',
    exp: 'Chả cá Lã Vọng được tẩm ướp cùng nghệ, mắm tôm, riềng và mẻ trước khi xào cùng thì là và hành hoa tươi.',
    tags: ['Ẩm thực', 'Hà Nội', 'Chả cá Lã Vọng']
  },

  // 15 Âm nhạc & Phim ảnh
  {
    cat: 'cat-sport',
    q: 'Nhạc phẩm "Tiến quân ca" - Quốc ca nước Cộng hòa Xã hội Chủ nghĩa Việt Nam được nhạc sĩ Văn Cao sáng tác vào năm nào?',
    a: '1940',
    b: '1944',
    c: '1945',
    d: '1954',
    ans: 'B',
    diff: 'MEDIUM',
    exp: 'Nhạc sĩ Văn Cao sáng tác "Tiến quân ca" vào mùa đông năm 1944 tại căn gác nhỏ số 171 phố Mai Hắc Đế, Hà Nội.',
    tags: ['Âm nhạc', 'Lịch sử', 'Văn Cao']
  },
  {
    cat: 'cat-sport',
    q: 'Bộ phim điện ảnh "Tôi thấy hoa vàng trên cỏ xanh" (2015) do ai làm đạo diễn?',
    a: 'Victor Vũ',
    b: 'Charlie Nguyễn',
    c: 'Trấn Thành',
    d: 'Nguyễn Quang Dũng',
    ans: 'A',
    diff: 'EASY',
    exp: 'Đạo diễn Victor Vũ đã chuyển thể xuất sắc truyện ngắn cùng tên của nhà văn Nguyễn Nhật Ánh lên màn ảnh rộng.',
    tags: ['Phim ảnh', 'Điện ảnh', 'Victor Vũ']
  },
  {
    cat: 'cat-sport',
    q: 'Nam ca sĩ nào được mệnh danh là một trong những giọng ca hàng đầu của dòng nhạc truyền thống cách mạng Việt Nam?',
    a: 'Đan Trường',
    b: 'Tuấn Hưng',
    c: 'Trọng Tấn',
    d: 'Quang Dũng',
    ans: 'C',
    diff: 'EASY',
    exp: 'Ca sĩ Trọng Tấn nổi tiếng với chất giọng tenor ấm áp và là gương mặt tiêu biểu của dòng nhạc đỏ.',
    tags: ['Âm nhạc', 'Nhạc đỏ', 'Trọng Tấn']
  },
  {
    cat: 'cat-sport',
    q: 'Ca khúc "Em gái mưa" với câu hát nổi tiếng "Mưa trôi cả bầu trời nắng..." do ca sĩ nào thể hiện?',
    a: 'Hương Tràm',
    b: 'Min',
    c: 'Bích Phương',
    d: 'Văn Mai Hương',
    ans: 'A',
    diff: 'EASY',
    exp: 'Bản hit quốc dân năm 2017 "Em gái mưa" do nhạc sĩ Mr. Siro sáng tác dành riêng cho giọng hát của Hương Tràm.',
    tags: ['Âm nhạc', 'Vpop', 'Hit']
  },
  {
    cat: 'cat-sport',
    q: 'Ca khúc "Nối vòng tay lớn" kêu gọi tinh thần đoàn kết dân tộc là sáng tác bất hủ của nhạc sĩ nào?',
    a: 'Phạm Tuyên',
    b: 'Hoàng Việt',
    c: 'Phan Huỳnh Điểu',
    d: 'Trịnh Công Sơn',
    ans: 'D',
    diff: 'EASY',
    exp: '"Nối vòng tay lớn" được nhạc sĩ Trịnh Công Sơn sáng tác năm 1968, trở thành bài ca đoàn kết của mọi thế hệ.',
    tags: ['Âm nhạc', 'Trịnh Công Sơn', 'Nhạc bất hủ']
  },
  {
    cat: 'cat-sport',
    q: 'Bộ phim hoạt hình dài màu đầu tiên trong lịch sử điện ảnh do hãng Walt Disney sản xuất năm 1937 là tác phẩm nào?',
    a: 'Pinocchio',
    b: 'Bạch Tuyết và bảy chú lùn',
    c: 'Lọ Lem',
    d: 'Vua sư tử',
    ans: 'B',
    diff: 'MEDIUM',
    exp: 'Snow White and the Seven Dwarfs (1937) là cột mốc lịch sử mở ra kỷ nguyên phim hoạt hình chiếu rạp của Disney.',
    tags: ['Phim ảnh', 'Disney', 'Hoạt hình']
  },
  {
    cat: 'cat-sport',
    q: 'Ca khúc "Lạc Trôi" mang âm hưởng cổ trang hiện đại ra mắt đầu năm 2017 do nghệ sĩ nào sáng tác và biểu diễn?',
    a: 'Sơn Tùng M-TP',
    b: 'Soobin Hoàng Sơn',
    c: 'Noo Phước Thịnh',
    d: 'Đức Phúc',
    ans: 'A',
    diff: 'EASY',
    exp: '"Lạc Trôi" là MV đánh dấu bước ngoặt độc lập của Sơn Tùng M-TP, nhanh chóng đạt kỷ lục lượt xem Châu Á lúc bấy giờ.',
    tags: ['Âm nhạc', 'Sơn Tùng M-TP', 'Vpop']
  },
  {
    cat: 'cat-sport',
    q: 'Thuyền trưởng Jack Sparrow trong loạt phim bom tấn "Cướp biển vùng Caribbean" do nam tài tử nào thủ vai?',
    a: 'Brad Pitt',
    b: 'Leonardo DiCaprio',
    c: 'Johnny Depp',
    d: 'Tom Cruise',
    ans: 'C',
    diff: 'EASY',
    exp: 'Johnny Depp đã ghi dấu ấn kinh điển trong lòng khán giả với nét diễn tưng tửng duyên dáng của thuyền trưởng Jack.',
    tags: ['Phim ảnh', 'Hollywood', 'Jack Sparrow']
  },
  {
    cat: 'cat-sport',
    q: 'Bộ phim điện ảnh "Mắt biếc" (2019) kể về mối tình đơn phương của chàng trai tên Ngạn được quay tại tỉnh nào?',
    a: 'Thừa Thiên Huế và Quảng Nam',
    b: 'Lâm Đồng',
    c: 'Khánh Hòa',
    d: 'Bình Thuận',
    ans: 'A',
    diff: 'MEDIUM',
    exp: 'Phim trường trường tiểu học Đo Đo và cây cô đơn nổi tiếng của phim "Mắt biếc" nằm ở làng Hà Cảng, huyện Quảng Điền, Thừa Thiên Huế.',
    tags: ['Phim ảnh', 'Mắt biếc', 'Huế']
  },
  {
    cat: 'cat-sport',
    q: 'Ban nhạc rock tiên phong của Việt Nam thành lập năm 1995 với thủ lĩnh là cố nghệ sĩ Trần Lập có tên là gì?',
    a: 'Ngũ Cung',
    b: 'Microwave',
    c: 'Bức Tường',
    d: 'Quái Vật Tí Hon',
    ans: 'C',
    diff: 'EASY',
    exp: 'Ban nhạc Bức Tường thành lập tại Trường Đại học Xây dựng Hà Nội năm 1995 với các bài hát bất hủ như Đường đến ngày vinh quang, Tâm hồn của đá.',
    tags: ['Âm nhạc', 'Rock', 'Bức Tường']
  },
  {
    cat: 'cat-sport',
    q: 'Đạo diễn huyền thoại của hai siêu phẩm điện ảnh có doanh thu cao nhất mọi thời đại "Titanic" và "Avatar" là ai?',
    a: 'Steven Spielberg',
    b: 'James Cameron',
    c: 'Christopher Nolan',
    d: 'Martin Scorsese',
    ans: 'B',
    diff: 'EASY',
    exp: 'James Cameron là đạo diễn duy nhất sở hữu ba bộ phim đạt doanh thu trên 2 tỷ USD toàn cầu.',
    tags: ['Phim ảnh', 'Đạo diễn', 'Avatar']
  },
  {
    cat: 'cat-sport',
    q: 'Ca khúc sôi động "Việt Nam ơi" thường vang lên cuồng nhiệt mỗi khi đội tuyển bóng đá VN chiến thắng do ai sáng tác?',
    a: 'Minh Beta (Bùi Quang Minh)',
    b: 'Khắc Hưng',
    c: 'Châu Đăng Khoa',
    d: 'Nguyễn Văn Chung',
    ans: 'A',
    diff: 'MEDIUM',
    exp: 'Doanh nhân kiêm nhạc sĩ Minh Beta sáng tác ca khúc "Việt Nam ơi" vào năm 2011 trước khi đi du học Mỹ.',
    tags: ['Âm nhạc', 'Bóng đá', 'Việt Nam']
  },
  {
    cat: 'cat-sport',
    q: 'Nữ ca sĩ nào của làng nhạc Việt gắn liền với danh xưng "Họa mi tóc nâu"?',
    a: 'Hồ Quỳnh Hương',
    b: 'Lệ Quyên',
    c: 'Hiền Thục',
    d: 'Mỹ Tâm',
    ans: 'D',
    diff: 'EASY',
    exp: 'Mỹ Tâm được người hâm mộ và báo giới ưu ái gọi là "Họa mi tóc nâu" từ ca khúc hit cùng tên phát hành năm 2002.',
    tags: ['Âm nhạc', 'Mỹ Tâm', 'Vpop']
  },
  {
    cat: 'cat-sport',
    q: 'Bức tượng vàng danh giá trao tặng cho các thành tựu xuất sắc trong nghệ thuật điện ảnh thế giới là giải thưởng gì?',
    a: 'Grammy',
    b: 'Oscar (Academy Awards)',
    c: 'Emmy',
    d: 'Quả Cầu Vàng',
    ans: 'B',
    diff: 'EASY',
    exp: 'Giải Oscar do Viện Hàn lâm Khoa học và Nghệ thuật Điện ảnh Hoa Kỳ trao tặng hàng năm tại Los Angeles.',
    tags: ['Phim ảnh', 'Oscar', 'Điện ảnh']
  },
  {
    cat: 'cat-sport',
    q: 'Bộ phim điện ảnh "Mai" (2024) lập kỷ lục phim có doanh thu phòng vé cao nhất lịch sử Việt Nam do ai đạo diễn?',
    a: 'Trấn Thành',
    b: 'Lý Hải',
    c: 'Ngô Thanh Vân',
    d: 'Vũ Ngọc Đãng',
    ans: 'A',
    diff: 'EASY',
    exp: 'Bộ phim "Mai" của đạo diễn Trấn Thành đạt doanh thu hơn 520 tỷ đồng, xác lập kỷ lục phòng vé Việt.',
    tags: ['Phim ảnh', 'Trấn Thành', 'Điện ảnh Việt']
  },

  // 15 Đố mẹo & Đố vui dân gian
  {
    cat: 'cat-life',
    q: 'Đố mẹo: "Con gì đầu dê mình ốc"?',
    a: 'Con ốc bươu',
    b: 'Con tắc kè',
    c: 'Con dốc',
    d: 'Con dế mèn',
    ans: 'C',
    diff: 'EASY',
    exp: '"Đầu dê" là chữ "D", "mình ốc" là "ỐC", ghép lại thành "DỐC" (con dốc leo núi).',
    tags: ['Đố mẹo', 'Chữ nghĩa', 'Dân gian']
  },
  {
    cat: 'cat-life',
    q: 'Đố mẹo: Cái gì khi ta đứng thì nó nằm, ta đi thì nó nằm, mà ta nằm thì nó đứng?',
    a: 'Bàn chân',
    b: 'Cái bóng',
    c: 'Chiếc gối',
    d: 'Đôi dép',
    ans: 'A',
    diff: 'EASY',
    exp: 'Khi đứng hoặc đi thì bàn chân nằm ngang trên mặt đất, khi ta nằm ngủ thì bàn chân chổng đứng lên trời.',
    tags: ['Đố mẹo', 'Cơ thể', 'Vui nhộn']
  },
  {
    cat: 'cat-life',
    q: 'Đố mẹo: Con gì đập thì sống, không đập thì chết?',
    a: 'Con muỗi',
    b: 'Con tim',
    c: 'Con quay',
    d: 'Con mắt',
    ans: 'B',
    diff: 'EASY',
    exp: 'Trái tim đập thì con người còn sống, khi tim ngừng đập thì tử vong.',
    tags: ['Đố mẹo', 'Cơ thể', 'Đố vui']
  },
  {
    cat: 'cat-life',
    q: 'Đố mẹo: Loại lịch nào dài nhất trên thế giới?',
    a: 'Lịch vạn niên',
    b: 'Lịch âm dương',
    c: 'Lịch thiên văn',
    d: 'Lịch sử',
    ans: 'D',
    diff: 'EASY',
    exp: 'Lịch sử ghi lại toàn bộ tiến trình phát triển hàng triệu năm của loài người và trái đất.',
    tags: ['Đố mẹo', 'Từ ngữ', 'Vui nhộn']
  },
  {
    cat: 'cat-life',
    q: 'Đố mẹo: Cái gì chặt không đứt, bứt không rời, phơi không khô, đốt không cháy?',
    a: 'Dòng nước',
    b: 'Không khí',
    c: 'Tình yêu',
    d: 'Sợi dây cao su',
    ans: 'A',
    diff: 'EASY',
    exp: 'Câu đố dân gian miêu tả đặc tính kỳ diệu của dòng nước.',
    tags: ['Đố vui', 'Dân gian', 'Hiện tượng']
  },
  {
    cat: 'cat-life',
    q: 'Đố mẹo: Bệnh gì mà tất cả các bác sĩ giỏi nhất trên đời đều phải "bó tay"?',
    a: 'Bệnh đau đầu',
    b: 'Bệnh cảm cúm',
    c: 'Bệnh gãy tay',
    d: 'Bệnh đau mắt đỏ',
    ans: 'C',
    diff: 'EASY',
    exp: 'Gãy tay thì bác sĩ phải bó bột cố định cánh tay lại, tức là "bó tay".',
    tags: ['Đố mẹo', 'Chơi chữ', 'Hài hước']
  },
  {
    cat: 'cat-life',
    q: 'Đố mẹo: Con gì có hai cái "càng to càng nhỏ"?',
    a: 'Con cua',
    b: 'Con voi',
    c: 'Con tôm hùm',
    d: 'Con bò cạp',
    ans: 'A',
    diff: 'EASY',
    exp: 'Con cua có 2 cái càng: 1 cái càng to và 1 cái càng nhỏ!',
    tags: ['Đố mẹo', 'Chơi chữ', 'Động vật']
  },
  {
    cat: 'cat-life',
    q: 'Đố mẹo: Có 10 con chim đậu trên cành cây, người thợ săn giương súng bắn chết 1 con, hỏi trên cành còn lại mấy con?',
    a: '9 con',
    b: '1 con',
    c: '5 con',
    d: '0 con',
    ans: 'D',
    diff: 'EASY',
    exp: 'Nghe tiếng súng nổ vang, 9 con chim còn lại đã giật mình bay hết sạch.',
    tags: ['Đố mẹo', 'Tư duy', 'Vui nhộn']
  },
  {
    cat: 'cat-life',
    q: 'Đố mẹo: Tháng nào trong một năm có ít ngày nhất?',
    a: 'Tháng Hai (28 hoặc 29 ngày)',
    b: 'Tháng Bảy',
    c: 'Tháng Mười',
    d: 'Tháng Chạp',
    ans: 'A',
    diff: 'EASY',
    exp: 'Tháng 2 theo dương lịch chỉ có 28 ngày (năm nhuận 29 ngày), ít hơn các tháng khác (30 hoặc 31 ngày).',
    tags: ['Đố mẹo', 'Thời gian', 'Lịch']
  },
  {
    cat: 'cat-life',
    q: 'Đố mẹo: Trong một cuộc thi chạy marathon, bạn tăng tốc vượt qua người đang chạy ở vị trí thứ hai, hỏi hiện tại bạn đang ở vị trí thứ mấy?',
    a: 'Vị trí thứ nhất',
    b: 'Vị trí thứ hai',
    c: 'Vị trí thứ ba',
    d: 'Vị trí cuối cùng',
    ans: 'B',
    diff: 'EASY',
    exp: 'Vượt qua người thứ hai thì bạn sẽ thay thế chính vị trí thứ hai của người đó, người thứ nhất vẫn đang ở phía trước bạn!',
    tags: ['Đố mẹo', 'Tư duy', 'Logic']
  },
  {
    cat: 'cat-life',
    q: 'Đố mẹo: Con đường nào dài nhất mà mỗi con người đều phải đi qua trong đời?',
    a: 'Đường quốc lộ 1A',
    b: 'Đường tơ lụa',
    c: 'Đường đời',
    d: 'Đường xích đạo',
    ans: 'C',
    diff: 'EASY',
    exp: 'Đường đời là hành trình trải dài suốt cả một kiếp người.',
    tags: ['Đố mẹo', 'Ý nghĩa', 'Triết lý']
  },
  {
    cat: 'cat-life',
    q: 'Đố mẹo: Cái gì thuộc quyền sở hữu của bạn nhưng người khác lại sử dụng nó nhiều hơn chính bạn?',
    a: 'Tên gọi của bạn',
    b: 'Điện thoại của bạn',
    c: 'Xe máy của bạn',
    d: 'Tiền trong ví của bạn',
    ans: 'A',
    diff: 'EASY',
    exp: 'Tên của bạn nhưng chủ yếu để người khác xưng hô và gọi bạn hàng ngày.',
    tags: ['Đố mẹo', 'Bản thân', 'Vui nhộn']
  },
  {
    cat: 'cat-life',
    q: 'Đố mẹo: Con chuột nào nổi tiếng trên khắp thế giới đi lại bằng hai chân?',
    a: 'Chuột Jerry',
    b: 'Chuột cống',
    c: 'Chuột Hamster',
    d: 'Chuột Mickey',
    ans: 'D',
    diff: 'EASY',
    exp: 'Chú chuột hoạt hình Mickey Mouse huyền thoại của Walt Disney luôn đứng và đi bằng hai chân.',
    tags: ['Đố mẹo', 'Hoạt hình', 'Disney']
  },
  {
    cat: 'cat-life',
    q: 'Đố mẹo tiếp theo: Con vịt nào đi bằng hai chân?',
    a: 'Vịt Donald',
    b: 'Tất cả các con vịt bình thường',
    c: 'Vịt xiêm',
    d: 'Vịt cổ xanh',
    ans: 'B',
    diff: 'EASY',
    exp: 'Đừng bị lừa bởi câu đố chuột Mickey trước đó! Tất cả loài vịt bình thường đều sinh ra đi bằng hai chân.',
    tags: ['Đố mẹo', 'Tư duy bẫy', 'Hài hước']
  },
  {
    cat: 'cat-life',
    q: 'Đố mẹo: Adam có 2, Eva chỉ có 1, nhưng hoa quả lại có tận 3. Đó là cái gì?',
    a: 'Mắt kính',
    b: 'Chữ cái A',
    c: 'Chiếc răng khôn',
    d: 'Dấu vân tay',
    ans: 'B',
    diff: 'MEDIUM',
    exp: 'Trong từ AdAm có 2 chữ A, trong EvA có 1 chữ A, trong hoA QuẢ có 2 chữ A kết hợp... (từ "HOA QUẢ" hoặc "HẠT HOA QUẢ"). Chữ A chính là lời giải!',
    tags: ['Đố mẹo', 'Chữ cái', 'Tư duy']
  }
];

console.log(`Bắt đầu nạp thêm ${questions45.length} câu hỏi mới vào CSDL...`);

const existingContents = new Set(
  db.prepare('SELECT content FROM questions').all().map(r => r.content.trim().toLowerCase())
);

let insertedCount = 0;
const insertQuestionStmt = db.prepare(`
  INSERT INTO questions (
    id, category_id, content, difficulty, question_type, language,
    explanation, topic_tags, status, created_by, approved_by, created_at, updated_at
  ) VALUES (?, ?, ?, ?, 'MULTIPLE_CHOICE', 'vi', ?, ?, 'PUBLISHED', 'usr-admin', 'usr-admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
`);

const insertOptionStmt = db.prepare(`
  INSERT INTO question_options (id, question_id, label, content, is_correct)
  VALUES (?, ?, ?, ?, ?)
`);

const insertSourceStmt = db.prepare(`
  INSERT INTO question_sources (id, question_id, source_type, source_url, license, attribution)
  VALUES (?, ?, 'WIKIPEDIA', 'https://vi.wikipedia.org/', 'CC BY-SA 4.0', 'Kho tàng Tri thức Việt Nam')
`);

db.exec('BEGIN TRANSACTION');
try {
  for (const item of questions45) {
    if (existingContents.has(item.q.trim().toLowerCase())) {
      continue;
    }
    const qId = `q-${uuidv4().slice(0, 8)}`;
    insertQuestionStmt.run(
      qId,
      item.cat,
      item.q.trim(),
      item.diff,
      item.exp,
      JSON.stringify(item.tags)
    );

    const options = { A: item.a, B: item.b, C: item.c, D: item.d };
    for (const label of ['A', 'B', 'C', 'D']) {
      insertOptionStmt.run(
        `opt-${uuidv4().slice(0, 8)}`,
        qId,
        label,
        options[label],
        item.ans === label ? 1 : 0
      );
    }

    insertSourceStmt.run(
      `src-${uuidv4().slice(0, 8)}`,
      qId
    );

    existingContents.add(item.q.trim().toLowerCase());
    insertedCount++;
  }
  db.exec('COMMIT');
  console.log(`ĐÃ NẠP THÀNH CÔNG ${insertedCount} CÂU HỎI MỚI VÀO DATABASE!`);
  const total = db.prepare("SELECT count(*) as count FROM questions WHERE status = 'PUBLISHED'").get();
  console.log(`TỔNG SỐ CÂU HỎI PUBLISHED HIỆN TẠI: ${total.count} câu.`);
} catch (err) {
  try { db.exec('ROLLBACK'); } catch (_) {}
  console.error('Lỗi khi nạp câu hỏi:', err);
}

