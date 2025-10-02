import { useNavigate } from "react-router"
import { useState, useEffect } from "react"

const LoginPage = ({ onLogin, onAdminLogin, resetAuth }) => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("")

    useEffect(() => {
        resetAuth()
    }, [])

    const handleLogin = (e) => {
        e.preventDefault();

        switch(password){
            case "123":
                onLogin();
                navigate("/classselection")
                break;
            case "admin":
                onLogin();
                onAdminLogin()
                navigate("/classselection")
                break;
            default:
                alert("Invalid password");
        } 
    }

    return(
        <>
            <form onSubmit={handleLogin}>
                <input 
                    type="text" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit"> Login </button>
            </form>
        </>
    );
}

export default LoginPage