import { app } from '@/main'
import swal from 'sweetalert2'
import DateUtil from '../../mixins/dateUtilMixin'
import TaskService from '../../services/task.service'

const tasksModule = {
  namespaced: true,
  // ==================================
  // == State
  // ==================================
  state: {
    tasks: [],
    status: {}
  },

  // ==================================
  // == Mutations
  // ==================================
  mutations: {
    RESET: (state) => {
      state.tasks = []
      state.status = {}
    },

    FETCH_ALL_REQUEST: (state) => {
      state.status = { isRetrieving: true }
    },
    FETCH_ALL_SUCCESS: (state, tasks) => {
      state.tasks = tasks ?? [] // @TODO remove later
      state.status = {}
    },
    FETCH_ALL_FAILURE: (state, reason) => {
      state.status = { error: reason }
    },

    TASK_CREATE_REQUEST: (state) => {
      state.status = { isCreating: true }
    },
    TASK_CREATE_SUCCESS: (state, task) => {
      state.status = {}
      state.tasks.push(task)
    },
    TASK_CREATE_FAILURE: (state, reason) => {
      state.status = { error: reason }
    },

    TASK_DELETE_REQUEST: (state) => {
      state.status = { isDeleting: true }
    },
    TASK_DELETE_SUCCESS: (state, taskId) => {
      state.tasks = state.tasks.filter(task => task._id !== taskId)
      state.status = {}
    },
    TASK_DELETE_FAILURE: (state, reason) => {
      state.status = { error: reason }
    },

    TASK_MODIFY_REQUEST: (state) => {
      state.status = { isModifying: true }
    },
    TASK_MODIFY_SUCCESS: (state, { id, task }) => {
      const index = state.tasks.findIndex(task => task._id === id)
      state.tasks[index].title = task.title
      state.tasks[index].type = task.type
      state.tasks[index].subject = task.subject
      state.tasks[index].date = task.date
      state.tasks[index].description = task.description
      state.tasks[index].targets = task.targets
      state.status = {}
    },
    TASK_MODIFY_FAILURE: (state, reason) => {
      state.status = { error: reason }
    }
  },

  // ==================================
  // == Actions
  // ==================================
  actions: {
    fetchAll: ({ commit, rootState }) => {
      commit('FETCH_ALL_REQUEST')
      TaskService.getAllFrom(rootState.account.user._id)
        .then(
          res => {
            commit('FETCH_ALL_SUCCESS', res.tasks)
          },
          err => {
            commit('FETCH_ALL_FAILURE', err.data.message)
            app.config.globalProperties.$notify({ type: 'danger', message: `<b>Erreur !</b> ${err.data.message || 'Une erreur est survenue...'}` })
          })
    },

    create: ({ commit }, { title, type, subject, date, description, targets }) => {
      commit('TASK_CREATE_REQUEST')
      const newTargets = []
      if (targets.length > 0) {
        targets.forEach(target => {
          newTargets.push({ email: target })
        })
      }

      TaskService.create(title, type, subject, date, description, newTargets)
        .then(
          res => {
            commit('TASK_CREATE_SUCCESS', res.task)

            let swalTitle
            switch (type) {
              case 'homework': swalTitle = 'Devoirs ajouté avec succès'; break
              case 'DS': swalTitle = 'Contrôle ajouté avec succès'; break
              case 'task': swalTitle = 'Tâche ajoutée avec succès'; break
            }

            swal.fire({
              icon: 'success',
              title: swalTitle,
              customClass: {
                confirmButton: 'btn btn-primary'
              }
            })
          },
          err => {
            commit('TASK_CREATE_FAILURE', err.data.message)
            swal.fire({
              icon: 'error',
              title: 'Une erreur est survenue',
              text: err.data.errors[0],
              customClass: {
                confirmButton: 'btn btn-primary'
              }
            })
          })
    },

    delete: ({ commit }, { taskId }) => {
      commit('TASK_DELETE_REQUEST')
      TaskService.delete(taskId)
        .then(
          res => {
            commit('TASK_DELETE_SUCCESS', taskId)
            app.config.globalProperties.$notify({ type: 'success', message: 'La tâche a bien été supprimée !' })
          },
          err => {
            commit('TASK_DELETE_FAILURE', err.data.message)
            app.config.globalProperties.$notify({ type: 'danger', message: `<b>Erreur !</b> ${err.data.message || 'Une erreur est survenue...'}` })
          })
    },

    modify: ({ commit }, { _id, title, type, subject, date, description, targets }) => {
      commit('TASK_MODIFY_REQUEST')

      const newTargets = []
      targets.forEach(target => {
        if (newTargets.some(v => v.email === target)) return
        if (!target.email) newTargets.push({ email: target })
        else newTargets.push(target)
      })

      TaskService.modify(_id, title, type, subject, date, description, newTargets)
        .then(
          res => {
            commit('TASK_MODIFY_SUCCESS', { id: _id, task: res.task })

            let swalTitle
            switch (type) {
              case 'homework': swalTitle = 'Devoirs modifié avec succès'; break
              case 'DS': swalTitle = 'Contrôle modifié avec succès'; break
              case 'task': swalTitle = 'Tâche modifié avec succès'; break
            }

            swal.fire({
              icon: 'success',
              title: swalTitle,
              customClass: {
                confirmButton: 'btn btn-primary'
              }
            })
          },
          err => {
            commit('TASK_MODIFY_FAILURE', err.data.message)
            swal.fire({
              icon: 'error',
              title: 'Une erreur est survenue',
              text: err.data.errors[0],
              customClass: {
                confirmButton: 'btn btn-primary'
              }
            })
          })
    }
  },

  // ==================================
  // == Getters
  // ==================================
  getters: {
    isRetrieving: state => {
      return !!state.status.isRetrieving
    },
    // all tasks
    getAll: (state) => {
      const array = [...state.tasks]
      array.sort((a, b) => (a.date > b.date) ? -1 : 1)
      return array ?? [] // @TODO remove later
    },
    // all done tasks
    getAllDone: (state, getters, rootState) => {
      const doneTasks = rootState.account.user.tasks.done
      const array = [...getters.getAll].filter(task => doneTasks.includes(task._id))
      array.sort((a, b) => (a.date < b.date) ? -1 : 1)
      return array
    },
    // all tasks in the future
    getUpcommings: (state, getters) => {
      const now = new Date().getTime()
      const array = [...getters.getAll].filter(task => now < parseInt(task.date) + 3600000 * 24)
      array.sort((a, b) => (a.date < b.date) ? -1 : 1)
      return array
    },
    // 3 next tasks in the future
    get3Upcommings: (state, getters) => {
      return [...getters.getUpcommings].slice(0, 3) || []
    },
    // done tasks, in the future
    getDone: (state, getters, rootState) => {
      // @TODO uncomment later
      // const doneTasks = rootState.account.user.tasks.done
      // const array = [...getters.getUpcommings].filter(task => doneTasks.includes(task._id))
      // array.sort((a, b) => (a.date > b.date) ? -1 : 1)
      // return array
      return []
    },
    // not done tasks, in the future
    getTodo: (state, getters, rootState) => {
      // @TODO uncomment later
      // const now = new Date().getTime()
      // const doneTasks = rootState.account.user.tasks.done
      // let array = [...getters.getUpcommings].filter(task => now <= parseInt(task.date) + 3600000 * 24)
      // array = array.filter(task => !doneTasks.includes(task._id))
      // array.sort((a, b) => (a.date < b.date) ? -1 : 1)
      // return array
      return []
    },
    // all tasks in the past
    getArchived: (state, getters) => {
      const now = new Date().getTime()
      const array = [...getters.getAll].filter(task => now > parseInt(task.date) + 3600000 * 24)
      array.sort((a, b) => (a.date < b.date) ? -1 : 1)
      return array
    },
    getNextOneNotDone: (state, getters) => {
      return getters.getTodo[0]
    },
    getAsEvents: (state, getters) => {
      const tasks = [...getters.getAll]
      const events = []

      tasks.forEach(task => {
        const eventDate = new Date(DateUtil.methods.timestampToDate(task.date)).getTime()
        const event = events.find(event => DateUtil.methods.isSameDay(event.start, eventDate))

        // si on a pas encore créé d'event pour la tâche
        // alors on le créer
        if (!event) {
          events.push({
            amount: 1,
            tasks: [task],
            start: eventDate,
            allDay: true
          })
          return
        }

        // sinon on incrément le nombre d'events pour ce jour
        event.amount++
        event.tasks.push(task)
      })

      return events
    }
  }
}

export default tasksModule
