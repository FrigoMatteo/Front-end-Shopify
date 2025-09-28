import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './home.css';
import { Navbar , Container, Image, Button, Badge,InputGroup,Form, Col,Row} from 'react-bootstrap';
import {ShowFormOrder} from './orderCreate.jsx'

function ShowFirm(props){

  return (
    <div className="firm-section">
      <Image src="/hustle_name.png" fluid style={{ maxHeight: "10vh", width: "auto" }} />
      <div className="welcome-text">
        <i className="bi bi-person"></i> Hi {props.user}
      </div>
    </div>
  );
}


function ShowSingleOrder(props){

  return (
    <div className="single-order">
      <div className="order-info">
        <div><i className="bi bi-basket-fill"></i> Order: {props.order.name}</div>
        <div><i className="bi bi-person-badge"></i> Client: {props.order.customer.displayName}</div>
        <div className={props.order.status === "OPEN" ? "status-open" : "status-completed"}>
          {props.order.status === "OPEN" ? <i className="bi bi-square"></i> : <i className="bi bi-check-square"></i>}
          Status: {props.order.status}
        </div>
      </div>
      <i className="bi bi-trash3-fill delete-icon"></i>
    </div>
  );

}

function ShowHistory(props){

  const [orders,setOrders]=useState(historyItems.draftOrders.edges)

  console.log(orders)
  return (
    <div className="history-container" style={{height: '64.5vh'}}>
      {orders.map(e => (
        <ShowSingleOrder key={e.node.id} order={e.node}/>
      ))}
    </div>
  );
}



function HomeComponent(props){

  return (
    <div className="home-container">
      <Container fluid>
        <Row>
          <Col xs={6} md={3}>
            <Row>
              <ShowFirm user={props.user}/>
            </Row>
            <Row>
              <ShowHistory/>
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


const historyItems = {
  draftOrders: {
    edges: [
      {
        node: {
          id: "gid://shopify/DraftOrder/10006",
          name: "#D6",
          status: "OPEN",
          tags: [],
          customer: {
            id: "gid://shopify/Customer/20006",
            displayName: "Alessandro Blu",
            email: "alessandro.blu@example.com",
          },
        },
      },
      {
        node: {
          id: "gid://shopify/DraftOrder/10007",
          name: "#D7",
          status: "COMPLETED",
          tags: [],
          customer: {
            id: "gid://shopify/Customer/20007",
            displayName: "Chiara Rosa",
            email: "chiara.rosa@example.com",
          },
        },
      },
      {
        node: {
          id: "gid://shopify/DraftOrder/10008",
          name: "#D8",
          status: "OPEN",
          tags: [],
          customer: {
            id: "gid://shopify/Customer/20008",
            displayName: "Davide Marrone",
            email: "davide.marrone@example.com",
          },
        },
      },
      {
        node: {
          id: "gid://shopify/DraftOrder/10009",
          name: "#D9",
          status: "COMPLETED",
          tags: [],
          customer: {
            id: "gid://shopify/Customer/20009",
            displayName: "Elena Viola",
            email: "elena.viola@example.com",
          },
        },
      },
      {
        node: {
          id: "gid://shopify/DraftOrder/10010",
          name: "#D10",
          status: "OPEN",
          tags: [],
          customer: {
            id: "gid://shopify/Customer/20010",
            displayName: "Fabio Arancio",
            email: "fabio.arancio@example.com",
          },
        },
      },
      {
        node: {
          id: "gid://shopify/DraftOrder/10011",
          name: "#D11",
          status: "OPEN",
          tags: [],
          customer: {
            id: "gid://shopify/Customer/20011",
            displayName: "Giorgia Verde",
            email: "giorgia.verde@example.com",
          },
        },
      },
      {
        node: {
          id: "gid://shopify/DraftOrder/10012",
          name: "#D12",
          status: "COMPLETED",
          tags: [],
          customer: {
            id: "gid://shopify/Customer/20012",
            displayName: "Lorenzo Celeste",
            email: "lorenzo.celeste@example.com",
          },
        },
      },
      {
        node: {
          id: "gid://shopify/DraftOrder/10013",
          name: "#D13",
          status: "OPEN",
          tags: [],
          customer: {
            id: "gid://shopify/Customer/20013",
            displayName: "Martina Grigia",
            email: "martina.grigia@example.com",
          },
        },
      },
      {
        node: {
          id: "gid://shopify/DraftOrder/10014",
          name: "#D14",
          status: "COMPLETED",
          tags: [],
          customer: {
            id: "gid://shopify/Customer/20014",
            displayName: "Nicola Azzurro",
            email: "nicola.azzurro@example.com",
          },
        },
      },
      {
        node: {
          id: "gid://shopify/DraftOrder/10015",
          name: "#D15",
          status: "OPEN",
          tags: [],
          customer: {
            id: "gid://shopify/Customer/20015",
            displayName: "Serena Bianca",
            email: "serena.bianca@example.com",
          },
        },
      },
    ],
  },
};

export {HomeComponent};