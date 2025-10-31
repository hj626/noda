import React, { Fragment } from 'react'

//ui디자인
import { CardBody, Button } from 'reactstrap'

//사이드바 일러스트
import sidebarIllustration from '../../../assets/calendarImg.svg'

//캘린더 필터 설정(체크박스 목록)
const filters = [
  { label: '개인', color: 'danger', className: 'styled mb-1' },
  { label: '팀업무', color: 'primary', className: 'styled mb-1' },
  { label: '프로젝트', color: 'warning', className: 'styled mb-1' },
  { label: '휴일', color: 'success', className: 'styled mb-1' },
]

//오른쪽 사이드바
const SidebarRight = props => {
  const {
    handleAddEventSidebar, //일정 추가
    toggleSidebar, //사이드바 닫기
    updateFilter, //필터 업데이트
    updateAllFilters, //전체 필터
    store, //캘린더 상태
    dispatch, //캘린더 실행 함수
  } = props

  //일정등록 함수 클릭시
  const handleAddEventClick = () => {
    toggleSidebar(false)  //오른쪽 사이드바 닫기
    handleAddEventSidebar() //일정추가 사이드바 열기
  }

  return (
    <Fragment>
      <div className="sidebar-wrapper">

        {/* 상단 필터 체크박스 영역 */}
        <CardBody>
          <div className="headline-2 text-center my-2">
            나의 일정
          </div>

          <div className="form-check checkbox checkbox-success">
            <input
              id="view-all"
              type="checkbox"
              className="styled mb-1"
              label="View All"
              checked={store.selectedCalendars.length === filters.length} //선택된 필터개수와 전체 필터 개수가 같으면 체크해줘

              onChange={e => dispatch(updateAllFilters(e.target.checked))} // 위에 체크된 후 변경된 내용을 업데이트해줘
            />
            <label htmlFor="view-all">View All</label>
          </div>

 {/* 개별 필터 체크박스 목록 */}
          <div className="calendar-events-filter">
            {filters.length &&
            filters.map(filter => {
              return (
                //각 필터의 색상에 맞는 체크박스 생성
                <div className={`form-check checkbox checkbox-${filter.color}`}>
                  <input
                    id={filter.label}   //label과 연결할 id
                    type="checkbox"
                    key={filter.label}    //label을 키로 사용할거야
                    label={filter.label}

                    //체크박스 토글 및 스타일 키
                    checked={store.selectedCalendars.includes(filter.label)}
                    className={filter.className}

                    // 변경시 : 해당 필터를 토글(선택/해제)
                    onChange={e => dispatch(updateFilter(filter.label))}
                  />
                    {/* 체크박스 옆 텍스트클릭 가능 기능 */}
                  <label htmlFor={filter.label}>{filter.label}</label>
                </div>
              )
            })
            }
          </div>
        </CardBody>

  {/* 중간: "Add Event" 버튼 영역 */}
        <CardBody className="card-body d-flex justify-content-center my-sm-0 mb-3">
          <Button className="btn-rounded" color="secondary-red" onClick={handleAddEventClick}> 
      {/* 클릭시 일정추가 오픈해줘 */}

            <span className="align-middle">일정 추가</span>
          </Button>
        </CardBody>
      </div>

      {/* 하단: 일러스트 이미지 */}
      <div className="mt-auto mx-auto mb-4">
        <img className="img-fluid" src={sidebarIllustration} alt="illustration" />
      </div>
    </Fragment>
  )
}

export default SidebarRight;
