import React from 'react'
import { Collapse, Icon } from 'antd'
import { Player } from 'video-react'
import logo from '../../assets/icons/Logo_NTU.png'
import B11 from './resources/B1-1.jpg'
import B12 from './resources/B1-2.jpg'
import B13 from './resources/B1-3.jpg'
import B21 from './resources/B2-1.jpg'
import B22 from './resources/B2-2.jpg'
import B23 from './resources/B2-3.jpg'
import B31 from './resources/B3-1.jpg'
import NKTH1 from './resources/NKTH-1.jpg'
import NKTH2 from './resources/NKTH-2.jpg'
import NKTH3 from './resources/NKTH-3.jpg'
import XLTH from './resources/XemLichTuanHover.jpg'
import XLDS from './resources/XemLichDS.jpg'
import NKTHV1 from './resources/NKTHV-1.jpg'
import DKLV1 from './resources/DKLV-1.jpg'
import DKLV2 from './resources/DKLV-2.jpg'
import TKTH from './resources/TKTH.jpg'
import VideoTKTH from './resources/Help-thongkethuchanh.mp4'

import './index.less'
import 'video-react/dist/video-react.css'

const { Panel } = Collapse

class Help extends React.Component {
  
  componentDidMount(){
    document.title = 'Lịch phòng máy - ' + this.props.route.displayName
  }
  render() {
    return (
      <>
        <div className='home-menu'>
          <div className='home-menu-logo'>
            <img src={logo} alt='G8-NTU' />
          </div>
        </div>
        <div className='help-title'>
          <h1>Tài liệu hướng dẫn sử dụng</h1>
          <h2>website quản lý phòng máy tính trường đại học nha trang</h2>
        </div>
        <div className='help-collapse'>
          <Collapse accordion bordered={false}>
            <Panel header='Đăng ký lịch thực hành' key='1'>
              <p style={{ paddingLeft: 24 }}>Để đăng ký, thầy/cô phải sử dụng trình duyệt Google Chrome hoặc FireFox trên máy tính.</p>
              <Collapse bordered={false}>
                <Panel className='collapse-b' header='Bước 1: Đăng ký nhóm thực hành' key='1'>
                  <p style={{ paddingLeft: 24 }}>Nếu đã có nhóm thực thành thì sang bước 2. Chưa có thì tiếp tục đăng ký nhóm thực hành theo các bước sau</p>
                  <div className='dang-ky-lich buoc1-1'>
                    <span><Icon type='caret-right' />Vào trang "Nhóm thực hành" ở mục "Quản lý"</span>
                    <img src={B11} alt='Vào trang "Nhóm thực hành" ở mục quản lý' />
                  </div>
                  <div className='dang-ky-lich buoc1-2'>
                    <span><Icon type='caret-right' />Thêm mới nhóm thực hành</span>
                    <img src={B12} alt='Thêm mới nhóm thực hành' />
                  </div>
                  <div className='dang-ky-lich buoc1-3'>
                    <span><Icon type='caret-right' />Nhập thông tin nhóm thực hành và lưu. Nếu chưa có lớp, môn học thì thêm lớp hoặc môn học ở trang lớp, môn học.</span>
                    <img src={B13} alt='Nhập thông tin nhóm thực hành và lưu' />
                  </div>
                </Panel>
                <Panel className='collapse-b' header='Bước 2: Đăng ký lịch' key='2'>
                  <div className='dang-ky-lich buoc2-1'>
                    <span><Icon type='caret-right' />Vào trang "Lịch của tôi" ở mục "Lịch"</span>
                    <img src={B21} alt='Vào trang "Lịch của tôi" ở mục "Lịch"' />
                  </div>
                  <div className='dang-ky-lich buoc2-2'>
                    <span><Icon type='caret-right' />Đăng ký mới lịch ở góc trên bên phải</span>
                    <img src={B22} alt='Đăng ký mới lịch ở góc trên bên phải' />
                  </div>
                  <div className='dang-ky-lich buoc2-3'>
                    <span><Icon type='caret-right' />Nhập thông tin đăng ký. Chọn đúng lớp thực hành cần đăng ký.</span>
                    <img src={B23} alt='Nhập thông tin đăng ký' />
                    <span><Icon type='caret-right' />Xem chi tiết lớp thực hành bằng cách di chuyển chuột vào ô đỏ số 1 như hình bên dưới.</span>
                    <img src={DKLV1} alt='Xem chi tiết lớp thực hành' />
                    <span><Icon type='caret-right' />Xem chi tiết phòng học bằng cách di chuyển chuột vào ô đỏ số 1, nếu phòng học đó chưa có phần mềm cần cài đặt để giảng dạy thì có thể nhập yêu cầu phần mềm cài đặt ở ô đỏ thứ 2. Xem hình bên dưới</span>
                    <img src={DKLV2} alt='Xem chi tiết phòng học' />
                    <span><Icon type='caret-right' />Trước khi đăng ký thầy/cô có thể kiểm tra xem lịch mình đăng ký có bị trùng hay không.</span>
                  </div>
                </Panel>
                <Panel className='collapse-b' header='Bước 3: Xác nhận mail' key='3'>
                  <p style={{ paddingLeft: 24 }}>Sau khi đăng ký ở web xong, thì phòng máy sẽ gửi email về địa chỉ email của giảng viên và admin để xác nhận đăng ký.</p>
                  <div className='dang-ky-lich buoc3-1'>
                    <span><Icon type='caret-right' />Xác nhận đăng ký được gửi về email</span>
                    <img src={B31} alt='Xác nhận đăng ký được gửi về email' />
                  </div>
                </Panel>
              </Collapse>
            </Panel>
            <Panel header='Tạo nhật ký thực hành' key='2'>
              <p style={{ paddingLeft: 24 }}>Để tạo nhật ký thực hành, thầy/cô phải sử dụng trình duyệt Google Chrome hoặc FireFox trên máy tính.</p>
              <p style={{ paddingLeft: 24 }}>Trong quá trình ghi nhật ký thực hành thì hệ thống sẽ kiểm tra thầy/cô có đăng nhập đúng máy quy định hay không. Một buổi thực hành chỉ được ghi tối đa 1 nhật ký.</p>
              <div className='nhat-ky-th'>
                <span><Icon type='caret-right' />Vào trang "Nhật ký thực hành" ở mục "Báo cáo - Thống kê"</span>
                <img src={NKTH1} alt='Vào trang "Nhật ký thực hành" ở mục "Báo cáo - Thống kê"' />
              </div>
              <div className='nhat-ky-th'>
                <span><Icon type='caret-right' />Tạo nhật ký thực hành ở góc trên bên phải</span>
                <img src={NKTH2} alt='Tạo nhật ký thực hành ở góc trên bên phải' />
              </div>
              <div className='nhat-ky-th'>
                <span><Icon type='caret-right' />Chọn lớp thực hành và xem chi tiết thông tin lớp thực hành trước khi đăng ký</span>
                <img src={NKTHV1} alt='Xem chi tiết thông tin lớp thực hành' />
                <span><Icon type='caret-right' />Nhập thông tin thực hành thích hợp và lưu</span>
                <img src={NKTH3} alt='Nhập thông tin thực hành ngày hôm nay và lưu' />

              </div>
            </Panel>
            <Panel header='Xem lịch theo tuần' key='3'>
              <p style={{ paddingLeft: 24 }}>Hệ thống sẽ hiện thị lịch theo tuần và phòng mà thầy/cô đã chọn.</p>
              <div className='xem-lich-tuan'>
                <span><Icon type='caret-right' />Di chuyển chuột vào ô lịch để xem thông tin chi tiết phòng học hôm đó.</span>
                <img src={XLTH} alt='Xem lịch tuần'></img>
              </div>
            </Panel>
            <Panel header='Xem lịch theo danh sách' key='4'>
              <p style={{ paddingLeft: 24 }}>Hệ thống sẽ hiển thị lịch theo dạng danh sách</p>
              <div className='xem-lich-tuan'>
                <span><Icon type='caret-right' />Có thể tra cứu lịch theo tháng và các thông tin khác. Di chuyển chuột vào cột khung giờ của từng lịch để xem chi tiết.</span>
                <img src={XLDS} alt='Xem lịch tuần'></img>
              </div>
            </Panel>
            <Panel header='Thống kê thực hành' key='5'>
              <Player
                playsInline
                poster={TKTH}
                src={VideoTKTH}
              >
              </Player>
            </Panel>
          </Collapse>
        </div>
        <div className='footer'>
          <div className='footer-text'>
            <p>&#169; 2019 Trường Đại Học Nha Trang</p>
            <p>Địa chỉ: số 02 Nguyễn Đình Chiểu - Nha Trang - Khánh Hòa. ĐT: 0583 831 149</p>
            <p>Website được thể hiện tốt nhất ở độ phân giải 1024 x 768 trở lên với trình duyệt FireFox, Google Chrome, Edge.</p>
          </div>
        </div>
      </>
    )
  }
}

export default Help
