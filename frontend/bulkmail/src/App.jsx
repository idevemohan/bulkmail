import { useState } from 'react'
import axios from 'axios';
import * as XLSX from "xlsx"


function App() {
  const[msg,setMsg] = useState("")
  const[status,setStatus]=useState(false)
  const [emailList,setEmailList]=useState([])

  function handleMsg(event)
  {
     setMsg(event.target.value)
  }
  
  function send()
  {
    setStatus(true)
     axios.post("https://bulkmail-backend-r1jn.onrender.com",{msg:msg,emailList:emailList})
     .then(function(data)
    {
      if(data.data === true )
      {
        alert("Email set Successfully...")
        setStatus(false)
      }
      else{
        alert("Failed")
      }
    })
  }

  function handlefile(event)
  {
    const file=event.target.files[0];
    console.log(file)

    const reader=new FileReader();
    reader.onload= function(e){
      const data=e.target.result;
      const workbook=XLSX.read(data,{type:"binary"})
      const sheetName=workbook.SheetNames[0];
      const worksheet=workbook.Sheets[sheetName]
      const emailList=XLSX.utils.sheet_to_json(worksheet,{header:'A'})
      const totalemail=emailList.map(function(item){return item.A})
      console.log(totalemail)
      setEmailList(totalemail)
    }
    reader.readAsBinaryString(file)
  }




  return (
    <>
    <div className='bg-[url("./assets/bg6.jpg")] bg-cover h-screen w-screen bg-center overflow-hidden flex justify-center items-center text-white'>
    <div className='mt-5 w-[800px] h-[600px] rounded-xl backdrop-brightness-50 flex flex-col  '>
         <h1 className='text-3xl font-bold text-center p-5 '>Bulk Confirmation Mail</h1>
         <h2 className='text-xl font-bold text-center mt-2'>Drag & Drop</h2>
         <div className='flex flex-col justify-center'>
          <label htmlFor="textarea" className='mt-3 p-5 mx-8 text-2xl font-semibold'>Text Content:</label>
          <textarea onChange={handleMsg} value={msg} className='text-black w-[85%] h-32 px-3 py-3 mx-10 rounded-lg' placeholder='Enter mail content...'></textarea>
         </div>

         <div className='mt-8 text-center'>
          <input onChange={handlefile} type="file" className='text-xl font-bold border-4 border-dotted rounded-lg px-3 py-3 ' />
         </div>
         <p className='mt-5 text-3xl font-bold text-center '>Total E-mails in the file : {emailList.length}</p>

         <div className='flex justify-center'>
           <button onClick={send} className='w-[50%]  border rounded-lg px-5 py-3 mt-6 text-3xl font-bold hover:bg-white hover:text-blue-600'>
            {status?"Sending....":"Send"}
            </button>   
         </div>
    </div>

    </div>
    </>
    
  )
}

export default App
