import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Routes, Route, Outlet, Link , BrowserRouter, useNavigate} from 'react-router';
import {HomeComponent} from './components/home';
import {LoginForm} from './components/LoginForm';
import Card from 'react-bootstrap/Card';
import { getSessionAPI } from '../src/api/posts';

function WrongPage(props){

  return(
    <>
    </>
  );
}



function App() {
  const [user, setUser] = useState("");
  const [page, setPage] = useState("wrong"); // "login" | "home" | "wrong"
  const [needLogin,setNeedLogin]=useState(false)


  const getSes = async () => {
    try {
      const user = await getSessionAPI();

        if (user?.error) {
          
          return null; // indica sessione non valida
        } else {
          
          return user; // indica sessione valida
        }
      } catch (error) {
        console.error("Errore nel recupero della sessione:", error);
        
        return "err";
    }
  };

  useEffect(()=>{
    // Used to set any possible account previously logged in
    const getSession=async()=>{
      const res=await getSes()
      if (res==null){
        setUser(undefined);
      }else if(res=="err"){
        console.log("Something went wrong with login")
      }else{
        setPage('home');
        setUser(res.username);
      }
    }

    getSession()
  },[])

  function renderPage() {
    switch (page) {
      case "login":
        return <LoginForm setUser={setUser} setPage={setPage} needLogin={false} setNeedLogin={()=>(console.log("why?"))}/>;
      case "home":
        return <HomeComponent user={user} setUser={setUser} getSes={getSes} setPage={setPage} needLogin={needLogin} setNeedLogin={setNeedLogin}/>;
      default:
        return <WrongPage/>;
    }
  }

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
}




function Layout({ children }){

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
          {children}
      </Card.ImgOverlay>
    </Card>
    </>

  )

}

export default App
