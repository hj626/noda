const express = require('express')
const http = require('http')
const mongoose = require('mongoose')

const cors = require('cors') //cors 불러오기 추가
const path = require('path')

mongoose.set('strictQuery',false)
// const path = require('path') 위치 cors 아래로 이동함


// 익스프레스 객체 생성
const app = express()


//CORS 추가 타 리소스(데이터)를 공유하도록 허락하는 시스템
const corsOptions = {
    origin: 'http://localhost:3000', //여기에서 오는 요청만 받을꺼야
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// -------------------
//json형태의 데이터 사용
 app.use(express.json()) 


//라우팅 함수
const router = express.Router()

//json형태의 데이터 사용
// app.use(express.json()) 
//app.use(cors(corsOptions));아래로 이동

//스키마 호출
require('./models/calSchema')

//기본포트를 app 객체의 속성으로 설정
app.set('port',process.env.PORT||8080)

//데이터베이스에 연결
//cmd에서 먼저 C:\Users\admin>mongosh 로 연결 후 진행
//mongoose.connect('mongodb://127.0.0.1:27017/myDB')
 mongoose.connect('mongodb://192.168.0.61:27017/nodaDB')
 console.log('데이터 베이스 연결')

//라우터 등록
require('./routers/calRouters')(app)


//빌드된 리소스 찾기
app.use(express.static(path.join(__dirname,'noda/build')))

//브라우저 라우팅
//app.get('/',(req,res)=>{
app.get('*',(req,res)=>{ 
    // 위에 오류나면 이걸로 해보기 *은 모든경로
    res.sendFile(path.join(__dirname,'noda/build','index.html'));
})

//데이터베이스에 연결
//cmd에서 먼저 C:\Users\admin>mongosh 로 연결 후 진행
//mongoose.connect('mongodb://127.0.0.1:27017/myDB')
// mongoose.connect('mongodb://192.168.0.61:27017/nodaDB')
// console.log('데이터 베이스 연결')
//기본포트 설정 8080 아래로 이동


//라우터 등록
// require('./routers/calRouters')(app) 데이터 베이스 연결아래로 이동


//Express 서버 시작
http.createServer(app).listen(app.get('port'),()=>{
    console.log('서버를 시작했습니다: ' + app.get('port'))
})


