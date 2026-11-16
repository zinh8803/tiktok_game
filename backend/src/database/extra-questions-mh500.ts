import { SeedQuestion } from './seed-data';

interface CompactMHQuestion {
  id: string;
  cat: string;
  diff: 'MEDIUM' | 'HARD';
  q: string;
  a: string;
  b: string;
  c: string;
  d: string;
  ans: 'A' | 'B' | 'C' | 'D';
  exp: string;
  tags: string[];
}

const MH500_COMPACT: CompactMHQuestion[] = [
  {
    "id": "q-mh500-b1-001",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Đỉnh núi nào cao thứ hai tại Việt Nam sau đỉnh Fansipan?",
    "a": "Pu Ta Leng",
    "b": "Pu Si Lung",
    "c": "Bạch Mộc Lương Tử",
    "d": "Nhìu Cồ San",
    "ans": "A",
    "exp": "Đỉnh Pu Ta Leng thuộc dãy Hoàng Liên Sơn tại tỉnh Lai Châu cao khoảng 3.049m, đứng thứ hai Việt Nam chỉ sau Fansipan.",
    "tags": [
      "Địa lý",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-002",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Đỉnh núi Pu Si Lung nằm trên đường biên giới giữa tỉnh Lai Châu của Việt Nam và tỉnh nào của Trung Quốc?",
    "a": "Quảng Tây",
    "b": "Vân Nam",
    "c": "Quý Châu",
    "d": "Tứ Xuyên",
    "ans": "B",
    "exp": "Đỉnh Pu Si Lung nằm ở biên giới huyện Mường Tè, tỉnh Lai Châu và tỉnh Vân Nam của Trung Quốc.",
    "tags": [
      "Địa lý",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-003",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Con sông nào chảy vào lãnh thổ Việt Nam tại ngã ba Lũng Pô thuộc tỉnh Lào Cai?",
    "a": "Sông Đà",
    "b": "Sông Lô",
    "c": "Sông Hồng",
    "d": "Sông Chảy",
    "ans": "C",
    "exp": "Sông Hồng bắt nguồn từ Vân Nam và chảy vào đất Việt tại cột cờ Lũng Pô, huyện Bát Xát, tỉnh Lào Cai.",
    "tags": [
      "Địa lý",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-004",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Sông Đà bắt nguồn từ dãy núi nào thuộc tỉnh Vân Nam của Trung Quốc trước khi chảy vào Việt Nam?",
    "a": "Dãy Đại Tuyết Sơn",
    "b": "Dãy Ai Lao Sơn",
    "c": "Dãy Hoành Đoạn Sơn",
    "d": "Dãy Vô Lượng Sơn",
    "ans": "D",
    "exp": "Sông Đà bắt nguồn từ vùng núi Vô Lượng Sơn thuộc tỉnh Vân Nam với tên gọi ở thượng nguồn là sông Lý Tiên.",
    "tags": [
      "Địa lý",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-005",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Cánh cung núi nào nằm ở vị trí tận cùng phía đông trong bốn cánh cung lớn của vùng Đông Bắc Việt Nam?",
    "a": "Cánh cung Đông Triều",
    "b": "Cánh cung Ngân Sơn",
    "c": "Cánh cung Bắc Sơn",
    "d": "Cánh cung Sông Gâm",
    "ans": "A",
    "exp": "Bốn cánh cung vùng Đông Bắc theo thứ tự từ tây sang đông là Sông Gâm, Ngân Sơn, Bắc Sơn và Đông Triều.",
    "tags": [
      "Địa lý",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-006",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Châu thổ sông Cửu Long được hình thành và bồi đắp chủ yếu trong kỷ địa chất nào?",
    "a": "Kỷ Phấn Trắng",
    "b": "Kỷ Đệ Tứ",
    "c": "Kỷ Tam Điệp",
    "d": "Kỷ Jura",
    "ans": "B",
    "exp": "Đồng bằng sông Cửu Long và đồng bằng sông Hồng được bồi tụ trầm tích phù sa trẻ trong kỷ Đệ Tứ thuộc đại Tân Sinh.",
    "tags": [
      "Địa lý",
      "Địa chất"
    ]
  },
  {
    "id": "q-mh500-b1-007",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Đới đứt gãy sâu chạy dọc theo thung lũng sông Hồng kéo dài từ Tây Tạng ra vịnh Bắc Bộ có tên địa chất là gì?",
    "a": "Đứt gãy Điện Biên - Lai Châu",
    "b": "Đứt gãy Sông Mã",
    "c": "Đứt gãy Sông Hồng - Ailao Shan",
    "d": "Đứt gãy Sông Cả",
    "ans": "C",
    "exp": "Đới đứt gãy Sông Hồng - Ailao Shan là ranh giới kiến tạo lớn giữa khối nền Hoa Nam và khối Đông Dương.",
    "tags": [
      "Địa lý",
      "Địa chất"
    ]
  },
  {
    "id": "q-mh500-b1-008",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Cao nguyên đá Đồng Văn nằm trên địa bàn của bốn huyện thuộc tỉnh Hà Giang, ngoại trừ huyện nào sau đây?",
    "a": "Quản Bạ",
    "b": "Yên Minh",
    "c": "Mèo Vạc",
    "d": "Bắc Mê",
    "ans": "D",
    "exp": "Cao nguyên đá Đồng Văn trải rộng trên 4 huyện Quản Bạ, Yên Minh, Đồng Văn và Mèo Vạc của tỉnh Hà Giang.",
    "tags": [
      "Địa lý",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-009",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Hẻm vực Tu Sản sâu nhất Đông Nam Á nằm dưới chân đèo Mã Pí Lèng được dòng sông nào cắt qua?",
    "a": "Sông Nho Quế",
    "b": "Sông Gâm",
    "c": "Sông Miện",
    "d": "Sông Chảy",
    "ans": "A",
    "exp": "Hẻm vực Tu Sản có vách đá dựng đứng cao tới 700-800m được kiến tạo bởi dòng chảy của sông Nho Quế.",
    "tags": [
      "Địa lý",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-010",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Hồ Ba Bể thuộc tỉnh Bắc Kạn nằm trên độ cao khoảng bao nhiêu mét so với mực nước biển?",
    "a": "Khoảng 500 mét",
    "b": "Khoảng 145 mét",
    "c": "Khoảng 850 mét",
    "d": "Khoảng 1200 mét",
    "ans": "B",
    "exp": "Hồ Ba Bể là hồ nước ngọt tự nhiên trên núi đá vôi nằm ở độ cao khoảng 145m so với mực nước biển.",
    "tags": [
      "Địa lý",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-011",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Trong hệ thống ba hồ thông nhau tạo nên hồ Ba Bể, hồ nào có diện tích lớn nhất?",
    "a": "Pé Lầm",
    "b": "Pé Lù",
    "c": "Pé Lèng",
    "d": "Pé Lạc",
    "ans": "C",
    "exp": "Ba Bể gồm ba nhánh hồ thông nhau là Pé Lầm, Pé Lù và Pé Lèng, trong đó Pé Lèng rộng và sâu nhất.",
    "tags": [
      "Địa lý",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-012",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Đảo Phú Quý là một huyện đảo trực thuộc tỉnh nào của Việt Nam?",
    "a": "Ninh Thuận",
    "b": "Bà Rịa - Vũng Tàu",
    "c": "Khánh Hòa",
    "d": "Bình Thuận",
    "ans": "D",
    "exp": "Huyện đảo Phú Quý còn gọi là cù lao Thu, nằm cách thành phố Phan Thiết tỉnh Bình Thuận khoảng 56 hải lý.",
    "tags": [
      "Địa lý",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-013",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Quần đảo Thổ Chu nằm ở cực tây nam vùng biển Việt Nam thuộc quyền quản lý hành chính của đơn vị nào?",
    "a": "Thành phố Phú Quốc, tỉnh Kiên Giang",
    "b": "Huyện Kiên Hải, tỉnh Kiên Giang",
    "c": "Thành phố Hà Tiên, tỉnh Kiên Giang",
    "d": "Huyện Ngọc Hiển, tỉnh Cà Mau",
    "ans": "A",
    "exp": "Quần đảo Thổ Chu là một xã đảo trực thuộc thành phố Phú Quốc, tỉnh Kiên Giang.",
    "tags": [
      "Địa lý",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-014",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Mũi Đôi trên bán đảo Hòn Gốm là điểm cực Đông trên đất liền của Việt Nam thuộc huyện nào của tỉnh Khánh Hòa?",
    "a": "Thị xã Ninh Hòa",
    "b": "Huyện Vạn Ninh",
    "c": "Huyện Cam Lâm",
    "d": "Huyện Diên Khánh",
    "ans": "B",
    "exp": "Mũi Đôi nằm tại xã Vạn Thạnh, huyện Vạn Ninh, tỉnh Khánh Hòa.",
    "tags": [
      "Địa lý",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-015",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Điểm cực Tây trên đất liền của Việt Nam tại A Pa Chải nằm ở ngã ba biên giới Việt Nam, Lào và tỉnh nào của Trung Quốc?",
    "a": "Quảng Tây",
    "b": "Quý Châu",
    "c": "Vân Nam",
    "d": "Hải Nam",
    "ans": "C",
    "exp": "A Pa Chải thuộc xã Sín Thầu, huyện Mường Nhé, tỉnh Điện Biên, tiếp giáp tỉnh Phongsaly của Lào và tỉnh Vân Nam của Trung Quốc.",
    "tags": [
      "Địa lý",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-016",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Loại gió địa phương khô nóng thổi vào khu vực Bắc Trung Bộ Việt Nam đầu mùa hạ có nguồn gốc từ khối khí nào?",
    "a": "Khối khí xích đạo hải dương",
    "b": "Khối khí chí tuyến bán cầu Nam",
    "c": "Khối khí ôn đới lục địa",
    "d": "Khối khí nhiệt đới vịnh Bengal",
    "ans": "D",
    "exp": "Khối khí nhiệt đới ẩm từ Bắc Ấn Độ Dương qua vịnh Bengal vượt dãy Trường Sơn gây hiệu ứng phơn khô nóng cho Trung Bộ.",
    "tags": [
      "Địa lý",
      "Khí hậu"
    ]
  },
  {
    "id": "q-mh500-b1-017",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Đèo nào trên dãy Trường Sơn là ranh giới tự nhiên phân chia hai phụ đới khí hậu phía bắc và phía nam miền Trung Việt Nam?",
    "a": "Đèo Hải Vân",
    "b": "Đèo Ngang",
    "c": "Đèo Cù Mông",
    "d": "Đèo Cả",
    "ans": "A",
    "exp": "Đèo Hải Vân thuộc dãy Bạch Mã ngăn cản gió mùa Đông Bắc lạnh xuống phía nam, tạo ranh giới khí hậu rõ rệt.",
    "tags": [
      "Địa lý",
      "Khí hậu"
    ]
  },
  {
    "id": "q-mh500-b1-018",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Vườn quốc gia Tràm Chim nổi tiếng với loài sếu đầu đỏ nằm ở vùng sinh thái nào của đồng bằng sông Cửu Long?",
    "a": "Tứ giác Long Xuyên",
    "b": "Đồng Tháp Mười",
    "c": "Bán đảo Cà Mau",
    "d": "Tây Sông Hậu",
    "ans": "B",
    "exp": "Vườn quốc gia Tràm Chim thuộc huyện Tam Nông, tỉnh Đồng Tháp, là mẫu chuẩn hệ sinh thái đất ngập nước vùng Đồng Tháp Mười.",
    "tags": [
      "Địa lý",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-019",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Cao nguyên nào có độ cao trung bình lớn nhất trong các cao nguyên thuộc vùng Tây Nguyên Việt Nam?",
    "a": "Cao nguyên Pleiku",
    "b": "Cao nguyên Đắk Lắk",
    "c": "Cao nguyên Lâm Viên",
    "d": "Cao nguyên Mơ Nông",
    "ans": "C",
    "exp": "Cao nguyên Lâm Viên thuộc tỉnh Lâm Đồng có độ cao trung bình khoảng 1.500m, cao nhất vùng Tây Nguyên.",
    "tags": [
      "Địa lý",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-020",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Hệ thống sông Đồng Nai chảy qua nhiều tỉnh thành phía Nam và đổ ra biển Đông chủ yếu qua cửa biển nào?",
    "a": "Cửa Định An",
    "b": "Cửa Tiểu",
    "c": "Cửa Đại",
    "d": "Cửa Soài Rạp",
    "ans": "D",
    "exp": "Sông Đồng Nai hợp lưu với sông Sài Gòn thành sông Nhà Bè rồi chia thành hai nhánh Lòng Tàu và Soài Rạp đổ ra biển Đông.",
    "tags": [
      "Địa lý",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-021",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Tỉnh nào ở Việt Nam vừa có đường biên giới trên bộ với Lào vừa có đường biên giới trên bộ với Campuchia?",
    "a": "Kon Tum",
    "b": "Gia Lai",
    "c": "Đắk Lắk",
    "d": "Quảng Nam",
    "ans": "A",
    "exp": "Kon Tum là tỉnh duy nhất của Việt Nam nằm ở ngã ba Đông Dương, tiếp giáp cả Lào và Campuchia tại cửa khẩu Bờ Y.",
    "tags": [
      "Địa lý",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-022",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Thủ đô chính thức của nước Cộng hòa Thống nhất Tanzania là thành phố nào?",
    "a": "Dar es Salaam",
    "b": "Dodoma",
    "c": "Arusha",
    "d": "Zanzibar",
    "ans": "B",
    "exp": "Dodoma trở thành thủ đô chính thức của Tanzania từ năm 1996, dù Dar es Salaam vẫn là thành phố lớn nhất.",
    "tags": [
      "Địa lý",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-023",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Quốc gia đảo Palau ở khu vực tiểu vùng Micronesia trên Thái Bình Dương có thủ đô là nơi nào?",
    "a": "Koror",
    "b": "Palikir",
    "c": "Ngerulmud",
    "d": "Majuro",
    "ans": "C",
    "exp": "Năm 2006, Palau chuyển thủ đô từ thành phố lớn nhất là Koror sang khu hành chính Ngerulmud thuộc bang Melekeok.",
    "tags": [
      "Địa lý",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-024",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Thành phố Sucre là thủ đô hiến định của quốc gia Nam Mỹ nào?",
    "a": "Paraguay",
    "b": "Uruguay",
    "c": "Ecuador",
    "d": "Bolivia",
    "ans": "D",
    "exp": "Bolivia có thủ đô hiến định và tư pháp là Sucre, còn trụ sở chính phủ và quốc hội đặt tại La Paz.",
    "tags": [
      "Địa lý",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-025",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Nước Cộng hòa Burundi ở khu vực Hồ Lớn châu Phi đã chuyển thủ đô chính thức từ Bujumbura sang thành phố nào vào đầu năm 2019?",
    "a": "Gitega",
    "b": "Ngozi",
    "c": "Rumonge",
    "d": "Muyinga",
    "ans": "A",
    "exp": "Đầu năm 2019, Burundi chính thức dời thủ đô chính trị từ thành phố cảng Bujumbura về Gitega nằm ở trung tâm đất nước.",
    "tags": [
      "Địa lý",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-026",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Thủ đô của vương quốc Bhutan nằm trên dãy Himalaya là thành phố nào?",
    "a": "Kathmandu",
    "b": "Thimphu",
    "c": "Paro",
    "d": "Punakha",
    "ans": "B",
    "exp": "Thimphu là thủ đô và thành phố lớn nhất của Bhutan từ năm 1961 thay cho cố đô Punakha.",
    "tags": [
      "Địa lý",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-027",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Thủ đô của Liên bang Micronesia nằm trên đảo Pohnpei có tên là gì?",
    "a": "Funafuti",
    "b": "Tarawa",
    "c": "Palikir",
    "d": "Yaren",
    "ans": "C",
    "exp": "Palikir trên đảo Pohnpei được chọn làm thủ đô của Liên bang Micronesia vào năm 1989.",
    "tags": [
      "Địa lý",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-028",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Thủ đô Astana của Kazakhstan nằm bên bờ con sông nào?",
    "a": "Sông Ural",
    "b": "Sông Ili",
    "c": "Sông Syr Darya",
    "d": "Sông Ishim",
    "ans": "D",
    "exp": "Thủ đô Astana nằm ở miền bắc Kazakhstan, hai bên bờ sông Ishim.",
    "tags": [
      "Địa lý",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-029",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Thủ đô của quốc gia Suriname ở khu vực Đông Bắc Nam Mỹ là thành phố nào?",
    "a": "Paramaribo",
    "b": "Georgetown",
    "c": "Cayenne",
    "d": "Belmopan",
    "ans": "A",
    "exp": "Paramaribo là thủ đô của Suriname, nổi tiếng với khu phố cổ kiến trúc Hà Lan được UNESCO công nhận di sản thế giới.",
    "tags": [
      "Địa lý",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-030",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Eo biển nào ngăn cách đảo Tasmania với phần đất liền của lục địa Úc?",
    "a": "Eo biển Torres",
    "b": "Eo biển Bass",
    "c": "Eo biển Cook",
    "d": "Eo biển Magellan",
    "ans": "B",
    "exp": "Eo biển Bass nằm giữa bang Victoria trên đất liền Úc và đảo Tasmania ở phía nam.",
    "tags": [
      "Địa lý",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-031",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Eo biển Bab-el-Mandeb nối liền Biển Đỏ với vùng biển nào?",
    "a": "Vịnh Ba Tư",
    "b": "Biển Địa Trung Hải",
    "c": "Vịnh Aden",
    "d": "Vịnh Oman",
    "ans": "C",
    "exp": "Eo biển Bab-el-Mandeb nằm giữa Yemen trên bán đảo Ả Rập và Djibouti, Eritrea ở vùng Sừng châu Phi, nối Biển Đỏ với vịnh Aden.",
    "tags": [
      "Địa lý",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-032",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Eo biển Palk ngăn cách lãnh thổ phía nam của Ấn Độ với quốc gia đảo nào?",
    "a": "Maldives",
    "b": "Mauritius",
    "c": "Madagascar",
    "d": "Sri Lanka",
    "ans": "D",
    "exp": "Eo biển Palk nằm giữa bang Tamil Nadu của Ấn Độ và tỉnh Phía Bắc của đảo quốc Sri Lanka.",
    "tags": [
      "Địa lý",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-033",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Eo biển Tatar ở vùng Viễn Đông Nga ngăn cách đất liền châu Á với hòn đảo lớn nào?",
    "a": "Đảo Sakhalin",
    "b": "Đảo Kamchatka",
    "c": "Đảo Hokkaido",
    "d": "Đảo Wrangel",
    "ans": "A",
    "exp": "Eo biển Tatar nối biển Nhật Bản với biển Okhotsk và ngăn cách lục địa Nga với đảo Sakhalin.",
    "tags": [
      "Địa lý",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-034",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Dòng biển lạnh Humboldt chảy dọc theo bờ biển phía tây của lục địa Nam Mỹ là nguyên nhân chính tạo nên hoang mạc nào?",
    "a": "Hoang mạc Kalahari",
    "b": "Hoang mạc Atacama",
    "c": "Hoang mạc Sonora",
    "d": "Hoang mạc Patagonia",
    "ans": "B",
    "exp": "Dòng biển lạnh Humboldt làm không khí tầng thấp bị lạnh và ổn định, ngăn cản sự hình thành mưa, tạo ra hoang mạc khô cằn Atacama.",
    "tags": [
      "Địa lý",
      "Khí hậu"
    ]
  },
  {
    "id": "q-mh500-b1-035",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Dòng biển lạnh Benguela chảy dọc bờ biển tây nam châu Phi góp phần trực tiếp hình thành hoang mạc ven biển nào?",
    "a": "Hoang mạc Sahara",
    "b": "Hoang mạc Danakil",
    "c": "Hoang mạc Namib",
    "d": "Hoang mạc Nubia",
    "ans": "C",
    "exp": "Dòng biển lạnh Benguela chảy hướng bắc dọc bờ biển Namibia tạo nên hoang mạc sương mù Namib lâu đời nhất thế giới.",
    "tags": [
      "Địa lý",
      "Khí hậu"
    ]
  },
  {
    "id": "q-mh500-b1-036",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Dòng biển nóng Kuroshio chảy ở khu vực nào của Thái Bình Dương?",
    "a": "Vùng biển phía đông nước Úc",
    "b": "Vùng biển quanh quần đảo Galapagos",
    "c": "Vùng biển phía tây Bắc Mỹ",
    "d": "Vùng biển ngoài khơi Đài Loan và Nhật Bản",
    "ans": "D",
    "exp": "Dòng biển nóng Kuroshio bắt nguồn từ ngoài khơi Philippines, chảy qua phía đông Đài Loan và dọc bờ biển Nhật Bản.",
    "tags": [
      "Địa lý",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-037",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Biển Sargasso là vùng biển duy nhất trên thế giới không có bờ biển đất liền mà được giới hạn bởi các dòng hải lưu thuộc đại dương nào?",
    "a": "Bắc Đại Tây Dương",
    "b": "Bắc Thái Bình Dương",
    "c": "Nam Ấn Độ Dương",
    "d": "Nam Đại Tây Dương",
    "ans": "A",
    "exp": "Biển Sargasso nằm ở Bắc Đại Tây Dương, được bao quanh bởi dòng Gulf Stream, dòng Bắc Đại Tây Dương, dòng Canary và dòng Bắc Xích đạo.",
    "tags": [
      "Địa lý",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-038",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Dãy núi Andes chạy dọc phía tây Nam Mỹ được hình thành do sự va chạm giữa mảng Nam Mỹ và mảng kiến tạo đại dương nào?",
    "a": "Mảng Thái Bình Dương",
    "b": "Mảng Nazca",
    "c": "Mảng Cocos",
    "d": "Mảng Scotia",
    "ans": "B",
    "exp": "Sự hút chìm của mảng đại dương Nazca xuống dưới mảng lục địa Nam Mỹ đã nâng cao dãy núi Andes.",
    "tags": [
      "Địa lý",
      "Địa chất"
    ]
  },
  {
    "id": "q-mh500-b1-039",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Đỉnh núi cao nhất của dãy núi Alps ở châu Âu là đỉnh nào?",
    "a": "Đỉnh Matterhorn",
    "b": "Đỉnh Monte Rosa",
    "c": "Đỉnh Mont Blanc",
    "d": "Đỉnh Jungfrau",
    "ans": "C",
    "exp": "Mont Blanc nằm trên biên giới Pháp và Ý với độ cao 4.808m là đỉnh núi cao nhất dãy Alps và Tây Âu.",
    "tags": [
      "Địa lý",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-040",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Hồ Tanganyika ở Đông Phi là hồ nước ngọt có chiều dài lớn nhất và độ sâu đứng thứ mấy trên thế giới?",
    "a": "Đứng thứ nhất",
    "b": "Đứng thứ tư",
    "c": "Đứng thứ ba",
    "d": "Đứng thứ hai",
    "ans": "D",
    "exp": "Hồ Tanganyika sâu tới 1.470m, là hồ sâu thứ hai và có trữ lượng nước ngọt lớn thứ hai thế giới chỉ sau hồ Baikal.",
    "tags": [
      "Địa lý",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-041",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Hồ Maracaibo giàu trữ lượng dầu mỏ nhất Nam Mỹ nằm trên lãnh thổ của quốc gia nào?",
    "a": "Venezuela",
    "b": "Colombia",
    "c": "Brazil",
    "d": "Ecuador",
    "ans": "A",
    "exp": "Hồ Maracaibo là một vịnh nước lợ lớn thông với biển Caribe nằm ở phía tây bắc Venezuela, nổi tiếng với mỏ dầu lớn và hiện tượng sét Catatumbo.",
    "tags": [
      "Địa lý",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-042",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Con sông duy nhất chảy thoát nước ra khỏi hồ Baikal ở vùng Siberia của Nga là sông nào?",
    "a": "Sông Lena",
    "b": "Sông Angara",
    "c": "Sông Selenga",
    "d": "Sông Ob",
    "ans": "B",
    "exp": "Hồ Baikal nhận nước từ hơn 330 con sông suối nhưng chỉ có duy nhất sông Angara chảy ra từ hồ để nhập vào sông Yenisei.",
    "tags": [
      "Địa lý",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-043",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Con sông Okavango ở miền nam châu Phi không đổ ra biển mà tạo thành một đồng bằng châu thổ nội địa rộng lớn nằm ở quốc gia nào?",
    "a": "Namibia",
    "b": "Zambia",
    "c": "Botswana",
    "d": "Zimbabwe",
    "ans": "C",
    "exp": "Đồng bằng châu thổ Okavango nằm trong bồn địa Kalahari của Botswana, là Di sản thiên nhiên thế giới được UNESCO công nhận năm 2014.",
    "tags": [
      "Địa lý",
      "Di sản"
    ]
  },
  {
    "id": "q-mh500-b1-044",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Di sản thế giới Petra với những công trình kiến trúc tạc trực tiếp vào vách đá sa thạch hồng nằm ở quốc gia nào?",
    "a": "Syria",
    "b": "Ả Rập Xê Út",
    "c": "Ai Cập",
    "d": "Jordan",
    "ans": "D",
    "exp": "Thành cổ Petra nằm ở miền nam Jordan, từng là kinh đô của vương quốc Nabataea cổ đại.",
    "tags": [
      "Địa lý",
      "Di sản"
    ]
  },
  {
    "id": "q-mh500-b1-045",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Quần thể nhà thờ nguyên khối Lalibela được đục hoàn toàn từ đá núi lửa nguyên tảng nằm ở quốc gia châu Phi nào?",
    "a": "Ethiopia",
    "b": "Kenya",
    "c": "Sudan",
    "d": "Eritrea",
    "ans": "A",
    "exp": "11 nhà thờ đá nguyên khối tại Lalibela được xây dựng vào thế kỷ 12-13 dưới triều đại Zagwe ở miền bắc Ethiopia.",
    "tags": [
      "Địa lý",
      "Di sản"
    ]
  },
  {
    "id": "q-mh500-b1-046",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Vườn quốc gia Göreme và các khu núi đá Cappadocia nổi tiếng với địa hình ống khói tiên nằm tại quốc gia nào?",
    "a": "Hy Lạp",
    "b": "Thổ Nhĩ Kỳ",
    "c": "Iran",
    "d": "Armenia",
    "ans": "B",
    "exp": "Vùng Cappadocia nằm ở miền trung Anatolia của Thổ Nhĩ Kỳ, là di sản hỗn hợp văn hóa và thiên nhiên của UNESCO.",
    "tags": [
      "Địa lý",
      "Di sản"
    ]
  },
  {
    "id": "q-mh500-b1-047",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Quần đảo Socotra nổi tiếng với loài cây máu rồng kỳ lạ là Di sản thiên nhiên thế giới thuộc chủ quyền của quốc gia nào?",
    "a": "Oman",
    "b": "Somalia",
    "c": "Yemen",
    "d": "Djibouti",
    "ans": "C",
    "exp": "Quần đảo Socotra nằm ở Ấn Độ Dương gần vịnh Aden, thuộc chủ quyền của Cộng hòa Yemen.",
    "tags": [
      "Địa lý",
      "Di sản"
    ]
  },
  {
    "id": "q-mh500-b1-048",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Di sản thiên nhiên thế giới Pamukkale với các bậc thang đá vôi travertine trắng xóa do suối khoáng nóng tạo thành nằm ở đâu?",
    "a": "Ý",
    "b": "Tây Ban Nha",
    "c": "Croatia",
    "d": "Thổ Nhĩ Kỳ",
    "ans": "D",
    "exp": "Pamukkale nằm ở tỉnh Denizli, miền tây nam Thổ Nhĩ Kỳ, gắn liền với thành phố cổ Hierapolis.",
    "tags": [
      "Địa lý",
      "Di sản"
    ]
  },
  {
    "id": "q-mh500-b1-049",
    "cat": "cat-geo",
    "diff": "HARD",
    "q": "Vườn quốc gia hồ Plitvice nổi tiếng với hệ thống 16 hồ nước xếp tầng nối với nhau bằng hàng chục thác nước thuộc quốc gia nào?",
    "a": "Croatia",
    "b": "Bosnia và Herzegovina",
    "c": "Slovenia",
    "d": "Montenegro",
    "ans": "A",
    "exp": "Vườn quốc gia hồ Plitvice là di sản thiên nhiên lâu đời và lớn nhất của Croatia, được UNESCO công nhận từ năm 1979.",
    "tags": [
      "Địa lý",
      "Di sản"
    ]
  },
  {
    "id": "q-mh500-b1-050",
    "cat": "cat-geo",
    "diff": "MEDIUM",
    "q": "Quần thể di tích Cố đô Huế được UNESCO công nhận là Di sản văn hóa thế giới đầu tiên của Việt Nam vào năm nào?",
    "a": "Năm 1991",
    "b": "Năm 1993",
    "c": "Năm 1994",
    "d": "Năm 1999",
    "ans": "B",
    "exp": "Quần thể di tích Cố đô Huế được UNESCO ghi danh vào tháng 12 năm 1993, mở đầu cho các di sản thế giới tại Việt Nam.",
    "tags": [
      "Địa lý",
      "Di sản"
    ]
  },
  {
    "id": "q-mh500-b1-056",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Kinh đô của nhà nước Văn Lang thời các vua Hùng được đặt tại vùng đất Phong Châu nay thuộc tỉnh nào?",
    "a": "Vĩnh Phúc",
    "b": "Thái Nguyên",
    "c": "Bắc Ninh",
    "d": "Phú Thọ",
    "ans": "D",
    "exp": "Kinh đô Phong Châu của nước Văn Lang nằm ở vùng hợp lưu ba sông Hồng, Đà, Lô thuộc tỉnh Phú Thọ ngày nay.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-057",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Theo Đại Việt sử ký toàn thư, An Dương Vương Thục Phán có tên thật là gì trước khi lập nước Âu Lạc?",
    "a": "Thục Phán",
    "b": "Thục Chế",
    "c": "Triệu Trọng Thủy",
    "d": "Cao Lỗ",
    "ans": "A",
    "exp": "An Dương Vương tên húy là Thục Phán, thủ lĩnh bộ tộc Âu Việt đã sáp nhập Lạc Việt lập ra nước Âu Lạc và xây thành Cổ Loa.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-058",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Sau khi đánh bại quân Nam Hán năm 938, Ngô Quyền xưng vương và đóng đô ở đâu?",
    "a": "Hoa Lư",
    "b": "Cổ Loa",
    "c": "Mê Linh",
    "d": "Đại La",
    "ans": "B",
    "exp": "Năm 939, Ngô Quyền bỏ chức Tiết độ sứ, xưng vương và chọn Cổ Loa làm kinh đô để nối tiếp truyền thống Âu Lạc.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-059",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Trong loạn 12 sứ quân cuối thời nhà Ngô, sứ quân Đỗ Cảnh Thạc chiếm giữ vùng căn cứ nào?",
    "a": "Đường Lâm",
    "b": "Tế Giang",
    "c": "Đỗ Động Giang",
    "d": "Hồi Hồ",
    "ans": "C",
    "exp": "Đỗ Cảnh Thạc xưng là Đỗ Cảnh Công, chiếm giữ vùng Đỗ Động Giang thuộc huyện Thanh Oai và Chương Mỹ ngày nay.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-060",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Đinh Bộ Lĩnh lên ngôi hoàng đế năm 968, đặt quốc hiệu là Đại Cồ Việt và lấy niên hiệu đầu tiên là gì?",
    "a": "Thiên Phúc",
    "b": "Thuận Thiên",
    "c": "Ứng Thiên",
    "d": "Thái Bình",
    "ans": "D",
    "exp": "Năm 970, Đinh Tiên Hoàng đặt niên hiệu là Thái Bình, đây là niên hiệu độc lập đầu tiên được đúc trên đồng tiền Thái Bình hưng bảo.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-061",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Trong cuộc kháng chiến chống Tống năm 981, Lê Hoàn đã bố trí trận địa cọc ngầm tiêu diệt thủy quân của Lưu Trừng trên con sông nào?",
    "a": "Sông Bạch Đằng",
    "b": "Sông Như Nguyệt",
    "c": "Sông Thương",
    "d": "Sông Lục Đầu",
    "ans": "A",
    "exp": "Đầu năm 981, Lê Hoàn chỉ huy quân Đại Cồ Việt đóng cọc chặn đánh thủy quân Tống trên sông Bạch Đằng và chém tướng Hầu Nhân Bảo ở Lục Đầu.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-062",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Vị vua nào của triều Lý đã đổi quốc hiệu nước ta từ Đại Cồ Việt thành Đại Việt vào năm 1054?",
    "a": "Lý Thái Tổ",
    "b": "Lý Thánh Tông",
    "c": "Lý Thái Tông",
    "d": "Lý Nhân Tông",
    "ans": "B",
    "exp": "Ngay sau khi lên ngôi năm 1054, vua Lý Thánh Tông đã đổi quốc hiệu từ Đại Cồ Việt thành Đại Việt.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-063",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Năm 1075, Lý Thường Kiệt cùng Tông Đản chỉ huy quân Đại Việt thực hiện cuộc tập kích Tiên phát chế nhân hạ thành nào lớn nhất của nhà Tống ở Quảng Tây?",
    "a": "Thành Khâm Châu",
    "b": "Thành Liêm Châu",
    "c": "Thành Ung Châu",
    "d": "Thành Quế Châu",
    "ans": "C",
    "exp": "Sau 42 ngày vây hãm ác liệt, quân Lý Thường Kiệt đã hạ được thành Ung Châu do Tô Giám trấn giữ, phá hủy căn cứ hậu cần của quân Tống.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-064",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Bộ luật thành văn đầu tiên trong lịch sử phong kiến Việt Nam được ban hành năm 1042 dưới thời vua Lý Thái Tông có tên là gì?",
    "a": "Quốc triều hình luật",
    "b": "Hoàng Việt luật lệ",
    "c": "Hình luật",
    "d": "Hình thư",
    "ans": "D",
    "exp": "Năm 1042, vua Lý Thái Tông ban hành bộ Hình thư gồm 3 quyển, đánh dấu sự ra đời của bộ luật thành văn đầu tiên ở nước ta.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-065",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Hội thề Đồng Cổ do vua Lý Thái Tông lập ra năm 1028 sau loạn Tam vương quy định bá quan văn võ hàng năm phải đến thề giữ lòng trung hiếu tại ngôi đền ở đâu?",
    "a": "Phường Yên Thái, Thăng Long",
    "b": "Bờ hồ Lục Thủy",
    "c": "Chùa Một Cột",
    "d": "Phủ Thiên Trường",
    "ans": "A",
    "exp": "Đền Đồng Cổ nằm ở vùng Bưởi, phường Yên Thái thuộc kinh thành Thăng Long, là nơi tổ chức Hội thề Trung hiếu suốt thời Lý - Trần.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-066",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Trận Đông Bộ Đầu vào tháng 1 năm 1258 đánh bại quân Mông Cổ lần thứ nhất diễn ra ở khu vực nào hiện nay?",
    "a": "Thành phố Hải Phòng",
    "b": "Quận Ba Đình, Hà Nội",
    "c": "Tỉnh Bắc Ninh",
    "d": "Thành phố Nam Định",
    "ans": "B",
    "exp": "Bến Đông Bộ Đầu nằm bên bờ sông Hồng, khu vực dốc Hàng Than, quận Ba Đình, Hà Nội ngày nay.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-067",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Vị tướng nhà Trần nào đã chỉ huy trận Vân Đồn tiêu diệt đoàn thuyền lương của Trương Văn Hổ trong cuộc kháng chiến chống Nguyên năm 1288?",
    "a": "Trần Quang Khải",
    "b": "Trần Nhật Duật",
    "c": "Trần Khánh Dư",
    "d": "Phạm Ngũ Lão",
    "ans": "C",
    "exp": "Nhân Huệ vương Trần Khánh Dư phục kích tại Vân Đồn tiêu diệt đoàn thuyền lương của Trương Văn Hổ khiến quân Thoát Hoan lâm vào cảnh thiếu lương trầm trọng.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-068",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Sau khi nhường ngôi và xuất gia tu hành tại núi Yên Tử năm 1299, Phật hoàng Trần Nhân Tông lấy hiệu là gì?",
    "a": "Huyền Quang tôn giả",
    "b": "Pháp Loa tôn giả",
    "c": "Phù Vân Quốc Sư",
    "d": "Hương Vân Đại Đầu Đà",
    "ans": "D",
    "exp": "Trần Nhân Tông tu ở Yên Tử lấy đạo hiệu là Hương Vân Đại Đầu Đà hay Trúc Lâm Đại Sĩ, sáng lập Thiền phái Trúc Lâm.",
    "tags": [
      "Lịch sử",
      "Văn hóa"
    ]
  },
  {
    "id": "q-mh500-b1-069",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Danh thần Chu Văn An dưới triều vua Trần Dụ Tông đã dâng tờ sớ nào xin chém 7 tên gian thần nhưng không được vua chấp thuận nên từ quan về núi Phượng Hoàng?",
    "a": "Thất trảm sớ",
    "b": "Bình Ngô đại cáo",
    "c": "Vạn ngôn thư",
    "d": "Điều trần thất sự",
    "ans": "A",
    "exp": "Chu Văn An dâng Thất trảm sớ xin chém 7 quyền thần tham nhũng, khi vua không nghe ông đã cáo quan về dạy học ở Chí Linh, Hải Dương.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-070",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Năm 1396, Hồ Quý Ly bắt đầu cho phát hành loại tiền giấy đầu tiên trong lịch sử Việt Nam có tên gọi là gì?",
    "a": "Thiên Phúc trấn bảo",
    "b": "Thông bảo hội sao",
    "c": "Thánh Nguyên thông bảo",
    "d": "Thuận Thiên nguyên bảo",
    "ans": "B",
    "exp": "Thông bảo hội sao được Hồ Quý Ly ban hành năm 1396 để thu hồi tiền đồng, là tiền giấy đầu tiên của Việt Nam.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-071",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Ai là công trình sư lỗi lạc người Việt đã chế tạo súng thần cơ và thuyền cổ lầu hai tầng cho nhà Hồ trước khi bị nhà Minh bắt đưa về Bắc Kinh?",
    "a": "Cao Lỗ",
    "b": "Nguyễn An",
    "c": "Hồ Nguyên Trừng",
    "d": "Lương Thế Vinh",
    "ans": "C",
    "exp": "Hồ Nguyên Trừng là con trưởng của Hồ Quý Ly, người chế tạo súng Thần cơ và sau khi bị bắt sang Minh đã được phong tới chức Thượng thư bộ Công.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-072",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Hội thề Lũng Nhai năm 1416 gồm Lê Lợi và 18 người bạn chiến đấu cùng cắt máu ăn thề đánh giặc Minh diễn ra tại tỉnh nào ngày nay?",
    "a": "Nghệ An",
    "b": "Ninh Bình",
    "c": "Hà Tĩnh",
    "d": "Thanh Hóa",
    "ans": "D",
    "exp": "Hội thề Lũng Nhai diễn ra tại vùng núi huyện Thường Xuân, tỉnh Thanh Hóa vào đầu năm 1416, đặt nền móng cho khởi nghĩa Lam Sơn.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-073",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Trong trận Chi Lăng - Xương Giang cuối năm 1427, vị tổng binh chỉ huy 10 vạn viện binh nhà Minh bị nghĩa quân Lam Sơn chém đầu tại núi Mã Yên là ai?",
    "a": "Liễu Thăng",
    "b": "Vương Thông",
    "c": "Mộc Thạnh",
    "d": "Lương Minh",
    "ans": "A",
    "exp": "An Viễn hầu Liễu Thăng dẫn đầu viện binh tiến vào ải Chi Lăng và bị quân Lam Sơn do Lê Sát, Lưu Nhân Chú phục kích giết chết tại núi Mã Yên.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-074",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Dưới triều vua Lê Thánh Tông, bản đồ địa lý và hành chính hoàn chỉnh đầu tiên của quốc gia Đại Việt được vẽ xong năm 1490 có tên là gì?",
    "a": "Đại Nam nhất thống toàn đồ",
    "b": "Hồng Đức bản đồ",
    "c": "An Nam tứ chí lộ đồ",
    "d": "Giáp Ngọ niên bình Nam đồ",
    "ans": "B",
    "exp": "Hồng Đức bản đồ hay Thiên Nam dư hạ tập bản đồ được hoàn thành năm Hồng Đức thứ 21 gồm kinh đô Trung Đô và 13 xứ thừa tuyên.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-075",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Triều nhà Mạc do Mạc Đăng Dung sáng lập năm 1527 sau khi mất Thăng Long năm 1592 đã rút lên giữ vùng đất nào kéo dài thêm hơn 80 năm?",
    "a": "Lạng Sơn",
    "b": "Thái Nguyên",
    "c": "Cao Bằng",
    "d": "Tuyên Quang",
    "ans": "C",
    "exp": "Từ năm 1593 đến năm 1677, hậu duệ nhà Mạc đóng đô ở Cao Bằng dưới sự bảo hộ ngoại giao của nhà Minh và nhà Thanh.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-076",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Hệ thống lũy phòng thủ kiên cố do Đào Duy Từ thiết kế giúp chúa Nguyễn chống lại các cuộc tấn công của chúa Trịnh ở Quảng Bình được gọi là gì?",
    "a": "Lũy Cổ Loa",
    "b": "Thành Đa Bang",
    "c": "Phòng tuyến Tam Điệp",
    "d": "Lũy Thầy",
    "ans": "D",
    "exp": "Hệ thống lũy Trường Dục và lũy Nhật Lệ ở Quảng Bình do Đào Duy Từ chỉ đạo đắp nên được tôn kính gọi là Lũy Thầy.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-077",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Trong cuộc chiến tranh Trịnh - Nguyễn, con sông nào ở tỉnh Quảng Bình trở thành ranh giới chia cắt Đàng Trong và Đàng Ngoài suốt hơn một thế kỷ?",
    "a": "Sông Gianh",
    "b": "Sông Nhật Lệ",
    "c": "Sông Bến Hải",
    "d": "Sông Kiến Giang",
    "ans": "A",
    "exp": "Sau cuộc giao tranh thứ 7 năm 1672 bất phân thắng bại, sông Gianh tức Linh Giang trở thành ranh giới giữa Đàng Ngoài của chúa Trịnh và Đàng Trong của chúa Nguyễn.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-078",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Trận thủy chiến Rạch Gầm - Xoài Mút năm 1785 do Nguyễn Huệ chỉ huy đã tiêu diệt gần 5 vạn quân xâm lược của nước nào?",
    "a": "Nhà Thanh",
    "b": "Xiêm La",
    "c": "Miến Điện",
    "d": "Bồ Đào Nha",
    "ans": "B",
    "exp": "Đầu năm 1785, Nguyễn Huệ bố trí trận địa phục kích trên sông Tiền đoạn từ Rạch Gầm đến Xoài Mút, tiêu diệt quân Xiêm do Chiêu Tăng, Chiêu Sương chỉ huy.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-079",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Trước khi tiến quân ra Bắc đại phá quân Thanh dịp Tết Kỷ Dậu năm 1789, Nguyễn Huệ lên ngôi Hoàng đế lấy niên hiệu Quang Trung tại ngọn núi nào ở Phú Xuân?",
    "a": "Núi Ngự Bình",
    "b": "Núi Thiên Ấn",
    "c": "Núi Bân",
    "d": "Núi Hồng Lĩnh",
    "ans": "C",
    "exp": "Ngày 25 tháng Chạp năm Mậu Thân tức 22/12/1788, Nguyễn Huệ cho đắp đàn Nam Giao tại núi Bân ở Huế để tế đất trời và lên ngôi Hoàng đế.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-080",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Vị vua nào của vương triều Nguyễn đã đổi quốc hiệu nước ta từ Việt Nam thành Đại Nam vào năm 1838?",
    "a": "Vua Gia Long",
    "b": "Vua Tự Đức",
    "c": "Vua Thiệu Trị",
    "d": "Vua Minh Mạng",
    "ans": "D",
    "exp": "Năm 1838, vua Minh Mạng đổi quốc hiệu từ Việt Nam sang Đại Nam và chính thức áp dụng từ đầu năm Kỷ Hợi 1839.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-081",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Công trình thủy lợi đào kênh Vĩnh Tế nối liền Châu Đốc với Hà Tiên dưới thời vua Gia Long và Minh Mạng do vị danh thần nào trực tiếp tổng đốc thi công?",
    "a": "Thoại Ngọc Hầu",
    "b": "Nguyễn Công Trứ",
    "c": "Lê Văn Duyệt",
    "d": "Trương Minh Giảng",
    "ans": "A",
    "exp": "Danh tướng Nguyễn Văn Thoại tức Thoại Ngọc Hầu chỉ huy đào kênh Vĩnh Tế từ năm 1819 đến 1824, đặt tên kênh theo tên vợ ông là bà Châu Thị Vĩnh Tế.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-082",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Sau vụ biến kinh thành Huế tháng 7 năm 1885, phụ chính đại thần Tôn Thất Thuyết đã đưa vua Hàm Nghi ra sơn phòng Tân Sở ở tỉnh nào để hạ chiếu Cần Vương?",
    "a": "Quảng Bình",
    "b": "Quảng Trị",
    "c": "Hà Tĩnh",
    "d": "Nghệ An",
    "ans": "B",
    "exp": "Thành Tân Sở nằm tại huyện Cam Lộ, tỉnh Quảng Trị, là nơi vua Hàm Nghi ban chiếu Cần Vương ngày 13 tháng 7 năm 1885.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-083",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Hiệp ước nào ký ngày 6 tháng 6 năm 1884 giữa triều đình Huế và thực dân Pháp đã chính thức chấm dứt tư cách quốc gia độc lập của Đại Nam?",
    "a": "Hiệp ước Nhâm Tuất",
    "b": "Hiệp ước Giáp Tuất",
    "c": "Hiệp ước Patenôtre",
    "d": "Hiệp ước Harmand",
    "ans": "C",
    "exp": "Hiệp ước Patenôtre tức Hòa ước Giáp Thân ký ngày 6/6/1884 là văn bản pháp lý cuối cùng xác lập chế độ bảo hộ của Pháp trên toàn cõi Việt Nam.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-084",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Phong trào Đông Du đầu thế kỷ 20 đưa thanh niên Việt Nam sang Nhật Bản học tập do nhà chí sĩ yêu nước nào khởi xướng?",
    "a": "Phan Châu Trinh",
    "b": "Lương Văn Can",
    "c": "Huỳnh Thúc Kháng",
    "d": "Phan Bội Châu",
    "ans": "D",
    "exp": "Phan Bội Châu lập Hội Duy Tân năm 1904 và phát động phong trào Đông Du từ năm 1905 đưa thanh niên sang Nhật Bản đào tạo nhân tài cứu nước.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-085",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Cuộc khởi nghĩa Yên Bái nổ ra vào đêm ngày 9 tháng 2 năm 1930 do tổ chức chính trị yêu nước nào lãnh đạo?",
    "a": "Việt Nam Quốc dân Đảng",
    "b": "Tân Việt Cách mạng Đảng",
    "c": "Đông Dương Cộng sản Đảng",
    "d": "Hội Việt Nam Cách mạng Thanh niên",
    "ans": "A",
    "exp": "Khởi nghĩa Yên Bái do Việt Nam Quốc dân Đảng đứng đầu là Nguyễn Thái Học và Phó Đức Chính phát động vào tháng 2 năm 1930.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-086",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Chiến dịch Biên giới thu đông năm 1950 mở màn bằng trận đánh tiêu diệt cứ điểm nào trên đường số 4 thuộc tỉnh Cao Bằng?",
    "a": "Cứ điểm Thất Khê",
    "b": "Cứ điểm Đông Khê",
    "c": "Cứ điểm Đình Lập",
    "d": "Cứ điểm Na Sầm",
    "ans": "B",
    "exp": "Sáng 16/9/1950, quân đội Việt Nam nổ súng tấn công cụm cứ điểm Đông Khê, mở màn thắng lợi cho Chiến dịch Biên giới thu đông 1950.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-087",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Hiệp định Genève về chấm dứt chiến tranh và lập lại hòa bình ở Đông Dương được ký kết vào ngày tháng năm nào?",
    "a": "Ngày 7 tháng 5 năm 1954",
    "b": "Ngày 10 tháng 10 năm 1954",
    "c": "Ngày 20 tháng 7 năm 1954",
    "d": "Ngày 27 tháng 1 năm 1973",
    "ans": "C",
    "exp": "Hiệp định Genève được ký kết vào đêm ngày 20 rạng sáng ngày 21 tháng 7 năm 1954 tại Thụy Sĩ.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-088",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Trong Chiến dịch Điện Biên Phủ năm 1954, đồi A1 là cứ điểm phòng ngự then chốt nằm ở phân khu nào của tập đoàn cứ điểm?",
    "a": "Phân khu Bắc",
    "b": "Cụm cứ điểm Him Lam",
    "c": "Phân khu Nam",
    "d": "Phân khu Trung tâm",
    "ans": "D",
    "exp": "Đồi A1 tức Eliane 2 nằm ở phía đông Phân khu Trung tâm Mường Thanh, được coi là chiếc chìa khóa bảo vệ sở chỉ huy của tướng De Castries.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-089",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Trưởng phái đoàn Chính phủ Cách mạng lâm thời Cộng hòa miền Nam Việt Nam đặt bút ký Hiệp định Paris ngày 27 tháng 1 năm 1973 là ai?",
    "a": "Nguyễn Thị Bình",
    "b": "Xuân Thủy",
    "c": "Lê Đức Thọ",
    "d": "Phạm Văn Đồng",
    "ans": "A",
    "exp": "Bà Nguyễn Thị Bình trên cương vị Bộ trưởng Ngoại giao Chính phủ Cách mạng lâm thời Cộng hòa miền Nam Việt Nam là người phụ nữ duy nhất ký vào Hiệp định Paris.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-090",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Chiến dịch Tây Nguyên mở màn cho cuộc Tổng tiến công và nổi dậy mùa Xuân năm 1975 lấy thị xã nào làm mục tiêu đột phá mở đầu?",
    "a": "Thị xã Pleiku",
    "b": "Thị xã Buôn Ma Thuột",
    "c": "Thị xã Kon Tum",
    "d": "Thị xã Gia Nghĩa",
    "ans": "B",
    "exp": "Trận đánh giải phóng thị xã Buôn Ma Thuột ngày 10-11/3/1975 là đòn điểm huyệt mở màn cho Chiến dịch Tây Nguyên và đại thắng mùa Xuân 1975.",
    "tags": [
      "Lịch sử",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b1-091",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Vị Pharaoh nào được lịch sử ghi nhận là người đã thống nhất Thượng Ai Cập và Hạ Ai Cập vào khoảng năm 3100 trước Công nguyên?",
    "a": "Ramesses II",
    "b": "Tutankhamun",
    "c": "Narmer",
    "d": "Khufu",
    "ans": "C",
    "exp": "Vua Narmer hay Menes là người thống nhất Thượng và Hạ Ai Cập, sáng lập Vương triều thứ nhất của Ai Cập cổ đại.",
    "tags": [
      "Lịch sử",
      "Cổ đại"
    ]
  },
  {
    "id": "q-mh500-b1-092",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Vị Pharaoh thuộc Vương triều thứ 18 của Ai Cập cổ đại đã tiến hành cuộc cải cách tôn giáo độc thần tôn thờ thần đĩa mặt trời Aten là ai?",
    "a": "Thutmose III",
    "b": "Hatshepsut",
    "c": "Amenhotep II",
    "d": "Akhenaten",
    "ans": "D",
    "exp": "Pharaoh Amenhotep IV đổi tên thành Akhenaten, phế bỏ tục thờ đa thần Amun để độc tôn thờ thần mặt trời Aten và xây kinh đô mới Amarna.",
    "tags": [
      "Lịch sử",
      "Cổ đại"
    ]
  },
  {
    "id": "q-mh500-b1-093",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Bộ luật Hammurabi nổi tiếng của vương quốc Babylon cổ đại ở vùng Lưỡng Hà được khắc bằng chữ hình nêm trên chất liệu gì?",
    "a": "Cột đá bazan đen",
    "b": "Bảng đất sét nung",
    "c": "Tấm đồng đúc",
    "d": "Giấy cói Papyrus",
    "ans": "A",
    "exp": "Bộ luật Hammurabi gồm 282 điều luật được khắc trên một cột đá bazan đen cao 2,25m, hiện trưng bày tại bảo tàng Louvre ở Pháp.",
    "tags": [
      "Lịch sử",
      "Cổ đại"
    ]
  },
  {
    "id": "q-mh500-b1-094",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Tộc người nào ở miền nam vùng Lưỡng Hà cổ đại được coi là chủ nhân đầu tiên phát minh ra hệ thống chữ viết hình nêm vào khoảng thiên niên kỷ thứ 4 TCN?",
    "a": "Người Akkad",
    "b": "Người Sumer",
    "c": "Người Assyria",
    "d": "Người Phoenicia",
    "ans": "B",
    "exp": "Người Sumer định cư ở hạ lưu sông Tigris và Euphrates là những người đầu tiên xây dựng các thành bang và sáng tạo ra chữ hình nêm trên đất sét.",
    "tags": [
      "Lịch sử",
      "Cổ đại"
    ]
  },
  {
    "id": "q-mh500-b1-095",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Cuộc chiến tranh Peloponnese kéo dài từ năm 431 đến 404 TCN trong lịch sử Hy Lạp cổ đại là cuộc đối đầu giữa hai liên minh do hai thành bang nào đứng đầu?",
    "a": "Athens và Thebes",
    "b": "Sparta và Corinth",
    "c": "Athens và Sparta",
    "d": "Macedonia và Athens",
    "ans": "C",
    "exp": "Chiến tranh Peloponnese diễn ra giữa Liên minh Delos do Athens cầm đầu và Liên minh Peloponnese do Sparta lãnh đạo, kết thúc với sự thất bại của Athens.",
    "tags": [
      "Lịch sử",
      "Cổ đại"
    ]
  },
  {
    "id": "q-mh500-b1-096",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Năm 331 TCN, Alexander Đại đế đã đánh bại hoàn toàn đại quân của hoàng đế Ba Tư Darius III trong trận quyết chiến lịch sử nào tại vùng Lưỡng Hà?",
    "a": "Trận Marathon",
    "b": "Trận Chaeronea",
    "c": "Trận Salamis",
    "d": "Trận Gaugamela",
    "ans": "D",
    "exp": "Chiến thắng tại trận Gaugamela năm 331 TCN giúp Alexander Đại đế tiêu diệt đế chế Achaemenes của Ba Tư.",
    "tags": [
      "Lịch sử",
      "Cổ đại"
    ]
  },
  {
    "id": "q-mh500-b1-097",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Trong cuộc chiến tranh Punic lần thứ hai, danh tướng Hannibal Barca của Carthage đã dẫn đoàn quân cùng voi chiến vượt qua dãy núi nào để tấn công La Mã từ phía bắc?",
    "a": "Dãy núi Alps",
    "b": "Dãy núi Pyrenees",
    "c": "Dãy núi Apennines",
    "d": "Dãy núi Carpathian",
    "ans": "A",
    "exp": "Năm 218 TCN, Hannibal thực hiện cuộc hành quân táo bạo vượt dãy núi Alps phủ đầy tuyết để tiến vào bán đảo Ý.",
    "tags": [
      "Lịch sử",
      "Cổ đại"
    ]
  },
  {
    "id": "q-mh500-b1-098",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Vị hoàng đế La Mã nào đã ban hành Sắc lệnh Milan năm 313 hợp pháp hóa Kitô giáo và dời đô về thành phố mang tên mình tại Byzantium?",
    "a": "Hoàng đế Augustus",
    "b": "Hoàng đế Constantine Đại đế",
    "c": "Hoàng đế Trajan",
    "d": "Hoàng đế Diocletian",
    "ans": "B",
    "exp": "Constantine I ban hành Sắc lệnh Milan năm 313 chấm dứt việc bức hại người Công giáo và lập kinh đô mới Constantinople năm 330.",
    "tags": [
      "Lịch sử",
      "Cổ đại"
    ]
  },
  {
    "id": "q-mh500-b1-099",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Khu di tích thành phố cổ Chichen Itza với kim tự tháp Kukulkan nổi tiếng là trung tâm văn hóa của nền văn minh nào tại bán đảo Yucatan?",
    "a": "Văn minh Inca",
    "b": "Văn minh Olmec",
    "c": "Văn minh Maya",
    "d": "Văn minh Nazca",
    "ans": "C",
    "exp": "Chichen Itza nằm ở bang Yucatan của Mexico, là một trong những đô thị quan trọng nhất của nền văn minh Maya thời kỳ Hậu Cổ điển.",
    "tags": [
      "Lịch sử",
      "Văn hóa"
    ]
  },
  {
    "id": "q-mh500-b1-100",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Tác phẩm sử thi thần thoại kể về nguồn gốc vũ trụ và lịch sử của người K'iche' thuộc nền văn minh Maya tại vùng cao nguyên Guatemala có tên là gì?",
    "a": "Sử thi Gilgamesh",
    "b": "Mahabharata",
    "c": "Chilam Balam",
    "d": "Popol Vuh",
    "ans": "D",
    "exp": "Popol Vuh nghĩa là Sách của Cộng đồng, là văn bản thiêng liêng quý giá nhất còn lưu giữ thần thoại sáng thế của người Maya.",
    "tags": [
      "Lịch sử",
      "Văn hóa"
    ]
  },
  {
    "id": "q-mh500-b1-101",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Văn kiện hiến pháp sơ khai Đại Hiến Chương Magna Carta nhằm giới hạn quyền lực tuyệt đối của nhà vua Anh được vua John ký vào năm nào?",
    "a": "Năm 1215",
    "b": "Năm 1066",
    "c": "Năm 1453",
    "d": "Năm 1689",
    "ans": "A",
    "exp": "Tháng 6 năm 1215, trước sức ép của các nam tước nổi dậy, vua John của nước Anh đã phải đóng dấu thông qua Magna Carta tại Runnymede.",
    "tags": [
      "Lịch sử",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-102",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Đế quốc Đông La Mã tức Byzantine chính thức sụp đổ vào năm 1453 khi thành Constantinople thất thủ trước đội quân của vị Sultan Ottoman nào?",
    "a": "Suleiman Đại đế",
    "b": "Mehmed II",
    "c": "Selim I",
    "d": "Osman I",
    "ans": "B",
    "exp": "Ngày 29/5/1453, Sultan Mehmed II mới 21 tuổi chỉ huy quân Ottoman dùng đại bác khổng lồ công phá thành Constantinople, chấm dứt hơn 1.000 năm tồn tại của Đế quốc Đông La Mã.",
    "tags": [
      "Lịch sử",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-103",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Hòa ước Westphalia được ký kết vào năm 1648 đặt nền móng cho trật tự quốc gia có chủ quyền hiện đại đã kết thúc cuộc chiến tranh tôn giáo kéo dài bao nhiêu năm ở châu Âu?",
    "a": "Chiến tranh Trăm năm",
    "b": "Chiến tranh Bảy năm",
    "c": "Chiến tranh Ba mươi năm",
    "d": "Chiến tranh Hoa Hồng",
    "ans": "C",
    "exp": "Hòa ước Westphalia năm 1648 đã chấm dứt cuộc Chiến tranh Ba mươi năm bắt đầu từ năm 1618 tại Đế quốc La Mã Thần thánh.",
    "tags": [
      "Lịch sử",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-104",
    "cat": "cat-his",
    "diff": "HARD",
    "q": "Trong cuộc Cách mạng Pháp, sự kiện chính biến ngày 9 tháng Thermidor năm II tức ngày 27/7/1794 đã lật đổ và đưa nhân vật đứng đầu phái Jacobin nào lên máy chém?",
    "a": "Georges Danton",
    "b": "Jean-Paul Marat",
    "c": "Camille Desmoulins",
    "d": "Maximilien Robespierre",
    "ans": "D",
    "exp": "Cuộc đảo chính ngày 9 tháng Nhiệt đã lật đổ nền chuyên chính Jacobin và xử tử Maximilien Robespierre vào ngày hôm sau.",
    "tags": [
      "Lịch sử",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b1-105",
    "cat": "cat-his",
    "diff": "MEDIUM",
    "q": "Cuộc cải cách Minh Trị Duy Tân đưa Nhật Bản từ một nước phong kiến trở thành cường quốc công nghiệp hiện đại bắt đầu vào năm nào?",
    "a": "Năm 1868",
    "b": "Năm 1853",
    "c": "Năm 1889",
    "d": "Năm 1905",
    "ans": "A",
    "exp": "Năm 1868, Thiên hoàng Minh Trị giành lại quyền lực từ Mạc phủ Tokugawa, dời đô về Tokyo và bắt đầu công cuộc Duy Tân.",
    "tags": [
      "Lịch sử",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b2-001",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Hiện tượng ánh sáng trắng bị tách thành dải màu cầu vồng khi đi qua lăng kính được gọi là hiện tượng gì?",
    "a": "Giao thoa ánh sáng",
    "b": "Tán sắc ánh sáng",
    "c": "Nhiễu xạ ánh sáng",
    "d": "Phản xạ toàn phần",
    "ans": "B",
    "exp": "Tán sắc ánh sáng là sự phân tách một chùm sáng phức tạp thành các chùm sáng đơn sắc khác nhau do chiết suất của môi trường phụ thuộc vào bước sóng.",
    "tags": [
      "Khoa học",
      "Vật lý",
      "Quang học"
    ]
  },
  {
    "id": "q-mh500-b2-002",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Nguyên lý bất định trong cơ học lượng tử khẳng định không thể xác định đồng thời chính xác vị trí và động lượng của một hạt do ai đề xuất?",
    "a": "Erwin Schrodinger",
    "b": "Max Planck",
    "c": "Werner Heisenberg",
    "d": "Niels Bohr",
    "ans": "C",
    "exp": "Werner Heisenberg công bố nguyên lý bất định vào năm 1927, đặt nền móng quan trọng cho cơ học lượng tử hiện đại.",
    "tags": [
      "Khoa học",
      "Vật lý",
      "Lượng tử"
    ]
  },
  {
    "id": "q-mh500-b2-003",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Trong bảng tuần hoàn các nguyên tố hóa học, kim loại nào có nhiệt độ nóng chảy cao nhất?",
    "a": "Titan",
    "b": "Platin",
    "c": "Crom",
    "d": "Vonfram",
    "ans": "D",
    "exp": "Vonfram có nhiệt độ nóng chảy lên tới khoảng 3422 độ C, cao nhất trong tất cả các kim loại nên thường dùng làm dây tóc bóng đèn.",
    "tags": [
      "Khoa học",
      "Hóa học"
    ]
  },
  {
    "id": "q-mh500-b2-004",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Ranh giới xung quanh một hố đen mà từ đó không một vật chất hay bức xạ điện từ nào có thể thoát ra ngoài được gọi là gì?",
    "a": "Chân trời sự kiện",
    "b": "Điểm kỳ dị không thời gian",
    "c": "Đĩa bồi tụ bức xạ",
    "d": "Giới hạn Chandrasekhar",
    "ans": "A",
    "exp": "Chân trời sự kiện là ranh giới không thời gian quanh hố đen, nơi vận tốc thoát vượt quá vận tốc ánh sáng.",
    "tags": [
      "Khoa học",
      "Thiên văn",
      "Vũ trụ"
    ]
  },
  {
    "id": "q-mh500-b2-005",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Định luật nào trong nhiệt động lực học khẳng định rằng entropy của một hệ cô lập không bao giờ giảm theo thời gian?",
    "a": "Định luật thứ không",
    "b": "Định luật thứ nhất",
    "c": "Định luật thứ hai",
    "d": "Định luật thứ ba",
    "ans": "C",
    "exp": "Định luật thứ hai của nhiệt động lực học nêu rõ tổng entropy của một hệ cô lập luôn tăng hoặc giữ nguyên trong quá trình thuận nghịch.",
    "tags": [
      "Khoa học",
      "Vật lý"
    ]
  },
  {
    "id": "q-mh500-b2-006",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Khối lượng tối đa mà một ngôi sao lùn trắng có thể đạt được trước khi suy sụp thành sao neutron hoặc nổ siêu tân tinh được gọi là gì?",
    "a": "Giới hạn Eddington",
    "b": "Giới hạn Chandrasekhar",
    "c": "Giới hạn Roche",
    "d": "Giới hạn Tolman Oppenheimer Volkoff",
    "ans": "B",
    "exp": "Giới hạn Chandrasekhar xấp xỉ 1,44 lần khối lượng Mặt Trời, là ngưỡng khối lượng tối đa của một sao lùn trắng ổn định.",
    "tags": [
      "Khoa học",
      "Thiên văn"
    ]
  },
  {
    "id": "q-mh500-b2-007",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Hợp chất hóa học nào là thành phần chính tạo nên đá vôi, phấn viết và vỏ của nhiều loài sinh vật biển?",
    "a": "Canxi sunfat",
    "b": "Canxi cacbonat",
    "c": "Canxi hidroxit",
    "d": "Canxi clorua",
    "ans": "B",
    "exp": "Canxi cacbonat có công thức CaCO3 là thành phần khoáng chất chính của đá vôi, đá cẩm thạch, san hô và vỏ sò.",
    "tags": [
      "Khoa học",
      "Hóa học"
    ]
  },
  {
    "id": "q-mh500-b2-008",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Nhà toán học nào đã chứng minh thành công Định lý cuối cùng của Fermat vào năm 1994 sau hơn 350 năm thách thức nhân loại?",
    "a": "Grigori Perelman",
    "b": "Terence Tao",
    "c": "Andrew Wiles",
    "d": "John Nash",
    "ans": "C",
    "exp": "Nhà toán học người Anh Andrew Wiles đã hoàn tất bản chứng minh Định lý cuối cùng của Fermat vào năm 1994 nhờ lý thuyết đường cong elliptic.",
    "tags": [
      "Khoa học",
      "Toán học"
    ]
  },
  {
    "id": "q-mh500-b2-009",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Vệ tinh tự nhiên lớn nhất của Sao Thổ và là vệ tinh duy nhất trong Hệ Mặt Trời sở hữu bầu khí quyển dày đặc là gì?",
    "a": "Enceladus",
    "b": "Ganymede",
    "c": "Europa",
    "d": "Titan",
    "ans": "D",
    "exp": "Titan là vệ tinh lớn nhất của Sao Thổ, nổi tiếng với bầu khí quyển giàu nitơ và các hồ hydrocarbon lỏng trên bề mặt.",
    "tags": [
      "Khoa học",
      "Thiên văn"
    ]
  },
  {
    "id": "q-mh500-b2-010",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Hỗn hợp axit clohidric đặc và axit nitric đặc theo tỷ lệ mol 3 chia 1 có khả năng hòa tan được vàng gọi là gì?",
    "a": "Nước cường toan",
    "b": "Dung dịch Piranha",
    "c": "Oleum",
    "d": "Axit fomic",
    "ans": "A",
    "exp": "Nước cường toan hay nước hoàng đế là hỗn hợp 3 phần thể tích HCl đặc và 1 phần HNO3 đặc, hòa tan được vàng và bạch kim.",
    "tags": [
      "Khoa học",
      "Hóa học"
    ]
  },
  {
    "id": "q-mh500-b2-011",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Trong vật lý điện từ, định luật nào phát biểu rằng suất điện động cảm ứng luôn có chiều chống lại nguyên nhân sinh ra nó?",
    "a": "Định luật Ampere",
    "b": "Định luật Lenz",
    "c": "Định luật Coulomb",
    "d": "Định luật Gauss",
    "ans": "B",
    "exp": "Định luật Lenz xác định chiều của dòng điện cảm ứng xuất hiện trong mạch kín khi từ thông qua mạch biến thiên.",
    "tags": [
      "Khoa học",
      "Vật lý",
      "Điện từ"
    ]
  },
  {
    "id": "q-mh500-b2-012",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Trong Mô hình Chuẩn của vật lý hạt, hạt cơ bản nào chịu trách nhiệm truyền tương tác mạnh gắn kết các hạt quark?",
    "a": "Photon",
    "b": "Boson W và Z",
    "c": "Gluon",
    "d": "Boson Higgs",
    "ans": "C",
    "exp": "Gluon là hạt boson chuẩn đóng vai trò hạt truyền lực tương tác mạnh giữa các quark trong proton và neutron.",
    "tags": [
      "Khoa học",
      "Vật lý",
      "Hạt nhân"
    ]
  },
  {
    "id": "q-mh500-b2-013",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Nguyên tố phi kim nào là chất lỏng có màu nâu đỏ ở điều kiện nhiệt độ và áp suất phòng tiêu chuẩn?",
    "a": "Clo",
    "b": "Iốt",
    "c": "Flo",
    "d": "Brom",
    "ans": "D",
    "exp": "Ở điều kiện thường, chỉ có hai nguyên tố tồn tại ở trạng thái lỏng là kim loại thủy ngân và phi kim brom.",
    "tags": [
      "Khoa học",
      "Hóa học"
    ]
  },
  {
    "id": "q-mh500-b2-014",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Hiệu ứng vật lý nào giải thích sự thay đổi tần số hoặc bước sóng của sóng khi nguồn phát và người quan sát chuyển động tương đối với nhau?",
    "a": "Hiệu ứng Doppler",
    "b": "Hiệu ứng Compton",
    "c": "Hiệu ứng Zeeman",
    "d": "Hiệu ứng Casimir",
    "ans": "A",
    "exp": "Hiệu ứng Doppler mô tả sự dịch chuyển tần số sóng âm hoặc sóng điện từ khi khoảng cách giữa nguồn và máy thu thay đổi.",
    "tags": [
      "Khoa học",
      "Vật lý"
    ]
  },
  {
    "id": "q-mh500-b2-015",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Thiên hà lớn gần Ngân Hà của chúng ta nhất và đang tiến lại gần để va chạm trong khoảng 4,5 tỷ năm nữa là thiên hà nào?",
    "a": "Thiên hà Chong Chóng",
    "b": "Thiên hà Tiên Nữ Andromeda",
    "c": "Thiên hà Vành Nón Sombrero",
    "d": "Thiên hà Xoáy Nước Whirlpool",
    "ans": "B",
    "exp": "Thiên hà Tiên Nữ Andromeda cách Trái Đất khoảng 2,5 triệu năm ánh sáng là thiên hà xoắn ốc lớn gần Ngân Hà nhất.",
    "tags": [
      "Khoa học",
      "Thiên văn"
    ]
  },
  {
    "id": "q-mh500-b2-016",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Theo thuyết tương đối rộng của Albert Einstein, hiện tượng ánh sáng từ một ngôi sao xa xôi bị bẻ cong khi đi qua gần một thiên thể có khối lượng lớn gọi là gì?",
    "a": "Tán xạ Rayleigh",
    "b": "Bức xạ Hawking",
    "c": "Thấu kính hấp dẫn",
    "d": "Dịch chuyển đỏ vũ trụ",
    "ans": "C",
    "exp": "Khối lượng lớn làm cong không thời gian xung quanh nó, khiến đường đi của tia sáng bị bẻ cong tạo thành hiệu ứng thấu kính hấp dẫn.",
    "tags": [
      "Khoa học",
      "Vật lý",
      "Thiên văn"
    ]
  },
  {
    "id": "q-mh500-b2-017",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Phản ứng hóa học giữa một axit hữu cơ và một rượu có xúc tác axit đặc nóng tạo thành hợp chất gì?",
    "a": "Andehit",
    "b": "Xeton",
    "c": "Ete",
    "d": "Este",
    "ans": "D",
    "exp": "Phản ứng giữa axit cacboxylic và ancol được gọi là phản ứng este hóa, tạo ra este và nước.",
    "tags": [
      "Khoa học",
      "Hóa học"
    ]
  },
  {
    "id": "q-mh500-b2-018",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Số nguyên tố nào là số nguyên tố chẵn duy nhất trong tập hợp các số tự nhiên?",
    "a": "Số 2",
    "b": "Số 4",
    "c": "Số 0",
    "d": "Không có số nào",
    "ans": "A",
    "exp": "Số 2 chỉ chia hết cho 1 và chính nó nên là số nguyên tố, đồng thời mọi số chẵn lớn hơn 2 đều chia hết cho 2 nên là hợp số.",
    "tags": [
      "Khoa học",
      "Toán học"
    ]
  },
  {
    "id": "q-mh500-b2-019",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Hành tinh nào trong Hệ Mặt Trời có trục tự quay nghiêng gần như nằm ngang khoảng 98 độ so với mặt phẳng quỹ đạo?",
    "a": "Sao Hải Vương",
    "b": "Sao Thiên Vương",
    "c": "Sao Thổ",
    "d": "Sao Kim",
    "ans": "B",
    "exp": "Sao Thiên Vương có độ nghiêng trục quay khoảng 97,77 độ, khiến nó trông như đang lăn trên quỹ đạo quanh Mặt Trời.",
    "tags": [
      "Khoa học",
      "Thiên văn"
    ]
  },
  {
    "id": "q-mh500-b2-020",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Trong hóa học, nguyên tố nào có độ âm điện lớn nhất theo thang đo của Linus Pauling?",
    "a": "Oxy",
    "b": "Clo",
    "c": "Flo",
    "d": "Nitơ",
    "ans": "C",
    "exp": "Flo có độ âm điện bằng 3,98 trên thang Pauling, là nguyên tố hút electron mạnh nhất trong bảng tuần hoàn.",
    "tags": [
      "Khoa học",
      "Hóa học"
    ]
  },
  {
    "id": "q-mh500-b2-021",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Quá trình hạt nhân nguyên tử nặng như Uranium bị tách thành hai hay nhiều hạt nhân nhẹ hơn kèm theo giải phóng năng lượng gọi là gì?",
    "a": "Nhiệt hạch",
    "b": "Tổng hợp hạt nhân",
    "c": "Ion hóa",
    "d": "Phân hạch hạt nhân",
    "ans": "D",
    "exp": "Phân hạch hạt nhân là quá trình một hạt nhân nặng hấp thụ neutron và vỡ thành các hạt nhân trung bình cùng năng lượng lớn.",
    "tags": [
      "Khoa học",
      "Vật lý",
      "Hạt nhân"
    ]
  },
  {
    "id": "q-mh500-b2-022",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Albert Einstein được trao giải Nobel Vật lý năm 1921 chủ yếu nhờ công trình giải thích hiện tượng vật lý nào?",
    "a": "Hiệu ứng quang điện",
    "b": "Thuyết tương đối hẹp",
    "c": "Thuyết tương đối rộng",
    "d": "Chuyển động Brown",
    "ans": "A",
    "exp": "Einstein nhận giải Nobel Vật lý năm 1921 cho những đóng góp đối với vật lý lý thuyết và đặc biệt là khám phá ra định luật của hiệu ứng quang điện.",
    "tags": [
      "Khoa học",
      "Vật lý"
    ]
  },
  {
    "id": "q-mh500-b2-023",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Dạng thù hình nào của nguyên tố cacbon có cấu trúc mạng tinh thể lập phương tâm diện và là vật liệu tự nhiên cứng nhất?",
    "a": "Than chì",
    "b": "Kim cương",
    "c": "Fullerene",
    "d": "Than vô định hình",
    "ans": "B",
    "exp": "Trong tinh thể kim cương, mỗi nguyên tử cacbon liên kết cộng hóa trị bền vững với 4 nguyên tử cacbon lân cận theo cấu trúc tứ diện đều.",
    "tags": [
      "Khoa học",
      "Hóa học"
    ]
  },
  {
    "id": "q-mh500-b2-024",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Điểm trong quỹ đạo elip của Trái Đất xung quanh Mặt Trời mà tại đó Trái Đất nằm xa Mặt Trời nhất được gọi là gì?",
    "a": "Điểm cận nhật",
    "b": "Điểm xuân phân",
    "c": "Điểm viễn nhật",
    "d": "Điểm hạ chí",
    "ans": "C",
    "exp": "Điểm viễn nhật là vị trí trên quỹ đạo mà hành tinh cách xa Mặt Trời nhất, với Trái Đất thường rơi vào đầu tháng 7 hằng năm.",
    "tags": [
      "Khoa học",
      "Thiên văn"
    ]
  },
  {
    "id": "q-mh500-b2-025",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Trong hình học phẳng Euclid, giao điểm của ba đường trung tuyến trong một tam giác được gọi là gì?",
    "a": "Trực tâm",
    "b": "Tâm đường tròn ngoại tiếp",
    "c": "Tâm đường tròn nội tiếp",
    "d": "Trọng tâm",
    "ans": "D",
    "exp": "Ba đường trung tuyến của một tam giác luôn đồng quy tại một điểm gọi là trọng tâm, cách mỗi đỉnh một khoảng bằng hai phần ba độ dài đường trung tuyến.",
    "tags": [
      "Khoa học",
      "Toán học"
    ]
  },
  {
    "id": "q-mh500-b2-026",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Hiện tượng điện trở của một vật liệu giảm xuống bằng không hoàn toàn khi được làm lạnh dưới một nhiệt độ tới hạn gọi là gì?",
    "a": "Hiện tượng siêu dẫn",
    "b": "Hiện tượng siêu chảy",
    "c": "Hiệu ứng nhiệt điện",
    "d": "Hiệu ứng Hall lượng tử",
    "ans": "A",
    "exp": "Hiện tượng siêu dẫn do Heike Kamerlingh Onnes phát hiện năm 1911 khi làm lạnh thủy ngân bằng heli lỏng xuống gần độ không tuyệt đối.",
    "tags": [
      "Khoa học",
      "Vật lý"
    ]
  },
  {
    "id": "q-mh500-b2-027",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Khí hiếm nào đứng thứ hai trong bảng tuần hoàn và thường được bơm vào khinh khí cầu vì nhẹ và không gây cháy nổ?",
    "a": "Argon",
    "b": "Heli",
    "c": "Neon",
    "d": "Krypton",
    "ans": "B",
    "exp": "Heli nhẹ hơn không khí và là khí trơ không bắt cháy, an toàn hơn rất nhiều so với khí hydro.",
    "tags": [
      "Khoa học",
      "Hóa học"
    ]
  },
  {
    "id": "q-mh500-b2-028",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Bức xạ vi sóng phông vũ trụ còn sót lại từ thời kỳ sơ khai sau Vụ Nổ Lớn được hai nhà khoa học nào tình cờ phát hiện năm 1964?",
    "a": "Edwin Hubble và Milton Humason",
    "b": "Stephen Hawking và Roger Penrose",
    "c": "Arno Penzias và Robert Wilson",
    "d": "Martin Ryle và Antony Hewish",
    "ans": "C",
    "exp": "Penzias và Wilson đã phát hiện bức xạ nền vi sóng vũ trụ khi làm việc với ăng ten vô tuyến tại phòng thí nghiệm Bell.",
    "tags": [
      "Khoa học",
      "Thiên văn",
      "Vũ trụ"
    ]
  },
  {
    "id": "q-mh500-b2-029",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Đơn vị đo cường độ dòng điện trong hệ đo lường quốc tế SI được đặt theo tên nhà vật lý người Pháp nào?",
    "a": "Charles Augustin de Coulomb",
    "b": "Alessandro Volta",
    "c": "Georg Simon Ohm",
    "d": "Andre Marie Ampere",
    "ans": "D",
    "exp": "Đơn vị Ampe đo cường độ dòng điện được đặt theo tên nhà vật lý và toán học người Pháp Andre Marie Ampere.",
    "tags": [
      "Khoa học",
      "Vật lý"
    ]
  },
  {
    "id": "q-mh500-b2-030",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Trong toán học, dãy số mà mỗi số hạng kể từ số thứ ba đều bằng tổng của hai số hạng liền trước nó gắn liền với tên tuổi của ai?",
    "a": "Leonardo Fibonacci",
    "b": "Blaise Pascal",
    "c": "Leonhard Euler",
    "d": "Carl Friedrich Gauss",
    "ans": "A",
    "exp": "Dãy số Fibonacci bắt đầu bằng 0, 1, 1, 2, 3, 5, 8, 13 và tỷ số giữa hai số liên tiếp tiến dần tới tỷ lệ vàng.",
    "tags": [
      "Khoa học",
      "Toán học"
    ]
  },
  {
    "id": "q-mh500-b2-031",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Chất xúc tác có vai trò như thế nào trong một phản ứng hóa học thuận nghịch ở trạng thái cân bằng?",
    "a": "Làm dịch chuyển cân bằng theo chiều thuận",
    "b": "Làm tăng tốc độ cả phản ứng thuận và nghịch như nhau",
    "c": "Làm thay đổi hằng số cân bằng của phản ứng",
    "d": "Làm tăng hiệu suất cực đại của phản ứng",
    "ans": "B",
    "exp": "Chất xúc tác làm giảm năng lượng hoạt hóa của cả hai chiều thuận và nghịch, giúp hệ nhanh đạt trạng thái cân bằng hơn nhưng không làm dịch chuyển cân bằng.",
    "tags": [
      "Khoa học",
      "Hóa học"
    ]
  },
  {
    "id": "q-mh500-b2-032",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Ngôi sao neutron quay rất nhanh và phát ra các chùm bức xạ điện từ đều đặn từ hai cực từ của nó được gọi là gì?",
    "a": "Sao lùn nâu",
    "b": "Quasar",
    "c": "Pulsar",
    "d": "Sao biến quang Cepheid",
    "ans": "C",
    "exp": "Pulsar hay sao xung là những ngôi sao neutron có từ trường cực mạnh và tự quay nhanh, phát ra các xung bức xạ có chu kỳ rất chính xác.",
    "tags": [
      "Khoa học",
      "Thiên văn"
    ]
  },
  {
    "id": "q-mh500-b2-033",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Lực nào giữ cho các hành tinh chuyển động trên quỹ đạo elip xung quanh Mặt Trời mà không bị văng ra ngoài không gian?",
    "a": "Lực từ trường liên hành tinh",
    "b": "Lực hạt nhân mạnh",
    "c": "Lực đẩy tĩnh điện",
    "d": "Lực hấp dẫn",
    "ans": "D",
    "exp": "Theo định luật vạn vật hấp dẫn của Newton, lực hấp dẫn giữa Mặt Trời và các hành tinh đóng vai trò lực hướng tâm giữ chúng trên quỹ đạo.",
    "tags": [
      "Khoa học",
      "Vật lý",
      "Thiên văn"
    ]
  },
  {
    "id": "q-mh500-b2-034",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Đồng vị phóng xạ nào của nguyên tố Cacbon thường được sử dụng để xác định niên đại của các mẫu vật khảo cổ có nguồn gốc hữu cơ?",
    "a": "Cacbon 14",
    "b": "Cacbon 12",
    "c": "Cacbon 13",
    "d": "Cacbon 11",
    "ans": "A",
    "exp": "Đồng vị Cacbon 14 có chu kỳ bán rã khoảng 5730 năm, giúp xác định chính xác tuổi của các mẫu hóa thạch hữu cơ lên tới hàng chục nghìn năm.",
    "tags": [
      "Khoa học",
      "Hóa học",
      "Vật lý"
    ]
  },
  {
    "id": "q-mh500-b2-035",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Trong quang học, hiện tượng cầu vồng xuất hiện sau cơn mưa là sự kết hợp của phản xạ ánh sáng và hiện tượng nào trong các giọt nước?",
    "a": "Nhiễu xạ và phân cực",
    "b": "Khúc xạ và tán sắc",
    "c": "Giao thoa và hấp thụ",
    "d": "Phát quang và tán xạ",
    "ans": "B",
    "exp": "Ánh sáng Mặt Trời đi vào giọt nước mưa bị khúc xạ, tán sắc thành các màu đơn sắc và phản xạ ở mặt sau giọt nước trước khi truyền tới mắt người.",
    "tags": [
      "Khoa học",
      "Vật lý",
      "Quang học"
    ]
  },
  {
    "id": "q-mh500-b2-036",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Định lý bất toàn nổi tiếng chứng minh rằng mọi hệ tiên đề toán học đủ mạnh đều chứa những mệnh đề không thể chứng minh cũng không thể bác bỏ là của ai?",
    "a": "David Hilbert",
    "b": "Alan Turing",
    "c": "Kurt Godel",
    "d": "Bertrand Russell",
    "ans": "C",
    "exp": "Năm 1931, nhà logic học Kurt Godel đã công bố hai định lý bất toàn làm thay đổi sâu sắc nền tảng của toán học hiện đại.",
    "tags": [
      "Khoa học",
      "Toán học"
    ]
  },
  {
    "id": "q-mh500-b2-037",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Kim loại kiềm nào khi đốt cháy trong không khí hoặc thử màu ngọn lửa sẽ tạo ra ngọn lửa có màu vàng tươi đặc trưng?",
    "a": "Kali",
    "b": "Liti",
    "c": "Rubidi",
    "d": "Natri",
    "ans": "D",
    "exp": "Các hợp chất của Natri khi đốt nóng trong ngọn lửa không màu sẽ phát ra ánh sáng màu vàng rực rỡ do bước nhảy năng lượng electron.",
    "tags": [
      "Khoa học",
      "Hóa học"
    ]
  },
  {
    "id": "q-mh500-b2-038",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Vùng không gian chứa hàng nghìn tỷ thiên thạch băng bao quanh Hệ Mặt Trời ở khoảng cách từ 2000 đến 100000 đơn vị thiên văn được gọi là gì?",
    "a": "Đám mây Oort",
    "b": "Vành đai Kuiper",
    "c": "Vành đai tiểu hành tinh",
    "d": "Nhật quyển Mặt Trời",
    "ans": "A",
    "exp": "Đám mây Oort là một vùng cầu khổng lồ gồm các vật thể băng giá nằm ở rìa ngoài cùng của Hệ Mặt Trời, nơi xuất phát của nhiều sao chổi chu kỳ dài.",
    "tags": [
      "Khoa học",
      "Thiên văn"
    ]
  },
  {
    "id": "q-mh500-b2-039",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Theo định luật Archimedes, lực đẩy tác dụng lên một vật nhúng trong chất lỏng có độ lớn bằng đại lượng nào?",
    "a": "Trọng lượng của toàn bộ vật đó",
    "b": "Trọng lượng của phần chất lỏng bị vật chiếm chỗ",
    "c": "Khối lượng riêng của vật nhân với thể tích bình chứa",
    "d": "Áp suất khí quyển tác dụng lên mặt thoáng chất lỏng",
    "ans": "B",
    "exp": "Định luật Archimedes chỉ rõ mọi vật nhúng trong chất lỏng đều chịu một lực đẩy hướng thẳng đứng từ dưới lên bằng trọng lượng phần chất lỏng bị chiếm chỗ.",
    "tags": [
      "Khoa học",
      "Vật lý",
      "Cơ học"
    ]
  },
  {
    "id": "q-mh500-b2-040",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Trong phản ứng điện phân dung dịch đồng sunfat với hai điện cực trơ bằng than chì, chất khí nào thoát ra ở cực dương anot?",
    "a": "Khí hydro",
    "b": "Khí lưu huỳnh đioxit",
    "c": "Khí oxy",
    "d": "Khí clo",
    "ans": "C",
    "exp": "Ở cực dương anot, gốc sunfat không bị điện phân mà phân tử nước bị oxy hóa giải phóng khí oxy và ion H+.",
    "tags": [
      "Khoa học",
      "Hóa học"
    ]
  },
  {
    "id": "q-mh500-b2-041",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Ngọn núi lửa lớn nhất được biết đến trong Hệ Mặt Trời có tên là Olympus Mons nằm trên hành tinh nào?",
    "a": "Sao Kim",
    "b": "Trái Đất",
    "c": "Sao Thủy",
    "d": "Sao Hỏa",
    "ans": "D",
    "exp": "Olympus Mons trên Sao Hỏa là ngọn núi lửa hình khiên khổng lồ cao khoảng 21,9 km, gấp gần ba lần đỉnh Everest.",
    "tags": [
      "Khoa học",
      "Thiên văn"
    ]
  },
  {
    "id": "q-mh500-b2-042",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Hạt phản vật chất tương ứng của electron có cùng khối lượng nhưng mang điện tích dương được gọi là hạt gì?",
    "a": "Positron",
    "b": "Muon",
    "c": "Neutrino",
    "d": "Proton",
    "ans": "A",
    "exp": "Positron hay phản electron được Paul Dirac tiên đoán về mặt lý thuyết năm 1928 và Carl Anderson phát hiện thực nghiệm năm 1932.",
    "tags": [
      "Khoa học",
      "Vật lý",
      "Hạt nhân"
    ]
  },
  {
    "id": "q-mh500-b2-043",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Liên kết hóa học được hình thành do lực hút tĩnh điện giữa các ion mang điện tích trái dấu được gọi là liên kết gì?",
    "a": "Liên kết cộng hóa trị không phân cực",
    "b": "Liên kết ion",
    "c": "Liên kết kim loại",
    "d": "Liên kết hydro",
    "ans": "B",
    "exp": "Liên kết ion hình thành khi có sự nhường và nhận electron giữa điển hình là kim loại mạnh và phi kim mạnh tạo ra cation và anion hút nhau.",
    "tags": [
      "Khoa học",
      "Hóa học"
    ]
  },
  {
    "id": "q-mh500-b2-044",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Trong cơ học chất lưu, nguyên lý nào phát biểu rằng khi vận tốc của dòng chất lưu tăng lên thì áp suất tĩnh của nó giảm xuống?",
    "a": "Nguyên lý Pascal",
    "b": "Định luật Torricelli",
    "c": "Nguyên lý Bernoulli",
    "d": "Định luật Stokes",
    "ans": "C",
    "exp": "Nguyên lý Bernoulli là hệ quả của định luật bảo toàn năng lượng áp dụng cho dòng chảy chất lưu, giải thích nguyên lý tạo lực nâng của cánh máy bay.",
    "tags": [
      "Khoa học",
      "Vật lý",
      "Cơ học"
    ]
  },
  {
    "id": "q-mh500-b2-045",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Hằng số toán học nào biểu thị tỷ số giữa chu vi của một đường tròn và đường kính của chính đường tròn đó?",
    "a": "Số Euler e",
    "b": "Tỷ lệ vàng Phi",
    "c": "Hằng số Catalan",
    "d": "Số Pi",
    "ans": "D",
    "exp": "Số Pi là một số vô tỷ và siêu việt có giá trị xấp xỉ 3,14159, biểu thị tỷ số không đổi giữa chu vi và đường kính đường tròn trong mặt phẳng Euclid.",
    "tags": [
      "Khoa học",
      "Toán học"
    ]
  },
  {
    "id": "q-mh500-b2-046",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Hố đen siêu khối lượng nằm ở trung tâm Ngân Hà của chúng ta có tên gọi thiên văn học là gì?",
    "a": "Sagittarius A*",
    "b": "Cygnus X-1",
    "c": "Messier 87*",
    "d": "Centaurus A",
    "ans": "A",
    "exp": "Sagittarius A* nằm ở vùng tâm Ngân Hà thuộc chòm sao Nhân Mã, có khối lượng gấp khoảng 4 triệu lần khối lượng Mặt Trời.",
    "tags": [
      "Khoa học",
      "Thiên văn",
      "Vũ trụ"
    ]
  },
  {
    "id": "q-mh500-b2-047",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Polime thiên nhiên nào là thành phần cấu tạo chính của màng tế bào thực vật, có nhiều trong bông nõn và gỗ?",
    "a": "Tinh bột",
    "b": "Xenlulozơ",
    "c": "Glycogen",
    "d": "Kitin",
    "ans": "B",
    "exp": "Xenlulozơ là một polisaccarit mạch thẳng tạo nên độ bền cơ học của thành tế bào thực vật, chiếm tới khoảng 98 phần trăm trong bông nõn.",
    "tags": [
      "Khoa học",
      "Hóa học"
    ]
  },
  {
    "id": "q-mh500-b2-048",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Hệ phương trình gồm bốn phương trình vi phân đạo hàm riêng mô tả toàn bộ sự thống nhất của điện trường, từ trường và ánh sáng mang tên ai?",
    "a": "Michael Faraday",
    "b": "Heinrich Hertz",
    "c": "James Clerk Maxwell",
    "d": "Hendrik Lorentz",
    "ans": "C",
    "exp": "Hệ phương trình Maxwell do James Clerk Maxwell tổng hợp vào thế kỷ 19 đã thống nhất điện học, từ học và quang học thành lý thuyết trường điện từ.",
    "tags": [
      "Khoa học",
      "Vật lý",
      "Điện từ"
    ]
  },
  {
    "id": "q-mh500-b2-049",
    "cat": "cat-sci",
    "diff": "MEDIUM",
    "q": "Hành tinh nào là hành tinh nóng nhất trong Hệ Mặt Trời do hiệu ứng nhà kính cực đoan của bầu khí quyển dày đặc khí cacbonic?",
    "a": "Sao Thủy",
    "b": "Sao Hỏa",
    "c": "Sao Mộc",
    "d": "Sao Kim",
    "ans": "D",
    "exp": "Dù Sao Thủy gần Mặt Trời nhất nhưng Sao Kim mới là hành tinh nóng nhất với nhiệt độ bề mặt khoảng 465 độ C do khí quyển giữ nhiệt cực mạnh.",
    "tags": [
      "Khoa học",
      "Thiên văn"
    ]
  },
  {
    "id": "q-mh500-b2-050",
    "cat": "cat-sci",
    "diff": "HARD",
    "q": "Khái niệm độ pH dùng để đo độ axit hay bazơ của một dung dịch nước được định nghĩa toán học như thế nào theo nồng độ mol của ion H+?",
    "a": "Âm logarit thập phân của nồng độ ion H+",
    "b": "Logarit tự nhiên của nồng độ ion H+",
    "c": "Nghịch đảo bình phương nồng độ ion H+",
    "d": "Căn bậc hai của tích số ion của nước",
    "ans": "A",
    "exp": "Theo nhà hóa học Sorensen, pH bằng trừ logarit cơ số 10 của hoạt độ hay nồng độ mol trên lít của ion hydro trong dung dịch.",
    "tags": [
      "Khoa học",
      "Hóa học"
    ]
  },
  {
    "id": "q-mh500-b2-056",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Bào quan nào trong tế bào nhân thực được mệnh danh là nhà máy phát điện của tế bào vì thực hiện hô hấp hiếu khí tạo ra ATP?",
    "a": "Bộ máy Golgi",
    "b": "Lưới nội chất",
    "c": "Ti thể",
    "d": "Tiêu thể Lysosome",
    "ans": "C",
    "exp": "Ti thể là nơi diễn ra chuỗi truyền electron và chu trình Krebs để tổng hợp phần lớn năng lượng ATP cho hoạt động sống của tế bào.",
    "tags": [
      "Sinh học",
      "Tế bào"
    ]
  },
  {
    "id": "q-mh500-b2-057",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Trong phân tử ARN thông tin, loại bazơ nitơ nào xuất hiện để thay thế cho Thymin vốn có trong phân tử ADN?",
    "a": "Adenin",
    "b": "Guanin",
    "c": "Cytosin",
    "d": "Uracil",
    "ans": "D",
    "exp": "Phân tử ARN sử dụng bốn loại bazơ nitơ là Adenin, Guanin, Cytosin và Uracil, trong đó Uracil bắt cặp bổ sung với Adenin.",
    "tags": [
      "Sinh học",
      "Di truyền"
    ]
  },
  {
    "id": "q-mh500-b2-058",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Cơ quan nào trong cơ thể người vừa có chức năng ngoại tiết tiết dịch tiêu hóa vừa có chức năng nội tiết tiết hormone insulin?",
    "a": "Tuyến tụy",
    "b": "Tuyến giáp",
    "c": "Túi mật",
    "d": "Lách",
    "ans": "A",
    "exp": "Tuyến tụy là tuyến pha, vừa tiết dịch tụy đổ vào tá tràng giúp tiêu hóa thức ăn, vừa có các đảo tụy tiết insulin và glucagon điều hòa đường huyết.",
    "tags": [
      "Sinh học",
      "Giải phẫu",
      "Y học"
    ]
  },
  {
    "id": "q-mh500-b2-059",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Trong quá trình nhân đôi ADN ở sinh vật nhân thực, enzyme nào có vai trò tháo xoắn và tách hai mạch đơn của phân tử ADN mẹ?",
    "a": "ADN Ligase",
    "b": "Helicase",
    "c": "ARN Polymerase",
    "d": "Reverse Transcriptase",
    "ans": "B",
    "exp": "Enzyme Helicase cắt đứt các liên kết hydro giữa hai mạch đơn của ADN tại chạc chữ Y để tạo khuôn cho quá trình tổng hợp mạch mới.",
    "tags": [
      "Sinh học",
      "Di truyền"
    ]
  },
  {
    "id": "q-mh500-b2-060",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Mạch dẫn nào trong thân cây thực vật có mạch chịu trách nhiệm vận chuyển nước và muối khoáng từ rễ lên lá?",
    "a": "Mạch rây Phloem",
    "b": "Tầng sinh vỏ",
    "c": "Mạch gỗ Xylem",
    "d": "Mô mềm vỏ",
    "ans": "C",
    "exp": "Mạch gỗ Xylem gồm các tế bào chết đã hóa gỗ nối liền nhau tạo thành ống dẫn nước và ion khoáng đi lên nhờ lực thoát hơi nước ở lá.",
    "tags": [
      "Sinh học",
      "Thực vật học"
    ]
  },
  {
    "id": "q-mh500-b2-061",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Trong tiến hóa học, cánh của chim và cánh của côn trùng có nguồn gốc phôi sinh khác nhau nhưng cùng thực hiện chức năng bay được gọi là gì?",
    "a": "Cơ quan tương đồng",
    "b": "Cơ quan thoái hóa",
    "c": "Hiện tượng lại tổ",
    "d": "Cơ quan tương tự",
    "ans": "D",
    "exp": "Cơ quan tương tự phản ánh sự tiến hóa hội tụ, khi các loài có nguồn gốc khác nhau thích nghi với môi trường sống giống nhau.",
    "tags": [
      "Sinh học",
      "Tiến hóa"
    ]
  },
  {
    "id": "q-mh500-b2-062",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Loại tế bào máu nào đóng vai trò chính trong quá trình đông máu để bịt kín vết thương khi mạch máu bị tổn thương?",
    "a": "Tiểu cầu",
    "b": "Hồng cầu",
    "c": "Bạch cầu lympho B",
    "d": "Đại thực bào",
    "ans": "A",
    "exp": "Tiểu cầu giải phóng enzyme thromboplastin kích hoạt chuỗi phản ứng biến fibrinogen hòa tan trong huyết tương thành sợi fibrin tạo cục máu đông.",
    "tags": [
      "Sinh học",
      "Y học",
      "Giải phẫu"
    ]
  },
  {
    "id": "q-mh500-b2-063",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Giai đoạn cố định khí CO2 trong quá trình quang hợp ở thực vật không cần ánh sáng trực tiếp còn được gọi bằng tên của nhà khoa học nào?",
    "a": "Chu trình Krebs",
    "b": "Chu trình Calvin",
    "c": "Chu trình Cori",
    "d": "Chu trình Ure",
    "ans": "B",
    "exp": "Pha tối của quá trình quang hợp diễn ra trong chất nền lục lạp được gọi là chu trình Calvin, sử dụng ATP và NADPH từ pha sáng để tổng hợp chất hữu cơ.",
    "tags": [
      "Sinh học",
      "Thực vật học"
    ]
  },
  {
    "id": "q-mh500-b2-064",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Loài thú đẻ trứng đặc hữu của nước Úc có mỏ giống mỏ vịt, chân có màng bơi và con đực có cựa độc ở chân sau là con gì?",
    "a": "Thú lông nhím Echidna",
    "b": "Gấu túi Koala",
    "c": "Thú mỏ vịt Platypus",
    "d": "Chuột túi Wallaby",
    "ans": "C",
    "exp": "Thú mỏ vịt thuộc bộ Đơn huyệt, là một trong số cực ít những loài động vật có vú không đẻ con mà đẻ trứng nhưng vẫn nuôi con bằng sữa mẹ.",
    "tags": [
      "Sinh học",
      "Động vật học"
    ]
  },
  {
    "id": "q-mh500-b2-065",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Trong hệ miễn dịch dịch thể của người, loại tế bào bạch cầu nào trực tiếp biệt hóa thành tương bào để sản xuất kháng thể đặc hiệu?",
    "a": "Tế bào lympho T độc",
    "b": "Bạch cầu ái toan",
    "c": "Tế bào giết tự nhiên NK",
    "d": "Tế bào lympho B",
    "ans": "D",
    "exp": "Khi nhận diện kháng nguyên, tế bào lympho B tăng sinh và biệt hóa thành tương bào Plasma cell chuyên tổng hợp và tiết kháng thể Immunoglobulin.",
    "tags": [
      "Sinh học",
      "Miễn dịch",
      "Y học"
    ]
  },
  {
    "id": "q-mh500-b2-066",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Mối quan hệ sinh thái giữa vi khuẩn Rhizobium sống trong nốt sần rễ cây họ Đậu và cây họ Đậu thuộc kiểu quan hệ nào?",
    "a": "Cộng sinh",
    "b": "Hội sinh",
    "c": "Ký sinh",
    "d": "Hợp tác không bắt buộc",
    "ans": "A",
    "exp": "Vi khuẩn Rhizobium cố định đạm nitơ khí quyển cung cấp cho cây họ Đậu, còn cây cung cấp chất hữu cơ và nơi ở cho vi khuẩn trong mối quan hệ cộng sinh.",
    "tags": [
      "Sinh học",
      "Sinh thái học",
      "Vi sinh vật"
    ]
  },
  {
    "id": "q-mh500-b2-067",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Bộ phận nào của não bộ con người đóng vai trò trung tâm điều khiển sự phối hợp vận động phức tạp và giữ thăng bằng cho cơ thể?",
    "a": "Hành não",
    "b": "Tiểu não",
    "c": "Đồi thị",
    "d": "Thể chai",
    "ans": "B",
    "exp": "Tiểu não nằm phía dưới bán cầu đại não, tiếp nhận tín hiệu từ cơ, khớp và tiền đình để điều chỉnh độ chính xác của các cử động và giữ thăng bằng.",
    "tags": [
      "Sinh học",
      "Giải phẫu"
    ]
  },
  {
    "id": "q-mh500-b2-068",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Kháng sinh Penicillin đầu tiên trong lịch sử y học được nhà bác học Alexander Fleming chiết xuất từ loại sinh vật nào?",
    "a": "Vi khuẩn đường ruột",
    "b": "Tảo lục đơn bào",
    "c": "Nấm mốc Penicillium",
    "d": "Xạ khuẩn đất",
    "ans": "C",
    "exp": "Năm 1928, Alexander Fleming phát hiện nấm mốc Penicillium notatum tiết ra chất có khả năng tiêu diệt vi khuẩn tụ cầu vàng.",
    "tags": [
      "Sinh học",
      "Vi sinh vật",
      "Y học"
    ]
  },
  {
    "id": "q-mh500-b2-069",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Ở người bình thường, hội chứng Down gây chậm phát triển trí tuệ và thể chất là do đột biến số lượng nhiễm sắc thể ở cặp số mấy?",
    "a": "Thể ba ở cặp nhiễm sắc thể số 13",
    "b": "Thể ba ở cặp nhiễm sắc thể số 18",
    "c": "Thể một ở cặp nhiễm sắc thể giới tính",
    "d": "Thể ba ở cặp nhiễm sắc thể số 21",
    "ans": "D",
    "exp": "Hội chứng Down xảy ra khi người bệnh có 3 nhiễm sắc thể số 21 thay vì 2 chiếc như bình thường, làm tổng số nhiễm sắc thể trong tế bào là 47.",
    "tags": [
      "Sinh học",
      "Di truyền",
      "Y học"
    ]
  },
  {
    "id": "q-mh500-b2-070",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Sắc tố nào trong lá cây hấp thụ mạnh ánh sáng vùng đỏ và vùng xanh tím nhưng phản xạ ánh sáng màu xanh lục?",
    "a": "Diệp lục Chlorophyll",
    "b": "Carotenoid",
    "c": "Anthocyanin",
    "d": "Phycobilin",
    "ans": "A",
    "exp": "Diệp lục hay Chlorophyll không hấp thụ ánh sáng màu lục mà phản xạ lại mắt người nên lá cây có màu xanh lục đặc trưng.",
    "tags": [
      "Sinh học",
      "Thực vật học"
    ]
  },
  {
    "id": "q-mh500-b2-071",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Đơn vị cấu tạo và chức năng cơ bản của thận người thực hiện quá trình lọc máu tạo nước tiểu đầu được gọi là gì?",
    "a": "Phế nang Alveoli",
    "b": "Đơn vị thận Nephron",
    "c": "Tiểu thùy gan",
    "d": "Nơron thần kinh",
    "ans": "B",
    "exp": "Mỗi quả thận người chứa khoảng một triệu Nephron gồm cầu thận và hệ thống ống thận để lọc máu và tái hấp thu các chất cần thiết.",
    "tags": [
      "Sinh học",
      "Giải phẫu"
    ]
  },
  {
    "id": "q-mh500-b2-072",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Nhóm máu nào trong hệ thống nhóm máu ABO ở người được coi là nhóm máu chuyên cho hồng cầu vì không có kháng nguyên A và B trên bề mặt hồng cầu?",
    "a": "Nhóm máu AB",
    "b": "Nhóm máu A",
    "c": "Nhóm máu O",
    "d": "Nhóm máu B",
    "ans": "C",
    "exp": "Hồng cầu nhóm máu O không mang kháng nguyên A và B nên không bị kháng thể trong huyết tương của người nhận làm ngưng kết khi truyền khối hồng cầu.",
    "tags": [
      "Sinh học",
      "Y học"
    ]
  },
  {
    "id": "q-mh500-b2-073",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Theo quy luật phân ly độc lập của Gregor Mendel, phép lai hai cặp tính trạng dị hợp tử hoàn toàn sẽ cho tỷ lệ kiểu hình ở đời con F2 là bao nhiêu?",
    "a": "Tỷ lệ 3 chia 1",
    "b": "Tỷ lệ 1 chia 2 chia 1",
    "c": "Tỷ lệ 1 chia 1 chia 1 chia 1",
    "d": "Tỷ lệ 9 chia 3 chia 3 chia 1",
    "ans": "D",
    "exp": "Khi hai cặp gen nằm trên hai cặp nhiễm sắc thể tương đồng khác nhau và trội hoàn toàn, phép lai AaBb với AaBb tạo ra tỷ lệ kiểu hình 9:3:3:1.",
    "tags": [
      "Sinh học",
      "Di truyền"
    ]
  },
  {
    "id": "q-mh500-b2-074",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Loài chim nào có khả năng bay lùi duy nhất trong thế giới các loài chim nhờ cấu trúc khớp cánh đặc biệt và nhịp đập cánh cực nhanh?",
    "a": "Chim ruồi",
    "b": "Chim bói cá",
    "c": "Chim hải âu",
    "d": "Chim cắt lớn",
    "ans": "A",
    "exp": "Chim ruồi có thể vỗ cánh từ 50 đến 80 lần mỗi giây theo hình số 8, cho phép chúng bay đứng yên trên không và bay lùi dễ dàng khi hút mật.",
    "tags": [
      "Sinh học",
      "Động vật học"
    ]
  },
  {
    "id": "q-mh500-b2-075",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Tác nhân truyền nhiễm nào chỉ cấu tạo thuần túy từ các phân tử protein bị gấp cuộn sai lệch mà không chứa bất kỳ axit nucleic ADN hay ARN nào?",
    "a": "Vi khuẩn nội bào Rickettsia",
    "b": "Prion",
    "c": "Thực khuẩn thể Bacteriophage",
    "d": "Retrovirus",
    "ans": "B",
    "exp": "Prion là các phân tử protein biến tính có khả năng lây nhiễm và gây ra các bệnh thoái hóa thần kinh nguy hiểm như bệnh bò điên.",
    "tags": [
      "Sinh học",
      "Vi sinh vật",
      "Y học"
    ]
  },
  {
    "id": "q-mh500-b2-076",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Hiện tượng phú dưỡng hóa ở các hồ nước ngọt khiến tảo nở hoa hàng loạt và cá chết ngạt chủ yếu do dư thừa hai nguyên tố dinh dưỡng nào?",
    "a": "Sắt và Đồng",
    "b": "Canxi và Magie",
    "c": "Nitơ và Photpho",
    "d": "Natri và Clo",
    "ans": "C",
    "exp": "Nước thải nông nghiệp và sinh hoạt giàu Nitơ và Photpho làm tảo phát triển bùng nổ, khi tảo chết bị vi khuẩn phân hủy sẽ làm cạn kiệt oxy hòa tan.",
    "tags": [
      "Sinh học",
      "Sinh thái học",
      "Môi trường"
    ]
  },
  {
    "id": "q-mh500-b2-077",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Trong cơ chế truyền tin qua xináp hóa học giữa hai tế bào thần kinh, ion nào đi vào chùy xináp làm vỡ các bóng chứa chất trung gian hóa học?",
    "a": "Ion Kali K+",
    "b": "Ion Clo Cl-",
    "c": "Ion Magie Mg2+",
    "d": "Ion Canxi Ca2+",
    "ans": "D",
    "exp": "Khi xung thần kinh truyền đến chùy xináp làm mở kênh Ca2+ phụ thuộc điện thế, ion Ca2+ tràn vào thúc đẩy bóng xináp dung hợp với màng trước giải phóng chất truyền tin.",
    "tags": [
      "Sinh học",
      "Giải phẫu"
    ]
  },
  {
    "id": "q-mh500-b2-078",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Xương nào là xương dài nhất, nặng nhất và khỏe nhất trong toàn bộ hệ xương của cơ thể người trưởng thành?",
    "a": "Xương đùi",
    "b": "Xương chày",
    "c": "Xương cánh tay",
    "d": "Xương cột sống thắt lưng",
    "ans": "A",
    "exp": "Xương đùi chiếm khoảng một phần tư chiều cao cơ thể người, chịu lực nâng đỡ phần lớn trọng lượng cơ thể khi đi lại và chạy nhảy.",
    "tags": [
      "Sinh học",
      "Giải phẫu"
    ]
  },
  {
    "id": "q-mh500-b2-079",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Quá trình phân bào giảm nhiễm tạo ra các giao tử đực và cái có bộ nhiễm sắc thể giảm đi một nửa được gọi là gì?",
    "a": "Nguyên phân Mitosis",
    "b": "Giảm phân Meiosis",
    "c": "Trực phân Amitosis",
    "d": "Phân đôi Binary fission",
    "ans": "B",
    "exp": "Giảm phân gồm hai lần phân bào liên tiếp nhưng nhiễm sắc thể chỉ nhân đôi một lần, tạo ra các giao tử đơn bội n từ tế bào lưỡng bội 2n.",
    "tags": [
      "Sinh học",
      "Tế bào",
      "Di truyền"
    ]
  },
  {
    "id": "q-mh500-b2-080",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Hormone thực vật nào tồn tại ở thể khí và có tác dụng thúc đẩy quá trình chín của các loại quả?",
    "a": "Auxin",
    "b": "Gibberellin",
    "c": "Ethylene",
    "d": "Cytokinin",
    "ans": "C",
    "exp": "Ethylene là hormone thực vật duy nhất ở dạng khí, được sinh ra nhiều trong thời kỳ quả chín và kích thích các quả xung quanh chín nhanh hơn.",
    "tags": [
      "Sinh học",
      "Thực vật học"
    ]
  },
  {
    "id": "q-mh500-b2-081",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Ở người, buồng tim nào có thành cơ dày nhất để co bóp đẩy máu giàu oxy đi nuôi toàn bộ cơ thể qua động mạch chủ?",
    "a": "Tâm nhĩ trái",
    "b": "Tâm nhĩ phải",
    "c": "Tâm thất phải",
    "d": "Tâm thất trái",
    "ans": "D",
    "exp": "Tâm thất trái phải tạo áp lực rất lớn để bơm máu vào vòng tuần hoàn lớn đi khắp cơ thể nên có thành cơ dày gấp khoảng 3 lần tâm thất phải.",
    "tags": [
      "Sinh học",
      "Giải phẫu",
      "Y học"
    ]
  },
  {
    "id": "q-mh500-b2-082",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Sinh vật huyền thoại của giới vi sinh có khả năng sống sót trong môi trường chân không vũ trụ, bức xạ cao và nhiệt độ gần độ không tuyệt đối là con gì?",
    "a": "Gấu nước Tardigrade",
    "b": "Trùng đế giày Paramecium",
    "c": "Thủy tức Hydra",
    "d": "Trùng roi xanh Euglena",
    "ans": "A",
    "exp": "Gấu nước Tardigrade có thể rơi vào trạng thái tiềm sinh Cryptobiosis, mất gần hết nước trong cơ thể để chịu đựng các điều kiện khắc nghiệt nhất.",
    "tags": [
      "Sinh học",
      "Động vật học"
    ]
  },
  {
    "id": "q-mh500-b2-083",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Theo thuyết tiến hóa tổng hợp hiện đại, nhân tố tiến hóa nào dưới đây là nhân tố duy nhất định hướng cho quá trình tiến hóa thích nghi?",
    "a": "Đột biến gen",
    "b": "Chọn lọc tự nhiên",
    "c": "Các yếu tố ngẫu nhiên",
    "d": "Di nhập gen",
    "ans": "B",
    "exp": "Chọn lọc tự nhiên sàng lọc các kiểu hình thích nghi theo một hướng xác định phù hợp với môi trường, nên là nhân tố tiến hóa có hướng.",
    "tags": [
      "Sinh học",
      "Tiến hóa"
    ]
  },
  {
    "id": "q-mh500-b2-084",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Vitamin nào tan trong chất béo và có vai trò quyết định trong việc tăng cường hấp thu Canxi ở ruột non để chống bệnh còi xương?",
    "a": "Vitamin C",
    "b": "Vitamin B12",
    "c": "Vitamin D",
    "d": "Vitamin B1",
    "ans": "C",
    "exp": "Vitamin D được tổng hợp dưới da nhờ tia UVB hoặc qua thức ăn, giúp cơ thể hấp thu canxi và photpho để kiến tạo xương vững chắc.",
    "tags": [
      "Sinh học",
      "Y học"
    ]
  },
  {
    "id": "q-mh500-b2-085",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Trong quá trình dịch mã tổng hợp protein, bộ ba mở đầu trên phân tử ARN thông tin mã hóa cho axit amin Methionine ở sinh vật nhân thực là gì?",
    "a": "UAA",
    "b": "UGA",
    "c": "UAG",
    "d": "AUG",
    "ans": "D",
    "exp": "Bộ ba AUG đóng vai trò tín hiệu khởi đầu quá trình dịch mã trên mARN, còn UAA, UAG và UGA là ba bộ ba kết thúc không mã hóa axit amin.",
    "tags": [
      "Sinh học",
      "Di truyền"
    ]
  },
  {
    "id": "q-mh500-b2-086",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Hệ sinh thái rừng ngập mặn ven biển nhiệt đới nổi tiếng với các loài cây như đước, vẹt, bần có đặc điểm thích nghi nổi bật nào ở bộ rễ?",
    "a": "Có hệ rễ chống và rễ thở phát triển mạnh",
    "b": "Rễ cọc đâm sâu hàng chục mét vào đá",
    "c": "Không có rễ mà hút nước qua lá",
    "d": "Rễ biến thành củ dự trữ tinh bột",
    "ans": "A",
    "exp": "Do đất bùn lầy lội và thiếu oxy, cây rừng ngập mặn phát triển bộ rễ chống vững chắc và rễ thở mọc ngược lên khỏi mặt bùn để lấy oxy.",
    "tags": [
      "Sinh học",
      "Sinh thái học",
      "Thực vật học"
    ]
  },
  {
    "id": "q-mh500-b2-087",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Bào quan nào có trong tế bào thực vật và nấm nhưng thường vắng mặt hoặc rất nhỏ ở tế bào động vật, giúp điều hòa áp suất thẩm thấu?",
    "a": "Trung thể Centrosome",
    "b": "Không bào trung tâm lớn",
    "c": "Ribosome tự do",
    "d": "Màng sinh chất",
    "ans": "B",
    "exp": "Tế bào thực vật trưởng thành có không bào trung tâm rất lớn chứa dịch tế bào, giúp duy trì sức trương nước và dự trữ các chất hòa tan.",
    "tags": [
      "Sinh học",
      "Tế bào",
      "Thực vật học"
    ]
  },
  {
    "id": "q-mh500-b2-088",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Loài động vật có vú nào duy nhất có khả năng bay thực sự bằng đôi cánh cấu tạo từ màng da căng giữa các ngón chi trước?",
    "a": "Sóc bay Úc",
    "b": "Chồn bay Sunda",
    "c": "Dơi",
    "d": "Cáo bay nhiệt đới",
    "ans": "C",
    "exp": "Dơi thuộc bộ Cánh da Chiroptera là nhóm thú duy nhất có khả năng vỗ cánh bay lượn chủ động, trong khi sóc bay hay chồn bay chỉ lượn nhờ màng da.",
    "tags": [
      "Sinh học",
      "Động vật học"
    ]
  },
  {
    "id": "q-mh500-b2-089",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Trong mắt người, bộ phận nào chứa các tế bào thụ cảm ánh sáng hình nón và hình que để tiếp nhận hình ảnh?",
    "a": "Giác mạc",
    "b": "Thủy tinh thể",
    "c": "Mống mắt",
    "d": "Võng mạc",
    "ans": "D",
    "exp": "Võng mạc là lớp màng thần kinh ở đáy mắt chứa tế bào que cảm nhận ánh sáng yếu và tế bào nón cảm nhận màu sắc cùng độ phân giải cao.",
    "tags": [
      "Sinh học",
      "Giải phẫu"
    ]
  },
  {
    "id": "q-mh500-b2-090",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Bệnh sốt rét ở người do ký sinh trùng Plasmodium gây ra và được truyền từ người sang người thông qua vật chủ trung gian nào?",
    "a": "Muỗi Anopheles cái",
    "b": "Muỗi vằn Aedes aegypti",
    "c": "Bọ chét chuột",
    "d": "Ruồi ngủ Tsetse",
    "ans": "A",
    "exp": "Ký sinh trùng sốt rét Plasmodium phát triển trong tuyến nước bọt của muỗi Anopheles cái và xâm nhập vào máu người khi muỗi đốt.",
    "tags": [
      "Sinh học",
      "Y học",
      "Vi sinh vật"
    ]
  },
  {
    "id": "q-mh500-b2-091",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Trong chuỗi thức ăn của một hệ sinh thái trên cạn, khoảng bao nhiêu phần trăm năng lượng được truyền từ bậc dinh dưỡng thấp lên bậc kế tiếp?",
    "a": "Khoảng 50 phần trăm",
    "b": "Khoảng 10 phần trăm",
    "c": "Khoảng 90 phần trăm",
    "d": "Khoảng 100 phần trăm",
    "ans": "B",
    "exp": "Theo quy luật hình tháp năng lượng sinh thái của Lindeman, khoảng 90 phần trăm năng lượng bị thất thoát qua hô hấp và nhiệt, chỉ khoảng 10 phần trăm tích lũy ở bậc tiếp theo.",
    "tags": [
      "Sinh học",
      "Sinh thái học"
    ]
  },
  {
    "id": "q-mh500-b2-092",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Loài thực vật bắt mồi như cây nắp ấm hay cây bẫy kẹp Venus bắt và tiêu hóa côn trùng chủ yếu để bổ sung nguyên tố khoáng nào?",
    "a": "Cacbon",
    "b": "Oxy",
    "c": "Nitơ",
    "d": "Silic",
    "ans": "C",
    "exp": "Thực vật ăn thịt vẫn quang hợp bình thường để tạo đường nhưng sống ở vùng đất đầm lầy nghèo dinh dưỡng nên phải bắt côn trùng để lấy Nitơ và Photpho.",
    "tags": [
      "Sinh học",
      "Thực vật học"
    ]
  },
  {
    "id": "q-mh500-b2-093",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Cấu trúc bảo vệ nằm ở hai đầu mút của nhiễm sắc thể nhân thực giúp ngăn chặn sự suy thoái ADN và ngắn dần sau mỗi lần phân bào là gì?",
    "a": "Tâm động Centromere",
    "b": "Hạch nhân Nucleolus",
    "c": "Plasmid vòng",
    "d": "Telomere",
    "ans": "D",
    "exp": "Telomere là các trình tự nucleotide lặp lại ở đầu mút nhiễm sắc thể, có vai trò bảo vệ thông tin di truyền và liên quan mật thiết đến quá trình lão hóa tế bào.",
    "tags": [
      "Sinh học",
      "Tế bào",
      "Di truyền"
    ]
  },
  {
    "id": "q-mh500-b2-094",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Ở loài ong mật, những con ong đực được hình thành từ trứng không qua thụ tinh theo hình thức sinh sản trinh sinh sẽ mang bộ nhiễm sắc thể như thế nào?",
    "a": "Bộ nhiễm sắc thể đơn bội n",
    "b": "Bộ nhiễm sắc thể lưỡng bội 2n",
    "c": "Bộ nhiễm sắc thể tam bội 3n",
    "d": "Bộ nhiễm sắc thể tứ bội 4n",
    "ans": "A",
    "exp": "Ở ong mật, trứng được thụ tinh phát triển thành ong chúa hoặc ong thợ lưỡng bội 2n, còn trứng không thụ tinh phát triển thành ong đực đơn bội n.",
    "tags": [
      "Sinh học",
      "Động vật học",
      "Di truyền"
    ]
  },
  {
    "id": "q-mh500-b2-095",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Enzyme tiêu hóa nào có trong nước bọt của con người giúp phân giải bước đầu tinh bột chín thành đường maltose ngay tại khoang miệng?",
    "a": "Pepsin",
    "b": "Amylase",
    "c": "Lipase",
    "d": "Trypsin",
    "ans": "B",
    "exp": "Tuyến nước bọt tiết ra enzyme Amylase hoạt động trong môi trường trung tính hoặc kiềm nhẹ để thủy phân tinh bột chín thành đường đôi maltose.",
    "tags": [
      "Sinh học",
      "Giải phẫu",
      "Y học"
    ]
  },
  {
    "id": "q-mh500-b2-096",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Loài động vật thân mềm có 3 quả tim, 9 bộ não phụ và trung ương cùng dòng máu màu xanh lam do chứa hemocyanin giàu đồng là con gì?",
    "a": "Cá voi xanh",
    "b": "Sao biển gai",
    "c": "Bạch tuộc",
    "d": "Sứa hộp Úc",
    "ans": "C",
    "exp": "Bạch tuộc có 2 tim mang bơm máu qua mang, 1 tim hệ thống bơm máu đi nuôi cơ thể và huyết sắc tố hemocyanin chứa đồng tạo nên máu màu xanh.",
    "tags": [
      "Sinh học",
      "Động vật học"
    ]
  },
  {
    "id": "q-mh500-b2-097",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Mô hình điều hòa hoạt động của gen ở vi khuẩn đường ruột E. coli thông qua Operon Lac do hai nhà khoa học nào phát hiện?",
    "a": "James Watson và Francis Crick",
    "b": "Thomas Hunt Morgan và Alfred Sturtevant",
    "c": "Matthew Meselson và Franklin Stahl",
    "d": "Francois Jacob và Jacques Monod",
    "ans": "D",
    "exp": "Năm 1961, Francois Jacob và Jacques Monod đã công bố cơ chế điều hòa biểu hiện gen qua mô hình Operon Lac ở vi khuẩn E. coli và nhận giải Nobel năm 1965.",
    "tags": [
      "Sinh học",
      "Di truyền",
      "Vi sinh vật"
    ]
  },
  {
    "id": "q-mh500-b2-098",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Hợp chất hữu cơ nào tích tụ trong cơ bắp khi cơ thể vận động cường độ cao trong điều kiện thiếu oxy gây ra cảm giác mỏi cơ?",
    "a": "Axit lactic",
    "b": "Axit uric",
    "c": "Axit axetic",
    "d": "Axit citric",
    "ans": "A",
    "exp": "Khi cơ hoạt động quá sức và cung cấp oxy không đủ, tế bào cơ chuyển sang hô hấp kỵ khí phân giải glucose thành axit lactic gây mỏi cơ.",
    "tags": [
      "Sinh học",
      "Giải phẫu",
      "Y học"
    ]
  },
  {
    "id": "q-mh500-b2-099",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Loại vi khuẩn cổ Archaea có khả năng sinh ra khí metan thường sống ở những môi trường có đặc điểm sinh thái như thế nào?",
    "a": "Môi trường giàu oxy trên mặt lá cây",
    "b": "Môi trường kỵ khí nghiêm ngặt như bùn đầm lầy và dạ cỏ động vật nhai lại",
    "c": "Môi trường băng tuyết khô hạn trên đỉnh núi cao",
    "d": "Môi trường nước biển tầng mặt nhiều ánh sáng",
    "ans": "B",
    "exp": "Vi khuẩn cổ sinh metan là những sinh vật kỵ khí bắt buộc, khử CO2 bằng H2 để tạo ra khí CH4 trong đầm lầy hoặc đường tiêu hóa gia súc.",
    "tags": [
      "Sinh học",
      "Vi sinh vật",
      "Sinh thái học"
    ]
  },
  {
    "id": "q-mh500-b2-100",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Địa y thường bám trên thân cây gỗ hoặc tảng đá thực chất là một dạng tổ hợp cộng sinh chặt chẽ giữa hai nhóm sinh vật nào?",
    "a": "Rêu và dương xỉ",
    "b": "Động vật nguyên sinh và vi khuẩn",
    "c": "Nấm và tảo lục hoặc vi khuẩn lam",
    "d": "Thực vật hạt trần và nấm nhầy",
    "ans": "C",
    "exp": "Địa y là sự cộng sinh giữa sợi nấm giúp hút nước, khoáng và bảo vệ, cùng với tảo hoặc vi khuẩn lam có khả năng quang hợp tổng hợp chất hữu cơ.",
    "tags": [
      "Sinh học",
      "Sinh thái học",
      "Thực vật học"
    ]
  },
  {
    "id": "q-mh500-b2-101",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Ở thực vật có hoa, hiện tượng thụ tinh kép đặc trưng diễn ra khi hai giao tử đực cùng tham gia thụ tinh tạo thành hợp tử và cấu trúc nào?",
    "a": "Vỏ hạt",
    "b": "Ống phấn",
    "c": "Bầu nhụy",
    "d": "Nội nhũ tam bội nuôi phôi",
    "ans": "D",
    "exp": "Trong thụ tinh kép ở thực vật hạt kín, một tinh tử kết hợp với trứng tạo hợp tử 2n, tinh tử còn lại kết hợp với nhân cực tạo nội nhũ tam bội 3n.",
    "tags": [
      "Sinh học",
      "Thực vật học"
    ]
  },
  {
    "id": "q-mh500-b2-102",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Cơ chế tự điều chỉnh các chỉ số sinh lý bên trong cơ thể như thân nhiệt, độ pH máu và huyết áp luôn ổn định quanh mức bình thường gọi là gì?",
    "a": "Cân bằng nội môi Homeostasis",
    "b": "Biến thái hoàn toàn",
    "c": "Thích nghi kiểu hình",
    "d": "Phản xạ có điều kiện",
    "ans": "A",
    "exp": "Cân bằng nội môi là khả năng duy trì sự ổn định của môi trường trong cơ thể trước những biến đổi của môi trường bên ngoài nhờ hệ thần kinh và thể dịch.",
    "tags": [
      "Sinh học",
      "Giải phẫu",
      "Y học"
    ]
  },
  {
    "id": "q-mh500-b2-103",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Công nghệ chỉnh sửa gen hiện đại đạt giải Nobel Hóa học năm 2020 dựa trên cơ chế phòng vệ tự nhiên của vi khuẩn chống lại virus có tên là gì?",
    "a": "Kỹ thuật PCR khuếch đại ADN",
    "b": "Hệ thống CRISPR Cas9",
    "c": "Điện di trên gel Agarose",
    "d": "Nhân bản vô tính chuyển nhân SCNT",
    "ans": "B",
    "exp": "Emmanuelle Charpentier và Jennifer Doudna đã phát triển công cụ kéo cắt phân tử CRISPR Cas9 giúp chỉnh sửa trình tự ADN với độ chính xác cực cao.",
    "tags": [
      "Sinh học",
      "Di truyền",
      "Y học"
    ]
  },
  {
    "id": "q-mh500-b2-104",
    "cat": "cat-nature",
    "diff": "MEDIUM",
    "q": "Loài bò sát nào nổi tiếng với khả năng thay đổi màu sắc da nhờ các tế bào sắc tố đặc biệt để giao tiếp, điều hòa nhiệt độ và ngụy trang?",
    "a": "Kỳ đà Komodo",
    "b": "Rùa biển Galápagos",
    "c": "Tắc kè hoa Chameleon",
    "d": "Cá sấu sông Nile",
    "ans": "C",
    "exp": "Da của tắc kè hoa chứa các lớp tinh thể nano trong tế bào iridophore có thể thay đổi khoảng cách để phản xạ các bước sóng ánh sáng khác nhau.",
    "tags": [
      "Sinh học",
      "Động vật học"
    ]
  },
  {
    "id": "q-mh500-b2-105",
    "cat": "cat-nature",
    "diff": "HARD",
    "q": "Trong chu trình chuyển hóa Nitơ trong tự nhiên, nhóm vi khuẩn nào thực hiện quá trình chuyển hóa ngược từ muối nitrat NO3- trong đất thành khí N2 bay lên trời?",
    "a": "Vi khuẩn cố định đạm",
    "b": "Vi khuẩn nitrat hóa",
    "c": "Vi khuẩn amon hóa",
    "d": "Vi khuẩn phản nitrat hóa",
    "ans": "D",
    "exp": "Vi khuẩn phản nitrat hóa hoạt động trong điều kiện đất kỵ khí, biến đổi NO3- thành khí nitơ phân tử N2 làm thất thoát đạm trong đất canh tác.",
    "tags": [
      "Sinh học",
      "Vi sinh vật",
      "Sinh thái học"
    ]
  },
  {
    "id": "q-mh500-b3-001",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Trong cấu trúc dữ liệu, cấu trúc nào hoạt động theo nguyên lý vào sau ra trước LIFO?",
    "a": "Ngăn xếp Stack",
    "b": "Hàng đợi Queue",
    "c": "Danh sách liên kết đơn",
    "d": "Cây nhị phân tìm kiếm",
    "ans": "A",
    "exp": "Ngăn xếp Stack hoạt động theo cơ chế Last In First Out, phần tử được thêm vào cuối cùng sẽ được lấy ra đầu tiên.",
    "tags": [
      "Công nghệ",
      "Khoa học máy tính"
    ]
  },
  {
    "id": "q-mh500-b3-002",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Thuật toán tìm kiếm nhị phân Binary Search có độ phức tạp thời gian trong trường hợp xấu nhất là bao nhiêu?",
    "a": "Tuyến tính theo số phần tử",
    "b": "Logarit cơ số 2 của số phần tử",
    "c": "Bình phương số phần tử",
    "d": "Hằng số không đổi",
    "ans": "B",
    "exp": "Mỗi bước tìm kiếm nhị phân chia đôi không gian tìm kiếm nên độ phức tạp thời gian là O log n.",
    "tags": [
      "Công nghệ",
      "Thuật toán"
    ]
  },
  {
    "id": "q-mh500-b3-003",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Trong mô hình mạng OSI 7 tầng, tầng nào chịu trách nhiệm định tuyến gói tin giữa các mạng khác nhau?",
    "a": "Tầng liên kết dữ liệu",
    "b": "Tầng giao vận",
    "c": "Tầng mạng",
    "d": "Tầng phiên",
    "ans": "C",
    "exp": "Tầng mạng Network Layer chịu trách nhiệm gán địa chỉ logic IP và định tuyến gói tin qua các nút mạng.",
    "tags": [
      "Công nghệ",
      "Mạng máy tính"
    ]
  },
  {
    "id": "q-mh500-b3-004",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Giao thức nào được sử dụng để phân giải tên miền thành địa chỉ IP trong mạng Internet?",
    "a": "DHCP",
    "b": "FTP",
    "c": "SMTP",
    "d": "DNS",
    "ans": "D",
    "exp": "Hệ thống phân giải tên miền DNS chuyển đổi tên miền dễ nhớ sang địa chỉ IP số học tương ứng.",
    "tags": [
      "Công nghệ",
      "Internet"
    ]
  },
  {
    "id": "q-mh500-b3-005",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Cổng mặc định tiêu chuẩn của giao thức truyền tải siêu văn bản bảo mật HTTPS là cổng số mấy?",
    "a": "443",
    "b": "21",
    "c": "80",
    "d": "22",
    "ans": "A",
    "exp": "Giao thức HTTPS mặc định sử dụng cổng TCP 443, trong khi HTTP thông thường sử dụng cổng 80.",
    "tags": [
      "Công nghệ",
      "Mạng máy tính"
    ]
  },
  {
    "id": "q-mh500-b3-006",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Trong hệ điều hành, hiện tượng hai hay nhiều tiến trình chờ đợi lẫn nhau giải phóng tài nguyên dẫn đến treo vĩnh viễn gọi là gì?",
    "a": "Phân mảnh bộ nhớ",
    "b": "Khóa chết Deadlock",
    "c": "Tràn bộ đệm",
    "d": "Đói tài nguyên Starvation",
    "ans": "B",
    "exp": "Deadlock xảy ra khi các tiến trình giữ tài nguyên và chờ tài nguyên do tiến trình khác đang giữ tạo thành vòng lặp khép kín.",
    "tags": [
      "Công nghệ",
      "Hệ điều hành"
    ]
  },
  {
    "id": "q-mh500-b3-007",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Ai là tác giả ban đầu tạo ra nhân hệ điều hành Linux vào năm 1991?",
    "a": "Richard Stallman",
    "b": "Dennis Ritchie",
    "c": "Linus Torvalds",
    "d": "Ken Thompson",
    "ans": "C",
    "exp": "Linus Torvalds phát triển nhân Linux khi còn là sinh viên tại Đại học Helsinki, Phần Lan năm 1991.",
    "tags": [
      "Công nghệ",
      "Lịch sử công nghệ"
    ]
  },
  {
    "id": "q-mh500-b3-008",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Nguyên tố hóa học nào là vật liệu bán dẫn phổ biến nhất được dùng để chế tạo vi mạch điện tử hiện nay?",
    "a": "Đồng",
    "b": "Nhôm",
    "c": "Vàng",
    "d": "Silic",
    "ans": "D",
    "exp": "Silic có tính chất bán dẫn ổn định, trữ lượng dồi dào và dễ tạo lớp cách điện oxit trên bề mặt.",
    "tags": [
      "Công nghệ",
      "Bán dẫn"
    ]
  },
  {
    "id": "q-mh500-b3-009",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Định luật Moore dự đoán rằng số lượng bóng bán dẫn trên mỗi vi mạch tích hợp sẽ tăng gấp đôi sau khoảng thời gian bao lâu?",
    "a": "Khoảng 18 đến 24 tháng",
    "b": "Khoảng 6 tháng",
    "c": "Khoảng 5 năm",
    "d": "Khoảng 10 năm",
    "ans": "A",
    "exp": "Gordon Moore đưa ra nhận định số lượng transistor trên một chip tăng gấp đôi sau mỗi 18 đến 24 tháng.",
    "tags": [
      "Công nghệ",
      "Bán dẫn"
    ]
  },
  {
    "id": "q-mh500-b3-010",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Trong mật mã học, thuật toán RSA thuộc nhóm mã hóa nào?",
    "a": "Mã hóa đối xứng",
    "b": "Mã hóa bất đối xứng khóa công khai",
    "c": "Hàm băm một chiều",
    "d": "Mã hóa dòng tuần tự",
    "ans": "B",
    "exp": "RSA là thuật toán mã hóa khóa công khai bất đối xứng dựa trên độ khó của bài toán phân tích thừa số nguyên tố lớn.",
    "tags": [
      "Công nghệ",
      "Bảo mật"
    ]
  },
  {
    "id": "q-mh500-b3-011",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Tấn công mạng bằng cách làm ngập máy chủ mục tiêu bằng lượng lớn lưu lượng truy cập giả mạo từ nhiều nguồn được gọi là gì?",
    "a": "Phishing",
    "b": "SQL Injection",
    "c": "DDoS",
    "d": "Man in the Middle",
    "ans": "C",
    "exp": "DDoS là tấn công từ chối dịch vụ phân tán khiến hệ thống cạn kiệt tài nguyên không thể phục vụ người dùng hợp lệ.",
    "tags": [
      "Công nghệ",
      "Bảo mật"
    ]
  },
  {
    "id": "q-mh500-b3-012",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Trong trí tuệ nhân tạo, kiến trúc Transformer nổi tiếng được giới thiệu lần đầu vào năm 2017 bởi nhóm nghiên cứu của tổ chức nào?",
    "a": "Meta AI",
    "b": "Microsoft Research",
    "c": "OpenAI",
    "d": "Google Brain và Google Research",
    "ans": "D",
    "exp": "Bài báo Attention Is All You Need giới thiệu kiến trúc Transformer do các nhà nghiên cứu tại Google công bố năm 2017.",
    "tags": [
      "Công nghệ",
      "AI"
    ]
  },
  {
    "id": "q-mh500-b3-013",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Trong cơ sở dữ liệu quan hệ, tập hợp bốn tính chất đảm bảo giao dịch an toàn được viết tắt là gì?",
    "a": "ACID",
    "b": "CRUD",
    "c": "SOLID",
    "d": "REST",
    "ans": "A",
    "exp": "ACID gồm Atomicity, Consistency, Isolation và Durability đảm bảo độ tin cậy của giao dịch cơ sở dữ liệu.",
    "tags": [
      "Công nghệ",
      "Cơ sở dữ liệu"
    ]
  },
  {
    "id": "q-mh500-b3-014",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Loại bộ nhớ nào trong máy tính là bộ nhớ khả biến, sẽ mất toàn bộ dữ liệu khi ngắt nguồn điện?",
    "a": "Ổ cứng SSD",
    "b": "Bộ nhớ RAM",
    "c": "Bộ nhớ ROM",
    "d": "Thẻ nhớ Flash",
    "ans": "B",
    "exp": "RAM là bộ nhớ truy cập ngẫu nhiên khả biến, cần nguồn điện duy trì để lưu giữ dữ liệu tạm thời.",
    "tags": [
      "Công nghệ",
      "Phần cứng"
    ]
  },
  {
    "id": "q-mh500-b3-015",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Trong hệ thống quản lý phiên bản Git, lệnh nào dùng để kết hợp lịch sử từ một nhánh khác vào nhánh hiện tại?",
    "a": "git clone",
    "b": "git stash",
    "c": "git merge",
    "d": "git status",
    "ans": "C",
    "exp": "Lệnh git merge dùng để tích hợp các thay đổi từ nhánh chỉ định vào nhánh đang làm việc hiện tại.",
    "tags": [
      "Công nghệ",
      "Phần mềm"
    ]
  },
  {
    "id": "q-mh500-b3-016",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Trong kinh tế học vĩ mô, chỉ số nào đo lường tổng giá trị thị trường của tất cả hàng hóa và dịch vụ cuối cùng được sản xuất trong phạm vi lãnh thổ một quốc gia?",
    "a": "CPI",
    "b": "PPI",
    "c": "GNI",
    "d": "GDP",
    "ans": "D",
    "exp": "Tổng sản phẩm quốc nội GDP tính giá trị sản xuất trong phạm vi lãnh thổ quốc gia trong một kỳ nhất định.",
    "tags": [
      "Kinh tế",
      "Kinh tế vĩ mô"
    ]
  },
  {
    "id": "q-mh500-b3-017",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Hiện tượng mức giá chung của nền kinh tế vẫn tiếp tục tăng nhưng tốc độ tăng chậm lại so với giai đoạn trước được gọi là gì?",
    "a": "Thiểu phát",
    "b": "Giảm phát",
    "c": "Siêu lạm phát",
    "d": "Đình lạm",
    "ans": "A",
    "exp": "Thiểu phát Disinflation là sự giảm tốc độ lạm phát, tức giá cả vẫn tăng nhưng với tỷ lệ thấp hơn.",
    "tags": [
      "Kinh tế",
      "Tài chính"
    ]
  },
  {
    "id": "q-mh500-b3-018",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Trong kinh tế học vi mô, chi phí cơ hội được định nghĩa chính xác là gì?",
    "a": "Tổng số tiền mặt thực tế đã chi ra để mua nguyên vật liệu",
    "b": "Giá trị của phương án tốt nhất bị bỏ qua khi đưa ra một lựa chọn kinh tế",
    "c": "Chi phí cố định không thể thu hồi được trong ngắn hạn",
    "d": "Chênh lệch giữa tổng doanh thu và tổng chi phí kế toán",
    "ans": "B",
    "exp": "Chi phí cơ hội là lợi ích của phương án thay thế tốt nhất phải hy sinh khi chọn một phương án khác.",
    "tags": [
      "Kinh tế",
      "Kinh tế vi mô"
    ]
  },
  {
    "id": "q-mh500-b3-019",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Khi ngân hàng trung ương muốn thực hiện chính sách tiền tệ thắt chặt để kiềm chế lạm phát, họ thường áp dụng biện pháp nào?",
    "a": "Giảm tỷ lệ dự trữ bắt buộc",
    "b": "Mua vào lượng lớn ngoại tệ và trái phiếu",
    "c": "Tăng lãi suất chiết khấu hoặc bán trái phiếu chính phủ trên thị trường mở",
    "d": "In thêm tiền mặt lưu thông",
    "ans": "C",
    "exp": "Tăng lãi suất và bán trái phiếu giúp rút bớt tiền lưu thông khỏi hệ thống ngân hàng, làm giảm cung tiền.",
    "tags": [
      "Kinh tế",
      "Tiền tệ"
    ]
  },
  {
    "id": "q-mh500-b3-020",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Nhà kinh tế học cổ điển nào là tác giả khái niệm Bàn tay vô hình trong tác phẩm Sự giàu có của các quốc gia năm 1776?",
    "a": "John Maynard Keynes",
    "b": "David Ricardo",
    "c": "Milton Friedman",
    "d": "Adam Smith",
    "ans": "D",
    "exp": "Adam Smith dùng hình ảnh Bàn tay vô hình để mô tả cơ chế tự điều tiết của thị trường tự do thông qua lợi ích cá nhân.",
    "tags": [
      "Kinh tế",
      "Lịch sử kinh tế"
    ]
  },
  {
    "id": "q-mh500-b3-021",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Lý thuyết lợi thế so sánh trong thương mại quốc tế được phát triển hoàn chỉnh bởi nhà kinh tế học nào?",
    "a": "David Ricardo",
    "b": "Thomas Malthus",
    "c": "Paul Samuelson",
    "d": "Alfred Marshall",
    "ans": "A",
    "exp": "David Ricardo chứng minh các quốc gia đều có lợi khi chuyên môn hóa sản xuất mặt hàng có chi phí cơ hội thấp hơn.",
    "tags": [
      "Kinh tế",
      "Thương mại quốc tế"
    ]
  },
  {
    "id": "q-mh500-b3-022",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Trên thị trường chứng khoán, cổ phiếu và trái phiếu khác nhau cơ bản ở điểm nào?",
    "a": "Cổ phiếu là chứng chỉ ghi nợ còn trái phiếu là chứng nhận góp vốn",
    "b": "Cổ phiếu xác nhận quyền sở hữu cổ phần còn trái phiếu xác nhận nghĩa vụ nợ",
    "c": "Cổ phiếu luôn có lãi suất cố định hàng năm còn trái phiếu thì không",
    "d": "Trái phiếu không bao giờ có thời hạn đáo hạn",
    "ans": "B",
    "exp": "Người mua cổ phiếu là cổ đông sở hữu một phần công ty, còn người mua trái phiếu là chủ nợ cho đơn vị phát hành vay vốn.",
    "tags": [
      "Kinh tế",
      "Tài chính"
    ]
  },
  {
    "id": "q-mh500-b3-023",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Hệ số Gini trong kinh tế học dùng để đo lường điều gì?",
    "a": "Tốc độ tăng trưởng năng suất lao động",
    "b": "Tỷ lệ nợ công trên tổng sản phẩm quốc nội",
    "c": "Mức độ bất bình đẳng trong phân phối thu nhập của dân cư",
    "d": "Độ nhạy cảm của cầu theo giá cả",
    "ans": "C",
    "exp": "Hệ số Gini nhận giá trị từ 0 đến 1, phản ánh mức độ chênh lệch giàu nghèo và bất bình đẳng thu nhập.",
    "tags": [
      "Kinh tế",
      "Kinh tế vĩ mô"
    ]
  },
  {
    "id": "q-mh500-b3-024",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Trong viễn thông, công nghệ truyền dẫn cáp quang hoạt động dựa trên hiện tượng vật lý cốt lõi nào của ánh sáng?",
    "a": "Nhiễu xạ ánh sáng",
    "b": "Giao thoa sóng điện từ",
    "c": "Tán sắc ánh sáng",
    "d": "Phản xạ toàn phần",
    "ans": "D",
    "exp": "Sợi quang giữ tín hiệu ánh sáng truyền đi xa nhờ hiện tượng phản xạ toàn phần giữa lõi có chiết suất cao và lớp vỏ chiết suất thấp.",
    "tags": [
      "Công nghệ",
      "Viễn thông"
    ]
  },
  {
    "id": "q-mh500-b3-025",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Trong kiến trúc máy tính, bộ nhớ đệm nằm trực tiếp bên trong hoặc rất gần CPU để tăng tốc độ truy xuất dữ liệu được gọi là gì?",
    "a": "Bộ nhớ Cache",
    "b": "Bộ nhớ ảo Virtual Memory",
    "c": "Thanh ghi ngoài",
    "d": "Bộ nhớ thứ cấp",
    "ans": "A",
    "exp": "CPU Cache như L1, L2, L3 sử dụng SRAM tốc độ rất cao để lưu các lệnh và dữ liệu thường xuyên truy cập.",
    "tags": [
      "Công nghệ",
      "Kiến trúc máy tính"
    ]
  },
  {
    "id": "q-mh500-b3-026",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Loại hàng hóa mà khi giá của nó tăng lên thì lượng cầu của người tiêu dùng đối với nó cũng tăng theo do hiệu ứng thu nhập lấn át hiệu ứng thay thế được gọi là gì?",
    "a": "Hàng hóa thông thường",
    "b": "Hàng hóa Giffen",
    "c": "Hàng hóa công cộng",
    "d": "Hàng hóa bổ sung",
    "ans": "B",
    "exp": "Hàng hóa Giffen là hàng hóa thứ cấp đặc biệt có đường cầu dốc lên vì tác động thu nhập âm lớn hơn tác động thay thế.",
    "tags": [
      "Kinh tế",
      "Kinh tế vi mô"
    ]
  },
  {
    "id": "q-mh500-b3-027",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Giao thức mạng nào ở tầng giao vận cung cấp dịch vụ truyền dữ liệu không kết nối, tốc độ nhanh nhưng không đảm bảo độ tin cậy?",
    "a": "TCP",
    "b": "ICMP",
    "c": "UDP",
    "d": "ARP",
    "ans": "C",
    "exp": "UDP truyền các gói tin độc lập không cần thiết lập kết nối và không kiểm tra truyền lại, phù hợp cho phát trực tuyến hoặc gọi thoại.",
    "tags": [
      "Công nghệ",
      "Mạng máy tính"
    ]
  },
  {
    "id": "q-mh500-b3-028",
    "cat": "cat-tech",
    "diff": "MEDIUM",
    "q": "Hiện tượng nền kinh tế vừa suy thoái đình trệ vừa có tỷ lệ lạm phát cao cùng lúc được gọi bằng thuật ngữ nào?",
    "a": "Giảm phát chu kỳ",
    "b": "Chu kỳ kinh doanh thực",
    "c": "Bẫy thanh khoản",
    "d": "Đình lạm Stagflation",
    "ans": "D",
    "exp": "Đình lạm kết hợp giữa đình trệ sản xuất thất nghiệp cao và lạm phát tăng mạnh, thường do cú sốc cung tiêu cực.",
    "tags": [
      "Kinh tế",
      "Kinh tế vĩ mô"
    ]
  },
  {
    "id": "q-mh500-b3-029",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Định lý CAP của Eric Brewer phát biểu rằng một hệ thống dữ liệu phân tán không thể đồng thời đảm bảo tuyệt đối cả ba tính chất nào?",
    "a": "Tính nhất quán, Tính sẵn sàng và Khả năng chịu phân vùng mạng",
    "b": "Tính nguyên tử, Tính cô lập và Tính bền vững",
    "c": "Tính bảo mật, Tính toàn vẹn và Tính xác thực",
    "d": "Tính mở rộng, Tính chịu lỗi và Tốc độ phản hồi",
    "ans": "A",
    "exp": "Định lý CAP chỉ ra rằng khi xảy ra phân vùng mạng Partition tolerance, hệ thống chỉ có thể chọn giữa Consistency hoặc Availability.",
    "tags": [
      "Công nghệ",
      "Hệ phân tán"
    ]
  },
  {
    "id": "q-mh500-b3-030",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Thuật toán tìm đường đi ngắn nhất từ một đỉnh nguồn đến mọi đỉnh khác trong đồ thị có trọng số âm nhưng không có chu trình âm là thuật toán nào?",
    "a": "Thuật toán Dijkstra",
    "b": "Thuật toán Bellman Ford",
    "c": "Thuật toán Prim",
    "d": "Thuật toán Kruskal",
    "ans": "B",
    "exp": "Dijkstra không xử lý đúng cạnh có trọng số âm, trong khi Bellman Ford giải quyết được và phát hiện được chu trình âm.",
    "tags": [
      "Công nghệ",
      "Thuật toán"
    ]
  },
  {
    "id": "q-mh500-b3-031",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Trong hệ thống tập tin và chuỗi khối, cấu trúc cây mà mỗi nút lá chứa giá trị băm của dữ liệu và nút cha chứa giá trị băm tổ hợp của các nút con gọi là gì?",
    "a": "Cây đỏ đen Red Black Tree",
    "b": "Cây tiền tố Trie",
    "c": "Cây Merkle",
    "d": "Cây phân đoạn Segment Tree",
    "ans": "C",
    "exp": "Cây băm Merkle do Ralph Merkle phát minh giúp xác minh tính toàn vẹn dữ liệu nhanh chóng và hiệu quả trong Git, Bitcoin.",
    "tags": [
      "Công nghệ",
      "Mật mã học"
    ]
  },
  {
    "id": "q-mh500-b3-032",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Bài toán các vị tướng Byzantine trong khoa học máy tính mô tả thách thức cốt lõi nào của hệ thống phân tán?",
    "a": "Tối ưu hóa băng thông truyền tải qua cáp biển",
    "b": "Giải mã các khóa mật mã lượng tử trong thời gian đa thức",
    "c": "Phân bổ bộ nhớ động không gây phân mảnh ngoại vi",
    "d": "Đạt được sự đồng thuận khi có một số nút mạng bị lỗi hoặc cố tình gửi thông tin gian lận",
    "ans": "D",
    "exp": "Bài toán Byzantine Generals do Lamport, Shostak và Pease đặt ra nhằm tìm cơ chế đồng thuận tin cậy bất chấp các nút phản bội.",
    "tags": [
      "Công nghệ",
      "Hệ phân tán"
    ]
  },
  {
    "id": "q-mh500-b3-033",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Trong cơ chế kiểm soát tắc nghẽn của giao thức TCP, sau giai đoạn khởi đầu chậm Slow Start, khi cửa sổ tắc nghẽn vượt ngưỡng ssthresh thì thuật toán chuyển sang pha nào?",
    "a": "Tránh tắc nghẽn Congestion Avoidance",
    "b": "Phục hồi nhanh Fast Recovery",
    "c": "Truyền lại tức thời Fast Retransmit",
    "d": "Đóng kết nối chủ động",
    "ans": "A",
    "exp": "Khi cwnd đạt ngưỡng ssthresh, TCP chuyển từ tăng theo cấp số nhân ở Slow Start sang tăng tuyến tính ở pha Congestion Avoidance.",
    "tags": [
      "Công nghệ",
      "Mạng máy tính"
    ]
  },
  {
    "id": "q-mh500-b3-034",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Giao thức định tuyến nào là giao thức chuẩn hiện nay dùng để trao đổi thông tin định tuyến giữa các hệ thống tự trị AS trên mạng Internet toàn cầu?",
    "a": "OSPF",
    "b": "BGP",
    "c": "RIP",
    "d": "EIGRP",
    "ans": "B",
    "exp": "Border Gateway Protocol BGP là giao thức định tuyến liên miền cốt lõi kết nối các nhà mạng và hệ thống tự trị trên Internet.",
    "tags": [
      "Công nghệ",
      "Mạng máy tính"
    ]
  },
  {
    "id": "q-mh500-b3-035",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Trong kiến trúc vi xử lý hiện đại, lỗ hổng bảo mật Spectre khai thác cơ chế tối ưu hóa phần cứng nào của CPU?",
    "a": "Bộ nhớ đệm cấp độ cuối L3",
    "b": "Ảo hóa phần cứng cấp độ nhân",
    "c": "Thực thi suy đoán Speculative Execution và dự đoán rẽ nhánh",
    "d": "Truy cập bộ nhớ trực tiếp DMA",
    "ans": "C",
    "exp": "Spectre lợi dụng việc CPU thực thi suy đoán các nhánh lệnh trước khi kiểm tra quyền, để lại dấu vết rò rỉ qua kênh kề bộ nhớ Cache.",
    "tags": [
      "Công nghệ",
      "Bảo mật"
    ]
  },
  {
    "id": "q-mh500-b3-036",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Thuật toán trao đổi khóa Diffie Hellman dựa trên độ khó tính toán của bài toán toán học nào?",
    "a": "Phân tích một hợp số lớn ra thừa số nguyên tố",
    "b": "Giải hệ phương trình tuyến tính đa biến",
    "c": "Tìm đường đi Hamilton trong đồ thị có hướng",
    "d": "Bài toán logarit rời rạc trên trường hữu hạn",
    "ans": "D",
    "exp": "Độ an toàn của trao đổi khóa Diffie Hellman cổ điển dựa vào tính khó đảo ngược của phép toán logarit rời rạc.",
    "tags": [
      "Công nghệ",
      "Mật mã học"
    ]
  },
  {
    "id": "q-mh500-b3-037",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Công nghệ quang khắc cực tím bước sóng ngắn EUV dùng để sản xuất chip bán dẫn tiến trình dưới 7 nanomet sử dụng ánh sáng có bước sóng xấp xỉ bao nhiêu?",
    "a": "13,5 nanomet",
    "b": "193 nanomet",
    "c": "365 nanomet",
    "d": "1,2 nanomet",
    "ans": "A",
    "exp": "Máy quang khắc EUV tạo ra tia cực tím siêu ngắn có bước sóng 13,5 nm từ plasma giọt thiếc nóng chảy để khắc các mạch siêu nhỏ.",
    "tags": [
      "Công nghệ",
      "Bán dẫn"
    ]
  },
  {
    "id": "q-mh500-b3-038",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Trong học sâu Deep Learning, hiện tượng đạo hàm trở nên cực kỳ nhỏ khi lan truyền ngược qua nhiều tầng ẩn khiến trọng số các tầng đầu gần như không cập nhật gọi là gì?",
    "a": "Quá khớp Overfitting",
    "b": "Triệt tiêu đạo hàm Vanishing Gradient",
    "c": "Bùng nổ không gian trạng thái",
    "d": "Trôi dạt dữ liệu Data Drift",
    "ans": "B",
    "exp": "Vanishing Gradient thường xảy ra với hàm kích hoạt Sigmoid hoặc Tanh trong mạng sâu, được khắc phục nhờ ReLU và kết nối tắt Residual.",
    "tags": [
      "Công nghệ",
      "AI"
    ]
  },
  {
    "id": "q-mh500-b3-039",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Thuật toán lượng tử nào do nhà toán học Peter Shor phát triển năm 1994 có khả năng phân tích thừa số nguyên tố trong thời gian đa thức, đe dọa trực tiếp mã hóa RSA?",
    "a": "Thuật toán Grover",
    "b": "Thuật toán Deutsch Jozsa",
    "c": "Thuật toán Shor",
    "d": "Thuật toán Simon",
    "ans": "C",
    "exp": "Thuật toán Shor giải bài toán tìm chu kỳ và phân tích thừa số nguyên tố nhanh hơn cấp số nhân so với máy tính cổ điển.",
    "tags": [
      "Công nghệ",
      "Máy tính lượng tử"
    ]
  },
  {
    "id": "q-mh500-b3-040",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Trong hệ điều hành hỗ trợ bộ nhớ ảo, hiện tượng hệ thống dành phần lớn thời gian để hoán đổi trang nhớ giữa RAM và ổ đĩa thay vì thực thi lệnh CPU gọi là gì?",
    "a": "Spooling",
    "b": "Caching",
    "c": "Paging",
    "d": "Thrashing",
    "ans": "D",
    "exp": "Thrashing xảy ra khi lỗi trang Page Fault liên tục xuất hiện do không đủ khung trang vật lý cho tập làm việc của các tiến trình.",
    "tags": [
      "Công nghệ",
      "Hệ điều hành"
    ]
  },
  {
    "id": "q-mh500-b3-041",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Tiêu chuẩn mã hóa nâng cao AES được Viện Tiêu chuẩn và Công nghệ Quốc gia Hoa Kỳ chọn vào năm 2001 có tên gốc từ hai nhà mật mã học người Bỉ là gì?",
    "a": "Rijndael",
    "b": "Blowfish",
    "c": "Twofish",
    "d": "Serpent",
    "ans": "A",
    "exp": "Thuật toán Rijndael do Joan Daemen và Vincent Rijmen thiết kế đã vượt qua vòng tuyển chọn để trở thành chuẩn AES.",
    "tags": [
      "Công nghệ",
      "Mật mã học"
    ]
  },
  {
    "id": "q-mh500-b3-042",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Định lý bất khả thi về bài toán dừng Halting Problem chứng minh rằng không tồn tại thuật toán tổng quát nào kiểm tra được mọi chương trình có dừng hay không là của ai?",
    "a": "John von Neumann",
    "b": "Alan Turing",
    "c": "Alonzo Church",
    "d": "Kurt Godel",
    "ans": "B",
    "exp": "Năm 1936, Alan Turing chứng minh bằng phương pháp phản chứng đường chéo rằng bài toán dừng là không thể quyết định được.",
    "tags": [
      "Công nghệ",
      "Khoa học máy tính"
    ]
  },
  {
    "id": "q-mh500-b3-043",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Trong lý thuyết thông tin, định lý Shannon Hartley xác định giới hạn tối đa của đại lượng nào trên một kênh truyền có nhiễu trắng Gauss?",
    "a": "Bước sóng của sóng mang",
    "b": "Công suất tiêu thụ nhiệt của bộ thu phát",
    "c": "Dung lượng kênh truyền theo tốc độ bit tối đa có thể truyền với xác suất lỗi nhỏ tùy ý",
    "d": "Số lượng người dùng truy cập đồng thời trên một trạm thu phát",
    "ans": "C",
    "exp": "Định lý Shannon Hartley xác định dung lượng kênh C phụ thuộc vào băng thông B và tỷ số tín hiệu trên nhiễu SNR.",
    "tags": [
      "Công nghệ",
      "Viễn thông"
    ]
  },
  {
    "id": "q-mh500-b3-044",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Trong cơ sở dữ liệu chuẩn SQL, mức cô lập giao dịch nào cho phép xảy ra hiện tượng đọc phải dữ liệu chưa được xác nhận Dirty Read?",
    "a": "Read Committed",
    "b": "Repeatable Read",
    "c": "Serializable",
    "d": "Read Uncommitted",
    "ans": "D",
    "exp": "Mức Read Uncommitted thấp nhất cho phép một giao dịch đọc dữ liệu đang bị thay đổi bởi giao dịch khác chưa commit.",
    "tags": [
      "Công nghệ",
      "Cơ sở dữ liệu"
    ]
  },
  {
    "id": "q-mh500-b3-045",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Cấu trúc dữ liệu B Tree và B Plus Tree được tối ưu hóa đặc biệt cho hệ thống lưu trữ cơ sở dữ liệu và hệ thống tập tin vì lý do chính nào?",
    "a": "Có bậc rẽ nhánh lớn giúp giảm chiều cao cây và giảm số lần đọc ghi khối đĩa I O",
    "b": "Chỉ hoạt động được trên bộ nhớ thanh ghi CPU",
    "c": "Không cần bất kỳ thao tác cân bằng cây nào khi chèn hoặc xóa",
    "d": "Tự động nén dữ liệu văn bản thành mã nhị phân tối ưu",
    "ans": "A",
    "exp": "Mỗi nút của B Tree chứa nhiều khóa khớp với kích thước trang đĩa, giúp cây rất thấp và giảm tối đa thao tác truy cập đĩa chậm chạp.",
    "tags": [
      "Công nghệ",
      "Cấu trúc dữ liệu"
    ]
  },
  {
    "id": "q-mh500-b3-046",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Trong tài chính quốc tế, Bộ ba bất khả thi của mô hình Mundell Fleming khẳng định một quốc gia không thể đồng thời duy trì cả ba yếu tố nào?",
    "a": "Tăng trưởng GDP cao, Lạm phát bằng không và Thặng dư thương mại",
    "b": "Tỷ giá hối đoái cố định, Tự do lưu chuyển vốn quốc tế và Chính sách tiền tệ độc lập",
    "c": "Ngân sách cân bằng, Thuế suất thấp và Phúc lợi xã hội toàn diện",
    "d": "Lãi suất thấp, Tỷ giá nội tệ tăng và Dự trữ ngoại hối tăng",
    "ans": "B",
    "exp": "Theo bộ ba bất khả thi Impossible Trinity, một nền kinh tế chỉ có thể chọn tối đa hai trong ba mục tiêu trên cùng một lúc.",
    "tags": [
      "Kinh tế",
      "Tài chính quốc tế"
    ]
  },
  {
    "id": "q-mh500-b3-047",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Trong kinh tế học vĩ mô, đường cong Phillips ngắn hạn phản ánh mối quan hệ đánh đổi nghịch biến giữa hai chỉ số nào?",
    "a": "Lãi suất thực và đầu tư tư nhân",
    "b": "Thuế suất và tổng thu ngân sách nhà nước",
    "c": "Tỷ lệ lạm phát và tỷ lệ thất nghiệp",
    "d": "Tỷ giá hối đoái và cán cân vãng lai",
    "ans": "C",
    "exp": "Alban Phillips phát hiện mối quan hệ nghịch biến trong ngắn hạn giữa lạm phát tiền lương giá cả và tỷ lệ thất nghiệp.",
    "tags": [
      "Kinh tế",
      "Kinh tế vĩ mô"
    ]
  },
  {
    "id": "q-mh500-b3-048",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Đường cong Laffer trong kinh tế học công cộng minh họa mối quan hệ phi tuyến tính giữa hai đại lượng nào?",
    "a": "Chi tiêu chính phủ và nợ nước ngoài",
    "b": "Cung tiền và tốc độ vòng quay tiền tệ",
    "c": "Thu nhập bình quân đầu người và mức độ ô nhiễm môi trường",
    "d": "Thuế suất và tổng số thu thuế của chính phủ",
    "ans": "D",
    "exp": "Arthur Laffer chỉ ra rằng khi thuế suất vượt quá một ngưỡng tối ưu sẽ làm giảm động lực làm việc và đầu tư, khiến tổng thu thuế sụt giảm.",
    "tags": [
      "Kinh tế",
      "Tài chính công"
    ]
  },
  {
    "id": "q-mh500-b3-049",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Trong lý thuyết trò chơi, trạng thái mà không người chơi nào có thể thu thêm lợi ích bằng cách đơn phương thay đổi chiến lược của mình khi các người chơi khác giữ nguyên chiến lược gọi là gì?",
    "a": "Cân bằng Nash",
    "b": "Hiệu quả tối ưu Pareto",
    "c": "Chiến lược thống trị tuyệt đối",
    "d": "Trò chơi có tổng bằng không",
    "ans": "A",
    "exp": "Cân bằng Nash do nhà toán học John Forbes Nash đề xuất là khái niệm nền tảng của lý thuyết trò chơi không hợp tác.",
    "tags": [
      "Kinh tế",
      "Lý thuyết trò chơi"
    ]
  },
  {
    "id": "q-mh500-b3-050",
    "cat": "cat-tech",
    "diff": "HARD",
    "q": "Hiện tượng thông tin bất cân xứng trên thị trường khiến hàng hóa chất lượng thấp đẩy hàng hóa chất lượng cao ra khỏi thị trường đã được George Akerlof phân tích qua bài báo nổi tiếng nào?",
    "a": "Bi kịch của tài nguyên chung",
    "b": "Thị trường những quả chanh The Market for Lemons",
    "c": "Bản chất của doanh nghiệp",
    "d": "Chi phí xã hội của ngoại ứng",
    "ans": "B",
    "exp": "George Akerlof dùng ví dụ thị trường xe cũ kém chất lượng gọi là Lemons để giải thích hiện tượng lựa chọn đối nghịch Adverse Selection.",
    "tags": [
      "Kinh tế",
      "Kinh tế vi mô"
    ]
  },
  {
    "id": "q-mh500-b3-056",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Kiệt tác Truyện Kiều của đại thi hào Nguyễn Du được sáng tác dựa trên cốt truyện tiểu thuyết chương hồi Kim Vân Kiều truyện của tác giả Trung Quốc nào?",
    "a": "Thi Nại Am",
    "b": "Tào Tuyết Cần",
    "c": "La Quán Trung",
    "d": "Thanh Tâm Tài Nhân",
    "ans": "D",
    "exp": "Nguyễn Du đã mượn cốt truyện Kim Vân Kiều truyện của Thanh Tâm Tài Nhân để sáng tạo nên truyện thơ Nôm Đoạn trường tân thanh.",
    "tags": [
      "Văn học",
      "Văn học trung đại"
    ]
  },
  {
    "id": "q-mh500-b3-057",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Tác phẩm Hoàng Lê nhất thống chí thuộc thể loại chí hồi phản ánh giai đoạn lịch sử cuối Lê đầu Nguyễn là sáng tác của dòng họ văn học nổi tiếng nào?",
    "a": "Ngô gia văn phái",
    "b": "Hồng Sơn văn phái",
    "c": "Tự Lực văn đoàn",
    "d": "Đông Kinh nghĩa thục",
    "ans": "A",
    "exp": "Hoàng Lê nhất thống chí là tác phẩm chữ Hán tiêu biểu của các tác giả thuộc dòng họ Ngô Thì ở làng Tả Thanh Oai, tức Ngô gia văn phái.",
    "tags": [
      "Văn học",
      "Văn học trung đại"
    ]
  },
  {
    "id": "q-mh500-b3-058",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Nguyên tác chữ Hán của ngâm khúc Chinh phụ ngâm là của tác giả Đặng Trần Côn, vậy nữ sĩ nào nổi tiếng nhất với bản diễn Nôm hiện hành của tác phẩm này?",
    "a": "Hồ Xuân Hương",
    "b": "Đoàn Thị Điểm",
    "c": "Bà Huyện Thanh Quan",
    "d": "Sương Nguyệt Anh",
    "ans": "B",
    "exp": "Bản dịch Chinh phụ ngâm diễn Nôm theo thể song thất lục bát thường được truyền tụng gắn với tên tuổi nữ sĩ Đoàn Thị Điểm và Phan Huy Ích.",
    "tags": [
      "Văn học",
      "Văn học trung đại"
    ]
  },
  {
    "id": "q-mh500-b3-059",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Tập truyện truyền kỳ viết bằng chữ Hán được Nguyễn Dữ sáng tác vào thế kỷ XVI và được mệnh danh là Thiên cổ kỳ bút có tên là gì?",
    "a": "Thánh Tông di thảo",
    "b": "Lĩnh Nam chích quái",
    "c": "Truyền kỳ mạn lục",
    "d": "Việt điện u linh tập",
    "ans": "C",
    "exp": "Truyền kỳ mạn lục của Nguyễn Dữ gồm 20 truyện chữ Hán, được Vũ Khâm Lân ca ngợi là Thiên cổ kỳ bút.",
    "tags": [
      "Văn học",
      "Văn học trung đại"
    ]
  },
  {
    "id": "q-mh500-b3-060",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Trong bài Bình Ngô đại cáo của Nguyễn Trãi, hai câu văn biền ngẫu Đem đại nghĩa để thắng hung tàn, Lấy chí nhân để thay cường bạo khẳng định tư tưởng cốt lõi nào?",
    "a": "Tư tưởng thần quyền tuyệt đối",
    "b": "Tư tưởng trọng nông ức thương",
    "c": "Tư tưởng xuất thế thoát tục của Đạo giáo",
    "d": "Tư tưởng nhân nghĩa gắn liền với bảo vệ độc lập dân tộc và yên dân",
    "ans": "D",
    "exp": "Tư tưởng nhân nghĩa của Nguyễn Trãi lấy việc trừ bạo ngược, đem lại cuộc sống thái bình cho nhân dân làm gốc.",
    "tags": [
      "Văn học",
      "Văn học trung đại"
    ]
  },
  {
    "id": "q-mh500-b3-061",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Nhà thơ nào trong phong trào Thơ mới được nhà phê bình Hoài Thanh mệnh danh là nhà thơ Mới nhất trong các nhà thơ Mới?",
    "a": "Xuân Diệu",
    "b": "Thế Lữ",
    "c": "Huy Cận",
    "d": "Chế Lan Viên",
    "ans": "A",
    "exp": "Trong cuốn Thi nhân Việt Nam, Hoài Thanh nhận định Xuân Diệu là nhà thơ mới nhất trong các nhà thơ mới với cái tôi say đắm khát khao giao cảm.",
    "tags": [
      "Văn học",
      "Thơ mới"
    ]
  },
  {
    "id": "q-mh500-b3-062",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Tập thơ đầu tay Điêu tàn xuất bản năm 1937 tràn ngập hình ảnh sọ người, xương trắng và tháp Chàm là của thi sĩ nào?",
    "a": "Hàn Mặc Tử",
    "b": "Chế Lan Viên",
    "c": "Bích Khê",
    "d": "Đinh Hùng",
    "ans": "B",
    "exp": "Chế Lan Viên xuất bản tập thơ Điêu tàn năm 17 tuổi, tạo nên một trường phái thơ kỳ dị và sâu sắc trong phong trào Thơ mới.",
    "tags": [
      "Văn học",
      "Thơ mới"
    ]
  },
  {
    "id": "q-mh500-b3-063",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Trong tiểu thuyết Số đỏ của Vũ Trọng Phụng, nhân vật Xuân Tóc Đỏ xuất thân từ nghề nghiệp gì trước khi bước chân vào giới thượng lưu Âu hóa?",
    "a": "Thư ký tòa sứ",
    "b": "Thợ cạo râu và kéo xe tay ở bến tàu",
    "c": "Trèo me, trèo sấu, nhặt bóng quần vợt và quảng cáo thuốc lậu",
    "d": "Chủ tiệm may âu phục",
    "ans": "C",
    "exp": "Xuân Tóc Đỏ vốn là kẻ hạ lưu vô học sống bằng nghề trèo me trèo sấu, nhặt bóng sân quần và rao thuốc lậu trước khi gặp vận đỏ.",
    "tags": [
      "Văn học",
      "Văn học hiện thực"
    ]
  },
  {
    "id": "q-mh500-b3-064",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Nhân vật huấn trưởng Huấn Cao với tài viết chữ thư pháp tuyệt đẹp và khí phách hiên ngang xuất hiện trong truyện ngắn nào của Nguyễn Tuân?",
    "a": "Chém treo ngành",
    "b": "Bữa rượu máu",
    "c": "Một đám bất đắc chí",
    "d": "Chữ người tử tù",
    "ans": "D",
    "exp": "Huấn Cao là nhân vật trung tâm trong truyện ngắn Chữ người tử tù thuộc tập Vang bóng một thời của Nguyễn Tuân.",
    "tags": [
      "Văn học",
      "Văn học Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b3-065",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Bài thơ Tây Tiến của Quang Dũng được sáng tác năm 1948 tại địa danh nào khi tác giả đã chuyển sang đơn vị khác?",
    "a": "Phù Lưu Chanh",
    "b": "Sài Khao",
    "c": "Mường Lát",
    "d": "Mai Châu",
    "ans": "A",
    "exp": "Quang Dũng sáng tác bài thơ Nhớ Tây Tiến, sau đổi tên là Tây Tiến, tại làng Phù Lưu Chanh năm 1948.",
    "tags": [
      "Văn học",
      "Văn học cách mạng"
    ]
  },
  {
    "id": "q-mh500-b3-066",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Truyện ngắn Vợ nhặt của nhà văn Kim Lân lấy bối cảnh lịch sử bi thảm nào của dân tộc Việt Nam?",
    "a": "Trận lụt đồng bằng Bắc Bộ năm 1942",
    "b": "Nạn đói năm Ất Dậu 1945",
    "c": "Chiến dịch Việt Bắc thu đông 1947",
    "d": "Cuộc tổng tiến công mùa xuân 1968",
    "ans": "B",
    "exp": "Vợ nhặt khắc họa khát vọng sống và tình người của người nông dân nghèo giữa thảm cảnh nạn đói năm Ất Dậu 1945.",
    "tags": [
      "Văn học",
      "Văn học hiện đại"
    ]
  },
  {
    "id": "q-mh500-b3-067",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Trong tiểu thuyết Những người khốn khổ của Victor Hugo, nhân vật thanh tra cảnh sát nào suốt đời truy đuổi Jean Valjean như một biểu tượng của luật pháp cứng nhắc?",
    "a": "Marius Pontmercy",
    "b": "Thenardier",
    "c": "Javert",
    "d": "Fauchelevent",
    "ans": "C",
    "exp": "Thanh tra Javert đại diện cho sự chấp pháp máy móc, cuối cùng tự vẫn khi rơi vào mâu thuẫn giữa công lý lương tâm và luật lệ.",
    "tags": [
      "Văn học",
      "Văn học thế giới"
    ]
  },
  {
    "id": "q-mh500-b3-068",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Tác giả châu Á đầu tiên trong lịch sử giành giải Nobel Văn học vào năm 1913 với tập thơ Dâng Gitanjali là ai?",
    "a": "Kawabata Yasunari",
    "b": "Kenzaburo Oe",
    "c": "Lỗ Tấn",
    "d": "Rabindranath Tagore",
    "ans": "D",
    "exp": "Đại thi hào Ấn Độ Rabindranath Tagore nhận giải Nobel Văn học năm 1913, là người châu Á đầu tiên nhận vinh dự này.",
    "tags": [
      "Văn học",
      "Nobel Văn học"
    ]
  },
  {
    "id": "q-mh500-b3-069",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Tiểu thuyết kinh điển Trăm năm cô đơn của nhà văn Gabriel Garcia Marquez xoay quanh lịch sử nhiều thế hệ của dòng họ nào tại thị trấn hư cấu Macondo?",
    "a": "Dòng họ Buendia",
    "b": "Dòng họ Corleone",
    "c": "Dòng họ Karamazov",
    "d": "Dòng họ Rostov",
    "ans": "A",
    "exp": "Trăm năm cô đơn kể về 7 thế hệ gia đình Buendia gắn liền với sự hình thành và suy vong của thị trấn Macondo.",
    "tags": [
      "Văn học",
      "Văn học thế giới"
    ]
  },
  {
    "id": "q-mh500-b3-070",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Trong tiểu thuyết Tội ác và hình phạt của Fyodor Dostoevsky, nhân vật chính từng là sinh viên nghèo đã sát hại mụ cầm đồ có tên là gì?",
    "a": "Pierre Bezukhov",
    "b": "Rodion Raskolnikov",
    "c": "Lev Myshkin",
    "d": "Andrei Bolkonsky",
    "ans": "B",
    "exp": "Rodion Romanovich Raskolnikov bị giằng xé tâm lý dữ dội sau khi phạm tội giết người để thử nghiệm lý thuyết về con người phi thường.",
    "tags": [
      "Văn học",
      "Văn học Nga"
    ]
  },
  {
    "id": "q-mh500-b3-071",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Nguyên lý tảng băng trôi trong nghệ thuật viết văn với phần nổi kiệm lời và phần chìm giàu hàm súc được khởi xướng bởi nhà văn Mỹ nào?",
    "a": "Mark Twain",
    "b": "William Faulkner",
    "c": "Ernest Hemingway",
    "d": "John Steinbeck",
    "ans": "C",
    "exp": "Ernest Hemingway đề xuất nguyên lý tảng băng trôi một phần nổi bảy phần chìm và thể hiện xuất sắc trong Ông già và biển cả.",
    "tags": [
      "Văn học",
      "Văn học thế giới"
    ]
  },
  {
    "id": "q-mh500-b3-072",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Trong vở bi kịch Hamlet của William Shakespeare, câu độc thoại nội tâm nổi tiếng Tồn tại hay không tồn tại được nói bởi nhân vật nào?",
    "a": "Vua Claudius",
    "b": "Laertes",
    "c": "Lãnh chúa Polonius",
    "d": "Hoàng tử Hamlet",
    "ans": "D",
    "exp": "Câu nói To be or not to be mở đầu đoạn độc thoại triết lý sâu sắc của Hoàng tử Đan Mạch Hamlet ở hồi 3 cảnh 1.",
    "tags": [
      "Văn học",
      "Văn học thế giới"
    ]
  },
  {
    "id": "q-mh500-b3-073",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Từ Hán Việt nào sau đây có yếu tố gia mang nghĩa là người có chuyên môn, học vấn cao hoặc thuộc một trường phái tư tưởng?",
    "a": "Triết gia",
    "b": "Gia đình",
    "c": "Gia sản",
    "d": "Quốc gia",
    "ans": "A",
    "exp": "Yếu tố gia trong triết gia, sử gia, chuyên gia chỉ người tinh thông một lĩnh vực học thuật hoặc nghệ thuật.",
    "tags": [
      "Ngôn ngữ",
      "Từ Hán Việt"
    ]
  },
  {
    "id": "q-mh500-b3-074",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Thành ngữ Lá lành đùm lá rách sử dụng biện pháp tu từ chủ đạo nào để biểu đạt tinh thần tương thân tương ái?",
    "a": "Nói quá",
    "b": "Ẩn dụ",
    "c": "Chơi chữ",
    "d": "Liệt kê",
    "ans": "B",
    "exp": "Hình ảnh lá lành và lá rách là phép ẩn dụ chỉ người có cuộc sống đủ đầy may mắn và người gặp hoàn cảnh khó khăn hoạn nạn.",
    "tags": [
      "Ngôn ngữ",
      "Tu từ học"
    ]
  },
  {
    "id": "q-mh500-b3-075",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Trong câu thơ Áo chàm đưa buổi phân ly của Tố Hữu, từ Áo chàm để chỉ người dân Việt Bắc là biện pháp tu từ nào?",
    "a": "So sánh",
    "b": "Nhân hóa",
    "c": "Hoán dụ",
    "d": "Nói giảm nói tránh",
    "ans": "C",
    "exp": "Lấy dấu hiệu trang phục đặc trưng áo chàm để gọi tên con người Việt Bắc là phép hoán dụ lấy dấu hiệu của sự vật để gọi sự vật.",
    "tags": [
      "Ngôn ngữ",
      "Tu từ học"
    ]
  },
  {
    "id": "q-mh500-b3-076",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Điển tích Gót chân Achilles trong văn học phương Tây có nguồn gốc từ bộ sử thi cổ đại nào?",
    "a": "Sử thi Gilgamesh",
    "b": "Sử thi Beowulf",
    "c": "Sử thi Mahabharata",
    "d": "Thần thoại Hy Lạp và sử thi Iliad",
    "ans": "D",
    "exp": "Người hùng Achilles trong thần thoại Hy Lạp bất tử toàn thân trừ gót chân do mẹ chàng cầm vào đó khi nhúng xuống sông Styx.",
    "tags": [
      "Văn học",
      "Điển tích"
    ]
  },
  {
    "id": "q-mh500-b3-077",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Trong ngữ pháp tiếng Việt, thành phần câu đứng trước nòng cốt câu dùng để nêu bối cảnh không gian, thời gian, nguyên nhân hay mục đích gọi là gì?",
    "a": "Trạng ngữ",
    "b": "Khởi ngữ",
    "c": "Phụ chú ngữ",
    "d": "Vị ngữ phụ",
    "ans": "A",
    "exp": "Trạng ngữ là thành phần phụ của câu bổ sung thông tin về thời gian, nơi chốn, nguyên nhân, mục đích, phương tiện cho sự việc.",
    "tags": [
      "Ngôn ngữ",
      "Ngữ pháp"
    ]
  },
  {
    "id": "q-mh500-b3-078",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Nhà văn hiện thực Nam Cao tên thật là gì?",
    "a": "Nguyễn Sen",
    "b": "Trần Hữu Tri",
    "c": "Nguyễn Thứ Lễ",
    "d": "Bùi Hiển",
    "ans": "B",
    "exp": "Nhà văn Nam Cao tên khai sinh là Trần Hữu Tri, bút danh Nam Cao ghép từ tên huyện Nam Sang và tổng Cao Đà quê ông.",
    "tags": [
      "Văn học",
      "Văn học hiện thực"
    ]
  },
  {
    "id": "q-mh500-b3-079",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Tác phẩm Lục Vân Tiên của nhà thơ mù Nguyễn Đình Chiểu được viết theo thể thơ truyền thống nào của dân tộc?",
    "a": "Song thất lục bát",
    "b": "Thất ngôn bát cú Đường luật",
    "c": "Lục bát",
    "d": "Hát nói",
    "ans": "C",
    "exp": "Truyện Lục Vân Tiên là truyện thơ Nôm dài 2082 câu viết theo thể thơ lục bát mộc mạc, giàu tính truyền khẩu Nam Bộ.",
    "tags": [
      "Văn học",
      "Văn học trung đại"
    ]
  },
  {
    "id": "q-mh500-b3-080",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Trong từ Hán Việt, từ Khuyến học và Khuyến nông có yếu tố khuyến mang ý nghĩa chính xác là gì?",
    "a": "Bắt buộc thực hiện theo pháp luật",
    "b": "Kiểm tra và thanh lọc định kỳ",
    "c": "Cắt giảm chi phí đầu tư",
    "d": "Khuyên nhủ, khích lệ, động viên làm điều tốt có ích",
    "ans": "D",
    "exp": "Yếu tố khuyến trong tiếng Hán Việt có nghĩa là khuyên bảo, cổ vũ, khích lệ phát triển.",
    "tags": [
      "Ngôn ngữ",
      "Từ Hán Việt"
    ]
  },
  {
    "id": "q-mh500-b3-081",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Thành ngữ Nam thực như hổ, nữ thực như miêu có nghĩa tương đương với cách diễn đạt thuần Việt nào?",
    "a": "Con trai ăn khỏe như hổ, con gái ăn nhỏ nhẹ từ tốn như mèo",
    "b": "Đàn ông nông nổi giếng khơi, đàn bà sâu sắc như cơi đựng trầu",
    "c": "Trai thời loạn, gái thời bình",
    "d": "Nam vô tửu như kỳ vô phong",
    "ans": "A",
    "exp": "Thực là ăn, hổ là cọp, miêu là mèo, câu thành ngữ Hán Việt này đối lập nết ăn mạnh mẽ của nam giới và sự nhỏ nhẹ của nữ giới.",
    "tags": [
      "Ngôn ngữ",
      "Thành ngữ"
    ]
  },
  {
    "id": "q-mh500-b3-082",
    "cat": "cat-lit",
    "diff": "MEDIUM",
    "q": "Nhà văn Pháp nào là tác giả bộ tiểu thuyết đồ sộ Tấn trò đời La Comedie humaine gồm gần một trăm tác phẩm khắc họa xã hội Pháp thế kỷ XIX?",
    "a": "Stendhal",
    "b": "Honore de Balzac",
    "c": "Gustave Flaubert",
    "d": "Emile Zola",
    "ans": "B",
    "exp": "Honore de Balzac là bậc thầy chủ nghĩa hiện thực phê phán Pháp với công trình văn chương vĩ đại Tấn trò đời.",
    "tags": [
      "Văn học",
      "Văn học Pháp"
    ]
  },
  {
    "id": "q-mh500-b3-083",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Tập thơ chữ Nôm gồm 254 bài thơ viết theo thể Đường luật hoặc Đường luật xen lục ngôn của Nguyễn Trãi, được coi là đỉnh cao mở đầu thơ Nôm bác học Việt Nam có tên là gì?",
    "a": "Ức Trai thi tập",
    "b": "Bạch Vân quốc ngữ thi tập",
    "c": "Quốc âm thi tập",
    "d": "Hồng Đức quốc âm thi tập",
    "ans": "C",
    "exp": "Quốc âm thi tập của Nguyễn Trãi là tập thơ Nôm cổ nhất còn lưu lại với 254 bài chia làm bốn môn Vô đề, Thời lệnh, Hoa mộc, Cầm thú.",
    "tags": [
      "Văn học",
      "Văn học trung đại"
    ]
  },
  {
    "id": "q-mh500-b3-084",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Bài Văn tế nghĩa sĩ Cần Giuộc của Nguyễn Đình Chiểu được viết theo thể văn gì và theo yêu cầu của vị quan nào?",
    "a": "Thể thơ thất ngôn trường thiên theo yêu cầu của Trương Định",
    "b": "Thể cáo cổ văn theo chiếu chỉ của vua Tự Đức",
    "c": "Thể lục bát biến thể theo yêu cầu của Phan Thanh Giản",
    "d": "Thể văn biền ngẫu phú Đường luật theo yêu cầu của Tuần phủ Gia Định Đỗ Quang",
    "ans": "D",
    "exp": "Năm 1861, theo lời nhờ của Tuần phủ Gia Định Đỗ Quang, Nguyễn Đình Chiểu viết bài văn tế theo thể phú Đường luật để truy điệu nghĩa quân hy sinh.",
    "tags": [
      "Văn học",
      "Văn học trung đại"
    ]
  },
  {
    "id": "q-mh500-b3-085",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Trong lịch sử văn học trung đại Việt Nam, hội thơ Tao đàn nhị thập bát tú gồm 28 vị đại thần tài danh do vị hoàng đế nào sáng lập và làm Tao đàn nguyên súy?",
    "a": "Lê Thánh Tông",
    "b": "Lê Thái Tổ",
    "c": "Trần Nhân Tông",
    "d": "Minh Mạng",
    "ans": "A",
    "exp": "Vua Lê Thánh Tông lập hội Tao đàn năm 1495 gồm 28 nhà thơ cung đình, tự xưng là Tao đàn nguyên súy.",
    "tags": [
      "Văn học",
      "Văn học trung đại"
    ]
  },
  {
    "id": "q-mh500-b3-086",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Cấu trúc một bài Hát nói chính thức đủ khổ trong nghệ thuật Ca trù của Nguyễn Công Trứ hay Cao Bá Quát thường có bao nhiêu câu và chia làm mấy khổ?",
    "a": "8 câu chia làm 4 phần đề thực luận kết",
    "b": "11 câu chia làm 3 khổ gồm 4 câu đầu, 4 câu giữa và 3 câu xếp",
    "c": "14 câu chia làm 2 khổ thất ngôn",
    "d": "16 câu lục bát xen song thất",
    "ans": "B",
    "exp": "Một bài hát nói đủ khổ chuẩn mực gồm 11 câu chia thành 3 khổ: khổ đầu 4 câu, khổ giữa 4 câu và khổ xếp 3 câu.",
    "tags": [
      "Văn học",
      "Thể loại văn học"
    ]
  },
  {
    "id": "q-mh500-b3-087",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Khúc ngâm Cung oán ngâm khúc viết bằng chữ Nôm theo thể song thất lục bát diễn tả nỗi ai oán của người cung nữ bị thất sủng là kiệt tác của tác giả nào?",
    "a": "Nguyễn Huy Tự",
    "b": "Phạm Thái",
    "c": "Nguyễn Gia Thiều",
    "d": "Lê Ngọc Hân",
    "ans": "C",
    "exp": "Cung oán ngâm khúc gồm 356 câu thơ song thất lục bát là tác phẩm xuất sắc của Ôn Như Hầu Nguyễn Gia Thiều.",
    "tags": [
      "Văn học",
      "Văn học trung đại"
    ]
  },
  {
    "id": "q-mh500-b3-088",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Cuộc tranh luận triết học và mỹ học lớn nhất trên văn đàn Việt Nam giai đoạn 1935 đến 1939 về chủ đề Nghệ thuật vị nghệ thuật hay Nghệ thuật vị nhân sinh diễn ra giữa hai đại diện chính nào?",
    "a": "Phan Khôi và Phạm Quỳnh",
    "b": "Trương Tửu và Xuân Diệu",
    "c": "Nhất Linh và Vũ Trọng Phụng",
    "d": "Hoài Thanh và Hải Triều",
    "ans": "D",
    "exp": "Cuộc bút chiến lịch sử diễn ra giữa phái Nghệ thuật vị nghệ thuật do Hoài Thanh đại diện và phái Nghệ thuật vị nhân sinh do Hải Triều đứng đầu.",
    "tags": [
      "Văn học",
      "Lý luận văn học"
    ]
  },
  {
    "id": "q-mh500-b3-089",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Nhóm văn học Xuân Thu nhã tập ra đời năm 1942 theo đuổi khuynh hướng thơ thuần túy, tượng trưng và siêu hình gồm những gương mặt tiêu biểu nào?",
    "a": "Đoàn Phú Tứ, Phạm Văn Hạnh, Nguyễn Xuân Sanh",
    "b": "Thế Lữ, Lưu Trọng Lư, Huy Thông",
    "c": "Tố Hữu, Sóng Hồng, Xuân Thủy",
    "d": "Nam Cao, Tô Hoài, Nguyên Hồng",
    "ans": "A",
    "exp": "Xuân Thu nhã tập quy tụ Đoàn Phú Tứ, Phạm Văn Hạnh, Nguyễn Xuân Sanh, Nguyễn Lương Ngọc với quan niệm thơ hàm súc huyền diệu.",
    "tags": [
      "Văn học",
      "Thơ mới"
    ]
  },
  {
    "id": "q-mh500-b3-090",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Tác phẩm phóng sự điều tra nổi tiếng Tôi kéo xe xuất bản năm 1935 phơi bày nỗi thống khổ của những người phu xe Hà Nội là của nhà văn nào?",
    "a": "Ngô Tất Tố",
    "b": "Tam Lang Vũ Đình Chí",
    "c": "Trọng Lang",
    "d": "Nguyên Hồng",
    "ans": "B",
    "exp": "Nhà văn Tam Lang Vũ Đình Chí đã trực tiếp đóng giả làm phu xe để viết thiên phóng sự mở đầu cho thể loại phóng sự hiện thực Việt Nam.",
    "tags": [
      "Văn học",
      "Văn học hiện thực"
    ]
  },
  {
    "id": "q-mh500-b3-091",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Đề cương về văn hóa Việt Nam năm 1943 do Tổng Bí thư Trường Chinh soạn thảo đã xác lập ba nguyên tắc vận động văn hóa lớn là gì?",
    "a": "Tự do, Bình đẳng, Bác ái",
    "b": "Hiện đại hóa, Công nghiệp hóa, Quốc tế hóa",
    "c": "Dân tộc hóa, Đại chúng hóa, Khoa học hóa",
    "d": "Truyền thống, Nhân văn, Khai phóng",
    "ans": "C",
    "exp": "Đề cương văn hóa 1943 nêu rõ ba nguyên tắc Dân tộc hóa, Đại chúng hóa và Khoa học hóa làm kim chỉ nam cho văn nghệ cách mạng.",
    "tags": [
      "Văn học",
      "Văn học cách mạng"
    ]
  },
  {
    "id": "q-mh500-b3-092",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Truyện ngắn Đôi mắt của Nam Cao viết năm 1948 xây dựng sự đối lập về cái nhìn đối với người nông dân và cuộc kháng chiến giữa hai nhân vật nhà văn nào?",
    "a": "Hộ và Thứ",
    "b": "Lão Hạc và ông Giáo",
    "c": "Điền và Giáo Thứ",
    "d": "Độ và Hoàng",
    "ans": "D",
    "exp": "Trong truyện ngắn Đôi mắt, nhân vật Độ hòa mình vào quần chúng kháng chiến trong khi văn sĩ Hoàng vẫn giữ cái nhìn khinh bạc, đứng ngoài cuộc.",
    "tags": [
      "Văn học",
      "Văn học cách mạng"
    ]
  },
  {
    "id": "q-mh500-b3-093",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Trong tiểu thuyết Nỗi buồn chiến tranh của Bảo Ninh, nhân vật chính Kiên sau khi bước ra khỏi cuộc chiến đã làm công việc gì trước khi dấn thân vào con đường sáng tác?",
    "a": "Lính trong đội quy tập hài cốt liệt sĩ",
    "b": "Giảng viên đại học lịch sử",
    "c": "Kỹ sư xây dựng cầu đường vùng biên giới",
    "d": "Bác sĩ quân y tại bệnh viện dã chiến",
    "ans": "A",
    "exp": "Sau ngày hòa bình năm 1975, Kiên tham gia đội thu gom hài cốt tử sĩ tại rừng Gọi Hồn trước khi trở về Hà Nội viết tiểu thuyết.",
    "tags": [
      "Văn học",
      "Văn học đương đại"
    ]
  },
  {
    "id": "q-mh500-b3-094",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Kiệt tác tiểu thuyết hiện đại Ulysses của nhà văn Ireland James Joyce lấy cảm hứng cấu trúc từ sử thi Odyssey và diễn ra trọn vẹn trong vòng một ngày duy nhất nào?",
    "a": "Ngày 25 tháng 12 năm 1914",
    "b": "Ngày 16 tháng 6 năm 1904",
    "c": "Ngày 14 tháng 7 năm 1889",
    "d": "Ngày 1 tháng 1 năm 1900",
    "ans": "B",
    "exp": "Toàn bộ tiểu thuyết Ulysses theo dòng ý thức của Leopold Bloom tại Dublin diễn ra trong một ngày 16 tháng 6 năm 1904, nay được kỷ niệm là Bloomsday.",
    "tags": [
      "Văn học",
      "Văn học thế giới"
    ]
  },
  {
    "id": "q-mh500-b3-095",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Trong truyện vừa Hóa thân Die Verwandlung của Franz Kafka, nhân vật Gregor Samsa thức dậy sau một đêm mộng mị và thấy mình biến thành loài vật gì?",
    "a": "Một con quạ đen khổng lồ",
    "b": "Một con chó săn mù lòa",
    "c": "Một con côn trùng bọ cánh cứng khổng lồ",
    "d": "Một bức tượng đá cẩm thạch",
    "ans": "C",
    "exp": "Gregor Samsa thức giấc thấy mình biến thành một con bọ khổng lồ, biểu tượng cho sự tha hóa và cô đơn của con người trong xã hội hiện đại.",
    "tags": [
      "Văn học",
      "Văn học thế giới"
    ]
  },
  {
    "id": "q-mh500-b3-096",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Nhà văn kiêm triết gia người Pháp nào đã thẳng thắn từ chối nhận giải Nobel Văn học năm 1964 vì không muốn bị thể chế hóa bởi bất kỳ tổ chức nào?",
    "a": "Albert Camus",
    "b": "Francois Mauriac",
    "c": "Andre Gide",
    "d": "Jean Paul Sartre",
    "ans": "D",
    "exp": "Jean Paul Sartre là tác giả duy nhất tự nguyện từ chối giải Nobel Văn học năm 1964 với quan điểm nhà văn không nên biến mình thành một định chế.",
    "tags": [
      "Văn học",
      "Nobel Văn học"
    ]
  },
  {
    "id": "q-mh500-b3-097",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Nữ văn sĩ người Ba Lan đầu tiên giành giải Nobel Văn học năm 1996, nổi tiếng với giọng thơ trí tuệ và giàu chất triết học qua các bài thơ như Ba từ kỳ lạ nhất là ai?",
    "a": "Wislawa Szymborska",
    "b": "Olga Tokarczuk",
    "c": "Svetlana Alexievich",
    "d": "Herta Muller",
    "ans": "A",
    "exp": "Nhà thơ Ba Lan Wislawa Szymborska được Viện Hàn lâm Thụy Điển trao giải Nobel Văn học năm 1996 và được mệnh danh là Mozart của thi ca.",
    "tags": [
      "Văn học",
      "Nobel Văn học"
    ]
  },
  {
    "id": "q-mh500-b3-098",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Trong tiểu thuyết Nghệ nhân và Margarita của văn hào Nga Mikhail Bulgakov, nhân vật quỷ Satan xuất hiện tại thành phố Moscow thế kỷ XX dưới danh xưng vị giáo sư ngoại quốc tên là gì?",
    "a": "Mephistopheles",
    "b": "Woland",
    "c": "Azazello",
    "d": "Koroviev",
    "ans": "B",
    "exp": "Chúa quỷ Satan hóa thân thành giáo sư ma thuật đen Woland cùng đoàn tùy tùng kỳ quái đến vạch trần sự giả dối ở Moscow.",
    "tags": [
      "Văn học",
      "Văn học Nga"
    ]
  },
  {
    "id": "q-mh500-b3-099",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Trong tác phẩm Thần khúc Divina Commedia của Dante Alighieri, nhà thơ cổ đại La Mã nào đã dẫn đường cho Dante đi qua hai cõi Địa ngục và Tĩnh ngục?",
    "a": "Ovid",
    "b": "Horace",
    "c": "Virgil",
    "d": "Homer",
    "ans": "C",
    "exp": "Nhà thơ La Mã Virgil là biểu tượng của lý trí nhân loại đã dẫn đường cho Dante qua Địa ngục và Tĩnh ngục trước khi Beatrice đón chàng lên Thiên đàng.",
    "tags": [
      "Văn học",
      "Văn học thế giới"
    ]
  },
  {
    "id": "q-mh500-b3-100",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Điển tích Tái ông thất mã có nguồn gốc từ sách Hoài Nam Tử thời Tây Hán mang hàm ý triết lý sâu sắc nào?",
    "a": "Người có tài năng xuất chúng sớm muộn cũng được trọng dụng",
    "b": "Lòng hiếu thảo của con cái có thể cảm động cả đất trời",
    "c": "Sự trung thành tuyệt đối của bề tôi đối với bậc quân vương",
    "d": "Họa và phúc ở đời luôn chuyển hóa khôn lường, trong cái rủi có thể ẩn chứa cái may",
    "ans": "D",
    "exp": "Câu chuyện ông lão biên tái mất ngựa rồi ngựa về kéo theo ngựa quý, con trai ngã gãy chân nhờ đó thoát chết trận thể hiện sự chuyển hóa phúc họa.",
    "tags": [
      "Ngôn ngữ",
      "Điển tích"
    ]
  },
  {
    "id": "q-mh500-b3-101",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Điển cố Giấc mộng Nam Kha hay Giấc mộng kê vàng trong văn học cổ phương Đông thường được dùng để chỉ điều gì?",
    "a": "Cuộc đời công danh phú quý ngắn ngủi, hư ảo như một giấc chiêm bao",
    "b": "Khát vọng thống nhất giang sơn của các bậc anh hùng",
    "c": "Tình cảm tri âm tri kỷ gắn bó suốt đời",
    "d": "Nỗi nhớ quê hương da diết nơi đất khách quê người",
    "ans": "A",
    "exp": "Điển tích Thuần Vu Phần nằm mộng dưới gốc cây hòe làm phò mã nước Đại Hòe An hưởng vinh hoa, tỉnh dậy chỉ là tổ kiến, ví sự phù du của danh lợi.",
    "tags": [
      "Ngôn ngữ",
      "Điển tích"
    ]
  },
  {
    "id": "q-mh500-b3-102",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Trong Truyện Kiều, câu thơ Sầu đong càng lắc càng đầy, Ba thu dọn lại một ngày dài ghê sử dụng điển cố Ba thu có nguồn gốc từ kinh điển nào?",
    "a": "Kinh Dịch",
    "b": "Kinh Thi",
    "c": "Luận Ngữ",
    "d": "Đạo Đức Kinh",
    "ans": "B",
    "exp": "Câu Nhất nhật bất kiến như tam thu hề trong thiên Vương phong bài Thái cát của Kinh Thi nói một ngày không gặp nhau dài như ba mùa thu.",
    "tags": [
      "Văn học",
      "Điển tích"
    ]
  },
  {
    "id": "q-mh500-b3-103",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Trong từ Hán Việt, hai từ đồng âm Phong kiến và Phong bì có yếu tố phong mang nghĩa gốc lần lượt là gì?",
    "a": "Cả hai đều có nghĩa là gió thổi",
    "b": "Phong trong phong kiến là đỉnh núi cao, còn phong trong phong bì là dồi dào",
    "c": "Phong trong phong kiến là ban cấp đất đai tước vị, còn phong trong phong bì là đóng kín niêm lại",
    "d": "Cả hai đều có nghĩa là dáng vẻ bề ngoài",
    "ans": "C",
    "exp": "Chữ Phong trong phong kiến nghĩa là ban đất lập chư hầu, còn chữ Phong trong phong bì, niêm phong nghĩa là dán kín lại.",
    "tags": [
      "Ngôn ngữ",
      "Từ Hán Việt"
    ]
  },
  {
    "id": "q-mh500-b3-104",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Biện pháp tu từ ẩn dụ chuyển đổi cảm giác được thể hiện rõ nét nhất trong câu thơ nào dưới đây?",
    "a": "Thuyền về có nhớ bến chăng, Bến thì một dạ khăng khăng đợi thuyền",
    "b": "Mặt trời của bắp thì nằm trên đồi, Mặt trời của mẹ em nằm trên lưng",
    "c": "Người ngắm trăng soi ngoài cửa sổ, Trăng nhòm khe cửa ngắm nhà thơ",
    "d": "Ơi con chim chiền chiện, Hót chi mà vang trời, Từng giọt long lanh rơi, Tôi đưa tay tôi hứng",
    "ans": "D",
    "exp": "Âm thanh tiếng chim hót vốn cảm nhận bằng thính giác được chuyển thành giọt long lanh rơi nhìn thấy bằng thị giác và hứng bằng xúc giác.",
    "tags": [
      "Ngôn ngữ",
      "Tu từ học"
    ]
  },
  {
    "id": "q-mh500-b3-105",
    "cat": "cat-lit",
    "diff": "HARD",
    "q": "Trong luật thơ Đường luật thất ngôn bát cú, quy định về niêm và đối bắt buộc hai cặp câu nào trong bài phải đối nhau hoàn chỉnh cả về thanh điệu lẫn từ loại?",
    "a": "Hai câu thực là câu 3, 4 và hai câu luận là câu 5, 6",
    "b": "Hai câu đề và hai câu kết",
    "c": "Câu 1 đối với câu 8 và câu 2 đối với câu 7",
    "d": "Chỉ duy nhất hai câu luận câu 5 và câu 6",
    "ans": "A",
    "exp": "Trong thơ thất ngôn bát cú Đường luật, phép đối bắt buộc nghiêm ngặt ở cặp câu thực câu 3, 4 và cặp câu luận câu 5, 6.",
    "tags": [
      "Văn học",
      "Thi pháp học"
    ]
  },
  {
    "id": "q-mh500-b4-001",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Quốc gia nào đã đăng cai và đồng thời giành chức vô địch tại kỳ World Cup bóng đá nam đầu tiên vào năm 1930?",
    "a": "Uruguay",
    "b": "Brasil",
    "c": "Ý",
    "d": "Argentina",
    "ans": "A",
    "exp": "Năm 1930, Uruguay là chủ nhà của kỳ World Cup đầu tiên và lên ngôi vô địch sau khi đánh bại Argentina 4-2 trong trận chung kết.",
    "tags": [
      "Thể thao",
      "World Cup"
    ]
  },
  {
    "id": "q-mh500-b4-002",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Chiếc cúp trao cho đội vô địch bóng đá thế giới từ năm 1930 đến năm 1970 mang tên vị chủ tịch FIFA nào?",
    "a": "João Havelange",
    "b": "Jules Rimet",
    "c": "Stanley Rous",
    "d": "Robert Guérin",
    "ans": "B",
    "exp": "Cúp Nữ thần Vàng được đổi tên thành Cúp Jules Rimet vào năm 1946 để vinh danh cựu chủ tịch FIFA người Pháp đã sáng lập giải đấu.",
    "tags": [
      "Thể thao",
      "World Cup"
    ]
  },
  {
    "id": "q-mh500-b4-003",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Cầu thủ nào giữ kỷ lục ghi nhiều bàn thắng nhất trong một vòng chung kết World Cup duy nhất với 13 pha lập công vào năm 1958?",
    "a": "Gerd Müller",
    "b": "Sandor Kocsis",
    "c": "Just Fontaine",
    "d": "Pelé",
    "ans": "C",
    "exp": "Tiền đạo người Pháp Just Fontaine đã ghi 13 bàn thắng chỉ sau 6 trận tại World Cup 1958 ở Thụy Điển, kỷ lục đến nay vẫn chưa bị phá.",
    "tags": [
      "Thể thao",
      "World Cup"
    ]
  },
  {
    "id": "q-mh500-b4-004",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Đội tuyển quốc gia nào tạo nên câu chuyện cổ tích khi vô địch EURO 1992 dù chỉ được gọi bổ sung vào phút chót thay thế Nam Tư?",
    "a": "Hy Lạp",
    "b": "Tiệp Khắc",
    "c": "Thụy Điển",
    "d": "Đan Mạch",
    "ans": "D",
    "exp": "Đan Mạch chỉ có 10 ngày tập trung thay thế Nam Tư bị cấm vận nhưng đã xuất sắc đánh bại Đức 2-0 ở chung kết EURO 1992.",
    "tags": [
      "Thể thao",
      "Euro"
    ]
  },
  {
    "id": "q-mh500-b4-005",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Trong lịch sử EURO, cầu thủ nào đã thực hiện thành công cú sút phạt đền kiểu bấm bóng vào giữa khung thành mang tên mình ở trận chung kết năm 1976?",
    "a": "Antonín Panenka",
    "b": "Marco van Basten",
    "c": "Michel Platini",
    "d": "Horst Hrubesch",
    "ans": "A",
    "exp": "Antonín Panenka của đội tuyển Tiệp Khắc đã sút quả luân lưu quyết định kiểu bấm bóng nhẹ vào giữa cầu môn đánh bại thủ thành Sepp Maier của Tây Đức năm 1976.",
    "tags": [
      "Thể thao",
      "Euro"
    ]
  },
  {
    "id": "q-mh500-b4-006",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Hai đội tuyển giàu thành tích nhất trong lịch sử giải bóng đá vô địch Nam Mỹ Copa America tính đến năm 2024 là những quốc gia nào?",
    "a": "Brasil và Argentina",
    "b": "Argentina và Uruguay",
    "c": "Brasil và Uruguay",
    "d": "Argentina và Chile",
    "ans": "B",
    "exp": "Argentina có 16 lần vô địch và Uruguay có 15 lần vô địch, là hai đội tuyển giàu thành tích nhất lịch sử Copa America.",
    "tags": [
      "Thể thao",
      "Copa America"
    ]
  },
  {
    "id": "q-mh500-b4-007",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Câu lạc bộ nào đã giành chức vô địch Cúp C1 châu Âu trong 5 mùa giải đầu tiên liên tiếp từ năm 1956 đến năm 1960?",
    "a": "AC Milan",
    "b": "Benfica",
    "c": "Real Madrid",
    "d": "Ajax Amsterdam",
    "ans": "C",
    "exp": "Real Madrid với thế hệ của Alfredo Di Stéfano và Ferenc Puskás đã thống trị Cúp C1 châu Âu 5 mùa đầu tiên từ 1955-1956 đến 1959-1960.",
    "tags": [
      "Thể thao",
      "Champions League"
    ]
  },
  {
    "id": "q-mh500-b4-008",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Câu lạc bộ duy nhất của khu vực Đông Âu thuộc khối xã hội chủ nghĩa cũ từng vô địch Cúp C1 châu Âu vào năm 1986 sau khi thắng Barcelona ở loạt luân lưu là đội nào?",
    "a": "Dinamo Kyiv",
    "b": "Ferencváros",
    "c": "Spartak Moscow",
    "d": "Steaua Bucuresti",
    "ans": "D",
    "exp": "Steaua Bucuresti của Romania đã đánh bại Barcelona tại Sevilla năm 1986 nhờ màn trình diễn cản phá 4 quả luân lưu lịch sử của thủ môn Helmuth Duckadam.",
    "tags": [
      "Thể thao",
      "Champions League"
    ]
  },
  {
    "id": "q-mh500-b4-009",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Thế vận hội Olympic cổ đại tại Hy Lạp được tổ chức tại thung lũng Olympia nhằm tôn vinh vị thần tối cao nào?",
    "a": "Zeus",
    "b": "Poseidon",
    "c": "Apollo",
    "d": "Heracles",
    "ans": "A",
    "exp": "Olympic cổ đại bắt đầu từ năm 776 TCN tại Olympia là lễ hội thể thao và tôn giáo nhằm tôn vinh thần tối cao Zeus.",
    "tags": [
      "Thể thao",
      "Olympic"
    ]
  },
  {
    "id": "q-mh500-b4-010",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Ai là người sáng lập Ủy ban Olympic Quốc tế và được mệnh danh là cha đẻ của phong trào Thế vận hội Olympic hiện đại?",
    "a": "Demetrios Vikelas",
    "b": "Pierre de Coubertin",
    "c": "Juan Antonio Samaranch",
    "d": "Henri de Baillet-Latour",
    "ans": "B",
    "exp": "Nam tước người Pháp Pierre de Coubertin là người khởi xướng việc phục hưng Thế vận hội và thành lập IOC vào năm 1894.",
    "tags": [
      "Thể thao",
      "Olympic"
    ]
  },
  {
    "id": "q-mh500-b4-011",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Trên lá cờ Olympic, năm vòng tròn đan vào nhau có các màu theo thứ tự từ trái sang phải gồm những màu nào?",
    "a": "Đỏ, vàng, lục, lam, đen",
    "b": "Lam, đen, đỏ, vàng, lục",
    "c": "Lam, vàng, đen, lục, đỏ",
    "d": "Vàng, lam, đen, đỏ, lục",
    "ans": "C",
    "exp": "Năm vòng tròn Olympic xếp từ trái qua phải gồm hàng trên là lam, đen, đỏ và hàng dưới là vàng, lục; tính theo thứ tự trái sang phải là lam, vàng, đen, lục, đỏ.",
    "tags": [
      "Thể thao",
      "Olympic"
    ]
  },
  {
    "id": "q-mh500-b4-012",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Kình ngư người Mỹ Michael Phelps đã kết thúc sự nghiệp thi đấu với tổng cộng bao nhiêu tấm huy chương vàng Thế vận hội Olympic?",
    "a": "18 huy chương vàng",
    "b": "21 huy chương vàng",
    "c": "28 huy chương vàng",
    "d": "23 huy chương vàng",
    "ans": "D",
    "exp": "Michael Phelps là vận động viên giàu thành tích nhất lịch sử Olympic với tổng cộng 28 huy chương, trong đó có 23 huy chương vàng.",
    "tags": [
      "Thể thao",
      "Olympic",
      "Bơi lội"
    ]
  },
  {
    "id": "q-mh500-b4-013",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Vận động viên nào đã mang về tấm huy chương đầu tiên trong lịch sử cho đoàn thể thao Việt Nam tại một kỳ Thế vận hội Olympic?",
    "a": "Trần Hiếu Ngân",
    "b": "Hoàng Xuân Vinh",
    "c": "Hoàng Anh Tuấn",
    "d": "Trần Lê Quốc Toàn",
    "ans": "A",
    "exp": "Võ sĩ Taekwondo Trần Hiếu Ngân đã giành huy chương bạc hạng cân 57kg nữ tại Olympic Sydney 2000, mở hàng huy chương Olympic cho Việt Nam.",
    "tags": [
      "Thể thao",
      "Olympic",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b4-014",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Xạ thủ Hoàng Xuân Vinh giành huy chương vàng lịch sử cho thể thao Việt Nam tại Olympic Rio 2016 ở nội dung thi đấu nào?",
    "a": "50m súng ngắn bắn chậm nam",
    "b": "10m súng ngắn hơi nam",
    "c": "25m súng ngắn bắn nhanh nam",
    "d": "10m súng trường hơi nam",
    "ans": "B",
    "exp": "Tại Olympic Rio 2016, Hoàng Xuân Vinh đoạt HCV nội dung 10m súng ngắn hơi nam với 202,5 điểm và sau đó giành thêm HCB nội dung 50m súng ngắn bắn chậm.",
    "tags": [
      "Thể thao",
      "Olympic",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b4-015",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Tiền thân của Đại hội Thể thao Đông Nam Á SEA Games khi tổ chức lần đầu vào năm 1959 tại Bangkok có tên viết tắt là gì?",
    "a": "ASEAN Games",
    "b": "ASIAN Games",
    "c": "SEAP Games",
    "d": "FAR EAST Games",
    "ans": "C",
    "exp": "Từ năm 1959 đến 1975, đại hội mang tên SEAP Games tức Đại hội Thể thao Bán đảo Đông Nam Á, trước khi đổi thành SEA Games năm 1977.",
    "tags": [
      "Thể thao",
      "SEA Games"
    ]
  },
  {
    "id": "q-mh500-b4-016",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Việt Nam lần đầu tiên đăng cai tổ chức Đại hội Thể thao Đông Nam Á SEA Games vào năm nào?",
    "a": "Năm 1999",
    "b": "Năm 2001",
    "c": "Năm 2005",
    "d": "Năm 2003",
    "ans": "D",
    "exp": "SEA Games 22 năm 2003 là lần đầu tiên Việt Nam đăng cai đại hội khu vực, với linh vật Trâu Vàng và đoàn chủ nhà xếp nhất toàn đoàn.",
    "tags": [
      "Thể thao",
      "SEA Games",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b4-017",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Kỳ Đại hội Thể thao châu Á ASIAD đầu tiên trong lịch sử được tổ chức vào năm 1951 tại thành phố nào?",
    "a": "New Delhi",
    "b": "Manila",
    "c": "Tokyo",
    "d": "Bangkok",
    "ans": "A",
    "exp": "ASIAD lần thứ nhất diễn ra tại New Delhi, Ấn Độ từ ngày 4 đến 11 tháng 3 năm 1951 với sự tham dự của 11 quốc gia.",
    "tags": [
      "Thể thao",
      "ASIAD"
    ]
  },
  {
    "id": "q-mh500-b4-018",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Tại ASIAD 18 năm 2018 tổ chức ở Indonesia, vận động viên Bùi Thị Thu Thảo đã giành huy chương vàng lịch sử cho điền kinh Việt Nam ở nội dung nào?",
    "a": "Chạy 400m rào nữ",
    "b": "Nhảy xa nữ",
    "c": "Nhảy cao nữ",
    "d": "Chạy 100m nữ",
    "ans": "B",
    "exp": "Bùi Thị Thu Thảo đã xuất sắc đạt thành tích 6,55m ở nội dung nhảy xa nữ tại ASIAD 2018, mang về tấm HCV ASIAD đầu tiên trong lịch sử điền kinh Việt Nam.",
    "tags": [
      "Thể thao",
      "ASIAD",
      "Điền kinh"
    ]
  },
  {
    "id": "q-mh500-b4-019",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Trong hệ thống 4 giải quần vợt Grand Slam, giải đấu nào duy nhất thi đấu trên mặt sân đất nện?",
    "a": "Australian Open",
    "b": "Wimbledon",
    "c": "Roland Garros",
    "d": "US Open",
    "ans": "C",
    "exp": "Giải quần vợt Pháp Mở rộng Roland Garros tại Paris là giải Grand Slam duy nhất thi đấu trên mặt sân đất nện đỏ truyền thống.",
    "tags": [
      "Thể thao",
      "Quần vợt"
    ]
  },
  {
    "id": "q-mh500-b4-020",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Tay vợt nữ duy nhất trong lịch sử quần vợt thế giới từng giành được Golden Slam, tức vô địch cả 4 giải Grand Slam và huy chương vàng đơn Olympic trong cùng một năm dương lịch 1988, là ai?",
    "a": "Martina Navratilova",
    "b": "Serena Williams",
    "c": "Margaret Court",
    "d": "Steffi Graf",
    "ans": "D",
    "exp": "Huyền thoại người Đức Steffi Graf đã lập kỳ tích vô tiền khoáng hậu vào năm 1988 khi thâu tóm cả 4 danh hiệu Grand Slam và tấm HCV đơn nữ tại Olympic Seoul.",
    "tags": [
      "Thể thao",
      "Quần vợt"
    ]
  },
  {
    "id": "q-mh500-b4-021",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Tay vợt nam nào được mệnh danh là Ông vua sân đất nện với kỷ lục 14 lần vô địch đơn nam giải Roland Garros?",
    "a": "Rafael Nadal",
    "b": "Novak Djokovic",
    "c": "Roger Federer",
    "d": "Björn Borg",
    "ans": "A",
    "exp": "Rafael Nadal giữ kỷ lục vô địch một giải Grand Slam nhiều lần nhất lịch sử với 14 danh hiệu đơn nam tại Roland Garros từ năm 2005 đến 2022.",
    "tags": [
      "Thể thao",
      "Quần vợt"
    ]
  },
  {
    "id": "q-mh500-b4-022",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Trận đấu quần vợt dài nhất lịch sử kéo dài 11 giờ 5 phút tại vòng một Wimbledon 2010 diễn ra giữa John Isner và tay vợt người Pháp nào?",
    "a": "Jo-Wilfried Tsonga",
    "b": "Nicolas Mahut",
    "c": "Gael Monfils",
    "d": "Richard Gasquet",
    "ans": "B",
    "exp": "Trận đấu giữa John Isner và Nicolas Mahut tại Wimbledon 2010 kéo dài qua 3 ngày với tỷ số set 5 là 70-68 nghiêng về Isner.",
    "tags": [
      "Thể thao",
      "Quần vợt"
    ]
  },
  {
    "id": "q-mh500-b4-023",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Trong môn đua xe Công thức 1, hai tay đua nào đang cùng nắm giữ kỷ lục giành 7 chức vô địch thế giới cá nhân tính đến hết mùa giải 2024?",
    "a": "Ayrton Senna và Michael Schumacher",
    "b": "Lewis Hamilton và Max Verstappen",
    "c": "Michael Schumacher và Lewis Hamilton",
    "d": "Alain Prost và Sebastian Vettel",
    "ans": "C",
    "exp": "Huyền thoại người Đức Michael Schumacher và tay đua người Anh Lewis Hamilton đang chia sẻ kỷ lục 7 lần vô địch thế giới F1.",
    "tags": [
      "Thể thao",
      "Đua xe F1"
    ]
  },
  {
    "id": "q-mh500-b4-024",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Đội đua giàu thành tích nhất trong lịch sử Công thức 1 về số danh hiệu vô địch đội đua và cũng là đội duy nhất góp mặt ở mọi mùa giải kể từ năm 1950 là đội nào?",
    "a": "McLaren",
    "b": "Williams",
    "c": "Mercedes",
    "d": "Ferrari",
    "ans": "D",
    "exp": "Scuderia Ferrari là đội đua duy nhất tham dự tất cả các mùa giải F1 từ năm 1950 và giữ kỷ lục 16 lần vô địch thế giới hạng mục đội đua.",
    "tags": [
      "Thể thao",
      "Đua xe F1"
    ]
  },
  {
    "id": "q-mh500-b4-025",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Huyền thoại đua xe F1 người Brasil Ayrton Senna đã tử nạn vào ngày 1 tháng 5 năm 1994 khi đang dẫn đầu chặng đua tại đường đua nào?",
    "a": "Imola",
    "b": "Monza",
    "c": "Silverstone",
    "d": "Suzuka",
    "ans": "A",
    "exp": "Ayrton Senna gặp tai nạn thảm khốc ở góc cua Tamburello tại đường đua Autodromo Internazionale Enzo e Dino Ferrari ở Imola, San Marino GP năm 1994.",
    "tags": [
      "Thể thao",
      "Đua xe F1"
    ]
  },
  {
    "id": "q-mh500-b4-026",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Trong giải bóng rổ nhà nghề Mỹ NBA, hai câu lạc bộ giàu truyền thống nhất về số lần vô địch tính đến năm 2024 là hai đội bóng nào?",
    "a": "Chicago Bulls và Los Angeles Lakers",
    "b": "Boston Celtics và Los Angeles Lakers",
    "c": "Golden State Warriors và Boston Celtics",
    "d": "San Antonio Spurs và Chicago Bulls",
    "ans": "B",
    "exp": "Boston Celtics với 18 danh hiệu và Los Angeles Lakers với 17 danh hiệu là hai đội bóng giàu thành tích nhất lịch sử NBA.",
    "tags": [
      "Thể thao",
      "Bóng rổ NBA"
    ]
  },
  {
    "id": "q-mh500-b4-027",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Cầu thủ bóng rổ nào đang nắm giữ kỷ lục ghi được 100 điểm trong một trận đấu duy nhất tại giải NBA vào năm 1962?",
    "a": "Kareem Abdul-Jabbar",
    "b": "Michael Jordan",
    "c": "Wilt Chamberlain",
    "d": "Kobe Bryant",
    "ans": "C",
    "exp": "Ngày 2 tháng 3 năm 1962, Wilt Chamberlain ghi 100 điểm cho Philadelphia Warriors trong chiến thắng 169-147 trước New York Knicks.",
    "tags": [
      "Thể thao",
      "Bóng rổ NBA"
    ]
  },
  {
    "id": "q-mh500-b4-028",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Vào tháng 2 năm 2023, cầu thủ nào đã vượt qua Kareem Abdul-Jabbar để trở thành người ghi nhiều điểm nhất mọi thời đại trong lịch sử Regular Season của NBA?",
    "a": "Stephen Curry",
    "b": "Kevin Durant",
    "c": "Kobe Bryant",
    "d": "LeBron James",
    "ans": "D",
    "exp": "LeBron James đã phá kỷ lục 38.387 điểm tồn tại suốt 39 năm của Kareem Abdul-Jabbar vào ngày 7 tháng 2 năm 2023.",
    "tags": [
      "Thể thao",
      "Bóng rổ NBA"
    ]
  },
  {
    "id": "q-mh500-b4-029",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Kỳ thủ nào là nhà vô địch cờ vua thế giới chính thức đầu tiên trong lịch sử sau khi đánh bại Johannes Zukertort vào năm 1886?",
    "a": "Wilhelm Steinitz",
    "b": "Emanuel Lasker",
    "c": "José Raúl Capablanca",
    "d": "Alexander Alekhine",
    "ans": "A",
    "exp": "Wilhelm Steinitz trở thành Vua cờ chính thức đầu tiên năm 1886 và đặt nền móng cho trường phái cờ vua vị trí hiện đại.",
    "tags": [
      "Thể thao",
      "Cờ vua"
    ]
  },
  {
    "id": "q-mh500-b4-030",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Năm 1997, siêu máy tính nào của tập đoàn IBM đã trở thành chương trình máy tính đầu tiên đánh bại đương kim Vua cờ Garry Kasparov trong một trận đấu tiêu chuẩn?",
    "a": "AlphaZero",
    "b": "Deep Blue",
    "c": "Stockfish",
    "d": "Watson",
    "ans": "B",
    "exp": "Siêu máy tính Deep Blue của IBM đã đánh bại Garry Kasparov với tỷ số 3,5 - 2,5 vào tháng 5 năm 1997 tại New York.",
    "tags": [
      "Thể thao",
      "Cờ vua"
    ]
  },
  {
    "id": "q-mh500-b4-031",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Đại kiện tướng cờ vua nào của Việt Nam đã xuất sắc giành chức vô địch cờ chớp thế giới năm 2013 tại Khanty-Mansiysk, Nga?",
    "a": "Đào Thiên Hải",
    "b": "Nguyễn Ngọc Trường Sơn",
    "c": "Lê Quang Liêm",
    "d": "Từ Hoàng Thông",
    "ans": "C",
    "exp": "Lê Quang Liêm đã đạt 20,5 điểm sau 30 ván đấu để lên ngôi vô địch cờ chớp thế giới năm 2013, danh hiệu thế giới đỉnh cao nhất của cờ vua Việt Nam.",
    "tags": [
      "Thể thao",
      "Cờ vua",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b4-032",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Trên bàn cờ vua tiêu chuẩn, hệ thống xếp hạng sức cờ quốc tế Elo được đặt theo tên của vị giáo sư vật lý người Mỹ gốc Hungary nào?",
    "a": "Richard Réti",
    "b": "László Polgár",
    "c": "Géza Maróczy",
    "d": "Arpad Elo",
    "ans": "D",
    "exp": "Hệ số Elo do giáo sư vật lý Arpad Elo sáng tạo và được Liên đoàn Cờ vua Thế giới FIDE chính thức áp dụng từ năm 1970.",
    "tags": [
      "Thể thao",
      "Cờ vua"
    ]
  },
  {
    "id": "q-mh500-b4-033",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Tia chớp người Jamaica Usain Bolt đang nắm giữ kỷ lục thế giới chạy 100m nam được xác lập tại giải vô địch thế giới Berlin năm 2009 với thành tích bao nhiêu giây?",
    "a": "9,58 giây",
    "b": "9,63 giây",
    "c": "9,69 giây",
    "d": "9,72 giây",
    "ans": "A",
    "exp": "Ngày 16 tháng 8 năm 2009 tại Berlin, Usain Bolt hoàn thành cự ly 100m với thời gian kỷ lục thế giới 9,58 giây.",
    "tags": [
      "Thể thao",
      "Điền kinh"
    ]
  },
  {
    "id": "q-mh500-b4-034",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Theo quy định chuẩn của Liên đoàn Điền kinh Thế giới, cự ly chính xác của một cuộc thi chạy Marathon tiêu chuẩn là bao nhiêu?",
    "a": "40,000 km",
    "b": "42,195 km",
    "c": "41,500 km",
    "d": "42,500 km",
    "ans": "B",
    "exp": "Cự ly Marathon chuẩn 42,195 km được ấn định từ Thế vận hội London 1908, tính từ lâu đài Windsor đến khu vực khán đài hoàng gia tại sân vận động White City.",
    "tags": [
      "Thể thao",
      "Điền kinh"
    ]
  },
  {
    "id": "q-mh500-b4-035",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Vận động viên điền kinh người Mỹ nào đã làm cuộc cách mạng ở nội dung nhảy cao với kỹ thuật nhảy lưng qua xà tại Thế vận hội Mexico City năm 1968?",
    "a": "Carl Lewis",
    "b": "Bob Beamon",
    "c": "Dick Fosbury",
    "d": "Jesse Owens",
    "ans": "C",
    "exp": "Dick Fosbury đã giành HCV Olympic 1968 với kỹ thuật nhảy úp lưng qua xà mang tên Fosbury Flop, thay đổi hoàn toàn lịch sử môn nhảy cao.",
    "tags": [
      "Thể thao",
      "Điền kinh"
    ]
  },
  {
    "id": "q-mh500-b4-036",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Kỷ lục thế giới nhảy xa nam tồn tại bền bỉ từ năm 1991 tại giải vô địch thế giới ở Tokyo với thành tích 8,95m thuộc về vận động viên nào?",
    "a": "Bob Beamon",
    "b": "Carl Lewis",
    "c": "Ivan Pedroso",
    "d": "Mike Powell",
    "ans": "D",
    "exp": "Mike Powell đã nhảy đạt mức 8,95m vào năm 1991 tại Tokyo, phá kỷ lục 8,90m tồn tại suốt 23 năm của Bob Beamon.",
    "tags": [
      "Thể thao",
      "Điền kinh"
    ]
  },
  {
    "id": "q-mh500-b4-037",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Trong môn bơi lội thi đấu tiêu chuẩn, ở nội dung bơi hỗn hợp cá nhân, vận động viên phải thực hiện bốn kiểu bơi theo thứ tự đúng nào sau đây?",
    "a": "Bơi bướm, bơi ngửa, bơi ếch, bơi sải",
    "b": "Bơi ếch, bơi ngửa, bơi bướm, bơi sải",
    "c": "Bơi ngửa, bơi ếch, bơi bướm, bơi sải",
    "d": "Bơi sải, bơi ngửa, bơi ếch, bơi bướm",
    "ans": "A",
    "exp": "Trong nội dung hỗn hợp cá nhân, thứ tự quy định bắt buộc là bơi bướm, bơi ngửa, bơi ếch và cuối cùng là bơi tự do tức bơi sải.",
    "tags": [
      "Thể thao",
      "Bơi lội",
      "Luật thi đấu"
    ]
  },
  {
    "id": "q-mh500-b4-038",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Khác với bơi hỗn hợp cá nhân, nội dung bơi tiếp sức hỗn hợp đồng đội 4x100m lại bắt đầu bằng kiểu bơi nào ở lượt bơi đầu tiên?",
    "a": "Bơi bướm",
    "b": "Bơi ngửa",
    "c": "Bơi ếch",
    "d": "Bơi tự do",
    "ans": "B",
    "exp": "Trong bơi tiếp sức hỗn hợp, lượt đầu tiên phải là bơi ngửa vì vận động viên bơi ngửa xuất phát từ dưới nước thay vì nhảy từ bục xuất phát.",
    "tags": [
      "Thể thao",
      "Bơi lội",
      "Luật thi đấu"
    ]
  },
  {
    "id": "q-mh500-b4-039",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Kình ngư Nguyễn Thị Ánh Viên đã giành tổng cộng bao nhiêu tấm huy chương vàng cá nhân tại một kỳ SEA Games 28 năm 2015 ở Singapore?",
    "a": "6 huy chương vàng",
    "b": "10 huy chương vàng",
    "c": "8 huy chương vàng",
    "d": "12 huy chương vàng",
    "ans": "C",
    "exp": "Tại SEA Games 28 năm 2015, Nguyễn Thị Ánh Viên đã làm dậy sóng đường đua xanh khu vực khi giành 8 HCV và phá 8 kỷ lục đại hội.",
    "tags": [
      "Thể thao",
      "Bơi lội",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b4-040",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Theo luật bóng đá của IFAB, một trận đấu sẽ phải dừng lại ngay lập tức nếu một đội bóng trên sân bị đuổi người đến mức còn ít hơn bao nhiêu cầu thủ?",
    "a": "6 cầu thủ",
    "b": "9 cầu thủ",
    "c": "8 cầu thủ",
    "d": "7 cầu thủ",
    "ans": "D",
    "exp": "Theo Luật 3 của IFAB, một trận đấu không thể bắt đầu hoặc tiếp tục nếu một trong hai đội có ít hơn 7 cầu thủ trên sân.",
    "tags": [
      "Thể thao",
      "Luật thi đấu",
      "Bóng đá"
    ]
  },
  {
    "id": "q-mh500-b4-041",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Theo luật bóng đá chính thức, trong tình huống ném biên, nếu bóng được ném đi vào thẳng khung thành của đối phương mà không chạm bất kỳ cầu thủ nào khác thì trọng tài xử lý thế nào?",
    "a": "Cho đội phòng ngự phát bóng lên",
    "b": "Cho ném biên lại từ đầu",
    "c": "Công nhận bàn thắng hợp lệ",
    "d": "Cho đội tấn công hưởng phạt góc",
    "ans": "A",
    "exp": "Theo Luật 15 của IFAB, không thể ghi bàn trực tiếp từ quả ném biên; nếu bóng vào lưới đối phương trực tiếp thì đội phòng ngự được hưởng quả phát bóng lên.",
    "tags": [
      "Thể thao",
      "Luật thi đấu",
      "Bóng đá"
    ]
  },
  {
    "id": "q-mh500-b4-042",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Theo quy định của Liên đoàn Bóng chuyền Quốc tế FIVB, chiều cao lưới tiêu chuẩn dành cho nội dung thi đấu bóng chuyền trong nhà của nam và nữ lần lượt là bao nhiêu?",
    "a": "2,40m và 2,20m",
    "b": "2,43m và 2,24m",
    "c": "2,45m và 2,25m",
    "d": "2,50m và 2,30m",
    "ans": "B",
    "exp": "Chiều cao lưới bóng chuyền trong nhà chuẩn quốc tế của nam là 2,43m và của nữ là 2,24m.",
    "tags": [
      "Thể thao",
      "Luật thi đấu",
      "Bóng chuyền"
    ]
  },
  {
    "id": "q-mh500-b4-043",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Trong môn cầu lông, theo luật của BWF, ở hiệp đấu đang có tỷ số 29 đều thì bên nào sẽ giành chiến thắng hiệp đấu đó?",
    "a": "Bên nào dẫn cách biệt 2 điểm trước",
    "b": "Bên nào chạm điểm 31 trước",
    "c": "Bên nào chạm điểm 30 trước",
    "d": "Thi đấu tiếp cho đến khi có cách biệt 2 điểm",
    "ans": "C",
    "exp": "Theo luật cầu lông BWF, từ điểm 20 đều hai bên phải thắng cách biệt 2 điểm, nhưng tối đa đến 29 đều thì bên nào ghi điểm thứ 30 trước sẽ thắng hiệp đó.",
    "tags": [
      "Thể thao",
      "Luật thi đấu",
      "Cầu lông"
    ]
  },
  {
    "id": "q-mh500-b4-044",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Theo luật thi đấu của Liên đoàn Bóng rổ Quốc tế FIBA, thời gian tối đa để một đội kiểm soát bóng ở trên sân phải thực hiện cú ném rổ chạm vành rổ là bao nhiêu giây?",
    "a": "20 giây",
    "b": "35 giây",
    "c": "30 giây",
    "d": "24 giây",
    "ans": "D",
    "exp": "Luật 24 giây quy định đội tấn công phải thực hiện pha dứt điểm chạm vành rổ trong vòng 24 giây kể từ khi kiểm soát bóng.",
    "tags": [
      "Thể thao",
      "Luật thi đấu",
      "Bóng rổ"
    ]
  },
  {
    "id": "q-mh500-b4-045",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Tại giải vô địch bóng đá U23 châu Á năm 2018 ở Thường Châu, đội tuyển U23 Việt Nam đã lần lượt vượt qua hai đối thủ Tây Á nào ở tứ kết và bán kết trên chấm luân lưu?",
    "a": "Iraq và Qatar",
    "b": "Syria và Qatar",
    "c": "Jordan và Iraq",
    "d": "Bahrain và Uzbekistan",
    "ans": "A",
    "exp": "U23 Việt Nam đã hòa U23 Iraq 3-3 ở tứ kết và hòa U23 Qatar 2-2 ở bán kết, trước khi đánh bại cả hai đối thủ trên chấm luân lưu để vào chung kết.",
    "tags": [
      "Thể thao",
      "Bóng đá",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b4-046",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Đội tuyển bóng đá nam quốc gia Việt Nam lần đầu tiên đăng quang chức vô địch Đông Nam Á AFF Cup vào năm nào?",
    "a": "Năm 1998",
    "b": "Năm 2008",
    "c": "Năm 2018",
    "d": "Năm 2022",
    "ans": "B",
    "exp": "Năm 2008, dưới sự dẫn dắt của HLV Henrique Calisto, đội tuyển Việt Nam đã đánh bại Thái Lan với tổng tỷ số 3-2 sau hai lượt trận chung kết để lần đầu vô địch AFF Cup.",
    "tags": [
      "Thể thao",
      "Bóng đá",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b4-047",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Đội tuyển bóng đá nữ quốc gia Việt Nam đã lần đầu tiên trong lịch sử giành quyền tham dự Vòng chung kết FIFA World Cup nữ vào năm 2023 được đồng đăng cai tại hai quốc gia nào?",
    "a": "Mỹ và Canada",
    "b": "Pháp và Đức",
    "c": "Úc và New Zealand",
    "d": "Nhật Bản và Hàn Quốc",
    "ans": "C",
    "exp": "Đội tuyển nữ Việt Nam do HLV Mai Đức Chung dẫn dắt đã góp mặt tại VCK World Cup nữ 2023 tổ chức tại Úc và New Zealand.",
    "tags": [
      "Thể thao",
      "World Cup",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b4-048",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Trong lịch sử World Cup bóng đá nam, ai là người đầu tiên giành chức vô địch thế giới cả trên cương vị cầu thủ lẫn huấn luyện viên trưởng?",
    "a": "Franz Beckenbauer",
    "b": "Vittorio Pozzo",
    "c": "Didier Deschamps",
    "d": "Mário Zagallo",
    "ans": "D",
    "exp": "Huyền thoại người Brasil Mário Zagallo vô địch World Cup với tư cách cầu thủ năm 1958, 1962 và với tư cách HLV trưởng năm 1970, trước Franz Beckenbauer và Didier Deschamps.",
    "tags": [
      "Thể thao",
      "World Cup"
    ]
  },
  {
    "id": "q-mh500-b4-049",
    "cat": "cat-sport",
    "diff": "MEDIUM",
    "q": "Kỷ lục ghi nhiều bàn thắng nhất trong lịch sử các kỳ World Cup bóng đá nam với 16 bàn thắng hiện thuộc về chân sút nào?",
    "a": "Miroslav Klose",
    "b": "Gerd Müller",
    "c": "Ronaldo Nazário",
    "d": "Lionel Messi",
    "ans": "A",
    "exp": "Miroslav Klose của đội tuyển Đức đã ghi tổng cộng 16 bàn qua 4 kỳ World Cup từ 2002 đến 2014, vượt qua cột mốc 15 bàn của Ronaldo người Brasil.",
    "tags": [
      "Thể thao",
      "World Cup"
    ]
  },
  {
    "id": "q-mh500-b4-050",
    "cat": "cat-sport",
    "diff": "HARD",
    "q": "Cầu thủ duy nhất trong lịch sử từng giành chức vô địch UEFA Champions League cùng 3 câu lạc bộ khác nhau là ai?",
    "a": "Cristiano Ronaldo",
    "b": "Clarence Seedorf",
    "c": "Samuel Eto'o",
    "d": "Zlatan Ibrahimovic",
    "ans": "B",
    "exp": "Danh thủ người Hà Lan Clarence Seedorf đã vô địch Champions League cùng Ajax năm 1995, Real Madrid năm 1998 và AC Milan năm 2003, 2007.",
    "tags": [
      "Thể thao",
      "Champions League"
    ]
  },
  {
    "id": "q-mh500-b4-056",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Bản giao hưởng số 9 cung Rê thứ của Ludwig van Beethoven nổi tiếng với chương cuối sử dụng phần hợp xướng phổ nhạc từ bài thơ Khải hoàn ca của thi hào nào?",
    "a": "Johann Wolfgang von Goethe",
    "b": "Rainer Maria Rilke",
    "c": "Heinrich Heine",
    "d": "Friedrich Schiller",
    "ans": "D",
    "exp": "Chương 4 của Giao hưởng số 9 được Beethoven phổ nhạc từ bài thơ Ode an die Freude tức Khải hoàn ca hay Hướng tới niềm vui của Friedrich Schiller.",
    "tags": [
      "Âm nhạc",
      "Nhạc cổ điển"
    ]
  },
  {
    "id": "q-mh500-b4-057",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Tác phẩm Bốn mùa gồm 4 bản concerto viết cho đàn violin và dàn nhạc dây là kiệt tác của nhà soạn nhạc người Ý thời kỳ Baroque nào?",
    "a": "Antonio Vivaldi",
    "b": "Claudio Monteverdi",
    "c": "Domenico Scarlatti",
    "d": "Arcangelo Corelli",
    "ans": "A",
    "exp": "Tác phẩm Bốn mùa xuất bản năm 1725 là kiệt tác nổi tiếng nhất của linh mục đỏ người Ý Antonio Vivaldi.",
    "tags": [
      "Âm nhạc",
      "Nhạc cổ điển"
    ]
  },
  {
    "id": "q-mh500-b4-058",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Trong kho tàng tác phẩm của Johann Sebastian Bach, ký hiệu viết tắt BWV đứng trước số thứ tự tác phẩm có nghĩa là gì?",
    "a": "Bộ sưu tập bản thảo của Bach",
    "b": "Danh mục tác phẩm của Bach",
    "c": "Thư viện âm nhạc Weimar của Bach",
    "d": "Biên niên sử giao hưởng của Bach",
    "ans": "B",
    "exp": "BWV là viết tắt của Bach-Werke-Verzeichnis trong tiếng Đức, nghĩa là Danh mục tác phẩm của Bach do Wolfgang Schmieder lập năm 1950.",
    "tags": [
      "Âm nhạc",
      "Nhạc cổ điển"
    ]
  },
  {
    "id": "q-mh500-b4-059",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Ba vở vũ kịch ballet kinh điển Hồ thiên nga, Người đẹp ngủ trong rừng và Kẹp hạt dẻ là sáng tác của nhà soạn nhạc người Nga nào?",
    "a": "Igor Stravinsky",
    "b": "Sergei Rachmaninoff",
    "c": "Pyotr Ilyich Tchaikovsky",
    "d": "Dmitri Shostakovich",
    "ans": "C",
    "exp": "Pyotr Ilyich Tchaikovsky là tác giả của bộ ba vở ballet kinh điển bất hủ: Hồ thiên nga, Người đẹp ngủ trong rừng và Kẹp hạt dẻ.",
    "tags": [
      "Âm nhạc",
      "Nhạc cổ điển"
    ]
  },
  {
    "id": "q-mh500-b4-060",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Vở nhạc kịch Cây sáo thần công diễn lần đầu năm 1791 tại Vienna chỉ hai tháng trước khi tác giả qua đời là tác phẩm của nhà soạn nhạc nào?",
    "a": "Joseph Haydn",
    "b": "Gioachino Rossini",
    "c": "Franz Schubert",
    "d": "Wolfgang Amadeus Mozart",
    "ans": "D",
    "exp": "Die Zauberflöte tức Cây sáo thần là vở Singspiel nổi tiếng bậc nhất của Wolfgang Amadeus Mozart, công diễn tháng 9 năm 1791.",
    "tags": [
      "Âm nhạc",
      "Nhạc cổ điển"
    ]
  },
  {
    "id": "q-mh500-b4-061",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Nhà soạn nhạc thời kỳ Lãng mạn nào được mệnh danh là Nhà thơ của cây đàn dương cầm và đã dành gần như toàn bộ sự nghiệp chỉ để sáng tác cho độc tấu piano?",
    "a": "Frédéric Chopin",
    "b": "Franz Liszt",
    "c": "Robert Schumann",
    "d": "Johannes Brahms",
    "ans": "A",
    "exp": "Nhà soạn nhạc người Ba Lan Frédéric Chopin được tôn vinh là Nhà thơ của cây đàn piano với các thể loại Nocturne, Mazurka, Polonaise và Ballade.",
    "tags": [
      "Âm nhạc",
      "Nhạc cổ điển"
    ]
  },
  {
    "id": "q-mh500-b4-062",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Trong nhạc lý cơ bản, một quãng tám đúng được chia thành bao nhiêu nửa cung bằng nhau theo hệ thống bình quân luật 12 âm?",
    "a": "7 nửa cung",
    "b": "12 nửa cung",
    "c": "10 nửa cung",
    "d": "8 nửa cung",
    "ans": "B",
    "exp": "Theo hệ thống bình quân luật phương Tây, một quãng tám được chia đều thành 12 nửa cung.",
    "tags": [
      "Âm nhạc",
      "Nhạc lý"
    ]
  },
  {
    "id": "q-mh500-b4-063",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Theo nhạc lý, giọng Đô trưởng và giọng thứ tự nhiên nào là hai giọng song song có cùng hóa biểu không có dấu thăng và dấu giáng nào?",
    "a": "Rê thứ",
    "b": "Mi thứ",
    "c": "La thứ",
    "d": "Sol thứ",
    "ans": "C",
    "exp": "Đô trưởng và La thứ tự nhiên là cặp giọng song song có hóa biểu trống, không có dấu thăng hay dấu giáng ở đầu khuông nhạc.",
    "tags": [
      "Âm nhạc",
      "Nhạc lý"
    ]
  },
  {
    "id": "q-mh500-b4-064",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Trong thuật ngữ biểu diễn âm nhạc quốc tế có gốc tiếng Ý, ký hiệu Fortissimo viết tắt là ff chỉ dẫn người nghệ sĩ phải chơi nhạc như thế nào?",
    "a": "Chơi rất nhẹ",
    "b": "Chơi chậm dần lại",
    "c": "Chơi nhanh dần lên",
    "d": "Chơi rất mạnh",
    "ans": "D",
    "exp": "Trong thuật ngữ cường độ âm nhạc tiếng Ý, Forte là mạnh còn Fortissimo viết tắt là ff có nghĩa là rất mạnh.",
    "tags": [
      "Âm nhạc",
      "Nhạc lý"
    ]
  },
  {
    "id": "q-mh500-b4-065",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Trong lý thuyết âm nhạc, chuẩn cao độ quốc tế hiện đại quy định nốt La ở quãng tám thứ tư dùng để lên dây nhạc cụ có tần số chuẩn là bao nhiêu?",
    "a": "440 Hz",
    "b": "432 Hz",
    "c": "444 Hz",
    "d": "480 Hz",
    "ans": "A",
    "exp": "Tổ chức Tiêu chuẩn hóa Quốc tế ISO quy định nốt chuẩn A4 để lên dây nhạc cụ trong dàn nhạc giao hưởng có tần số 440 Hz.",
    "tags": [
      "Âm nhạc",
      "Nhạc lý"
    ]
  },
  {
    "id": "q-mh500-b4-066",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Cây đàn bầu truyền thống của Việt Nam là loại nhạc cụ độc huyền phát ra âm thanh du dương chủ yếu dựa trên kỹ thuật gảy kết hợp tạo âm gì?",
    "a": "Âm thực trên phím bấm",
    "b": "Âm bồi kết hợp uốn vòi đàn",
    "c": "Âm cộng hưởng từ lỗ thoát hơi",
    "d": "Âm rung từ dây đàn phụ",
    "ans": "B",
    "exp": "Đàn bầu chỉ có một dây duy nhất, nghệ nhân dùng que gảy điểm nút sóng để tạo âm bồi kết hợp tay trái rung nhấn cần đàn tức vòi đàn để đổi cao độ.",
    "tags": [
      "Âm nhạc",
      "Nhạc cụ truyền thống"
    ]
  },
  {
    "id": "q-mh500-b4-067",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Trong nghệ thuật Ca trù cổ truyền của người Việt, cây đàn đáy dùng để đệm cho đào nương hát có đặc điểm cấu tạo độc đáo nào?",
    "a": "Có 2 dây kéo bằng vĩ lông đuôi ngựa",
    "b": "Có 4 dây kim loại và cần đàn rất ngắn",
    "c": "Có 3 dây lụa và thùng đàn không có đáy",
    "d": "Có 16 dây mắc dọc mặt thùng đàn hình vòm",
    "ans": "C",
    "exp": "Đàn đáy là nhạc cụ đặc trưng của Ca trù có cần rất dài, 3 dây tơ và hộp cộng hưởng hình thang cân phía sau để trống không có mặt đáy.",
    "tags": [
      "Âm nhạc",
      "Nhạc cụ truyền thống"
    ]
  },
  {
    "id": "q-mh500-b4-068",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Nhạc cụ truyền thống K'lông pút của đồng bào dân tộc ở Tây Nguyên phát ra âm thanh bằng cách diễn tấu nào?",
    "a": "Dùng dùi gỗ gõ trực tiếp lên ống nứa",
    "b": "Dùng cung vĩ kéo ngang qua dây tre",
    "c": "Ngậm miệng thổi trực tiếp vào đầu ống trúc",
    "d": "Vỗ hai bàn tay vào nhau trước miệng ống nứa để lùa hơi",
    "ans": "D",
    "exp": "Khi chơi đàn K'lông pút, người biểu diễn khum hai bàn tay vỗ vào nhau trước miệng các ống nứa rỗng để tạo luồng không khí dội vào ống phát ra âm thanh.",
    "tags": [
      "Âm nhạc",
      "Nhạc cụ truyền thống"
    ]
  },
  {
    "id": "q-mh500-b4-069",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Gia tộc nghệ nhân người Ý nào tại vùng Cremona vào thế kỷ 17 - 18 đã chế tác nên những cây đàn violin đắt giá và danh tiếng bậc nhất lịch sử thế giới?",
    "a": "Stradivari",
    "b": "Steinway",
    "c": "Bösendorfer",
    "d": "Cristofori",
    "ans": "A",
    "exp": "Antonio Stradivari cùng gia tộc Stradivari tại Cremona đã chế tác những cây đàn dây Stradivarius có chất lượng âm thanh huyền thoại chưa ai sánh kịp.",
    "tags": [
      "Âm nhạc",
      "Nhạc cụ"
    ]
  },
  {
    "id": "q-mh500-b4-070",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Trong dàn nhạc giao hưởng phương Tây tiêu chuẩn, nhạc cụ nào sau đây được xếp vào bộ gỗ dù thân kèn thường được làm bằng kim loại đồng?",
    "a": "Kèn Trumpet",
    "b": "Sáo Flute và kèn Saxophone",
    "c": "Kèn Trombone",
    "d": "Kèn Tuba",
    "ans": "B",
    "exp": "Sáo Flute hiện đại và kèn Saxophone dù làm bằng kim loại nhưng được xếp vào bộ gỗ vì nguyên lý tạo âm bằng luồng hơi qua lỗ thổi hoặc dăm đơn bằng gỗ, không rung môi như bộ đồng.",
    "tags": [
      "Âm nhạc",
      "Nhạc cụ"
    ]
  },
  {
    "id": "q-mh500-b4-071",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Bản trường ca nổi tiếng Con đường cái quan và ca khúc Tình ca là những tác phẩm tiêu biểu của nhạc sĩ gạo cội nào của tân nhạc Việt Nam?",
    "a": "Văn Cao",
    "b": "Hoàng Việt",
    "c": "Phạm Duy",
    "d": "Lưu Hữu Phước",
    "ans": "C",
    "exp": "Nhạc sĩ Phạm Duy là tác giả của ca khúc Tình ca năm 1953 và bản trường ca Con đường cái quan viết về hành trình xuyên Việt.",
    "tags": [
      "Âm nhạc",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b4-072",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Bản giao hưởng đầu tiên của nền âm nhạc mới Việt Nam mang tên Quê hương được sáng tác vào năm 1965 là tác phẩm của nhạc sĩ nào?",
    "a": "Đỗ Nhuận",
    "b": "Huy Du",
    "c": "Nguyễn Xuân Khoát",
    "d": "Hoàng Việt",
    "ans": "D",
    "exp": "Nhạc sĩ Hoàng Việt đã sáng tác bản Giao hưởng số 1 cung Đô thứ mang tên Quê hương khi đang tu nghiệp tại Nhạc viện Sofia, Bulgaria.",
    "tags": [
      "Âm nhạc",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b4-073",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Vở opera đầu tiên của nền âm nhạc bác học Việt Nam mang tên Cô Sao được công diễn vào năm 1965 là sáng tác của nhạc sĩ nào?",
    "a": "Đỗ Nhuận",
    "b": "Trọng Bằng",
    "c": "Văn Ký",
    "d": "Đàm Linh",
    "ans": "A",
    "exp": "Nhạc sĩ Đỗ Nhuận là cha đẻ của vở nhạc kịch opera đầu tiên của Việt Nam mang tên Cô Sao, công diễn năm 1965 tại Hà Nội.",
    "tags": [
      "Âm nhạc",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b4-074",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Ca khúc Diễm xưa của nhạc sĩ Trịnh Công Sơn đã trở thành tác phẩm âm nhạc Việt Nam đầu tiên được đưa vào giáo trình giảng dạy tại một trường đại học của quốc gia nào?",
    "a": "Pháp",
    "b": "Nhật Bản",
    "c": "Hàn Quốc",
    "d": "Đức",
    "ans": "B",
    "exp": "Diễm xưa được dịch sang tiếng Nhật với tên Utsukushii Mukashi, do ca sĩ Khánh Ly thu âm tại Nhật và được Đại học Kansai đưa vào chương trình giảng dạy văn hóa châu Á.",
    "tags": [
      "Âm nhạc",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b4-075",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Bức bích họa khổng lồ Trường học Athens quy tụ các triết gia cổ đại như Plato và Aristotle tại Điện Tông tòa Vatican là kiệt tác của danh họa thời Phục Hưng nào?",
    "a": "Leonardo da Vinci",
    "b": "Michelangelo Buonarroti",
    "c": "Raphael",
    "d": "Sandro Botticelli",
    "ans": "C",
    "exp": "Trường học Athens được danh họa Raphael thực hiện từ năm 1509 đến 1511, là đỉnh cao của nghệ thuật phối cảnh và tinh thần nhân văn thời Phục Hưng.",
    "tags": [
      "Nghệ thuật",
      "Hội họa"
    ]
  },
  {
    "id": "q-mh500-b4-076",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Danh họa người Ý Sandro Botticelli đã sáng tác bức tranh nổi tiếng Sự ra đời của thần Vệ Nữ vào khoảng thập niên 1480 hiện đang lưu giữ tại bảo tàng nào?",
    "a": "Bảo tàng Louvre tại Paris",
    "b": "Bảo tàng Prado tại Madrid",
    "c": "Bảo tàng Quốc gia tại London",
    "d": "Triển lãm Uffizi tại Florence",
    "ans": "D",
    "exp": "Kiệt tác Sự ra đời của thần Vệ Nữ của Sandro Botticelli hiện được trưng bày tại phòng triển lãm Uffizi ở thành phố Florence, Ý.",
    "tags": [
      "Nghệ thuật",
      "Hội họa"
    ]
  },
  {
    "id": "q-mh500-b4-077",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Kỹ thuật hội họa Sfumato tạo sự chuyển sắc thái mờ ảo như làn khói không có đường viền cứng nhắc là dấu ấn bậc thầy gắn liền với danh họa nào?",
    "a": "Leonardo da Vinci",
    "b": "Caravaggio",
    "c": "Rembrandt",
    "d": "Titian",
    "ans": "A",
    "exp": "Sfumato nghĩa là tan biến như khói trong tiếng Ý, là kỹ thuật chồng nhiều lớp sơn mỏng bán trong suốt được Leonardo da Vinci ứng dụng đỉnh cao trong bức Mona Lisa.",
    "tags": [
      "Nghệ thuật",
      "Hội họa"
    ]
  },
  {
    "id": "q-mh500-b4-078",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Trường phái hội họa Ấn tượng vào cuối thế kỷ 19 ở Pháp được đặt tên theo bức tranh Ấn tượng, mặt trời mọc vẽ năm 1872 của họa sĩ nào?",
    "a": "Édouard Manet",
    "b": "Claude Monet",
    "c": "Pierre-Auguste Renoir",
    "d": "Edgar Degas",
    "ans": "B",
    "exp": "Tên gọi trường phái Ấn tượng bắt nguồn từ bức tranh Impression, soleil levant tức Ấn tượng, mặt trời mọc vẽ cảng Le Havre của Claude Monet.",
    "tags": [
      "Nghệ thuật",
      "Hội họa"
    ]
  },
  {
    "id": "q-mh500-b4-079",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Danh họa thuộc trường phái Tân Ấn tượng Georges Seurat nổi tiếng với bức Chiều chủ nhật trên đảo Grande Jatte đã khai sinh ra kỹ thuật vẽ nào?",
    "a": "Dã thú Fauvism",
    "b": "Trừu tượng hình học",
    "c": "Chấm họa Pointillism",
    "d": "Biểu hiện trừu tượng",
    "ans": "C",
    "exp": "Georges Seurat đã phát triển kỹ thuật Pointillism tức Chấm họa, dùng hàng vạn chấm màu nguyên chất nhỏ li ti đặt cạnh nhau để mắt người xem tự hòa sắc.",
    "tags": [
      "Nghệ thuật",
      "Hội họa"
    ]
  },
  {
    "id": "q-mh500-b4-080",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Bức tranh sơn dầu khổ lớn Guernica sáng tác năm 1937 nhằm tố cáo tội ác ném bom hủy diệt thị trấn xứ Basque là kiệt tác của danh họa trường phái Lập thể nào?",
    "a": "Georges Braque",
    "b": "Salvador Dalí",
    "c": "Henri Matisse",
    "d": "Pablo Picasso",
    "ans": "D",
    "exp": "Pablo Picasso vẽ bức Guernica với tông màu đen, trắng và xám vào năm 1937 để phản đối vụ oanh tạc thị trấn Guernica trong Nội chiến Tây Ban Nha.",
    "tags": [
      "Nghệ thuật",
      "Hội họa"
    ]
  },
  {
    "id": "q-mh500-b4-081",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Bức tranh Những cô gái ở Avignon năm 1907 được xem là tác phẩm mở đường cho trường phái Lập thể do Pablo Picasso sáng tác cùng sự đồng sáng lập trường phái của họa sĩ Pháp nào?",
    "a": "Georges Braque",
    "b": "Paul Cézanne",
    "c": "Fernand Léger",
    "d": "Marcel Duchamp",
    "ans": "A",
    "exp": "Pablo Picasso và Georges Braque là hai người đồng sáng lập và phát triển trường phái hội họa Lập thể tại Paris vào đầu thế kỷ 20.",
    "tags": [
      "Nghệ thuật",
      "Hội họa"
    ]
  },
  {
    "id": "q-mh500-b4-082",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Trong bộ tứ danh họa hàng đầu của hội họa hiện đại Việt Nam thời kỳ Đông Dương theo câu truyền tụng Nhất Trí, nhì Vân, tam Lân, tứ Cẩn, chữ Trí chỉ danh họa nào?",
    "a": "Nguyễn Sáng",
    "b": "Nguyễn Gia Trí",
    "c": "Tô Ngọc Vân",
    "d": "Nguyễn Tư Nghiêm",
    "ans": "B",
    "exp": "Bộ tứ đầu tiên của mỹ thuật Đông Dương gồm Nhất Trí là Nguyễn Gia Trí, nhì Vân là Tô Ngọc Vân, tam Lân là Nguyễn Tường Lân, tứ Cẩn là Trần Văn Cẩn.",
    "tags": [
      "Nghệ thuật",
      "Hội họa",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b4-083",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Bức tranh sơn mài Em Thúy được công nhận là Bảo vật quốc gia của Việt Nam là tác phẩm tiêu biểu của danh họa nào?",
    "a": "Tô Ngọc Vân",
    "b": "Bùi Xuân Phái",
    "c": "Trần Văn Cẩn",
    "d": "Mai Trung Thứ",
    "ans": "C",
    "exp": "Bức tranh sơn dầu Em Thúy sáng tác năm 1943 là kiệt tác chân dung nổi tiếng nhất của danh họa Trần Văn Cẩn, hiện lưu giữ tại Bảo tàng Mỹ thuật Việt Nam.",
    "tags": [
      "Nghệ thuật",
      "Hội họa",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b4-084",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Pho tượng đồng Người suy tư nổi tiếng thế giới ban đầu được thiết kế làm một phần của tác phẩm Cánh cổng Địa ngục là kiệt tác của nhà điêu khắc người Pháp nào?",
    "a": "Alberto Giacometti",
    "b": "Camille Claudel",
    "c": "Constantin Brâncuși",
    "d": "Auguste Rodin",
    "ans": "D",
    "exp": "Auguste Rodin đã sáng tác bức tượng Người suy tư vào khoảng năm 1880 như hình tượng nhà thơ Dante ngồi trầm tư trên đỉnh Cánh cổng Địa ngục.",
    "tags": [
      "Nghệ thuật",
      "Điêu khắc"
    ]
  },
  {
    "id": "q-mh500-b4-085",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Pho tượng đá cẩm thạch Pietà khắc họa Đức Mẹ Maria ôm thi hài Chúa Giêsu tại Vương cung thánh đường Thánh Phêrô là tác phẩm duy nhất có chữ ký của nghệ sĩ nào?",
    "a": "Michelangelo Buonarroti",
    "b": "Donatello",
    "c": "Gian Lorenzo Bernini",
    "d": "Antonio Canova",
    "ans": "A",
    "exp": "Michelangelo hoàn thành tượng Pietà khi mới 24 tuổi và đã khắc tên mình lên dải băng vắt ngang ngực Đức Mẹ; đây là tác phẩm duy nhất ông từng ký tên.",
    "tags": [
      "Nghệ thuật",
      "Điêu khắc"
    ]
  },
  {
    "id": "q-mh500-b4-086",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Trong kiến trúc cổ điển Hy Lạp, thức cột nào có phần đầu cột được trang trí cầu kỳ và hoa mỹ nhất với hình ảnh những phiến lá cây ô rô cách điệu?",
    "a": "Thức cột Doric",
    "b": "Thức cột Corinthian",
    "c": "Thức cột Ionic",
    "d": "Thức cột Tuscan",
    "ans": "B",
    "exp": "Trong ba thức cột Hy Lạp cổ điển, Doric khỏe khoắn đơn giản, Ionic có vòng xoắn ốc, còn Corinthian mảnh mai và cầu kỳ nhất với họa tiết lá ô rô Acanthus.",
    "tags": [
      "Nghệ thuật",
      "Kiến trúc"
    ]
  },
  {
    "id": "q-mh500-b4-087",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Vương cung thánh đường Sagrada Família tại thành phố Barcelona với phong cách kiến trúc độc đáo được xây dựng kéo dài hơn một thế kỷ là thiết kế của kiến trúc sư nào?",
    "a": "Santiago Calatrava",
    "b": "Le Corbusier",
    "c": "Antoni Gaudí",
    "d": "Frank Lloyd Wright",
    "ans": "C",
    "exp": "Kiến trúc sư người Catalunya Antoni Gaudí đã dành hơn 40 năm cuối đời để thiết kế và xây dựng kiệt tác nhà thờ Sagrada Família tại Barcelona.",
    "tags": [
      "Nghệ thuật",
      "Kiến trúc"
    ]
  },
  {
    "id": "q-mh500-b4-088",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Trường phái thiết kế và kiến trúc hiện đại Bauhaus có ảnh hưởng sâu rộng đến kiến trúc thế giới thế kỷ 20 được thành lập năm 1919 tại Đức bởi kiến trúc sư nào?",
    "a": "Ludwig Mies van der Rohe",
    "b": "Zaha Hadid",
    "c": "Frank Gehry",
    "d": "Walter Gropius",
    "ans": "D",
    "exp": "Trường Bauhaus được kiến trúc sư Walter Gropius thành lập năm 1919 tại thành phố Weimar, Đức, kết hợp mỹ thuật, thủ công và công nghiệp hiện đại.",
    "tags": [
      "Nghệ thuật",
      "Kiến trúc"
    ]
  },
  {
    "id": "q-mh500-b4-089",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Nhà hát Opera Sydney tại Úc với thiết kế những cánh buồm trắng vươn ra biển cả là tác phẩm của kiến trúc sư người Đan Mạch nào?",
    "a": "Jørn Utzon",
    "b": "Arne Jacobsen",
    "c": "Bjarke Ingels",
    "d": "Alvar Aalto",
    "ans": "A",
    "exp": "Kiến trúc sư người Đan Mạch Jørn Utzon đã chiến thắng cuộc thi thiết kế Nhà hát Opera Sydney năm 1957 và được trao giải Pritzker năm 2003.",
    "tags": [
      "Nghệ thuật",
      "Kiến trúc"
    ]
  },
  {
    "id": "q-mh500-b4-090",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Hai anh em nhà phát minh người Pháp nào đã tổ chức buổi chiếu phim thương mại có thu tiền đầu tiên trên thế giới tại Paris vào ngày 28 tháng 12 năm 1895?",
    "a": "Anh em nhà Wright",
    "b": "Anh em nhà Lumière",
    "c": "Anh em nhà Montgolfier",
    "d": "Anh em nhà Pathé",
    "ans": "B",
    "exp": "Auguste và Louis Lumière đã phát minh máy Cinématographe và tổ chức buổi chiếu phim công cộng đầu tiên tại quán Grand Café ở Paris ngày 28/12/1895.",
    "tags": [
      "Điện ảnh",
      "Lịch sử điện ảnh"
    ]
  },
  {
    "id": "q-mh500-b4-091",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Bộ phim khoa học viễn tưởng câm Chuyến du hành lên Mặt Trăng sản xuất năm 1902 với hình ảnh con tàu vũ trụ cắm vào mắt Mặt Trăng là tác phẩm của đạo diễn tiên phong nào?",
    "a": "Sergei Eisenstein",
    "b": "D. W. Griffith",
    "c": "Georges Méliès",
    "d": "Fritz Lang",
    "ans": "C",
    "exp": "Ảo thuật gia kiêm đạo diễn người Pháp Georges Méliès đã thực hiện bộ phim Le Voyage dans la Lune năm 1902, đặt nền móng cho kỹ xảo điện ảnh thế giới.",
    "tags": [
      "Điện ảnh",
      "Lịch sử điện ảnh"
    ]
  },
  {
    "id": "q-mh500-b4-092",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Bộ phim Chiến hạm Potemkin năm 1925 nổi tiếng với phân cảnh xe nôi em bé lăn trên bậc thang Odessa là kiệt tác về nghệ thuật dựng phim của đạo diễn Liên Xô nào?",
    "a": "Andrei Tarkovsky",
    "b": "Mikhail Kalatozov",
    "c": "Dziga Vertov",
    "d": "Sergei Eisenstein",
    "ans": "D",
    "exp": "Sergei Eisenstein là đạo diễn phim Chiến hạm Potemkin năm 1925 và là cha đẻ lý thuyết dựng phim Montage có ảnh hưởng toàn cầu.",
    "tags": [
      "Điện ảnh",
      "Lịch sử điện ảnh"
    ]
  },
  {
    "id": "q-mh500-b4-093",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Bộ phim Công dân Kane ra mắt năm 1941 thường xuyên đứng đầu danh sách những bộ phim vĩ đại nhất lịch sử điện ảnh là tác phẩm đầu tay của đạo diễn kiêm diễn viên chính nào?",
    "a": "Orson Welles",
    "b": "Alfred Hitchcock",
    "c": "John Ford",
    "d": "Billy Wilder",
    "ans": "A",
    "exp": "Orson Welles đã đạo diễn, đồng biên kịch và đóng vai chính trong kiệt tác Citizen Kane năm 1941 khi ông mới chỉ 25 tuổi.",
    "tags": [
      "Điện ảnh",
      "Lịch sử điện ảnh"
    ]
  },
  {
    "id": "q-mh500-b4-094",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Đạo diễn huyền thoại người Nhật Bản Akira Kurosawa đã làm rạng danh điện ảnh châu Á tại phương Tây với các kiệt tác kinh điển nào sau đây?",
    "a": "Câu chuyện Tokyo và Mộ đom đóm",
    "b": "Rashomon và Bảy võ sĩ Samurai",
    "c": "Tâm trạng khi yêu và Xuân quang xạ tiết",
    "d": "Vùng đất linh hồn và Lâu đài bay của Pháp sư Howl",
    "ans": "B",
    "exp": "Akira Kurosawa là đạo diễn của Rashomon giành giải Sư tử vàng Venice 1951 và Seven Samurai năm 1954, hai bộ phim có sức ảnh hưởng lớn tới Hollywood.",
    "tags": [
      "Điện ảnh",
      "Lịch sử điện ảnh"
    ]
  },
  {
    "id": "q-mh500-b4-095",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Trong lịch sử giải thưởng điện ảnh Viện Hàn lâm Mỹ Oscar, chỉ có đúng 3 bộ phim cùng nắm giữ kỷ lục giành 11 tượng vàng, đó là những bộ phim nào?",
    "a": "Ben-Hur, Avatar và La La Land",
    "b": "Cuốn theo chiều gió, Bố già và Titanic",
    "c": "Ben-Hur, Titanic và Chúa tể những chiếc nhẫn: Sự trở lại của nhà vua",
    "d": "Titanic, Gladiator và Oppenheimer",
    "ans": "C",
    "exp": "Ba bộ phim giữ kỷ lục 11 giải Oscar là Ben-Hur năm 1959, Titanic năm 1997 và The Lord of the Rings: The Return of the King năm 2003.",
    "tags": [
      "Điện ảnh",
      "Oscar"
    ]
  },
  {
    "id": "q-mh500-b4-096",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Tại lễ trao giải Oscar năm 2020, bộ phim nào của đạo diễn Bong Joon-ho đã làm nên lịch sử khi trở thành phim không nói tiếng Anh đầu tiên thắng giải Phim hay nhất?",
    "a": "Oldboy",
    "b": "Roma",
    "c": "Drive My Car",
    "d": "Ký sinh trùng",
    "ans": "D",
    "exp": "Bộ phim Hàn Quốc Ký sinh trùng tức Parasite của đạo diễn Bong Joon-ho đã giành 4 giải Oscar năm 2020, trong đó có giải Phim hay nhất.",
    "tags": [
      "Điện ảnh",
      "Oscar"
    ]
  },
  {
    "id": "q-mh500-b4-097",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Diễn viên nào đang nắm giữ kỷ lục giành nhiều giải Oscar nhất ở hạng mục diễn xuất với 4 tượng vàng Nữ diễn viên chính xuất sắc nhất?",
    "a": "Katharine Hepburn",
    "b": "Meryl Streep",
    "c": "Ingrid Bergman",
    "d": "Frances McDormand",
    "ans": "A",
    "exp": "Huyền thoại màn bạc Katharine Hepburn giữ kỷ lục 4 lần thắng giải Oscar Nữ diễn viên chính xuất sắc nhất vào các năm 1934, 1968, 1969 và 1982.",
    "tags": [
      "Điện ảnh",
      "Oscar"
    ]
  },
  {
    "id": "q-mh500-b4-098",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Bộ phim nào đã giành giải Phim hay nhất tại lễ trao giải Oscar lần thứ nhất trong lịch sử tổ chức vào năm 1929?",
    "a": "Bình minh",
    "b": "Đôi cánh",
    "c": "Ca sĩ nhạc Jazz",
    "d": "Ánh sáng thành phố",
    "ans": "B",
    "exp": "Bộ phim câm về đề tài phi công Thế chiến thứ nhất mang tên Wings tức Đôi cánh của đạo diễn William A. Wellman là tác phẩm đầu tiên thắng giải Oscar Phim hay nhất.",
    "tags": [
      "Điện ảnh",
      "Oscar"
    ]
  },
  {
    "id": "q-mh500-b4-099",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Giải thưởng cao quý nhất dành cho bộ phim xuất sắc nhất tại Liên hoan phim quốc tế Cannes ở Pháp có tên gọi là gì?",
    "a": "Sư tử Vàng",
    "b": "Gấu Vàng",
    "c": "Cành cọ Vàng",
    "d": "Báo Vàng",
    "ans": "C",
    "exp": "Cành cọ Vàng tức Palme d'Or là giải thưởng danh giá nhất tại Liên hoan phim Cannes, trong khi Sư tử Vàng của Venice và Gấu Vàng của Berlin.",
    "tags": [
      "Điện ảnh",
      "Cannes"
    ]
  },
  {
    "id": "q-mh500-b4-100",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Bộ phim Mùi đu đủ xanh ra mắt năm 1993 từng đoạt giải Camera Vàng tại Liên hoan phim Cannes và được đề cử Oscar Phim nói tiếng nước ngoài hay nhất là của đạo diễn nào?",
    "a": "Đặng Nhật Minh",
    "b": "Phan Đăng Di",
    "c": "Bùi Thạc Chuyên",
    "d": "Trần Anh Hùng",
    "ans": "D",
    "exp": "Đạo diễn người Pháp gốc Việt Trần Anh Hùng đã thực hiện bộ phim Mùi đu đủ xanh năm 1993, giành giải Camera Vàng tại Cannes và đề cử Oscar cho điện ảnh Việt Nam.",
    "tags": [
      "Điện ảnh",
      "Cannes",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b4-101",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Năm 2023, đạo diễn Phạm Thiên Ân đã xuất sắc giành giải thưởng danh giá Camera Vàng dành cho phim đầu tay xuất sắc nhất tại Liên hoan phim Cannes với bộ phim nào?",
    "a": "Bên trong vỏ kén vàng",
    "b": "Vợ ba",
    "c": "Tro tàn rực rỡ",
    "d": "Ròm",
    "ans": "A",
    "exp": "Bộ phim Bên trong vỏ kén vàng của đạo diễn Phạm Thiên Ân đã giành giải Caméra d'Or tại Liên hoan phim Cannes lần thứ 76 năm 2023.",
    "tags": [
      "Điện ảnh",
      "Cannes",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b4-102",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Bộ phim truyện đầu tiên của điện ảnh cách mạng Việt Nam sản xuất năm 1959 mang tên Chung một dòng sông do hai đạo diễn nào thực hiện?",
    "a": "Hải Ninh và Nguyễn Đức Hinh",
    "b": "Nguyễn Hồng Nghi và Phạm Hiếu Dân",
    "c": "Phạm Văn Khoa và Bạch Diệp",
    "d": "Hồng Sến và Đặng Nhật Minh",
    "ans": "B",
    "exp": "Chung một dòng sông ra mắt năm 1959 là bộ phim truyện đầu tiên của điện ảnh cách mạng Việt Nam, do Nguyễn Hồng Nghi và Phạm Hiếu Dân tức Phạm Kỳ Nam đạo diễn.",
    "tags": [
      "Điện ảnh",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b4-103",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Bộ phim kinh điển Cánh đồng hoang sản xuất năm 1979 giành Huy chương Vàng tại Liên hoan phim quốc tế Moscow năm 1981 do ai làm đạo diễn và ai viết kịch bản?",
    "a": "Đạo diễn Hải Ninh, biên kịch Hoàng Tích Chỉ",
    "b": "Đạo diễn Đặng Nhật Minh, biên kịch Nguyễn Mạnh Tuấn",
    "c": "Đạo diễn Hồng Sến, biên kịch Nguyễn Quang Sáng",
    "d": "Đạo diễn Phạm Văn Khoa, biên kịch Ngô Tất Tố",
    "ans": "C",
    "exp": "Cánh đồng hoang năm 1979 do NSND Hồng Sến đạo diễn, nhà văn Nguyễn Quang Sáng viết kịch bản và nhạc sĩ Trịnh Công Sơn viết nhạc phim.",
    "tags": [
      "Điện ảnh",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b4-104",
    "cat": "cat-ent",
    "diff": "HARD",
    "q": "Bộ phim Bao giờ cho đến tháng Mười sản xuất năm 1984 được kênh CNN bầu chọn vào nhóm những bộ phim châu Á xuất sắc nhất mọi thời đại là tác phẩm của đạo diễn nào?",
    "a": "Hải Ninh",
    "b": "Vương Hồng Sến",
    "c": "Bạch Diệp",
    "d": "Đặng Nhật Minh",
    "ans": "D",
    "exp": "Bao giờ cho đến tháng Mười do NSND Đặng Nhật Minh viết kịch bản và đạo diễn năm 1984 với diễn xuất kinh điển của NSƯT Lê Vân trong vai Duyên.",
    "tags": [
      "Điện ảnh",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b4-105",
    "cat": "cat-ent",
    "diff": "MEDIUM",
    "q": "Trong bộ phim kinh điển Em bé Hà Nội sản xuất năm 1974 của đạo diễn Hải Ninh, nữ diễn viên nào đã thủ vai cô bé Ngọc Hà đi tìm cha giữa phố Khâm Thiên đổ nát?",
    "a": "Lan Hương",
    "b": "Trà Giang",
    "c": "Như Quỳnh",
    "d": "Phương Thanh",
    "ans": "A",
    "exp": "NSND Lan Hương khi mới 10 tuổi đã hóa thân xuất sắc vào vai cô bé Ngọc Hà ôm đàn violin trong bộ phim Em bé Hà Nội năm 1974.",
    "tags": [
      "Điện ảnh",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b5-001",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Loại gia vị nào tạo nên hương vị cay nồng đặc trưng của món thắng cố truyền thống vùng Tây Bắc Việt Nam?",
    "a": "Hạt mắc khén và thảo quả",
    "b": "Hạt tiêu đen và quế chi",
    "c": "Ớt hiểm và sả tươi",
    "d": "Gừng gió và nghệ vàng",
    "ans": "A",
    "exp": "Thắng cố Tây Bắc sử dụng nhiều loại gia vị núi rừng, trong đó hạt mắc khén và thảo quả đóng vai trò chủ đạo tạo mùi thơm đặc trưng.",
    "tags": [
      "Ẩm thực",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b5-002",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Món súp lạnh Gazpacho nổi tiếng có nguồn gốc từ vùng Andalusia thuộc quốc gia nào?",
    "a": "Ý",
    "b": "Tây Ban Nha",
    "c": "Bồ Đào Nha",
    "d": "Mexico",
    "ans": "B",
    "exp": "Gazpacho là món súp lạnh làm từ cà chua và rau củ xay nhuyễn, có xuất xứ từ vùng Andalusia ở miền nam Tây Ban Nha.",
    "tags": [
      "Ẩm thực",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b5-003",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Trong kỹ thuật nấu ăn Pháp, hỗn hợp Mirepoix truyền thống bao gồm ba nguyên liệu thái hạt lựu theo tỷ lệ 2:1:1 là gì?",
    "a": "Cà chua, hành tây và ớt chuông",
    "b": "Hành tím, tỏi tây và củ cải trắng",
    "c": "Hành tây, cà rốt và cần tây",
    "d": "Khoai tây, cà rốt và hành lá",
    "ans": "C",
    "exp": "Mirepoix là nền tảng tạo hương vị trong ẩm thực Pháp, gồm 2 phần hành tây, 1 phần cà rốt và 1 phần cần tây.",
    "tags": [
      "Ẩm thực",
      "Kỹ thuật chế biến"
    ]
  },
  {
    "id": "q-mh500-b5-004",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Làng nghề truyền thống Đông Hồ nổi tiếng với dòng tranh dân gian khắc gỗ nằm ở tỉnh nào của Việt Nam?",
    "a": "Bắc Giang",
    "b": "Hưng Yên",
    "c": "Hải Dương",
    "d": "Bắc Ninh",
    "ans": "D",
    "exp": "Làng tranh Đông Hồ nằm bên bờ nam sông Đuống, thuộc xã Song Hồ, huyện Thuận Thành, tỉnh Bắc Ninh.",
    "tags": [
      "Văn hóa",
      "Làng nghề"
    ]
  },
  {
    "id": "q-mh500-b5-005",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Trong tranh dân gian Đông Hồ, màu trắng óng ánh trên giấy điệp được tạo ra từ nguyên liệu tự nhiên nào?",
    "a": "Vỏ sò điệp biển giã nhỏ trộn hồ nếp",
    "b": "Bột đá vôi nghiền mịn",
    "c": "Bột gạo nếp cái hoa vàng rang chín",
    "d": "Phấn trắng từ xương động vật nung",
    "ans": "A",
    "exp": "Giấy điệp Đông Hồ được làm từ giấy dó quét một lớp vỏ sò điệp nghiền nhỏ trộn với hồ bột gạo nếp, tạo sắc trắng lấp lánh tự nhiên.",
    "tags": [
      "Văn hóa",
      "Làng nghề"
    ]
  },
  {
    "id": "q-mh500-b5-006",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Lễ hội Gióng ở đền Phù Đổng và đền Sóc tưởng niệm vị thánh nào trong Tứ bất tử của tín ngưỡng dân gian Việt Nam?",
    "a": "Tản Viên Sơn Thánh",
    "b": "Phù Đổng Thiên Vương",
    "c": "Chử Đồng Tử",
    "d": "Mẫu Liễu Hạnh",
    "ans": "B",
    "exp": "Thánh Gióng có danh hiệu là Phù Đổng Thiên Vương, một trong Tứ bất tử của tín ngưỡng dân gian Việt Nam, tượng trưng cho tinh thần chống ngoại xâm.",
    "tags": [
      "Văn hóa",
      "Lễ hội"
    ]
  },
  {
    "id": "q-mh500-b5-007",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Loại hình nghệ thuật trình diễn dân gian nào của Việt Nam đã được UNESCO ghi danh là Di sản văn hóa phi vật thể đại diện của nhân loại vào năm 2017?",
    "a": "Đờn ca tài tử Nam Bộ",
    "b": "Dân ca Ví, Giặm Nghệ Tĩnh",
    "c": "Nghệ thuật Bài chòi Trung Bộ",
    "d": "Thực hành Then của người Tày, Nùng, Thái",
    "ans": "C",
    "exp": "Nghệ thuật Bài chòi Trung Bộ Việt Nam được UNESCO công nhận là Di sản văn hóa phi vật thể đại diện của nhân loại vào tháng 12 năm 2017.",
    "tags": [
      "Văn hóa",
      "Di sản"
    ]
  },
  {
    "id": "q-mh500-b5-008",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Câu nói nổi tiếng 'Tôi tư duy, vậy tôi tồn tại' là luận điểm nền tảng của nhà triết học phương Tây nào?",
    "a": "Immanuel Kant",
    "b": "Baruch Spinoza",
    "c": "John Locke",
    "d": "René Descartes",
    "ans": "D",
    "exp": "Cogito, ergo sum nghĩa là Tôi tư duy, vậy tôi tồn tại là mệnh đề triết học nổi tiếng của nhà triết học duy lý người Pháp René Descartes.",
    "tags": [
      "Triết học",
      "Phương Tây"
    ]
  },
  {
    "id": "q-mh500-b5-009",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Khái niệm 'Vô vi' trong triết học Đạo gia của Lão Tử mang ý nghĩa cốt lõi là gì?",
    "a": "Hành động thuận theo quy luật tự nhiên, không cưỡng cầu hay làm trái bản chất",
    "b": "Không làm bất cứ việc gì và từ bỏ cuộc sống trần tục",
    "c": "Dùng hình phạt nghiêm khắc để quản lý xã hội ổn định",
    "d": "Tập trung tu luyện lễ nhạc để phân định thứ bậc xã hội",
    "ans": "A",
    "exp": "Trong Đạo Đức Kinh, Vô vi không có nghĩa là bất động mà là sống và hành xử thuận theo lẽ tự nhiên, không gượng ép hay can thiệp thô bạo.",
    "tags": [
      "Triết học",
      "Phương Đông"
    ]
  },
  {
    "id": "q-mh500-b5-010",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Trong thần thoại Hy Lạp, vị thần nào đã đánh cắp ngọn lửa từ đỉnh Olympus đem xuống cho loài người và bị xiềng trên núi Caucasus?",
    "a": "Hephaestus",
    "b": "Prometheus",
    "c": "Hermes",
    "d": "Atlas",
    "ans": "B",
    "exp": "Titan Prometheus vì thương loài người nên đã đánh cắp lửa của các vị thần trao cho nhân loại, dẫn đến hình phạt bị Zeus xiềng trên núi đá.",
    "tags": [
      "Thần thoại",
      "Hy Lạp"
    ]
  },
  {
    "id": "q-mh500-b5-011",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Trong thần thoại Bắc Âu, cây tần bì khổng lồ nối liền chín thế giới trong vũ trụ có tên là gì?",
    "a": "Bifrost",
    "b": "Valhalla",
    "c": "Yggdrasil",
    "d": "Midgard",
    "ans": "C",
    "exp": "Yggdrasil là cây thế giới khổng lồ bằng gỗ tần bì, nâng đỡ và kết nối chín cõi giới trong vũ trụ quan thần thoại Bắc Âu.",
    "tags": [
      "Thần thoại",
      "Bắc Âu"
    ]
  },
  {
    "id": "q-mh500-b5-012",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Trong thần thoại Ai Cập cổ đại, vị thần đầu chó rừng giữ vai trò dẫn dắt linh hồn và cân trái tim người chết là ai?",
    "a": "Horus",
    "b": "Thoth",
    "c": "Osiris",
    "d": "Anubis",
    "ans": "D",
    "exp": "Anubis là vị thần mang hình dáng đầu chó rừng, gắn liền với nghệ thuật ướp xác và nghi lễ cân trái tim phán xét linh hồn người chết.",
    "tags": [
      "Thần thoại",
      "Ai Cập"
    ]
  },
  {
    "id": "q-mh500-b5-013",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Tòa án Công lý Quốc tế, cơ quan tư pháp chính của Liên Hợp Quốc, đặt trụ sở tại thành phố nào?",
    "a": "The Hague, Hà Lan",
    "b": "New York, Hoa Kỳ",
    "c": "Geneva, Thụy Sĩ",
    "d": "Vienna, Áo",
    "ans": "A",
    "exp": "Tòa án Công lý Quốc tế đặt trụ sở tại Cung điện Hòa bình ở thành phố The Hague thuộc Hà Lan, là cơ quan chính duy nhất của Liên Hợp Quốc nằm ngoài New York.",
    "tags": [
      "Xã hội",
      "Tổ chức quốc tế"
    ]
  },
  {
    "id": "q-mh500-b5-014",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Theo Bộ luật Dân sự Việt Nam hiện hành, độ tuổi tối thiểu để một cá nhân có năng lực hành vi dân sự đầy đủ là bao nhiêu tuổi?",
    "a": "Đủ 16 tuổi",
    "b": "Đủ 18 tuổi",
    "c": "Đủ 20 tuổi",
    "d": "Đủ 21 tuổi",
    "ans": "B",
    "exp": "Theo Điều 19 và Điều 20 Bộ luật Dân sự 2015, người thành niên là người từ đủ 18 tuổi trở lên và có năng lực hành vi dân sự đầy đủ, trừ trường hợp pháp luật quy định khác.",
    "tags": [
      "Xã hội",
      "Luật pháp"
    ]
  },
  {
    "id": "q-mh500-b5-015",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Món bún bò Huế chuẩn vị truyền thống không thể thiếu loại gia vị tạo mùi đặc trưng nào sau đây?",
    "a": "Mắm tôm Bắc",
    "b": "Tương bần và gừng",
    "c": "Mắm ruốc Huế và sả",
    "d": "Mẻ chua và riềng",
    "ans": "C",
    "exp": "Nước dùng bún bò Huế có hương vị đặc trưng nhờ sự kết hợp giữa mắm ruốc Huế pha loãng lấy nước trong và hương thơm nồng của sả cây.",
    "tags": [
      "Ẩm thực",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b5-016",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Loại nấm đắt đỏ bậc nhất thế giới thường mọc ngầm dưới rễ cây sồi và được tìm kiếm bằng chó săn hoặc lợn đánh hơi có tên là gì?",
    "a": "Nấm Matsutake",
    "b": "Nấm Chanterelle",
    "c": "Nấm Morel",
    "d": "Nấm Truffle",
    "ans": "D",
    "exp": "Nấm Truffle mọc sâu dưới lòng đất gần rễ cây sồi, cây phỉ và tỏa mùi hương đặc trưng, thường được thu hoạch nhờ khứu giác nhạy bén của chó săn.",
    "tags": [
      "Ẩm thực",
      "Nguyên liệu"
    ]
  },
  {
    "id": "q-mh500-b5-017",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Phản ứng hóa học giữa axit amin và đường khử khi chế biến thực phẩm ở nhiệt độ cao tạo ra màu nâu vàng và hương thơm hấp dẫn được gọi là gì?",
    "a": "Phản ứng Maillard",
    "b": "Phản ứng lên men lactic",
    "c": "Phản ứng thủy phân tinh bột",
    "d": "Phản ứng nhũ tương hóa",
    "ans": "A",
    "exp": "Phản ứng Maillard là phản ứng hóa học giữa axit amin và đường khử dưới tác dụng của nhiệt, tạo ra màu nâu và hương vị đặc trưng cho thịt nướng, bánh mì nướng hay cà phê rang.",
    "tags": [
      "Ẩm thực",
      "Kỹ thuật chế biến"
    ]
  },
  {
    "id": "q-mh500-b5-018",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Làng gốm Bầu Trúc, một trong những làng gốm cổ nhất Đông Nam Á còn giữ kỹ thuật nặn tay không dùng bàn xoay, thuộc dân tộc nào?",
    "a": "Dân tộc Khmer",
    "b": "Dân tộc Chăm",
    "c": "Dân tộc Ê Đê",
    "d": "Dân tộc Cơ Tu",
    "ans": "B",
    "exp": "Làng gốm Bầu Trúc ở Ninh Thuận là làng nghề truyền thống của người Chăm, nổi tiếng với kỹ thuật làm gốm hoàn toàn bằng tay và nung lộ thiên.",
    "tags": [
      "Văn hóa",
      "Làng nghề"
    ]
  },
  {
    "id": "q-mh500-b5-019",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Tác phẩm triết học 'Cộng hòa' bàn về công lý và mô hình nhà nước lý tưởng do các triết gia cai trị là của học giả Hy Lạp cổ đại nào?",
    "a": "Socrates",
    "b": "Aristotle",
    "c": "Plato",
    "d": "Epicurus",
    "ans": "C",
    "exp": "Cộng hòa là tác phẩm đối thoại triết học nổi tiếng của Plato, trong đó ông trình bày quan điểm về công lý, ẩn dụ cái hang và mô hình triết gia vương.",
    "tags": [
      "Triết học",
      "Phương Tây"
    ]
  },
  {
    "id": "q-mh500-b5-020",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Trong Nho giáo, 'Ngũ thường' là năm phẩm chất đạo đức cốt lõi của người quân tử bao gồm những gì?",
    "a": "Kim, Mộc, Thủy, Hỏa, Thổ",
    "b": "Công, Dung, Ngôn, Hạnh, Hiếu",
    "c": "Phú, Quý, Thọ, Khang, Ninh",
    "d": "Nhân, Nghĩa, Lễ, Trí, Tín",
    "ans": "D",
    "exp": "Ngũ thường trong triết học Nho giáo gồm Nhân, Nghĩa, Lễ, Trí, Tín, là năm chuẩn mực đạo đức căn bản để tu dưỡng bản thân.",
    "tags": [
      "Triết học",
      "Phương Đông"
    ]
  },
  {
    "id": "q-mh500-b5-021",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Món cơm trộn truyền thống của Hàn Quốc gồm cơm trắng, nhiều loại rau củ xào, thịt bò, tương ớt Gochujang và trứng ốp la được gọi là gì?",
    "a": "Bibimbap",
    "b": "Bulgogi",
    "c": "Tteokbokki",
    "d": "Samgyeopsal",
    "ans": "A",
    "exp": "Bibimbap trong tiếng Hàn có nghĩa là cơm trộn, một món ăn tiêu biểu kết hợp hài hòa màu sắc và dinh dưỡng của ẩm thực Hàn Quốc.",
    "tags": [
      "Ẩm thực",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b5-022",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Đặc sản chả mực Hạ Long trứ danh của tỉnh Quảng Ninh bắt buộc phải sử dụng phương pháp chế biến nào để tạo độ giòn sần sật chuẩn vị?",
    "a": "Xay nhuyễn bằng máy tốc độ cao cùng đá lạnh",
    "b": "Giã tay thủ công trong cối đá từ mực nang tươi",
    "c": "Quết bằng máy trộn bột công nghiệp với bột nở",
    "d": "Băm nhỏ bằng dao rồi trộn với bì lợn thái sợi",
    "ans": "B",
    "exp": "Chả mực Hạ Long chuẩn vị được làm từ mực nang tươi đánh bắt ở vịnh Bắc Bộ và phải giã tay bằng cối đá để giữ kết cấu giòn dai tự nhiên.",
    "tags": [
      "Ẩm thực",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b5-023",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Trong kỹ thuật nấu ăn hiện đại, phương pháp 'Sous-vide' có đặc điểm cốt lõi là gì?",
    "a": "Nướng thực phẩm nhanh trên than hồng ở nhiệt độ cực cao",
    "b": "Chiên ngập dầu hai lần để tạo lớp vỏ giòn rụm",
    "c": "Làm chín thực phẩm trong túi hút chân không ở nhiệt độ thấp được kiểm soát chính xác",
    "d": "Làm đông lạnh tức thời thực phẩm bằng nitơ lỏng",
    "ans": "C",
    "exp": "Sous-vide tiếng Pháp nghĩa là dưới chân không, là phương pháp đặt thực phẩm vào túi hút chân không rồi nấu trong bể nước ổn nhiệt ở nhiệt độ thấp trong thời gian dài.",
    "tags": [
      "Ẩm thực",
      "Kỹ thuật chế biến"
    ]
  },
  {
    "id": "q-mh500-b5-024",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Lễ hội Katê là lễ hội dân gian truyền thống lớn nhất trong năm của đồng bào dân tộc nào tại Việt Nam?",
    "a": "Dân tộc Thái ở Điện Biên",
    "b": "Dân tộc Khmer Nam Bộ",
    "c": "Dân tộc Mường ở Hòa Bình",
    "d": "Dân tộc Chăm theo đạo Bà La Môn",
    "ans": "D",
    "exp": "Lễ hội Katê được tổ chức vào đầu tháng 7 lịch Chăm tại các đền tháp cổ ở Ninh Thuận và Bình Thuận để tưởng nhớ các vị thần và tổ tiên của người Chăm Bà La Môn.",
    "tags": [
      "Văn hóa",
      "Lễ hội"
    ]
  },
  {
    "id": "q-mh500-b5-025",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Trong thần thoại Việt Nam, vị thần khổng lồ nào đã đào sông, đắp núi, dựng cột chống trời để tách trời và đất ra xa nhau?",
    "a": "Thần Trụ Trời",
    "b": "Sơn Tinh",
    "c": "Lạc Long Quân",
    "d": "Chử Đồng Tử",
    "ans": "A",
    "exp": "Thần Trụ Trời là nhân vật thần thoại mở đầu cho hệ thống thần thoại suy nguyên của người Việt, giải thích sự hình thành trời đất và núi sông.",
    "tags": [
      "Thần thoại",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b5-026",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Trong thần thoại Hy Lạp, con quái vật canh giữ lối vào địa ngục Hades có hình dáng là một con chó ba đầu mang tên gì?",
    "a": "Chimera",
    "b": "Cerberus",
    "c": "Hydra",
    "d": "Minotaur",
    "ans": "B",
    "exp": "Cerberus là con chó săn ba đầu canh giữ cổng địa ngục Hades, ngăn người chết trốn thoát và người sống xâm nhập.",
    "tags": [
      "Thần thoại",
      "Hy Lạp"
    ]
  },
  {
    "id": "q-mh500-b5-027",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Trong triết học phương Đông, học thuyết 'Nhân quả' và 'Tứ diệu đế' là giáo lý nền tảng của tôn giáo - triết học nào?",
    "a": "Mặc gia",
    "b": "Pháp gia",
    "c": "Phật giáo",
    "d": "Thần đạo",
    "ans": "C",
    "exp": "Tứ diệu đế gồm Khổ đế, Tập đế, Diệt đế và Đạo đế cùng quy luật Nhân quả - Duyên khởi là nền tảng cốt lõi của triết học Phật giáo.",
    "tags": [
      "Triết học",
      "Phương Đông"
    ]
  },
  {
    "id": "q-mh500-b5-028",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Tổ chức Giáo dục, Khoa học và Văn hóa của Liên Hợp Quốc viết tắt là UNESCO có trụ sở chính đặt tại thành phố nào?",
    "a": "London, Anh",
    "b": "Brussels, Bỉ",
    "c": "Rome, Ý",
    "d": "Paris, Pháp",
    "ans": "D",
    "exp": "Trụ sở chính của UNESCO được đặt tại quảng trường Fontenoy ở thủ đô Paris, Cộng hòa Pháp.",
    "tags": [
      "Xã hội",
      "Tổ chức quốc tế"
    ]
  },
  {
    "id": "q-mh500-b5-029",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Món Cao lầu với sợi mì màu vàng dai giòn, ăn kèm thịt xá xíu và tóp mỡ chiên giòn là đặc sản trứ danh của đô thị cổ nào?",
    "a": "Phố cổ Hội An",
    "b": "Cố đô Huế",
    "c": "Phố cổ Hà Nội",
    "d": "Thành cổ Quảng Trị",
    "ans": "A",
    "exp": "Cao lầu là món ăn đặc sản gắn liền với phố cổ Hội An, tỉnh Quảng Nam, nổi tiếng với quy trình làm sợi mì công phu từ tro củi tràm và nước giếng Bá Lễ.",
    "tags": [
      "Ẩm thực",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b5-030",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Loại gia vị đắt đỏ nhất thế giới tính theo trọng lượng, được thu hoạch thủ công từ nhụy của một loài hoa nghệ tây, có tên quốc tế là gì?",
    "a": "Cardamom",
    "b": "Saffron",
    "c": "Vanilla",
    "d": "Turmeric",
    "ans": "B",
    "exp": "Saffron là nhụy hoa nghệ tây khô, được mệnh danh là vàng đỏ trong ẩm thực vì cần hàng trăm nghìn bông hoa mới thu được một kilôgam sợi khô.",
    "tags": [
      "Ẩm thực",
      "Nguyên liệu"
    ]
  },
  {
    "id": "q-mh500-b5-031",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Làng lụa Vạn Phúc có lịch sử hơn một nghìn năm dệt lụa tơ tằm truyền thống hiện nay thuộc địa bàn quận nào của Hà Nội?",
    "a": "Quận Long Biên",
    "b": "Quận Tây Hồ",
    "c": "Quận Hà Đông",
    "d": "Quận Bắc Từ Liêm",
    "ans": "C",
    "exp": "Làng lụa Vạn Phúc hay lụa Hà Đông nằm bên bờ sông Nhuệ, thuộc phường Vạn Phúc, quận Hà Đông, thành phố Hà Nội.",
    "tags": [
      "Văn hóa",
      "Làng nghề"
    ]
  },
  {
    "id": "q-mh500-b5-032",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Trong triết học hiện sinh thế kỷ 20, luận điểm 'Tồn tại có trước bản chất' gắn liền với tên tuổi của nhà triết học người Pháp nào?",
    "a": "Michel Foucault",
    "b": "Montesquieu",
    "c": "Auguste Comte",
    "d": "Jean-Paul Sartre",
    "ans": "D",
    "exp": "Jean-Paul Sartre là đại diện tiêu biểu của chủ nghĩa hiện sinh với mệnh đề Tồn tại có trước bản chất, khẳng định con người tự định nghĩa mình qua lựa chọn và hành động.",
    "tags": [
      "Triết học",
      "Phương Tây"
    ]
  },
  {
    "id": "q-mh500-b5-033",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Trong thần thoại Bắc Âu, sự kiện tận thế khi các vị thần giao chiến quyết liệt dẫn đến sự sụp đổ và tái sinh của thế giới được gọi là gì?",
    "a": "Ragnarok",
    "b": "Armageddon",
    "c": "Titanomachy",
    "d": "Valhalla",
    "ans": "A",
    "exp": "Ragnarok nghĩa là Hoàng hôn của các vị thần, là chuỗi sự kiện tận thế trong thần thoại Bắc Âu khi Odin, Thor, Loki và các quái vật tử chiến.",
    "tags": [
      "Thần thoại",
      "Bắc Âu"
    ]
  },
  {
    "id": "q-mh500-b5-034",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Cơ quan nào của Liên Hợp Quốc chịu trách nhiệm chính trong việc duy trì hòa bình và an ninh quốc tế, gồm 5 ủy viên thường trực có quyền phủ quyết?",
    "a": "Đại hội đồng Liên Hợp Quốc",
    "b": "Hội đồng Bảo an Liên Hợp Quốc",
    "c": "Hội đồng Kinh tế và Xã hội",
    "d": "Ban Thư ký Liên Hợp Quốc",
    "ans": "B",
    "exp": "Hội đồng Bảo an Liên Hợp Quốc gồm 15 thành viên, trong đó có 5 ủy viên thường trực là Mỹ, Nga, Trung Quốc, Anh, Pháp nắm quyền phủ quyết.",
    "tags": [
      "Xã hội",
      "Tổ chức quốc tế"
    ]
  },
  {
    "id": "q-mh500-b5-035",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Theo Hiến pháp nước Cộng hòa xã hội chủ nghĩa Việt Nam năm 2013, cơ quan nào là cơ quan thực hiện quyền lập hiến và quyền lập pháp?",
    "a": "Chính phủ",
    "b": "Tòa án nhân dân tối cao",
    "c": "Quốc hội",
    "d": "Viện kiểm sát nhân dân tối cao",
    "ans": "C",
    "exp": "Theo Điều 69 Hiến pháp 2013, Quốc hội là cơ quan đại biểu cao nhất của Nhân dân, cơ quan quyền lực nhà nước cao nhất và thực hiện quyền lập hiến, quyền lập pháp.",
    "tags": [
      "Xã hội",
      "Luật pháp"
    ]
  },
  {
    "id": "q-mh500-b5-036",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Món bánh Pía nổi tiếng với lớp vỏ ngàn lớp mềm dẻo và nhân đậu xanh sầu riêng trứng muối là đặc sản của tỉnh nào ở miền Tây Nam Bộ?",
    "a": "Đồng Tháp",
    "b": "Cà Mau",
    "c": "An Giang",
    "d": "Sóc Trăng",
    "ans": "D",
    "exp": "Bánh Pía Sóc Trăng, đặc biệt là vùng Vũng Thơm, có nguồn gốc từ bánh trung thu Triều Châu của người Hoa di cư và trở thành đặc sản trứ danh của Sóc Trăng.",
    "tags": [
      "Ẩm thực",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b5-037",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Loại phô mai nổi tiếng dùng để làm bánh Tiramisu truyền thống của Ý có kết cấu kem mịn và vị béo ngậy là loại nào?",
    "a": "Mascarpone",
    "b": "Mozzarella",
    "c": "Parmigiano-Reggiano",
    "d": "Gorgonzola",
    "ans": "A",
    "exp": "Mascarpone là loại phô mai tươi dạng kem vùng Lombardy của Ý, là nguyên liệu bắt buộc để tạo lớp kem béo mịn đặc trưng cho bánh Tiramisu.",
    "tags": [
      "Ẩm thực",
      "Thế giới"
    ]
  },
  {
    "id": "q-mh500-b5-038",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Trong chế biến ẩm thực, kỹ thuật 'Blanching' hay chần sơ thực phẩm trong nước sôi rồi ngâm ngay vào nước đá có tác dụng chính là gì?",
    "a": "Làm thực phẩm chín nhừ hoàn toàn để nấu súp",
    "b": "Bất hoạt enzyme làm mất màu, giúp rau củ giữ màu xanh tươi và độ giòn",
    "c": "Tăng hàm lượng đường tự nhiên trong rau củ",
    "d": "Loại bỏ hoàn toàn chất xơ trong thực phẩm",
    "ans": "B",
    "exp": "Sốc nhiệt bằng nước sôi rồi ngâm nước đá lạnh giúp ngừng quá trình chín tiếp và khóa màu xanh diệp lục, giữ độ giòn cho rau củ.",
    "tags": [
      "Ẩm thực",
      "Kỹ thuật chế biến"
    ]
  },
  {
    "id": "q-mh500-b5-039",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Làng nghề đúc đồng Đại Bái với lịch sử gần một thiên niên kỷ từ thời Lý thuộc huyện nào của tỉnh Bắc Ninh?",
    "a": "Huyện Yên Phong",
    "b": "Huyện Tiên Du",
    "c": "Huyện Gia Bình",
    "d": "Huyện Quế Võ",
    "ans": "C",
    "exp": "Làng nghề đúc đồng truyền thống Đại Bái thuộc xã Đại Bái, huyện Gia Bình, tỉnh Bắc Ninh, thờ ông tổ nghề là Nguyễn Công Truyền.",
    "tags": [
      "Văn hóa",
      "Làng nghề"
    ]
  },
  {
    "id": "q-mh500-b5-040",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Không gian văn hóa Cồng chiêng Tây Nguyên được UNESCO công nhận là Kiệt tác truyền khẩu và phi vật thể nhân loại trải rộng trên mấy tỉnh Tây Nguyên?",
    "a": "3 tỉnh",
    "b": "4 tỉnh",
    "c": "6 tỉnh",
    "d": "5 tỉnh",
    "ans": "D",
    "exp": "Không gian văn hóa Cồng chiêng Tây Nguyên trải rộng trên cả 5 tỉnh Tây Nguyên gồm Kon Tum, Gia Lai, Đắk Lắk, Đắk Nông và Lâm Đồng.",
    "tags": [
      "Văn hóa",
      "Di sản"
    ]
  },
  {
    "id": "q-mh500-b5-041",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Trường phái triết học 'Pháp gia' thời Tiên Tần ở Trung Quốc cổ đại với đại diện tiêu biểu là Hàn Phi Tử chủ trương điều gì trong việc trị nước?",
    "a": "Kết hợp chặt chẽ ba yếu tố Pháp, Thuật và Thế của bậc quân vương",
    "b": "Dùng đức trị và lễ nghĩa để cảm hóa bách tính",
    "c": "Xóa bỏ mọi luật lệ để người dân tự quản lý trong các công xã nhỏ",
    "d": "Đề cao tình yêu thương phổ quát không phân biệt thân sơ",
    "ans": "A",
    "exp": "Hàn Phi Tử tổng hợp tư tưởng Pháp gia, chủ trương trị nước bằng Pháp tức luật pháp minh bạch, Thuật tức phương pháp cai trị và Thế tức uy quyền của nhà vua.",
    "tags": [
      "Triết học",
      "Phương Đông"
    ]
  },
  {
    "id": "q-mh500-b5-042",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Nhà triết học cổ điển Đức nào là tác giả của bộ ba tác phẩm 'Phê phán lý tính thuần túy', 'Phê phán lý tính thực hành' và 'Phê phán năng lực phán đoán'?",
    "a": "Georg Wilhelm Friedrich Hegel",
    "b": "Immanuel Kant",
    "c": "Arthur Schopenhauer",
    "d": "Friedrich Nietzsche",
    "ans": "B",
    "exp": "Immanuel Kant là người sáng lập triết học cổ điển Đức với ba cuốn Phê phán nổi tiếng đặt nền móng cho nhận thức luận, đạo đức học và mỹ học hiện đại.",
    "tags": [
      "Triết học",
      "Phương Tây"
    ]
  },
  {
    "id": "q-mh500-b5-043",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Trong thần thoại Ai Cập cổ đại, vị thần tối cao đại diện cho Mặt Trời, thường được miêu tả với đầu chim ưng và đĩa mặt trời trên đỉnh đầu, có tên là gì?",
    "a": "Sobek",
    "b": "Set",
    "c": "Ra",
    "d": "Apophis",
    "ans": "C",
    "exp": "Thần Ra là vị thần Mặt Trời tối cao trong thần thoại Ai Cập, mỗi ngày chèo thuyền đi qua bầu trời và ban đêm đi qua thế giới ngầm.",
    "tags": [
      "Thần thoại",
      "Ai Cập"
    ]
  },
  {
    "id": "q-mh500-b5-044",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Hiệp hội các quốc gia Đông Nam Á viết tắt là ASEAN được thành lập vào ngày 8 tháng 8 năm 1967 tại thành phố nào?",
    "a": "Jakarta, Indonesia",
    "b": "Kuala Lumpur, Malaysia",
    "c": "Manila, Philippines",
    "d": "Bangkok, Thái Lan",
    "ans": "D",
    "exp": "ASEAN được thành lập ngày 8/8/1967 thông qua Tuyên bố Bangkok ký tại thủ đô Bangkok của Thái Lan bởi 5 quốc gia sáng lập.",
    "tags": [
      "Xã hội",
      "Tổ chức quốc tế"
    ]
  },
  {
    "id": "q-mh500-b5-045",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Trong nguyên tắc tố tụng hình sự hiện đại và pháp luật Việt Nam, nguyên tắc 'Suy đoán vô tội' quy định nghĩa vụ chứng minh tội phạm thuộc về ai?",
    "a": "Cơ quan có thẩm quyền tiến hành tố tụng",
    "b": "Người bị buộc tội phải tự chứng minh mình vô tội",
    "c": "Luật sư bào chữa của bị cáo",
    "d": "Hội thẩm nhân dân tại phiên tòa",
    "ans": "A",
    "exp": "Theo nguyên tắc suy đoán vô tội tại Điều 13 Bộ luật Tố tụng hình sự 2015, trách nhiệm chứng minh tội phạm thuộc về cơ quan có thẩm quyền tiến hành tố tụng; người bị buộc tội có quyền nhưng không buộc phải chứng minh là mình vô tội.",
    "tags": [
      "Xã hội",
      "Luật pháp"
    ]
  },
  {
    "id": "q-mh500-b5-046",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Món gỏi cá trích cuốn bánh tráng rau rừng chấm nước mắm đậu phộng là đặc sản nổi tiếng nhất của hòn đảo nào tại Việt Nam?",
    "a": "Đảo Cát Bà",
    "b": "Đảo Phú Quốc",
    "c": "Đảo Cồn Cỏ",
    "d": "Đảo Bạch Long Vĩ",
    "ans": "B",
    "exp": "Gỏi cá trích tươi phi lê trộn dừa nạo, hành tây ăn kèm rau rừng và nước chấm chua ngọt là đặc sản tiêu biểu của đảo ngọc Phú Quốc, tỉnh Kiên Giang.",
    "tags": [
      "Ẩm thực",
      "Việt Nam"
    ]
  },
  {
    "id": "q-mh500-b5-047",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Trong ẩm thực Nhật Bản, thuật ngữ 'Umami' chỉ vị cơ bản thứ năm bên cạnh chua, cay, mặn, ngọt được nhà hóa học Kikunae Ikeda phát hiện vào năm 1908 từ hợp chất nào trong tảo bẹ Kombu?",
    "a": "Axit citric",
    "b": "Fructose",
    "c": "Glutamate",
    "d": "Capsaicin",
    "ans": "C",
    "exp": "Giáo sư Kikunae Ikeda đã chiết xuất axit glutamic và muối glutamate từ nước dùng tảo bẹ Kombu, xác định đây là nguồn gốc của vị ngọt thịt Umami.",
    "tags": [
      "Ẩm thực",
      "Khoa học thực phẩm"
    ]
  },
  {
    "id": "q-mh500-b5-048",
    "cat": "cat-life",
    "diff": "MEDIUM",
    "q": "Làng nghề chằm nón bài thơ nổi tiếng với những chiếc nón lá thanh mảnh có hình ảnh và câu thơ ẩn hiện khi soi dưới ánh sáng thuộc địa phương nào?",
    "a": "Tỉnh Đồng Tháp",
    "b": "Tỉnh Quảng Bình",
    "c": "Tỉnh Nam Định",
    "d": "Tỉnh Thừa Thiên Huế",
    "ans": "D",
    "exp": "Nón bài thơ là biểu tượng thủ công truyền thống của xứ Huế, nổi bật với các làng nghề như Tây Hồ thuộc huyện Phú Vang, tỉnh Thừa Thiên Huế.",
    "tags": [
      "Văn hóa",
      "Làng nghề"
    ]
  },
  {
    "id": "q-mh500-b5-049",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Trong lễ hội Đền Hùng hàng năm tại Phú Thọ, hai lễ vật dâng cúng truyền thống gắn liền với truyền thuyết Lang Liêu thời Hùng Vương thứ sáu là gì?",
    "a": "Bánh chưng và bánh giầy",
    "b": "Bánh tét và bánh ít",
    "c": "Cốm làng Vòng và chuối tiêu",
    "d": "Xôi ngũ sắc và gà chín cựa",
    "ans": "A",
    "exp": "Bánh chưng tượng trưng cho Đất và bánh giầy tượng trưng cho Trời gắn với sự tích hoàng tử Lang Liêu dâng lễ vật lên Vua Hùng thứ sáu.",
    "tags": [
      "Văn hóa",
      "Lễ hội"
    ]
  },
  {
    "id": "q-mh500-b5-050",
    "cat": "cat-life",
    "diff": "HARD",
    "q": "Trong thần thoại Hy Lạp, nữ thần trí tuệ và chiến trận chính nghĩa Athena được sinh ra theo cách đặc biệt nào?",
    "a": "Sinh ra từ bọt biển ngoài khơi đảo Cyprus",
    "b": "Bước ra từ đỉnh đầu của thần tối cao Zeus với đầy đủ giáp trụ",
    "c": "Mọc lên từ giọt máu của thần Uranus rơi xuống đất mẹ Gaia",
    "d": "Được thần thợ rèn Hephaestus nặn từ đất sét và thổi hồn",
    "ans": "B",
    "exp": "Theo thần thoại Hy Lạp, sau khi Zeus nuốt nữ thần trí tuệ Metis, ông bị đau đầu dữ dội và khi Hephaestus bổ đầu Zeus ra thì Athena bước ra trong bộ giáp sáng ngời.",
    "tags": [
      "Thần thoại",
      "Hy Lạp"
    ]
  },
  {
    "id": "q-mh500-b5-056",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Tìm số tiếp theo trong dãy số quy luật sau: 2, 6, 12, 20, 30, 42, ...?",
    "a": "52",
    "b": "54",
    "c": "60",
    "d": "56",
    "ans": "D",
    "exp": "Quy luật dãy số là tích hai số tự nhiên liên tiếp: 1x2=2, 2x3=6, 3x4=12, 4x5=20, 5x6=30, 6x7=42. Số tiếp theo là 7x8 = 56.",
    "tags": [
      "Dãy số",
      "Logic"
    ]
  },
  {
    "id": "q-mh500-b5-057",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Tìm số còn thiếu ở vị trí dấu chấm hỏi trong dãy số sau: 3, 5, 9, 17, 33, 65, ...?",
    "a": "129",
    "b": "127",
    "c": "131",
    "d": "133",
    "ans": "A",
    "exp": "Hiệu giữa hai số liên tiếp lần lượt là 2, 4, 8, 16, 32. Hiệu tiếp theo là 64, do đó số cần tìm là 65 + 64 = 129.",
    "tags": [
      "Dãy số",
      "Logic"
    ]
  },
  {
    "id": "q-mh500-b5-058",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Cho dãy số quy luật: 1, 2, 6, 15, 31, 56, ... Số tiếp theo của dãy là bao nhiêu?",
    "a": "81",
    "b": "92",
    "c": "96",
    "d": "105",
    "ans": "B",
    "exp": "Hiệu giữa các số hạng liên tiếp là các số chính phương: 1, 4, 9, 16, 25. Hiệu tiếp theo là 6 bình phương bằng 36, vậy số tiếp theo là 56 + 36 = 92.",
    "tags": [
      "Dãy số",
      "Toán tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-059",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Một vòi nước thứ nhất chảy riêng đầy bể trong 6 giờ, vòi thứ hai chảy riêng đầy bể trong 12 giờ. Nếu mở cả hai vòi cùng lúc khi bể cạn thì sau bao lâu bể sẽ đầy?",
    "a": "3 giờ",
    "b": "4 giờ 30 phút",
    "c": "4 giờ",
    "d": "5 giờ",
    "ans": "C",
    "exp": "Trong 1 giờ, vòi một chảy được 1/6 bể, vòi hai chảy được 1/12 bể. Cả hai vòi chảy trong 1 giờ được 1/6 + 1/12 = 1/4 bể, vậy cần 4 giờ để đầy bể.",
    "tags": [
      "Toán công việc",
      "Tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-060",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Một chiếc tàu thủy chạy xuôi dòng từ bến A đến bến B mất 4 giờ và chạy ngược dòng từ B về A mất 6 giờ. Hỏi một cụm bèo trôi tự do theo dòng nước từ A đến B sẽ mất bao nhiêu giờ?",
    "a": "12 giờ",
    "b": "18 giờ",
    "c": "20 giờ",
    "d": "24 giờ",
    "ans": "D",
    "exp": "Mỗi giờ xuôi dòng đi được 1/4 quãng đường, ngược dòng đi được 1/6 quãng đường. Vận tốc dòng nước bằng một nửa hiệu hai vận tốc: (1/4 - 1/6) : 2 = 1/24 quãng đường mỗi giờ, nên bèo trôi mất 24 giờ.",
    "tags": [
      "Toán chuyển động",
      "Logic"
    ]
  },
  {
    "id": "q-mh500-b5-061",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Một cửa hàng tăng giá một chiếc áo thêm 20%, sau đó nhân dịp khuyến mãi lại giảm giá 20% trên mức giá mới. Hỏi giá bán sau khi giảm so với giá ban đầu thay đổi như thế nào?",
    "a": "Thấp hơn giá ban đầu 4%",
    "b": "Bằng đúng giá ban đầu",
    "c": "Cao hơn giá ban đầu 4%",
    "d": "Thấp hơn giá ban đầu 2%",
    "ans": "A",
    "exp": "Gọi giá ban đầu là 100. Tăng 20% lên 120. Giảm 20% của 120 là giảm 24, còn 96. Vậy giá cuối cùng thấp hơn giá ban đầu 4%.",
    "tags": [
      "Tỷ lệ phần trăm",
      "Toán tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-062",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Trong một buổi họp mặt có 12 người tham dự. Tất cả mọi người đều bắt tay nhau, mỗi cặp chỉ bắt tay đúng một lần. Hỏi có tất cả bao nhiêu cái bắt tay?",
    "a": "55 cái bắt tay",
    "b": "66 cái bắt tay",
    "c": "60 cái bắt tay",
    "d": "132 cái bắt tay",
    "ans": "B",
    "exp": "Số cái bắt tay giữa 12 người là tổ hợp chập 2 của 12 phần tử: 12 nhân 11 chia 2 bằng 66 cái bắt tay.",
    "tags": [
      "Tổ hợp",
      "Toán tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-063",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Một khối lập phương lớn bằng gỗ được sơn đỏ tất cả 6 mặt bên ngoài, sau đó được cắt đều thành 27 khối lập phương nhỏ bằng nhau. Hỏi có bao nhiêu khối lập phương nhỏ chỉ được sơn đúng 2 mặt?",
    "a": "6 khối",
    "b": "8 khối",
    "c": "12 khối",
    "d": "16 khối",
    "ans": "C",
    "exp": "Khối 3x3x3 có 27 khối nhỏ. Các khối sơn đúng 2 mặt nằm ở chính giữa của 12 cạnh khối lập phương lớn, mỗi cạnh có 1 khối nên tổng cộng có 12 khối.",
    "tags": [
      "Hình học không gian",
      "Tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-064",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Cũng với khối lập phương lớn sơn 6 mặt được cắt thành 64 khối lập phương nhỏ bằng nhau theo kích thước 4x4x4. Hỏi có bao nhiêu khối lập phương nhỏ không dính chút sơn nào ở cả 6 mặt?",
    "a": "4 khối",
    "b": "16 khối",
    "c": "12 khối",
    "d": "8 khối",
    "ans": "D",
    "exp": "Phần lõi bên trong không bị sơn của khối 4x4x4 là một khối lập phương kích thước (4-2)x(4-2)x(4-2) = 2x2x2 = 8 khối nhỏ.",
    "tags": [
      "Hình học không gian",
      "Tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-065",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Trong một ngăn kéo tối có 10 chiếc tất màu đen và 10 chiếc tất màu trắng có kiểu dáng hoàn toàn giống nhau. Hỏi phải lấy ngẫu nhiên ít nhất bao nhiêu chiếc tất để chắc chắn có được một đôi tất cùng màu?",
    "a": "3 chiếc",
    "b": "2 chiếc",
    "c": "11 chiếc",
    "d": "12 chiếc",
    "ans": "A",
    "exp": "Theo nguyên lý Dirichlet, vì chỉ có 2 màu tất là đen và trắng nên khi lấy ra 3 chiếc tất, chắc chắn có ít nhất 2 chiếc cùng một màu.",
    "tags": [
      "Suy luận logic",
      "Đố mẹo"
    ]
  },
  {
    "id": "q-mh500-b5-066",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Trong một hộp kín có 8 quả bóng đỏ, 6 quả bóng xanh và 4 quả bóng vàng. Không nhìn vào hộp, cần lấy ra ít nhất bao nhiêu quả bóng để chắc chắn có ít nhất 1 quả bóng màu vàng?",
    "a": "5 quả",
    "b": "15 quả",
    "c": "14 quả",
    "d": "9 quả",
    "ans": "B",
    "exp": "Trường hợp xấu nhất là lấy hết toàn bộ bóng đỏ và bóng xanh trước: 8 + 6 = 14 quả vẫn chưa có quả vàng nào. Vậy cần lấy ít nhất 14 + 1 = 15 quả để chắc chắn có bóng vàng.",
    "tags": [
      "Suy luận logic",
      "Tổ hợp"
    ]
  },
  {
    "id": "q-mh500-b5-067",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Nếu quy ước mật mã chữ cái theo thứ tự bảng chữ cái tiếng Anh: CAT = 24, DOG = 26, thì từ BIRD sẽ có giá trị bằng bao nhiêu?",
    "a": "31",
    "b": "35",
    "c": "33",
    "d": "37",
    "ans": "C",
    "exp": "Giá trị mỗi chữ cái theo vị trí trong bảng chữ cái tiếng Anh: C=3, A=1, T=20 tổng là 24; D=4, O=15, G=7 tổng là 26. Với BIRD: B=2, I=9, R=18, D=4, tổng là 2 + 9 + 18 + 4 = 33.",
    "tags": [
      "Mật mã",
      "Logic"
    ]
  },
  {
    "id": "q-mh500-b5-068",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Một đoàn tàu dài 200 mét chạy qua một cây cầu dài 400 mét với vận tốc không đổi là 54 km/h. Hỏi từ lúc đầu tàu bắt đầu lên cầu đến lúc toa cuối cùng rời khỏi cầu mất bao nhiêu giây?",
    "a": "26,6 giây",
    "b": "30 giây",
    "c": "45 giây",
    "d": "40 giây",
    "ans": "D",
    "exp": "Vận tốc 54 km/h đổi ra bằng 15 m/s. Tổng quãng đường tàu phải đi để qua hết cầu bằng chiều dài cầu cộng chiều dài tàu: 400 + 200 = 600 mét. Thời gian là 600 : 15 = 40 giây.",
    "tags": [
      "Toán chuyển động",
      "Tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-069",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Ba người thợ cùng làm một công việc thì mất 8 giờ sẽ xong. Hỏi nếu có 6 người thợ có cùng năng suất như vậy cùng làm thì sẽ hoàn thành công việc đó trong bao nhiêu giờ?",
    "a": "4 giờ",
    "b": "3 giờ",
    "c": "2 giờ",
    "d": "6 giờ",
    "ans": "A",
    "exp": "Số người thợ tăng gấp đôi từ 3 người lên 6 người và năng suất như nhau nên thời gian hoàn thành giảm đi một nửa: 8 : 2 = 4 giờ.",
    "tags": [
      "Toán công việc",
      "Tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-070",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Một con ốc sên bò lên một cái cột cao 10 mét. Ban ngày nó bò lên được 3 mét, nhưng ban đêm khi ngủ nó bị tụt xuống 2 mét. Hỏi nếu bắt đầu bò từ sáng ngày thứ nhất thì đến ngày thứ mấy ốc sên chạm tới đỉnh cột?",
    "a": "Ngày thứ 7",
    "b": "Ngày thứ 8",
    "c": "Ngày thứ 9",
    "d": "Ngày thứ 10",
    "ans": "B",
    "exp": "Mỗi ngày đêm ốc sên tiến lên được 3 - 2 = 1 mét. Sau 7 ngày đêm, ốc sên ở độ cao 7 mét. Sáng và chiều ngày thứ 8, nó bò thêm 3 mét nữa là chạm đúng đỉnh 10 mét mà không bị tụt xuống nữa.",
    "tags": [
      "Đố mẹo",
      "Tư duy logic"
    ]
  },
  {
    "id": "q-mh500-b5-071",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Hiện nay tuổi của bố gấp 4 lần tuổi của con. Biết rằng 5 năm trước tổng số tuổi của hai bố con là 35 tuổi. Hỏi hiện nay bố bao nhiêu tuổi?",
    "a": "32 tuổi",
    "b": "40 tuổi",
    "c": "36 tuổi",
    "d": "44 tuổi",
    "ans": "C",
    "exp": "Cách đây 5 năm tổng tuổi hai bố con là 35, vậy hiện nay mỗi người tăng 5 tuổi nên tổng số tuổi hiện nay là 35 + 10 = 45 tuổi. Tuổi bố gấp 4 lần tuổi con nên tuổi bố hiện nay là 45 : 5 x 4 = 36 tuổi.",
    "tags": [
      "Toán tư duy",
      "Logic"
    ]
  },
  {
    "id": "q-mh500-b5-072",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Gieo đồng thời hai con xúc xắc cân đối và đồng chất có 6 mặt. Xác suất để tổng số chấm xuất hiện trên hai mặt xúc xắc bằng 7 là bao nhiêu?",
    "a": "1 phần 12",
    "b": "7 phần 36",
    "c": "5 phần 36",
    "d": "1 phần 6",
    "ans": "D",
    "exp": "Không gian mẫu có 6 x 6 = 36 kết quả. Các cặp có tổng bằng 7 gồm 6 cặp là 1-6, 2-5, 3-4, 4-3, 5-2, 6-1. Xác suất là 6/36 rút gọn bằng 1 phần 6.",
    "tags": [
      "Xác suất",
      "Toán tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-073",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Tìm số tiếp theo trong dãy số đặc biệt sau: 2, 3, 5, 7, 11, 13, 17, 19, ...?",
    "a": "23",
    "b": "21",
    "c": "25",
    "d": "27",
    "ans": "A",
    "exp": "Đây là dãy các số nguyên tố liên tiếp tăng dần. Số nguyên tố tiếp theo ngay sau 19 là 23.",
    "tags": [
      "Dãy số",
      "Toán tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-074",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Bốn bạn An, Bình, Chi, Dũng xếp thành một hàng dọc. Biết rằng An đứng trước Bình, Chi đứng ngay sau An, còn Dũng không đứng cuối hàng. Hỏi ai là người đứng đầu hàng?",
    "a": "An",
    "b": "Dũng",
    "c": "Chi",
    "d": "Bình",
    "ans": "B",
    "exp": "Chi đứng ngay sau An và An đứng trước Bình nên thứ tự của 3 bạn này là An - Chi - Bình. Vì Dũng không đứng cuối hàng nên Dũng không thể đứng sau Bình, vậy Dũng phải đứng đầu hàng: Dũng - An - Chi - Bình.",
    "tags": [
      "Suy luận logic",
      "Tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-075",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Có 9 đồng xu bề ngoài giống hệt nhau, trong đó có 8 đồng xu thật nặng bằng nhau và 1 đồng xu giả nhẹ hơn một chút. Dùng một chiếc cân đĩa thăng bằng không có quả cân, cần ít nhất mấy lần cân để chắc chắn tìm ra đồng xu giả?",
    "a": "1 lần cân",
    "b": "3 lần cân",
    "c": "2 lần cân",
    "d": "4 lần cân",
    "ans": "C",
    "exp": "Chia 9 đồng xu thành 3 nhóm, mỗi nhóm 3 đồng. Lần cân 1 đặt 2 nhóm lên hai đĩa cân để xác định nhóm 3 đồng có chứa xu giả. Lần cân 2 lấy 2 đồng trong nhóm đó đặt lên hai đĩa cân sẽ xác định ngay đồng nhẹ hơn.",
    "tags": [
      "Suy luận logic",
      "Đố mẹo"
    ]
  },
  {
    "id": "q-mh500-b5-076",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Tìm số còn thiếu trong dãy số sau: 1, 4, 9, 16, 25, 36, 49, ...?",
    "a": "56",
    "b": "60",
    "c": "72",
    "d": "64",
    "ans": "D",
    "exp": "Đây là dãy số chính phương của các số tự nhiên liên tiếp từ 1 đến 7. Số tiếp theo là 8 bình phương bằng 64.",
    "tags": [
      "Dãy số",
      "Logic"
    ]
  },
  {
    "id": "q-mh500-b5-077",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Cho quy luật toán học đặc biệt: nếu 2 # 3 = 10, 7 # 2 = 63, 6 # 5 = 66, thì giá trị của 8 # 4 bằng bao nhiêu?",
    "a": "96",
    "b": "72",
    "c": "48",
    "d": "112",
    "ans": "A",
    "exp": "Quy luật phép toán a # b là lấy tổng của a và b nhân với a: (2+3)x2=10, (7+2)x7=63, (6+5)x6=66. Vậy 8 # 4 = (8+4) x 8 = 12 x 8 = 96.",
    "tags": [
      "Mật mã",
      "Toán tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-078",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Một chiếc đồng hồ treo tường cứ mỗi giờ lại chạy nhanh thêm 30 giây so với giờ chuẩn. Nếu chỉnh đồng hồ đúng chuẩn vào lúc 6 giờ sáng hôm nay thì đến 6 giờ sáng ngày mai đồng hồ sẽ chỉ mấy giờ?",
    "a": "6 giờ 6 phút sáng",
    "b": "6 giờ 12 phút sáng",
    "c": "6 giờ 10 phút sáng",
    "d": "6 giờ 15 phút sáng",
    "ans": "B",
    "exp": "Từ 6 giờ sáng hôm nay đến 6 giờ sáng ngày mai là 24 giờ. Mỗi giờ đồng hồ chạy nhanh 30 giây tức nửa phút, vậy sau 24 giờ nó chạy nhanh 24 x 0,5 = 12 phút, chỉ 6 giờ 12 phút sáng.",
    "tags": [
      "Toán tư duy",
      "Logic"
    ]
  },
  {
    "id": "q-mh500-b5-079",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Lúc 3 giờ 30 phút đúng, kim giờ và kim phút của một chiếc đồng hồ kim truyền thống tạo với nhau một góc nhỏ nhất bằng bao nhiêu độ?",
    "a": "60 độ",
    "b": "85 độ",
    "c": "75 độ",
    "d": "90 độ",
    "ans": "C",
    "exp": "Lúc 3 giờ 30 phút, kim phút chỉ đúng số 6 tức góc 180 độ tính từ số 12. Kim giờ đi được 3,5 giờ, mỗi giờ ứng với 30 độ nên ở góc 3,5 x 30 = 105 độ. Góc giữa hai kim là 180 - 105 = 75 độ.",
    "tags": [
      "Hình học",
      "Toán tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-080",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Trong một trang trại có cả gà và thỏ. Người ta đếm được tổng cộng có 35 cái đầu và 94 cái chân. Hỏi trong trang trại có bao nhiêu con thỏ?",
    "a": "10 con thỏ",
    "b": "23 con thỏ",
    "c": "15 con thỏ",
    "d": "12 con thỏ",
    "ans": "D",
    "exp": "Giả sử cả 35 con đều là gà thì tổng số chân là 35 x 2 = 70 chân. Số chân dôi ra là 94 - 70 = 24 chân. Vì mỗi con thỏ hơn gà 2 chân nên số thỏ là 24 : 2 = 12 con.",
    "tags": [
      "Toán tư duy",
      "Logic"
    ]
  },
  {
    "id": "q-mh500-b5-081",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Một hạt bèo thần kỳ thả vào mặt hồ, cứ sau mỗi ngày diện tích bèo lại nở rộng gấp đôi ngày hôm trước. Biết rằng đến hết ngày thứ 20 thì bèo phủ kín hoàn toàn mặt hồ. Hỏi nếu ban đầu thả cùng lúc 4 hạt bèo như vậy thì đến hết ngày thứ mấy bèo phủ kín mặt hồ?",
    "a": "Ngày thứ 18",
    "b": "Ngày thứ 16",
    "c": "Ngày thứ 5",
    "d": "Ngày thứ 19",
    "ans": "A",
    "exp": "Bắt đầu với 4 hạt bèo tương đương với diện tích của 1 hạt bèo sau 2 ngày phát triển vì 1 hạt sau ngày 1 thành 2, sau ngày 2 thành 4. Do đó thời gian rút ngắn đi 2 ngày: 20 - 2 = 18 ngày.",
    "tags": [
      "Đố mẹo",
      "Tư duy logic"
    ]
  },
  {
    "id": "q-mh500-b5-082",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Tìm số tiếp theo trong dãy số quy luật sau: 1, 3, 4, 7, 11, 18, 29, ...?",
    "a": "39",
    "b": "47",
    "c": "43",
    "d": "52",
    "ans": "B",
    "exp": "Đây là dãy số Lucas có quy luật giống dãy Fibonacci: mỗi số hạng kể từ số thứ ba bằng tổng của hai số hạng đứng liền trước nó. Vậy số tiếp theo là 18 + 29 = 47.",
    "tags": [
      "Dãy số",
      "Logic"
    ]
  },
  {
    "id": "q-mh500-b5-083",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Một người đi xe máy từ A đến B với vận tốc 40 km/h, sau đó quay ngay từ B về A trên cùng quãng đường đó với vận tốc 60 km/h. Hỏi vận tốc trung bình của người đó trên cả quãng đường đi và về là bao nhiêu?",
    "a": "52 km/h",
    "b": "50 km/h",
    "c": "48 km/h",
    "d": "45 km/h",
    "ans": "C",
    "exp": "Vận tốc trung bình bằng tổng quãng đường chia tổng thời gian, tức trung bình điều hòa của hai vận tốc: 2 x 40 x 60 : (40 + 60) = 4800 : 100 = 48 km/h.",
    "tags": [
      "Toán chuyển động",
      "Tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-084",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Từ các chữ số 1, 2, 3, 4 có thể lập được bao nhiêu số tự nhiên có 3 chữ số khác nhau đôi một?",
    "a": "12 số",
    "b": "18 số",
    "c": "64 số",
    "d": "24 số",
    "ans": "D",
    "exp": "Chữ số hàng trăm có 4 cách chọn, hàng chục có 3 cách chọn từ các chữ số còn lại, hàng đơn vị có 2 cách chọn. Tổng cộng có 4 x 3 x 2 = 24 số.",
    "tags": [
      "Tổ hợp",
      "Toán tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-085",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Từ các chữ số 0, 1, 2, 3, 4 có thể lập được bao nhiêu số tự nhiên chẵn có 3 chữ số khác nhau đôi một?",
    "a": "30 số",
    "b": "24 số",
    "c": "36 số",
    "d": "48 số",
    "ans": "A",
    "exp": "Trường hợp 1: tận cùng là 0 thì hàng trăm có 4 cách, hàng chục có 3 cách, được 12 số. Trường hợp 2: tận cùng là 2 hoặc 4 có 2 cách, hàng trăm khác 0 nên có 3 cách, hàng chục có 3 cách, được 2x3x3 = 18 số. Tổng cộng 12 + 18 = 30 số.",
    "tags": [
      "Tổ hợp",
      "Toán tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-086",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Một hình chữ nhật có chu vi bằng 40 cm và chiều dài gấp 3 lần chiều rộng. Diện tích của hình chữ nhật đó bằng bao nhiêu?",
    "a": "60 cm vuông",
    "b": "75 cm vuông",
    "c": "96 cm vuông",
    "d": "100 cm vuông",
    "ans": "B",
    "exp": "Nửa chu vi hình chữ nhật là 40 : 2 = 20 cm. Chiều dài gấp 3 lần chiều rộng nên chiều rộng là 20 : 4 = 5 cm và chiều dài là 15 cm. Diện tích là 15 x 5 = 75 cm vuông.",
    "tags": [
      "Hình học",
      "Toán tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-087",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Nếu tăng bán kính của một hình cầu lên gấp 2 lần thì thể tích của hình cầu đó sẽ tăng lên gấp bao nhiêu lần?",
    "a": "2 lần",
    "b": "4 lần",
    "c": "8 lần",
    "d": "6 lần",
    "ans": "C",
    "exp": "Thể tích hình cầu tỷ lệ thuận với lập phương bán kính theo công thức 4/3 pi R mũ 3. Do đó khi bán kính tăng gấp 2 lần thì thể tích tăng 2 mũ 3 bằng 8 lần.",
    "tags": [
      "Hình học không gian",
      "Toán tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-088",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Ba nghi phạm X, Y, Z đưa ra lời khai về một vụ trộm. X nói: 'Y là thủ phạm'. Y nói: 'X nói dối'. Z nói: 'Tôi không phải là thủ phạm'. Biết rằng chỉ có duy nhất một người là thủ phạm và chỉ có duy nhất một người nói thật. Hỏi ai là thủ phạm?",
    "a": "Nghi phạm X",
    "b": "Nghi phạm Y",
    "c": "Không xác định được",
    "d": "Nghi phạm Z",
    "ans": "D",
    "exp": "Lời khai của X và Y mâu thuẫn trực tiếp nên trong hai người X và Y chắc chắn có 1 người nói thật và 1 người nói dối. Vì cả 3 chỉ có 1 người nói thật nên Z bắt buộc phải nói dối. Z nói không phải thủ phạm là dối, vậy Z chính là thủ phạm.",
    "tags": [
      "Suy luận logic",
      "Đố mẹo"
    ]
  },
  {
    "id": "q-mh500-b5-089",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Tìm số tiếp theo trong dãy số đan xen sau: 10, 20, 13, 18, 16, 16, 19, 14, ...?",
    "a": "22",
    "b": "21",
    "c": "12",
    "d": "24",
    "ans": "A",
    "exp": "Dãy số gồm 2 dãy đan xen: các vị trí lẻ 10, 13, 16, 19 tăng đều thêm 3; các vị trí chẵn 20, 18, 16, 14 giảm đều đi 2. Số tiếp theo ở vị trí thứ 9 là vị trí lẻ: 19 + 3 = 22.",
    "tags": [
      "Dãy số",
      "Logic"
    ]
  },
  {
    "id": "q-mh500-b5-090",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Một quả dưa hấu tươi nặng 10 kg chứa 90% là nước. Sau khi để ngoài nắng một thời gian, lượng nước bốc hơi bớt đi 1 kg. Hỏi lúc này quả dưa hấu nặng bao nhiêu kilôgam?",
    "a": "8 kg",
    "b": "9 kg",
    "c": "8,5 kg",
    "d": "9,5 kg",
    "ans": "B",
    "exp": "Quả dưa ban đầu nặng 10 kg, sau khi mất đi 1 kg nước bốc hơi thì khối lượng còn lại đơn giản là 10 - 1 = 9 kg.",
    "tags": [
      "Đố mẹo",
      "Tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-091",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Một lô nấm tươi nặng 100 kg có tỷ lệ nước là 99%. Sau khi sấy nhẹ, tỷ lệ nước trong nấm giảm xuống còn 98%. Hỏi khối lượng lô nấm sau khi sấy là bao nhiêu kilôgam?",
    "a": "98 kg",
    "b": "90 kg",
    "c": "50 kg",
    "d": "99 kg",
    "ans": "C",
    "exp": "Trong 100 kg nấm ban đầu có 99% nước nên phần chất khô không đổi là 1 kg. Sau khi sấy, nước chiếm 98% nghĩa là 1 kg chất khô chiếm 2% tổng khối lượng mới. Vậy khối lượng mới là 1 : 2% = 50 kg.",
    "tags": [
      "Tỷ lệ phần trăm",
      "Đố mẹo"
    ]
  },
  {
    "id": "q-mh500-b5-092",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Nếu hôm qua của ngày mai là thứ Tư, thì ngày mai của hôm qua là thứ mấy?",
    "a": "Thứ Ba",
    "b": "Thứ Sáu",
    "c": "Thứ Năm",
    "d": "Thứ Tư",
    "ans": "D",
    "exp": "Hôm qua của ngày mai chính là hôm nay, vậy hôm nay là thứ Tư. Ngày mai của hôm qua cũng chính là hôm nay, tức là thứ Tư.",
    "tags": [
      "Suy luận logic",
      "Đố mẹo"
    ]
  },
  {
    "id": "q-mh500-b5-093",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Tìm số tự nhiên có hai chữ số, biết rằng tổng hai chữ số của nó bằng 12 và nếu đổi chỗ hai chữ số đó cho nhau thì ta được một số mới lớn hơn số ban đầu 18 đơn vị.",
    "a": "57",
    "b": "48",
    "c": "75",
    "d": "39",
    "ans": "A",
    "exp": "Gọi số ban đầu là ab. Khi đổi chỗ được ba, hiệu ba - ab = 9 x (b - a) = 18 nên b - a = 2. Kết hợp với a + b = 12 ta tìm được a = 5 và b = 7, vậy số ban đầu là 57.",
    "tags": [
      "Mật mã",
      "Toán tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-094",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Một bác thợ mộc cưa một cây gỗ dài 12 mét thành các đoạn ngắn đều nhau, mỗi đoạn dài 2 mét. Biết mỗi lần cưa đứt một mạch gỗ mất 5 phút. Hỏi bác thợ mộc mất tổng cộng bao nhiêu phút để cưa xong cây gỗ?",
    "a": "30 phút",
    "b": "25 phút",
    "c": "35 phút",
    "d": "20 phút",
    "ans": "B",
    "exp": "Cây gỗ 12 mét chia thành các đoạn 2 mét sẽ được 12 : 2 = 6 đoạn. Để cắt thành 6 đoạn chỉ cần thực hiện 5 lần cưa. Thời gian cần thiết là 5 x 5 = 25 phút.",
    "tags": [
      "Đố mẹo",
      "Toán tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-095",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Cho một đa giác lồi có 10 đỉnh. Hỏi đa giác đó có tất cả bao nhiêu đường chéo?",
    "a": "30 đường chéo",
    "b": "40 đường chéo",
    "c": "35 đường chéo",
    "d": "45 đường chéo",
    "ans": "C",
    "exp": "Số đường chéo của đa giác lồi n đỉnh được tính bằng công thức n x (n - 3) : 2. Với n = 10, số đường chéo là 10 x 7 : 2 = 35 đường chéo.",
    "tags": [
      "Hình học",
      "Tổ hợp"
    ]
  },
  {
    "id": "q-mh500-b5-096",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Tìm số còn thiếu trong dãy số quy luật sau: 2, 6, 18, 54, 162, ...?",
    "a": "324",
    "b": "468",
    "c": "512",
    "d": "486",
    "ans": "D",
    "exp": "Đây là cấp số nhân với công bội bằng 3: mỗi số hạng sau bằng số hạng liền trước nhân với 3. Vậy số tiếp theo là 162 x 3 = 486.",
    "tags": [
      "Dãy số",
      "Logic"
    ]
  },
  {
    "id": "q-mh500-b5-097",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Một giải đấu cờ vua có 8 kỳ thủ tham gia thi đấu theo thể thức vòng tròn hai lượt gồm lượt đi và lượt về, mỗi cặp gặp nhau đúng 2 ván. Hỏi toàn giải có tất cả bao nhiêu ván đấu?",
    "a": "56 ván đấu",
    "b": "48 ván đấu",
    "c": "28 ván đấu",
    "d": "64 ván đấu",
    "ans": "A",
    "exp": "Số ván đấu ở một lượt vòng tròn giữa 8 kỳ thủ là 8 x 7 : 2 = 28 ván. Vì thi đấu hai lượt đi và về nên tổng số ván đấu là 28 x 2 = 56 ván.",
    "tags": [
      "Tổ hợp",
      "Toán tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-098",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Nếu 5 con mèo có thể bắt được 5 con chuột trong vòng 5 phút, thì cần bao nhiêu con mèo để bắt được 100 con chuột trong vòng 100 phút với cùng tốc độ đó?",
    "a": "20 con mèo",
    "b": "5 con mèo",
    "c": "50 con mèo",
    "d": "100 con mèo",
    "ans": "B",
    "exp": "5 con mèo bắt 5 con chuột trong 5 phút nghĩa là trung bình cứ 5 phút thì 5 con mèo bắt được 5 con chuột. Trong 100 phút tức gấp 20 lần thời gian, chính 5 con mèo đó sẽ bắt được 5 x 20 = 100 con chuột.",
    "tags": [
      "Đố mẹo",
      "Tư duy logic"
    ]
  },
  {
    "id": "q-mh500-b5-099",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Cho mật mã số: nếu A + B = 15, B + C = 18 và A + C = 13, thì tích của ba số A x B x C bằng bao nhiêu?",
    "a": "360",
    "b": "420",
    "c": "400",
    "d": "480",
    "ans": "C",
    "exp": "Cộng cả 3 phương trình ta có 2 x (A + B + C) = 15 + 18 + 13 = 46, suy ra A + B + C = 23. Từ đó tính được C = 23 - 15 = 8, A = 23 - 18 = 5, B = 23 - 13 = 10. Tích A x B x C = 5 x 10 x 8 = 400.",
    "tags": [
      "Mật mã",
      "Toán tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-100",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Một lớp học có 40 học sinh, trong đó có 25 em thích môn Toán, 20 em thích môn Văn và 10 em thích cả hai môn Toán và Văn. Hỏi trong lớp có bao nhiêu học sinh không thích cả hai môn này?",
    "a": "0 học sinh",
    "b": "15 học sinh",
    "c": "10 học sinh",
    "d": "5 học sinh",
    "ans": "D",
    "exp": "Theo nguyên lý bù trừ, số học sinh thích ít nhất một trong hai môn là 25 + 20 - 10 = 35 học sinh. Vậy số học sinh không thích cả hai môn là 40 - 35 = 5 học sinh.",
    "tags": [
      "Suy luận logic",
      "Tập hợp"
    ]
  },
  {
    "id": "q-mh500-b5-101",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Tìm số tiếp theo trong dãy số lập phương biến đổi sau: 0, 7, 26, 63, 124, ...?",
    "a": "215",
    "b": "195",
    "c": "216",
    "d": "255",
    "ans": "A",
    "exp": "Quy luật của dãy số là n mũ 3 trừ 1 với n lần lượt là 1, 2, 3, 4, 5: 1-1=0, 8-1=7, 27-1=26, 64-1=63, 125-1=124. Số tiếp theo ứng với n = 6 là 6 mũ 3 trừ 1 = 216 - 1 = 215.",
    "tags": [
      "Dãy số",
      "Toán tư duy"
    ]
  },
  {
    "id": "q-mh500-b5-102",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Một chiếc thang dây treo dọc bên mạn tàu thủy có các bậc thang cách đều nhau 30 cm. Hiện tại bậc thang thứ nhất từ dưới lên đang chạm đúng mặt nước biển. Nếu thủy triều dâng lên cao thêm 90 cm thì nước biển sẽ chạm tới bậc thang thứ mấy của thang dây?",
    "a": "Bậc thang thứ 3",
    "b": "Bậc thang thứ 1",
    "c": "Bậc thang thứ 4",
    "d": "Bậc thang thứ 5",
    "ans": "B",
    "exp": "Khi thủy triều dâng lên thì con tàu cùng chiếc thang dây treo trên tàu cũng nổi dâng lên theo mặt nước đúng 90 cm, nên mặt nước vẫn chạm ở bậc thang thứ 1.",
    "tags": [
      "Đố mẹo",
      "Tư duy logic"
    ]
  },
  {
    "id": "q-mh500-b5-103",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Một hộp chứa 5 viên bi xanh và 4 viên bi đỏ. Lấy ngẫu nhiên đồng thời 2 viên bi từ trong hộp. Xác suất để lấy được cả 2 viên bi đều có màu đỏ là bao nhiêu?",
    "a": "4 phần 9",
    "b": "2 phần 9",
    "c": "1 phần 6",
    "d": "5 phần 18",
    "ans": "C",
    "exp": "Tổng số cách chọn 2 viên bi từ 9 viên là 9 x 8 : 2 = 36 cách. Số cách chọn được 2 viên bi đỏ từ 4 viên đỏ là 4 x 3 : 2 = 6 cách. Xác suất là 6/36 rút gọn bằng 1 phần 6.",
    "tags": [
      "Xác suất",
      "Tổ hợp"
    ]
  },
  {
    "id": "q-mh500-b5-104",
    "cat": "cat-iq",
    "diff": "MEDIUM",
    "q": "Trong một cuộc đua chạy bộ, nếu bạn vừa vượt qua người đang chạy ở vị trí thứ hai thì ngay lúc đó bạn đang ở vị trí thứ mấy?",
    "a": "Vị trí thứ nhất",
    "b": "Không xác định được",
    "c": "Vị trí thứ ba",
    "d": "Vị trí thứ hai",
    "ans": "D",
    "exp": "Khi bạn vượt qua người đang ở vị trí thứ hai, bạn thế chỗ của người đó và trở thành người đứng thứ hai, còn người dẫn đầu vị trí thứ nhất vẫn đang ở phía trước bạn.",
    "tags": [
      "Đố mẹo",
      "Tư duy logic"
    ]
  },
  {
    "id": "q-mh500-b5-105",
    "cat": "cat-iq",
    "diff": "HARD",
    "q": "Một hình trụ có bán kính đáy bằng 3 cm và chiều cao bằng 4 cm. Nếu trải phẳng mặt xung quanh của hình trụ đó ra thành một hình chữ nhật thì diện tích của hình chữ nhật đó bằng bao nhiêu, lấy số pi xấp xỉ 3,14?",
    "a": "75,36 cm vuông",
    "b": "37,68 cm vuông",
    "c": "113,04 cm vuông",
    "d": "56,52 cm vuông",
    "ans": "A",
    "exp": "Diện tích xung quanh hình trụ bằng chu vi đáy nhân chiều cao: 2 x pi x R x h = 2 x 3,14 x 3 x 4 = 75,36 cm vuông.",
    "tags": [
      "Hình học không gian",
      "Toán tư duy"
    ]
  }
];

export const EXTRA_MH500_QUESTIONS: SeedQuestion[] = MH500_COMPACT.map((item) => ({
  id: item.id,
  categoryId: item.cat,
  content: item.q,
  difficulty: item.diff,
  options: {
    A: item.a,
    B: item.b,
    C: item.c,
    D: item.d,
  },
  correctOption: item.ans,
  explanation: item.exp,
  topicTags: item.tags,
  status: 'PUBLISHED',
  sourceType: 'WIKIPEDIA',
  sourceUrl: 'https://vi.wikipedia.org/',
  license: 'CC BY-SA 4.0',
  attribution: 'Ngân hàng Câu hỏi Đấu Trường Tri Thức (Trung bình - Khó)',
}));
