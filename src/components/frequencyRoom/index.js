import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import { Bar, Line, Pie } from 'react-chartjs-2'
import { Select, DatePicker, Divider, Button } from 'antd'
import locale from 'antd/lib/date-picker/locale/vi_VN'
import moment from 'moment'

moment.locale('vi')
const { Option } = Select
const { RangePicker, WeekPicker } = DatePicker

@inject('statisticsStore')
@observer
class FrequencyRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dateValue: moment(),
      weekValue: moment().weekday(1),
      dateRange: [moment().add(-30, 'd'), moment()],
      timeType: 1,
      isOpenDP: false,
    }
  }

  handleSearch = () => {
    let { timeType, dateValue, weekValue, dateRange } = this.state
    let fromDate, toDate
    if (timeType === 1) {
      fromDate = dateValue
      toDate = dateValue
    } else if (timeType === 2) {
      fromDate = dateRange[0]
      toDate = dateRange[1]
    } else {
      fromDate = weekValue
      toDate = weekValue
    }
    this.props.statisticsStore.fetchFreqRoom(timeType, fromDate, toDate)
  }

  componentDidMount() {
    document.title = 'Lịch phòng máy | ' + this.props.route.displayName
    let { timeType, dateValue } = this.state
    this.props.statisticsStore.fetchFreqRoom(timeType, dateValue, dateValue)
  }

  render() {
    const { freqRoomChartData, loading, islargeData } = this.props.statisticsStore
    const { timeType, dateValue, isOpenDP, weekValue, dateRange } = this.state
    return (
      <>
        <div className='flex-container' style={{ paddingBottom: 10, width: '100%' }}>
          <div className='left-items'>
            <span>Dữ liệu:</span>
            <Select defaultValue={1} style={{ width: 130 }} onChange={(value) => {
              this.setState({ timeType: value })
            }}>
              <Option value={1}>Theo năm</Option>
              <Option value={2}>Theo ngày</Option>
              <Option value={3}>Theo tuần</Option>
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
              : timeType === 2
                ? <RangePicker
                  format='DD/MM/YYYY'
                  value={dateRange}
                  locale={locale}
                  separator='-'
                  onChange={(dates) => {
                    this.setState({ dateRange: dates })
                  }}
                />
                : <WeekPicker
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
            {islargeData
              ? <Line
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
                  scales: {
                    xAxes: [{
                      ticks: { autoSkip: true, maxTicksLimit: 25 },
                      gridLines: {
                        display: false
                      }
                    }],
                    yAxes: [{

                      gridLines: {
                        display: false
                      }
                    }]
                  },
                  maintainAspectRatio: false
                }}
              />
              : <Bar
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
            }
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