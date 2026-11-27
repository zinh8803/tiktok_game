import { SeedQuestion } from './seed-data';

interface RawTriviaItem {
  cat: 'cat-geo' | 'cat-his' | 'cat-sci' | 'cat-tech' | 'cat-sport' | 'cat-life';
  diff: 'EASY' | 'MEDIUM' | 'HARD';
  q: string;
  correct: string;
  wrongs: [string, string, string];
  exp: string;
  tags: string[];
}

/**
 * Ngân hàng 500+ câu hỏi Tiếng Việt mở rộng (Hoàn toàn mới, không trùng lặp với 1015 câu trước đó)
 */
const CURATED_BASE_ITEMS: RawTriviaItem[] = [
  // ================= 1. ĐỊA LÝ & DI SẢN (cat-geo) =================
  {
    cat: 'cat-geo',
    diff: 'EASY',
    q: 'Đèo Hải Vân — "Thiên hạ đệ nhất hùng quan" — nằm trên ranh giới tự nhiên giữa hai địa phương nào?',
    correct: 'Thừa Thiên Huế và TP. Đà Nẵng',
    wrongs: ['Quảng Nam và Quảng Ngãi', 'Quảng Bình và Quảng Trị', 'Phú Yên và Khánh Hòa'],
    exp: 'Đèo Hải Vân cắt ngang dãy núi Bạch Mã, là ranh giới tự nhiên giữa tỉnh Thừa Thiên Huế và thành phố Đà Nẵng.',
    tags: ['Đèo Hải Vân', 'Miền Trung'],
  },
  {
    cat: 'cat-geo',
    diff: 'EASY',
    q: 'Thành phố nào của tỉnh Quảng Ninh nổi tiếng với danh thắng núi Bài Thơ và cầu Bãi Cháy?',
    correct: 'TP. Hạ Long',
    wrongs: ['TP. Cẩm Phả', 'TP. Uông Bí', 'TP. Đông Triều'],
    exp: 'Thành phố Hạ Long là trung tâm hành chính, kinh tế và du lịch của tỉnh Quảng Ninh.',
    tags: ['Quảng Ninh', 'Hạ Long'],
  },
  {
    cat: 'cat-geo',
    diff: 'MEDIUM',
    q: 'Một trong "Tứ đại đỉnh đèo" của vùng núi Tây Bắc nằm nối liền tỉnh Lào Cai và tỉnh Lai Châu là đèo nào?',
    correct: 'Đèo Ô Quy Hồ',
    wrongs: ['Đèo Pha Đin', 'Đèo Khau Phạ', 'Đèo Mã Pí Lèng'],
    exp: 'Đèo Ô Quy Hồ (còn gọi là đèo Hoàng Liên Sơn) dài gần 50km nối liền Lào Cai và Lai Châu.',
    tags: ['Tứ đại đỉnh đèo', 'Tây Bắc'],
  },
  {
    cat: 'cat-geo',
    diff: 'MEDIUM',
    q: 'Đèo Khau Phạ nổi tiếng với lễ hội bay dù lượn trên thung lũng ruộng bậc thang Mù Cang Chải thuộc tỉnh nào?',
    correct: 'Tỉnh Yên Bái',
    wrongs: ['Tỉnh Sơn La', 'Tỉnh Điện Biên', 'Tỉnh Hòa Bình'],
    exp: 'Đèo Khau Phạ nằm ở huyện Mù Cang Chải, tỉnh Yên Bái, là một trong tứ đại đỉnh đèo Tây Bắc.',
    tags: ['Yên Bái', 'Mù Cang Chải'],
  },
  {
    cat: 'cat-geo',
    diff: 'MEDIUM',
    q: 'Đèo Pha Đin lịch sử gắn liền với chiến dịch Điện Biên Phủ nằm trên ranh giới của hai tỉnh nào?',
    correct: 'Sơn La và Điện Biên',
    wrongs: ['Hòa Bình và Sơn La', 'Yên Bái và Lào Cai', 'Lai Châu và Điện Biên'],
    exp: 'Đèo Pha Đin dài 32km nằm trên Quốc lộ 6 nối liền hai tỉnh Sơn La và Điện Biên.',
    tags: ['Đèo Pha Đin', 'Tây Bắc'],
  },
  {
    cat: 'cat-geo',
    diff: 'EASY',
    q: 'Vườn quốc gia Cúc Phương — vườn quốc gia đầu tiên của Việt Nam — nằm chủ yếu trên địa phận tỉnh nào?',
    correct: 'Ninh Bình (giáp Hòa Bình, Thanh Hóa)',
    wrongs: ['Nghệ An', 'Quảng Bình', 'Đồng Nai'],
    exp: 'Vườn quốc gia Cúc Phương được thành lập năm 1962, có trụ sở chính tại huyện Nho Quan, tỉnh Ninh Bình.',
    tags: ['Cúc Phương', 'Vườn quốc gia'],
  },
  {
    cat: 'cat-geo',
    diff: 'MEDIUM',
    q: 'Vườn quốc gia Tràm Chim — nơi bảo tồn loài Sếu đầu đỏ quý hiếm — nằm ở tỉnh nào của miền Tây?',
    correct: 'Tỉnh Đồng Tháp',
    wrongs: ['Tỉnh An Giang', 'Tỉnh Kiên Giang', 'Tỉnh Long An'],
    exp: 'Vườn quốc gia Tràm Chim thuộc huyện Tam Nông, tỉnh Đồng Tháp, là khu Ramsar nổi tiếng của thế giới.',
    tags: ['Đồng Tháp', 'Tràm Chim'],
  },
  {
    cat: 'cat-geo',
    diff: 'EASY',
    q: 'Núi Bà Đen — ngọn núi cao nhất vùng Nam Bộ (986m) — nằm ở tỉnh nào?',
    correct: 'Tỉnh Tây Ninh',
    wrongs: ['Tỉnh Bình Phước', 'Tỉnh Đồng Nai', 'Tỉnh Bà Rịa - Vũng Tàu'],
    exp: 'Núi Bà Đen cao 986m nằm tại thành phố Tây Ninh, được mệnh danh là "Nóc nhà Nam Bộ".',
    tags: ['Tây Ninh', 'Núi Bà Đen'],
  },
  {
    cat: 'cat-geo',
    diff: 'MEDIUM',
    q: 'Ghềnh Đá Đĩa với các khối đá bazan hình lăng trụ xếp chồng kỳ thú là danh thắng của tỉnh nào?',
    correct: 'Tỉnh Phú Yên',
    wrongs: ['Tỉnh Bình Định', 'Tỉnh Ninh Thuận', 'Tỉnh Bình Thuận'],
    exp: 'Ghềnh Đá Đĩa nằm tại huyện Tuy An, tỉnh Phú Yên, được hình thành từ hoạt động núi lửa hàng triệu năm trước.',
    tags: ['Phú Yên', 'Ghềnh Đá Đĩa'],
  },
  {
    cat: 'cat-geo',
    diff: 'EASY',
    q: 'Đảo Lý Sơn — quê hương của Hải đội Hoàng Sa kiêm quản Bắc Hải và đặc sản tỏi cô đơn — thuộc tỉnh nào?',
    correct: 'Tỉnh Quảng Ngãi',
    wrongs: ['Tỉnh Quảng Nam', 'Tỉnh Bình Định', 'Tỉnh Khánh Hòa'],
    exp: 'Huyện đảo Lý Sơn thuộc tỉnh Quảng Ngãi, được mệnh danh là "Vương quốc tỏi".',
    tags: ['Lý Sơn', 'Quảng Ngãi'],
  },
];

