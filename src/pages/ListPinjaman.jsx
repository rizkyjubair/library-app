import {useState, useEffect} from 'react'
import { useNavigate } from 'react-router'
import { getAllData, returnBook } from '../service/service'

const ListPinjaman = () => {
    useEffect(() => {
        getUserData()
    },[])
    const navigate = useNavigate()
    const [user, setUser] = useState({username : '', userid : 0})
    const [listLoanedBook, setListLoanedBook] = useState([])
    const [currHistID, setCurrHistID] = useState(0)
    const getUserData = () => {
        let data = localStorage.getItem('token')
        if(data){
            let user = JSON.parse(data)
            setUser(user)
            getLoanedBooks(user.userid)
        }else{
            navigate('/login')
        }
    }
    const getLoanedBooks = async (userid) => {
        let datahistory = await getAllData('History')
        let listbook = await getAllData('Book')
        let history = datahistory.filter((data)=>{
            return (data.userid == userid && data.returndate === null)
        })
        let loanedbooks = history.map((loanedBook) => {
            let bookname = listbook.find((book)=>{
                return book.bookid == loanedBook.bookid
            }).bookname
            Object.defineProperty(loanedBook, 'bookname', {value : bookname})
            return loanedBook
        })
        setListLoanedBook(loanedbooks)
    }
    const returnBookByHistId = async (historyid) => {
        await returnBook(historyid)
        await getLoanedBooks(user.userid)
        document.getElementById('return-modal').close()
    }
    const openModalReturnBook = (histID) => {
        setCurrHistID(histID)
        document.getElementById('return-modal').showModal()
    }
    const testAlert = () => {
        document.getElementById("return-alert").classList.remove("hidden");
        setTimeout(function () {
            document.getElementById("return-alert").classList.add("hidden");
        }, 5000);
    }
    const TableRow = (props) => {
        return (
            <tr className="border-b border-stone-200 last:border-0">
                <td className="p-3">{props.book.historyid}</td>
                <td className="p-3">{props.book.bookname}</td>
                <td className="p-3">{props.book.loandate.toLocaleString()}</td>
                <td className="p-3">
                    <button className="btn btn-soft cursor-pointer" onClick={()=>openModalReturnBook(props.book.historyid)}>Return</button>
                </td>
            </tr>
        )
    }
    return (
    <div className='flex flex-col items-center min-h-screen w-screen p-4'>
        <header className='flex flex-row justify-between w-full max-w-[900px]'>
            <h1 className='font-semibold text-2xl'>List Book Loan by {user.username}</h1>
            <button className="m-2 h-9 px-2 btn btn-neutral cursor-pointer" onClick={()=>navigate('/')}>Back to Home</button>
        </header>
        <table className='w-full table-fixed max-w-[900px]'>
            <thead className="border-b border-stone-200 bg-stone-100 text-sm font-medium text-stone-600">
            <tr>
                <th className="px-2.5 py-2 text-start font-medium">History ID</th>
                <th className="px-2.5 py-2 text-start font-medium">Book Name</th>
                <th className="px-2.5 py-2 text-start font-medium">Loan Date</th>
                <th className="px-2.5 py-2 text-start font-medium"></th>
            </tr>
            </thead>
            <tbody>
                {
                    listLoanedBook.map((book)=>{
                        return <TableRow book={book} key={book.historyid} />
                    })
                }
            </tbody>
        </table>
        <button className='btn' onClick={()=>testAlert()}>Test Alert</button>
        <div role="alert" className="alert alert-success hidden absolute" id='return-alert'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Your purchase has been confirmed!</span>
        </div>
        <dialog id="return-modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Return Confirmation</h3>
                <p className="py-4">Are you sure want to return this book?</p>
                <div className="modal-action">
                    <button className="btn" onClick={()=>document.getElementById('return-modal').close()}>Cancel</button>
                    <button className="btn" onClick={()=>returnBookByHistId(currHistID)} >Return</button>
                </div>
            </div>
        </dialog>
    </div>
  )
}

export default ListPinjaman