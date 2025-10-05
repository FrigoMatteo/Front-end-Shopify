import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Alert,Navbar , Container, Image, Button,Spinner, Badge,InputGroup,Form, Col,Row} from 'react-bootstrap';
import { getProducts , getClients,postDraftOrder} from '../api/posts';
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

    let customerCreate=null
    if (selectedCustomer?.id){
      customerCreate={
        customerId:selectedCustomer.id,
        name:selectedCustomer?.name || "",
        address:selectedCustomer?.address || "",
        city:selectedCustomer?.city || "",
        company:selectedCustomer?.company || "",
        fiscalCode:selectedCustomer?.fiscalCode || "",
        province:selectedCustomer?.province || "",  
        postalCode:selectedCustomer?.postalCode || "",
        phone:selectedCustomer?.phone || "",
        country:selectedCustomer?.countryCodeV2 || "",
      }
    }

    console.log(summaryProd)
    const productsOwn = summaryProd
      .filter(p => p?.id != null && p?.quantity != null && p?.quantity != 0 && p?.id != "Personalized")
      .map(p => ({
        variantId: p.id || null,
        quantity: p.quantity ?? null,
        appliedDiscount: p.discount!=0
          ? {
              title:
                p.discountType === "PERCENTAGE"
                  ? `Promo -${p.discount}%`
                  : `Sconto ${p.discount}€`,
              value: p.discount ?? null,
              valueType: p.discountType || null
            }
          : null
    }));

    const productsPers = summaryProd
      .filter(p => {
        // Controlli di validità base
        if (p?.id == null || p?.quantity == null || p?.quantity === 0 || p?.price == null || p.id!="Personalized") {
          return false;
        }

        // Calcolo del prezzo unitario e verifica se è un numero finito
        const unitPrice = parseFloat(p.price) / parseFloat(p.quantity);
        return isFinite(unitPrice);
      })
      .map(p => {

        const originalUnitPrice=parseFloat(p.price) / parseFloat(p.quantity);
        return {
        title: p.title || null,
        quantity: p.quantity ?? null,
        originalUnitPrice: originalUnitPrice,
        appliedDiscount: p.discount!=0
          ? {
              title:
                p.discountType === "PERCENTAGE"
                  ? `Promo -${p.discount}%`
                  : `Sconto ${p.discount}€`,
              value: p.discount ?? null,
              valueType: p.discountType || null
            }
          : null
    }});


    if (productsPers.length === 0 && productsOwn.length === 0) {
      setErrorMessage('Errore durante la creazione dell\'ordine. Contatta l\'amministratore');
      return;
    }

    const combinedProds = [...productsOwn, ...productsPers];

    const draftOrder={
      customer:customerCreate,
      products:combinedProds,
      globalDiscount:{

      }

    }
    console.log(draftOrder)
    try {
      
      const res=await postDraftOrder(draftOrder)
      if (res?.error){
        setErrorMessage(res.error)
      }else{
        setPaymentLink(link);
      }
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
    gridTemplateColumns: props.selectDraft!=0 ? "100%" : "30% 40% 30%", 
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
        {/* Expose Request product if we have clicked in "Create draft" */}
        {
          !props.selectDraft && <div style={{ borderRight: "4px solid black", padding: "1rem" }}>
            <RequestProduct addProduct={addProduct} productList={productList}/>
          </div>
        }
          <SummaryCosts draftSelected={props.draftSelected} selectDraft={props.selectDraft} setSummaryProd={setSummaryProd} summaryProd={summaryProd} setSelectedCustomer={setSelectedCustomer} selectedCustomer={selectedCustomer} removeProduct={removeProduct} />
        {/* Expose Request customer if we have clicked in "Create draft" */}
        {
          !props.selectDraft && <div style={{ borderLeft: "4px solid black", padding: "1rem" }}>
            <RequestCustomer updateClients={updateClients} setSelectedCustomer={setSelectedCustomer} customerList={customerList} setCustomerList={setCustomerList}/>
          </div>
        }
      </div>
      {/* Full-width row with order send + payment link */}
      <div style={{ marginTop: '12px', width: '100%', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ flex: '0 0 auto' }}>
          <Button onClick={sendOrder} disabled={sendingOrder} style={{ background: '#D6AD42', color: '#39300D', borderColor: '#D6AD42', fontWeight: 'bold' }}>
            {sendingOrder ? 
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
             : 'Invia ordine'}
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