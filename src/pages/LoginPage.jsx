import { useNavigate } from "react-router"
import { useState, useEffect } from "react"
import { RippleButton } from "../components/ripple-button";

const LoginPage = ({ onLogin, onAdminLogin, resetAuth }) => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("")
    const [passwordIsIncorrect, setIsPasswordIncorrect] = useState(false)

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
                setIsPasswordIncorrect(true);
        } 
    };

    return(
        <div className="flex flex-col items-center justify-center min-h-screen gap-10">
            <img src="src\assets\GB_Logo2.png" className="h-48 w-auto" />
            <div className="flex flex-col border rounded-lg shadow-md pb-2">
                <form 
                    onSubmit={handleLogin} 
                    className="flex flex-row gap-4 p-4 pb-2"
                >
                    <input 
                        type="password" 
                        className="w-40 border border-baseOrange rounded px-2 py-1 focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <RippleButton
                        type="submit" 
                        variant="default"
                        size="sm"
                        className="w-18 text-center text-white transition-colors duration-200 font-semibold bg-baseOrange hover:bg-darkOrange"
                        rippleClassName="bg-white/50"
                    >
                        Login
                    </RippleButton>
                </form>
                {passwordIsIncorrect && (
                    <p className="flex text-redAccent justify-center text-xs">Incorrect Password</p>
                )}
            </div>
        </div>
    );
}

export default LoginPage