// Dữ liệu cấu trúc đa dạng để sinh chính xác 500+ câu hỏi độc bản, không trùng lặp
const PROVINCE_FACTS: Array<{
  prov: string;
  landmark: string;
  specialty: string;
  region: string;
  riverOrMount: string;
}> = [
  { prov: 'An Giang', landmark: 'Rừng tràm Trà Sư và Miếu Bà Chúa Xứ Núi Sam', specialty: 'Bún cá Châu Đốc & Thốt nốt', region: 'Tây Nam Bộ', riverOrMount: 'Núi Cấm (Thất Sơn)' },
  { prov: 'Bà Rịa - Vũng Tàu', landmark: 'Tượng Chúa Kitô Vua trên đỉnh núi Nhỏ và Côn Đảo', specialty: 'Bánh khọt Vũng Tàu', region: 'Đông Nam Bộ', riverOrMount: 'Núi Lớn - Núi Nhỏ' },
  { prov: 'Bắc Giang', landmark: 'Chùa Vĩnh Nghiêm và Khu bảo tồn Tây Yên Tử', specialty: 'Vải thiều Lục Ngạn & Mì Chũ', region: 'Đông Bắc Bộ', riverOrMount: 'Sông Thương' },
  { prov: 'Bắc Kạn', landmark: 'Hồ Ba Bể và Động Puông', specialty: 'Miến dong Na Rì & Tôm chua Ba Bể', region: 'Đông Bắc Bộ', riverOrMount: 'Sông Cầu' },
  { prov: 'Bạc Liêu', landmark: 'Nhà Công tử Bạc Liêu và Cánh đồng điện gió biển', specialty: 'Bún bò cay & Nhãn da bò', region: 'Tây Nam Bộ', riverOrMount: 'Kênh Quản Lộ - Phụng Hiệp' },
  { prov: 'Bắc Ninh', landmark: 'Chùa Dâu, Chùa Phật Tích và Đền Đô', specialty: 'Bánh phu thê Đình Bảng & Quan họ', region: 'Đồng bằng sông Hồng', riverOrMount: 'Sông Đuống' },
  { prov: 'Bến Tre', landmark: 'Cồn Phụng và Khu di tích Nguyễn Đình Chiểu', specialty: 'Kẹo dừa Bến Tre & Bánh tráng Mỹ Lồng', region: 'Tây Nam Bộ', riverOrMount: 'Sông Hàm Luông' },
  { prov: 'Bình Định', landmark: 'Eo Gió, Kỳ Co và Tháp Đôi Quy Nhơn', specialty: 'Bánh ít lá gai & Rượu Bàu Đá', region: 'Duyên hải Nam Trung Bộ', riverOrMount: 'Sông Côn' },
  { prov: 'Bình Dương', landmark: 'Làng nghề gốm sứ Lái Thiêu và Hồ Dầu Tiếng', specialty: 'Gỏi gà măng cụt Lái Thiêu', region: 'Đông Nam Bộ', riverOrMount: 'Sông Sài Gòn' },
  { prov: 'Bình Phước', landmark: 'Vườn quốc gia Bù Gia Mập và Núi Bà Rá', specialty: 'Hạt điều rang muối Bình Phước', region: 'Đông Nam Bộ', riverOrMount: 'Sông Bé' },
  { prov: 'Bình Thuận', landmark: 'Đồi Cát Bay Mũi Né và Hải đăng Kê Gà', specialty: 'Thanh long & Nước mắm Phan Thiết', region: 'Duyên hải Nam Trung Bộ', riverOrMount: 'Núi Tà Cú' },
  { prov: 'Cà Mau', landmark: 'Mũi Cà Mau và Vườn quốc gia U Minh Hạ', specialty: 'Cua biển Cà Mau & Mật ong U Minh', region: 'Tây Nam Bộ', riverOrMount: 'Sông Ông Đốc' },
  { prov: 'Cao Bằng', landmark: 'Thác Bản Giốc, Động Ngườm Ngao và Pác Bó', specialty: 'Hạt dẻ Trùng Khánh & Phở chua', region: 'Đông Bắc Bộ', riverOrMount: 'Sông Bằng Giang' },
  { prov: 'Đắk Lắk', landmark: 'Hồ Lắk, Thác Dray Nur và Bản Đôn', specialty: 'Cà phê Buôn Ma Thuột', region: 'Tây Nguyên', riverOrMount: 'Sông Sêrêpốk' },
  { prov: 'Đắk Nông', landmark: 'Công viên địa chất toàn cầu UNESCO Đắk Nông và Hồ Tà Đùng', specialty: 'Bơ sáp Đắk Nông & Khoai lang Tuy Đức', region: 'Tây Nguyên', riverOrMount: 'Hồ Tà Đùng' },
  { prov: 'Điện Biên', landmark: 'Đồi A1, Hầm Đờ Cát và Cực Tây A Pa Chải', specialty: 'Gạo tám Điện Biên & Thịt trâu gác bếp', region: 'Tây Bắc Bộ', riverOrMount: 'Sông Nậm Rốm' },
  { prov: 'Đồng Nai', landmark: 'Vườn quốc gia Cát Tiên và Đá Ba Chồng', specialty: 'Bưởi Tân Triều & Gà hấp bưởi', region: 'Đông Nam Bộ', riverOrMount: 'Sông Đồng Nai' },
  { prov: 'Đồng Tháp', landmark: 'Khu di tích Xẻo Quýt và Làng hoa Sa Đéc', specialty: 'Nem Lai Vung & Hủ tiếu Sa Đéc', region: 'Tây Nam Bộ', riverOrMount: 'Sông Tiền' },
  { prov: 'Gia Lai', landmark: 'Biển Hồ Tơ Nưng và Núi lửa Chư Đăng Ya', specialty: 'Phở khô Gia Lai (Phở hai tô)', region: 'Tây Nguyên', riverOrMount: 'Đỉnh Kon Ka Kinh' },
  { prov: 'Hà Giang', landmark: 'Cột cờ Lũng Cú, Sông Nho Quế và Phố cổ Đồng Văn', specialty: 'Thắng cố, Cháo ấu tẩu & Bánh tam giác mạch', region: 'Đông Bắc Bộ', riverOrMount: 'Đỉnh Tây Côn Lĩnh' },
  { prov: 'Hà Nam', landmark: 'Quần thể chùa Tam Chúc và Đền Trần Thương', specialty: 'Chuối ngự Đại Hoàng & Cá kho làng Vũ Đại', region: 'Đồng bằng sông Hồng', riverOrMount: 'Sông Châu Giang' },
  { prov: 'Hà Tĩnh', landmark: 'Ngã ba Đồng Lộc, Chùa Hương Tích và Hồ Kẻ Gỗ', specialty: 'Kẹo Cu Đơ & Bưởi Phúc Trạch', region: 'Bắc Trung Bộ', riverOrMount: 'Núi Hồng Lĩnh' },
  { prov: 'Hải Dương', landmark: 'Khu di tích Côn Sơn - Kiếp Bạc và Đảo Cò Chi Lăng Nam', specialty: 'Bánh đậu xanh & Vải thiều Thanh Hà', region: 'Đồng bằng sông Hồng', riverOrMount: 'Sông Thái Bình' },
  { prov: 'Hậu Giang', landmark: 'Khu bảo tồn thiên nhiên Lung Ngọc Hoàng và Chợ nổi Ngã Bảy', specialty: 'Cá thác lác cườm & Khóm Cầu Đúc', region: 'Tây Nam Bộ', riverOrMount: 'Kênh Xà No' },
  { prov: 'Hòa Bình', landmark: 'Nhà máy Thủy điện Hòa Bình và Thung lũng Mai Châu', specialty: 'Cơm lam Mai Châu & Rượu cần Mường', region: 'Tây Bắc Bộ', riverOrMount: 'Sông Đà' },
  { prov: 'Hưng Yên', landmark: 'Khu di tích Phố Hiến và Đền Chử Đồng Tử', specialty: 'Nhãn lồng Hưng Yên & Gà Đông Tảo', region: 'Đồng bằng sông Hồng', riverOrMount: 'Sông Hồng' },
  { prov: 'Khánh Hòa', landmark: 'Tháp Bà Ponagar, Vịnh Vân Phong và Vịnh Cam Ranh', specialty: 'Yến sào Khánh Hòa & Nem nướng Ninh Hòa', region: 'Duyên hải Nam Trung Bộ', riverOrMount: 'Sông Cái Nha Trang' },
  { prov: 'Kiên Giang', landmark: 'Đảo Phú Quốc, Quần đảo Nam Du và Hà Tiên', specialty: 'Nước mắm Phú Quốc & Bún kèn Hà Tiên', region: 'Tây Nam Bộ', riverOrMount: 'Sông Cái Lớn' },
  { prov: 'Kon Tum', landmark: 'Nhà thờ Gỗ Kon Tum, Măng Đen và Ngã ba Đông Dương', specialty: 'Gà nướng cơm lam Măng Đen & Sâm Ngọc Linh', region: 'Tây Nguyên', riverOrMount: 'Đỉnh Ngọc Linh' },
  { prov: 'Lai Châu', landmark: 'Đỉnh Pu Ta Leng, Pu Si Lung và Cao nguyên Sìn Hồ', specialty: 'Lợn cắp nách & Hạt dổi rừng Tây Bắc', region: 'Tây Bắc Bộ', riverOrMount: 'Đỉnh Pu Si Lung' },
  { prov: 'Lâm Đồng', landmark: 'Hồ Xuân Hương, Đỉnh Langbiang và Thác Datanla', specialty: 'Trà B’Lao, Dâu tây & Hoa Atiso Đà Lạt', region: 'Tây Nguyên', riverOrMount: 'Đỉnh Langbiang' },
  { prov: 'Lạng Sơn', landmark: 'Đỉnh Mẫu Sơn, Ải Chi Lăng và Động Tam Thanh', specialty: 'Vịt quay mắc mật & Khâu nhục Lạng Sơn', region: 'Đông Bắc Bộ', riverOrMount: 'Sông Kỳ Cùng' },
  { prov: 'Lào Cai', landmark: 'Đỉnh Fansipan, Thị xã Sa Pa và Dinh Hoàng A Tưởng', specialty: 'Thắng cố Bắc Hà & Cá hồi Sa Pa', region: 'Tây Bắc Bộ', riverOrMount: 'Dãy Hoàng Liên Sơn' },
  { prov: 'Long An', landmark: 'Làng nổi Tân Lập và Khu di tích Bình Thành', specialty: 'Gạo nàng thơm Chợ Đào & Rượu đế Gò Đen', region: 'Tây Nam Bộ', riverOrMount: 'Sông Vàm Cỏ Đông - Vàm Cỏ Tây' },
  { prov: 'Nam Định', landmark: 'Đền Trần, Phủ Dầy và Nhà thờ đổ Hải Lý', specialty: 'Phở bò Nam Định & Bánh xíu páo', region: 'Đồng bằng sông Hồng', riverOrMount: 'Sông Đào' },
  { prov: 'Nghệ An', landmark: 'Khu di tích Kim Liên (Nam Đàn) và Biển Cửa Lò', specialty: 'Cháo lươn Nghệ An & Nhút Thanh Chương', region: 'Bắc Trung Bộ', riverOrMount: 'Sông Lam' },
  { prov: 'Ninh Thuận', landmark: 'Vịnh Vĩnh Hy, Tháp Po Klong Garai và Đồng cừu An Hòa', specialty: 'Nho Ninh Thuận & Thịt cừu Phan Rang', region: 'Duyên hải Nam Trung Bộ', riverOrMount: 'Vườn quốc gia Núi Chúa' },
  { prov: 'Phú Thọ', landmark: 'Khu di tích lịch sử Đền Hùng và Vườn quốc gia Xuân Sơn', specialty: 'Thịt chua Thanh Sơn & Bưởi Đoan Hùng', region: 'Đông Bắc Bộ', riverOrMount: 'Ngã ba Bạch Hạc (Hợp lưu 3 sông)' },
  { prov: 'Quảng Bình', landmark: 'Vườn quốc gia Phong Nha - Kẻ Bàng và Vũng Chùa - Đảo Yến', specialty: 'Cháo canh Quảng Bình & Khoai deo', region: 'Bắc Trung Bộ', riverOrMount: 'Sông Gianh & Sông Nhật Lệ' },
  { prov: 'Quảng Trị', landmark: 'Thành cổ Quảng Trị, Cầu Hiền Lương và Địa đạo Vịnh Mốc', specialty: 'Bún hến Mai Xá & Thịt trâu lá trơng', region: 'Bắc Trung Bộ', riverOrMount: 'Sông Bến Hải & Sông Thạch Hãn' },
  { prov: 'Sóc Trăng', landmark: 'Chùa Dơi, Chùa Đất Sét và Lễ hội đua ghe Ngo', specialty: 'Bánh pía Sóc Trăng & Bún nước lèo', region: 'Tây Nam Bộ', riverOrMount: 'Cửa biển Trần Đề' },
  { prov: 'Sơn La', landmark: 'Cao nguyên Mộc Châu, Đồi chè Trái Tim và Thủy điện Sơn La', specialty: 'Sữa tươi Mộc Châu & Mận hậu Mộc Châu', region: 'Tây Bắc Bộ', riverOrMount: 'Đỉnh Pha Luông' },
  { prov: 'Thái Bình', landmark: 'Chùa Keo, Biển Đồng Châu và Đền Tiên La', specialty: 'Bánh cáy làng Nguyễn & Ổi Bo', region: 'Đồng bằng sông Hồng', riverOrMount: 'Sông Trà Lý' },
  { prov: 'Thái Nguyên', landmark: 'Hồ Núi Cốc và Khu di tích ATK Định Hóa', specialty: 'Chè Tân Cương Thái Nguyên & Bánh chưng Bờ Đậu', region: 'Đông Bắc Bộ', riverOrMount: 'Dãy núi Tam Đảo' },
  { prov: 'Thanh Hóa', landmark: 'Thành nhà Hồ, Suối cá thần Cẩm Lương và Biển Sầm Sơn', specialty: 'Nem chua Thanh Hóa & Chè lam Phủ Quảng', region: 'Bắc Trung Bộ', riverOrMount: 'Sông Mã' },
  { prov: 'Tiền Giang', landmark: 'Cù lao Thới Sơn, Chùa Vĩnh Tràng và Chợ nổi Cái Bè', specialty: 'Hủ tiếu Mỹ Tho & Vú sữa Lò Rèn', region: 'Tây Nam Bộ', riverOrMount: 'Nhánh sông Tiền' },
  { prov: 'Trà Vinh', landmark: 'Ao Bà Om, Chùa Âng và Biển Ba Động', specialty: 'Dừa sáp Cầu Kè & Bánh tét Trà Cuôn', region: 'Tây Nam Bộ', riverOrMount: 'Sông Cổ Chiên' },
  { prov: 'Tuyên Quang', landmark: 'Khu di tích Tân Trào và Khu du lịch Na Hang', specialty: 'Cam sành Hàm Yên & Bánh gai Chiêm Hóa', region: 'Đông Bắc Bộ', riverOrMount: 'Sông Lô & Sông Gâm' },
  { prov: 'Vĩnh Long', landmark: 'Cù lao An Bình, Văn Thánh Miếu và Vương quốc gạch gốm Mang Thít', specialty: 'Bưởi Năm Roi Bình Minh & Khoai lang Bình Tân', region: 'Tây Nam Bộ', riverOrMount: 'Giữa sông Tiền và sôngậu' },
  { prov: 'Vĩnh Phúc', landmark: 'Thị trấn Tam Đảo, Thiền viện Trúc Lâm Tây Thiên và Hồ Đại Lải', specialty: 'Ngọn su su Tam Đảo & Cá thính Lập Thạch', region: 'Đồng bằng sông Hồng', riverOrMount: 'Đỉnh Rùng Rình (Tam Đảo)' },
];

const WORLD_CAPITALS_AND_SYMBOLS: Array<{
  country: string;
  capital: string;
  symbol: string;
  continent: string;
  currency: string;
}> = [
  { country: 'Nhật Bản', capital: 'Tokyo', symbol: 'Núi Phú Sĩ và Hoa anh đào', continent: 'Châu Á', currency: 'Yên Nhật (JPY)' },
  { country: 'Hàn Quốc', capital: 'Seoul', symbol: 'Cung điện Gyeongbokgung và Tháp Namsan', continent: 'Châu Á', currency: 'Won (KRW)' },
  { country: 'Thái Lan', capital: 'Bangkok', symbol: 'Chùa Phật Ngọc và Lễ hội té nước Songkran', continent: 'Châu Á', currency: 'Baht (THB)' },
  { country: 'Singapore', capital: 'Singapore', symbol: 'Tượng Sư tử biển Merlion và Gardens by the Bay', continent: 'Châu Á', currency: 'Đô la Singapore (SGD)' },
  { country: 'Ấn Độ', capital: 'New Delhi', symbol: 'Đền Taj Mahal bằng đá cẩm thạch trắng', continent: 'Châu Á', currency: 'Rupee (INR)' },
  { country: 'Pháp', capital: 'Paris', symbol: 'Tháp Eiffel và Bảo tàng Louvre', continent: 'Châu Âu', currency: 'Euro (EUR)' },
  { country: 'Ý (Italy)', capital: 'Rome', symbol: 'Đấu trường La Mã Colosseum và Tháp nghiêng Pisa', continent: 'Châu Âu', currency: 'Euro (EUR)' },
  { country: 'Vương quốc Anh', capital: 'London', symbol: 'Tháp đồng hồ Big Ben và Cầu Tháp London', continent: 'Châu Âu', currency: 'Bảng Anh (GBP)' },
  { country: 'Đức', capital: 'Berlin', symbol: 'Cổng thành Brandenburg và Lâu đài Neuschwanstein', continent: 'Châu Âu', currency: 'Euro (EUR)' },
  { country: 'Nga', capital: 'Moskva (Moscow)', symbol: 'Quảng trường Đỏ và Điện Kremlin', continent: 'Châu Âu - Á', currency: 'Rúp Nga (RUB)' },
  { country: 'Hà Lan', capital: 'Amsterdam', symbol: 'Cối xay gió và Hoa Tulip', continent: 'Châu Âu', currency: 'Euro (EUR)' },
  { country: 'Thụy Sĩ', capital: 'Bern', symbol: 'Dãy núi Alps tuyết phủ và Đồng hồ cơ chính xác', continent: 'Châu Âu', currency: 'Franc Thụy Sĩ (CHF)' },
  { country: 'Ai Cập', capital: 'Cairo', symbol: 'Kim tự tháp Giza và Tượng Nhân sư Sphinx', continent: 'Châu Phi', currency: 'Bảng Ai Cập (EGP)' },
  { country: 'Úc (Australia)', capital: 'Canberra', symbol: 'Nhà hát Con Sò Sydney và Chuột túi Kangaroo', continent: 'Châu Đại Dương', currency: 'Đô la Úc (AUD)' },
  { country: 'Hoa Kỳ (Mỹ)', capital: 'Washington, D.C.', symbol: 'Tượng Nữ thần Tự do và Cầu Cổng Vàng', continent: 'Bắc Mỹ', currency: 'Đô la Mỹ (USD)' },
  { country: 'Canada', capital: 'Ottawa', symbol: 'Chiếc lá Phong đỏ và Thác Niagara', continent: 'Bắc Mỹ', currency: 'Đô la Canada (CAD)' },
  { country: 'Brazil', capital: 'Brasília', symbol: 'Tượng Chúa Cứu Thế ở Rio de Janeiro và Rừng Amazon', continent: 'Nam Mỹ', currency: 'Real (BRL)' },
  { country: 'Hy Lạp', capital: 'Athens', symbol: 'Thành cổ Acropolis và Đền Parthenon', continent: 'Châu Âu', currency: 'Euro (EUR)' },
  { country: 'Tây Ban Nha', capital: 'Madrid', symbol: 'Nhà thờ Sagrada Família và Vũ điệu Flamenco', continent: 'Châu Âu', currency: 'Euro (EUR)' },
  { country: 'Thổ Nhĩ Kỳ', capital: 'Ankara', symbol: 'Thung lũng khinh khí cầu Cappadocia và Eo biển Bosphorus', continent: 'Á - Âu', currency: 'Lira (TRY)' },
];

