import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { addLoan, getAllData } from '../service/service'

const Home = () => {
    const navigate = useNavigate()
    const [books, setBooks] = useState([])
    const [user, setUser] = useState({username : '', userid : 0})
    const [loan, setLoan] = useState({userid : 0, bookid : 0, stock : 0})
    useEffect(() => {
        getUserData()
        getAllBook()
    },[])
    const getAllBook = async () => {
        let data = await getAllData('Book')
        setBooks(data)
    }
    const getUserData = () => {
        let data = localStorage.getItem('token')
        if(data){
            let user = JSON.parse(data)
            setUser(user)
        }else{
            navigate('/login')
        }
    }
    const loanBook = async (userid, bookid, stock) => {
        if(stock > 0){
            await addLoan(userid, bookid)
            await getAllBook()
            document.getElementById('loan-modal').close()
            // alert('Book successfully loaned')
        }else{
            alert('Empty stock !')
        }
    }
    const openModalLoanBook = (userid, bookid, stock) => {
        setLoan({
            userid : userid,
            bookid : bookid,
            stock : stock
        })
        document.getElementById('loan-modal').showModal()
    }
    const logout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }
    const TableRow = (props) => {
        return (
            <tr className="border-b border-stone-200 last:border-0">
                <td className="p-3">{props.book.bookid}</td>
                <td className="p-3">{props.book.bookname}</td>
                <td className="p-3">{props.book.stock}</td>
                <td className="p-3">
                    <button className="btn btn-soft cursor-pointer" onClick={()=>openModalLoanBook(user.userid, props.book.bookid, props.book.stock)}>Loan</button>
                </td>
            </tr>
        )
    }
  return (
    <div className='flex flex-col items-center min-h-screen w-screen p-4'>
        <header className='flex flex-row justify-between w-full max-w-[900px]'>
            <h1 className='font-semibold text-2xl'>Welcome {user.username}</h1>
            <div className='flex flex-wrap items-end justify-end'>
                <button className="m-2 h-9 px-2 btn btn-neutral cursor-pointer" onClick={()=>navigate('/list-loan')} >Loan Book List</button>
                <button className="m-2 h-9 px-2 btn btn-outline cursor-pointer" onClick={()=>logout()} >Logout</button>
            </div>
        </header>
        <table className='w-full table-fixed max-w-[900px]'>
            <thead className="border-b border-stone-200 bg-stone-100 text-sm font-medium text-stone-600">
            <tr>
                <th className="px-2.5 py-2 text-start font-medium">Book ID</th>
                <th className="px-2.5 py-2 text-start font-medium">Buku</th>
                <th className="px-2.5 py-2 text-start font-medium">Stock</th>
                <th className="px-2.5 py-2 text-start font-medium"></th>
            </tr>
            </thead>
            <tbody>
                {
                    books.map((book)=> {
                        return <TableRow book={book} key={book.bookid} />
                    })
                }
            </tbody>
        </table>
        <dialog id="loan-modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Loan Confirmation</h3>
                <p className="py-4">Are you sure want to loan this book?</p>
                <div className="modal-action">
                    <button className="btn" onClick={()=>document.getElementById('loan-modal').close()}>Cancel</button>
                    <button className="btn" onClick={()=>loanBook(loan.userid, loan.bookid, loan.stock)} >Loan</button>
                </div>
            </div>
        </dialog>
    </div>
  )
}

export default Home