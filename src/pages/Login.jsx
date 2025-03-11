import { useState } from 'react'
import { useNavigate } from 'react-router'
import { findUserByUsername } from '../service/service'


const Login = () => {
    let navigate = useNavigate()
    const [inputUsername, setInputUsername] = useState("")
    const [inputPassword, setInputPassword] = useState("")
    const login = async (username, password) => {
        let user = await findUserByUsername(username)
        if(user){
            if(user.password == password){
                console.log('User : ', user)
                console.log('User successfully login')
                localStorage.removeItem('token')
                localStorage.setItem('token', JSON.stringify(user))
                navigate('/')
            }else{
                alert('Wrong password')
            }
        }else{
            alert("User not found")
        }
    }
    return (
    <div>
        <div>
            <label for="username" className="block text-sm/6 font-medium text-gray-900">Username</label>
            <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600 w-1/2">
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
            <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600 w-1/2">
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
            <button className="my-4 h-10 px-6 font-semibold rounded-md bg-black text-white cursor-pointer" onClick={()=>navigate('/register')} >Register</button>
            <button className="my-4 h-10 px-6 font-semibold rounded-md bg-black text-white cursor-pointer" onClick={()=>login(inputUsername, inputPassword)}>Login</button>
        </div>
    </div>
  )
}

export default Login