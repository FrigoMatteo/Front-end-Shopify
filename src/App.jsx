import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Routes, Route, Outlet, Link , BrowserRouter, useNavigate} from 'react-router';
import Image from 'react-bootstrap/Image';



function Header(props) {

  return(
    <>
    <Image src="header.png/100px250" fluid />;
    </>
  );
}

function WrongPage(props){

  return(
    <>
    </>
  );
}





function App() {
  const [user,setUser]=useState(undefined)

  return (
    <>
    <BrowserRouter>
      <Routes>

      <Route path="/" element={<Layout/>}>
        <Route index element={<loginComponent/>}/>
        <Route path="home" element={<HomeComponent/>}/>
        <Route path="*" element={<WrongPage />} />
      </Route>
      
      </Routes>
    </BrowserRouter>
    </>
  )
}



function Layout(props){

  return (

    <>
    <Header/>
    <Outlet />
    </>

  )

}

export default App
