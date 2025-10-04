import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Alert,Navbar , Container, Image, Button, Badge,InputGroup,Form, Col,Row} from 'react-bootstrap';
import { getProducts , getClients} from '../api/posts';
import {RequestProduct} from './requestProduct';
import {RequestCustomer} from './requestCustomer';
import {SummaryCosts} from './summaryCosts';
import '../css/orderCreate.css';

function ShowFormOrder(props){

  const [summaryProd,setSummaryProd]=useState([])
  const [productList,setProductList]=useState([])
  const [customerList,setCustomerList]=useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  const [errorMessage,setErrorMessage]=useState("")

  const addProduct = (prod) => {
    setSummaryProd(prev => [...prev, prod]); 
  };

  const removeProduct = (index) => {
    setSummaryProd(prev => prev.filter((_, i) => i !== index));
  };

  const updateClients=async()=>{
    const res=await getClients()

    if (res?.error){
        setErrorMessage("Error retrieving clients. Contact the administrator")
    }else{
        setCustomerList(res)
    }
  }

  useEffect(() => {
    const updateProducts=async()=>{
      const res=await getProducts()

      if (res?.error){
          setErrorMessage("Error retrieving the products. Contact the administrator")
      }else{
          setProductList(res.products.nodes)
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
    gridTemplateColumns: "30% 40% 30%", 
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
          <SummaryCosts summaryProd={summaryProd} selectedCustomer={selectedCustomer} removeProduct={removeProduct} />
        <div style={{ padding: "1rem" }}>
          <RequestCustomer updateClients={updateClients} setSelectedCustomer={setSelectedCustomer} customerList={customerList} setCustomerList={setCustomerList}/>
        </div>
      </div>
      
    
    </>
  );

}

export {ShowFormOrder};