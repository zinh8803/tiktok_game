const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.resolve(__dirname, '../../data/knowledge_battle.sqlite');
const db = new DatabaseSync(dbPath);

const hardQuestions = [
  // =========================================================================
  // 1. LỊCH SỬ & VĂN HÓA (cat-his) - 10 câu siêu khó
  // =========================================================================
  {
    cat: 'cat-his',
    q: 'Vị hoàng đế nào trong lịch sử phong kiến Việt Nam có thời gian trị vì ngắn nhất (chỉ vỏn vẹn trong 3 ngày)?',
    a: 'Vua Dục Đức',
    b: 'Vua Hiệp Hòa',
    c: 'Vua Kiến Phúc',
    d: 'Vua Lê Gia Tông',
    ans: 'A',
    diff: 'HARD',
    exp: 'Vua Dục Đức (Nguyễn Phúc Ưng Ái) lên ngôi kế vị vua Tự Đức năm 1883 nhưng bị phế truất và giam cầm chỉ sau đúng 3 ngày ở ngôi.',
    tags: ['Lịch sử', 'Nhà Nguyễn', 'Hoàng đế']
  },
  {
    cat: 'cat-his',
    q: 'Trận thủy chiến lịch sử đầu tiên trên sông Bạch Đằng dùng chiến thuật cọc ngầm đánh tan quân Nam Hán vào năm nào?',
    a: 'Năm 938',
    b: 'Năm 981',
    c: 'Năm 1288',
    d: 'Năm 1077',
    ans: 'A',
    diff: 'HARD',
    exp: 'Năm 938, Ngô Quyền đã lãnh đạo quân dân ta dùng cọc nhọn bịt sắt cắm dưới lòng sông Bạch Đằng tiêu diệt đạo quân Nam Hán do Hoằng Thao chỉ huy.',
    tags: ['Lịch sử', 'Bạch Đằng', 'Ngô Quyền']
  },
  {
    cat: 'cat-his',
    q: 'Tên thật của nữ thi sĩ tài hoa nổi tiếng thời phong kiến với hiệu Bà Huyện Thanh Quan là gì?',
    a: 'Nguyễn Thị Hinh',
    b: 'Hồ Xuân Hương',
    c: 'Đoàn Thị Điểm',
    d: 'Lê Ngọc Hân',
    ans: 'A',
    diff: 'HARD',
    exp: 'Bà Huyện Thanh Quan tên thật là Nguyễn Thị Hinh, sống ở thế kỷ XIX, quê tại phường Nghi Tàm, Thăng Long (Hà Nội).',
    tags: ['Lịch sử', 'Văn học', 'Thi sĩ']
  },
  {
    cat: 'cat-his',
    q: 'Vị vua nào của triều đại nhà Nguyễn có thời gian trị vì trên ngai vàng lâu nhất trong lịch sử?',
    a: 'Vua Tự Đức (36 năm)',
    b: 'Vua Gia Long (18 năm)',
    c: 'Vua Minh Mạng (21 năm)',
    d: 'Vua Khải Định (10 năm)',
    ans: 'A',
    diff: 'HARD',
    exp: 'Vua Tự Đức (Nguyễn Phúc Thì) trị vì từ năm 1847 đến năm 1883 (tổng cộng 36 năm), là vị vua ở ngôi lâu nhất của triều Nguyễn.',
    tags: ['Lịch sử', 'Nhà Nguyễn', 'Tự Đức']
  },
  {
    cat: 'cat-his',
    q: 'Chiến dịch lịch sử nào kéo dài 12 ngày đêm cuối năm 1972 đã đập tan cuộc tập kích B-52 của không quân Mỹ vào Hà Nội?',
    a: 'Hà Nội - Điện Biên Phủ trên không',
    b: 'Chiến dịch Khe Sanh',
    c: 'Chiến dịch Đường 9 - Nam Lào',
    d: 'Chiến dịch Hồ Chí Minh',
    ans: 'A',
    diff: 'HARD',
    exp: 'Từ ngày 18/12 đến 30/12/1972, quân và dân miền Bắc đã lập nên kỳ tích đánh bại chiến dịch Linebacker II, lập nên chiến thắng "Điện Biên Phủ trên không".',
    tags: ['Lịch sử', 'Kháng chiến', 'Không quân']
  },
  {
    cat: 'cat-his',
    q: 'Bộ luật thành văn hoàn chỉnh và tiến bộ nhất thời phong kiến Việt Nam mang tên "Quốc triều hình luật" được ban hành dưới triều đại nào?',
    a: 'Thời Lê sơ (thời Hậu Lê)',
    b: 'Thời Lý',
    c: 'Thời Trần',
    d: 'Thời Tiền Lê',
    ans: 'A',
    diff: 'HARD',
    exp: 'Quốc triều hình luật (thường gọi là Luật Hồng Đức) được biên soạn và hoàn thiện dưới thời vua Lê Thánh Tông triều Lê sơ.',
    tags: ['Lịch sử', 'Luật pháp', 'Hồng Đức']
  },
  {
    cat: 'cat-his',
    q: 'Năm 1077, danh tướng Lý Thường Kiệt đã lập phòng tuyến chặn tan 10 vạn quân Tống xâm lược bên con sông nào ngày nay?',
    a: 'Sông Cầu (sông Như Nguyệt)',
    b: 'Sông Đáy',
    c: 'Sông Hồng',
    d: 'Sông Bạch Đằng',
    ans: 'A',
    diff: 'HARD',
    exp: 'Phòng tuyến sông Như Nguyệt được xây dựng dọc theo bờ nam sông Cầu (Bắc Ninh - Bắc Giang ngày nay), nơi bài thơ thần Nam quốc sơn hà vang lên.',
    tags: ['Lịch sử', 'Lý Thường Kiệt', 'Như Nguyệt']
  },
  {
    cat: 'cat-his',
    q: 'Đại thi hào Nguyễn Du đã được Tổ chức Giáo dục, Khoa học và Văn hóa Liên Hợp Quốc (UNESCO) vinh danh là Danh nhân Văn hóa thế giới vào năm nào?',
    a: 'Năm 2013 (kỷ niệm 250 năm sinh)',
    b: 'Năm 1990',
    c: 'Năm 2000',
    d: 'Năm 2018',
    ans: 'A',
    diff: 'HARD',
    exp: 'Năm 2013, Đại hội đồng UNESCO tại Paris đã chính thức thông qua nghị quyết vinh danh Đại thi hào Nguyễn Du là Danh nhân văn hóa thế giới.',
    tags: ['Lịch sử', 'Nguyễn Du', 'UNESCO']
  },
  {
    cat: 'cat-his',
    q: 'Kinh đô đầu tiên của nước Đại Cồ Việt sau khi chấm dứt thời kỳ Bắc thuộc nghìn năm được đặt tại địa danh nào?',
    a: 'Hoa Lư (Ninh Bình)',
    b: 'Cổ Loa (Đông Anh, Hà Nội)',
    c: 'Mê Linh (Vĩnh Phúc)',
    d: 'Thăng Long (Hà Nội)',
    ans: 'A',
    diff: 'HARD',
    exp: 'Năm 968 sau khi dẹp loạn 12 sứ quân, Đinh Bộ Lĩnh lên ngôi Hoàng đế, đặt tên nước là Đại Cồ Việt và định đô tại Hoa Lư (Ninh Bình).',
    tags: ['Lịch sử', 'Đại Cồ Việt', 'Hoa Lư']
  },
  {
    cat: 'cat-his',
    q: 'Tác phẩm văn học chính luận "Bình Ngô đại cáo" được viết bằng thể loại văn học chữ Hán nào?',
    a: 'Văn biền ngẫu thể Cáo',
    b: 'Thơ Thất ngôn bát cú',
    c: 'Văn xuôi thể Hịch',
    d: 'Văn tế cổ thể',
    ans: 'A',
    diff: 'HARD',
    exp: 'Bình Ngô đại cáo được Nguyễn Trãi viết theo thể văn biền ngẫu đối ngẫu nghiêm ngặt, công bố vào đầu năm 1428 sau đại thắng quân Minh.',
    tags: ['Lịch sử', 'Văn học', 'Nguyễn Trãi']
  },

  // =========================================================================
  // 2. ĐỊA LÝ & DI SẢN (cat-geo) - 10 câu siêu khó
  // =========================================================================
  {
    cat: 'cat-geo',
    q: 'Điểm cực Tây trên đất liền của lãnh thổ Việt Nam (nơi ngã ba biên giới Việt - Lào - Trung) nằm tại địa danh nào?',
    a: 'Mốc A Pa Chải, xã Sín Thầu, Điện Biên',
    b: 'Cột cờ Lũng Cú, Đồng Văn, Hà Giang',
    c: 'Mũi Đôi, Vạn Ninh, Khánh Hòa',
    d: 'Xã Đất Mũi, Ngọc Hiển, Cà Mau',
    ans: 'A',
    diff: 'HARD',
    exp: 'Cực Tây Việt Nam nằm tại đỉnh núi Khoang La San thuộc mốc số 0 A Pa Chải, xã Sín Thầu, huyện Mường Nhé, tỉnh Điện Biên.',
    tags: ['Địa lý', 'Cực Tây', 'A Pa Chải']
  },
  {
    cat: 'cat-geo',
    q: 'Đỉnh núi cao nhất của dải Trường Sơn Bắc nằm trên ranh giới tự nhiên giữa Việt Nam và Lào là đỉnh núi nào?',
    a: 'Phù Xai Lai Leng (2.720 m)',
    b: 'Ngọc Linh (2.605 m)',
    c: 'Pu Si Lung (3.083 m)',
    d: 'Chư Yang Sin (2.442 m)',
    ans: 'A',
    diff: 'HARD',
    exp: 'Phù Xai Lai Leng cao 2.720 m thuộc địa phận tỉnh Nghệ An và tỉnh Xiêng Khoảng (Lào), là đỉnh núi cao nhất toàn bộ hệ thống núi Trường Sơn Bắc.',
    tags: ['Địa lý', 'Trường Sơn', 'Núi non']
  },
  {
    cat: 'cat-geo',
    q: 'Tỉnh nào của Việt Nam có đường bờ biển kéo dài dài nhất cả nước (tính cả bờ biển các đảo và eo vịnh)?',
    a: 'Khánh Hòa (khoảng 385 km)',
    b: 'Quảng Ninh',
    c: 'Cà Mau',
    d: 'Bình Thuận',
    ans: 'A',
    diff: 'HARD',
    exp: 'Khánh Hòa có đường bờ biển dài nhất Việt Nam với hơn 385 km bờ biển khúc khuỷu, nhiều bán đảo và hơn 200 hòn đảo lớn nhỏ.',
    tags: ['Địa lý', 'Biển đảo', 'Khánh Hòa']
  },
  {
    cat: 'cat-geo',
    q: 'Hòn đảo nào có diện tích tự nhiên lớn thứ hai của Việt Nam chỉ xếp sau đảo Phú Quốc (Kiên Giang)?',
    a: 'Đảo Cái Bầu (Vân Đồn, Quảng Ninh)',
    b: 'Đảo Cát Bà (Hải Phòng)',
    c: 'Đảo Phú Quý (Bình Thuận)',
    d: 'Đảo Côn Sơn (Bà Rịa - Vũng Tàu)',
    ans: 'A',
    diff: 'HARD',
    exp: 'Đảo Cái Bầu (huyện Vân Đồn, Quảng Ninh) rộng khoảng 172 km², là hòn đảo lớn thứ hai Việt Nam sau đảo Phú Quốc (589 km²).',
    tags: ['Địa lý', 'Hải đảo', 'Quảng Ninh']
  },
  {
    cat: 'cat-geo',
    q: 'Con sông nào dài nhất có toàn bộ lưu vực và dòng chảy nằm trọn vẹn bên trong lãnh thổ Việt Nam?',
    a: 'Sông Đồng Nai (dài 586 km)',
    b: 'Sông Hồng',
    c: 'Sông Đà',
    d: 'Sông Mê Kông',
    ans: 'A',
    diff: 'HARD',
    exp: 'Sông Đồng Nai dài 586 km bắt nguồn từ cao nguyên Lâm Viên và đổ ra biển Đông, là con sông nội địa dài nhất Việt Nam.',
    tags: ['Địa lý', 'Sông ngòi', 'Đồng Nai']
  },
  {
    cat: 'cat-geo',
    q: 'Hồ nước ngọt tự nhiên sâu nhất thế giới với độ sâu tối đa lên tới 1.642 mét là hồ nước nào?',
    a: 'Hồ Baikal (Nga)',
    b: 'Hồ Superior (Bắc Mỹ)',
    c: 'Hồ Tanganyika (Châu Phi)',
    d: 'Hồ Victoria (Châu Phi)',
    ans: 'A',
    diff: 'HARD',
    exp: 'Hồ Baikal tại Siberia (Nga) chứa khoảng 20% lượng nước ngọt không đóng băng trên bề mặt Trái Đất và là hồ sâu nhất thế giới (1.642 m).',
    tags: ['Địa lý', 'Kỷ lục', 'Hồ nước']
  },
  {
    cat: 'cat-geo',
    q: 'Quốc đảo duy nhất trên thế giới có lãnh thổ trải dài trên cả 4 bán cầu: Bắc, Nam, Đông và Tây là quốc đảo nào?',
    a: 'Kiribati',
    b: 'Maldives',
    c: 'Fiji',
    d: 'Samoa',
    ans: 'A',
    diff: 'HARD',
    exp: 'Kiribati gồm 33 đảo san hô nằm rải rác trên vùng biển rộng lớn ở Thái Bình Dương, cắt ngang cả đường Xích Đạo lẫn kinh tuyến 180°.',
    tags: ['Địa lý', 'Thế giới', 'Quốc đảo']
  },
  {
    cat: 'cat-geo',
    q: 'Quốc gia nào trên thế giới có nhiều múi giờ tự nhiên nhất (tính cả các vùng lãnh thổ và hải ngoại)?',
    a: 'Pháp (12 múi giờ)',
    b: 'Nga (11 múi giờ)',
    c: 'Hoa Kỳ (11 múi giờ)',
    d: 'Anh (9 múi giờ)',
    ans: 'A',
    diff: 'HARD',
    exp: 'Nhờ có các vùng lãnh thổ hải ngoại trải khắp Thái Bình Dương, Ấn Độ Dương và Caribe, nước Pháp sở hữu tới 12 múi giờ khác nhau.',
    tags: ['Địa lý', 'Múi giờ', 'Kỷ lục']
  },
  {
    cat: 'cat-geo',
    q: 'Vùng trũng đất liền tự nhiên thấp nhất trên bề mặt Trái Đất (khoảng -430 mét dưới mực nước biển) nằm ở đâu?',
    a: 'Bờ Biển Chết (Jordan - Israel)',
    b: 'Thung lũng Chết (Mỹ)',
    c: 'Bồn địa Turpan (Trung Quốc)',
    d: 'Hồ Eyre (Úc)',
    ans: 'A',
    diff: 'HARD',
    exp: 'Mặt nước và bờ của Biển Chết nằm ở độ cao âm khoảng 430 m so với mực nước biển, là điểm khô ráo thấp nhất bề mặt Trái Đất.',
    tags: ['Địa lý', 'Biển Chết', 'Kỷ lục']
  },
  {
    cat: 'cat-geo',
    q: 'Thác nước tự nhiên xuyên quốc gia lớn nhất Đông Nam Á và đứng thứ tư thế giới nằm giữa Việt Nam và quốc gia nào?',
    a: 'Thác Bản Giốc (giữa Việt Nam và Trung Quốc)',
    b: 'Thác Khone Phapheng (Lào)',
    c: 'Thác Dambri (Việt Nam)',
    d: 'Thác Erawan (Thái Lan)',
    ans: 'A',
    diff: 'HARD',
    exp: 'Thác Bản Giốc nằm trên sông Quây Sơn tại xã Đàm Thủy, huyện Trùng Khánh, tỉnh Cao Bằng, giáp với Khu tự trị dân tộc Choang Quảng Tây (Trung Quốc).',
    tags: ['Địa lý', 'Thác nước', 'Bản Giốc']
  },

  // =========================================================================
  // 3. KHOA HỌC & VŨ TRỤ (cat-sci) - 10 câu siêu khó
  // =========================================================================
  {
    cat: 'cat-sci',
    q: 'Hành tinh nào trong Hệ Mặt Trời có một ngày (chu kỳ tự quay quanh trục) dài hơn một năm (chu kỳ quay quanh Mặt Trời)?',
    a: 'Sao Kim (Venus)',
    b: 'Sao Thủy (Mercury)',
    c: 'Sao Hỏa (Mars)',
    d: 'Sao Hải Vương (Neptune)',
    ans: 'A',
    diff: 'HARD',
    exp: 'Sao Kim mất 243 ngày Trái Đất để tự quay một vòng quanh trục, nhưng chỉ mất 225 ngày Trái Đất để quay hết một quỹ đạo quanh Mặt Trời.',
    tags: ['Khoa học', 'Thiên văn', 'Hệ Mặt Trời']
  },
  {
    cat: 'cat-sci',
    q: 'Kim loại nào có nhiệt độ nóng chảy cao nhất trong số tất cả các kim loại đã biết (lên đến 3.422 °C)?',
    a: 'Vonfram (Tungsten - W)',
    b: 'Titan (Titanium - Ti)',
    c: 'Bạch kim (Platinum - Pt)',
    d: 'Osmi (Osmium - Os)',
    ans: 'A',
    diff: 'HARD',
    exp: 'Vonfram có ký hiệu hóa học W, nhiệt độ nóng chảy kỷ lục 3.422 °C, thường được dùng làm dây tóc bóng đèn và hợp kim chịu nhiệt siêu cứng.',
    tags: ['Khoa học', 'Hóa học', 'Kim loại']
  },
  {
    cat: 'cat-sci',
    q: 'Khí nào chiếm tỷ lệ thể tích lớn thứ 3 trong bầu khí quyển khô của Trái Đất (sau Nitơ và Oxy)?',
    a: 'Khí Argon (Ar - xấp xỉ 0,93%)',
    b: 'Khí Carbon dioxide (CO2)',
    c: 'Khí Heli (He)',
    d: 'Khí Neon (Ne)',
    ans: 'A',
    diff: 'HARD',
    exp: 'Khí quyển Trái Đất gồm ~78% Nitơ, ~21% Oxy, đứng thứ 3 là Argon (~0,934%), còn khí CO2 chỉ chiếm khoảng 0,04%.',
    tags: ['Khoa học', 'Khí quyển', 'Hóa học']
  },
  {
    cat: 'cat-sci',
    q: 'Tàu thám hiểm vũ trụ không người lái đầu tiên do nhân loại chế tạo đã chính thức vượt qua ranh giới Nhật quyển để tiến vào không gian liên sao là tàu nào?',
    a: 'Voyager 1 (năm 2012)',
    b: 'Pioneer 10',
    c: 'New Horizons',
    d: 'Apollo 11',
    ans: 'A',
    diff: 'HARD',
    exp: 'Tàu Voyager 1 của NASA phóng năm 1977 đã chính thức vượt qua biên giới Nhật quyển (Heliopause) vào tháng 8/2012, trở thành vật thể nhân tạo xa Trái Đất nhất.',
    tags: ['Khoa học', 'Vũ trụ', 'Voyager']
  },
  {
    cat: 'cat-sci',
    q: 'Xương có kích thước nhỏ nhất và trọng lượng nhẹ nhất trong toàn bộ hệ xương của cơ thể con người là xương nào?',
    a: 'Xương bàn đạp (nằm trong tai giữa)',
    b: 'Xương đe',
    c: 'Xương búa',
    d: 'Xương đốt ngón tay út',
    ans: 'A',
    diff: 'HARD',
    exp: 'Xương bàn đạp (Stapes) nằm trong tai giữa chỉ dài khoảng 2,8 – 3,3 mm và nặng vỏn vẹn 2 – 4 mg, có nhiệm vụ truyền rung động âm thanh vào ốc tai.',
    tags: ['Khoa học', 'Y học', 'Cơ thể người']
  },
  {
    cat: 'cat-sci',
    q: 'Hành tinh Đỏ (Sao Hỏa) có sắc đỏ cam rực rỡ đặc trưng khi quan sát từ Trái Đất chủ yếu là do bề mặt của nó chứa lượng lớn hợp chất nào?',
    a: 'Oxit sắt (III) - Fe2O3 (Rỉ sét)',
    b: 'Đồng oxit (CuO)',
    c: 'Lưu huỳnh nguyên chất',
    d: 'Cacbonat canxi',
    ans: 'A',
    diff: 'HARD',
    exp: 'Bụi và đá trên bề mặt Sao Hỏa bị oxy hóa mạnh tạo thành Oxit sắt (III), khiến toàn bộ hành tinh được phủ một lớp bột rỉ sét màu đỏ cam.',
    tags: ['Khoa học', 'Thiên văn', 'Sao Hỏa']
  },
  {
    cat: 'cat-sci',
    q: 'Vận tốc ánh sáng truyền trong môi trường chân không theo định nghĩa quy chuẩn quốc tế SI có giá trị chính xác tuyệt đối là bao nhiêu?',
    a: '299.792.458 m/s',
    b: '300.000.000 m/s',
    c: '299.790.000 m/s',
    d: '298.850.120 m/s',
    ans: 'A',
    diff: 'HARD',
    exp: 'Ký hiệu là c, vận tốc ánh sáng trong chân không là hằng số vật lý nền tảng được định nghĩa chính xác bằng 299.792.458 mét mỗi giây.',
    tags: ['Khoa học', 'Vật lý', 'Ánh sáng']
  },
  {
    cat: 'cat-sci',
    q: 'Cơ quan nội tạng nào trong cơ thể con người có khả năng tự phục hồi và tái tạo sinh học mạnh mẽ nhất (có thể mọc lại kích thước ban đầu dù bị cắt bỏ tới 70%)?',
    a: 'Gan (Liver)',
    b: 'Thận',
    c: 'Phổi',
    d: 'Lá lách',
    ans: 'A',
    diff: 'HARD',
    exp: 'Gan là cơ quan nội tạng duy nhất có khả năng tái sinh kỳ diệu; các tế bào gan có thể tăng sinh mạnh mẽ để bù đắp mô bị mất sau phẫu thuật.',
    tags: ['Khoa học', 'Sinh học', 'Cơ thể người']
  },
  {
    cat: 'cat-sci',
    q: 'Nhiệt độ thấp nhất trên thang nhiệt độ Kelvin mà tại đó mọi chuyển động nhiệt của phân tử lý thuyết đều ngừng lại được gọi là gì?',
    a: 'Độ không tuyệt đối (0 K hay -273,15 °C)',
    b: 'Điểm Ba của nước',
    c: 'Nhiệt độ tới hạn',
    d: 'Không độ C',
    ans: 'A',
    diff: 'HARD',
    exp: 'Độ không tuyệt đối (0 Kelvin, tương đương -273,15 °C) là giới hạn nhiệt động lực học thấp nhất của vũ trụ, nơi entropy đạt cực tiểu.',
    tags: ['Khoa học', 'Vật lý', 'Nhiệt học']
  },
  {
    cat: 'cat-sci',
    q: 'Sinh vật nào sở hữu trái tim nặng nhất trong thế giới động vật từng được ghi nhận (nặng tới gần 200 kg)?',
    a: 'Cá voi xanh',
    b: 'Voi châu Phi',
    c: 'Khủng long bạo chúa',
    d: 'Mực khổng lồ',
    ans: 'A',
    diff: 'HARD',
    exp: 'Trái tim của cá voi xanh trưởng thành nặng khoảng 180 - 200 kg (tương đương kích thước của một chiếc xe golf nhỏ) và đập khoảng 2 - 8 lần mỗi phút khi lặn sâu.',
    tags: ['Khoa học', 'Động vật', 'Kỷ lục']
  },

  // =========================================================================
  // 4. CÔNG NGHỆ & ĐỜI SỐNG (cat-tech) - 10 câu siêu khó
  // =========================================================================
  {
    cat: 'cat-tech',
    q: 'Ai được lịch sử công nghệ ghi nhận là "Lập trình viên máy tính đầu tiên trên thế giới" khi viết thuật toán cho cỗ máy phân tích của Charles Babbage?',
    a: 'Ada Lovelace',
    b: 'Alan Turing',
    c: 'Grace Hopper',
    d: 'John von Neumann',
    ans: 'A',
    diff: 'HARD',
    exp: 'Nữ bá tước Ada Lovelace vào năm 1843 đã viết thuật toán tính số Bernoulli cho cỗ máy cơ học Analytical Engine của Babbage, trở thành lập trình viên đầu tiên.',
    tags: ['Công nghệ', 'Lịch sử IT', 'Lập trình']
  },
  {
    cat: 'cat-tech',
    q: 'Khối dữ liệu khởi nguồn đầu tiên của mạng lưới tiền mã hóa Bitcoin (Genesis Block - Block 0) được đào vào thời gian nào?',
    a: 'Ngày 03/01/2009',
    b: 'Ngày 31/10/2008',
    c: 'Ngày 22/05/2010',
    d: 'Ngày 01/01/2011',
    ans: 'A',
    diff: 'HARD',
    exp: 'Satoshi Nakamoto đã đào Block 0 của Bitcoin vào ngày 3/1/2009, nhúng kèm dòng chữ tiêu đề bài báo The Times về gói cứu trợ ngân hàng của chính phủ Anh.',
    tags: ['Công nghệ', 'Blockchain', 'Bitcoin']
  },
  {
    cat: 'cat-tech',
    q: 'Hệ thống World Wide Web (WWW) được nhà khoa học máy tính người Anh Tim Berners-Lee phát minh vào năm 1989 khi ông đang làm việc tại viện nghiên cứu nào?',
    a: 'CERN (Tổ chức Nghiên cứu Hạt nhân Châu Âu)',
    b: 'MIT (Viện Công nghệ Massachusetts)',
    c: 'NASA (Cơ quan Hàng không Vũ trụ Mỹ)',
    d: 'Bell Labs (Phòng thí nghiệm Bell)',
    ans: 'A',
    diff: 'HARD',
    exp: 'Tim Berners-Lee phát minh ra World Wide Web năm 1989 tại trung tâm CERN ở Thụy Sĩ nhằm giúp các nhà vật lý dễ dàng chia sẻ tài liệu qua mạng máy tính.',
    tags: ['Công nghệ', 'Internet', 'WWW']
  },
  {
    cat: 'cat-tech',
    q: 'Cổng mạng (Port) mặc định tiêu chuẩn được sử dụng cho giao thức truyền tải văn bản siêu bảo mật HTTPS là cổng số bao nhiêu?',
    a: 'Port 443',
    b: 'Port 80',
    c: 'Port 22',
    d: 'Port 8080',
    ans: 'A',
    diff: 'HARD',
    exp: 'HTTPS dùng Port 443 với chứng chỉ mã hóa TLS/SSL, trong khi giao thức HTTP không mã hóa dùng Port 80.',
    tags: ['Công nghệ', 'Mạng máy tính', 'Bảo mật']
  },
  {
    cat: 'cat-tech',
    q: 'Thuật toán mã hóa khóa công khai kinh điển RSA được đặt tên theo chữ cái đầu của 3 nhà khoa học máy tính nào?',
    a: 'Rivest, Shamir và Adleman',
    b: 'Russell, Shannon và Turing',
    c: 'Ritchie, Stroustrup và Andreessen',
    d: 'Rosen, Smith và Atkinson',
    ans: 'A',
    diff: 'HARD',
    exp: 'Thuật toán RSA được Ron Rivest, Adi Shamir và Leonard Adleman công bố năm 1977 tại MIT, là nền tảng của mật mã học bất đối xứng hiện đại.',
    tags: ['Công nghệ', 'Mật mã', 'Thuật toán']
  },
  {
    cat: 'cat-tech',
    q: 'Siêu máy tính Deep Blue của tập đoàn IBM đã gây chấn động toàn cầu khi đánh bại Đại kiện tướng cờ vua thế giới Garry Kasparov vào năm nào?',
    a: 'Năm 1997',
    b: 'Năm 1990',
    c: 'Năm 2001',
    d: 'Năm 2005',
    ans: 'A',
    diff: 'HARD',
    exp: 'Tháng 5/1997, cỗ máy Deep Blue đã đánh bại vua cờ Garry Kasparov trong trận đấu 6 ván với tỷ số 3,5 - 2,5, đánh dấu cột mốc lịch sử của trí tuệ nhân tạo.',
    tags: ['Công nghệ', 'AI', 'Cờ vua']
  },
  {
    cat: 'cat-tech',
    q: 'Tên của ngôn ngữ lập trình Python được tác giả Guido van Rossum đặt theo tên của chương trình gì?',
    a: 'Gánh hài kịch "Monty Python\'s Flying Circus"',
    b: 'Loài trăn Pythonidae khổng lồ ở châu Phi',
    c: 'Thần thoại mãng xà Python của Hy Lạp',
    d: 'Trò chơi điện tử cổ điển Python Arcade',
    ans: 'A',
    diff: 'HARD',
    exp: 'Guido van Rossum là người hâm mộ cuồng nhiệt của nhóm kịch hài nước Anh Monty Python, vì vậy ông đã lấy tên này để đặt cho ngôn ngữ lập trình của mình.',
    tags: ['Công nghệ', 'Python', 'Lập trình']
  },
  {
    cat: 'cat-tech',
    q: 'Trong hệ đo lường dữ liệu số theo tiêu chuẩn nhị phân (Binary), 1 Petabyte (PB) tương đương với bao nhiêu Terabyte (TB)?',
    a: '1.024 Terabyte',
    b: '1.000 Terabyte',
    c: '2.048 Terabyte',
    d: '512 Terabyte',
    ans: 'A',
    diff: 'HARD',
    exp: '1 PB = 2^10 TB = 1.024 TB = 1.048.576 GB theo tiêu chuẩn tính toán nhị phân trong kiến trúc máy tính.',
    tags: ['Công nghệ', 'Dữ liệu', 'Máy tính']
  },
  {
    cat: 'cat-tech',
    q: 'Dung lượng lưu trữ tối đa của một chiếc đĩa mềm 3.5 inch mật độ cao (High Density - HD) phổ biến vào thập niên 1990 là bao nhiêu?',
    a: '1,44 MB',
    b: '720 KB',
    c: '2,88 MB',
    d: '10 MB',
    ans: 'A',
    diff: 'HARD',
    exp: 'Đĩa mềm 3.5 inch HD tiêu chuẩn có dung lượng định dạng chính xác là 1,44 MB, gắn liền với biểu tượng Save huyền thoại.',
    tags: ['Công nghệ', 'Đĩa mềm', 'Lịch sử IT']
  },
  {
    cat: 'cat-tech',
    q: 'Hệ điều hành di động Android vốn được sáng lập ban đầu bởi Andy Rubin vào năm 2003 với mục đích cốt lõi dành cho thiết bị nào?',
    a: 'Máy ảnh kỹ thuật số thông minh (Smart Camera)',
    b: 'Điện thoại thông minh màn hình cảm ứng',
    c: 'Máy bay không người lái',
    d: 'Đồng hồ điện tử đeo tay',
    ans: 'A',
    diff: 'HARD',
    exp: 'Ban đầu Android được thiết kế làm hệ điều hành cho máy ảnh kỹ thuật số, sau đó khi nhận thấy thị trường máy ảnh suy giảm, nhóm đã chuyển hướng sang điện thoại di động.',
    tags: ['Công nghệ', 'Android', 'Lịch sử IT']
  },

  // =========================================================================
  // 5. THỂ THAO & NGHỆ THUẬT (cat-sport) - 10 câu siêu khó
  // =========================================================================
  {
    cat: 'cat-sport',
    q: 'Cầu thủ bóng đá duy nhất trong toàn bộ lịch sử túc cầu thế giới từng 3 lần đăng quang ngôi vô địch World Cup với tư cách cầu thủ là ai?',
    a: 'Pelé (Brazil - 1958, 1962, 1970)',
    b: 'Diego Maradona (Argentina)',
    c: 'Mário Zagallo (Brazil)',
    d: 'Zinedine Zidane (Pháp)',
    ans: 'A',
    diff: 'HARD',
    exp: 'Vua bóng đá Pelé là người duy nhất trên hành tinh giành 3 cúp vàng vô địch thế giới vào các năm 1958, 1962 và 1970.',
    tags: ['Thể thao', 'Bóng đá', 'World Cup']
  },
  {
    cat: 'cat-sport',
    q: 'Bức tranh kiệt tác thời Phục hưng "Mona Lisa" (La Gioconda) của danh họa Leonardo da Vinci được vẽ trên chất liệu gì?',
    a: 'Tấm ván gỗ cây dương tía (Gỗ Poplar)',
    b: 'Vải toan (Canvas sợi lanh)',
    c: 'Tấm đá cẩm thạch trắng',
    d: 'Giấy cói Ai Cập cổ',
    ans: 'A',
    diff: 'HARD',
    exp: 'Khác với lầm tưởng của nhiều người là tranh vẽ trên vải canvas, Mona Lisa được Leonardo da Vinci vẽ bằng sơn dầu trên một tấm ván gỗ dương mỏng.',
    tags: ['Nghệ thuật', 'Hội họa', 'Da Vinci']
  },
  {
    cat: 'cat-sport',
    q: 'Bộ phim điện ảnh huyền thoại nào trong lịch sử đã lập kỷ lục toàn thắng tuyệt đối khi chiến thắng trọn vẹn cả 11 hạng mục được đề cử tại giải Oscar?',
    a: 'Chúa tể những chiếc nhẫn: Sự trở về của nhà vua (2003)',
    b: 'Titanic (1997)',
    c: 'Ben-Hur (1959)',
    d: 'La La Land (2016)',
    ans: 'A',
    diff: 'HARD',
    exp: 'Tuy Titanic và Ben-Hur cũng giành 11 tượng vàng Oscar nhưng bị trượt vài đề cử, riêng "The Return of the King" đã toàn thắng cả 11/11 đề cử (tỷ lệ 100%).',
    tags: ['Nghệ thuật', 'Điện ảnh', 'Oscar']
  },
  {
    cat: 'cat-sport',
    q: 'Nhà soạn nhạc thiên tài người Đức Ludwig van Beethoven đã sáng tác kiệt tác "Bản giao hưởng số 9" (Ode to Joy) trong hoàn cảnh đặc biệt nào?',
    a: 'Khi thính giác của ông đã bị điếc hoàn toàn',
    b: 'Khi ông đang bị giam cầm trong ngục tối',
    c: 'Khi ông bị mù đôi mắt',
    d: 'Khi ông mới chỉ 12 tuổi',
    ans: 'A',
    diff: 'HARD',
    exp: 'Khi hoàn thành Bản giao hưởng số 9 vĩ đại vào năm 1824, Beethoven đã bị điếc hoàn toàn; ông cảm nhận âm nhạc bằng độ rung qua sàn gỗ và trí tưởng tượng thiên tài.',
    tags: ['Nghệ thuật', 'Âm nhạc', 'Beethoven']
  },
  {
    cat: 'cat-sport',
    q: 'Đạo diễn điện ảnh huyền thoại nào đang nắm giữ kỷ lục đoạt nhiều tượng vàng Oscar nhất ở hạng mục "Đạo diễn xuất sắc nhất" (4 tượng vàng)?',
    a: 'John Ford',
    b: 'Steven Spielberg',
    c: 'James Cameron',
    d: 'Martin Scorsese',
    ans: 'A',
    diff: 'HARD',
    exp: 'John Ford đã giành 4 giải Oscar Đạo diễn xuất sắc nhất với các phim: The Informer (1935), The Grapes of Wrath (1940), How Green Was My Valley (1941) và The Quiet Man (1952).',
    tags: ['Nghệ thuật', 'Điện ảnh', 'Đạo diễn']
  },
  {
    cat: 'cat-sport',
    q: 'Trong môn quần vợt (Tennis), danh hiệu cao quý "Grand Slam Vàng" (Golden Slam) trong cùng một năm dương lịch yêu cầu vận động viên phải làm được điều gì?',
    a: 'Vô địch cả 4 giải Grand Slam và đoạt HCV Olympic',
    b: 'Thắng liên tiếp 100 trận đấu đơn nam hoặc nữ',
    c: 'Vô địch 4 giải Grand Slam ở cả nội dung đơn và đôi',
    d: 'Giữ vị trí số 1 thế giới trong 5 năm liên tục',
    ans: 'A',
    diff: 'HARD',
    exp: 'Golden Slam là kỳ tích vô địch cả Australian Open, Roland Garros, Wimbledon, US Open và giành huy chương Vàng Olympic trong cùng một năm (Steffi Graf từng đạt năm 1988).',
    tags: ['Thể thao', 'Tennis', 'Kỷ lục']
  },
  {
    cat: 'cat-sport',
    q: 'Bức bích họa khổng lồ trên trần Nhà nguyện Sistine ở Vatican tái hiện "Sự sáng tạo của Adam" là kiệt tác của danh họa thời Phục hưng nào?',
    a: 'Michelangelo Buonarroti',
    b: 'Raphael Sanzio',
    c: 'Sandro Botticelli',
    d: 'Donatello',
    ans: 'A',
    diff: 'HARD',
    exp: 'Michelangelo đã dành hơn 4 năm trời (1508 - 1512) ngửa cổ vẽ nên trọn vẹn trần Nhà nguyện Sistine với diện tích hơn 500 m² và hàng trăm nhân vật sống động.',
    tags: ['Nghệ thuật', 'Hội họa', 'Michelangelo']
  },
  {
    cat: 'cat-sport',
    q: 'Nhạc cụ truyền thống độc nhất vô nhị của Việt Nam chỉ có một dây duy nhất nhưng nhờ nghệ thuật uốn cần đàn linh hoạt mà diễn tả được đủ mọi cung bậc cảm xúc?',
    a: 'Đàn bầu (Độc huyền cầm)',
    b: 'Đàn đáy',
    c: 'Đàn nhị',
    d: 'Đàn tranh',
    ans: 'A',
    diff: 'HARD',
    exp: 'Đàn bầu là nhạc cụ thuần Việt đặc sắc, chỉ dùng 1 dây căng trên thân đàn kết hợp cần đàn uốn cong để thay đổi cao độ và tạo âm bồi luyến láy.',
    tags: ['Nghệ thuật', 'Âm nhạc', 'Nhạc cụ']
  },
  {
    cat: 'cat-sport',
    q: 'Quốc gia nào trên thế giới đã đăng cai nhiều kỳ Thế vận hội Mùa hè (Olympic Games) nhất trong lịch sử thể thao hiện đại?',
    a: 'Hoa Kỳ (4 lần: 1904, 1932, 1984, 1996)',
    b: 'Vương quốc Anh (3 lần)',
    c: 'Pháp (3 lần)',
    d: 'Hy Lạp (2 lần)',
    ans: 'A',
    diff: 'HARD',
    exp: 'Hoa Kỳ đã đăng cai 4 kỳ Olympic Mùa hè (St. Louis 1904, Los Angeles 1932, Los Angeles 1984, Atlanta 1996) và chuẩn bị tổ chức lần thứ 5 vào năm 2028.',
    tags: ['Thể thao', 'Olympic', 'Kỷ lục']
  },
  {
    cat: 'cat-sport',
    q: 'Bộ phim điện ảnh độc lập nào của đạo diễn Phạm Thiên Ân đã làm rạng danh điện ảnh Việt Nam khi đoạt giải Ống kính Vàng (Camera d\'Or) tại LHP Cannes 2023?',
    a: 'Bên trong vỏ kén vàng (Inside the Yellow Cocoon Shell)',
    b: 'Rơm rạ bay',
    c: 'Tro tàn rực rỡ',
    d: 'Người vợ ba',
    ans: 'A',
    diff: 'HARD',
    exp: '"Bên trong vỏ kén vàng" dài 3 tiếng với những cú máy dài mê hoặc đã xuất sắc giành giải thưởng Camera d\'Or dành cho phim đầu tay xuất sắc nhất tại LHP Cannes lần thứ 76.',
    tags: ['Nghệ thuật', 'Điện ảnh', 'Cannes']
  },

  // =========================================================================
  // 6. ẨM THỰC & ĐỐ MẸO HIỂM HÓC (cat-life) - 10 câu siêu khó
  // =========================================================================
  {
    cat: 'cat-life',
    q: 'Loại gia vị đắt đỏ bậc nhất hành tinh được mệnh danh là "Vàng đỏ", cần thu hoạch tỉ mỉ từ nhụy hoa của loài cây nào?',
    a: 'Nhụy hoa Nghệ tây (Crocus sativus - Saffron)',
    b: 'Nụ hoa Đinh hương cổ thụ',
    c: 'Quả Vani vùng Madagascar',
    d: 'Hạt Tiêu hồng đảo Réunion',
    ans: 'A',
    diff: 'HARD',
    exp: 'Để có được 1 kg saffron khô, người ta phải thu hoạch bằng tay khoảng 150.000 bông hoa nghệ tây, do đó giá của nó có thể lên tới hàng nghìn USD mỗi kg.',
    tags: ['Ẩm thực', 'Gia vị', 'Saffron']
  },
  {
    cat: 'cat-life',
    q: 'Nước mắm truyền thống Phú Quốc trứ danh với độ đạm tự nhiên cao và màu cánh gián đậm đà được ủ chượp từ loài cá nào cho chất lượng ngon nhất?',
    a: 'Cá cơm than (và cá cơm sọc tiêu)',
    b: 'Cá nục hoa',
    c: 'Cá trích tươi',
    d: 'Cá thu phấn',
    ans: 'A',
    diff: 'HARD',
    exp: 'Cá cơm than vùng biển Phú Quốc đánh bắt vào mùa thu khi cá béo và giàu đạm nhất, ủ với muối Bà Rịa theo tỷ lệ 3 cá : 1 muối suốt 12 - 15 tháng trong thùng gỗ bời lời.',
    tags: ['Ẩm thực', 'Nước mắm', 'Phú Quốc']
  },
  {
    cat: 'cat-life',
    q: 'Theo quy định bảo hộ chỉ dẫn địa lý khắt khe của Liên minh Châu Âu (AOC), loại rượu vang sủi bọt nào chỉ được phép mang tên "Champagne"?',
    a: 'Vang sủi được sản xuất hoàn toàn tại vùng Champagne (Pháp)',
    b: 'Mọi loại rượu vang trắng có sủi bọt ở châu Âu',
    c: 'Rượu vang sủi bọt có nồng độ cồn trên 15 độ',
    d: 'Vang lên men từ nho Muscat vùng Địa Trung Hải',
    ans: 'A',
    diff: 'HARD',
    exp: 'Chỉ có rượu vang sủi bọt sản xuất tại vùng lịch sử Champagne nước Pháp bằng phương pháp truyền thống mới được dán nhãn là Champagne; ở nơi khác gọi là Prosecco hoặc Cava.',
    tags: ['Ẩm thực', 'Rượu vang', 'Pháp']
  },
  {
    cat: 'cat-life',
    q: 'Món bánh đậu xanh Hải Dương truyền thống đạt được hương vị béo ngậy, tan mịn đầu lưỡi là nhờ thành phần chất béo đặc trưng nào dưới đây?',
    a: 'Mỡ lợn (mỡ heo) rán tươi lọc kỹ',
    b: 'Dầu cọ tinh luyện',
    c: 'Bơ thực vật Margarine',
    d: 'Dầu dừa nguyên chất',
    ans: 'A',
    diff: 'HARD',
    exp: 'Bí quyết cổ truyền của bánh đậu xanh Hải Dương là dùng mỡ heo tươi phi thơm, trộn cùng bột đậu xanh rang chín và đường cát, giúp bánh tan mịn ngậy thơm đặc biệt.',
    tags: ['Ẩm thực', 'Đặc sản', 'Hải Dương']
  },
  {
    cat: 'cat-life',
    q: 'Đố mẹo hóc búa: Cái gì bạn có thể dễ dàng cầm nắm được bằng bàn tay phải của mình, nhưng vĩnh viễn không bao giờ cầm được bằng bàn tay trái?',
    a: 'Khuỷu tay trái (hoặc cùi chỏ tay trái)',
    b: 'Ngón tay cái bàn tay phải',
    c: 'Chiếc nhẫn đang đeo ở ngón trỏ',
    d: 'Lỗ tai bên trái',
    ans: 'A',
    diff: 'HARD',
    exp: 'Bàn tay trái không thể tự với tới và cầm nắm vào chính khuỷu tay trái của mình, chỉ có bàn tay phải mới cầm được khuỷu tay trái.',
    tags: ['Đố mẹo', 'Hóc búa', 'Tư duy']
  },
  {
    cat: 'cat-life',
    q: 'Đố mẹo logic: Một gia đình có 6 người con trai, và mỗi người con trai đều có đúng một người em gái ruột. Hỏi gia đình đó có tất cả bao nhiêu người con?',
    a: '7 người con (6 trai và 1 gái út)',
    b: '12 người con',
    c: '14 người con',
    d: '6 người con',
    ans: 'A',
    diff: 'HARD',
    exp: 'Tất cả 6 người con trai đều có chung đúng 1 người em gái út, do đó tổng số người con trong gia đình là 6 + 1 = 7 người con.',
    tags: ['Đố mẹo', 'Logic', 'Gia đình']
  },
  {
    cat: 'cat-life',
    q: 'Đố mẹo: Trong một năm dương lịch gồm 12 tháng, có tất cả bao nhiêu tháng có ngày thứ 28?',
    a: 'Cả 12 tháng',
    b: 'Chỉ có 1 tháng (Tháng 2)',
    c: 'Chỉ có 7 tháng',
    d: 'Chỉ có 11 tháng',
    ans: 'A',
    diff: 'HARD',
    exp: 'Tất cả 12 tháng trong năm đều có ít nhất 28 ngày (tháng 2 có 28 hoặc 29 ngày, các tháng còn lại có 30 hoặc 31 ngày).',
    tags: ['Đố mẹo', 'Lịch vạn niên', 'Hại não']
  },
  {
    cat: 'cat-life',
    q: 'Loại cà phê đắt đỏ Kopi Luwak nguyên bản của Indonesia được sản xuất sau khi hạt cà phê được bài tiết qua hệ tiêu hóa của loài thú nào?',
    a: 'Cầy vòi hương (Asian palm civet)',
    b: 'Chồn sương tuyết',
    c: 'Khỉ đột đuôi dài',
    d: 'Lửng mật',
    ans: 'A',
    diff: 'HARD',
    exp: 'Cầy vòi hương chọn ăn những quả cà phê chín mọng nhất, các enzyme tiêu hóa tự nhiên trong dạ dày cầy lên men hạt cà phê tạo nên hương thơm đặc trưng.',
    tags: ['Ẩm thực', 'Cà phê', 'Kỷ lục']
  },
  {
    cat: 'cat-life',
    q: 'Món pho mát truyền thống Casu Marzu khét tiếng của vùng đảo Sardinia (Ý) nổi tiếng nguy hiểm và bị cấm buôn bán do chứa sinh vật sống nào trong ruột bánh?',
    a: 'Ấu trùng dòi của loài ruồi pho mát (Piophila casei)',
    b: 'Sán lá gan',
    c: 'Nấm mốc độc xanh',
    d: 'Giun đất biển',
    ans: 'A',
    diff: 'HARD',
    exp: 'Casu Marzu được ủ cho dòi ruồi Piophila casei sinh sôi để phân hủy chất béo trong pho mát đến mức siêu mềm nhũn, khi ăn dòi còn sống có thể bật nhảy cao tới 15 cm.',
    tags: ['Ẩm thực', 'Kỳ lạ', 'Thế giới']
  },
  {
    cat: 'cat-life',
    q: 'Đố mẹo dân gian: "Vừa bằng quả ổi, khi nổi khi chìm, ngàn mắt ngàn tim, người tìm người quí" là quả gì?',
    a: 'Con ốc vặn (hoặc chiếc nhẫn hạt ngọc)',
    b: 'Quả cau',
    c: 'Quả thị thơm',
    d: 'Chiếc bật lửa',
    ans: 'A',
    diff: 'HARD',
    exp: 'Đây là câu đố dân gian cổ về con ốc (hoặc chiếc nhẫn ngọc nạm đá quý lấp lánh khi chìm nổi dưới nước).',
    tags: ['Đố mẹo', 'Dân gian', 'Ẩm thực']
  }
];

