// Script nạp 200 câu hỏi chất lượng cao: Ẩm thực (50), Âm nhạc (50), Phim ảnh (50), Đố mẹo dân gian (50)
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.resolve(__dirname, '../../data/knowledge_battle.sqlite');
const db = new DatabaseSync(dbPath);

const questions200 = [
  // ================= 1. ẨM THỰC (50 CÂU - cat-life) =================
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Món "Phở bò" truyền thống nổi tiếng của Việt Nam thường dùng loại bánh gì làm nguyên liệu chính?',
    a: 'Bánh phở tráng từ bột gạo', b: 'Bánh mì nướng', c: 'Sợi mì trứng vàng', d: 'Bánh tráng phơi sương',
    ans: 'A', exp: 'Bánh phở truyền thống được tráng mỏng từ bột gạo tẻ xay nước rồi thái sợi vừa ăn.',
    tags: ['Ẩm thực', 'Phở']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Món "Bún bò Huế" trứ danh của Cố đô Huế thường có hương vị đặc trưng không thể thiếu từ loại gia vị nào?',
    a: 'Mắm ruốc Huế và sả ớt', b: 'Nước tương đen', c: 'Cà ri Ấn Độ', d: 'Dầu hào Hồng Kông',
    ans: 'A', exp: 'Mắm ruốc Huế hòa cùng sả phi thơm tạo nên nước dùng thơm nồng, đậm đà đặc trưng của bún bò xứ Huế.',
    tags: ['Ẩm thực', 'Huế']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Món ăn đường phố Việt Nam từng nhiều lần lọt top các món bánh mì ngon nhất thế giới là gì?',
    a: 'Bánh mì kẹp thịt Việt Nam', b: 'Bánh bao hấp', c: 'Bánh pizza', d: 'Bánh hamburger',
    ans: 'A', exp: 'Bánh mì Việt Nam với lớp vỏ giòn rụm kẹp pate, thịt, rau dưa chua và nước sốt được bạn bè quốc tế vinh danh.',
    tags: ['Ẩm thực', 'Bánh mì']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Món "Cơm tấm" — đặc sản đường phố nức tiếng của Sài Gòn — thường được nấu từ phần nào của hạt gạo?',
    a: 'Hạt gạo tấm (gạo vỡ vụn)', b: 'Hạt nếp nương', c: 'Hạt gạo lứt đỏ', d: 'Hạt kê',
    ans: 'A', exp: 'Cơm tấm được nấu từ những đầu hạt gạo bị vỡ trong quá trình xay xát, khi nấu lên tơi xốp, thơm dẻo đặc biệt.',
    tags: ['Ẩm thực', 'Sài Gòn']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Món mì sợi dẹt ăn kèm thịt xá xíu, tôm và bánh tráng nướng là đặc sản của tỉnh thành miền Trung nào?',
    a: 'Mì Quảng — Quảng Nam', b: 'Bún cá — Nha Trang', c: 'Cơm hến — Huế', d: 'Chả cá — Hải Phòng',
    ans: 'A', exp: 'Mì Quảng là món ăn tiêu biểu của xứ Quảng Nam và Đà Nẵng, ăn kèm rau sống và bánh tráng mè nướng giòn.',
    tags: ['Ẩm thực', 'Quảng Nam']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Cao lầu — món mì đặc biệt có sợi mì ngâm tro củi cù lao Chàm — là đặc sản độc quyền của phố cổ nào?',
    a: 'Phố cổ Hội An', b: 'Phố cổ Hà Nội', c: 'Cố đô Hoa Lư', d: 'Phố cổ Đồng Văn',
    ans: 'A', exp: 'Cao lầu là đặc sản nổi tiếng của Hội An, nước ngâm sợi mì lấy từ tro cây củi Cù Lao Chàm và giếng nước Bá Lễ.',
    tags: ['Ẩm thực', 'Hội An']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Bún chả Hà Nội thường gồm chả miếng và chả viên nướng than hoa, ăn kèm với nước chấm có quả gì chua thanh?',
    a: 'Đu đủ xanh và cà rốt ngâm chua', b: 'Xoài chua ngâm mắm', c: 'Khế ngọt thái lát', d: 'Cóc non muối ớt',
    ans: 'A', exp: 'Bát nước chấm bún chả ấm nóng luôn có vài miếng đu đủ xanh và cà rốt giòn ngọt chua thanh.',
    tags: ['Ẩm thực', 'Hà Nội']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Chả cá Lã Vọng — món ngon trứ danh đất kinh kỳ Thăng Long — làm từ loại cá nào ngon nhất?',
    a: 'Cá lăng', b: 'Cá trắm cỏ', c: 'Cá mè hoa', d: 'Cá rô phi',
    ans: 'A', exp: 'Chả cá Lã Vọng thơm ngon nhất khi chế biến từ cá lăng sông thịt ngọt, dai và ít xương dăm.',
    tags: ['Ẩm thực', 'Hà Nội']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Bánh xèo miền Tây Nam Bộ thường có đặc điểm gì nổi bật so với bánh xèo miền Trung?',
    a: 'Kích thước rất to, vỏ mỏng giòn và nhiều rau rừng', b: 'Kích thước bé bằng lòng bàn tay', c: 'Nướng trên than đá', d: 'Vỏ dày như bánh bao',
    ans: 'A', exp: 'Bánh xèo miền Tây được tráng trên chảo lớn, vỏ mỏng vàng ươm rìa giòn tan, ăn kèm hơn 20 loại rau rừng sông nước.',
    tags: ['Ẩm thực', 'Miền Tây']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Bánh khọt — món bánh nhỏ nướng trong khuôn đất tròn có tôm tươi rắc bột tôm cháy — là đặc sản của địa phương nào?',
    a: 'Bà Rịa - Vũng Tàu', b: 'Bình Thuận', c: 'Lâm Đồng', d: 'Cần Thơ',
    ans: 'A', exp: 'Bánh khọt Vũng Tàu giòn rụm bên dưới, mềm béo bên trên ăn kèm đu đủ bào sợi và rau sống tươi mát.',
    tags: ['Ẩm thực', 'Vũng Tàu']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Món "Gỏi cuốn" thanh mát của Việt Nam thường được chấm với loại nước chấm đậm đà nào?',
    a: 'Tương đen đậu phộng hoặc mắm nêm', b: 'Sốt mayonnaise', c: 'Sốt mù tạt wasabi', d: 'Dầu giấm Ý',
    ans: 'A', exp: 'Gỏi cuốn tôm thịt chấm tương đen ngọt bùi rắc đậu phộng rang hoặc mắm nêm thơm nức.',
    tags: ['Ẩm thực', 'Gỏi cuốn']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Bún đậu mắm tôm chuẩn vị miền Bắc thường được vắt thêm quả gì để mắm tôm sủi bọt thơm lừng?',
    a: 'Quả quất (quả tắc)', b: 'Quả giấm', c: 'Quả me chua', d: 'Quả cóc',
    ans: 'A', exp: 'Quất tươi vắt vào bát mắm tôm đánh đều cùng chút đường và ớt tươi sẽ sủi bọt bông xốp và dậy mùi thơm.',
    tags: ['Ẩm thực', 'Bún đậu']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Nem nướng Ninh Hòa cuộn bánh tráng và rau sống chấm nước sốt tương thịt béo bùi là đặc sản của tỉnh nào?',
    a: 'Khánh Hòa', b: 'Bình Định', c: 'Phú Yên', d: 'Quảng Trị',
    ans: 'A', exp: 'Nem nướng Ninh Hòa là món ăn trứ danh của tỉnh Khánh Hòa (Nha Trang), thu hút đông đảo du khách.',
    tags: ['Ẩm thực', 'Nha Trang']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Bánh cuốn Thanh Trì cổ truyền tại Hà Nội có đặc điểm gì đặc sắc?',
    a: 'Tráng mỏng như cánh ve, rắc hành phi thơm nức', b: 'Chiên ngập trong mỡ sôi', c: 'Nướng giòn trên vỉ than', d: 'Hấp trong ống tre',
    ans: 'A', exp: 'Bánh cuốn Thanh Trì tráng mỏng mềm mượt, thoa chút mỡ hành phi ăn kèm chả quế thơm ngọt.',
    tags: ['Ẩm thực', 'Hà Nội']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Lẩu mắm miền Tây thường sử dụng loại mắm cá nào để nấu nước cốt thơm nồng đặc trưng?',
    a: 'Mắm cá sặc hoặc mắm cá linh', b: 'Mắm ruốc Huế', c: 'Mắm tôm Bắc', d: 'Mắm cá thu một nắng',
    ans: 'A', exp: 'Mắm cá linh và cá sặc Châu Đốc (An Giang) là hai loại mắm cốt lõi làm nên nồi lẩu mắm đậm đà.',
    tags: ['Ẩm thực', 'Miền Tây']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Canh chua cá lóc Nam Bộ thường sử dụng loại quả hoặc lá nào để tạo vị chua dịu nhẹ?',
    a: 'Trái me chua hoặc lá giang', b: 'Giấm gạo công nghiệp', c: 'Quả chanh muối', d: 'Hạt tiêu xanh',
    ans: 'A', exp: 'Nước me dầm chua thanh ngọt hòa quyện thơm khóm, bạc hà, đậu bắp tạo nên bát canh chua Nam Bộ tuyệt hảo.',
    tags: ['Ẩm thực', 'Nam Bộ']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Món ăn không thể thiếu trên mâm cơm ngày Tết cổ truyền của người miền Nam là gì?',
    a: 'Thịt kho hột vịt nước dừa', b: 'Bún chả que tre', c: 'Chả rươi nướng', d: 'Lẩu gà lá é',
    ans: 'A', exp: 'Thịt kho tàu (thịt kho hột vịt nước dừa) ăn cùng dưa giá chua là hương vị Tết đặc trưng của người Nam Bộ.',
    tags: ['Ẩm thực', 'Tết Nam Bộ']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Bánh bèo, bánh bột lọc, bánh nậm là bộ ba món bánh gói lá chuối nổi tiếng của vùng đất nào?',
    a: 'Cố đô Huế', b: 'Hà Giang', c: 'Cà Mau', d: 'Bắc Ninh',
    ans: 'A', exp: 'Các món bánh cung đình và dân gian xứ Huế nổi tiếng với độ tinh tế, khéo léo và hương vị đậm đà.',
    tags: ['Ẩm thực', 'Huế']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Bánh tét hình trụ dài gói lá chuối là món bánh truyền thống ngày Tết của miền nào ở Việt Nam?',
    a: 'Miền Trung và miền Nam', b: 'Miền Bắc', c: 'Vùng Tây Bắc', d: 'Đồng bằng sông Hồng',
    ans: 'A', exp: 'Nếu miền Bắc gói bánh chưng vuông thì người miền Trung và miền Nam gói bánh tét đòn tròn tượng trưng cho sự ấm no.',
    tags: ['Ẩm thực', 'Bánh tét']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Thức uống độc đáo sáng tạo từ lòng đỏ trứng gà đánh bông mịn cùng cà phê đen nóng ở Hà Nội là gì?',
    a: 'Cà phê trứng', b: 'Cà phê muối', c: 'Cà phê dừa', d: 'Cà phê bơ',
    ans: 'A', exp: 'Cà phê trứng do cụ Giảng sáng tạo tại Hà Nội thập niên 1940 đã trở thành biểu tượng ẩm thực thủ đô.',
    tags: ['Ẩm thực', 'Hà Nội']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Thức uống bình dân nhưng nổi tiếng toàn cầu của người Sài Gòn uống vào mỗi buổi sáng là gì?',
    a: 'Cà phê sữa đá', b: 'Trà ô long sữa', c: 'Nước mía sầu riêng', d: 'Trà chanh giã tay',
    ans: 'A', exp: 'Cà phê sữa đá pha phin truyền thống của Sài Gòn được các chuyên trang quốc tế bầu chọn top đồ uống ngon nhất.',
    tags: ['Ẩm thực', 'Cà phê']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Món ăn vặt đường phố nổi tiếng được mệnh danh là "Pizza Việt Nam" tại Đà Lạt là món gì?',
    a: 'Bánh tráng nướng', b: 'Khoai lang kén', c: 'Bánh tiêu', d: 'Chuối chiên phồng',
    ans: 'A', exp: 'Bánh tráng nướng trên than hoa với trứng cút, hành hoa, xúc xích và ruốc tôm được ví như pizza của xứ ngàn hoa.',
    tags: ['Ẩm thực', 'Đà Lạt']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Bún cá Châu Đốc nổi tiếng với nước dùng vàng óng ánh thơm phức được tạo màu từ loại củ gia vị nào?',
    a: 'Củ nghệ tươi giã nhuyễn', b: 'Củ dền đỏ', c: 'Hạt điều màu', d: 'Ớt bột Hàn Quốc',
    ans: 'A', exp: 'Nghệ tươi xào thơm cùng cá lóc luộc gỡ xương tạo nên màu vàng tươi và hương thơm thanh tao của bún cá Châu Đốc.',
    tags: ['Ẩm thực', 'An Giang']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Hủ tiếu Nam Vang trứ danh có nguồn gốc giao thoa ẩm thực giữa cộng đồng người Việt, người Hoa và quốc gia nào?',
    a: 'Campuchia (Phnôm Pênh)', b: 'Thái Lan', c: 'Lào', d: 'Myanmar',
    ans: 'A', exp: 'Nam Vang là tên Hán Việt của Phnôm Pênh (Campuchia), món hủ tiếu này được du nhập và biến tấu hợp khẩu vị Việt.',
    tags: ['Ẩm thực', 'Hủ tiếu']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Bánh pía Sóc Trăng có lớp vỏ ngàn lớp xốp mềm và phần nhân thơm nức mùi loại trái cây nhiệt đới nào?',
    a: 'Sầu riêng', b: 'Quả mít tố nữ', c: 'Thanh long', d: 'Mãng cầu xiêm',
    ans: 'A', exp: 'Bánh pía Sóc Trăng nổi tiếng với nhân đậu xanh, mỡ phần, trứng muối và hương sầu riêng thơm béo ngậy.',
    tags: ['Ẩm thực', 'Sóc Trăng']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Bún riêu cua đồng truyền thống của miền Bắc có vị chua thanh dịu mát nhờ vào loại gia vị lên men nào?',
    a: 'Giấm bỗng rượu nếp', b: 'Nước cốt chanh công nghiệp', c: 'Giấm táo Mỹ', d: 'Me chín ngâm đường',
    ans: 'A', exp: 'Giấm bỗng rượu nếp nấu cùng cà chua và gạch cua đồng tạo nên vị chua thanh tao, thơm dịu của bún riêu cua.',
    tags: ['Ẩm thực', 'Bún riêu']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Món "Kimchi" cải thảo lên men cay nồng là quốc bảo ẩm thực của quốc gia nào?',
    a: 'Hàn Quốc', b: 'Nhật Bản', c: 'Trung Quốc', d: 'Thái Lan',
    ans: 'A', exp: 'Kimchi là món ăn lên men truyền thống tiêu biểu nhất của nền ẩm thực Hàn Quốc.',
    tags: ['Ẩm thực thế giới', 'Hàn Quốc']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Món "Sushi" và "Sashimi" hải sản tươi sống tinh tế là biểu tượng ẩm thực của quốc gia nào?',
    a: 'Nhật Bản', b: 'Hàn Quốc', c: 'Singapore', d: 'Thái Lan',
    ans: 'A', exp: 'Sushi và Sashimi là đỉnh cao nghệ thuật ẩm thực của xứ sở hoa anh đào Nhật Bản.',
    tags: ['Ẩm thực thế giới', 'Nhật Bản']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Món "Pizza" đế bột nướng lò củi phủ sốt cà chua và phô mai Mozzarella có nguồn gốc từ quốc gia nào?',
    a: 'Ý (Italia)', b: 'Pháp', c: 'Tây Ban Nha', d: 'Hy Lạp',
    ans: 'A', exp: 'Pizza có cội nguồn từ thành phố Napoli nước Ý và đã trở thành món ăn toàn cầu.',
    tags: ['Ẩm thực thế giới', 'Ý']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Súp Tom Yum có vị chua cay nồng nàn từ sả, ớt, riềng và tôm là đặc sản nổi tiếng của nước nào?',
    a: 'Thái Lan', b: 'Lào', c: 'Malaysia', d: 'Indonesia',
    ans: 'A', exp: 'Tom Yum Kung (súp tôm chua cay) là món ăn biểu tượng của ẩm thực Thái Lan.',
    tags: ['Ẩm thực thế giới', 'Thái Lan']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Món bánh kẹp vỏ giòn Tacos và bánh cuộn Burrito là đặc sản ẩm thực truyền thống của quốc gia nào?',
    a: 'Mexico', b: 'Brazil', c: 'Argentina', d: 'Cuba',
    ans: 'A', exp: 'Tacos làm từ vỏ bánh bột ngô kẹp thịt và nước sốt salsa là linh hồn ẩm thực Mexico.',
    tags: ['Ẩm thực thế giới', 'Mexico']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Loại bánh sừng bò (Croissant) nhiều lớp bơ thơm ngậy nướng vàng giòn gắn liền với nước nào?',
    a: 'Pháp', b: 'Đức', c: 'Anh', d: 'Nga',
    ans: 'A', exp: 'Bánh sừng bò Croissant là món điểm tâm sáng kinh điển gắn liền với văn hóa Pháp.',
    tags: ['Ẩm thực thế giới', 'Pháp']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Xôi xéo Hà Nội có màu vàng ươm óng ả bắt mắt nhờ được ngâm nấu cùng với loại củ tự nhiên nào?',
    a: 'Củ nghệ', b: 'Hạt dành dành', c: 'Gấc đỏ', d: 'Lá dứa',
    ans: 'A', exp: 'Gạo nếp cái hoa vàng ngâm nước nghệ tươi tạo màu vàng óng, ăn cùng đậu xanh nắm thái lát và hành phi.',
    tags: ['Ẩm thực', 'Hà Nội']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Chả mực giã tay thủ công dai giòn sần sật là đặc sản biển nức tiếng của thành phố nào?',
    a: 'Hạ Long (Quảng Ninh)', b: 'Sầm Sơn (Thanh Hóa)', c: 'Đồng Hới (Quảng Bình)', d: 'Phan Thiết (Bình Thuận)',
    ans: 'A', exp: 'Chả mực Hạ Long làm từ mực mai tươi sống giã tay truyền thống có độ giòn dai tự nhiên.',
    tags: ['Ẩm thực', 'Hạ Long']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Cơm lam nướng trong ống nứa ăn cùng gà nướng muối ớt là đặc sản của vùng miền nào nước ta?',
    a: 'Tây Nguyên và miền núi Tây Bắc', b: 'Đồng bằng sông Cửu Long', c: 'Duyên hải Nam Trung Bộ', d: 'Vùng đất Đông Nam Bộ',
    ans: 'A', exp: 'Cơm lam nếp nương nướng lửa than trong ống tre nứa là món ăn mang đậm hương vị núi rừng đại ngàn.',
    tags: ['Ẩm thực', 'Tây Nguyên']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Món Bê thui Cầu Mống da giòn thịt hồng ngọt chấm mắm nêm là đặc sản nổi tiếng của tỉnh nào?',
    a: 'Quảng Nam', b: 'Thanh Hóa', c: 'Phú Thọ', d: 'Hà Tĩnh',
    ans: 'A', exp: 'Bê thui Cầu Mống tại thị xã Điện Bàn (Quảng Nam) nức tiếng gần xa nhờ thịt bê non ngọt mềm cuốn bánh tráng.',
    tags: ['Ẩm thực', 'Quảng Nam']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Dừa sáp có phần cơm dừa dày mềm, nước dừa sền sệt béo ngậy là đặc sản quý hiếm của huyện Cầu Kè tỉnh nào?',
    a: 'Trà Vinh', b: 'Bến Tre', c: 'Vĩnh Long', d: 'Tiền Giang',
    ans: 'A', exp: 'Dừa sáp huyện Cầu Kè (Trà Vinh) là loại quả đặc sản độc nhất vô nhị ở đồng bằng sông Cửu Long.',
    tags: ['Ẩm thực', 'Trà Vinh']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Nước mắm truyền thống Phú Quốc (Kiên Giang) được ủ chượp từ loại cá cơm nào ngon nhất?',
    a: 'Cá cơm than', b: 'Cá trích lầm', c: 'Cá nục hoa', d: 'Cá bơn biển',
    ans: 'A', exp: 'Cá cơm than đánh bắt quanh đảo Phú Quốc ủ trong thùng gỗ bời lời tạo nên nước mắm màu cánh gián đậm đà.',
    tags: ['Ẩm thực', 'Phú Quốc']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Mắm tôm chua Huế thường được ăn kèm với thịt ba chỉ luộc và loại rau củ nào để tròn vị?',
    a: 'Khế chua, chuối chát và dưa giá', b: 'Xoài ngọt và đu đủ', c: 'Khoai tây chiên', d: 'Bí đỏ hấp',
    ans: 'A', exp: 'Mắm tôm chua đỏ au chấm thịt ba chỉ cuốn bánh tráng kèm khế chua, chuối chát là món nhậu nức tiếng đất thần kinh.',
    tags: ['Ẩm thực', 'Huế']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Bánh cốm Làng Vòng bọc nhân đậu xanh thơm ngọt ngào thường xuất hiện trong nghi lễ nào của người Việt?',
    a: 'Lễ ăn hỏi và đám cưới', b: 'Tết Đoan Ngọ', c: 'Lễ hội Đền Hùng', d: 'Lễ mừng thọ',
    ans: 'A', exp: 'Bánh cốm tượng trưng cho sự gắn kết ngọt ngào, là lễ vật truyền thống trên mâm tráp ăn hỏi miền Bắc.',
    tags: ['Ẩm thực', 'Hà Nội']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Gà đồi Yên Thế — giống gà thả đồi thịt săn chắc, thơm ngọt — là đặc sản của tỉnh nào?',
    a: 'Bắc Giang', b: 'Thái Nguyên', c: 'Phú Thọ', d: 'Lạng Sơn',
    ans: 'A', exp: 'Gà đồi Yên Thế của tỉnh Bắc Giang là thương hiệu gia cầm nổi tiếng toàn quốc.',
    tags: ['Ẩm thực', 'Bắc Giang']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Kẹo cu đơ giòn tan thơm lừng mùi lạc rang, mật mía và gừng tươi là đặc sản truyền thống của tỉnh nào?',
    a: 'Hà Tĩnh', b: 'Quảng Trị', c: 'Thừa Thiên Huế', d: 'Bình Thuận',
    ans: 'A', exp: 'Kẹo cu đơ Hà Tĩnh kẹp bánh tráng nướng giòn là món quà quê thơm nức đậm đà xứ Nghệ Tĩnh.',
    tags: ['Ẩm thực', 'Hà Tĩnh']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Mè xửng dẻo dai ngọt thanh phủ mè rang vàng óng là món kẹo đặc trưng của địa phương nào?',
    a: 'Thừa Thiên Huế', b: 'Đà Nẵng', c: 'Quảng Ngãi', d: 'Bình Định',
    ans: 'A', exp: 'Kẹo mè xửng ngọt thanh ăn kèm chén trà sen nóng là nét ẩm thực tao nhã của người dân xứ Huế.',
    tags: ['Ẩm thực', 'Huế']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Cơm cháy ruốc thơm giòn ăn kèm nước sốt thịt dê đậm đà là đặc sản trứ danh của vùng đất nào?',
    a: 'Ninh Bình', b: 'Thanh Hóa', c: 'Nam Định', d: 'Hà Nam',
    ans: 'A', exp: 'Cơm cháy Ninh Bình chấm nước sốt dê núi thơm lừng là món ngon không thể bỏ lỡ khi ghé thăm Tràng An.',
    tags: ['Ẩm thực', 'Ninh Bình']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Nem chua Thanh Hóa được lên men tự nhiên bằng lá gì gói bên trong cùng với tỏi và ớt tươi?',
    a: 'Lá đinh lăng hoặc lá ổi non', b: 'Lá lốt', c: 'Lá tía tô', d: 'Lá sen',
    ans: 'A', exp: 'Lá đinh lăng hoặc lá ổi non giúp nem chua Thanh Hóa lên men thơm giòn, tạo vị cay chua chát hài hòa.',
    tags: ['Ẩm thực', 'Thanh Hóa']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Món "Dimsum" (điểm sấm) gồm các loại há cảo, xíu mại nhỏ xinh hấp trong xửng tre là tinh hoa của vùng nào?',
    a: 'Quảng Đông (Trung Quốc)', b: 'Tứ Xuyên (Trung Quốc)', c: 'Bắc Kinh (Trung Quốc)', d: 'Phúc Kiến (Trung Quốc)',
    ans: 'A', exp: 'Dimsum là nét văn hóa ẩm thực Yum Cha (uống trà ăn bánh) trứ danh của người dân Quảng Đông và Hồng Kông.',
    tags: ['Ẩm thực thế giới', 'Dimsum']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Bánh canelé, bánh macaron và pho mát brie là những món ăn biểu tượng của nền ẩm thực nước nào?',
    a: 'Pháp', b: 'Đức', c: 'Hà Lan', d: 'Bỉ',
    ans: 'A', exp: 'Nước Pháp nổi tiếng toàn cầu với nghệ thuật làm bánh ngọt và sản xuất các loại pho mát hảo hạng.',
    tags: ['Ẩm thực thế giới', 'Pháp']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Trà sữa trân châu — thức uống yêu thích của giới trẻ toàn cầu — có nguồn gốc xuất xứ từ đâu?',
    a: 'Đài Loan', b: 'Hàn Quốc', c: 'Nhật Bản', d: 'Singapore',
    ans: 'A', exp: 'Trà sữa trân châu được sáng tạo tại Đài Loan vào thập niên 1980 và nhanh chóng lan tỏa khắp thế giới.',
    tags: ['Ẩm thực thế giới', 'Trà sữa']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Thịt trâu gác bếp hun khói mắc khén, hạt dỗi thơm lừng là đặc sản của đồng bào dân tộc vùng nào?',
    a: 'Tây Bắc', b: 'Tây Nam Bộ', c: 'Đồng bằng duyên hải', d: 'Cù lao Chàm',
    ans: 'A', exp: 'Thịt trâu gác bếp của người Thái vùng Tây Bắc tẩm ướp hạt dổi, mắc khén hun khói củi rừng thơm đậm đà.',
    tags: ['Ẩm thực', 'Tây Bắc']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Vải thiều Thanh Hà nổi tiếng vỏ mỏng cùi dày hột nhỏ ngọt sắc là đặc sản của tỉnh thành nào?',
    a: 'Hải Dương', b: 'Hưng Yên', c: 'Hà Nam', d: 'Thái Bình',
    ans: 'A', exp: 'Huyện Thanh Hà (tỉnh Hải Dương) là cái nôi của cây vải thiều tổ trứ danh đất Việt.',
    tags: ['Ẩm thực', 'Hải Dương']
  },

  // ================= 2. ÂM NHẠC (50 CÂU - cat-sport) =================
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Ca khúc "Tiến quân ca" được chọn làm Quốc ca của nước ta do nhạc sĩ tài hoa nào sáng tác?',
    a: 'Nhạc sĩ Văn Cao', b: 'Nhạc sĩ Lưu Hữu Phước', c: 'Nhạc sĩ Trịnh Công Sơn', d: 'Nhạc sĩ Đỗ Nhuận',
    ans: 'A', exp: 'Nhạc sĩ Văn Cao sáng tác "Tiến quân ca" vào cuối năm 1944, được Quốc hội khóa I chọn làm Quốc ca.',
    tags: ['Âm nhạc', 'Quốc ca']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Nhạc sĩ nào được mệnh danh là người viết tình ca bất hủ với những nhạc phẩm: "Diễm xưa", "Biển nhớ", "Hạ trắng"?',
    a: 'Trịnh Công Sơn', b: 'Phạm Duy', c: 'Lam Phương', d: 'Vũ Thành An',
    ans: 'A', exp: 'Nhạc sĩ Trịnh Công Sơn là một trong những tượng đài lớn nhất của nền tân nhạc Việt Nam thế kỷ 20.',
    tags: ['Âm nhạc', 'Trịnh Công Sơn']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Ca khúc hào hùng "Như có Bác trong ngày đại thắng" được nhạc sĩ nào sáng tác trong đêm 30/4/1975 lịch sử?',
    a: 'Nhạc sĩ Phạm Tuyên', b: 'Nhạc sĩ Hoàng Vân', c: 'Nhạc sĩ Huy Du', d: 'Nhạc sĩ Trần Hoàn',
    ans: 'A', exp: 'Nhạc sĩ Phạm Tuyên viết trọn vẹn bài hát chỉ trong 2 tiếng đồng hồ đêm 28 rạng sáng 30/4/1975.',
    tags: ['Âm nhạc', 'Phạm Tuyên']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Nhạc cụ truyền thống độc đáo của Việt Nam chỉ có duy nhất MỘT dây nhưng phát ra âm thanh luyến láy huyền ảo là gì?',
    a: 'Đàn Bầu (Độc huyền cầm)', b: 'Đàn Nhị', c: 'Đàn Đáy', d: 'Đàn Nguyệt',
    ans: 'A', exp: 'Đàn Bầu dùng cần nắn cao độ của âm bội tạo nên những âm thanh thiết tha đậm hồn dân tộc Việt.',
    tags: ['Âm nhạc', 'Nhạc cụ dân tộc']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Đàn Tranh truyền thống của Việt Nam theo chuẩn cổ điển có tổng cộng bao nhiêu dây đàn?',
    a: '16 dây (Thập lục huyền)', b: '6 dây', c: '4 dây', d: '36 dây',
    ans: 'A', exp: 'Đàn Tranh cổ điển có 16 dây kim loại gác qua các con nhạn hình chữ V ngược, âm sắc trong trẻo thánh thót.',
    tags: ['Âm nhạc', 'Đàn Tranh']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Không gian văn hóa Cồng chiêng Tây Nguyên của Việt Nam được UNESCO công nhận là gì?',
    a: 'Kiệt tác Di sản văn hóa phi vật thể của nhân loại', b: 'Kỳ quan thiên nhiên mới', c: 'Di sản tư liệu thế giới', d: 'Khu dự trữ sinh quyển',
    ans: 'A', exp: 'Năm 2005, Cồng chiêng Tây Nguyên được UNESCO công nhận là Kiệt tác truyền khẩu và Di sản phi vật thể nhân loại.',
    tags: ['Âm nhạc', 'Cồng chiêng']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Nghệ thuật đờn ca tài tử Nam Bộ gắn liền với nhạc phẩm kinh điển nào của nhạc sĩ Cao Văn Lầu?',
    a: 'Dạ cổ hoài lang', b: 'Lý ngựa ô', c: 'Lý chim quyên', d: 'Vọng kim lang',
    ans: 'A', exp: 'Bản "Dạ cổ hoài lang" ra đời năm 1919 tại Bạc Liêu là tiền đề phát triển bài ca vọng cổ và nghệ thuật cải lương.',
    tags: ['Âm nhạc', 'Đờn ca tài tử']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Dân ca Quan họ là loại hình nghệ thuật dân gian độc đáo của vùng đất kinh bắc thuộc hai tỉnh nào?',
    a: 'Bắc Ninh và Bắc Giang', b: 'Hà Nội và Hà Nam', c: 'Hưng Yên và Hải Dương', d: 'Thái Bình và Nam Định',
    ans: 'A', exp: 'Dân ca Quan họ Bắc Ninh với các làn điệu đối đáp mượt mà đã được UNESCO ghi danh năm 2009.',
    tags: ['Âm nhạc', 'Quan họ']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Nhã nhạc cung đình triều Nguyễn từng biểu diễn trong các dịp đại lễ tế trời đất được UNESCO vinh danh tại tỉnh nào?',
    a: 'Thừa Thiên Huế', b: 'Ninh Bình', c: 'Quảng Nam', d: 'Hà Nội',
    ans: 'A', exp: 'Nhã nhạc cung đình Huế là di sản văn hóa phi vật thể đầu tiên của Việt Nam được UNESCO công nhận (năm 2003).',
    tags: ['Âm nhạc', 'Huế']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Nghệ sĩ dương cầm (Pianist) người Việt Nam đầu tiên đoạt giải Nhất cuộc thi Piano Quốc tế Chopin năm 1980 là ai?',
    a: 'NSND Đặng Thái Sơn', b: 'NSND Trung Kiên', c: 'NSND Quang Thọ', d: 'Nhạc sĩ Quốc Trung',
    ans: 'A', exp: 'Đặng Thái Sơn là nghệ sĩ châu Á đầu tiên giành giải Nhất tại cuộc thi âm nhạc Chopin danh giá ở Ba Lan.',
    tags: ['Âm nhạc', 'Đặng Thái Sơn']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Nhà soạn nhạc thiên tài người Đức bị khiếm thính nhưng vẫn sáng tác ra Bản giao hưởng số 9 bất hủ là ai?',
    a: 'Ludwig van Beethoven', b: 'Wolfgang Amadeus Mozart', c: 'Johann Sebastian Bach', d: 'Franz Schubert',
    ans: 'A', exp: 'Dù mất hoàn toàn thính giác, Beethoven vẫn sáng tác nên Bản giao hưởng số 9 với khúc hoan ca "Ode to Joy".',
    tags: ['Âm nhạc', 'Beethoven']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Thần đồng âm nhạc người Áo biết sáng tác từ năm 5 tuổi và là tác giả bản "Hành khúc Thổ Nhĩ Kỳ" là ai?',
    a: 'Wolfgang Amadeus Mozart', b: 'Frederic Chopin', c: 'Johannes Brahms', d: 'Antonio Vivaldi',
    ans: 'A', exp: 'Mozart là thiên tài âm nhạc vĩ đại thời kỳ Cổ điển, để lại hơn 600 tác phẩm đồ sộ cho nhân loại.',
    tags: ['Âm nhạc', 'Mozart']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Nghệ sĩ người Mỹ được cả thế giới tôn vinh với danh xưng "Ông hoàng nhạc Pop" (King of Pop) là ai?',
    a: 'Michael Jackson', b: 'Elvis Presley', c: 'Freddie Mercury', d: 'Prince',
    ans: 'A', exp: 'Michael Jackson là huyền thoại âm nhạc toàn cầu với điệu nhảy Moonwalk và album "Thriller" bán chạy nhất lịch sử.',
    tags: ['Âm nhạc', 'Michael Jackson']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Ban nhạc rock huyền thoại gồm 4 chàng trai đến từ thành phố Liverpool (nước Anh) là ban nhạc nào?',
    a: 'The Beatles', b: 'Queen', c: 'The Rolling Stones', d: 'Pink Floyd',
    ans: 'A', exp: 'The Beatles gồm John Lennon, Paul McCartney, George Harrison và Ringo Starr là ban nhạc vĩ đại nhất thế kỷ 20.',
    tags: ['Âm nhạc', 'The Beatles']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Ca khúc "Happy New Year" vang lên rộn rã mỗi dịp năm mới trên khắp thế giới là bài hát của ban nhạc nào?',
    a: 'ABBA (Thụy Điển)', b: 'Boney M', c: 'Modern Talking', d: 'Bee Gees',
    ans: 'A', exp: 'Ban nhạc Thụy Điển ABBA phát hành bài hát "Happy New Year" năm 1980 và trở thành giai điệu đón năm mới kinh điển.',
    tags: ['Âm nhạc', 'ABBA']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Một cây đàn Guitar thùng (Acoustic/Classic) tiêu chuẩn có tổng cộng bao nhiêu dây đàn?',
    a: '6 dây', b: '4 dây', c: '8 dây', d: '12 dây',
    ans: 'A', exp: 'Đàn Guitar tiêu chuẩn gồm 6 dây, chỉnh cao độ từ thấp đến cao là: Mì - Là - Rê - Sol - Si - Mí (E-A-D-G-B-E).',
    tags: ['Âm nhạc', 'Guitar']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Trong hệ thống ký âm nhạc phương Tây cơ bản, có bao nhiêu nốt nhạc tự nhiên chính?',
    a: '7 nốt nhạc (Đô, Rê, Mi, Pha, Son, La, Si)', b: '5 nốt nhạc', c: '12 nốt nhạc', d: '10 nốt nhạc',
    ans: 'A', exp: 'Bảy nốt nhạc cơ bản tạo nên thang âm tự nhiên gồm: Do, Re, Mi, Fa, Sol, La, Si.',
    tags: ['Âm nhạc', 'Nốt nhạc']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Nhạc cụ kèn đồng có thân uốn cong bằng đồng thau do Adolphe Sax phát minh ra vào năm 1840 là kèn gì?',
    a: 'Kèn Saxophone', b: 'Kèn Trumpet', c: 'Kèn Trombone', d: 'Kèn Clarinet',
    ans: 'A', exp: 'Kèn Saxophone mang tên nhà chế tạo Adolphe Sax là biểu tượng của các dòng nhạc Jazz và Pop lãng mạn.',
    tags: ['Âm nhạc', 'Saxophone']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Ca khúc "Lạc Trôi", "Nơi này có anh", "Hãy trao cho anh" do ca sĩ/nhạc sĩ trẻ nào thể hiện?',
    a: 'Sơn Tùng M-TP', b: 'Soobin Hoàng Sơn', c: 'Noo Phước Thịnh', d: 'Erik',
    ans: 'A', exp: 'Sơn Tùng M-TP là nghệ sĩ nổi tiếng của V-Pop với hàng loạt bản hit đạt kỷ lục lượt xem kỷ lục.',
    tags: ['Âm nhạc', 'V-Pop']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Rapper người Quảng Ninh nổi tiếng với các bản rap mộc mạc: "Đi về nhà", "Hai triệu năm", "Trốn tìm" là ai?',
    a: 'Đen Vâu', b: 'Karik', c: 'Suboi', d: 'Binz',
    ans: 'A', exp: 'Đen Vâu (Nguyễn Đức Cường) là rapper được đông đảo công chúng yêu mến nhờ lời ca giàu triết lý và sự gần gũi.',
    tags: ['Âm nhạc', 'Đen Vâu']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Ca khúc V-Pop "See Tình" với điệu nhảy cuốn hút gây sốt trên nền tảng mạng xã hội toàn cầu là của ca sĩ nào?',
    a: 'Hoàng Thùy Linh', b: 'Bích Phương', c: 'Min', d: 'Tóc Tiên',
    ans: 'A', exp: '"See Tình" nằm trong album LINK của Hoàng Thùy Linh đã tạo nên trào lưu nhảy cover khắp châu Á và thế giới.',
    tags: ['Âm nhạc', 'Hoàng Thùy Linh']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Video âm nhạc (MV) đầu tiên trong lịch sử cán mốc 1 TỶ lượt xem trên YouTube là bài hát nào?',
    a: 'Gangnam Style — PSY', b: 'Despacito — Luis Fonsi', c: 'Baby — Justin Bieber', d: 'See You Again — Wiz Khalifa',
    ans: 'A', exp: 'Năm 2012, điệu nhảy ngựa Gangnam Style của nghệ sĩ Hàn Quốc PSY đã trở thành video đầu tiên vượt 1 tỷ view YouTube.',
    tags: ['Âm nhạc', 'K-Pop']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Bản nhạc piano kinh điển "Für Elise" (Gửi Elise) ngọt ngào xao xuyến là sáng tác của ai?',
    a: 'Ludwig van Beethoven', b: 'Wolfgang Amadeus Mozart', c: 'Johann Sebastian Bach', d: 'Franz Liszt',
    ans: 'A', exp: '"Für Elise" là tiểu phẩm độc tấu piano nổi tiếng nhất thế giới do Beethoven sáng tác khoảng năm 1810.',
    tags: ['Âm nhạc', 'Cổ điển']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Ca khúc "Bụi phấn" tri ân thầy cô giáo thân thương ("Khi thầy viết bảng, bụi phấn rơi rơi...") do ai sáng tác?',
    a: 'Vũ Hoàng và Lê Văn Lộc', b: 'Phạm Tuyên', c: 'Phong Nhã', d: 'Hoàng Long',
    ans: 'A', exp: '"Bụi phấn" là bài ca bất hủ về nghề giáo được bao thế hệ học sinh Việt Nam cất cao tiếng hát.',
    tags: ['Âm nhạc', 'Nhà giáo']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Dòng nhạc Jazz quyến rũ ngẫu hứng có cái nôi ra đời từ thành phố nào của nước Mỹ?',
    a: 'New Orleans', b: 'New York', c: 'Los Angeles', d: 'Chicago',
    ans: 'A', exp: 'Thành phố New Orleans bang Louisiana là nơi khai sinh ra dòng nhạc Jazz rực rỡ vào đầu thế kỷ 20.',
    tags: ['Âm nhạc', 'Jazz']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Ca khúc rock kinh điển "Bohemian Rhapsody" bất hủ thuộc về ban nhạc huyền thoại nào?',
    a: 'Queen (Freddie Mercury)', b: 'Guns N Roses', c: 'Led Zeppelin', d: 'Scorpions',
    ans: 'A', exp: '"Bohemian Rhapsody" do ca sĩ chính Freddie Mercury của Queen sáng tác năm 1975 là kiệt tác lịch sử nhạc rock.',
    tags: ['Âm nhạc', 'Queen']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Bài hát thiếu nhi quốc dân "Ai yêu Bác Hồ Chí Minh hơn thiếu niên nhi đồng" do nhạc sĩ nào sáng tác?',
    a: 'Nhạc sĩ Phong Nhã', b: 'Nhạc sĩ Văn Cao', c: 'Nhạc sĩ Phạm Tuyên', d: 'Nhạc sĩ Hoàng Vân',
    ans: 'A', exp: 'Nhạc sĩ Phong Nhã - "nhạc sĩ của tuổi thơ" - đã sáng tác bài hát này vào cuối năm 1945.',
    tags: ['Âm nhạc', 'Thiếu nhi']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Nhạc cụ dân tộc làm từ các ống tre nứa dài ngắn gõ bằng dùi gõ của đồng bào Tây Nguyên là đàn gì?',
    a: 'Đàn T rưng', b: 'Đàn K lông pút', c: 'Đàn Đáy', d: 'Đàn Tính',
    ans: 'A', exp: 'Đàn T rưng với âm vang róc rách như tiếng suối reo là nhạc cụ đặc trưng của người Ba Na, Gia Rai Tây Nguyên.',
    tags: ['Âm nhạc', 'Tây Nguyên']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Đàn Tính (Tính tẩu) bằng quả bầu khô kết hợp đàn hát điệu Then là di sản văn hóa của dân tộc nào?',
    a: 'Dân tộc Tày, Nùng, Thái', b: 'Dân tộc Chăm', c: 'Dân tộc Khmer', d: 'Dân tộc Mông',
    ans: 'A', exp: 'Nghi lễ hát Then đàn Tính của người Tày, Nùng, Thái miền núi phía Bắc đã được UNESCO ghi danh là di sản văn hóa.',
    tags: ['Âm nhạc', 'Hát Then']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Ca khúc "Việt Nam ơi" rộn rã cổ vũ tinh thần đội tuyển bóng đá và lòng tự hào dân tộc do ai sáng tác?',
    a: 'Minh Beta (Bùi Quang Minh)', b: 'Only C', c: 'Nguyễn Hải Phong', d: 'Khắc Hưng',
    ans: 'A', exp: '"Việt Nam ơi" do nhạc sĩ/doanh nhân Minh Beta sáng tác năm 2011 đã trở thành ca khúc cổ vũ quen thuộc mỗi kỳ bóng đá.',
    tags: ['Âm nhạc', 'Việt Nam ơi']
  },

  // ================= 3. PHIM ẢNH & ĐIỆN ẢNH (50 CÂU - cat-sport) =================
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Bộ phim bom tấn kinh điển "Titanic" (1997) giành kỷ lục 11 giải Oscar do đạo diễn lừng danh nào dàn dựng?',
    a: 'James Cameron', b: 'Steven Spielberg', c: 'Christopher Nolan', d: 'Quentin Tarantino',
    ans: 'A', exp: 'James Cameron là đạo diễn của Titanic và chuỗi phim bom tấn Avatar đạt doanh thu kỷ lục phòng vé.',
    tags: ['Điện ảnh', 'Titanic']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Bộ phim hoạt hình 3D có doanh thu cao nhất mọi thời đại lấy bối cảnh hành tinh Pandora xinh đẹp là phim gì?',
    a: 'Avatar', b: 'Star Wars', c: 'Interstellar', d: 'The Matrix',
    ans: 'A', exp: 'Avatar (2009) của đạo diễn James Cameron hiện là bộ phim có doanh thu phòng vé cao nhất lịch sử điện ảnh (gần 3 tỷ USD).',
    tags: ['Điện ảnh', 'Avatar']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Bộ phim điện ảnh "Mắt Biếc" chuyển thể từ tiểu thuyết cùng tên của nhà văn Nguyễn Nhật Ánh do ai làm đạo diễn?',
    a: 'Victor Vũ', b: 'Nguyễn Quang Dũng', c: 'Trần Anh Hùng', d: 'Charlie Nguyễn',
    ans: 'A', exp: 'Đạo diễn Victor Vũ đã chuyển thể thành công tác phẩm "Mắt Biếc" với hình ảnh làng Đo Đo đầy thơ mộng.',
    tags: ['Điện ảnh', 'Mắt Biếc']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Bộ phim chiếu Tết "Mai" (2024) lập kỷ lục phim Việt có doanh thu cao nhất lịch sử (trên 520 tỷ đồng) do ai đạo diễn?',
    a: 'Trấn Thành', b: 'Lý Hải', c: 'Thu Trang', d: 'Vũ Ngọc Đãng',
    ans: 'A', exp: 'Phim điện ảnh "Mai" của đạo diễn Trấn Thành với Phương Anh Đào và Tuấn Trần đóng chính đã vượt mốc 520 tỷ đồng.',
    tags: ['Điện ảnh', 'Phim Việt']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Series phim hành động - hài gia đình "Lật Mặt" đạt doanh thu hàng trăm tỷ đồng qua nhiều phần là của nghệ sĩ nào?',
    a: 'Lý Hải', b: 'Trường Giang', c: 'Thái Hòa', d: 'Kiều Minh Tuấn',
    ans: 'A', exp: 'Đạo diễn/ca sĩ Lý Hải đã xây dựng thương hiệu điện ảnh "Lật Mặt" thành công vang dội suốt 7 phần phim.',
    tags: ['Điện ảnh', 'Lật Mặt']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Bộ phim kinh điển của điện ảnh cách mạng Việt Nam "Cánh đồng hoang" (1979) lấy bối cảnh chiến đấu tại vùng đất nào?',
    a: 'Đồng Tháp Mười', b: 'Rừng U Minh', c: 'Chiến khu D', d: 'Địa đạo Củ Chi',
    ans: 'A', exp: '"Cánh đồng hoang" do đạo diễn Hồng Sến dàn dựng với diễn xuất của NSND Lâm Tới và Thúy An đoạt Huy chương Vàng LHP Moscow.',
    tags: ['Điện ảnh', 'Kinh điển']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Bộ phim truyền hình tuổi thơ "Đất phương Nam" (1997) kể về hành trình tìm cha đầy gian nan của cậu bé tên gì?',
    a: 'Bé An', b: 'Thằng Cò', c: 'Bé Thiện', d: 'Bé Bo',
    ans: 'A', exp: 'Cậu bé An (Hùng Thuận đóng) lưu lạc khắp miền Tây Nam Bộ trong phim "Đất phương Nam" đã in sâu vào ký ức nhiều thế hệ.',
    tags: ['Phim truyền hình', 'Đất phương Nam']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Bộ phim hoạt hình kinh điển của Disney kể về chú sư tử con Simba trên thảo nguyên châu Phi có tên là gì?',
    a: 'Vua sư tử (The Lion King)', b: 'Tarzan', c: 'Kỷ băng hà (Ice Age)', d: 'Madagascar',
    ans: 'A', exp: 'The Lion King (1994) là kiệt tác hoạt hình vẽ tay bất hủ của xưởng phim hoạt hình Walt Disney.',
    tags: ['Hoạt hình', 'Disney']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Loạt phim điện ảnh phù thủy chuyển thể từ bộ tiểu thuyết ăn khách của nữ văn sĩ J.K. Rowling có tên là gì?',
    a: 'Harry Potter', b: 'Chúa tể những chiếc nhẫn', c: 'Narnia', d: 'Percy Jackson',
    ans: 'A', exp: 'Loạt phim 8 phần "Harry Potter" kể về thế giới phép thuật Hogwarts là hiện tượng điện ảnh toàn cầu.',
    tags: ['Điện ảnh', 'Harry Potter']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Trong Vũ trụ Điện ảnh Marvel (MCU), siêu anh hùng "Người Sắt" (Iron Man / Tony Stark) do nam tài tử nào hóa thân?',
    a: 'Robert Downey Jr.', b: 'Chris Evans', c: 'Chris Hemsworth', d: 'Mark Ruffalo',
    ans: 'A', exp: 'Robert Downey Jr. đã hóa thân xuất sắc thành Tony Stark, mở màn kỷ nguyên rực rỡ của Vũ trụ Điện ảnh Marvel từ năm 2008.',
    tags: ['Điện ảnh', 'Marvel']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Chiếc khiên tròn bất hoại của Đội trưởng Mỹ (Captain America) được chế tạo từ kim loại hư cấu quý hiếm nào?',
    a: 'Vibranium', b: 'Adamantium', c: 'Kryptonite', d: 'Titanium',
    ans: 'A', exp: 'Khiên của Captain America làm từ Vibranium đến từ đất nước Wakanda, có khả năng hấp thụ mọi chấn động xung lực.',
    tags: ['Điện ảnh', 'Marvel']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Điệp viên huyền thoại mang mật danh 007 phục vụ cho cơ quan tình báo MI6 của nước Anh có tên là gì?',
    a: 'James Bond', b: 'Ethan Hunt', c: 'Jason Bourne', d: 'John Wick',
    ans: 'A', exp: 'James Bond 007 do nhà văn Ian Fleming sáng tạo là nhân vật điệp viên hào hoa lừng danh nhất màn bạc.',
    tags: ['Điện ảnh', 'James Bond']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Giải thưởng điện ảnh thường niên danh giá bậc nhất thế giới do Viện Hàn lâm Mỹ trao tặng có tên là gì?',
    a: 'Giải Oscar (Academy Awards)', b: 'Giải Quả Cầu Vàng', c: 'Giải Grammy', d: 'Giải Emmy',
    ans: 'A', exp: 'Bức tượng vàng Oscar là đỉnh cao danh vọng mà mọi nhà làm phim và diễn viên trên thế giới đều khao khát.',
    tags: ['Điện ảnh', 'Oscar']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Bộ phim điện ảnh châu Á đầu tiên trong lịch sử đoạt giải Oscar cho "Phim hay nhất" năm 2020 là phim nào của Hàn Quốc?',
    a: 'Ký sinh trùng (Parasite)', b: 'Chuyến tàu sinh tử (Train to Busan)', c: 'Người hầu gái (The Handmaiden)', d: 'Điều kỳ diệu ở phòng giam số 7',
    ans: 'A', exp: 'Phim "Parasite" của đạo diễn Bong Joon-ho đã làm nên lịch sử khi ẵm trọn 4 giải Oscar quan trọng nhất năm 2020.',
    tags: ['Điện ảnh', 'Hàn Quốc']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Nhân vật hoạt hình chú chuột đeo găng tay trắng, biểu tượng bất diệt của đế chế Walt Disney là ai?',
    a: 'Chuột Mickey', b: 'Vịt Donald', c: 'Chó Goofy', d: 'Gấu Pooh',
    ans: 'A', exp: 'Chuột Mickey ra mắt lần đầu năm 1928 trong phim hoạt hình "Steamboat Willie" và trở thành biểu tượng văn hóa Mỹ.',
    tags: ['Hoạt hình', 'Mickey']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Bộ phim truyền hình kinh điển "Tây Du Ký" (1986) có nghệ sĩ nào đóng vai Tôn Ngộ Không xuất thần nhất?',
    a: 'Lục Tiểu Linh Đồng', b: 'Châu Tinh Trì', c: 'Chân Tử Đan', d: 'Lý Liên Kiệt',
    ans: 'A', exp: 'Nghệ sĩ Lục Tiểu Linh Đồng sinh ra trong gia đình 4 đời diễn khỉ, vai Tôn Ngộ Không của ông trở thành tượng đài bất hủ.',
    tags: ['Phim ảnh', 'Tây Du Ký']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Bộ phim điện ảnh hoạt hình "Vùng đất linh hồn" (Spirited Away) đoạt giải Oscar là kiệt tác của xưởng phim nào ở Nhật Bản?',
    a: 'Studio Ghibli (Hayao Miyazaki)', b: 'Toei Animation', c: 'Kyoto Animation', d: 'MAPPA',
    ans: 'A', exp: 'Studio Ghibli dưới bàn tay phù thủy Hayao Miyazaki đã tạo nên Spirited Away - đỉnh cao hoạt hình anime thế giới.',
    tags: ['Anime', 'Ghibli']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Bộ phim "Forrest Gump" (1994) với câu thoại nổi tiếng: "Cuộc đời như một hộp kẹo chocolate..." do tài tử nào đóng chính?',
    a: 'Tom Hanks', b: 'Brad Pitt', c: 'Leonardo DiCaprio', d: 'Johnny Depp',
    ans: 'A', exp: 'Tom Hanks đã giành tượng vàng Oscar "Nam diễn viên chính xuất sắc nhất" cho vai diễn chàng khờ Forrest Gump giàu nghị lực.',
    tags: ['Điện ảnh', 'Forrest Gump']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Bộ phim khoa học viễn tưởng "Công viên kỷ Jura" (1993) đưa loài sinh vật cổ đại nào sống lại trên màn ảnh?',
    a: 'Loài Khủng long', b: 'Voi ma mút', c: 'Hổ răng kiếm', d: 'Thằn lằn bay tiền sử',
    ans: 'A', exp: 'Đạo diễn Steven Spielberg đã tạo nên bước ngoặt kỹ xảo CGI tái hiện đàn khủng long sống động trong Jurassic Park.',
    tags: ['Điện ảnh', 'Khủng long']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Kẻ thù không đội trời chung với Người Dơi (Batman) tại thành phố Gotham là tên tội phạm điên loạn nào?',
    a: 'Joker', b: 'Penguin', c: 'Riddler', d: 'Two-Face',
    ans: 'A', exp: 'Gã hề Joker là ác nhân phản diện vĩ đại và phức tạp bậc nhất trong thế giới truyện tranh và điện ảnh DC.',
    tags: ['Điện ảnh', 'Batman']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Đạo diễn nổi tiếng với phong cách làm phim không dùng kỹ xảo xanh (Oppenheimer, Inception, Interstellar) là ai?',
    a: 'Christopher Nolan', b: 'Martin Scorsese', c: 'Denis Villeneuve', d: 'David Fincher',
    ans: 'A', exp: 'Christopher Nolan là bậc thầy điện ảnh đương đại, đoạt giải Oscar Đạo diễn xuất sắc nhất với phim Oppenheimer (2023).',
    tags: ['Điện ảnh', 'Nolan']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Series phim truyền hình Hàn Quốc "Squid Game" (Trò chơi con mực) gây sốt toàn cầu có trò chơi sinh tồn đầu tiên là gì?',
    a: 'Đèn đỏ, đèn xanh (Hoa dâm bụt đã nở)', b: 'Kéo co', c: 'Tách kẹo đường dalgona', d: 'Bắn bi',
    ans: 'A', exp: 'Trò chơi "Đèn đỏ, đèn xanh" với búp bê khổng lồ Younghee đã trở thành biểu tượng gây sốt toàn cầu của Squid Game.',
    tags: ['Phim truyền hình', 'Squid Game']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Bộ phim hoạt hình của xưởng Pixar kể về ngôi nhà bay lên bầu trời nhờ hàng nghìn quả bóng bay rực rỡ là phim gì?',
    a: 'Vút bay (Up)', b: 'Câu chuyện đồ chơi (Toy Story)', c: 'Vương quốc xe hơi (Cars)', d: 'Những mảnh ghép cảm xúc (Inside Out)',
    ans: 'A', exp: 'Bộ phim "Up" (2009) mở đầu bằng câu chuyện tình yêu cảm động của ông lão Carl Fredricksen lấy đi nước mắt của khán giả.',
    tags: ['Hoạt hình', 'Pixar']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Sinh vật màu vàng nhỏ bé, thích ăn chuối và nói thứ ngôn ngữ líu lo hài hước trong phim "Kẻ cắp mặt trăng" là ai?',
    a: 'Những chú Minions', b: 'Smurfs (Xì Trum)', c: 'Oompa Loompa', d: 'Teletubbies',
    ans: 'A', exp: 'Đội quân Minions màu vàng ngộ nghĩnh phụ tá cho Gru đã trở thành một trong những nhân vật hoạt hình ăn khách nhất.',
    tags: ['Hoạt hình', 'Minions']
  },
  {
    cat: 'cat-sport', diff: 'EASY',
    q: 'Thuyền trưởng Jack Sparrow lập dị, hài hước trong chuỗi phim "Cướp biển vùng Caribbean" do tài tử nào đóng?',
    a: 'Johnny Depp', b: 'Orlando Bloom', c: 'Brad Pitt', d: 'Nicolas Cage',
    ans: 'A', exp: 'Johnny Depp đã biến Jack Sparrow thành một trong những nhân vật cướp biển biểu tượng nhất lịch sử điện ảnh.',
    tags: ['Điện ảnh', 'Jack Sparrow']
  },

  // ================= 4. ĐỐ MẸO & ĐỐ VUI DÂN GIAN (50 CÂU - cat-life) =================
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Cái gì người mua biết, người bán biết, người xài không bao giờ biết?"',
    a: 'Quan tài', b: 'Chiếc gương soi', c: 'Bình xịt muỗi', d: 'Cái bẫy chuột',
    ans: 'A', exp: 'Người nằm trong quan tài đã qua đời nên không thể biết mình đang nằm trong đó.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Con đường nào dài nhất mà không ai đo được bằng thước kẻ?"',
    a: 'Đường đời', b: 'Đường xích đạo', c: 'Đường cao tốc Bắc Nam', d: 'Đường chân trời',
    ans: 'A', exp: 'Đường đời là hành trình cả một kiếp người, dài vô tận theo thời gian sống.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Cuốn lịch nào dài nhất trong tất cả các loại lịch?"',
    a: 'Lịch sử', b: 'Lịch vạn niên', c: 'Lịch treo tường', d: 'Lịch Gregory',
    ans: 'A', exp: 'Lịch sử ghi lại hàng nghìn, hàng triệu năm tiến hóa của con người và vũ trụ.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Chiếc quần nào rộng nhất trên thế giới?"',
    a: 'Quần đảo', b: 'Quần bò ống loe', c: 'Quần đùi người khổng lồ', d: 'Quần tây công sở',
    ans: 'A', exp: 'Quần đảo gồm nhiều hòn đảo trải dài trên diện tích hàng ngàn cây số vuông mặt biển.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Xã nào đông dân nhất và quy tụ nhiều người nhất?"',
    a: 'Xã hội', b: 'Xã nông thôn', c: 'Xã miền núi', d: 'Xã đảo',
    ans: 'A', exp: 'Xã hội bao gồm toàn bộ con người cùng chung sống trên hành tinh.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Cua đỏ dài 10cm chạy đua cùng cua xanh dài 15cm, con nào về đích trước?"',
    a: 'Con cua xanh (vì cua đỏ đã bị luộc chín)', b: 'Con cua đỏ (vì đỏ may mắn)', c: 'Cả hai về cùng lúc', d: 'Không con nào chạy được',
    ans: 'A', exp: 'Cua chỉ có màu đỏ khi đã bị nấu chín nên không thể chạy đua được nữa.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Căn bệnh nào mà bất cứ bác sĩ giỏi nào trên đời cũng phải... bó tay?"',
    a: 'Bệnh gãy tay', b: 'Bệnh cảm cúm', c: 'Bệnh đau bụng', d: 'Bệnh mất ngủ',
    ans: 'A', exp: 'Bệnh gãy tay thì bác sĩ phải bó bột ở tay (bó tay) để cố định xương gãy.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Ở Việt Nam ta, rồng bay lên ở đâu và rồng đáp xuống ở đâu?"',
    a: 'Rồng bay ở Thăng Long và đáp ở Hạ Long', b: 'Bay ở Cửu Long đáp ở Bạch Long Vĩ', c: 'Bay ở Hàm Rồng đáp ở Cầu Rồng', d: 'Bay ở Sài Gòn đáp ở Hà Nội',
    ans: 'A', exp: 'Thăng Long nghĩa là "rồng bay lên", Hạ Long nghĩa là "rồng hạ xuống đáp".',
    tags: ['Đố mẹo', 'Địa danh']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Vật gì tay trái bạn cầm được mà tay phải của bạn vĩnh viễn không bao giờ cầm được?"',
    a: 'Cùi chỏ (khuỷu tay) bên phải', b: 'Cái cốc nước', c: 'Cây bút viết', d: 'Bàn chân trái',
    ans: 'A', exp: 'Bàn tay phải không thể tự nắm lấy khuỷu tay của chính cánh tay phải.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Loài chuột nào trong cuộc sống bình thường lại đi lại bằng 2 chân?"',
    a: 'Chuột Mickey', b: 'Chuột cống', c: 'Chuột túi', d: 'Chuột nhắt',
    ans: 'A', exp: 'Chuột Mickey trong phim hoạt hình của Disney luôn đứng và đi bằng 2 chân như người.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Thế loài vịt nào lại đi lại bằng 2 chân?"',
    a: 'Tất cả các loài vịt bình thường', b: 'Chỉ có Vịt Donald', c: 'Chỉ có vịt trời', d: 'Chỉ có vịt xiêm',
    ans: 'A', exp: 'Tất cả các loài vịt bình thường vốn dĩ sinh ra đều đi bằng 2 chân.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Thứ gì quý giá mà bạn chỉ cần mở miệng nói ra tên nó là nó lập tức biến mất?"',
    a: 'Sự im lặng', b: 'Bí mật', c: 'Lời hứa', d: 'Giấc mơ',
    ans: 'A', exp: 'Khi bạn cất tiếng nói thì không gian xung quanh không còn giữ được sự im lặng nữa.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Một người đi dưới mưa rào không đội mũ cũng không che ô nhưng không ướt một sợi tóc nào, tại sao?"',
    a: 'Vì người đó bị trọc đầu (không có tóc)', b: 'Vì người đó mặc áo mưa', c: 'Vì mưa quá nhỏ', d: 'Vì người đó chạy nhanh',
    ans: 'A', exp: 'Người trọc đầu thì trên đầu làm gì có sợi tóc nào để mà bị ướt.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Con gì có mũi có lưỡi sắc bén mà lại không có mắt có tai?"',
    a: 'Con dao', b: 'Con kéo', c: 'Con trâu', d: 'Con tàu',
    ans: 'A', exp: 'Con dao có mũi dao và lưỡi dao sắc để thái gọt.',
    tags: ['Đố vui', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Cái gì có cổ mà không có miệng, có thân mà lại không có chân?"',
    a: 'Cái áo (hoặc cái chai nước)', b: 'Con lươn', c: 'Cây cột nhà', d: 'Cái gối ôm',
    ans: 'A', exp: 'Cái áo có cổ áo và thân áo nhưng không có miệng hay chân.',
    tags: ['Đố vui', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Thứ gì càng lau chùi thì lại càng dơ bẩn?"',
    a: 'Cái giẻ lau (khăn lau)', b: 'Mặt bàn', c: 'Tấm kính cửa sổ', d: 'Đôi giày da',
    ans: 'A', exp: 'Cái khăn lau càng lau đồ vật thì bụi bẩn càng dính vào nó khiến nó bẩn thêm.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Cái gì có rất nhiều răng nhưng lại chẳng bao giờ nhai cơm?"',
    a: 'Chiếc lược chải đầu (hoặc cái cào)', b: 'Con cá mập', c: 'Miệng sư tử', d: 'Bánh răng cưa máy kéo',
    ans: 'A', exp: 'Chiếc lược có hàng răng lược đều tăm tắp dùng để chải tóc chứ không nhai thức ăn.',
    tags: ['Đố vui', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Cái gì thuộc về chính bản thân bạn nhưng người khác lại dùng nó nhiều hơn bạn?"',
    a: 'Tên gọi của bạn', b: 'Điện thoại của bạn', c: 'Đôi mắt của bạn', d: 'Quần áo của bạn',
    ans: 'A', exp: 'Tên của bạn chủ yếu để người khác xưng hô gọi bạn hàng ngày.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Trong một năm dương lịch, tháng nào có 28 ngày?"',
    a: 'Tất cả 12 tháng trong năm', b: 'Chỉ có tháng 2', c: 'Chỉ có tháng 1', d: 'Không có tháng nào',
    ans: 'A', exp: 'Mọi tháng trong năm đều có ít nhất 28 ngày trở lên.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Núi nào ở Việt Nam ta nghe tên như bị chặt ra từng khúc?"',
    a: 'Núi Thái Sơn (Thái nghĩa là cắt)', b: 'Núi Bà Đen', c: 'Núi Ngũ Hành Sơn', d: 'Núi Bạch Mã',
    ans: 'A', exp: '"Thái" trong tiếng Việt có nghĩa là cắt thái ra từng lát mỏng.',
    tags: ['Đố mẹo', 'Địa danh']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Bánh gì nghe tên cứ tưởng người nghèo khó thiếu thốn?"',
    a: 'Bánh ít', b: 'Bánh dày', c: 'Bánh tiêu', d: 'Bánh khoái',
    ans: 'A', exp: 'Bánh ít chữ "ít" nghe như ít ỏi, thiếu thốn.',
    tags: ['Đố mẹo', 'Ẩm thực']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Bánh gì nghe tên cứ tưởng là hành động đánh đập người khác?"',
    a: 'Bánh tét', b: 'Bánh đập', c: 'Bánh giò', d: 'Bánh bèo',
    ans: 'A', exp: '"Tét" trong phương ngữ miền Nam có nghĩa là đánh đòn vào mông.',
    tags: ['Đố mẹo', 'Ẩm thực']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Bánh gì nghe tên là thấy lòng tràn ngập niềm vui mừng rỡ?"',
    a: 'Bánh khoái', b: 'Bánh mừng', c: 'Bánh vui', d: 'Bánh sướng',
    ans: 'A', exp: 'Bánh khoái xứ Huế có chữ "khoái" nghĩa là khoái chí, vui thích.',
    tags: ['Đố mẹo', 'Ẩm thực']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Thứ gì luôn luôn đến mà không bao giờ đến nơi thật sự?"',
    a: 'Ngày mai', b: 'Chuyến xe buýt', c: 'Cơn mưa rào', d: 'Mùa xuân',
    ans: 'A', exp: 'Khi ngày mai đến thì nó đã trở thành ngày hôm nay rồi.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Nhà xanh ở bên trái, nhà đỏ ở bên phải, hỏi Nhà Trắng nằm ở đâu?"',
    a: 'Ở thủ đô Washington D.C. nước Mỹ', b: 'Ở giữa nhà xanh và đỏ', c: 'Ở trên đỉnh đồi', d: 'Ở trong rừng sâu',
    ans: 'A', exp: 'Nhà Trắng (White House) là dinh thự và nơi làm việc của Tổng thống Hoa Kỳ.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Cái gì bạn cho đi người khác mà bạn lại không hề mất đi mà còn nhận lại nhiều hơn?"',
    a: 'Nụ cười', b: 'Tiền bạc', c: 'Điện thoại', d: 'Chiếc áo ấm',
    ans: 'A', exp: 'Trao nụ cười thân thiện sẽ nhận lại nụ cười và niềm vui ấm áp từ người khác.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui dân gian: "Thân em xưa ở bụi tre, mùa đông xếp lại mùa hè mở ra?" là cái gì?',
    a: 'Chiếc quạt nan tre (quạt giấy)', b: 'Cái mành tre', c: 'Chiếc chiếu cói', d: 'Cây cần câu',
    ans: 'A', exp: 'Chiếc quạt nan hoặc quạt giấy nan tre mùa hè quạt mát, mùa đông cất đi.',
    tags: ['Đố vui', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Một mẹ thường dẫn sáu con, yêu mến vẹn tròn cho bú cả sáu?" là đồ vật gì?',
    a: 'Ấm trà và 6 chén trà', b: 'Nồi cơm và 6 bát', c: 'Chùm nho 6 quả', d: 'Bếp than 6 cửa',
    ans: 'A', exp: 'Ấm trà rót nước trà đều đặn vào 6 chén trà nhỏ xung quanh khay trà.',
    tags: ['Đố vui', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Da cóc mà bọc bột lọc, bột lọc mà bọc hòn than?" là quả gì?',
    a: 'Quả nhãn', b: 'Quả vải', c: 'Quả măng cụt', d: 'Quả chôm chôm',
    ans: 'A', exp: 'Quả nhãn có vỏ ngoài sần sùi vàng nâu, cùi nhãn trong veo trắng ngọt và hạt đen tuyền như hòn than.',
    tags: ['Đố vui', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Đầu rồng đuôi phụng cánh tiên, ngày ngày chăm chỉ kiếm tiền nuôi con?" là con gì?',
    a: 'Con ong mật', b: 'Con bướm đêm', c: 'Con chuồn chuồn', d: 'Con bọ ngựa',
    ans: 'A', exp: 'Con ong chăm chỉ bay lượn hút mật hoa về tổ tạo mật nuôi dưỡng đàn con.',
    tags: ['Đố vui', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Cây gì không lá không cành, quả chín đỏ ửng thơm lừng xóm trên?" là quả gì?',
    a: 'Quả ớt chín', b: 'Quả cà chua', c: 'Củ gừng', d: 'Củ cà rốt',
    ans: 'A', exp: 'Quả ớt khi chín có màu đỏ tươi cay nồng.',
    tags: ['Đố vui', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Mặt tròn vành vạnh trên cao, đêm rằm toả sáng dạt dào ánh trăng?" là gì?',
    a: 'Mặt trăng', b: 'Mặt trời', c: 'Ngôi sao mai', d: 'Đèn hải đăng',
    ans: 'A', exp: 'Mặt trăng đêm rằm tròn đầy tỏa ánh sáng dịu mát soi bóng trần gian.',
    tags: ['Đố vui', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Cây suôn đuột, trong ruột đen thui, con nít lui cui, tra đầu vô cạo?" là vật dụng gì?',
    a: 'Cây bút chì', b: 'Cây đũa bếp', c: 'Chiếc tăm tre', d: 'Que diêm quẹt',
    ans: 'A', exp: 'Bút chì có ruột than chì đen, khi cùn phải dùng gọt bút chì để vót nhọn.',
    tags: ['Đố vui', 'Học tập']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Để nguyên lấp lánh trên trời, bớt đầu thành chỗ người người nghỉ ngơi?" là cặp từ nào?',
    a: 'Sao và Ao', b: 'Trăng và Răng', c: 'Mây và Cây', d: 'Gió và Đò',
    ans: 'A', exp: 'Từ "Sao" lấp lánh trên trời, bớt chữ cái đầu "S" thành từ "Ao" bờ nước.',
    tags: ['Đố chữ', 'Tiếng Việt']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Con gì đẻ trứng trên cây, hót mừng ngày mới vui say sớm chiều?" là con gì?',
    a: 'Con chim', b: 'Con thằn lằn', c: 'Con sâu róm', d: 'Con ếch ương',
    ans: 'A', exp: 'Loài chim làm tổ đẻ trứng trên cành cây và cất tiếng hót đón chào bình minh.',
    tags: ['Đố vui', 'Động vật']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Cá gì biết nhảy múa trên cạn mà không cần nước?"',
    a: 'Cá độ (cá cược)', b: 'Cá thòi lòi', c: 'Cá quả', d: 'Cá heo',
    ans: 'A', exp: '"Cá độ" là trò cá cược ăn thua chứ không phải loài cá bơi dưới nước.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Cầu gì bắc qua sông mà không ai có thể đi lại trên đó?"',
    a: 'Cầu vồng', b: 'Cầu tre lắc lẻo', c: 'Cầu phao dã chiến', d: 'Cầu khỉ',
    ans: 'A', exp: 'Cầu vồng là hiện tượng tán sắc ánh sáng mặt trời qua hạt mưa trên bầu trời.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Trái gì nhiều mắt xung quanh, chín thơm ngào ngạt khắp quanh xóm làng?" là quả gì?',
    a: 'Quả dứa (Quả thơm / Quả khóm)', b: 'Quả mít', c: 'Quả na', d: 'Quả chôm chôm',
    ans: 'A', exp: 'Quả dứa (thơm/khóm) có lớp vỏ ngoài mang rất nhiều mắt dứa.',
    tags: ['Đố vui', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Hoa gì sớm nở tối tàn, trắng tinh e ấp dịu dàng về đêm?" là hoa gì?',
    a: 'Hoa quỳnh', b: 'Hoa mười giờ', c: 'Hoa hồng nhung', d: 'Hoa hướng dương',
    ans: 'A', exp: 'Hoa quỳnh được mệnh danh là nữ hoàng bóng đêm, chỉ nở rộ thoang thoảng hương thơm lúc đêm muộn.',
    tags: ['Đố vui', 'Hoa cỏ']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Con gì chân ngắn cổ dài, bơi lội dưới ao cạp cạp suốt ngày?" là con gì?',
    a: 'Con vịt bầu', b: 'Con thiên nga', c: 'Con bồ nông', d: 'Con hạc trắng',
    ans: 'A', exp: 'Con vịt có chân ngắn màng bơi, bơi lội kiếm mồi dưới ao hồ.',
    tags: ['Đố vui', 'Động vật']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Loại xe nào không bao giờ cần đổ xăng hay cắm sạc điện mà vẫn đi băng băng?"',
    a: 'Xe đạp (hoặc xe lăn)', b: 'Xe máy', c: 'Xe tải', d: 'Xe taxi',
    ans: 'A', exp: 'Xe đạp chạy hoàn toàn bằng sức đạp của đôi chân con người.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Cái gì sáng đi bốn chân, trưa đi hai chân, chiều đi ba chân?"',
    a: 'Con người (bò lúc nhỏ, đi lúc trưởng thành, chống gậy khi già)', b: 'Con khỉ', c: 'Con chó', d: 'Cái bàn',
    ans: 'A', exp: 'Câu đố kinh điển của tượng Nhân Sư: con người lúc ấu thơ bò 4 chân, lớn đi 2 chân, về già chống thêm gậy là 3 chân.',
    tags: ['Đố mẹo', 'Triết lý']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Bao nhiêu hạt cát mới tạo thành một sa mạc mênh mông?"',
    a: 'Vô số hạt cát', b: '1 triệu hạt', c: '1 tỷ hạt', d: '100 triệu hạt',
    ans: 'A', exp: 'Sa mạc cát bao la rộng lớn được tạo thành từ vô số hạt cát không thể đếm xuể.',
    tags: ['Đố mẹo', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Cái bóng của bạn biến mất hoàn toàn vào thời điểm nào trong ngày nắng đẹp?"',
    a: 'Đúng 12 giờ trưa (khi mặt trời đứng bóng chiếu thẳng đứng)', b: 'Lúc 7 giờ sáng', c: 'Lúc 5 giờ chiều', d: 'Lúc 3 giờ chiều',
    ans: 'A', exp: 'Khi mặt trời ở đúng thiên đỉnh (đứng bóng), bóng của bạn sẽ thu gọn lại ngay dưới bàn chân.',
    tags: ['Đố mẹo', 'Khoa học']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Con gì mắt to như ốc nhồi, ngày ngủ đêm bay bắt chuột tinh ranh?" là con gì?',
    a: 'Chim cú mèo', b: 'Con dơi', c: 'Chim bồ câu', d: 'Đại bàng',
    ans: 'A', exp: 'Chim cú mèo có đôi mắt tinh tường chuyên săn bắt chuột vào ban đêm.',
    tags: ['Đố vui', 'Động vật']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Cây gì lá nhỏ lăn tăn, đụng vào e thẹn khép rèm ngủ ngay?" là cây gì?',
    a: 'Cây trinh nữ (Cây xấu hổ)', b: 'Cây bèo tây', c: 'Cây cỏ gà', d: 'Cây dương xỉ',
    ans: 'A', exp: 'Cây xấu hổ (trinh nữ) có phản ứng cảm ứng cụp lá lại khi có vật chạm vào.',
    tags: ['Đố vui', 'Thực vật']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố mẹo: "Từ nào trong tiếng Việt mà người thông minh hay người dốt đều đánh vần sai?"',
    a: 'Từ "Sai"', b: 'Từ "Đúng"', c: 'Từ "Khó"', d: 'Từ "Dài"',
    ans: 'A', exp: 'Đánh vần từ "Sai" thì tất nhiên là đánh vần chữ S-A-I rồi.',
    tags: ['Đố mẹo', 'Chữ nghĩa']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Có răng mà chẳng có môi, có đầu có mắt rên hừ suốt đêm?" là cái gì?',
    a: 'Cái cưa gỗ', b: 'Chiếc quạt máy', c: 'Cối xay lúa', d: 'Máy may',
    ans: 'A', exp: 'Lưỡi cưa có nhiều răng cưa sắc nhọn dùng để xẻ gỗ.',
    tags: ['Đố vui', 'Dân gian']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Thân hình tròn trĩnh lăn lông lốc, bị đá chan chát mà chẳng kêu ca?" là vật gì?',
    a: 'Quả bóng đá', b: 'Bánh xe bò', c: 'Hòn đá cuội', d: 'Quả dưa hấu',
    ans: 'A', exp: 'Quả bóng đá tròn xoe là tâm điểm của môn thể thao vua bóng đá.',
    tags: ['Đố vui', 'Thể thao']
  },
  {
    cat: 'cat-life', diff: 'EASY',
    q: 'Đố vui: "Cái gì treo trên tường tích tắc đêm ngày nhắc ta chăm chỉ học hành làm việc?" là đồ vật gì?',
    a: 'Đồng hồ treo tường', b: 'Bức tranh phong cảnh', c: 'Tấm gương soi', d: 'Tấm lịch năm mới',
    ans: 'A', exp: 'Đồng hồ đếm từng giây từng phút nhắc nhở thời gian quý báu.',
    tags: ['Đố vui', 'Đồ vật']
  }
];

console.log(`Bắt đầu nạp ${questions200.length} câu hỏi chất lượng cao vào CSDL...`);

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
  VALUES (?, ?, 'WIKIPEDIA', 'https://vi.wikipedia.org/', 'CC BY-SA 4.0', 'Kho tàng Tri thức & Văn hóa Việt Nam')
`);

db.exec('BEGIN TRANSACTION');
try {
  for (const item of questions200) {
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
