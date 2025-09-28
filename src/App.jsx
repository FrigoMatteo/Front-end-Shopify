import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Routes, Route, Outlet, Link , BrowserRouter, useNavigate} from 'react-router';
import {HomeComponent} from './components/home';
import {LoginForm} from './components/LoginForm';
import Card from 'react-bootstrap/Card';

function WrongPage(props){

  return(
    <>
    </>
  );
}





function App() {
  const [user,setUser]=useState("TestName")

  return (
    <>
    <BrowserRouter>
      <Routes>

      <Route path="/" element={<Layout/>}>
        <Route index element={<LoginForm/>}/>
        <Route path="home" element={<HomeComponent user={user}/>}/>
        <Route path="*" element={<WrongPage />} />
      </Route>
      
      </Routes>
    </BrowserRouter>
    </>
  )
}



function Layout(props){

  const cardStyle = {
    backgroundImage: 'url("/header_pic.png")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    border: "none",
    width: "100%",
    minHeight: "100vh", 
  };


  return (

    <>
    <Card style={cardStyle}>
      <Card.ImgOverlay>
          <Outlet />
      </Card.ImgOverlay>
    </Card>
    </>

  )

}

export default App
