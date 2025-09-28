import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Navbar , Container, Image, Button, Badge,InputGroup,Form, Col,Row} from 'react-bootstrap';




function ShowFormOrder(props){
  const containerStyle = {
    display: "grid", 
    gridTemplateColumns: "30% 35% 35%", 
    width: '100%',
    marginTop:'3vh',
    height: '85.5vh',
    backgroundColor: '#E0E0E0',
    border: '4px solid gold',
    overflowY: 'auto',
    borderRadius: '8px',
  };

  const singleCol = {
    borderRight: "2px solid black", 
    padding: "1rem",
    height:"100%"
  };

  return (
    <>
      
      <div style={containerStyle}>
        <div style={{ borderRight: "4px solid black", padding: "1rem" }}>
            <p>Colonna 1 (30%)</p>
        </div>
        <div style={{ borderRight: "4px solid black", padding: "1rem" }}>
            <p>Colonna 2 (35%)</p>
        </div>
        <div style={{ padding: "1rem" }}>
            <p>Colonna 3 (35%)</p>
        </div>
      </div>
      
    
    </>
  );

}


export {ShowFormOrder};