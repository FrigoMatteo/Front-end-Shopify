import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/home.css';
import { Navbar , Container, Image, Button, Badge,InputGroup,Form, Col,Row,Alert} from 'react-bootstrap';
import {ShowFormOrder} from './orderCreate.jsx'
import { getOrders } from '../api/posts';
import { useNavigate} from 'react-router';
import { getSessionAPI,logoutSession } from '../api/posts';



function ShowFirm(props){
  const navigate=useNavigate()

  async function logout(){
    await logoutSession()
    props.setUser("undefined")
    navigate("/")
  }

  return (
    <div className="firm-section">
      <Image src="/hustle_name.png" fluid style={{ maxHeight: "10vh", width: "auto" }} />
      <div className="welcome-text"
        style={{
          display: "flex",
          justifyContent: "space-between", // testo a sinistra, bottone a destra
          alignItems: "center",
          padding: "0.5rem 1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <i className="bi bi-person"></i>
          <span>Hi {props.user}</span>
        </div>

        <Button onClick={()=>logout()}
          style={{
            width: "25%",
            fontWeight: "bold",
            color: "#39300D",
            textAlign: "center",
            background: "#D6AD42",
            borderRadius: "5px",
            borderColor: "#D6AD42",
            fontSize: "0.8vw",
          }}
        >
          Logout
        </Button>
      </div>
      {props.errorMessage ? <Alert variant='danger' dismissible onClick={()=>props.setErrorMessage('')}>{props.errorMessage}</Alert> : ''}
    </div>
  );
}


function ShowSingleOrder(props){

  return (
    <div className="single-order">
      <div className="order-info">
        <div><i className="bi bi-basket-fill"></i> Order: {props.order.name}</div>
        <div><i className="bi bi-person-badge"></i> Client: {/*props.order.customer.displayName*/}</div>
        <div className={props.order.status === "OPEN" ? "status-open" : "status-completed"}>
          {props.order.status === "OPEN" ? <i className="bi bi-square"></i> : <i className="bi bi-check-square"></i>}
          Status: {props.order.status}
        </div>
      </div>
      <i className="bi bi-trash3-fill delete-icon"></i>
    </div>
  );

}

function ShowHistory(props) {
  return (
    <>

    <div className="history-container" style={{ height: "68vh" }}>
      <div className="single-order" style={{ height:'13.5vh',display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <i className="bi bi-bag-plus-fill" style={{ fontSize: '1.5rem'}}> Create Order</i>
      </div>
        {props.orders.map(e => (
          <ShowSingleOrder key={e.node.id} order={e.node} />
        ))}
      
    </div>
    </>
  );
}



function HomeComponent(props){

  const [orders,setOrders]=useState([])
  const [errorMessage, setErrorMessage] = useState('');
  const navigate=useNavigate()

  // State used when an action is perfomed (such a pre-order registered)
  const [change,setChange]=useState(true)

  useEffect(()=>{
    // Used to set any possible account previously logged in
    
    const getSes=async ()=>{
      const user=await getSessionAPI()
      if (user?.error){
        props.setUser("undefined")
        navigate('/')
      }else{
        props.setUser(user.username)
      }
    }

    getSes()
  },[])

  useEffect(() => {
    if (change){
      const update=async()=>{

          const res=await getOrders()

          if (res?.error){
              setErrorMessage("Error retriving the orders. Contact the administrator")
          }else{
              setOrders(res.draftOrders.edges)
          }
        }
      update()

      setChange(false)
    }
    
  }, [change]);

  return (
    <div className="home-container">
      <Container fluid>
        <Row>
          <Col xs={6} md={3}>
            <Row>
              <ShowFirm setUser={props.setUser} user={props.user} errorMessage={errorMessage} setErrorMessage={setErrorMessage}/>
            </Row>
            <Row>
              <ShowHistory orders={orders}/>
            </Row>
          </Col>

          <Col xs={12} md={9}>
            <div className="form-section">
              <ShowFormOrder/>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export {HomeComponent};