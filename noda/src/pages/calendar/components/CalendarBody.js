import { useEffect, useRef, memo } from "react";
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactinPlugin from "@fullcalendar/interaction"

import { Card, CardBody } from "reactstrap";

const CalendarBody = props => {
  const calendarRef = useRef(null)

  //props로 전달받은 구조
  const {
    store, //캘린더 상태
    dispatch, //redux 일정 실행
    calendarApi, //api객체
    setCalendarApi, //api객체 저장
    calendarsColor, //카테고리별 색상 매핑
    blankEvent, //새일정 템플릿
    selectEvent, //일정 선택
    updateEvent, //일정 수정 
    handleAddEventSidebar //일정 추가 / 수정 모달 열기
  } = props

  useEffect(() => {
    if (calendarApi === null) {
      setCalendarApi(calendarRef.current.getApi())
    }
  }, [calendarApi])

  const calendarOptions = {
    events: store.events.length
      ? store.events
      : [],
    plugins: [interactinPlugin, dayGridPlugin, timeGridPlugin],
    initialValue: 'dayGridMonth',
    headerToolbar: {
      start: ' prev, next, title',
      end: 'sidebarToggle, dayGridMonth, timeGridWeek, timeGridDay'
    },
    editable: true,
    eventResizableFromStart: true,
    dragScroll: true,
    dayMaxEvents: 2,
    navLinks: true,

    eventClassNames({ event: calendarEvent }) {
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]
      return [`bg-light-${colorName}`]
    },

    eventClick({ event: clickedEvent }) {
      dispatch(selectEvent(clickedEvent))
      handleAddEventSidebar()
    },

    dateClick(info) {
      const ev = blankEvent
      ev.start = info.date
      ev.end = info.date
      dispatch(selectEvent(ev))
      handleAddEventSidebar()
    },

    eventDrop({ event: droppedEvent }) {
      dispatch(updateEvent(droppedEvent))
    },

    eventResize({event: resizedEvent}) {
      dispatch(updateEvent(resizedEvent))
    },

    ref: calendarRef,
  }

  return (
    <Card className="shadow-none border-0 mb-0">
      <CardBody className="pb-0">
        <FullCalendar {...calendarOptions} />{' '}
      </CardBody>
    </Card>
  )
}

export default memo(CalendarBody)

