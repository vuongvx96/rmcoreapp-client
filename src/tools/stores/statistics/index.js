import { observable, action, runInAction, toJS, computed } from 'mobx'
import http from '../../axios'

class StatisticsStore {

  backgroundColor = [
    'rgba(255, 0, 0, 0.6)',
    'rgba(0, 255, 0, 0.6)',
    'rgba(0, 0, 255, 0.6)',
    'rgba(192, 192, 192, 0.6)',
    'rgba(255, 255, 0, 0.6)',
    'rgba(255, 0, 255, 0.6)',
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)'
  ]

  @observable freqRoomData = {
    barChart: {
      title: '',
      chartData: {
        labels: [],
        datasets: [
          {
            label: '',
            data: [],
            backgroundColor: []
          }
        ]
      }
    },
    pieChart: {
      title: '',
      chartData: {
        labels: [],
        datasets: [
          {
            label: '',
            data: [],
            backgroundColor: []
          }
        ]
      }
    }
  }
  @observable loading = false
  @observable islargeData = false

  @action fetchFreqRoom = async (timeType, fromDate, toDate) => {
    this.loading = true
    try {
      let params = {
        timeType: timeType,
        fromDate: fromDate.format('YYYY-MM-DD HH:mm:ss'),
        toDate: toDate.format('YYYY-MM-DD HH:mm:ss')
      }
      const response = await http.get('/statistics/freqroom', { params })
      runInAction('fetch freq room data', () => {
        if (response.status === 200) {
          let { barTitle, barLabels, barData, pieLabels, pieData } = response.data
          let length = barData.length
          this.islargeData = length > 12
          let newData = {
            barChart: {
              title: barTitle,
              chartData: {
                labels: barLabels,
                datasets: [
                  {
                    label: 'Số tiết TH',
                    data: barData,
                    backgroundColor: length <= 12 ? Array.from({ length: barData.length }).map(x => 'rgba(255, 159, 64, 0.6)') : ['rgba(46, 204, 113, 0.6)']
                  }
                ]
              }
            },
            pieChart: {
              chartData: {
                labels: pieLabels,
                datasets: [
                  {
                    label: 'Số tiết TH',
                    data: pieData,
                    backgroundColor: this.backgroundColor.slice(0, pieData.length)
                  }
                ]
              }
            }
          }
          this.freqRoomData = newData
        }
        this.loading = false
      })
      return response.status
    } catch (err) {
      this.loading = false
    }
  }

  @computed get freqRoomChartData() {
    return toJS(this.freqRoomData)
  }
}

export default new StatisticsStore()