import { action, observable, computed, runInAction, toJS } from 'mobx'
import http from '../../axios'

class RoomStore {

	@observable entities = new Map()
	@observable loading = false

	startAsync = () => {
		this.loading = true
	}

	@action fetchAll = async () => {
		this.startAsync()
		try {
			const response = await http.get('/rooms')
			runInAction('fetch all entities', () => {
				this.entities = new Map(response.data.map(i => [i.roomId, i]))
				this.loading = false
			})
			return response
		} catch (err) {
			return err
		}
	}

	@action create = async (entity) => {
		this.startAsync()
		try {
			const response = await http.post('/rooms', entity)
			runInAction('entity created', () => {
				entity.computers = []
				entity.equipments = []
				this.entities.set(entity.roomId, entity)
				this.loading = false
			})
			return response
		} catch (err) {
			return err
		}
	}

	@action update = async (entity) => {
		this.startAsync()
		try {
			const response = await http.put('/rooms', entity)
			runInAction('entity updated', () => {
				this.entities.set(entity.roomId, entity)
				this.loading = false
			})
			return response
		} catch (err) {
			return err
		}
	}

	@action delete = async (id) => {
		try {
			const response = await http.delete(`/rooms/${id}`)
			runInAction('entity deleted', () => {
				this.entities.delete(id)
				this.loading = false
			})
			return response
		} catch (err) {
			return err
		}
	}

	@computed get listRooms() {
		var list = Object.values(toJS(this.entities))
		list.forEach(item => {
			item.detail = `${item.computers.length} máy tính, ${item.equipments.length} máy chiếu, ${item.note}`
		})
		return list
	}
}

export default new RoomStore()