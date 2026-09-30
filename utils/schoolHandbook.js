// Nội dung sổ tay: cập nhật bài và ngày khi quy trình được xác nhận thay đổi.
export const updatedAt = '30/09/2026';
export const groups = ['Hồ sơ và quá trình theo học', 'Công việc hằng ngày', 'Học phí và tài chính', 'Quản lý nhà trường'];
export const audiences = ['Giáo viên', 'Kế toán', 'Ban giám hiệu'];
export const articles = [
  {
    id: 'nhap-hoc', title: 'Đón bé mới nhập học', group: 0, roles: ['Kế toán', 'Ban giám hiệu'],
    summary: 'Tạo hồ sơ, xếp lớp và kiểm tra thông tin trước ngày bé đi học.', keywords: 'nhập học thêm học sinh đăng ký mới',
    prepare: 'Họ tên, ngày sinh của bé; thông tin phụ huynh; ngày vào học, lớp và biểu phí được trường duyệt.',
    steps: ['Mở danh sách học sinh, tìm tên bé hoặc số điện thoại phụ huynh trước để tránh tạo trùng. Nếu gia đình đã có bé học tại trường, kiểm tra hồ sơ phụ huynh đang có.', 'Nếu chưa có hồ sơ, mở Tạo học sinh mới. Nhập Tên học sinh, Biệt danh (nếu có), chọn ngày sinh, điền thông tin bố/mẹ và bấm Tạo một lần.', 'Mở hồ sơ vừa tạo. Điền Ngày vào học theo ngày/tháng/năm, ví dụ 05/10/2026. Chọn Lớp học hiện tại, Trạng thái học và Áp dụng Biểu phí năm theo thông tin đã duyệt.', 'Bấm Lưu toàn bộ hồ sơ. Nhờ người phụ trách kiểm tra liên kết phụ huynh và đăng ký camera nếu gia đình có nhu cầu.'],
    check: 'Mở lại hồ sơ: đúng tên, ngày sinh, ngày vào học, lớp, trạng thái và biểu phí. Giáo viên kiểm tra bé đã có trong danh sách lớp.',
    help: 'Không chắc biểu phí nào: hỏi kế toán trước khi chọn. Biểu phí năm không phải năm sinh của bé. Nếu lưu báo lỗi, tìm lại hồ sơ trước khi bấm tạo thêm.',
    links: [{ label: 'Mở danh sách học sinh', to: '/hocsinh', access: 'school' }, { label: 'Tạo học sinh mới', to: '/hocsinh/create', access: 'school' }], related: ['ho-so', 'camera', 'tao-phi']
  },
  {
    id: 'ho-so', title: 'Sửa hồ sơ bé và thông tin phụ huynh', group: 0, roles: audiences,
    summary: 'Tra cứu bé, cập nhật thông tin và xử lý khi phụ huynh đổi số điện thoại.', keywords: 'ngày sinh ngày nhập học đổi số điện thoại bố mẹ tên sai',
    prepare: 'Tên bé, lớp và thông tin mới đã được phụ huynh xác nhận.',
    steps: ['Mở danh sách học sinh và chọn đúng bé. Đối chiếu thêm lớp hoặc tên phụ huynh nếu có bé trùng tên.', 'Người được phân công sửa thông tin trong hồ sơ. Ngày sinh và Ngày vào học nhập theo ngày/tháng/năm, ví dụ 15/08/2022.', 'Bấm Lưu toàn bộ hồ sơ, chờ thông báo rồi mở lại để kiểm tra.', 'Nếu phụ huynh đổi số điện thoại, báo người quản lý hồ sơ phụ huynh cập nhật và kiểm tra lại tài khoản camera. Giáo viên không cần vào phần cài đặt kỹ thuật.'],
    check: 'Thông tin mới còn đúng sau khi mở lại. Các bé chung phụ huynh vẫn liên kết đúng gia đình.',
    help: 'Không thấy quyền sửa hoặc thông tin bị trùng: gửi tên bé, lớp và nội dung cần sửa cho quản lý. Không tạo hồ sơ mới chỉ để thay số điện thoại.',
    links: [{ label: 'Mở danh sách học sinh', to: '/hocsinh', access: 'students' }], related: ['camera', 'nhap-hoc']
  },
  {
    id: 'chuyen-lop', title: 'Chuyển lớp cho bé', group: 0, roles: ['Ban giám hiệu', 'Kế toán'],
    summary: 'Đổi lớp và kiểm tra danh sách, camera, học phí liên quan.', keywords: 'phân lớp lớp mới',
    prepare: 'Lớp mới và thời điểm chuyển đã được nhà trường xác nhận.',
    steps: ['Mở đúng hồ sơ bé trong danh sách học sinh.', 'Tại Phân Lớp & Biểu Phí, đổi Lớp học hiện tại sang lớp mới rồi bấm Lưu toàn bộ hồ sơ.', 'Nhờ giáo viên lớp mới kiểm tra danh sách điểm danh. Báo kế toán nếu bé chuyển trong tháng đang kết sổ.', 'Nhờ người phụ trách camera kiểm tra phụ huynh xem đúng lớp mới sau khi chuyển.'],
    check: 'Hồ sơ hiển thị lớp mới; giáo viên nhận đúng bé; các khoản thu chung không bị tính hai lần.',
    help: 'Nếu lớp hoặc quyền camera chưa đúng, báo quản lý kiểm tra. Không tạo thêm một hồ sơ bé ở lớp mới.',
    links: [{ label: 'Mở danh sách học sinh', to: '/hocsinh', access: 'school' }], related: ['diem-danh', 'camera', 'ket-so']
  },
  {
    id: 'tam-nghi', title: 'Bé tạm nghỉ hoặc đi học lại', group: 0, roles: audiences,
    summary: 'Ghi nhận thay đổi trạng thái và phối hợp với kế toán, giáo viên.', keywords: 'nghỉ học trở lại mở lại',
    prepare: 'Tên bé, lớp, thời gian nghỉ hoặc ngày quay lại đã được xác nhận.',
    steps: ['Giáo viên báo thông tin cho người quản lý hồ sơ. Nghỉ một vài buổi vẫn cần điểm danh đúng từng ngày; không tự suy thành thôi học.', 'Người được phân công mở hồ sơ, chọn Trạng thái học là Tạm nghỉ; khi bé quay lại, chọn Đang học.', 'Bấm Lưu toàn bộ hồ sơ và kiểm tra lại. Báo giáo viên để điểm danh theo tình hình thực tế.', 'Báo kế toán kiểm tra khoản thu trong thời gian nghỉ và người phụ trách camera kiểm tra quyền xem.'],
    check: 'Trạng thái đúng; điểm danh đúng ngày; kế toán đã nắm thời gian nghỉ và quay lại.',
    help: 'Đổi trạng thái không đồng nghĩa đã hủy phí hoặc hoàn tiền. Bé tạm nghỉ vẫn có thể hiện trong danh sách điểm danh.',
    links: [{ label: 'Mở danh sách học sinh', to: '/hocsinh', access: 'students' }], related: ['diem-danh', 'tao-phi', 'thoi-hoc']
  },
  {
    id: 'thoi-hoc', title: 'Làm thủ tục thôi học', group: 0, roles: ['Kế toán', 'Ban giám hiệu'],
    summary: 'Ghi nhận nghỉ hẳn, đối chiếu tiền và kiểm tra quyền camera.', keywords: 'nghỉ luôn nghỉ hẳn rút hồ sơ',
    prepare: 'Xác nhận thôi học, ngày nghỉ thực tế và các khoản cần đối chiếu với phụ huynh.',
    steps: ['Kiểm tra đúng hồ sơ bé và trao đổi với kế toán về khoản còn phải thu hoặc cần điều chỉnh.', 'Trong hồ sơ, chọn Trạng thái học là Nghỉ luôn / Thôi học, rồi bấm Lưu toàn bộ hồ sơ.', 'Kế toán rà soát phiếu và khoản thu liên quan. Các trường hợp giảm hoặc hoàn tiền thực hiện theo quyết định của trường.', 'Nhờ người phụ trách kiểm tra quyền camera của gia đình. Nếu phụ huynh còn bé khác đang học, cần kiểm tra quyền của bé còn lại.'],
    check: 'Hồ sơ đã ghi nghỉ hẳn; danh sách điểm danh hiện tại không còn tính bé vào sĩ số; hồ sơ và lịch sử thu vẫn được giữ.',
    help: 'Không xóa hồ sơ để cho bé thôi học. Nếu phiếu đã chốt hoặc có tiền cần hoàn, chuyển kế toán xử lý; đổi trạng thái không tự giải quyết các khoản này.',
    links: [{ label: 'Mở danh sách học sinh', to: '/hocsinh', access: 'school' }], related: ['thu-tien', 'camera', 'ket-so']
  },
  {
    id: 'diem-danh', title: 'Điểm danh hôm nay và sửa điểm danh nhầm', group: 1, roles: audiences,
    summary: 'Chọn đúng ngày, đúng lớp, ghi có mặt/vắng rồi kiểm tra sau khi lưu.', keywords: 'đi học chuyên cần sĩ số có mặt vắng quên lưu',
    prepare: 'Danh sách bé thực tế có mặt và ngày cần điểm danh.',
    steps: ['Mở Điểm danh, chọn lớp và ngày cần ghi. Kiểm tra lại tên lớp, ngày ở đầu màn hình trước khi thay đổi.', 'Đánh dấu có mặt hoặc vắng cho từng bé. Chỉ dùng Tất cả đi học nếu đã kiểm tra cả lớp; sau đó sửa lại những bé vắng nếu cần.', 'Đối chiếu ba số Sĩ số, Có mặt và Vắng với thực tế, rồi bấm nút lưu ở cuối màn hình.', 'Chờ báo lưu thành công. Mở lại ngày vừa ghi để kiểm tra. Nếu nhầm, mở phiếu ngày đó, sửa và lưu lại.'],
    check: 'Đúng ngày và lớp; số có mặt cộng số vắng bằng sĩ số; không còn thông báo Có thay đổi chưa lưu.',
    help: 'Không có tên bé: báo quản lý kiểm tra lớp và trạng thái hồ sơ. Mất mạng hoặc lưu báo lỗi: mở lại phiếu kiểm tra trước khi làm tiếp. Nếu tháng đã tính giảm nghỉ, báo kế toán sau khi sửa điểm danh.',
    note: 'Điểm danh ảnh hưởng đến tiền giảm nghỉ học. Trong ngày trường có học, nếu không có ghi nhận bé có mặt thì khi tính giảm nghỉ bé được tính là nghỉ, kể cả khi thiếu phiếu điểm danh.',
    links: [{ label: 'Mở màn hình điểm danh', to: '/dihoc', access: 'students' }], related: ['lich-hoc', 'tao-phi']
  },
  {
    id: 'lich-hoc', title: 'Kiểm tra lịch học, ngày nghỉ và học bù', group: 1, roles: ['Ban giám hiệu', 'Kế toán'],
    summary: 'Thống nhất ngày trường có học trước khi đối chiếu chuyên cần.', keywords: 'lễ tết chủ nhật lịch trường',
    prepare: 'Lịch tháng được trường duyệt, gồm ngày nghỉ lễ và ngày học bù.',
    steps: ['Nút bên dưới mở lịch tháng hiện tại. Kiểm tra tháng/năm ở tiêu đề; nếu cần tháng khác, mở lịch của tháng đó từ màn hình kết sổ.', 'Đối chiếu với lịch được duyệt. Ngày có học chọn Bình thường; ngày trường không học chọn Nghỉ học.', 'Bấm Lưu lại, mở lại để kiểm tra các ngày vừa đổi và thông báo cho giáo viên, kế toán.', 'Trước khi tính giảm nghỉ, kiểm tra lịch của cả tháng đối soát một lần nữa.'],
    check: 'Ngày nghỉ lễ và học bù đã đúng; giáo viên và kế toán dùng cùng một lịch.',
    help: 'Nếu lịch thay đổi sau khi đã tính giảm nghỉ, báo kế toán để kiểm tra đợt tính cũ trước khi tính lại.',
    note: 'Ngày trường không học không tính là ngày bé nghỉ và không làm đứt chuỗi ngày học nghỉ liên tiếp.',
    links: [{ label: 'Mở lịch học', to: '/lichhoc', access: 'school' }], related: ['diem-danh', 'tao-phi']
  },
  {
    id: 'camera', title: 'Hỗ trợ camera cho phụ huynh', group: 1, roles: audiences,
    summary: 'Tiếp nhận đăng ký, đổi số điện thoại hoặc báo không xem được.', keywords: 'camera tài khoản điện thoại không xem được khóa mở lại',
    prepare: 'Tên bé, lớp, số điện thoại đăng ký và mô tả lỗi của phụ huynh.',
    steps: ['Kiểm tra đúng phụ huynh và số điện thoại đang dùng; hỏi phụ huynh không đăng nhập được hay đăng nhập được nhưng không thấy lớp.', 'Gửi thông tin cho người phụ trách camera để kiểm tra tài khoản, tình trạng hoạt động và lớp được xem.', 'Nếu đổi số, chuyển lớp hoặc bé nghỉ học, đề nghị kiểm tra cả quyền cũ và quyền mới. Không chỉ sửa ghi chú Gói Camera phụ huynh trong hồ sơ bé.', 'Sau khi người phụ trách xử lý, nhờ phụ huynh mở lại và xác nhận xem được đúng lớp.'],
    check: 'Phụ huynh xác nhận kết quả; tài khoản xem đúng lớp được cấp.',
    help: 'Khi báo lỗi, ghi thời điểm và nội dung thông báo, có thể gửi ảnh lỗi đã che thông tin riêng tư. Không gửi mật khẩu trong nhóm chung.',
    note: 'Phí camera dựa trên số điện thoại không trùng có tài khoản camera đang hoạt động. Số được miễn và đơn giá theo cấu hình của trường; khoản chung phụ huynh chỉ thu một lần.',
    links: [], related: ['ho-so', 'chuyen-lop', 'tao-phi']
  },
  {
    id: 'tao-phi', title: 'Tạo khoản thu và điều chỉnh số tiền', group: 2, roles: ['Kế toán', 'Ban giám hiệu'],
    summary: 'Tạo học phí, camera, giảm nghỉ và thêm khoản điều chỉnh cho từng bé.', keywords: 'tính tiền miễn giảm giảm trừ khác phí mở rộng giảm nghỉ học',
    prepare: 'Kỳ thu, biểu phí, hồ sơ bé, lịch học và điểm danh đã được kiểm tra.',
    steps: ['Mở Tạo phí & Lịch tự động. Chọn loại phí và đúng kỳ; với giảm nghỉ học, chọn tháng cần đối soát.', 'Xem trước kết quả nếu có, rồi chạy tạo phí. Chờ đợt chạy xong và đọc các dòng báo lỗi, không chỉ nhìn số lượng đã tạo.', 'Mở Tra cứu khoản phí để đối chiếu tên bé/phụ huynh, kỳ thu và số tiền.', 'Muốn thêm khoản riêng: mở phiếu kết sổ còn nháp, tìm đúng dòng bé, bấm ＋ tại Phí mở rộng hoặc Giảm trừ khác. Nhập Diễn giải và số tiền dương, rồi bấm Lưu khoản phí.', 'Muốn hủy khoản vừa thêm: bấm số tiền để xem chi tiết, chọn Xóa khoản nếu có nút này và xác nhận. Kiểm tra tổng thu sau khi hủy.'],
    check: 'Giảm trừ khác làm giảm tổng phải thu và nằm riêng với Giảm nghỉ học. Ví dụ nhập 100000 để giảm 100.000đ; không nhập dấu trừ.',
    help: 'Không có nút Xóa khoản hoặc phiếu đã chốt: nhờ quản lý/kế toán kiểm tra. Đợt tạo phí có lỗi cần xem nguyên nhân trước khi chạy lại; không tự thêm khoản bù khi chưa đối chiếu.',
    note: 'Giảm nghỉ: đủ 3 ngày học nghỉ liên tiếp thì giảm cả chuỗi, không nối qua hai tháng; áp dụng vào kỳ thu tháng sau. Hồ sơ chưa có ngày vào học được tính từ đầu tháng. Tính sớm trong tháng chỉ xét đến ngày chạy (giờ Việt Nam), các ngày sau tạm coi có mặt để tính và không ghi điểm danh giả. Khoản giảm không phải giao dịch hoàn tiền.',
    links: [{ label: 'Mở Tạo phí & Lịch tự động', to: '/khoanphi/cauhinh', access: 'fees' }, { label: 'Mở Tra cứu khoản phí', to: '/khoanphi', access: 'fees' }], related: ['diem-danh', 'lich-hoc', 'ket-so']
  },
  {
    id: 'ket-so', title: 'Kết sổ tháng', group: 2, roles: ['Kế toán', 'Ban giám hiệu'],
    summary: 'Đối chiếu từng bé, thêm điều chỉnh và chốt phiếu của lớp.', keywords: 'chốt sổ tổng tiền phiếu nháp tháng thu',
    prepare: 'Các khoản phí đã tạo; lịch, điểm danh và giảm nghỉ đã đối chiếu.',
    steps: ['Mở Kết sổ, chọn tháng đối soát và lớp. Đọc cả Tháng đối soát và Kỳ thu ở đầu phiếu: ví dụ đối soát tháng 09 thì kỳ thu là tháng 10.', 'Bấm Tải lại phí. Nếu có cảnh báo Chưa tạo học phí, quay lại tạo phí và xử lý trước khi chốt.', 'Kiểm tra từng dòng bé và tổng lớp. Bấm số tiền để xem chi tiết; khoản Thu chung tại một bé khác không thu thêm lần nữa.', 'Bổ sung Phí mở rộng hoặc Giảm trừ khác bằng nút ＋ đúng dòng bé nếu cần. Chọn Lưu nháp khi còn cần rà soát.', 'Khi số liệu đã đúng, bấm Chốt sổ và xác nhận. Kiểm tra trạng thái Đã chốt. Nếu hiện Đang chốt — có thể tiếp tục, kiểm tra thông báo rồi dùng Tiếp tục chốt.'],
    check: 'Tổng tiền đúng, khoản chung không trùng, phiếu ở trạng thái Đã chốt. Dấu — nghĩa là chưa có khoản phí ở cột đó, không khẳng định khoản đã được tính ra 0đ.',
    help: 'Phát hiện sai sau khi chốt: ghi tên lớp, kỳ thu, tên bé và khoản sai để kế toán/quản lý kiểm tra. Không lập thêm phiếu để bù khi chưa rõ cách xử lý.',
    note: 'Hiện tại chốt sổ mới lưu chứng từ và các khoản phí. Chưa tự gửi thông báo, tạo mã thanh toán hoặc ghi tăng công nợ từ phiếu mới.',
    links: [{ label: 'Mở kết sổ', to: '/ketso', access: 'school' }], related: ['tao-phi', 'thu-tien']
  },
  {
    id: 'thu-tien', title: 'Thông báo thu tiền, thanh toán và công nợ', group: 2, roles: ['Kế toán', 'Ban giám hiệu'],
    summary: 'Phân biệt số phải thu, số đã thu và khoản còn nợ.', keywords: 'chuyển khoản tiền mặt vietqr hoàn tiền thu thiếu thu thừa', status: 'Quy trình từ kết sổ mới đang hoàn thiện',
    prepare: 'Phiếu đã đối chiếu, thông tin phụ huynh và bằng chứng thanh toán thực tế.',
    steps: ['Kế toán kiểm tra đúng phụ huynh, bé, kỳ thu và số phải thu trước khi thông báo.', 'Khi phụ huynh báo đã chuyển tiền, đối chiếu giao dịch thực tế hoặc chứng từ nhận tiền trước khi ghi nhận.', 'Dùng quy trình thu chi hiện hành đã được trường hướng dẫn. Kiểm tra số tiền và chứng từ để tránh ghi nhận hai lần.', 'Đối chiếu số còn nợ, thu thiếu hoặc thu thừa; chuyển người có thẩm quyền xử lý các khoản cần điều chỉnh hoặc hoàn tiền.'],
    check: 'Có chứng từ đối chiếu cho khoản đã thu. Chốt sổ không có nghĩa là phụ huynh đã thanh toán.',
    help: 'Nếu chưa được hướng dẫn màn hình thu chi hiện hành, liên hệ kế toán phụ trách trước khi ghi nhận. Giáo viên chỉ chuyển thông tin thanh toán cho kế toán.',
    note: 'Chưa có hướng dẫn thao tác phát hành thông báo, mã thanh toán và ghi công nợ từ kết sổ mới vì luồng này chưa hoàn thiện. Không coi việc chốt phiếu là đã thực hiện các bước đó.',
    links: [{ label: 'Mở Thu chi phụ huynh', to: '/dongtien', access: 'school' }, { label: 'Mở Phụ huynh & Sổ nợ', to: '/no', access: 'school' }], related: ['ket-so', 'thoi-hoc']
  },
  {
    id: 'thiet-lap', title: 'Cài đặt, phân quyền và xem báo cáo', group: 3, roles: ['Ban giám hiệu', 'Kế toán'],
    summary: 'Quản lý biểu phí, quyền làm việc và đối chiếu báo cáo.', keywords: 'thiết lập học phí báo cáo tài khoản quyền truy cập',
    prepare: 'Quy định hoặc biểu phí đã được duyệt; danh sách nhân sự và công việc được giao.',
    steps: ['Mở Cài đặt nhà trường để kiểm tra biểu phí và các thiết lập thuộc phạm vi được giao.', 'Trước khi đổi biểu phí, thống nhất với kế toán thời điểm áp dụng và các khoản đã tạo cần đối chiếu.', 'Khi cần cấp hoặc đổi quyền nhân sự, gửi yêu cầu cho quản trị viên, nêu rõ người dùng và công việc cần thực hiện.', 'Khi xem báo cáo, kiểm tra kỳ, lớp và phạm vi số liệu; đối chiếu về khoản phí hoặc chứng từ gốc nếu số tiền khác dự kiến.'],
    check: 'Nhân sự thấy các màn hình phù hợp công việc. Biểu phí đúng quyết định của trường và được kiểm tra trước đợt tạo phí tiếp theo.',
    help: 'Không thấy phần kỹ thuật là bình thường nếu tài khoản không phải quản trị kỹ thuật. Thiếu quyền làm việc: báo quản lý, không dùng chung tài khoản của người khác.',
    links: [{ label: 'Mở Cài đặt nhà trường', to: '/setup', access: 'school' }], related: ['tao-phi', 'ket-so']
  }
];

export function normalizeSearch(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
}

export function searchArticles(query, audience = '') {
  const words = normalizeSearch(query).split(/\s+/).filter(Boolean);
  return articles.filter(article => (!audience || article.roles.includes(audience)) && words.every(word =>
    normalizeSearch([article.title, article.summary, article.keywords, article.prepare, ...article.steps, article.check, article.help, article.note || ''].join(' ')).includes(word)));
}
