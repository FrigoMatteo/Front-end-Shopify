import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Alert,Navbar , Container, Image, Button, Badge,InputGroup,Form, Col,Row} from 'react-bootstrap';
import { getProducts , getClients} from '../api/posts';
import {RequestProduct} from './requestProduct';
import {RequestCustomer} from './requestCustomer';
import '../css/orderCreate.css';


function SummaryCosts(props){
  const selectedCustomer=props.selectedCustomer;

  return(
    <>
    <div style={{ borderRight: "4px solid black", padding: "1rem" }}>
      <h3 style={{ color: '#39300D', textAlign: 'center', marginBottom: '20px' }}>Pagamento</h3>
      <div style={{
          background: '#FEF4B1',
          color: '#39300D',
          borderRadius: '8px',
          padding: '15px',
          border: '3px solid #D6AD42'
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

      {selectedCustomer && (
        <div style={{
          background: '#39300D',
          color: '#FEF4B1',
          borderRadius: '8px',
          padding: '15px',
          border: '3px solid #D6AD42',
          marginBottom: '15px'
        }}>
          <h5 style={{ color: '#D6AD42', marginBottom: '10px' }}>Cliente Selezionato</h5>
          <div><strong>Nome:</strong> {selectedCustomer.name}</div>
          <div><strong>Email:</strong> {selectedCustomer.email}</div>
          {selectedCustomer.address && <div><strong>Indirizzo:</strong> {selectedCustomer.address}</div>}
          {selectedCustomer.phone && <div><strong>Telefono:</strong> {selectedCustomer.phone}</div>}
          {selectedCustomer.fiscalCode && <div><strong>Codice Fiscale:</strong> {selectedCustomer.fiscalCode}</div>}
        </div>
      )}
    </div>
    </>
  );
}

function ShowFormOrder(props){

  const [summaryProd,setSummaryProd]=useState([])
  const [productList,setProductList]=useState([])
  const [customerList,setCustomerList]=useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const [errorMessage,setErrorMessage]=useState("")

  const addProduct = (prod) => {
    setSummaryProd(prev => [...prev, prod]); 
  };

  useEffect(() => {
    const updateProducts=async()=>{
      const res=await getProducts()

      if (res?.error){
          setErrorMessage("Error retrieving the products. Contact the administrator")
      }else{
          setProductList(res.products.nodes)
      }
    }

    const updateClients=async()=>{
      const res=await getClients()

      if (res?.error){
          setErrorMessage("Error retrieving clients. Contact the administrator")
      }else{
          setCustomerList(res)
      }
    }

    updateProducts()
    updateClients()
    
  }, []);
  
  useEffect(() => {
    console.log("Prodotti nel carrello:", summaryProd);
  }, [summaryProd]);

  const containerStyle = {
    display: "grid", 
    gridTemplateColumns: "35% 30% 35%", 
    width: '100%',
    height: '89.0vh',
    backgroundColor: '#FEF4B1',
    border: '4px solid gold',
    borderColor: '#D6AD42',
    overflowY: 'auto',
    borderRadius: '8px',
  };

  return (
    <>
      {errorMessage ? <Alert variant='danger' dismissible onClick={()=>setErrorMessage('')}>{errorMessage}</Alert> : ''}
      <div style={containerStyle} className='order-create'>
        <div style={{ borderRight: "4px solid black", padding: "1rem" }}>
          <RequestProduct addProduct={addProduct} productList={productList}/>
        </div>
          <SummaryCosts selectedCustomer={selectedCustomer}/>
        <div style={{ padding: "1rem" }}>
          <RequestCustomer setSelectedCustomer={setSelectedCustomer} customerList={customerList} setCustomerList={setCustomerList}/>
        </div>
      </div>
      
    
    </>
  );

}

export {ShowFormOrder};