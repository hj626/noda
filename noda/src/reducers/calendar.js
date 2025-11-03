// ** Initial State -> 초기값
const initialState = {
  events: [], //배열에 캘린더 이벤트들을 저장할거야
  selectedEvent: {}, //{}안에 이벤트 정보를 담을거야
  //개인일정, 팀일정, 프로젝트일정, 연차
  selectedCalendars: ['개인', '팀업무', '프로젝트', '휴일'] 
}


const calendar = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_EVENTS': //가져와
      const formattedEvents = action.events.map(event => ({
        ...event, id: event._id 
      }));
      // return { ...state, events: action.events }
      return { ...state, events: formattedEvents }

    case 'ADD_EVENT': //추가해
      return { ...state }

    case 'REMOVE_EVENT': //지워
    const idToRemove = action.id
      const filteredEvents = state.events.filter(event => event.id !== idToRemove)
      // return { ...state }
      return { ...state, events: filteredEvents }

    case 'UPDATE_EVENT':   //수정
     const updatedEvents = state.events.map(event => { //추가

      const incomingId = action.event.id || action.event._id;

        // if (event.id === action.event.id) {
        if (event.id === incomingId){
         
            // return {
            //   ...action.event,
            //   id: incomingId    
            return {
              ...event,
              ...action.event,
              id: incomingId            
       }
      }
        return event
      })
      return { ...state, events: updatedEvents }

    case 'UPDATE_FILTERS':
      // ** Updates Filters based on action filter
      const filterIndex = state.selectedCalendars.findIndex(i => i === action.filter) //selectedCalendars에 배열안에 있는것들중 조건을 만족하는 인덱스의 배열값을 찾아와

      if (state.selectedCalendars.includes(action.filter)) {
        // includes()안에 포함이 되어 있는지 T/F

        state.selectedCalendars.splice(filterIndex, 1)
        // splice(삭제) filterIndex에서 1개 삭제
      } else {
        state.selectedCalendars.push(action.filter)
        // push: 배열 맨 끝에 추가
      }
      if (state.selectedCalendars.length === 0) {
        state.events.length = 0
      }
      return { ...state }

    case 'UPDATE_ALL_FILTERS':
    // ** Updates All Filters based on action value
      const value = action.value
      let selected = []
      if (value === true) {
        selected = ['개인', '팀업무', '프로젝트', '휴일']
        //SidebarRight.js 의 const filters 부분과 동일하게 기재
      } else {
        selected = []
      }
      return { ...state, selectedCalendars: selected }
    case 'SELECT_EVENT':
      return { ...state, selectedEvent: action.event }
    default:
      return state
  }
}

export default calendar;
