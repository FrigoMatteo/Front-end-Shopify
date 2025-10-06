import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../css/home.css';
import { Navbar , Container, Image, Button, Badge,InputGroup,Form, Col,Row,Alert} from 'react-bootstrap';
import {ShowFormOrder} from './orderCreate.jsx'
import { getOrders } from '../api/posts';
import { logoutSession } from '../api/posts';
import {LoginForm} from './LoginForm.jsx';
import dayjs from 'dayjs';
import "../css/LoginForm.css"



function ShowFirm(props){

  async function logout(){
    await logoutSession()
    props.setUser("undefined")
    props.setPage('login')
  }

  return (
    <div className="firm-section">
      <Image src="/hustle_name.png" fluid style={{ height: "8vh", width: "auto" }} />
      <div className="welcome-text"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // testo a sinistra, bottone a destra
          alignItems: "center",
          padding: "0.5rem 1rem",
          height:"10vh"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize:"2.5vh"}}>
          <i className="bi bi-person"></i>
          <span>Hi {props.user}</span>
        </div>

        <Button onClick={()=>logout()}
          style={{
            width: "45%",
            fontWeight: "bold",
            color: "#39300D",
            textAlign: "center",
            background: "#D6AD42",
            borderRadius: "5px",
            marginTop:"5px",
            borderColor: "#D6AD42",
            fontSize: "1.5vh",
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
    <div className={`single-order ${props.selectDraft === props.order.id ? 'selected' : ''}`} onClick={()=>props.handleSelect(props.order.id)}>
      <div className="order-info">
        <div><i className="bi bi-basket-fill"></i> Order: {props.order.name}</div>
        <div><i className="bi bi-person-badge"></i> {props.order.customer ? props.order.customer.displayName : "Non definito"}</div>
        <div className={props.order.status === "OPEN" ? "status-open" : "status-completed"}>
          {props.order.status === "OPEN" ? <i className="bi bi-square"></i> : <i className="bi bi-check-square"></i>}
          {props.order.status}
        </div>
        <i className="bi bi-calendar-event"></i>{props.order.createdAt ? dayjs(props.order.createdAt).format('DD/MM/YYYY  HH:mm') : "Non definito"}
      </div>
    </div>
  );

}

function ShowHistory(props) {
  return (
    <>

    <div className="history-container">
      <div className={`single-order ${props.selectDraft === 0 ? 'selected' : ''}`} 
      hover={props.selectDraft} onClick={()=>props.handleSelect(0)} style={{ height:'13.5vh',display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <i className="bi bi-bag-plus-fill" style={{ fontSize: '1.5rem'}}> Create Order</i>
      </div>
        {props.orders.map(e => (
          <ShowSingleOrder selectDraft={props.selectDraft} handleSelect={props.handleSelect} key={e.node.id} order={e.node} />
        ))}
      
    </div>
    </>
  );
}



function HomeComponent(props){

  const [orders,setOrders]=useState([])
  const [errorMessage, setErrorMessage] = useState('');
  const [selectDraft, setSelectDraft] = useState(0);
  const [draftSelected,setDraftSelected]=useState({})

  const [needLogin,setNeedLogin]=useState(false)


  const handleSelect=(id)=>{

    setSelectDraft(id)
    if (id==0){
      setDraftSelected({})
    }else{
      const draft=orders.find(item => item.node.id==id)
      setDraftSelected(draft.node)
    }

  }

  // State used when an action is perfomed (such a pre-order registered)
  const [change,setChange]=useState(true)

  useEffect(() => {
    if (change){
      const update=async()=>{

          const res=await getOrders()

          if (res?.error){
              setErrorMessage(res.error)
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
      {needLogin && (
        <LoginForm setUser={props.setUser} setPage={props.setPage} needLogin={needLogin} setNeedLogin={setNeedLogin}/>
      )}
      <Container fluid>
        <Row>
          <Col xs={6} md={2}>
            <Row>
              <ShowFirm setPage={props.setPage} setUser={props.setUser} user={props.user} errorMessage={errorMessage} setErrorMessage={setErrorMessage}/>
            </Row>
            <Row>
              <ShowHistory selectDraft={selectDraft} handleSelect={handleSelect} orders={orders}/>
            </Row>
          </Col>

          <Col xs={12} md={10}>
            <div className="form-section">
              <ShowFormOrder selectDraft={selectDraft} draftSelected={draftSelected} setChange={setChange} getSes={props.getSes} setNeedLogin={setNeedLogin}/>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export {HomeComponent};