import axios from 'axios'
// http요청을 쉽게 crud를 사용할수 있게 하는 라이브러리

//전체 DB 조회
const getData = async() => {
    const res = await axios.get('/api/task')

    return res.data
}

// 특정 날짜로 데이터 조회
const getUserByDate = async(date) => {
    const res = await axios.get(`/api/task/${date}`)
    return res.data
}

//입력
const addData = async(taskData,files) => {
    
        let fileInfo = [] //파일 정보를 담을 변수/ 
        //최대 10개까지 업로드 가능해서 변수처리

        //파일이 있으면 먼저 업로드 할거야.
        if(files){
            const formData = new FormData()
            formData.append('upload',files)
            //upload라는 이름으로 파일을 넣을거야.

            const fileRes = await axios.post('/api/fileUpload', formData)
            //formData를 fileUpload로 전송다할때까지 기다려

            console.log('파일 업로드 성공:', fileRes.data)

            fileInfo = fileRes.data.files 
            //업로드된 파일정보를 배열에 담아
        }
    
        // 데이터 최종 저장할 부분
    axios.post('/api/task',{ //입력할 내용(날짜, 할일, 파일정보)
        date: taskData.date,
        //taskData란 사용자가 입력한 값을 가상변수에 넣은것
        tasks: taskData.tasks,
        files: fileInfo
    }).then(res=>{
        console.log(res) //저장이 잘되면 200(서버의 응답)을 보낼거야
    }).catch(error=>{
        console.log(error) //저장이 안되면 error를 보여줄거야
    })
}

//수정
const upDateData = async(date, updateData) => {
    
    axios.put(`/api/task/${date}`, updateData)
    // /api/task/${date}


    //then catch문쓰면 await 안써도돼.
    .then(res=>{
        console.log(res)
    }).catch(error=>{
        console.log(error)
    })
}

// 삭제
const deleteData = async(date) => {

    axios.delete(`/api/task/${date}`,{
     // task 데이터에서 사용자가 찾는 날짜 기준으로 db찾아 삭제해줘
    }).then(res=>{
        console.log(res)
    }).catch(error=>{
        console.log(error)
    })
}

export default {
    getData:getData,
    getUserByDate:getUserByDate,
    addData:addData,
    upDateData:upDateData,
    deleteData:deleteData
    }