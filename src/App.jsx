import { Routes, Route, Navigate } from "react-router"
import { useState } from "react"

import LoginPage from './pages/LoginPage.jsx'
import ClassSelection from './pages/ClassSelection.jsx'
import StudentSelection from './pages/StudentSelection.jsx'
import ClassData from './pages/ClassData.jsx'
import './css/App.css'

import {HeroUIProvider} from "@heroui/react";

function App() {
    const [isAuthenticated, setIsAuthenticated]= useState(false)
    const [isAdmin, setIsAdmin]= useState(true)

    // localStorage.clear();
    // sessionStorage.clear();

    return (
        <HeroUIProvider>
            <Routes>
                <Route path="/" element={
                    <LoginPage 
                        onLogin={() => setIsAuthenticated(true)}
                        onAdminLogin={() => setIsAdmin(true)}
                        resetAuth={() => {
                        setIsAuthenticated(false)
                        setIsAdmin(false)
                        }}
                    />} 
                />
                <Route 
                    path="/classselection"
                    element={
                        (isAdmin || isAuthenticated) 
                        ? <ClassSelection isAdmin={isAdmin} /> 
                        : <Navigate to="/" />
                    }
                />
                <Route 
                    path="/students"
                    element={
                        (isAdmin || isAuthenticated || sessionStorage.getItem("inStudentSelection"))
                        ? <StudentSelection isAdmin={isAdmin} />
                        : <Navigate to="/" />
                    }
                />
                <Route 
                    path="/classdata" 
                    element={isAdmin ? <ClassData/>: <Navigate to="/"/>}
                />
            </Routes>
        </HeroUIProvider>
    )
}

export default App