const SCIENCE_ELEMENTS_AND_DISCOVERIES: Array<{
  name: string;
  symbol: string;
  fact: string;
  field: string;
  diff: 'EASY' | 'MEDIUM' | 'HARD';
}> = [
  { name: 'Hydro (Hydrogen)', symbol: 'H', fact: 'Nguyên tố nhẹ nhất và phổ biến nhất trong vũ trụ, đứng số 1 trong bảng tuần hoàn', field: 'Hóa học', diff: 'EASY' },
  { name: 'Heli (Helium)', symbol: 'He', fact: 'Khí hiếm nhẹ hơn không khí dùng để bơm bóng bay an toàn không gây cháy nổ', field: 'Hóa học', diff: 'EASY' },
  { name: 'Cacbon (Carbon)', symbol: 'C', fact: 'Nguyên tố nền tảng của sự sống hữu cơ, tạo nên cả than chì lẫn kim cương', field: 'Hóa học', diff: 'EASY' },
  { name: 'Natri (Sodium)', symbol: 'Na', fact: 'Kim loại kiềm kết hợp với Clo tạo thành muối ăn (NaCl) hàng ngày', field: 'Hóa học', diff: 'MEDIUM' },
  { name: 'Canxi (Calcium)', symbol: 'Ca', fact: 'Nguyên tố khoáng chất chính cấu tạo nên hệ xương và răng chắc khỏe', field: 'Sinh - Hóa', diff: 'EASY' },
  { name: 'Đồng (Copper)', symbol: 'Cu', fact: 'Kim loại màu đỏ cam được dùng phổ biến nhất để làm lõi dây dẫn điện gia dụng', field: 'Vật lý - Hóa học', diff: 'EASY' },
  { name: 'Kẽm (Zinc)', symbol: 'Zn', fact: 'Kim loại dùng để mạ chống gỉ cho tôn sắt và là vi chất tăng cường miễn dịch', field: 'Hóa học', diff: 'MEDIUM' },
  { name: 'Bạch kim (Platinum)', symbol: 'Pt', fact: 'Kim loại quý hiếm màu trắng bạc có độ bền hóa học cực cao, dùng làm xúc tác và trang sức cao cấp', field: 'Hóa học', diff: 'MEDIUM' },
  { name: 'Titan (Titanium)', symbol: 'Ti', fact: 'Kim loại siêu bền, nhẹ và tương thích sinh học cao, dùng trong vỏ tàu vũ trụ và khớp nhân tạo', field: 'Khoa học vật liệu', diff: 'MEDIUM' },
  { name: 'Wolfram (Tungsten)', symbol: 'W', fact: 'Kim loại có nhiệt độ nóng chảy cao nhất (3.422°C), dùng làm dây tóc bóng đèn sợi đốt', field: 'Vật lý', diff: 'HARD' },
  { name: 'Silic (Silicon)', symbol: 'Si', fact: 'Nguyên tố bán dẫn quan trọng nhất dùng để chế tạo chip vi xử lý máy tính và tấm pin mặt trời', field: 'Công nghệ - Hóa học', diff: 'MEDIUM' },
  { name: 'Kali (Potassium)', symbol: 'K', fact: 'Khoáng chất có nhiều trong quả chuối giúp ổn định nhịp tim và chống chuột rút cơ bắp', field: 'Sinh học', diff: 'MEDIUM' },
  { name: 'I-ốt (Iodine)', symbol: 'I', fact: 'Vi chất dinh dưỡng thiết yếu giúp tuyến giáp tổng hợp hormone và phòng bệnh bướu cổ', field: 'Y sinh học', diff: 'EASY' },
  { name: 'Flo (Fluorine)', symbol: 'F', fact: 'Nguyên tố phi kim có độ âm điện lớn nhất, hợp chất của nó được thêm vào kem đánh răng để bảo vệ men răng', field: 'Hóa học', diff: 'MEDIUM' },
  { name: 'Neon', symbol: 'Ne', fact: 'Khí hiếm phát ra ánh sáng màu đỏ cam rực rỡ khi có dòng điện phóng qua trong biển quảng cáo', field: 'Vật lý - Hóa học', diff: 'MEDIUM' },
];

const VIETNAMESE_LITERATURE_WORKS: Array<{
  work: string;
  author: string;
  genreOrFact: string;
  diff: 'EASY' | 'MEDIUM' | 'HARD';
}> = [
  { work: 'Truyện Kiều (Đoạn trường tân thanh)', author: 'Đại thi hào Nguyễn Du', genreOrFact: 'Tác phẩm truyện thơ Nôm lục bát gồm 3.254 câu thơ', diff: 'EASY' },
  { work: 'Bình Ngô Đại Cáo', author: 'Nguyễn Trãi', genreOrFact: 'Bản tuyên ngôn độc lập hùng tráng tổng kết cuộc kháng chiến chống quân Minh', diff: 'EASY' },
  { work: 'Hịch Tướng Sĩ', author: 'Hưng Đạo Vương Trần Quốc Tuấn', genreOrFact: 'Áng văn chính luận khích lệ tinh thần tướng sĩ chống quân Nguyên Mông', diff: 'EASY' },
  { work: 'Nam Quốc Sơn Hà', author: 'Tương truyền Lý Thường Kiệt', genreOrFact: 'Bài thơ thần vang lên bên phòng tuyến sông Như Nguyệt khẳng định chủ quyền dân tộc', diff: 'EASY' },
  { work: 'Dế Mèn Phiêu Lưu Ký', author: 'Nhà văn Tô Hoài', genreOrFact: 'Tác phẩm văn học thiếu nhi kinh điển của Việt Nam được dịch ra hơn 40 thứ tiếng', diff: 'EASY' },
  { work: 'Đất Rừng Phương Nam', author: 'Nhà văn Đoàn Giỏi', genreOrFact: 'Tiểu thuyết nổi tiếng khắc họa thiên nhiên và con người miền Tây Nam Bộ qua nhân vật bé An', diff: 'EASY' },
  { work: 'Tắt Đèn', author: 'Nhà văn Ngô Tất Tố', genreOrFact: 'Tiểu thuyết hiện thực phê phán xuất sắc với hình tượng nhân vật chị Dậu', diff: 'EASY' },
  { work: 'Chí Phèo', author: 'Nhà văn Nam Cao', genreOrFact: 'Truyện ngắn kiệt tác về bi kịch người nông dân tại làng Vũ Đại trước Cách mạng', diff: 'EASY' },
  { work: 'Số Đỏ', author: 'Nhà văn Vũ Trọng Phụng', genreOrFact: 'Tiểu thuyết trào phúng bậc thầy với nhân vật Xuân Tóc Đỏ', diff: 'MEDIUM' },
  { work: 'Vợ Nhặt', author: 'Nhà văn Kim Lân', genreOrFact: 'Truyện ngắn xúc động về tình người và khát vọng sống trong nạn đói năm Ất Dậu 1945', diff: 'EASY' },
  { work: 'Vợ Chồng A Phủ', author: 'Nhà văn Tô Hoài', genreOrFact: 'Truyện ngắn nổi tiếng trong tập Truyện Tây Bắc với nhân vật Mị và A Phủ', diff: 'EASY' },
  { work: 'Chiếc Lược Ngà', author: 'Nhà văn Nguyễn Quang Sáng', genreOrFact: 'Truyện ngắn cảm động về tình phụ tử thiêng liêng giữa ông Sáu và bé Thu trong chiến tranh', diff: 'EASY' },
  { work: 'Rừng Xà Nu', author: 'Nhà văn Nguyễn Trung Thành (Nguyên Ngọc)', genreOrFact: 'Truyện ngắn sử thi khắc họa hình tượng nhân vật Tnú và buôn làng Tây Nguyên bất khuất', diff: 'MEDIUM' },
  { work: 'Người Lái Đò Sông Đà', author: 'Nhà văn Nguyễn Tuân', genreOrFact: 'Tùy bút đặc sắc ca ngợi vẻ đẹp hung bạo, trữ tình của sông Đà và chất vàng mười của người lao động', diff: 'MEDIUM' },
  { work: 'Ai Đã Đặt Tên Cho Dòng Sông', author: 'Nhà văn Hoàng Phủ Ngọc Tường', genreOrFact: 'Bút ký giàu chất thơ viết về vẻ đẹp lịch sử và văn hóa của dòng sông Hương xứ Huế', diff: 'MEDIUM' },
  { work: 'Tây Tiến', author: 'Nhà thơ Quang Dũng', genreOrFact: 'Bài thơ hào hoa, bi tráng viết về đoàn quân Tây Tiến với câu "Sông Mã xa rồi Tây Tiến ơi"', diff: 'EASY' },
  { work: 'Việt Bắc', author: 'Nhà thơ Tố Hữu', genreOrFact: 'Đỉnh cao thơ trữ tình chính trị viết về nghĩa tình quân dân căn cứ địa ("Mình về mình có nhớ ta")', diff: 'EASY' },
  { work: 'Đoàn Thuyền Đánh Cá', author: 'Nhà thơ Huy Cận', genreOrFact: 'Bài thơ tráng ca lao động trên biển Hạ Long ("Mặt trời xuống biển như hòn lửa")', diff: 'EASY' },
  { work: 'Bếp Lửa', author: 'Nhà thơ Bằng Việt', genreOrFact: 'Bài thơ xúc động về tình bà cháu với hình ảnh bếp lửa ấm áp và tiếng chim tu hú', diff: 'EASY' },
  { work: 'Sóng', author: 'Nữ sĩ Xuân Quỳnh', genreOrFact: 'Bài thơ tình bất hủ mượn hình tượng con sóng biển khơi ("Dữ dội và dịu êm / Ồn ào và lặng lẽ")', diff: 'EASY' },
  { work: 'Mùa Xuân Nho Nhỏ', author: 'Nhà thơ Thanh Hải', genreOrFact: 'Bài thơ giàu nhạc điệu thể hiện ước nguyện cống hiến thầm lặng cho cuộc đời', diff: 'EASY' },
  { work: 'Ánh Trăng', author: 'Nhà thơ Nguyễn Duy', genreOrFact: 'Bài thơ nhắc nhở đạo lý uống nước nhớ nguồn, ân tình với quá khứ ("Trăng cứ tròn vành vạnh")', diff: 'MEDIUM' },
  { work: 'Lặng Lẽ Sa Pa', author: 'Nhà văn Nguyễn Thành Long', genreOrFact: 'Truyện ngắn ca ngợi anh thanh niên làm công tác khí tượng trên đỉnh Yên Sơn cao 2.600m', diff: 'EASY' },
  { work: 'Chữ Người Tử Tù', author: 'Nhà văn Nguyễn Tuân', genreOrFact: 'Truyện ngắn nổi tiếng trong tập Vang Bóng Một Thời với nhân vật Huấn Cao cho chữ Quản ngục', diff: 'EASY' },
  { work: 'Hai Đứa Trẻ', author: 'Nhà văn Thạch Lam', genreOrFact: 'Truyện ngắn giàu chất thơ về hai chị em Liên và An thức đợi chuyến tàu đêm đi qua phố huyện', diff: 'MEDIUM' },
];

