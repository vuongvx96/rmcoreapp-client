import React from 'react'
import { Tabs, Icon, Row, Col, Collapse } from 'antd'
import { Link } from 'react-router-dom'
import logo from '../../assets/icons/Logo_NTU.png'
import './index.less'

const { Panel } = Collapse;
function callback(key) {
  console.log(key);
}

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const genExtra = () => (
  <Icon
    type="setting"
    onClick={event => {
      // If you don't want click extra trigger collapse, you can prevent this:
      event.stopPropagation();
    }}
  />
);

class Home extends React.Component {
  render() {
    return (
      <>
        <div className='home-menu'>
          <div className='home-menu-logo'>
            <img src={logo} alt='G8-NTU' />
            <div className='home-menu-login'>
              <Link className='ant-btn ant-btn-background-ghost' to='/login'>
                <Icon type='login' />
                <span>Đăng nhập</span>
              </Link>
            </div>
          </div>
        </div>
        <Tabs
          defaultActiveKey='1'
          tabBarGutter={0}
          tabBarStyle={{ marginBottom: 12, borderBottom: '1px solid #BDC3C7' }}
          size='small'
        >
          <Tabs.TabPane
            key='1'
            tab={<span><Icon type="schedule" />Lịch thực hành</span>}
            className='aaa'
          >
            <div className='schedule-desktop'>
              <Row className='desktop-row-title'>
                <Col className='desktop-col-title desktop-col-time' md={3}><span>Giờ</span></Col>
                <Col className='desktop-col-title' md={3}><span>Thứ 2 - 24/06</span></Col>
                <Col className='desktop-col-title' md={3}><span>Thứ 3 - 24/06</span></Col>
                <Col className='desktop-col-title' md={3}><span>Thứ 4 - 24/06</span></Col>
                <Col className='desktop-col-title' md={3}><span>Thứ 5 - 24/06</span></Col>
                <Col className='desktop-col-title' md={3}><span>Thứ 6 - 24/06</span></Col>
                <Col className='desktop-col-title' md={3}><span>Thứ 7 - 24/06</span></Col>
                <Col className='desktop-col-title' md={3}><span>Chủ nhật - 24/06</span></Col>
              </Row>
              <Row className='desktop-row-info desktop-row-info-color'>
                <Col className='desktop-col-info desktop-col-time' md={3}><span>Sáng</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
              </Row>
              <Row className='desktop-row-info'>
                <Col className='desktop-col-info desktop-col-time' md={3}><span>Chiều</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
              </Row>
              <Row className='desktop-row-info desktop-row-info-color'>
                <Col className='desktop-col-info desktop-col-time' md={3}><span>Tối</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                <Col className='desktop-col-info' md={3}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
              </Row>
            </div>
            <div className='schedule-mobile'>
              <div className='mobile-sang'>
                <Row className='mobile-row-time'>
                  <Col className='mobile-col-time'><span>Sáng</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Thứ 2 - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Thứ 3 - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Thứ 4 - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Thứ 5 - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Thứ 6 - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Thứ 7 - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Chủ nhật - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
              </div>
              <div className='mobile-chieu'>
                <Row className='mobile-row-time'>
                  <Col className='mobile-col-time'><span>Chiều</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Thứ 2 - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Thứ 3 - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Thứ 4 - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Thứ 5 - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Thứ 6 - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Thứ 7 - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Chủ nhật - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
              </div>
              <div className='mobile-toi'>
                <Row className='mobile-row-time'>
                  <Col className='mobile-col-time'><span>Tối</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Thứ 2 - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Thứ 3 - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Thứ 4 - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Thứ 5 - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Thứ 6 - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Thứ 7 - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
                <Row className='mobile-row-t'>
                  <Col className='mobile-col-title' xs={6} md={6}><span>Chủ nhật - 24/06</span></Col>
                  <Col className='mobile-col-info' xs={18} md={18}><span>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</span></Col>
                </Row>
              </div>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane
            key='2'
            tab={<span><Icon type="bell" />Thông báo</span>}
          >
            <Collapse
              defaultActiveKey={['1']}
              onChange={callback}
              // expandIconPosition={expandIconPosition}
              className='thong-bao'
            >
              <Panel header="This is panel header 1" key="1" extra={genExtra()}>
                <div>{text}</div>
              </Panel>
              <Panel header="This is panel header 2" key="2" extra={genExtra()}>
                <div>{text}</div>
              </Panel>
              <Panel header="This is panel header 3" key="3" extra={genExtra()}>
                <div>{text}</div>
              </Panel>
            </Collapse>
          </Tabs.TabPane>
        </Tabs>
      </>
    )
  }
}

export default Home
