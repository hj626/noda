import React, { Fragment, useState } from "react";

import classnames from "classnames";
import Flatpickr from "react-flatpickr"; //날짜, 시간 선택
import Select, { components } from "react-select"; // 카테고리 관련 드롭다운
import { useForm } from "react-hook-form";//폼 유효성 검사
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  CustomInput,
  Input,
  Form,
} from "reactstrap";

import "eva-icons/style/eva-icons.css";

import img1 from "../../../assets/tables/ellieSmithImg.png"
import img2 from "../../../assets/tables/floydMilesImg.png"
import img3 from "../../../assets/tables/rosaFloresImg.png"
import img4 from "../../../assets/tables/janeCooper.png"
import axios from "axios";

const AddEventSidebar = props => {
  const {
    store, //캘린더 상태
    dispatch, //액션실행
    open, //모델 on/off
    handleAddEventSidebar, //모달 토글
    calendarsColor, // 카테고리별 색상
    calendarApi, // 캘린더 api
    refetchEvents, //일정 새로고침
    addEvent, //일정 추가
    selectEvent, //일정 검색
    updateEvent, // 일정 수정
    removeEvent, //일정 삭제
  } = props

  //일정 검색
  const selectedEvent = store.selectedEvent
  const { register, errors, handleSubmit } = useForm()

  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [title, setTitle] = useState('')
  const [guests, setGuests] = useState('')
  const [allDay, setAllDay] = useState(false)
  const [location, setLocation] = useState('')
  const [endPicker, setEndPicker] = useState(new Date())
  const [startPicker, setStartPicker] = useState(new Date())
  const [value, setValue] = useState([{ value: 'Business', label: 'Business', color: 'primary' }])

  //드롭다운 메뉴 : 카테고리 선택 옵션
  const options = [
    { value: '팀업무', label: '팀업무', color: 'primary' },
    { value: '개인', label: '개인', color: 'danger' },
    { value: '프로젝트', label: '프로젝트', color: 'warning' },
    { value: '휴일', label: '휴일', color: 'success' },
  ]

  //협업자 옵션
  const guestsOptions = [
    { value: 'Ellie Smith', label: 'Ellie Smith', avatar: img1 },
    { value: 'Floyd Miles', label: 'Floyd Miles', avatar: img2 },
    { value: 'Rosa Flores', label: 'Rosa Flores', avatar: img3 },
    { value: 'Jane Cooper', label: 'Jane Cooper', avatar: img4 },
  ]

// 카테고리 드롭다운 디자인
  const OptionComponent = ({ data, ...props}) => {
    return (
      <components.Option {...props}>
        <div className={`bullet bullet-${data.color} bullet-sm mr-2`}></div>
        {data.label}
      </components.Option>
    )
  }

// 프로필 이미지+이름 형식으로 표시
  const GuestsComponent = ({ data, ...props }) => {
    return (
      <components.Option {...props}>
        <div className="d-flex flex-wrap align-items-center">

     {/* 프로필 이미지 */}
          <img className="avatar mr-2" src={data.avatar} alt="user"/>

         {/* 이름 */}
          <div>{data.label}</div>
        </div>
      </components.Option>
    )
  }

  const isObjEmpty = obj => Object.keys(obj).length === 0

  //새 일정 추가
  const handleAddEvent = () => {
    const obj = {
      title,
      start: startPicker,
      end: endPicker,
      allDay,
      display: 'block',
      extendedProps: {
        calendar: value[0].label, //카테고리
        url: url.length ? url : undefined,
        guests: guests.length ? guests : undefined,
        location: location.length ? location : undefined,
        description: description.length ? description : undefined
      }
    }
    dispatch(addEvent(obj))
    refetchEvents()
    handleAddEventSidebar()
  }

  //선택된 일정 불러오기
  const handleSelectedEvent = () => {
    if (!isObjEmpty(selectedEvent)) {

      //선택된 일정 카테고리 정보
      const calendar = selectedEvent.extendedProps.calendar
      console.log(typeof calendar)

      // 카테고리 라벨 결정 함수
      const resolveLabel = () => {
        if (calendar.length) {
          return { value: calendar, label: calendar, color: calendarsColor[calendar] }
        } else {
          return { label: 'Business', value: 'Business', color: 'primary' }
        }
      }


      setTitle(selectedEvent.title || title)
      setAllDay(selectedEvent.allDay || allDay)
      setUrl(selectedEvent.url || url)
      setLocation(selectedEvent.extendedProps.location || location)
      setDescription(selectedEvent.extendedProps.description || description)
      setGuests(selectedEvent.extendedProps.guests || guests)
      setStartPicker(new Date(selectedEvent.start))
      setEndPicker(selectedEvent.allDay ? new Date(selectedEvent.start) : new Date(selectedEvent.end))
      setValue([resolveLabel()])
    }
  }

  const handleResetInputValues = () => {
    dispatch(selectEvent({}))
    setTitle('')
    setAllDay(false)
    setUrl('')
    setLocation('')
    setDescription('')
    setGuests({})
    setValue([{ value: '팀업무', label: '팀업무', color: 'primary' }])
    setStartPicker(new Date())
    setEndPicker(new Date())
  }

  // 일정 업데이트 함수
  const updateEventInCalendar = (updatedEventData, propsToUpdate, extendedPropsToUpdate) => {
  
    //해당id 일정 찾기
    const existingEvent = calendarApi.getEventById(updatedEventData.id)

    for (let index = 0; index < propsToUpdate.length; index ++) {
      const propName = propsToUpdate[index]
      existingEvent.setProp(propName, updatedEventData[propName])
    }

    existingEvent.setDates(updatedEventData.star, updatedEventData.end, { allDay: updatedEventData.allDay })

    for (let index = 0; index < extendedPropsToUpdate.length; index ++) {
      const propName = extendedPropsToUpdate[index]
      existingEvent.setExtendedProp(propName, updatedEventData.extendedProps[propName])
    }
  }

  //일정 수정 함수
  const handleUpdateEvent =  () => {
    const eventToUpdate = {
      id: selectedEvent.id,
      title,
      allDay,
      start: startPicker,
      end: endPicker,
      url,
      extendedProps: {
        location,
        description: description,
        guests,
        calendar: value[0].label
      }
    }

// 업데이트 할 속성 목록
    const propsToUpdate = ['id', 'title', 'url']
    const extendedPropsToUpdate = ['calendar', 'guests', 'location', 'description']



    dispatch(updateEvent(eventToUpdate))
     updateEventInCalendar(eventToUpdate, propsToUpdate, extendedPropsToUpdate)
    handleAddEventSidebar();
  }

  const removeEventInCalendar = eventId => {
    calendarApi.getEventById(eventId).remove()
  }
  const handleDeleteEvent = () => {
    dispatch(removeEvent(selectedEvent.id))
    removeEventInCalendar(selectedEvent.id)
    handleAddEventSidebar()
  }

  const EventActions = () => {
    if (isObjEmpty(selectedEvent) || (!isObjEmpty(selectedEvent) && !selectedEvent.title.length)) {
      return (
        <Fragment>
          <Button className="mr-3 btn-rounded" type="submit" color="primary" >
            Add
          </Button>
          <Button className="btn-rounded" color="secondary" type="reset" onClick={handleAddEventSidebar} outline>
            Cancel
          </Button>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Button className="mr-3 btn-rounded" color="primary" onClick={handleUpdateEvent}>
            Update
          </Button>
          <Button className="btn-rounded" color="secondary" onClick={handleDeleteEvent} outline>
            Delete
          </Button>
        </Fragment>
      )
    }
  }

  const CloseBtn = <i className="eva eva-close cursor-pointer" onClick={handleAddEventSidebar}/>

  return (
    <Modal
      isOpen={open}
      toggle={handleAddEventSidebar}
      onOpened={handleSelectedEvent}
      onClosed={handleResetInputValues}
      className="sidebar-lg"
      contentClassName="p-0"
      modalClassName="modal-slide-in event-sidebar"
    >
      <ModalHeader className="mb-1" toggle={handleAddEventSidebar} close={CloseBtn} tag="div">
        <h5 className="modal-title">
          일정{selectedEvent && selectedEvent.title && selectedEvent.title.length ? "추가등록" : "등록"} 
        </h5>
      </ModalHeader>
      <ModalBody className="flex-grow-1 pb-sm-0 pb-3">
        <Form
          onSubmit={handleSubmit(data => {
            if (isObjEmpty(errors)) {
              if (isObjEmpty(selectedEvent) || (!isObjEmpty(selectedEvent) && !selectedEvent.title.length)) {
                handleAddEvent()
              } else {
                handleUpdateEvent()
              }
              handleAddEventSidebar()
            }
          })}
        >
          <FormGroup>
            <Label for="title">
              제목 <span className="text-danger">*</span>
            </Label>
            <Input
              id='title'
              name='title'
              placeholder='Title'
              value={title}
              onChange={e => setTitle(e.target.value)}
              innerRef={register({ register: true, validate: value => value !== '' })}
              className={classnames({
                'is-invalid': errors.title
                // add extended bootstrap class for show invalid field value
              })}
            />
          </FormGroup>
          <FormGroup>
            <Label for="label">주제</Label>
            <Select
              id="label"
              value={value}
              options={options}
              className="react-select"
              classNamePrefix="select"
              isClearable={false}
              onChange={data => setValue([data])}
              components={{
                Option: OptionComponent
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label for='startDate'>시작일</Label>
            <Flatpickr
              required
              id='startDate'
              name='startDate'
              className='form-control'
              onChange={date => setStartPicker(date[0])}
              value={startPicker}
              options={{
                enableTime: allDay === false,
                dateFormat: 'Y-m-d H:i'
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label for='endDate'>참고 URL</Label>
            <Flatpickr
              required
              id='endDate'
              // tag={Flatpickr}
              name='endDate'
              className='form-control'
              onChange={date => setEndPicker(date[0])}
              value={endPicker}
              options={{
                enableTime: allDay === false,
                dateFormat: 'Y-m-d H:i'
              }}
            />
          </FormGroup>
          <FormGroup>
            <CustomInput
              type='switch'
              id='allDay'
              name='customSwitch'
              label='All Day'
              checked={allDay}
              onChange={e => setAllDay(e.target.checked)}
              inline
            />
          </FormGroup>
          <FormGroup>
            <Label for='eventURL'>참고 URL</Label>
            <Input
              type='url'
              id='eventURL'
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder='https://www.flatlogic.com'
            />
          </FormGroup>
          <FormGroup>
            <Label for='guests'>협업자</Label>
            <Select
              isMulti
              id='guests'
              className='react-select'
              classNamePrefix='select'
              isClearable={false}
              options={guestsOptions}
              value={guests.length ? [...guests] : null}
              onChange={data => setGuests([...data])}
              components={{
                Option: GuestsComponent
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label for="location">장소</Label>
            <Input
              id="location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="장소"
            />
          </FormGroup>
          <FormGroup>
            <Label for="description">메모</Label>
            <Input
              type="textarea"
              name="text"
              id="description"
              rows="3"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="내용"
            />
          </FormGroup>
          <FormGroup className="d-flex">
            <EventActions />
          </FormGroup>
        </Form>
      </ModalBody>
    </Modal>
  )
}

export default AddEventSidebar;
