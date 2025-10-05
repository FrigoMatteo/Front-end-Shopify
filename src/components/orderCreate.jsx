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
        setErrorMessage(res.error)
    }else{
        setCustomerList(res)
    }
  }

  useEffect(() => {
    const updateProducts=async()=>{
      const res=await getProducts()

      if (res?.error){
          setErrorMessage(res.error)
      }else{
          setProductList(res)
      }
    }

    updateProducts()
    updateClients()
    
  }, []);
  
  useEffect(() => {
    console.log("Prodotti nel carrello:", summaryProd);
  }, [summaryProd]);

  // payment link state
  const [paymentLink, setPaymentLink] = useState("");
  const [sendingOrder, setSendingOrder] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

  const sendOrder = async () => {
    if (!summaryProd || summaryProd.length === 0) {
      setErrorMessage("Impossibile inviare: il carrello è vuoto.");
      return;
    }
    setSendingOrder(true);
    setCopyStatus("");

    try {
      // Since no order-create API is defined here, simulate a server response with a payment link.
      // Replace this block with a real API call when available.
      await new Promise(res => setTimeout(res, 700));
      const fakeToken = Math.random().toString(36).slice(2, 10);
      const link = `https://payment.example.com/pay/${Date.now()}-${fakeToken}`;
      setPaymentLink(link);
    } catch (err) {
      setErrorMessage('Errore durante l\'invio dell\'ordine');
    } finally {
      setSendingOrder(false);
    }
  };

  const copyLink = async () => {
    if (!paymentLink) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(paymentLink);
      } else {
        const ta = document.createElement('textarea');
        ta.value = paymentLink;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopyStatus('Copiato!');
      setTimeout(() => setCopyStatus(''), 2000);
    } catch (err) {
      setCopyStatus('Errore copia');
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  const containerStyle = {
    display: "grid", 
    gridTemplateColumns: "30% 40% 30%", 
    width: '100%',
    height: '83.0vh',
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
      {/* Full-width row with order send + payment link */}
      <div style={{ marginTop: '12px', width: '100%', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ flex: '0 0 auto' }}>
          <Button onClick={sendOrder} disabled={sendingOrder} style={{ background: '#D6AD42', color: '#39300D', borderColor: '#D6AD42', fontWeight: 'bold' }}>
            {sendingOrder ? 'Invio...' : 'Invia ordine'}
          </Button>
        </div>

        <div style={{ flex: 1 }}>
          <Form.Control type="text" readOnly value={paymentLink} placeholder="Link di pagamento apparirà qui" />
        </div>

        <div style={{ flex: '0 0 auto', display: 'flex', gap: '8px' }}>
          <Button onClick={copyLink} disabled={!paymentLink} style={{ background: '#ffffff', color: '#39300D', borderColor: '#D6AD42' }}>Copia link</Button>
          <div style={{ alignSelf: 'center', color: '#39300D' }}>{copyStatus}</div>
        </div>
      </div>
      
    </>
  );

}

export {ShowFormOrder};