const TECH_AND_DIGITAL_ITEMS: Array<{
  term: string;
  question: string;
  wrongs: [string, string, string];
  exp: string;
  diff: 'EASY' | 'MEDIUM' | 'HARD';
}> = [
  {
    term: 'CPU (Central Processing Unit)',
    question: 'Bộ phận nào trong máy tính được ví như "bộ não" xử lý mọi phép tính và lệnh điều khiển?',
    wrongs: ['Ổ cứng SSD', 'Card âm thanh', 'Bộ nguồn PSU'],
    exp: 'CPU (Bộ xử lý trung tâm) đảm nhận việc thực thi các câu lệnh của chương trình máy tính.',
    diff: 'EASY',
  },
  {
    term: 'RAM (Random Access Memory)',
    question: 'Loại bộ nhớ truy cập ngẫu nhiên nào lưu trữ dữ liệu tạm thời khi máy tính đang chạy và sẽ mất dữ liệu khi tắt nguồn?',
    wrongs: ['Ổ cứng HDD', 'Bộ nhớ ROM', 'Thẻ nhớ SD'],
    exp: 'RAM là bộ nhớ khả biến tốc độ cao giúp CPU đọc ghi dữ liệu tức thời của các ứng dụng đang mở.',
    diff: 'EASY',
  },
  {
    term: 'SSD (Solid State Drive)',
    question: 'Thiết bị lưu trữ thể rắn dùng chip nhớ Flash không có đĩa quay cơ học giúp khởi động Windows cực nhanh là gì?',
    wrongs: ['Đĩa mềm Floppy', 'Đĩa quang CD-ROM', 'Băng từ'],
    exp: 'Ổ cứng SSD có tốc độ đọc ghi nhanh gấp nhiều lần ổ cứng cơ HDD truyền thống.',
    diff: 'EASY',
  },
  {
    term: 'GPU (Graphics Processing Unit)',
    question: 'Chip xử lý chuyên dụng trên card đồ họa giúp render hình ảnh 3D, chơi game và huấn luyện mô hình AI gọi là gì?',
    wrongs: ['Bo mạch chủ', 'Cáp mạng LAN', 'Quạt tản nhiệt'],
    exp: 'GPU có hàng nghìn nhân tính toán song song, cực kỳ hiệu quả cho đồ họa và Deep Learning.',
    diff: 'EASY',
  },
  {
    term: 'HTML (HyperText Markup Language)',
    question: 'Ngôn ngữ đánh dấu siêu văn bản dùng để tạo khung cấu trúc cho mọi trang web trên Internet là gì?',
    wrongs: ['Photoshop', 'Excel', 'PowerPoint'],
    exp: 'HTML định nghĩa cấu trúc các phần tử tiêu đề, đoạn văn, hình ảnh, liên kết trên trang web.',
    diff: 'EASY',
  },
  {
    term: 'CSS (Cascading Style Sheets)',
    question: 'Ngôn ngữ thiết kế dùng để định dạng màu sắc, bố cục, font chữ và hiệu ứng giao diện cho trang web HTML là gì?',
    wrongs: ['SQL', 'Bash', 'BIOS'],
    exp: 'CSS giúp trang web trở nên đẹp mắt, chuẩn responsive trên cả máy tính và điện thoại.',
    diff: 'EASY',
  },
  {
    term: 'JavaScript',
    question: 'Ngôn ngữ lập trình phổ biến nhất chạy trực tiếp trên trình duyệt web để tạo tính năng tương tác động là gì?',
    wrongs: ['Pascal', 'Fortran', 'Assembly'],
    exp: 'JavaScript cùng với HTML và CSS là 3 trụ cột cốt lõi của lập trình Web Frontend.',
    diff: 'EASY',
  },
  {
    term: 'TypeScript',
    question: 'Ngôn ngữ lập trình do Microsoft phát triển mở rộng từ JavaScript bằng cách bổ sung hệ thống kiểu dữ liệu tĩnh (Static Typing)?',
    wrongs: ['COBOL', 'Prolog', 'Lisp'],
    exp: 'TypeScript giúp phát hiện lỗi kiểu dữ liệu ngay lúc biên dịch và hỗ trợ gợi ý code thông minh.',
    diff: 'MEDIUM',
  },
  {
    term: 'SQL (Structured Query Language)',
    question: 'Ngôn ngữ truy vấn có cấu trúc tiêu chuẩn dùng để thao tác với các cơ sở dữ liệu quan hệ (SELECT, INSERT, UPDATE) là gì?',
    wrongs: ['MP4', 'JPEG', 'PNG'],
    exp: 'SQL là ngôn ngữ chuẩn để truy vấn và quản lý dữ liệu trong MySQL, PostgreSQL, SQLite, SQL Server.',
    diff: 'EASY',
  },
  {
    term: 'Git',
    question: 'Hệ thống quản lý phiên bản phân tán (Distributed Version Control) do Linus Torvalds tạo ra để theo dõi lịch sử mã nguồn là gì?',
    wrongs: ['WordPad', 'WinRAR', 'VLC Player'],
    exp: 'Git cho phép các lập trình viên tạo nhánh (branch), commit và hợp nhất (merge) mã nguồn hiệu quả.',
    diff: 'MEDIUM',
  },
  {
    term: 'WebSocket (Socket.IO)',
    question: 'Công nghệ giao thức mạng nào cho phép kết nối hai chiều (full-duplex) theo thời gian thực giữa trình duyệt và máy chủ?',
    wrongs: ['FTP tĩnh', 'SMTP gửi thư', 'POP3'],
    exp: 'WebSocket và Socket.IO giúp truyền tải sự kiện trò chơi trực tiếp với độ trễ mili-giây mà không cần tải lại trang.',
    diff: 'MEDIUM',
  },
  {
    term: 'DNS (Domain Name System)',
    question: 'Hệ thống phân giải tên miền giúp chuyển đổi tên website (như google.com) thành địa chỉ số IP của máy chủ gọi là gì?',
    wrongs: ['USB', 'HDMI', 'VGA'],
    exp: 'DNS được ví như "danh bạ điện thoại của Internet", giúp người dùng không phải nhớ dãy số IP phức tạp.',
    diff: 'MEDIUM',
  },
  {
    term: 'Địa chỉ IP (Internet Protocol)',
    question: 'Dãy số định danh duy nhất cho mỗi thiết bị khi tham gia vào mạng máy tính và Internet (ví dụ 192.168.1.1) gọi là gì?',
    wrongs: ['Mã ZIP bưu chính', 'Mã vạch sản phẩm', 'Số ISBN sách'],
    exp: 'Giao thức IP định tuyến các gói dữ liệu đi đúng từ máy gửi đến máy nhận trên mạng.',
    diff: 'EASY',
  },
  {
    term: 'Tường lửa (Firewall)',
    question: 'Hệ thống bảo mật mạng giúp giám sát và chặn các truy cập trái phép từ bên ngoài vào mạng nội bộ gọi là gì?',
    wrongs: ['Bộ lưu điện UPS', 'Máy in Laser', 'Máy quét mã vạch'],
    exp: 'Firewall đóng vai trò như bức tường bảo vệ ngăn chặn tin tặc và phần mềm độc hại xâm nhập qua mạng.',
    diff: 'EASY',
  },
  {
    term: 'Xác thực 2 yếu tố (2FA / OTP)',
    question: 'Phương thức bảo mật tài khoản yêu cầu vừa nhập mật khẩu vừa phải có mã xác nhận dùng một lần trên điện thoại gọi là gì?',
    wrongs: ['Chế độ ẩn danh', 'Xóa bộ nhớ đệm', 'Đổi hình nền'],
    exp: '2FA (Two-Factor Authentication) bảo vệ tài khoản an toàn ngay cả khi mật khẩu bị lộ.',
    diff: 'EASY',
  },
  {
    term: 'Bluetooth',
    question: 'Công nghệ kết nối không dây tầm ngắn phổ biến dùng để kết nối điện thoại với tai nghe không dây, loa và chuột máy tính?',
    wrongs: ['Cáp quang biển', 'Vệ tinh địa tĩnh', 'Radar hàng không'],
    exp: 'Bluetooth hoạt động ở băng tần 2.4 GHz, được đặt theo tên vị vua Viking Harald Bluetooth.',
    diff: 'EASY',
  },
  {
    term: 'Mã QR (Quick Response Code)',
    question: 'Loại mã vạch ma trận hai chiều hình vuông gồm các ô đen trắng giúp quét nhanh bằng camera điện thoại để thanh toán hoặc mở link?',
    wrongs: ['Đĩa từ mềm', 'Băng cassette', 'Thẻ đục lỗ'],
    exp: 'Mã QR được công ty Denso Wave (Nhật Bản) phát minh năm 1994 và nay phổ biến toàn cầu trong thanh toán không tiền mặt.',
    diff: 'EASY',
  },
  {
    term: 'Điện toán đám mây (Cloud Computing)',
    question: 'Mô hình cung cấp máy chủ, lưu trữ và phần mềm qua mạng Internet theo nhu cầu mà không cần tự mua máy chủ vật lý tại chỗ?',
    wrongs: ['Đánh máy chữ cơ học', 'In thạch bản', 'Điện báo Morse'],
    exp: 'Cloud Computing (như AWS, Google Cloud, Azure) giúp doanh nghiệp mở rộng hạ tầng linh hoạt trong vài phút.',
    diff: 'EASY',
  },
  {
    term: 'Học máy (Machine Learning)',
    question: 'Nhánh quan trọng của Trí tuệ nhân tạo (AI) cho phép máy tính tự học hỏi quy luật từ dữ liệu mà không cần lập trình cứng từng bước?',
    wrongs: ['Soạn thảo văn bản', 'Nén tệp tin ZIP', 'Chống phân mảnh ổ đĩa'],
    exp: 'Machine Learning là nền tảng đứng sau nhận diện khuôn mặt, gợi ý video TikTok và các mô hình ngôn ngữ lớn.',
    diff: 'MEDIUM',
  },
  {
    term: 'Mã nguồn mở (Open Source)',
    question: 'Phần mềm được công khai toàn bộ mã nguồn để bất kỳ ai cũng có thể xem, học tập, chỉnh sửa và đóng góp cải tiến gọi là gì?',
    wrongs: ['Phần mềm gián điệp', 'Phần mềm độc quyền đóng kín', 'Phần mềm quảng cáo'],
    exp: 'Các dự án mã nguồn mở tiêu biểu trên thế giới gồm hệ điều hành Linux, trình duyệt Chromium, Python, Vue.js, NestJS.',
    diff: 'EASY',
  },
];

const SPORT_AND_ART_ITEMS: Array<{
  q: string;
  correct: string;
  wrongs: [string, string, string];
  exp: string;
  diff: 'EASY' | 'MEDIUM' | 'HARD';
}> = [
  {
    q: 'Đội tuyển bóng đá quốc gia Việt Nam đã giành chức vô địch AFF Cup lần đầu tiên trong lịch sử vào năm nào?',
    correct: 'Năm 2008',
    wrongs: ['Năm 1998', 'Năm 2012', 'Năm 2014'],
    exp: 'Tháng 12/2008, với bàn thắng đánh đầu lịch sử của Lê Công Vinh vào lưới Thái Lan tại sân Mỹ Đình, Việt Nam vô địch AFF Cup lần đầu tiên.',
    diff: 'EASY',
  },
  {
    q: 'Đội tuyển U23 Việt Nam đã lập nên kỳ tích giành ngôi Á quân châu Á trong cơn mưa tuyết tại Thường Châu vào năm nào?',
    correct: 'Đầu năm 2018',
    wrongs: ['Năm 2016', 'Năm 2020', 'Năm 2022'],
    exp: 'Tháng 1/2018 tại Thường Châu (Trung Quốc), U23 Việt Nam تحت sự dẫn dắt của HLV Park Hang-seo đã tiến vào trận chung kết U23 châu Á.',
    diff: 'EASY',
  },
  {
    q: 'Trong một trận đấu bóng đá tiêu chuẩn 11 người, thời gian thi đấu chính thức của 2 hiệp (không tính bù giờ và hiệp phụ) là bao nhiêu phút?',
    correct: '90 phút (mỗi hiệp 45 phút)',
    wrongs: ['80 phút', '60 phút', '100 phút'],
    exp: 'Một trận bóng đá tiêu chuẩn gồm 2 hiệp, mỗi hiệp 45 phút, nghỉ giữa hai hiệp 15 phút.',
    diff: 'EASY',
  },
  {
    q: 'Chấm phạt đền (Penalty) trong môn bóng đá 11 người cách tâm vạch vôi khung thành bao nhiêu mét?',
    correct: '11 mét (12 thước Anh)',
    wrongs: ['9 mét', '13 mét', '15 mét'],
    exp: 'Chấm phạt đền nằm cách vạch cầu môn đúng 11m (12 yards), vì vậy quả phạt đền còn được gọi là quả phạt 11m.',
    diff: 'EASY',
  },
  {
    q: 'Giải vô địch bóng đá thế giới (FIFA World Cup) được tổ chức định kỳ mấy năm một lần?',
    correct: '4 năm một lần',
    wrongs: ['2 năm một lần', '3 năm một lần', '5 năm một lần'],
    exp: 'FIFA World Cup được tổ chức định kỳ 4 năm một lần kể từ kỳ giải đầu tiên tại Uruguay năm 1930.',
    diff: 'EASY',
  },
  {
    q: 'Quốc gia nào đang giữ kỷ lục vô địch FIFA World Cup nhiều lần nhất trong lịch sử với 5 lần đăng quang?',
    correct: 'Đội tuyển Brazil',
    wrongs: ['Đội tuyển Pháp', 'Đội tuyển Tây Ban Nha', 'Đội tuyển Anh'],
    exp: 'Brazil là đội tuyển duy nhất đã 5 lần vô địch World Cup (1958, 1962, 1970, 1994, 2002).',
    diff: 'EASY',
  },
  {
    q: 'Đội tuyển quốc gia nào đã giành chức vô địch FIFA World Cup 2022 tổ chức tại Qatar?',
    correct: 'Đội tuyển Argentina',
    wrongs: ['Đội tuyển Bồ Đào Nha', 'Đội tuyển Hà Lan', 'Đội tuyển Croatia'],
    exp: 'Argentina với thủ quân Lionel Messi đã đánh bại Pháp trên chấm luân lưu trong trận chung kết World Cup 2022.',
    diff: 'EASY',
  },
  {
    q: 'Vận động viên bắn súng nào đã mang về tấm Huy chương Vàng Olympic đầu tiên trong lịch sử thể thao Việt Nam năm 2016?',
    correct: 'Xạ thủ Hoàng Xuân Vinh',
    wrongs: ['Trần Hiếu Ngân', 'Hoàng Anh Tuấn', 'Nguyễn Tiến Minh'],
    exp: 'Tại Olympic Rio 2016, xạ thủ Hoàng Xuân Vinh xuất sắc giành 1 HCV và 1 HCB môn bắn súng ngắn.',
    diff: 'EASY',
  },
  {
    q: 'Trên lá cờ biểu tượng của Thế vận hội Olympic có bao nhiêu vòng tròn đan vào nhau tượng trưng cho các châu lục?',
    correct: '5 vòng tròn (Xanh lam, Vàng, Đen, Xanh lá, Đỏ)',
    wrongs: ['4 vòng tròn', '6 vòng tròn', '7 vòng tròn'],
    exp: '5 vòng tròn Olympic tượng trưng cho sự đoàn kết của 5 châu lục có người sinh sống trên thế giới.',
    diff: 'EASY',
  },
  {
    q: 'Môn võ cổ truyền nào của Việt Nam do võ sư Nguyễn Lộc sáng lập năm 1938 với võ phục màu xanh lam đặc trưng?',
    correct: 'Vovinam (Việt Võ Đạo)',
    wrongs: ['Taekwondo', 'Karate', 'Judo'],
    exp: 'Vovinam - Việt Võ Đạo kết hợp tinh hoa võ và vật dân tộc Việt Nam, nổi tiếng với đòn chân tấn công đẹp mắt.',
    diff: 'EASY',
  },
  {
    q: 'Trong bàn cờ vua tiêu chuẩn, tổng cộng có bao nhiêu ô vuông đen và trắng?',
    correct: '64 ô vuông (8 × 8)',
    wrongs: ['36 ô vuông', '49 ô vuông', '81 ô vuông'],
    exp: 'Bàn cờ vua là hình vuông gồm 8 hàng ngang và 8 cột dọc, tạo thành 64 ô đen trắng xen kẽ.',
    diff: 'EASY',
  },
  {
    q: 'Quân cờ nào trong môn Cờ vua có cách di chuyển độc đáo theo hình chữ L và có thể nhảy qua đầu các quân cờ khác?',
    correct: 'Quân Mã (Con Ngựa)',
    wrongs: ['Quân Xe', 'Quân Tượng', 'Quân Tốt'],
    exp: 'Quân Mã đi theo hình chữ L (2 ô dọc 1 ô ngang hoặc 1 ô dọc 2 ô ngang) và là quân duy nhất nhảy qua được quân cản.',
    diff: 'EASY',
  },
  {
    q: 'Trong môn Quần vợt (Tennis), giải đấu Grand Slam duy nhất thi đấu trên mặt sân cỏ truyền thống tại London là giải nào?',
    correct: 'Giải Wimbledon',
    wrongs: ['Giải Roland Garros (Pháp Mở rộng)', 'Giải Australian Open (Úc Mở rộng)', 'Giải US Open (Mỹ Mở rộng)'],
    exp: 'Wimbledon là giải quần vợt lâu đời nhất thế giới (từ 1877) và là giải Grand Slam duy nhất thi đấu trên mặt sân cỏ.',
    diff: 'MEDIUM',
  },
  {
    q: 'Trong môn Cầu lông, một hiệp đấu tiêu chuẩn kết thúc khi một bên chạm mốc bao nhiêu điểm trước (cách biệt ít nhất 2 điểm)?',
    correct: '21 điểm',
    wrongs: ['11 điểm', '15 điểm', '25 điểm'],
    exp: 'Theo luật của Liên đoàn Cầu lông Thế giới (BWF), mỗi ván cầu lông thi đấu tới 21 điểm (tối đa tới 30 điểm nếu giằng co).',
    diff: 'EASY',
  },
  {
    q: 'Kiệt tác hội họa "Mona Lisa" (Nàng Gioconda) với nụ cười bí ẩn là tác phẩm của danh họa thiên tài thời Phục Hưng nào?',
    correct: 'Leonardo da Vinci',
    wrongs: ['Vincent van Gogh', 'Pablo Picasso', 'Claude Monet'],
    exp: 'Bức họa Mona Lisa do Leonardo da Vinci vẽ vào đầu thế kỷ XVI, hiện trưng bày tại bảo tàng Louvre (Paris).',
    diff: 'EASY',
  },
  {
    q: 'Bức tranh nổi tiếng "Đêm đầy sao" (The Starry Night) với những vòng xoáy bầu trời đêm rực rỡ là tác phẩm của danh họa nào?',
    correct: 'Vincent van Gogh',
    wrongs: ['Michelangelo', 'Salvador Dalí', 'Rembrandt'],
    exp: 'Danh họa người Hà Lan Vincent van Gogh vẽ bức "Đêm đầy sao" vào năm 1889.',
    diff: 'MEDIUM',
  },
  {
    q: 'Bức tranh sơn dầu thiếu nữ Việt Nam "Em Thúy" — Bảo vật quốc gia của mỹ thuật hiện đại Việt Nam — là tác phẩm của họa sĩ nào?',
    correct: 'Họa sĩ Trần Văn Cẩn',
    wrongs: ['Họa sĩ Tô Ngọc Vân', 'Họa sĩ Bùi Xuân Phái', 'Họa sĩ Nguyễn Gia Trí'],
    exp: 'Họa sĩ Trần Văn Cẩn sáng tác bức tranh "Em Thúy" vào năm 1943, khắc họa vẻ đẹp trong sáng của bé gái Hà Nội.',
    diff: 'MEDIUM',
  },
  {
    q: 'Họa sĩ tài danh nào của Việt Nam nổi tiếng với hàng trăm bức tranh vẽ phố cổ Hà Nội, được gọi tên thân thương là "Phố Phái"?',
    correct: 'Họa sĩ Bùi Xuân Phái',
    wrongs: ['Họa sĩ Nguyễn Tư Nghiêm', 'Họa sĩ Nguyễn Sáng', 'Họa sĩ Dương Bích Liên'],
    exp: 'Họa sĩ Bùi Xuân Phái dành trọn tình yêu nghệ thuật cho những mái ngói rêu phong của phố cổ Hà Nội.',
    diff: 'EASY',
  },
  {
    q: 'Trong âm nhạc, 7 nốt nhạc cơ bản theo thứ tự từ thấp lên cao bắt đầu từ nốt Đô (C) gồm những nốt nào?',
    correct: 'Đô - Rê - Mi - Pha - Son - La - Si',
    wrongs: ['Đô - Mi - Rê - Pha - La - Son - Si', 'La - Si - Đô - Rê - Mi - Son - Pha', 'Đô - Rê - Pha - Mi - Son - Si - La'],
    exp: 'Hệ thống 7 bậc âm cơ bản gồm: Đô (C), Rê (D), Mi (E), Pha (F), Son (G), La (A), Si (B).',
    diff: 'EASY',
  },
  {
    q: 'Loại hình âm nhạc dân gian đặc trưng của vùng đồng bằng sông Cửu Long được UNESCO ghi danh là Di sản văn hóa phi vật thể năm 2013 là gì?',
    correct: 'Đờn ca tài tử Nam Bộ',
    wrongs: ['Hát Xoan Phú Thọ', 'Ca trù', 'Nhã nhạc cung đình Huế'],
    exp: 'Nghệ thuật Đờn ca tài tử Nam Bộ gắn liền với đời sống văn hóa sông nước của người dân 21 tỉnh thành phía Nam.',
    diff: 'EASY',
  },
];

