const mongoose = require('mongoose')

//스키마 만들기
// 파일 업로드 (보류)
/* const fileSchema = mongoose.Schema({
    fileId:{ type:String, required:true},
    originalFileName:{type:String, required : true},
    saveFileName:String,
    path:{type:String, required : true} //공용DB에 저장할 경로임
}, { _id: false }
)

//내용넣을 스키마
const taskSchema = mongoose.Schema({
    taskId:{ type:String, required:true},
    type:{ type:String, required:true}, //selectedCalendars 구분(팀/개인/프로젝트)
    title:{ type:String, required:true},
    content:{ type:String, required:true},
    partner: {type:String}, //협업자 설정
    // required필수항목인지 아닌지

    files:[fileSchema] //여러개의 파일을 올리기 위해서 배열처리
}, { _id: false })


//최종 스키마
const calSchema = mongoose.Schema({
    date:{type:String, required:true},
    tasks:{ type: [taskSchema] ,  required:true}, //할일을 여러개있을수도 있으니까 배열처리
    id: {type:String, required:true }
})
*/

const calSchema = new mongoose.Schema({
  title: {type: String, required: true},
  start: {type: Date, required: true},
  end: Date,
  allDay: Boolean,
  url: String,
  display: String, //추가
  extendedProps: {
    calendar: {type: String, required: true,
      enum: ['팀업무', '개인','프로젝트','휴일']
    },
    guests: [String],
    location: String,
    description: String
  }
},{timestamps: true //사용자 작성일 자동으로 입력기능
});

//모델 정의
mongoose.model('calendardbs',calSchema)
// calSchema라는 스키마를 이용해서
// calendardbs라는 테이블을 만들거야
// -------------------------------------------

//이미지 업로드

console.log('스키마 정의 완료')
/* 개발자가 확인용으로 나오게 하는 메세지
 터미널에서 확인가능하며, alret과 같은 기능임 */

 /*몽고DB는 id를 만들어달라고 하지않아도 스키마별로 id가 자동으로 만들어짐. 데이터를 구분하기 위해서 메인 스키마를 제외하고  { _id: false });를 붙여서  할일당 id한개만 만들수 있도록 처리*/