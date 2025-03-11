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
        alert('Book succesfully returned')
    }
    const TableRow = (props) => {
        return (
            <tr className="border-b border-stone-200 last:border-0">
                <td className="p-3">{props.book.historyid}</td>
                <td className="p-3">{props.book.bookname}</td>
                <td className="p-3">{props.book.loandate.toLocaleString()}</td>
                <td className="p-3">
                    <button className="font-sans antialiased text-sm text-current font-medium hover:text-primary cursor-pointer" onClick={()=>returnBookByHistId(props.book.historyid)}>Return</button>
                </td>
            </tr>
        )
    }
    return (
    <div>
        <div className='flex flex-row'>
            <h1>List Book Loan by {user.username}</h1>
            <button className="my-4 h-10 px-6 font-semibold rounded-md bg-black text-white cursor-pointer" onClick={()=>navigate('/')}>Back to Home</button>
            <button className="my-4 h-10 px-6 font-semibold rounded-md bg-black text-white cursor-pointer" onClick={()=>getLoanedBooks()}>Get Loaned Book</button>
        </div>
        <table>
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
    </div>
  )
}

export default ListPinjaman