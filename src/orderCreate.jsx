import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Navbar , Container, Image, Button, Badge,InputGroup,Form, Col,Row} from 'react-bootstrap';




function ShowFormOrder(props){
  const containerStyle = {
    display: "grid", 
    gridTemplateColumns: "30% 35% 35%", 
    width: '100%',
    height: '85.5vh',
    backgroundColor: '#fff',
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
            <div style={{ 
                background: '#39300D', 
                color: '#D6AD42', 
                borderRadius: '10px', 
                padding: '20px',
                border: '2px solid #D6AD42'
            }}>
                <h3 style={{ color: '#FEF4B1', textAlign: 'center', marginBottom: '20px' }}>Pagamento</h3>
                <div style={{
                    background: '#FEF4B1',
                    color: '#39300D',
                    borderRadius: '8px',
                    padding: '15px',
                    border: '2px solid #D6AD42'
                }}>
                    <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                        Subtotale: <span style={{ float: 'right' }}>0.0$</span>
                    </div>
                    <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                        Sconto: <span style={{ float: 'right' }}>0.0$</span>
                    </div>
                    <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                        Spese di Spedizione: <span style={{ float: 'right' }}>0.0$</span>
                    </div>
                    <div style={{ marginBottom: '15px', fontWeight: 'bold' }}>
                        Imposta stimata: <span style={{ float: 'right' }}>0.0$</span>
                    </div>
                    <hr style={{ border: '1px solid #D6AD42', margin: '15px 0' }} />
                    <div style={{ 
                        fontSize: '1.2em', 
                        fontWeight: 'bold', 
                        color: '#39300D',
                        textAlign: 'center',
                        padding: '10px',
                        background: '#D6AD42',
                        borderRadius: '5px'
                    }}>
                        Totale: 0.0$
                    </div>
                </div>
            </div>
        </div>
        <div style={{ padding: "1rem" }}>
            <p>Colonna 3 (35%)</p>
        </div>
      </div>
      
    
    </>
  );

}


export {ShowFormOrder};