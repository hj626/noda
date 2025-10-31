const multer = require('multer')
//파일을 쉽게 업로드 하기 위한 수단

const fs = require('fs')
// 파일 및 폴더 CRUD 및 확인 해주는애

const path = require('path')
// 운영체제 상관없이 안전하게 경로를 사용할수 있음.

const mongoose = require('mongoose')
const Calendar = mongoose.model('calendardbs')
//calendardbs라는 컬렉션에서 가져와.


//파일 업로드 폴더 만들기
try{
    fs.readdirSync('uploads')
}catch(error){
    fs.mkdirSync('uploads')
}

//파일 업로드 관련설정
const fileUploadRouters = (app,router) => {

    // muter 저장소 설정(파일을 어떤폴더에 넣을지 지정)
    const storage = multer.diskStorage({
        destination:(req,fileUpload,callback)=>{
            callback(null,'uploads')
        },

        // 파일명은 지금시간.파일확장자로 할거야
        filename:(req,fileUpload,callback)=>{
            callback(null,Date.now().toString() + path.extname(fileUpload.originalname))
        }
    })

    // muter의 옵션은
    var uploads = multer({
        //위에서 지정한 storage방법대로 파일을 올릴거고,
        storage:storage,
        limits:{
            // 최대 10개, 파일당 1GB까지 올릴수 있어.
            files:10,
            fileSize:1024*1024*1024
        }
    })

    //라우터 추가(파일 업로드API)
    router.route('/api/fileUpload').post(uploads.array('upload',1),
    async (req,res)=>{
        //upload라는 이름으로 파일은 최대 1개 받을거야
        //그런데 파일업로드가 완료될때까지 기다려.

    try {
        const files = req.files
        //업로드된 파일 정보

        let originalName = '' //원 파일명 변수 준비해
        let saveName = '' //저장된 파일명 변수 준비해

        //파일정보를 배열로 만들어서 클라이언트에 반환할거야
        const fileInfoArray = [] 

            for(let i=0;i<files.length;i++){
                originalName = encoding(files[i].originalname)
                //원본 파일명 한글깨짐방지 처리

                saveName = files[i].filename
                // 서버에 저장된 파일명

                // Calendar.create({ DB에 바로 저장하는것
                fileInfoArray.push({ 
                    //파일을 DB에 바로 저장하지 않고 내용을 작성한후
                    //정보를 받아서 저장할거야.

                    fileId: Date.now().toString() +i, //고유 ID생성
                    originalFileName:originalName,
                    saveFileName:saveName,
                    // path:'http://localhost:8080/' + saveName
                    path: `${req.protocol}://${req.get('host')}/${saveName}`
                    // 현재 실제주소가져와서 어디에서든지 파일을 볼수 있게 하는것
                })
            }
        //파일 정보를 json으로 클라이언트에 반환할거야.
        //바로 저장 X
        return res.status(200).json({
        success:true,
        files: fileInfoArray
        })
    } catch(error) {
        console.log('파일 업로드 에러:', error.message)
        return res.status(500).json({
            success:false,
            error: '파일 업로드 실패',
            message: error.message
        })
    }
 })

    // 라우터 app에 등록
    app.use('/',router)
}

//한글 파일이름 깨짐 방지
function encoding(fileName){
    return Buffer.from(fileName,'latin1').toString('utf8')
}

module.exports = fileUploadRouters