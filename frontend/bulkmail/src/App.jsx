import { useState } from 'react'
import axios from 'axios';
import * as XLSX from "xlsx"

function App() {
const [msg, setMsg] = useState("")
const [status, setStatus] = useState(false)
const [emailList, setEmailList] = useState([])

function handleMsg(event) {
setMsg(event.target.value)
}

function send() {
setStatus(true)
axios.post("https://bulkmail-backend-pro.onrender.com/sendemail", { msg: msg, emailList: emailList })
.then(function (data) {
if (data.data === true) {
alert("Email sent Successfully...")
setStatus(false)
} else {
alert("Failed")
}
})
}

function handlefile(event) {
const file = event.target.files[0];
const reader = new FileReader();

reader.onload = function (e) {
const data = e.target.result;
const workbook = XLSX.read(data, { type: "binary" })
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName]
const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' })
const totalemail = emailList.map(item => item.A)
setEmailList(totalemail)
}
reader.readAsBinaryString(file)
}

return (
<>
<div className='bg-[url("./assets/bg6.jpg")] bg-cover min-h-screen w-full bg-center flex justify-center items-center text-white px-4'>
<div className='w-full max-w-2xl h-auto rounded-xl backdrop-brightness-50 flex flex-col p-5 sm:p-8'>
<h1 className='text-2xl sm:text-3xl font-bold text-center'>Bulk Confirmation Mail</h1>
<h2 className='text-lg sm:text-xl font-bold text-center mt-3'>Upload Excel File</h2>

<div className='flex flex-col mt-4'>
<label htmlFor="textarea" className='mb-2 text-lg sm:text-xl font-semibold'>Text Content:</label>
<textarea
onChange={handleMsg}
value={msg}
className='text-black w-full h-28 sm:h-32 px-3 py-2 rounded-lg text-sm sm:text-base'
placeholder='Enter mail content...'
></textarea>
</div>

<div className='mt-6 text-center'>
<input
onChange={handlefile}
type="file"
className='text-sm sm:text-base font-bold border-2 border-dotted rounded-lg px-2 sm:px-3 py-2 sm:py-3 w-full sm:w-auto'
/>
</div>

<p className='mt-4 text-lg sm:text-2xl font-bold text-center'>
Total E-mails in the file : {emailList.length}
</p>

<div className='flex justify-center'>
<button
onClick={send}
className='w-full sm:w-1/2 border rounded-lg px-4 sm:px-5 py-2 sm:py-3 mt-5 text-lg sm:text-2xl font-bold hover:bg-white hover:text-blue-600 transition'
>
{status ? "Sending..." : "Send"}
</button>
</div>
</div>
</div>
</>
)
}

export default App