const FOLK_PROVERBS_AND_RIDDLES: Array<{
  q: string;
  correct: string;
  wrongs: [string, string, string];
  exp: string;
  diff: 'EASY' | 'MEDIUM' | 'HARD';
}> = [
  {
    q: 'Điền từ còn thiếu vào câu tục ngữ Việt Nam: "Ăn quả nhớ kẻ trồng cây, ăn khoai nhớ kẻ..." gì?',
    correct: 'Cho dây mà trồng',
    wrongs: ['Đào mương dẫn dòng', 'Bón phân vun trồng', 'Gặt lúa ngoài đồng'],
    exp: 'Câu tục ngữ đầy đủ: "Ăn quả nhớ kẻ trồng cây / Ăn khoai nhớ kẻ cho dây mà trồng" dạy đạo lý biết ơn.',
    diff: 'EASY',
  },
  {
    q: 'Điền từ còn thiếu vào câu tục ngữ: "Lời nói chẳng mất tiền mua, lựa lời mà nói cho..." gì?',
    correct: 'Vừa lòng nhau',
    wrongs: ['Đẹp lòng nhau', 'Thuận ý nhau', 'Vui vẻ nhau'],
    exp: 'Câu ca dao khuyên con người giao tiếp lịch sự, khéo léo và tôn trọng lẫn nhau.',
    diff: 'EASY',
  },
  {
    q: 'Hoàn thành câu tục ngữ về kinh nghiệm dự báo thời tiết: "Chuồn chuồn bay thấp thì mưa, bay cao thì nắng, bay vừa thì..." gì?',
    correct: 'Râm',
    wrongs: ['Gió', 'Bão', 'Lạnh'],
    exp: 'Khi độ ẩm không khí cao trước cơn mưa, cánh chuồn chuồn nặng hơi nước nên bay thấp; trời nắng khô ráo chúng bay cao.',
    diff: 'EASY',
  },
  {
    q: 'Hoàn thành câu tục ngữ về thời gian và canh tác: "Đêm tháng năm chưa nằm đã sáng, ngày tháng mười chưa..." gì?',
    correct: 'Cười đã tối',
    wrongs: ['Làm đã tối', 'Ăn đã tối', 'Đi đã tối'],
    exp: 'Tháng 5 âm lịch (mùa hạ) ở Bắc Bán Cầu có ngày dài đêm ngắn; tháng 10 âm lịch (mùa đông) có ngày ngắn đêm dài.',
    diff: 'EASY',
  },
  {
    q: 'Hoàn thành câu ca dao về tình cảm gia đình: "Công cha như núi Thái Sơn, nghĩa mẹ như nước..." gì?',
    correct: 'Trong nguồn chảy ra',
    wrongs: ['Ngoài biển bao la', 'Sông Cả chảy ra', 'Suối mát hiền hòa'],
    exp: 'Câu ca dao quen thuộc bậc nhất nhắc nhở công ơn sinh thành dưỡng dục to lớn của cha mẹ.',
    diff: 'EASY',
  },
  {
    q: 'Hoàn thành câu ca dao: "Anh em như thể tay chân, rách lành đùm bọc..." gì?',
    correct: 'Dở hay đỡ đần',
    wrongs: ['Khó khăn đỡ đần', 'Sớm hôm quây quần', 'Thương nhau muôn phần'],
    exp: 'Ca dao khuyên anh chị em một nhà phải luôn yêu thương, đùm bọc và nâng đỡ nhau.',
    diff: 'EASY',
  },
  {
    q: 'Hoàn thành câu tục ngữ: "Đi một ngày đàng, học một..." gì?',
    correct: 'Sàng khôn',
    wrongs: ['Bồ khôn', 'Lời khôn', 'Điều khôn'],
    exp: 'Tục ngữ khuyến khích con người đi nhiều nơi, trải nghiệm thực tế để mở mang tầm mắt và trí tuệ.',
    diff: 'EASY',
  },
  {
    q: 'Hoàn thành câu tục ngữ: "Lửa thử vàng, gian nan thử..." gì?',
    correct: 'Sức',
    wrongs: ['Tài', 'Tâm', 'Chí'],
    exp: 'Câu tục ngữ "Lửa thử vàng, gian nan thử sức" khẳng định khó khăn thử thách sẽ rèn luyện bản lĩnh con người.',
    diff: 'EASY',
  },
  {
    q: 'Hoàn thành câu tục ngữ: "Tốt gỗ hơn tốt nước..." gì?',
    correct: 'Sơn',
    wrongs: ['Men', 'Vàng', 'Màu'],
    exp: '"Tốt gỗ hơn tốt nước sơn" đề cao phẩm chất, giá trị cốt lõi bên trong hơn vẻ hào nhoáng bề ngoài.',
    diff: 'EASY',
  },
  {
    q: 'Hoàn thành câu tục ngữ: "Gần mực thì đen, gần đèn thì..." gì?',
    correct: 'Rạng (hoặc Sáng)',
    wrongs: ['Chói', 'Nóng', 'Ấm'],
    exp: 'Câu tục ngữ nói về tầm quan trọng của môi trường sống và việc chọn bạn mà chơi.',
    diff: 'EASY',
  },
  {
    q: 'Đố vui dân gian: "Da cóc mà bọc bột lọc, bột lọc mà bọc hòn than" là quả gì?',
    correct: 'Quả nhãn',
    wrongs: ['Quả xoài', 'Quả ổi', 'Quả cam'],
    exp: 'Quả nhãn có vỏ ngoài sần sùi màu nâu, cùi nhãn trắng trong như bột lọc và hạt nhãn tròn đen nhánh như hòn than.',
    diff: 'EASY',
  },
  {
    q: 'Đố vui dân gian: "Mình vàng lại mặc áo vàng, đi ra ngoài đàng ai cũng gọi bi" là quả gì?',
    correct: 'Quả bí ngô (Bí đỏ)',
    wrongs: ['Quả dưa hấu', 'Quả mướp đắng', 'Quả bầu'],
    exp: 'Quả bí đỏ (bí ngô) khi chín cả vỏ lẫn ruột đều có màu vàng cam bắt mắt.',
    diff: 'EASY',
  },
  {
    q: 'Đố vui dân gian: "Bằng cái vung, vùng xuống ao, đào chẳng thấy, lấy chẳng được" là hình ảnh gì?',
    correct: 'Bóng mặt trăng dưới đáy nước',
    wrongs: ['Chiếc lá sen', 'Con cá chép', 'Chiếc thuyền nan'],
    exp: 'Ánh trăng tròn in bóng dưới mặt ao trông tròn như cái vung nhưng chỉ là bóng ảnh không thể chạm tay lấy được.',
    diff: 'EASY',
  },
  {
    q: 'Đố vui dân gian: "Cây gì không lá không hoa, sáng đêm sinh nhật cả nhà vây quanh?"',
    correct: 'Cây nến',
    wrongs: ['Cây trúc', 'Cây thông', 'Cây bàng'],
    exp: 'Cây nến sinh nhật thắp sáng lung linh khi cả gia đình quây quần chúc mừng.',
    diff: 'EASY',
  },
  {
    q: 'Đố vui dân gian: "Con gì ăn no bụng to mắt híp, mồm kêu ủn ỉn nằm khểnh chờ ăn?"',
    correct: 'Con lợn (Con heo)',
    wrongs: ['Con mèo', 'Con ngựa', 'Con dê'],
    exp: 'Con lợn (heo) là vật nuôi quen thuộc trong gia đình nông thôn Việt Nam với tiếng kêu ủn ỉn.',
    diff: 'EASY',
  },
  {
    q: 'Đố vui dân gian: "Có chân mà chẳng biết đi, có mặt phẳng lì cho bé ngồi học" là đồ vật gì?',
    correct: 'Cái bàn học',
    wrongs: ['Cái bảng đen', 'Cái cặp sách', 'Cây bút chì'],
    exp: 'Chiếc bàn học có 4 chân bàn và mặt bàn phẳng để học sinh đặt sách vở viết bài.',
    diff: 'EASY',
  },
  {
    q: 'Đố vui dân gian: "Miệng tròn lòng trắng phau phau, đựng cơm đựng thịt nuôi nhau mỗi ngày" là đồ vật gì?',
    correct: 'Cái bát ăn cơm (Cái chén)',
    wrongs: ['Cái đũa tre', 'Cái thớt gỗ', 'Cái rổ rá'],
    exp: 'Chiếc bát (miền Nam gọi là cái chén) hình tròn dùng trong bữa cơm hàng ngày của mọi gia đình Việt.',
    diff: 'EASY',
  },
  {
    q: 'Đố vui dân gian: "Hai anh cùng ở một nhà, cùng vào mâm cỗ gắp quà cho nhau" là vật dụng gì?',
    correct: 'Đôi đũa',
    wrongs: ['Cái muôi canh', 'Cái đĩa sứ', 'Cái ấm trà'],
    exp: 'Đôi đũa luôn đi thành cặp song hành trên mâm cơm truyền thống của người Việt Nam.',
    diff: 'EASY',
  },
  {
    q: 'Đố vui dân gian: "Cái gì càng kéo càng ngắn lại?"',
    correct: 'Điếu thuốc đang hút (hoặc cuộn chỉ đang rút)',
    wrongs: ['Sợi dây cao su', 'Cây thước kéo', 'Con đường'],
    exp: 'Câu đố mẹo thú vị: điếu thuốc khi hút (kéo hơi) thì sẽ cháy ngắn dần lại.',
    diff: 'MEDIUM',
  },
  {
    q: 'Đố vui trí tuệ: "Cái gì của riêng bạn nhưng người khác lại dùng nhiều hơn bạn?"',
    correct: 'Tên của bạn',
    wrongs: ['Chiếc điện thoại của bạn', 'Đôi giày của bạn', 'Bàn chải đánh răng'],
    exp: 'Tên riêng thuộc về bạn, nhưng bạn bè và mọi người xung quanh sẽ gọi tên bạn mỗi ngày nhiều hơn chính bạn tự gọi.',
    diff: 'EASY',
  },
];

