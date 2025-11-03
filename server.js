const express = require('express')
const http = require('http')
const mongoose = require('mongoose')

const cors = require('cors') // CORS 불러오기 추가
const path = require('path') // 경로 관리에 사용

// MongoDB 설정 (strictQuery는 Mongoose 6 이상에서 필요)
mongoose.set('strictQuery', false)

// 익스프레스 객체 생성
const app = express()

// ------------------- 1. 미들웨어 및 기본 설정 -------------------

// CORS 설정: http://localhost:3000 에서 오는 요청만 허용
const corsOptions = {
    origin: 'http://localhost:3000', // React 개발 서버 주소
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// JSON 형태의 데이터 사용을 위한 미들웨어 (라우팅 전에 위치해야 함)
app.use(express.json()) 

// 라우팅 함수 (imageRouters를 사용하지 않는다면 사실상 불필요)
const router = express.Router()

// 스키마 호출 (모델 등록)
require('./models/calSchema')

// 기본포트 설정 (PORT 환경 변수가 없으면 8080 사용)
app.set('port', process.env.PORT || 8080)

// ------------------- 2. 데이터베이스 연결 -------------------

// 데이터베이스에 연결
mongoose.connect('mongodb://192.168.0.61:27017/nodaDB')
console.log('데이터 베이스 연결')


// ------------------- 3. API 라우터 등록 -------------------

// 백엔드 API 라우터 등록 (가장 먼저 실행되어 API 요청을 처리)
require('./routers/calRouters')(app)


// ------------------- 4. 클라이언트(React) 라우팅 처리 (핵심!) -------------------
// 브라우저 라우팅 처리는 API 라우터가 모두 등록된 후, 서버 시작 전에 위치해야 합니다.

// 빌드된 리소스 찾기 (클라이언트 빌드 폴더의 정적 파일들을 서빙)
app.use(express.static(path.join(__dirname, 'noda/build')))

// 브라우저 라우팅 (와일드카드 '*')
// API에서 처리되지 않은 모든 GET 요청은 index.html을 반환하여 React Router에게 주소 제어를 넘깁니다.
// app.get('/*', (req, res) => {
    app.use((req,res) =>{
    res.sendFile(path.join(__dirname, 'noda/build', 'index.html'));
})


// ------------------- 5. Express 서버 시작 -------------------

http.createServer(app).listen(app.get('port'), () => {
    console.log('서버를 시작했습니다: ' + app.get('port'))
})