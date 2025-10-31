import axios from "axios";
import config from "../config"; //추가

axios.defaults.baseURL = config.baseURLApi; //서버주소 가져와

// ** Fetch Events 일정목록 가져오기
export const fetchEvents = calendars => {
  return dispatch => {
    // axios.get('/apps/calendar/events', { calendars }).then(response => {
    //   dispatch({

      axios.get('/task').then(response => { //수정
        dispatch({

        type: 'FETCH_EVENTS',
        events: response.data
      })
    })
  }
}

// ** Add Events 일정 추가
export const addEvent = event => {
  return (dispatch, getState) => {
    // axios.post('/apps/calendar/add-event', { event}).then(() => {

      axios.post('/task',event).then(() =>{ //수정
      dispatch({
        type: 'ADD_EVENT'
      })
      dispatch(fetchEvents(getState().calendar.selectedCalendars))
    })
  }
}

// ** Update Event 수정하기
export const updateEvent = event => {
  return dispatch => {
    // axios.post('/apps/calendar/update-event', { event }).then(() => {

      const id = event.id || event._id

      console.log('수정할 ID:', id)
      console.log('수정할 데이터:', event)

      // axios.put(`/task/${event.date}`,event).then(() => {//수정
      axios.put(`/task/${id}`,event).then(() => 
      {
      dispatch({
        type: 'UPDATE_EVENT',
        event : event
      })
    }).catch(error => {
      console.error('수정실패:',error)
  })
  }
}

// ** Filter Events
export const updateFilter = filter => {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_FILTERS',
      filter
    })
    dispatch(fetchEvents(getState().calendar.selectedCalendars))
  }
}

// ** Add/Remove All Filters
export const updateAllFilters = value => {
  return (dispatch, getState) => {
    dispatch({
      type: 'UPDATE_ALL_FILTERS',
      value
    })
    dispatch(fetchEvents(getState().calendar.selectedCalendars))
  }
}

// ** Remove Event
//export const removeEvent = id => {
  // export const removeEvent = (date) => {
    export const removeEvent = (eventId) => {
  return dispatch => {

    const id = eventId.id || eventId._id || eventId
    console.log('삭제할 ID:', id)

//    axios.delete('/apps/calendar/remove-event', { id }).then(() =>{
      // axios.delete(`/task/${date}`).then(() =>{ //수정
      // dispatch({
      axios.delete(`/task/${id}`).then(() =>{
        dispatch({
        type: 'REMOVE_EVENT',
        id:id
      })
    }).catch(error => {
      console.error('삭제 실패:', error)
  })
}
}

// ** Select Event (get event data on click)
export const selectEvent = event => {
  return dispatch => {
    dispatch({
      type: 'SELECT_EVENT',
      event
    })
  }
}