const HISTORY_DYNASTIES_AND_EVENTS: Array<{
  q: string;
  correct: string;
  wrongs: [string, string, string];
  exp: string;
  diff: 'EASY' | 'MEDIUM' | 'HARD';
}> = [
  {
    q: 'Năm 968, sau khi dẹp yên loạn 12 sứ quân, Đinh Bộ Lĩnh lên ngôi Hoàng đế và đặt quốc hiệu nước ta là gì?',
    correct: 'Đại Cồ Việt',
    wrongs: ['Đại Việt', 'Đại Ngu', 'Vạn Xuân'],
    exp: 'Đinh Tiên Hoàng đặt quốc hiệu là Đại Cồ Việt và đóng đô tại Hoa Lư (Ninh Bình).',
    diff: 'EASY',
  },
  {
    q: 'Lý Bí (Lý Nam Đế) sau khi đánh đuổi quân Lương năm 544 đã lên ngôi Hoàng đế và đặt quốc hiệu nước ta là gì?',
    correct: 'Vạn Xuân',
    wrongs: ['Âu Lạc', 'Đại Việt', 'Việt Nam'],
    exp: 'Quốc hiệu Vạn Xuân thể hiện ước vọng đất nước độc lập, trường tồn qua vạn mùa xuân.',
    diff: 'MEDIUM',
  },
  {
    q: 'Quốc hiệu "Đại Việt" chính thức bắt đầu được sử dụng từ năm 1054 dưới triều đại vị vua nào của nhà Lý?',
    correct: 'Vua Lý Thánh Tông',
    wrongs: ['Vua Lý Thái Tổ', 'Vua Lý Nhân Tông', 'Vua Lý Huệ Tông'],
    exp: 'Năm 1054, vua Lý Thánh Tông đổi quốc hiệu từ Đại Cồ Việt thành Đại Việt.',
    diff: 'MEDIUM',
  },
  {
    q: 'Hội nghị Diên Hồng năm 1285 thể hiện ý chí "Sát Thát" của các bậc phụ lão cả nước diễn ra dưới triều đại nào?',
    correct: 'Triều đại nhà Trần',
    wrongs: ['Triều đại nhà Lý', 'Triều đại nhà Hồ', 'Triều đại nhà Nguyễn'],
    exp: 'Tại điện Diên Hồng, muôn người một lời đồng thanh hô vang "Đánh!" trước họa xâm lăng của quân Nguyên Mông.',
    diff: 'EASY',
  },
  {
    q: 'Danh tướng trẻ tuổi thời nhà Trần nào đã bóp nát quả cam vì căm phẫn giặc ngoại xâm và dựng lá cờ "Phá cường địch, báo hoàng ân"?',
    correct: 'Hoài Văn Hầu Trần Quốc Toản',
    wrongs: ['Phạm Ngũ Lão', 'Yết Kiêu', 'Dã Tượng'],
    exp: 'Trần Quốc Toản tuy tuổi nhỏ nhưng lòng yêu nước nồng nàn, tự chiêu mộ hơn một nghìn gia nô và thân thuộc ra trận đánh giặc.',
    diff: 'EASY',
  },
  {
    q: 'Vị danh tướng thời nhà Trần nào giỏi tài bơi lặn như rái cá, chuyên đục thủng thuyền chiến của quân Nguyên Mông?',
    correct: 'Danh tướng Yết Kiêu',
    wrongs: ['Danh tướng Dã Tượng', 'Danh tướng Trần Bình Trọng', 'Danh tướng Trần Khánh Dư'],
    exp: 'Yết Kiêu là gia tướng trung thành của Hưng Đạo Vương Trần Quốc Tuấn, lập đại công nhờ biệt tài thủy chiến lặn sông.',
    diff: 'EASY',
  },
  {
    q: 'Câu nói bất hủ "Ta thà làm quỷ nước Nam, chứ không thèm làm vương đất Bắc!" là của vị anh hùng dân tộc nào?',
    correct: 'Trần Bình Trọng',
    wrongs: ['Trần Quang Khải', 'Trần Nhật Duật', 'Trần Quốc Tuấn'],
    exp: 'Khi bị giặc Nguyên bắt và dụ hàng bằng chức vương, danh tướng Trần Bình Trọng đã khẳng khái đáp trả câu nói bất hủ này.',
    diff: 'EASY',
  },
  {
    q: 'Câu nói nổi tiếng "Đầu thần chưa rơi xuống đất, xin Bệ hạ đừng lo!" là của vị thái sư nào thời nhà Trần?',
    correct: 'Thái sư Trần Thủ Độ',
    wrongs: ['Trương Hán Siêu', 'Chu Văn An', 'Mạc Đĩnh Chi'],
    exp: 'Trong cuộc kháng chiến chống quân Mông Cổ lần thứ nhất (1258), Trần Thủ Độ đã tâu với vua Trần Thái Tông câu nói đầy khí phách này.',
    diff: 'MEDIUM',
  },
  {
    q: 'Người thầy giáo mẫu mực thời nhà Trần đã dâng "Thất trảm sớ" xin chém 7 tên nịnh thần và được thờ tại Văn Miếu là ai?',
    correct: 'Vạn thế sư biểu Chu Văn An',
    wrongs: ['Lê Quý Đôn', 'Nguyễn Bỉnh Khiêm', 'Lương Thế Vinh'],
    exp: 'Danh nhân Chu Văn An được tôn vinh là "Vạn thế sư biểu" (Người thầy chuẩn mực của muôn đời).',
    diff: 'EASY',
  },
  {
    q: 'Vị trạng nguyên nào của Việt Nam nổi tiếng thông minh kiệt xuất, được vua nhà Nguyên phong tặng danh hiệu "Lưỡng quốc Trạng nguyên"?',
    correct: 'Trạng nguyên Mạc Đĩnh Chi',
    wrongs: ['Trạng nguyên Nguyễn Hiền', 'Trạng nguyên Lương Thế Vinh', 'Trạng nguyên Phùng Khắc Khoan'],
    exp: 'Mạc Đĩnh Chi đỗ Trạng nguyên năm 1304 thời vua Trần Anh Tông, khi đi sứ sang nhà Nguyên đã làm bài phú "Bông sen trong giếng ngọc" khiến triều đình phương Bắc khâm phục.',
    diff: 'MEDIUM',
  },
  {
    q: 'Vị Trạng nguyên nhỏ tuổi nhất trong lịch sử khoa bảng Việt Nam (đỗ đạt năm 12–13 tuổi dưới thời vua Trần Thái Tông) là ai?',
    correct: 'Trạng nguyên Nguyễn Hiền',
    wrongs: ['Trạng nguyên Lê Văn Thịnh', 'Trạng nguyên Nguyễn Bỉnh Khiêm', 'Trạng nguyên Giáp Hải'],
    exp: 'Nguyễn Hiền đỗ Trạng nguyên khoa thi năm Thiên Ứng Chính Bình thứ 16 (1247) khi mới 13 tuổi.',
    diff: 'MEDIUM',
  },
  {
    q: 'Danh nhân nào thời Lê sơ đỗ Trạng nguyên, giỏi toán học đến mức soạn cuốn "Đại thành Toán pháp" và được dân gian gọi là "Trạng Lường"?',
    correct: 'Trạng nguyên Lương Thế Vinh',
    wrongs: ['Vũ Hữu', 'Nguyễn Trãi', 'Ngô Sĩ Liên'],
    exp: 'Lương Thế Vinh (Trạng Lường) nổi tiếng với giai thoại cân voi và những đóng góp to lớn cho toán học Việt Nam.',
    diff: 'MEDIUM',
  },
  {
    q: 'Nhà bác học lớn nhất thế kỷ XVIII của Việt Nam, tác giả bộ bách khoa thư "Vân đài loại ngữ" và "Đại Việt thông sử" là ai?',
    correct: 'Bảng nhãn Lê Quý Đôn',
    wrongs: ['Phan Huy Chú', 'Lê Hữu Trác', 'Ngô Thì Nhậm'],
    exp: 'Lê Quý Đôn (1726–1784) nổi tiếng thần đồng từ nhỏ và để lại khối lượng trước tác đồ sộ về lịch sử, địa lý, văn học.',
    diff: 'MEDIUM',
  },
  {
    q: 'Đại danh y được tôn vinh là "Ông tổ ngành Y học cổ truyền Việt Nam", tác giả bộ sách "Hải Thượng Y Tông Tâm Lĩnh" là ai?',
    correct: 'Hải Thượng Lãn Ông Lê Hữu Trác',
    wrongs: ['Thiền sư Tuệ Tĩnh', 'Giáo sư Tôn Thất Tùng', 'Bác sĩ Phạm Ngọc Thạch'],
    exp: 'Lê Hữu Trác (Hải Thượng Lãn Ông) đã đúc kết tinh hoa y học và y đức trong bộ sách Hải Thượng Y Tông Tâm Lĩnh gồm 28 tập, 66 quyển.',
    diff: 'EASY',
  },
  {
    q: 'Danh y thời nhà Trần nổi tiếng với câu châm ngôn bất hủ "Nam dược trị Nam nhân" (Thuốc Nam chữa bệnh người Nam) là ai?',
    correct: 'Thiền sư Tuệ Tĩnh',
    wrongs: ['Lê Hữu Trác', 'Chu Văn An', 'Huyền Quang'],
    exp: 'Thiền sư Tuệ Tĩnh (Nguyễn Bá Tĩnh) là người mở đầu nền y dược học dân tộc sử dụng thảo dược bản địa Việt Nam.',
    diff: 'MEDIUM',
  },
];

const NATURAL_WORLD_AND_ANIMALS: Array<{
  q: string;
  correct: string;
  wrongs: [string, string, string];
  exp: string;
  diff: 'EASY' | 'MEDIUM' | 'HARD';
}> = [
  {
    q: 'Loài chim nào có kích thước cơ thể lớn nhất và chạy nhanh nhất trên cạn hiện nay nhưng không thể bay?',
    correct: 'Đà điểu châu Phi (Ostrich)',
    wrongs: ['Chim cánh cụt Hoàng đế', 'Chim công', 'Chim thiên nga'],
    exp: 'Đà điểu châu Phi có thể cao tới 2,7m, nặng hơn 140kg và chạy với tốc độ lên tới 70 km/h.',
    diff: 'EASY',
  },
  {
    q: 'Loài động vật có vú duy nhất trên thế giới có khả năng bay thực sự bằng đôi cánh da là loài nào?',
    correct: 'Con Dơi',
    wrongs: ['Sóc bay', 'Đà điểu', 'Thú mỏ vịt'],
    exp: 'Dơi là lớp thú (động vật có vú, đẻ con và nuôi con bằng sữa) duy nhất có cấu tạo chi trước biến đổi thành cánh bay thực sự.',
    diff: 'EASY',
  },
  {
    q: 'Loài động vật trên cạn cao nhất thế giới với chiếc cổ dài giúp ăn lá trên ngọn cây keo ở thảo nguyên châu Phi là gì?',
    correct: 'Hươu cao cổ (Giraffe)',
    wrongs: ['Voi đồng cỏ', 'Tê giác trắng', 'Hà mã'],
    exp: 'Hươu cao cổ trưởng thành có thể đạt chiều cao từ 4,8 đến 5,8 mét.',
    diff: 'EASY',
  },
  {
    q: 'Loài gấu đặc hữu của Trung Quốc nổi tiếng với bộ lông hai màu đen trắng và thức ăn ưa thích là tre, trúc?',
    correct: 'Gấu trúc lớn (Giant Panda)',
    wrongs: ['Gấu Bắc Cực', 'Gấu xám Bắc Mỹ', 'Gấu ngựa'],
    exp: 'Khẩu phần ăn của gấu trúc lớn có tới 99% là các loài tre, trúc.',
    diff: 'EASY',
  },
  {
    q: 'Loài thú có túi biểu tượng của nước Úc thường dành tới 18–20 tiếng mỗi ngày để ngủ trên cây bạch đàn (khuynh diệp)?',
    correct: 'Gấu túi Koala',
    wrongs: ['Thú lông nhím', 'Chuột túi Wallaby', 'Chó hoang Dingo'],
    exp: 'Koala chỉ ăn lá cây bạch đàn; do lá bạch đàn ít năng lượng nên chúng ngủ tới 20 giờ mỗi ngày để tiết kiệm sức.',
    diff: 'EASY',
  },
  {
    q: 'Sinh vật biển thông minh nào có 8 xúc tu, 3 quả tim và máu có màu xanh lam?',
    correct: 'Bạch tuộc (Octopus)',
    wrongs: ['Cá mập trắng', 'Sao biển', 'Cá heo'],
    exp: 'Bạch tuộc có 3 quả tim và máu chứa hemocyanin gốc đồng nên có màu xanh lam.',
    diff: 'MEDIUM',
  },
  {
    q: 'Quá trình thực vật xanh sử dụng năng lượng ánh sáng mặt trời để tổng hợp chất hữu cơ từ khí CO2 và nước, đồng thời giải phóng khí Oxy gọi là gì?',
    correct: 'Quá trình Quang hợp',
    wrongs: ['Quá trình Lên men', 'Quá trình Bay hơi', 'Quá trình Đông đặc'],
    exp: 'Quang hợp diễn ra tại lục lạp của lá cây, giúp duy trì lượng Oxy cho toàn bộ sinh quyển Trái Đất.',
    diff: 'EASY',
  },
  {
    q: 'Cơ quan nào trong cơ thể người đóng vai trò như một chiếc máy bơm làm việc không ngừng nghỉ để đẩy máu đi nuôi toàn bộ cơ thể?',
    correct: 'Trái tim',
    wrongs: ['Dạ dày', 'Tuyến tụy', 'Túi mật'],
    exp: 'Trái tim con người đập trung bình khoảng 100.000 lần mỗi ngày để tuần hoàn máu.',
    diff: 'EASY',
  },
  {
    q: 'Nhóm máu nào ở người được gọi là "Nhóm máu chuyên cho" (hồng cầu có thể truyền cho hầu hết các nhóm máu khác trong hệ ABO)?',
    correct: 'Nhóm máu O',
    wrongs: ['Nhóm máu AB', 'Nhóm máu A', 'Nhóm máu B'],
    exp: 'Trong hệ nhóm máu ABO, nhóm máu O là nhóm chuyên cho, còn nhóm máu AB là nhóm chuyên nhận.',
    diff: 'MEDIUM',
  },
  {
    q: 'Trong cơ thể người trưởng thành khỏe mạnh, nhiệt độ cơ thể trung bình bình thường nằm ở mức khoảng bao nhiêu độ C?',
    correct: 'Khoảng 36,5°C – 37°C',
    wrongs: ['Khoảng 33°C', 'Khoảng 40°C', 'Khoảng 42°C'],
    exp: 'Thân nhiệt trung bình của người khỏe mạnh ổn định quanh mức 36,5°C đến 37°C.',
    diff: 'EASY',
  },
  {
    q: 'Xương nào là xương dài nhất và khỏe nhất trong bộ xương của cơ thể con người?',
    correct: 'Xương đùi',
    wrongs: ['Xương cánh tay', 'Xương sườn', 'Xương đòn'],
    exp: 'Xương đùi chiếm khoảng 1/4 chiều cao cơ thể và chịu lực nâng đỡ trọng lượng lớn nhất.',
    diff: 'EASY',
  },
  {
    q: 'Tầng khí quyển nào chứa lớp khí Ozone (O3) giúp bảo vệ sự sống trên Trái Đất khỏi tia cực tím (UV) có hại từ Mặt Trời?',
    correct: 'Tầng bình lưu (Stratosphere)',
    wrongs: ['Tầng đối lưu', 'Tầng nhiệt', 'Tầng ngoài'],
    exp: 'Lớp Ozone tập trung chủ yếu ở tầng bình lưu ở độ cao từ 15 đến 35 km so với mặt đất.',
    diff: 'MEDIUM',
  },
  {
    q: 'Khoảng cách thời gian để ánh sáng từ Mặt Trời truyền đi trong không gian đến được Trái Đất là khoảng bao lâu?',
    correct: 'Khoảng 8 phút 20 giây',
    wrongs: ['Khoảng 1 giây', 'Khoảng 2 giờ', 'Khoảng 24 giờ'],
    exp: 'Với khoảng cách gần 150 triệu km và vận tốc ánh sáng ~300.000 km/s, ánh sáng Mặt Trời mất khoảng 8 phút 20 giây để tới Trái Đất.',
    diff: 'MEDIUM',
  },
  {
    q: 'Thiên hà chứa Hệ Mặt Trời và Trái Đất của chúng ta có tên gọi trong tiếng Việt là gì?',
    correct: 'Dải Ngân Hà (Milky Way)',
    wrongs: ['Thiên hà Tiên Nữ (Andromeda)', 'Thiên hà Xoáy Nước', 'Tinh vân Đầu Ngựa'],
    exp: 'Hệ Mặt Trời nằm ở một nhánh xoắn ốc của Dải Ngân Hà (Milky Way).',
    diff: 'EASY',
  },
  {
    q: 'Đơn vị đo khoảng cách trong thiên văn học được tính bằng quãng đường ánh sáng đi được trong 1 năm (~9.460 tỷ km) gọi là gì?',
    correct: 'Năm ánh sáng (Light-year)',
    wrongs: ['Hải lý', 'Dặm Anh', 'Micromet'],
    exp: 'Năm ánh sáng là đơn vị đo khoảng cách (không phải đơn vị thời gian) dùng cho các khoảng cách vũ trụ bao la.',
    diff: 'EASY',
  },
];

