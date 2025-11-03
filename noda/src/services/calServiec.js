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
const addData = async(taskData) => { //파일업로드 기능 삭제
    /*
        // 데이터 최종 저장할 부분
    axios.post('/api/task',{
        //입력할 내용(날짜, 할일, 파일정보)
        date: taskData.date,
        //taskData란 사용자가 입력한 값을 가상변수에 넣은것
        tasks: taskData.tasks,
        files: fileInfo
    })*/

    axios.post('/api/task',taskData)
    //파일 업로드기능빼서 새로 입력

        .then(res=>{
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