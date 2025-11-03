//useEffecteAPI 호출을 비롯한 기능 디자인

import { Fragment, useState, useEffect } from 'react'

import classnames from 'classnames'
import { Row, Col } from 'reactstrap'

import CalendarBody from "./components/CalendarBody" //캘린더 메인
import SidebarRight from "./components/SidebarRight"; //오른쪽 사이드바기능
import AddEventSidebar from "./components/AddEventSidebar"; //일정추가,수정 사이드바 기능

import { useSelector, useDispatch } from "react-redux"

// Redux 액션들 임포트
import {
  fetchEvents, //일정가져오기
  selectEvent, //특정 일정선택
  updateEvent, //일정 수정
  updateFilter, //필터 (카테고리)
  updateAllFilters, //전체 필터선택/해제
  addEvent, //일정추가
  removeEvent //일정삭제
} from "../../actions/calendar";

//카테고리별 디자인
const calendarsColor = {
  팀업무: 'primary',
  개인: 'danger',
  프로젝트: 'warning',
  휴일: 'success',
}

const Calendar = () => {

  // Redux 액션들실행
  const dispatch = useDispatch()

  const store = useSelector(state => state.calendar) //캘린더 가져오기

  //사이드바 열림/닫힘 상태관리
  const [addSidebarOpen, setAddSidebarOpen] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false)

  // 캘린더API객체를 저장 현재상태값과 상태 업데이트 값
  const [calendarApi, setCalendarApi] = useState(null)

  //사이드바 토글 함수(사이드바 열림/닫힘 상태관리 관련함수)
  const handleAddEventSidebar = () => setAddSidebarOpen(!addSidebarOpen)
  const toggleSidebar = val => setRightSidebarOpen(val)

  // 일정 추가시 받을 템플릿
  const blankEvent = {
    title: '', //제목
    start: '', //시작일
    end: '',  //마감일
    allDay: false, //종료일정여부
    url: '', //참고 url
    extendedProps: { //추가 속성들
      calendar: '', //카테고리
      guests: [],   //협업자
      location: '',  //장소
      description: '',  //상세설명
    }
  }

  const refetchEvents = () => {
    // 일정 불러오기 : API가 초기화(null) 되었는지 확인 후 실행.
    if (calendarApi !== null) {
      calendarApi.refetchEvents()
    }
  }

  // 캘린더 수정시 실행
  useEffect(() => {
    dispatch(fetchEvents(store.selectedCalendars))
  }, [store.selectedCalendars])// store.selectedCalendars배열추가

  return (
    <Fragment>
      <div className="app-calendar overflow-hidden">
        <Row noGutters>

        {/* 왼쪽 메인 컬럼 - 캘린더 본체 */}
          <Col className="position-relative mr-3">
            <CalendarBody
              store={store} //Redux 상태 전달(캘린더 정보 전달)

              dispatch={dispatch}  // Redux dispatch (액션)함수 전달
              selectEvent={selectEvent} // 일정 선택 액션 전달
              updateEvent={updateEvent} // 일정 수정 액션 

              blankEvent={blankEvent} // 이벤트 템플릿 전달
              calendarApi={calendarApi} // 현재 Calendar API 전달
              setCalendarApi={setCalendarApi} // 업데이트된 캘린더API 전달

              calendarsColor={calendarsColor}
              toggleSidebar={toggleSidebar} // 사이드바토글 함수 전달
              handleAddEventSidebar={handleAddEventSidebar} // 일정 추가 사이드바 토글 함수
            />
          </Col>

          {/* 오른쪽 컬럼 - 필터 사이드바 */}
          <Col
            id='app-calendar-sidebar'
            className={classnames('col app-calendar-sidebar flex-grow-0 overflow-hidden d-flex flex-column', {
              show: rightSidebarOpen //사이드바가 트루일때 show를 시작해줘
            })}
          >
            <SidebarRight
              store={store}
              dispatch={dispatch} // Redux dispatch(액션) 함수 전달
              updateFilter={updateFilter} //// 개별 필터 업데이트 액션
              updateAllFilters={updateAllFilters} // 전체 필터 업데이트 액션
              toggleSidebar={toggleSidebar} // 사이드바 토글 함수
              handleAddEventSidebar={handleAddEventSidebar} // 일정 추가 사이드바 토글
            />
          </Col>

            {/* 오버레이 - 사이드바가 열렸을 때 배경 어둡게 처리 */}
          <div
            className={classnames("body-content-overlay", {
              show: rightSidebarOpen === true //사이드바 열림상태에 따라 표시
            })}
            onClick={() => toggleSidebar(false)} // 클릭 시 사이드바 닫기
          />
        </Row>
      </div>

       {/* 일정 추가/수정 사이드바 (별도 레이어) */}
      <AddEventSidebar
        store={store}
        dispatch={dispatch}
        open={addSidebarOpen}
        handleAddEventSidebar={handleAddEventSidebar}
        selectEvent={selectEvent}
        addEvent={addEvent}
        removeEvent={removeEvent}
        refetchEvents={refetchEvents}
        updateEvent={updateEvent}
        calendarApi={calendarApi}
        calendarsColor={calendarsColor}
      />
    </Fragment>
  )
}

export default Calendar;
