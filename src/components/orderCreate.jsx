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

  const [selectCustomer, setSelectCustomer] = useState("");

  // global cart discount (percentage 0-100)
  const [cartDiscount, setCartDiscount] = useState(0);
  const [discountType, setDiscountType] = useState("FIXED_AMOUNT");

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


  /* When we press a history draftOrder  */
  useEffect(() => {
    // We clean possible states
    setCartDiscount(0)
    setDiscountType("FIXED_AMOUNT")

    if (props.selectDraft!=0){

      let normalizedCustomer={}
      if (props.draftSelected.customer){
        const found=props.draftSelected.customer;
        const fullPhone = found.defaultAddress.phone || "";
        normalizedCustomer = {
          id: found.id,
          name: found.displayName || "",
          email: (found.email) || (found.defaultEmailAddress && found.defaultEmailAddress.emailAddress) || "",
          company: found.defaultAddress.company || found.organization || "",
          address: found.address || (found.defaultAddress && (found.defaultAddress.address1 || found.defaultAddress.formatted)) || "",
          city: found.city || (found.defaultAddress && found.defaultAddress.city) || "",
          postalCode: found.postalCode || (found.defaultAddress && found.defaultAddress.zip) || "",
          province: found.province || (found.defaultAddress && found.defaultAddress.province) || "",
          countryCode: found.countryCode || found.country || (found.defaultAddress && found.defaultAddress.provinceCode) || "",
          countryName: found.defaultAddress.country || "",
          phone: fullPhone,
          fiscalCode: found.defaultAddress.address2 || "",
          spam: (found.emailMarketingConsent?.marketingState=="NOT_SUBSCRIBED" ? false : true) || false
        };

      }else{
        normalizedCustomer={name:"Nessun cliente associato"}
      }
      setSelectedCustomer(normalizedCustomer)

      const normalizeProds=props.draftSelected?.lineItems?.edges?.map(({ node }) => ({
        id: node.variant?.id || node.id,
        title: node.title,
        quantity: node.quantity,
        price: node.originalUnitPriceSet.shopMoney.amount *node.quantity,
        discount: node.appliedDiscount?.value || 0,
        discountType:node.appliedDiscount?.valueType || "FIXED_AMOUNT"
      })) || [];
      setPaymentLink(props.draftSelected.invoiceUrl);
      setSummaryProd(normalizeProds)
      setDiscountType(props.draftSelected.appliedDiscount?.valueType || "FIXED_AMOUNT")
      setCartDiscount(props.draftSelected.appliedDiscount?.value || 0)
    }else{
      setSummaryProd([])
      setSelectedCustomer(null)
    }

  }, [props.selectDraft]);


  // payment link state
  const [paymentLink, setPaymentLink] = useState("");
  const [sendingOrder, setSendingOrder] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

  // clear payment link when signalled by parent (e.g., selecting Create Order)
  useEffect(() => {
    if (props.clearPaymentLinkSignal !== undefined) {
      setPaymentLink("");
    }
  }, [props.clearPaymentLinkSignal]);

  const sendOrder = async () => {
    if (!summaryProd || summaryProd.length === 0) {
      setErrorMessage("Impossibile inviare: il carrello è vuoto.");
      return;
    }

    const session = await props.getSes();
    if (!session) {
      console.warn("Sessione non valida, interrompo operazione");
      props.setNeedLogin(true)
      return; // blocca l’esecuzione se non c’è sessione valida
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
    // Raccolta lista solo prodotti già esistenti
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

    // Raccolta prodotti solo personalizzati
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
        title: discountType === "PERCENTAGE"
                ? `Promo sul Totale -${cartDiscount}%`
                : `Sconto sul Totale ${cartDiscount}€`,
        value:cartDiscount,
        valueType:discountType,
      }
    }
    console.log("Created:",draftOrder)
    try {
      
      const res=await postDraftOrder(draftOrder)
      if (res?.error){
        setErrorMessage(res.error)
      }else if(res=={}){
        setErrorMessage("Errore creazione ordine. Se persiste contatta l'amministratore")
      }else{
        setPaymentLink(res.invoiceUrl);
        setCartDiscount(0);
        setDiscountType("FIXED_AMOUNT");
        setSelectCustomer("")
        setSummaryProd([]);
        setSelectedCustomer(null);

        // Used to update the draftOrder history. We do a get call.
        props.setChange(true)
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
          <SummaryCosts cartDiscount={cartDiscount} setCartDiscount={setCartDiscount} discountType={discountType} setDiscountType={setDiscountType}
          selectDraft={props.selectDraft} summaryProd={summaryProd} selectedCustomer={selectedCustomer} removeProduct={removeProduct} />
        {/* Expose Request customer if we have clicked in "Create draft" */}
        {
          !props.selectDraft && <div style={{ borderLeft: "4px solid black", padding: "1rem" }}>
            <RequestCustomer selectCustomer={selectCustomer} setSelectCustomer={setSelectCustomer}
            getSes={props.getSes} setNeedLogin={props.setNeedLogin} updateClients={updateClients} setSelectedCustomer={setSelectedCustomer} customerList={customerList} setCustomerList={setCustomerList}/>
          </div>
        }
      </div>
      {/* Full-width row with order send + payment link */}
      <div style={{ marginTop: '12px', width: '100%', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ flex: '0 0 auto' }}>
          <Button onClick={sendOrder} disabled={sendingOrder} aria-label="Invia ordine" style={{ background: '#D6AD42', color: '#39300D', borderColor: '#D6AD42', fontWeight: 'bold' }}>
            {sendingOrder ? (
              <>
                <Spinner animation="border" role="status" size="sm">
                  <span className="visually-hidden">Invio in corso...</span>
                </Spinner>
              </>
            ) : (
              <>
                <i className="bi bi-send-fill me-2" aria-hidden="true"></i>
                Invia ordine
              </>
            )}
          </Button>
        </div>

        <div style={{ flex: 1 }}>
          <Form.Control type="text" readOnly value={paymentLink} placeholder="Link di pagamento apparirà qui" />
        </div>

        <div style={{ flex: '0 0 auto', display: 'flex', gap: '8px' }}>
          <Button onClick={copyLink} disabled={!paymentLink} aria-label="Copia link" style={{ background: '#ffffff', color: '#39300D', borderColor: '#D6AD42' }}>
            <i className="bi bi-clipboard me-2" aria-hidden="true"></i>
            Copia link
          </Button>
          <div style={{ alignSelf: 'center', color: '#D6AD42' }}>{copyStatus}</div>
        </div>
      </div>
      
    </>
  );

}

export {ShowFormOrder};