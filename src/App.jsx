// I need to make a page that has all of the organization 
// the page with the list of students needs to be seperate
// then I need to make attednanceData its own page 
// itll have a calendar so you can sort through by day
// incorporate tailwind or other styling library
// add sounds and animations for when people are clicked on
// possibly make the data exportable for excel for Pops
// going to have to convert things into csv files
// make it sort by week, having all periods and weeks organized 

// have all the students that are already been put as attending have the selected class, 
// if they submit again with that person removed, that person will get their data popped out
// and be put into absent 

// I may need to add a function that can remove kids that are written as 
// attending but are actually absent (or for miss clicks)
// when the page is loaded itll go through to find all attending kids
// those kids will be added to the selected students list and therefore have the selected styling
// if a student is clicked again it will remove them from present and put them in absent
// I do want to keep track of the time still just in case they were removed on accident
// because then i would want the time they originally had

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
  const [isAdmin, setIsAdmin]= useState(false)

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
            (isAdmin || isAuthenticated)
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
