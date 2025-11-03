const mongoose = require('mongoose')

const Calendar = mongoose.model('calendardbs')
// collection 호출.
// calSchema.js에서 지정한 컬렉션명으로 가져옴.

//미들웨어 생성 function(app){}
//taxi/src/services/taxiService에서 조회
module.exports = (app) => {
// 이 파일을 exports(내보내기)해서 다른 파일에서 사용하게 할거야.
//exports: 웹서버의 모든 기능과 설정관리(중앙 통제소 역할)

    // 전체데이터 조회
    //라우터패스(url경로) task
    app.get('/api/task', async(req,res) => {
        //비동기방식으로 하지않고, 순차처리작업을 위해 async+await를 사용.

        try{
          const user = await Calendar.find()
    // db에서 찾아올때까지 기다려. 찾으면 그때 return 실행해
 
       return res.status(200).send(user)
        //요청 성공된 코드(200)과 같이 결과 db를 사용자에게 전달해줘.
    } catch(error){
            console.error('조회 에러:', error)
            return res.status(500).send({ error: error.message })
        }
    })

    //달력 날짜로 찾기
    app.get('/api/task/:date', async(req,res) => {
        try{
        const date = req.params.date
        const user = await Calendar.findOne({ date: date })

        return res.status(200).send(user)
        }catch(error){
            console.error('날짜 조회 에러', error)
        return res.status(500).send({error:error.message})
    }
})

    // 데이터 입력
    app.post('/api/task',async(req,res)=>{

        //필수값이 입력이 안되었을 경우 '내용을 입력해주세요' 를 보여줘.
        // if(!req.body.tasks || !req.body.date || req.body.tasks.length === 0 || req.body.date.length === 0){
            
        //  if(!req.body.date || !req.body.tasks || !req.body.id){

        try{
            console.log('받은 데이터:', req.body)

        if(!req.body.title||!req.body.start){
            
            return res.status(400).send({
                error:true,
                message:"내용을 입력해주세요."
            })
        }

         const user = await Calendar.create(req.body)
        //클라이언트가 보낸 데이터를 새로 캘린더라는 컬렉션에 user라는 변수로 저장해줘.
         console.log('저장 성공:'. user)

        //     date:req.body.date,
        //     tasks: req.body.tasks,
        //     id: req.body.id
        // })

        return res.status(200).send({
            error:false,
            user
        })
    } catch(error) {
         console.error('저장 에러:', error)  // ← 에러 확인!
            return res.status(500).send({
            error: true,
            message: error.message
    })
}
    })

    // 특정날짜의 할일 데이터 수정
    // app.put('/api/task/:date',async(req,res)=>{
       app.put('/api/task/:id',async(req,res)=>{ 

        try{
        const id = req.params.id
        // const date = req.params.date //URL에서 날짜 가져오기
        const updateData = req.body  //사용자가 수정한 내용

        const user = await Calendar.findOneAndUpdate(

            {_id:id},
        //    {date: date}, //이날짜의 데이터를 찾아
            { $set: updateData},
            //사용자가 수정요청을 보낸 데이터(updateData)만
            // 덮어 씌울꺼야 ($set)

            {new:true}
            //수정 후 데이터를 보여줘
        )

         return res.status(200).send({
            error:false,
            user
        })
    } catch(error){
        console.error('수정 에러:',error)
        return res.status(500).send({error:error.message})
    }
})

    // 데이터 삭제
    // app.delete('/api/task/:date',async(req,res)=>{
    app.delete('/api/task/:id',async(req,res)=>{

        try{

        const id = req.params.id
        const date = req.params.date
        // const user = await Calendar.findOneAndDelete({date:date})
        const user = await Calendar.findOneAndDelete(
            {_id:id}
        )

         return res.status(200).send({
            error:false,
            user
        })
    } catch(error) {
        console.error('삭제 에러:', error)
    return res.status(500).send({ error:error.message})
}
    })
}