const existingContents = new Set(
  db.prepare('SELECT content FROM questions').all().map((r) => r.content.trim().toLowerCase())
);

const insertQuestionStmt = db.prepare(`
  INSERT INTO questions (
    id, category_id, content, difficulty, question_type, language,
    explanation, topic_tags, status, created_by, approved_by
  ) VALUES (?, ?, ?, ?, 'MULTIPLE_CHOICE', 'vi', ?, ?, 'PUBLISHED', 'usr-admin', 'usr-editor')
`);

const insertOptionStmt = db.prepare(`
  INSERT INTO question_options (id, question_id, label, content, is_correct)
  VALUES (?, ?, ?, ?, ?)
`);

const insertSourceStmt = db.prepare(`
  INSERT INTO question_sources (id, question_id, source_type, source_url, license, attribution)
  VALUES (?, ?, 'MANUAL', 'https://vi.wikipedia.org/', 'CC BY-SA 4.0', 'Knowledge Battle Super Hard Edition')
`);

let insertedCount = 0;

db.exec('BEGIN TRANSACTION');
try {
  for (const item of hardQuestions) {
    if (existingContents.has(item.q.trim().toLowerCase())) {
      continue;
    }
    const qId = `q-hard-${uuidv4().slice(0, 8)}`;
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
  console.log(`ĐÃ NẠP THÀNH CÔNG ${insertedCount} CÂU HỎI SIÊU KHÓ (HARD) VÀO DATABASE!`);
  const total = db.prepare("SELECT difficulty, count(*) as count FROM questions WHERE status = 'PUBLISHED' GROUP BY difficulty").all();
  console.log('THỐNG KÊ CÂU HỎI PUBLISHED THEO ĐỘ KHÓ:');
  console.log(total);
} catch (err) {
  try { db.exec('ROLLBACK'); } catch (_) {}
  console.error('Lỗi khi nạp câu hỏi:', err);
}

