import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { addLoan, returnBook, getAllData, findUserByUsername, addData } from '../service/service'

const Home = () => {
    const navigate = useNavigate()
    const [books, setBooks] = useState([])
    const [user, setUser] = useState({username : '', userid : 0})
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
            alert('Book successfully loaned')
        }else{
            alert('Empty stock !')
        }
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
                    <button className="font-sans antialiased text-sm text-current font-medium hover:text-primary cursor-pointer" onClick={()=>loanBook(user.userid, props.book.bookid, props.book.stock)}>Loan</button>
                </td>
            </tr>
        )
    }
  return (
    <div>
        <div className='flex flex-row'>
            <h1>Welcome {user.username}</h1>
            <button className="my-4 h-10 px-6 font-semibold rounded-md bg-black text-white cursor-pointer" onClick={()=>navigate('/list-loan')} >Loan Book List</button>
            <button className="my-4 h-10 px-6 font-semibold rounded-md bg-black text-white cursor-pointer" onClick={()=>logout()} >Logout</button>
        </div>
        <table>
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
        {/* <button 
            className="my-4 h-10 px-6 font-semibold rounded-md bg-black text-white cursor-pointer" 
            onClick={()=>findUserByUsername("johndoe")}>
                Get User By Username
        </button>
        <button 
            className="my-4 h-10 px-6 font-semibold rounded-md bg-black text-white cursor-pointer" 
            onClick={()=>addData('User', {username : 'johndoe', password : 'password123'})}>
                Create User
        </button>
        <button 
            className="my-4 h-10 px-6 font-semibold rounded-md bg-black text-white cursor-pointer" 
            onClick={()=>addData('Book', {bookname : 'Python guide', stock : 15})}>
                Add Book
        </button>
        <button 
            className="my-4 h-10 px-6 font-semibold rounded-md bg-black text-white cursor-pointer" 
            onClick={()=>getAllBook()}>
                Read Books
        </button>
        <button 
            className="my-4 h-10 px-6 font-semibold rounded-md bg-black text-white cursor-pointer" 
            onClick={()=>addLoan(1, 1)}>
                Loan Book
        </button>
        <button 
            className="my-4 h-10 px-6 font-semibold rounded-md bg-black text-white cursor-pointer" 
            onClick={()=>returnBook(1)}>
                Return Book
        </button> */}
    </div>
  )
}

export default Home