import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Navbar , Container, Image, Button, Badge,InputGroup,Form, Col,Row} from 'react-bootstrap';


function ShowFirm(props){



  return (
    <>
      <h1 style={{
                  fontSize: "2rem",
                  fontWeight: "700",
                  marginBottom: "0.25rem",
                }}> Hustle Production</h1>
      <p style={{
                  fontSize: "1.2rem",
                  fontStyle: "italic",
                  margin: 0,
                }}
              >
                Questo è il sottotitolo
              </p>
    
    </>
  );
}



function HomeComponent(props){

  return (
    <Container fluid>
      <Row>
        <Col xs={6} md={4} style={{borderRight: "2px solid gold"}}>
        <Row>
          <ShowFirm user={props.user}/>
        </Row>
        <Row>
          2
        </Row>
        </Col>

        <Col xs={12} md={8}>
          3
        </Col>
      </Row>
      
    </Container>
  );
}


export {HomeComponent};