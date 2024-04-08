import React from 'react';
import {Routes, Route} from 'react-router-dom'; 
import "./globals.css"
import { Home } from './_root/pages';
import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';

const App = () => {
  return (
   <main className="flex h-screen">
    {/* public path */}
    <Routes>
        <Route element= {<AuthLayout/>}>        <Route path = "/sign-in" element = {<SigninForm/>}/>
        <Route path = "/sign-in" element = {<SignupForm/>}/></Route>

        {/* Private path */}
        <Route element = {<RootLayout/>}><Route index element={<Home/>}/></Route>
        
    </Routes>
   </main>
  )
}

export default App;