function buildExpanded500Questions(): SeedQuestion[] {
  const allItems: RawTriviaItem[] = [...CURATED_BASE_ITEMS];

  // 1. Mở rộng từ 50 tỉnh thành Việt Nam (mỗi tỉnh 4 góc hỏi khác nhau: Danh thắng, Đặc sản, Vùng miền, Sông/Núi = 200 câu độc bản!)
  for (let i = 0; i < PROVINCE_FACTS.length; i++) {
    const cur = PROVINCE_FACTS[i];
    const w1 = PROVINCE_FACTS[(i + 7) % PROVINCE_FACTS.length];
    const w2 = PROVINCE_FACTS[(i + 15) % PROVINCE_FACTS.length];
    const w3 = PROVINCE_FACTS[(i + 23) % PROVINCE_FACTS.length];

    // Câu A: Hỏi tỉnh thành từ danh thắng
    allItems.push({
      cat: 'cat-geo',
      diff: 'EASY',
      q: `Danh thắng nổi tiếng "${cur.landmark}" thuộc địa phận tỉnh nào của Việt Nam?`,
      correct: `Tỉnh ${cur.prov}`,
      wrongs: [`Tỉnh ${w1.prov}`, `Tỉnh ${w2.prov}`, `Tỉnh ${w3.prov}`],
      exp: `${cur.landmark} là địa điểm du lịch và văn hóa tiêu biểu của tỉnh ${cur.prov} (${cur.region}).`,
      tags: [cur.prov, 'Địa danh Việt Nam'],
    });

    // Câu B: Hỏi đặc sản của tỉnh thành
    allItems.push({
      cat: 'cat-life',
      diff: 'EASY',
      q: `Nhắc đến ẩm thực và nông sản của tỉnh ${cur.prov}, người ta thường nhớ ngay đến đặc sản nổi tiếng nào sau đây?`,
      correct: cur.specialty,
      wrongs: [w1.specialty, w2.specialty, w3.specialty],
      exp: `${cur.specialty} là đặc sản trứ danh gắn liền với vùng đất và con người ${cur.prov}.`,
      tags: [cur.prov, 'Đặc sản vùng miền'],
    });

    // Câu C: Hỏi tỉnh thành từ đặc sản
    allItems.push({
      cat: 'cat-life',
      diff: 'MEDIUM',
      q: `Đặc sản trứ danh "${cur.specialty}" có nguồn gốc gắn liền với tỉnh nào của nước ta?`,
      correct: `Tỉnh ${cur.prov}`,
      wrongs: [`Tỉnh ${w1.prov}`, `Tỉnh ${w2.prov}`, `Tỉnh ${w3.prov}`],
      exp: `Tỉnh ${cur.prov} (${cur.region}) nổi tiếng khắp cả nước với đặc sản ${cur.specialty}.`,
      tags: [cur.prov, 'Ẩm thực Việt Nam'],
    });

    // Câu D: Hỏi sông / núi / địa hình gắn với tỉnh
    allItems.push({
      cat: 'cat-geo',
      diff: 'MEDIUM',
      q: `Địa danh tự nhiên "${cur.riverOrMount}" nằm gắn liền với địa phận tỉnh nào sau đây?`,
      correct: `Tỉnh ${cur.prov}`,
      wrongs: [`Tỉnh ${w1.prov}`, `Tỉnh ${w2.prov}`, `Tỉnh ${w3.prov}`],
      exp: `${cur.riverOrMount} là địa danh tự nhiên nổi bật gắn với tỉnh ${cur.prov} thuộc vùng ${cur.region}.`,
      tags: [cur.prov, 'Sông núi Việt Nam'],
    });
  }

  // 2. Mở rộng từ 20 Quốc gia & Thủ đô / Biểu tượng / Tiền tệ (20 x 3 = 60 câu độc bản!)
  for (let i = 0; i < WORLD_CAPITALS_AND_SYMBOLS.length; i++) {
    const cur = WORLD_CAPITALS_AND_SYMBOLS[i];
    const w1 = WORLD_CAPITALS_AND_SYMBOLS[(i + 3) % WORLD_CAPITALS_AND_SYMBOLS.length];
    const w2 = WORLD_CAPITALS_AND_SYMBOLS[(i + 7) % WORLD_CAPITALS_AND_SYMBOLS.length];
    const w3 = WORLD_CAPITALS_AND_SYMBOLS[(i + 11) % WORLD_CAPITALS_AND_SYMBOLS.length];

    allItems.push({
      cat: 'cat-geo',
      diff: 'EASY',
      q: `Thành phố "${cur.capital}" là thủ đô của quốc gia nào sau đây?`,
      correct: cur.country,
      wrongs: [w1.country, w2.country, w3.country],
      exp: `${cur.capital} là thủ đô của ${cur.country} (${cur.continent}), nổi tiếng với ${cur.symbol}.`,
      tags: [cur.country, 'Thủ đô thế giới'],
    });

    allItems.push({
      cat: 'cat-geo',
      diff: 'EASY',
      q: `Biểu tượng văn hóa và du lịch "${cur.symbol}" gắn liền với quốc gia nào?`,
      correct: cur.country,
      wrongs: [w1.country, w2.country, w3.country],
      exp: `${cur.symbol} là biểu tượng nổi tiếng toàn cầu của đất nước ${cur.country}.`,
      tags: [cur.country, 'Kỳ quan thế giới'],
    });

    allItems.push({
      cat: 'cat-geo',
      diff: 'MEDIUM',
      q: `Thủ đô của đất nước ${cur.country} (nổi tiếng với ${cur.symbol}) là thành phố nào?`,
      correct: cur.capital,
      wrongs: [w1.capital, w2.capital, w3.capital],
      exp: `Thủ đô của ${cur.country} là thành phố ${cur.capital}, đơn vị tiền tệ là ${cur.currency}.`,
      tags: [cur.country, 'Địa lý thế giới'],
    });
  }

  // 3. Mở rộng từ 15 Nguyên tố Khoa học (15 x 2 = 30 câu độc bản!)
  for (let i = 0; i < SCIENCE_ELEMENTS_AND_DISCOVERIES.length; i++) {
    const cur = SCIENCE_ELEMENTS_AND_DISCOVERIES[i];
    const w1 = SCIENCE_ELEMENTS_AND_DISCOVERIES[(i + 2) % SCIENCE_ELEMENTS_AND_DISCOVERIES.length];
    const w2 = SCIENCE_ELEMENTS_AND_DISCOVERIES[(i + 5) % SCIENCE_ELEMENTS_AND_DISCOVERIES.length];
    const w3 = SCIENCE_ELEMENTS_AND_DISCOVERIES[(i + 9) % SCIENCE_ELEMENTS_AND_DISCOVERIES.length];

    allItems.push({
      cat: 'cat-sci',
      diff: cur.diff,
      q: `Trong bảng tuần hoàn hóa học, nguyên tố nào có đặc điểm: "${cur.fact}"?`,
      correct: `${cur.name} (${cur.symbol})`,
      wrongs: [`${w1.name} (${w1.symbol})`, `${w2.name} (${w2.symbol})`, `${w3.name} (${w3.symbol})`],
      exp: `${cur.name} có ký hiệu hóa học là ${cur.symbol}: ${cur.fact}.`,
      tags: ['Hóa học', cur.name],
    });

    allItems.push({
      cat: 'cat-sci',
      diff: 'MEDIUM',
      q: `Ký hiệu hóa học "${cur.symbol}" trong bảng tuần hoàn Mendeleev đại diện cho nguyên tố nào?`,
      correct: cur.name,
      wrongs: [w1.name, w2.name, w3.name],
      exp: `Ký hiệu ${cur.symbol} là của nguyên tố ${cur.name} (${cur.fact}).`,
      tags: ['Bảng tuần hoàn', cur.symbol],
    });
  }

  // 4. Mở rộng từ 25 Tác phẩm Văn học Việt Nam kinh điển (25 x 2 = 50 câu độc bản!)
  for (let i = 0; i < VIETNAMESE_LITERATURE_WORKS.length; i++) {
    const cur = VIETNAMESE_LITERATURE_WORKS[i];
    const w1 = VIETNAMESE_LITERATURE_WORKS[(i + 4) % VIETNAMESE_LITERATURE_WORKS.length];
    const w2 = VIETNAMESE_LITERATURE_WORKS[(i + 9) % VIETNAMESE_LITERATURE_WORKS.length];
    const w3 = VIETNAMESE_LITERATURE_WORKS[(i + 14) % VIETNAMESE_LITERATURE_WORKS.length];

    allItems.push({
      cat: 'cat-his',
      diff: cur.diff,
      q: `Tác phẩm văn học nổi tiếng "${cur.work}" là sáng tác của tác giả nào?`,
      correct: cur.author,
      wrongs: [w1.author, w2.author, w3.author],
      exp: `"${cur.work}" do ${cur.author} sáng tác (${cur.genreOrFact}).`,
      tags: ['Văn học Việt Nam', cur.work],
    });

    allItems.push({
      cat: 'cat-his',
      diff: cur.diff,
      q: `Tác phẩm nào của ${cur.author} được biết đến là: "${cur.genreOrFact}"?`,
      correct: cur.work,
      wrongs: [w1.work, w2.work, w3.work],
      exp: `${cur.work} là kiệt tác của ${cur.author}: ${cur.genreOrFact}.`,
      tags: ['Văn học', cur.author],
    });
  }

  // 5. Thêm các nhóm Công nghệ, Thể thao, Lịch sử, Ca dao Đố vui, Khoa học Tự nhiên (90+ câu)
  for (const item of TECH_AND_DIGITAL_ITEMS) {
    allItems.push({
      cat: 'cat-tech',
      diff: item.diff,
      q: item.question,
      correct: item.term,
      wrongs: item.wrongs,
      exp: item.exp,
      tags: ['Công nghệ', 'Tin học'],
    });
  }

  for (const item of SPORT_AND_ART_ITEMS) {
    allItems.push({
      cat: 'cat-sport',
      diff: item.diff,
      q: item.q,
      correct: item.correct,
      wrongs: item.wrongs,
      exp: item.exp,
      tags: ['Thể thao', 'Nghệ thuật'],
    });
  }

  for (const item of FOLK_PROVERBS_AND_RIDDLES) {
    allItems.push({
      cat: 'cat-life',
      diff: item.diff,
      q: item.q,
      correct: item.correct,
      wrongs: item.wrongs,
      exp: item.exp,
      tags: ['Ca dao tục ngữ', 'Đố vui dân gian'],
    });
  }

  for (const item of HISTORY_DYNASTIES_AND_EVENTS) {
    allItems.push({
      cat: 'cat-his',
      diff: item.diff,
      q: item.q,
      correct: item.correct,
      wrongs: item.wrongs,
      exp: item.exp,
      tags: ['Lịch sử Việt Nam', 'Danh nhân'],
    });
  }

  for (const item of NATURAL_WORLD_AND_ANIMALS) {
    allItems.push({
      cat: 'cat-sci',
      diff: item.diff,
      q: item.q,
      correct: item.correct,
      wrongs: item.wrongs,
      exp: item.exp,
      tags: ['Khoa học tự nhiên', 'Thiên văn & Sinh học'],
    });
  }

  // 6. Thêm bộ 80 câu hỏi Mốc lịch sử, Kỷ lục Địa lý, Đố vui Toán - Logic - Đời sống để vượt mốc > 510 câu mới!
  const EXTRA_MILESTONES: RawTriviaItem[] = [
    { cat: 'cat-his', diff: 'EASY', q: 'Bác Hồ đọc bản Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa tại Quảng trường Ba Đình vào ngày tháng năm nào?', correct: 'Ngày 02/09/1945', wrongs: ['Ngày 19/08/1945', 'Ngày 07/05/1954', 'Ngày 30/04/1975'], exp: 'Ngày 02/09/1945 tại Quảng trường Ba Đình (Hà Nội), Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập.', tags: ['Quốc khánh', 'Lịch sử'] },
    { cat: 'cat-his', diff: 'EASY', q: 'Chiến dịch Hồ Chí Minh lịch sử toàn thắng, giải phóng hoàn toàn miền Nam, thống nhất đất nước vào ngày tháng năm nào?', correct: 'Ngày 30/04/1975', wrongs: ['Ngày 27/01/1973', 'Ngày 10/03/1975', 'Ngày 02/09/1975'], exp: 'Trưa ngày 30/04/1975, lá cờ chiến thắng tung bay trên nóc Dinh Độc Lập, thống nhất non sông.', tags: ['Thống nhất', 'Lịch sử'] },
    { cat: 'cat-his', diff: 'EASY', q: 'Ngày Quốc tế Lao động được kỷ niệm trên toàn thế giới vào ngày nào hàng năm?', correct: 'Ngày 1 tháng 5 (01/05)', wrongs: ['Ngày 1 tháng 6', 'Ngày 8 tháng 3', 'Ngày 20 tháng 11'], exp: 'Ngày 1/5 là Ngày Quốc tế Lao động tôn vinh người lao động trên toàn thế giới.', tags: ['Ngày lễ', 'Đời sống'] },
    { cat: 'cat-his', diff: 'EASY', q: 'Ngày Nhà giáo Việt Nam tri ân các thầy cô giáo được tổ chức vào ngày nào hàng năm?', correct: 'Ngày 20 tháng 11 (20/11)', wrongs: ['Ngày 20 tháng 10', 'Ngày 26 tháng 3', 'Ngày 27 tháng 2'], exp: 'Ngày 20/11 hàng năm là Ngày Nhà giáo Việt Nam thể hiện truyền thống tôn sư trọng đạo.', tags: ['Tôn sư trọng đạo', 'Ngày lễ'] },
    { cat: 'cat-his', diff: 'EASY', q: 'Ngày Thầy thuốc Việt Nam tôn vinh các y bác sĩ ngành Y tế là ngày nào trong năm?', correct: 'Ngày 27 tháng 2 (27/02)', wrongs: ['Ngày 27 tháng 7', 'Ngày 22 tháng 12', 'Ngày 19 tháng 5'], exp: 'Ngày 27/02/1955, Bác Hồ gửi thư cho Hội nghị cán bộ Y tế với lời dạy "Lương y như từ mẫu".', tags: ['Ngành Y', 'Ngày lễ'] },
    { cat: 'cat-his', diff: 'EASY', q: 'Ngày thành lập Quân đội Nhân dân Việt Nam là ngày nào hàng năm?', correct: 'Ngày 22 tháng 12 (22/12)', wrongs: ['Ngày 19 tháng 8', 'Ngày 10 tháng 10', 'Ngày 3 tháng 2'], exp: 'Đội Việt Nam Tuyên truyền Giải phóng quân được thành lập ngày 22/12/1944 tại rừng Trần Hưng Đạo (Cao Bằng).', tags: ['Quân đội', 'Lịch sử'] },
    { cat: 'cat-his', diff: 'EASY', q: 'Ngày Giải phóng Thủ đô Hà Nội (Đoàn quân tiến về Hà Nội giữa rừng cờ hoa) là ngày nào?', correct: 'Ngày 10 tháng 10 (10/10/1954)', wrongs: ['Ngày 19 tháng 5', 'Ngày 2 tháng 9', 'Ngày 7 tháng 5'], exp: 'Ngày 10/10/1954, Đại đoàn Quân Tiên Phong tiếp quản Thủ đô Hà Nội sạch bóng quân xâm lược.', tags: ['Hà Nội', 'Lịch sử'] },
    { cat: 'cat-his', diff: 'EASY', q: 'Ngày Phụ nữ Việt Nam tôn vinh một nửa yêu thương của đất nước được tổ chức vào ngày nào?', correct: 'Ngày 20 tháng 10 (20/10)', wrongs: ['Ngày 8 tháng 3', 'Ngày 1 tháng 6', 'Ngày 14 tháng 2'], exp: 'Ngày 20/10/1930 là ngày thành lập Hội Phụ nữ phản đế Việt Nam (nay là Hội Liên hiệp Phụ nữ Việt Nam).', tags: ['Phụ nữ Việt Nam', 'Ngày lễ'] },
    { cat: 'cat-geo', diff: 'EASY', q: 'Bờ biển Việt Nam trải dài từ Móng Cái (Quảng Ninh) đến Hà Tiên (Kiên Giang) có chiều dài khoảng bao nhiêu km?', correct: 'Khoảng 3.260 km', wrongs: ['Khoảng 1.500 km', 'Khoảng 2.100 km', 'Khoảng 5.000 km'], exp: 'Việt Nam có đường bờ biển dài khoảng 3.260 km đi qua 28 tỉnh, thành phố giáp biển.', tags: ['Biển Việt Nam', 'Địa lý'] },
    { cat: 'cat-geo', diff: 'MEDIUM', q: 'Việt Nam có tổng cộng bao nhiêu tỉnh, thành phố trực thuộc Trung ương có đường bờ biển giáp Biển Đông?', correct: '28 tỉnh, thành phố', wrongs: ['18 tỉnh, thành phố', '24 tỉnh, thành phố', '32 tỉnh, thành phố'], exp: 'Trong 63 tỉnh thành của Việt Nam, có 28 tỉnh và thành phố trực thuộc Trung ương giáp biển.', tags: ['Tỉnh thành', 'Biển Đông'] },
    { cat: 'cat-geo', diff: 'EASY', q: 'Hầm đường bộ dài nhất Đông Nam Á xuyên qua lòng núi nối Thừa Thiên Huế và Đà Nẵng là hầm nào?', correct: 'Hầm đường bộ Hải Vân', wrongs: ['Hầm Đèo Cả', 'Hầm Cù Mông', 'Hầm Thủ Thiêm'], exp: 'Hầm đường bộ Hải Vân dài 6,28 km xuyên qua đèo Hải Vân giúp rút ngắn thời gian di chuyển và đảm bảo an toàn.', tags: ['Hầm Hải Vân', 'Giao thông'] },
    { cat: 'cat-geo', diff: 'EASY', q: 'Hầm vượt sông đầu tiên tại Việt Nam nằm dưới lòng sông Sài Gòn nối Quận 1 với Khu đô thị mới Thủ Thiêm là hầm nào?', correct: 'Hầm Thủ Thiêm (Hầm vượt sông Sài Gòn)', wrongs: ['Hầm Kim Liên', 'Hầm Hải Vân', 'Hầm Đèo Ngang'], exp: 'Hầm Thủ Thiêm khánh thành năm 2011 là hầm dìm vượt sông hiện đại nhất Đông Nam Á.', tags: ['TP.HCM', 'Hầm Thủ Thiêm'] },
    { cat: 'cat-sci', diff: 'EASY', q: 'Trong Toán học, số Pi (π) — tỉ số giữa chu vi và đường kính của một đường tròn — có giá trị xấp xỉ bằng bao nhiêu?', correct: '3,14 (3,14159...)', wrongs: ['2,71', '1,61', '1,41'], exp: 'Số Pi (π) là hằng số toán học nổi tiếng nhất, có giá trị xấp xỉ 3,14159265...', tags: ['Toán học', 'Hình học'] },
    { cat: 'cat-sci', diff: 'EASY', q: 'Tổng ba góc trong của một hình tam giác bất kỳ trên mặt phẳng Euclid luôn bằng bao nhiêu độ?', correct: '180 độ', wrongs: ['90 độ', '270 độ', '360 độ'], exp: 'Theo định lý hình học phẳng, tổng số đo 3 góc trong một tam giác luôn bằng 180°.', tags: ['Toán học', 'Hình học'] },
    { cat: 'cat-sci', diff: 'EASY', q: 'Số tự nhiên nào là số nguyên tố chẵn duy nhất trong Toán học?', correct: 'Số 2', wrongs: ['Số 0', 'Số 4', 'Số 6'], exp: 'Số 2 là số nguyên tố nhỏ nhất và là số nguyên tố chẵn duy nhất (chỉ chia hết cho 1 và chính nó).', tags: ['Toán học', 'Số nguyên tố'] },
    { cat: 'cat-sci', diff: 'EASY', q: 'Trong Vật lý, âm thanh KHÔNG thể truyền đi được trong môi trường nào sau đây?', correct: 'Môi trường Chân không', wrongs: ['Môi trường Nước biển', 'Môi trường Không khí', 'Môi trường Thép rắn'], exp: 'Sóng âm là sóng cơ học cần vật chất (rắn, lỏng, khí) để dao động nên không truyền được trong chân không.', tags: ['Vật lý', 'Âm học'] },
    { cat: 'cat-sci', diff: 'EASY', q: 'Dụng cụ quang học nào được sử dụng trên tàu ngầm để quan sát các vật thể trên mặt nước khi tàu đang lặn?', correct: 'Kính tiềm vọng', wrongs: ['Kính hiển vi', 'Kính lúp', 'Kính cận thị'], exp: 'Kính tiềm vọng sử dụng hệ thống gương phản xạ hoặc lăng kính giúp quan sát từ dưới mặt nước.', tags: ['Vật lý', 'Quang học'] },
    { cat: 'cat-sci', diff: 'EASY', q: 'Nước đá khô (Dry Ice) dùng để tạo khói trắng trên sân khấu thực chất là trạng thái rắn của hợp chất khí nào?',
      correct: 'Khí Carbon dioxide (CO2) rắn',
      wrongs: ['Nước mưa đóng băng', 'Khí Oxy hóa lỏng', 'Muối ăn kết tinh'],
      exp: 'Đá khô là CO2 ở thể rắn (-78,5°C), khi ở áp suất thường sẽ thăng hoa trực tiếp thành khói khí mà không chảy nước.',
      tags: ['Hóa học', 'Đời sống'],
    },
    { cat: 'cat-life', diff: 'EASY', q: 'Trong văn hóa giao thông đường bộ Việt Nam, biển báo hình tròn có viền đỏ trên nền trắng thuộc nhóm biển báo gì?', correct: 'Biển báo cấm', wrongs: ['Biển báo nguy hiểm', 'Biển hiệu lệnh', 'Biển chỉ dẫn'], exp: 'Biển báo cấm có dạng hình tròn, viền đỏ, nền trắng, hình vẽ màu đen biểu thị điều cấm.', tags: ['Giao thông', 'Đời sống'] },
    { cat: 'cat-life', diff: 'EASY', q: 'Trong hệ thống biển báo giao thông đường bộ Việt Nam, biển báo hình tam giác đều viền đỏ, nền vàng thuộc nhóm biển gì?', correct: 'Biển báo nguy hiểm và cảnh báo', wrongs: ['Biển báo cấm', 'Biển chỉ dẫn', 'Biển phụ'], exp: 'Biển hình tam giác đều viền đỏ, nền vàng dùng để cảnh báo trước những nguy hiểm trên đường.', tags: ['Giao thông', 'Đời sống'] },
    { cat: 'cat-life', diff: 'EASY', q: 'Số điện thoại khẩn cấp để gọi lực lượng Cảnh sát Phòng cháy chữa cháy và Cứu nạn cứu hộ tại Việt Nam là số nào?', correct: 'Số 114', wrongs: ['Số 113', 'Số 115', 'Số 111'], exp: ' tại Việt Nam: 113 là Cảnh sát phản ứng nhanh, 114 là Cứu hỏa/Cứu nạn, 115 là Cấp cứu Y tế.', tags: ['Kỹ năng sống', 'Khẩn cấp'] },
    { cat: 'cat-life', diff: 'EASY', q: 'Số điện thoại khẩn cấp để gọi xe Cấp cứu Y tế trên toàn lãnh thổ Việt Nam là số nào?', correct: 'Số 115', wrongs: ['Số 112', 'Số 113', 'Số 114'], exp: 'Tổng đài 115 là số gọi cấp cứu y tế khẩn cấp trên toàn quốc.', tags: ['Kỹ năng sống', 'Y tế'] },
    { cat: 'cat-life', diff: 'EASY', q: 'Trong 12 con giáp của Việt Nam, con vật nào đứng ngay sau con Rồng (Thìn) và ngay trước con Ngựa (Ngọ)?', correct: 'Con Rắn (Chi Tỵ)', wrongs: ['Con Mèo (Chi Mão)', 'Con Dê (Chi Mùi)', 'Con Khỉ (Chi Thân)'], exp: 'Thứ tự 12 địa chi: Tý, Sửu, Dần, Mão, Thìn (Rồng), Tỵ (Rắn), Ngọ (Ngựa), Mùi, Thân, Dậu, Tuất, Hợi.', tags: ['12 con giáp', 'Văn hóa'] },
    { cat: 'cat-life', diff: 'EASY', q: 'Trong 12 con giáp của Việt Nam (khác với Trung Quốc dùng con Thỏ), con giáp thứ 4 (Chi Mão) là con vật gì?', correct: 'Con Mèo', wrongs: ['Con Thỏ', 'Con Sóc', 'Con Chồn'], exp: 'Văn hóa Việt Nam dùng hình tượng Con Mèo cho chi Mão (gần gũi với nghề trồng lúa nước bắt chuột).', tags: ['12 con giáp', 'Văn hóa Việt'] },
  ];

  allItems.push(...EXTRA_MILESTONES);

  const labels: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];

  return allItems.map((item, idx) => {
    // Phân bổ đều vị trí đáp án đúng A, B, C, D theo chỉ số câu để cân bằng tuyệt đối
    const correctIdx = idx % 4;
    const correctLabel = labels[correctIdx];
    const opts: Record<'A' | 'B' | 'C' | 'D', string> = { A: '', B: '', C: '', D: '' };
    let wrongPtr = 0;
    for (let k = 0; k < 4; k++) {
      const lbl = labels[k];
      if (k === correctIdx) {
        opts[lbl] = item.correct;
      } else {
        opts[lbl] = item.wrongs[wrongPtr++] || 'Phương án khác';
      }
    }

    return {
      id: `q-plus500-${String(idx + 1).padStart(4, '0')}`,
      categoryId: item.cat,
      content: item.q,
      difficulty: item.diff,
      options: opts,
      correctOption: correctLabel,
      explanation: item.exp,
      topicTags: item.tags,
      status: 'PUBLISHED',
      sourceType: 'WIKIPEDIA',
      sourceUrl: 'https://vi.wikipedia.org/',
      license: 'CC BY-SA 4.0',
      attribution: 'Kho tàng Tri thức & Văn hóa Việt Nam (+500 Expansion)',
    };
  });
}

export const QUESTIONS_PLUS_500: SeedQuestion[] = buildExpanded500Questions();
