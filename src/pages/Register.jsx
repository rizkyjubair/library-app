import {useState} from 'react'
import {useNavigate} from 'react-router'
import { findUserByUsername, addData } from '../service/service'
import Alert from '../components/Alert'

const Register = () => {
    const navigate = useNavigate()
    const [inputUsername, setInputUsername] = useState("")
    const [inputPassword, setInputPassword] = useState("")
    const [toastAlert, setToastAlert] = useState({message : '', type : ''})
    const register = async (username, password) => {
        const user = await findUserByUsername(username)
        if(user){
            console.log('already exist')
            showAlert('alert-error', `User with username ${user.username} is already exist`)
        } else {
            await addData('User', {username : username, password : password})
            showAlert('alert-success','User succesfully registered')
        }
    }
    const showAlert = (type, message) => {
        setToastAlert({
            type : type,
            message : message
        })
        console.log(type, message)
        document.getElementById("alert").classList.remove("hidden");
        setTimeout(function () {
            document.getElementById("alert").classList.add("hidden");
        }, 2000);
    }
    return (
    <div className='flex flex-col justify-center items-center min-h-screen'>
        <p className='font-semibold text-2xl mb-10'>Register to Library App</p>
        <div>
            <label for="username" className="block text-sm/6 font-medium text-gray-900">Username</label>
            <div className="mt-1">
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600 max-w-[500px] min-w-[370px]">
                <input 
                    type="text" 
                    name="username" 
                    id="username" 
                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" 
                    placeholder="Enter name"
                    value={inputUsername}
                    onChange={(e)=>setInputUsername(e.target.value)}
                />
                </div>
            </div>
        </div>
        <div>
            <label for="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
            <div className="mt-1">
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600 max-w-[500px] min-w-[370px]">
                <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" 
                    placeholder="Enter password"
                    value={inputPassword}
                    onChange={(e)=>setInputPassword(e.target.value)}
                />
                </div>
            </div>
        </div>
        <div className='flex flex-row'>
            <button className="m-4 h-9 px-2 btn btn-outline cursor-pointer" onClick={()=>navigate('/login')} >Back</button>
            <button className="m-4 h-9 px-2 btn btn-neutral cursor-pointer" onClick={()=>register(inputUsername, inputPassword)} >Register</button>
        </div>
        <Alert alert={toastAlert} />
    </div>
  )
}

export default Register