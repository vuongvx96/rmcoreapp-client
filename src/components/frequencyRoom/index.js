import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Bar, Pie } from 'react-chartjs-2'
import { Select, DatePicker, Divider, Button } from 'antd'
import locale from 'antd/lib/date-picker/locale/vi_VN'
import moment from 'moment'

moment.locale('vi')
const { Option } = Select

@inject('statisticsStore')
@observer
class FrequencyRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dateValue: moment(),
      weekValue: moment().weekday(1),
      timeType: 1,
      isOpenDP: false,
    }
  }

  handleSearch = () => {
    let { timeType, dateValue, weekValue } = this.state
    this.props.statisticsStore.fetchFreqRoom(timeType, timeType === 1 ? dateValue : weekValue)
  }

  componentDidMount() {
    document.title = 'Lịch phòng máy | ' + this.props.route.displayName
    let { timeType, dateValue, weekValue } = this.state
    this.props.statisticsStore.fetchFreqRoom(timeType, timeType === 1 ? dateValue : weekValue)
  }

  render() {
    const { freqRoomChartData, loading } = this.props.statisticsStore
    const { timeType, dateValue, isOpenDP, weekValue } = this.state
    return (
      <>
        <div className='flex-container' style={{ paddingBottom: 10, width: '100%' }}>
          <div className='left-items'>
            <span>Dữ liệu:</span>
            <Select defaultValue={1} style={{ width: 130 }} onChange={(value) => {
              this.setState({ timeType: value })
            }}>
              <Option value={1}>Theo năm</Option>
              <Option value={2}>Theo tuần</Option>
            </Select>
            {timeType === 1
              ? <DatePicker
                style={{ width: 125 }}
                locale={locale}
                allowClear={false}
                open={isOpenDP}
                mode='year'
                format='YYYY'
                value={dateValue}
                onOpenChange={(status) => {
                  if (status) {
                    this.setState({ isOpenDP: true })
                  } else {
                    this.setState({ isOpenDP: false })
                  }
                }}
                onPanelChange={(v) => {
                  this.setState({
                    dateValue: v,
                    isOpenDP: false
                  })
                }}
                onChange={(date) => {
                  this.setState({ dateValue: date })
                }}
              />
              : <DatePicker.WeekPicker
                style={{ width: 125 }}
                allowClear={false}
                value={weekValue}
                locale={locale}
                onChange={(date) => {
                  this.setState({ weekValue: date.weekday(1) })
                }}
              />
            }
            <Button icon='search' loading={loading} onClick={this.handleSearch}>
              Xem
            </Button>
          </div>
        </div>
        <div className='chart' style={{ display: 'flex', paddingBottom: 10, width: '100%', height: 'calc(100vh - 160px)' }}>
          <div style={{ width: '70%' }}>
            <Bar
              data={freqRoomChartData.barChart.chartData}
              options={{
                title: {
                  display: true,
                  text: freqRoomChartData.barChart.title,
                  fontSize: 25
                },
                legend: {
                  display: false,
                  position: 'right'
                },
                maintainAspectRatio: false
              }}
            />
          </div>
          <Divider type='vertical' style={{ margin: '0 15px', background: 'darkgrey', height: 'unset' }} />
          <div style={{ width: '30%' }}>
            <Pie
              data={freqRoomChartData.pieChart.chartData}
              options={{
                legend: {
                  display: true,
                  position: 'bottom'
                },
                maintainAspectRatio: false
              }}
            />
          </div>
        </div>
      </>
    )
  }
}

export default FrequencyRoom