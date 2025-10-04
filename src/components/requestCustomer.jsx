import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Alert,Navbar , Container, Image, Button, Badge,InputGroup,Form, Col,Row} from 'react-bootstrap';




function RequestCustomer(props){
  
  const [customers, setCustomers] = useState([]);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [selectCustomer, setSelectCustomer] = useState("");
  
  // New customer form states
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerSurname, setNewCustomerSurname] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerSpam, setNewCustomerSpam] = useState(false);
  const [newCustomerCountry, setNewCustomerCountry] = useState("");
  const [newCustomerCompany, setNewCustomerCompany] = useState("");
  const [newCustomerAddress, setNewCustomerAddress] = useState("");
  const [newCustomerCity, setNewCustomerCity] = useState("");
  const [newCustomerPostalCode, setNewCustomerPostalCode] = useState("");
  const [newCustomerProvince, setNewCustomerProvince] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerPhonePrefix, setNewCustomerPhonePrefix] = useState("");
  const [newCustomerFiscalCode, setNewCustomerFiscalCode] = useState("");
  
  const [errorMessage, setErrorMessage] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  useEffect(() => {
    // Initialize with mock customers data
    setCustomers(props.customerList);
  }, [props.customerList]);

  const handleSearch = () => {
    console.log("Search customer",searchCustomer)
    let risultati = [];
    if (searchCustomer === "") {
      risultati = props.customerList;
    } else {
      risultati = props.customerList.filter(item =>
        item.displayName.toLowerCase().includes(searchCustomer.toLowerCase()) ||
        item.defaultEmailAddress.emailAddress.toLowerCase().includes(searchCustomer.toLowerCase())
      );
    }
    setCustomers(risultati);
  }

  const selectCustomerList = (id) => {
    // toggle selection and notify parent with a normalized customer object
    if (id === selectCustomer) {
      setSelectCustomer("");
      props.setSelectedCustomer(null);
    } else {
      setSelectCustomer(id);
      // find the customer in the current filtered list first, fallback to full prop list
      const found = customers.find(c => c.id === id) || (props.customerList || []).find(c => c.id === id);
      if (found) {
        // normalize to include all useful fields so SummaryCosts can show full info
        const phonePrefix = found.phonePrefix || found.phone_prefix || "";
        const phoneNumber = found.phone || found.phoneNumber || (found.defaultPhone && found.defaultPhone.number) || "";
        const fullPhone = phonePrefix ? `${phonePrefix} ${phoneNumber}` : phoneNumber;

        const normalized = {
          id: found.id,
          name: found.name || found.displayName || found.firstName || "",
          surname: found.surname || found.lastName || "",
          email: (found.email) || (found.defaultEmailAddress && found.defaultEmailAddress.emailAddress) || "",
          company: found.company || found.organization || "",
          address: found.address || (found.defaultAddress && (found.defaultAddress.address1 || found.defaultAddress.formatted)) || "",
          city: found.city || (found.defaultAddress && found.defaultAddress.city) || "",
          postalCode: found.postalCode || (found.defaultAddress && found.defaultAddress.zip) || "",
          province: found.province || (found.defaultAddress && found.defaultAddress.province) || "",
          countryCode: found.countryCode || found.country || (found.defaultAddress && found.defaultAddress.country) || "",
          countryName: found.countryName || "",
          phonePrefix: phonePrefix,
          phone: phoneNumber,
          fullPhone: fullPhone,
          fiscalCode: found.fiscalCode || found.taxNumber || "",
          spam: typeof found.spam === 'boolean' ? found.spam : !!found.acceptsMarketing || false
        };
        props.setSelectedCustomer(normalized);
      } else {
        props.setSelectedCustomer(null);
      }
    }
  }

  const handleSelectCustomer = (e) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === selectCustomer);
    if (customer) {
      props.setSelectedCustomer(customer);
      setSelectCustomer("");
      setSearchCustomer("");
    }
  };

  const handleAddNewCustomer = (e) => {
    e.preventDefault();

    if (!newCustomerName || !newCustomerSurname || !newCustomerEmail ||
       !newCustomerAddress || !newCustomerPhone || !newCustomerFiscalCode ||
        !newCustomerCompany || !newCustomerCity || !newCustomerPostalCode ||
         !newCustomerProvince || !newCustomerPhonePrefix) {
      setErrorMessage("All fields are required.");
      return;
    }

    const newCustomer = {
      id: "gid://shopify/Customer/" + Date.now(),
      name: newCustomerName,
      surname: newCustomerSurname,
      email: newCustomerEmail,
      phonePrefix: newCustomerPhonePrefix,
      phone: newCustomerPhone,
      fiscalCode: newCustomerFiscalCode,
      company: newCustomerCompany,
      country: newCustomerCountry,
      city: newCustomerCity,
      address: newCustomerAddress,
      postalCode: newCustomerPostalCode,
      province: newCustomerProvince,
      spam: newCustomerSpam,
    };

    // Add to customers list
    // Add customer. we need to send a post before !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    setCustomers([newCustomer, ...props.customerList]);
    props.setCustomerList(prev => [newCustomer,...prev]);
    selectCustomerList(newCustomer.id)

    // Ho cambiato che elimina quello che magari c'era scritto nella ricerca del cliente
    // E ricarica la ricerca in modo tale da mostrare tutti
    setSearchCustomer("")
    //handleSearch()
    
    // Set as selected customer
    props.setSelectedCustomer(newCustomer);
    
    // Reset form
    setNewCustomerName("");
    setNewCustomerEmail("");
    setNewCustomerAddress("");
    setNewCustomerPhone("");
    setNewCustomerFiscalCode("");
    setErrorMessage("");
    setNewCustomerCompany("");
    setNewCustomerCity("");
    setNewCustomerPostalCode("");
    setNewCustomerProvince("");
    setNewCustomerPhonePrefix("");
    setNewCustomerSpam(false);
    setNewCustomerCountry("");
    setNewCustomerSurname("");
  };

  return(
    <>
    <div className="product-box">
      <div className='order-info'>
        <div style={{ color: '#39300D', fontSize: "1.1vw", fontWeight:'bold', marginBottom: '10px' }}>Seleziona Cliente</div>
        
        <div className='order-create' style={{
            background: '#39300D',
            color: '#39300D',
            borderRadius: '8px',
            padding: '15px',
            border: '3px solid #D6AD42',
            height: '35vh',
            overflowY: 'auto',
        }}>
          {customers.map(customer => (
            <SingleCustomer 
              key={customer.id} 
              targetSelect={selectCustomer === customer.id} 
              customer={customer} 
              selectCustomerList={selectCustomerList} 
            />
          ))}
        </div>
      </div>
    </div>
    
    <div className="product-box" style={{height:'auto', alignItems: 'flex-start', display: 'block'}}>
      <div className='order-info'>
        <div style={{ color: '#39300D', fontSize: "1.1vw", fontWeight:'bold', marginBottom: '10px'}}>Aggiungi Nuovo Cliente</div>
        
        <Form onSubmit={handleAddNewCustomer}>
          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Nome:</Form.Label>
            <Form.Control style={{fontSize: "0.8vw", flex: "1"}}
              type="text"
              placeholder="Nome"
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Cognome:</Form.Label>
            <Form.Control style={{fontSize: "0.8vw", flex: "1"}}
              type="text"
              placeholder="Cognome"
              value={newCustomerSurname}
              onChange={(e) => setNewCustomerSurname(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Email:</Form.Label>
            <Form.Control style={{fontSize: "0.8vw", flex: "1"}}
              type="email"
              placeholder="email@example.com"
              value={newCustomerEmail}
              onChange={(e) => setNewCustomerEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Spam:</Form.Label>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <Form.Check
                type="checkbox"
                id="newCustomerSpam"
                label="Ricevere promozioni via email"
                checked={!!newCustomerSpam}
                onChange={(e) => setNewCustomerSpam(e.target.checked)}
                style={{ fontSize: '0.8vw' }}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Codice Fiscale:</Form.Label>
            <Form.Control style={{fontSize: "0.8vw", flex: "1"}}     
              type="text"
              placeholder="RSSMRA80A01H501U"
              value={newCustomerFiscalCode}
              onChange={(e) => setNewCustomerFiscalCode(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Azienda:</Form.Label>
            <Form.Control style={{fontSize: "0.8vw", flex: "1"}}
              type="text"
              placeholder=""
              value={newCustomerCompany}
              onChange={(e) => setNewCustomerCompany(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Paese:</Form.Label>
            <Form.Select
              value={newCustomerCountry}
              onChange={(e) => setNewCustomerCountry(e.target.value)}
              aria-label="Seleziona Paese"
              style={{ fontSize: '0.8vw', flex: '1' }}
              required
            >
              <option value="">Seleziona Paese</option>
              <option value="IT">Italy (+39)</option>
              <option value="US">United States (+1)</option>
              <option value="GB">United Kingdom (+44)</option>
              <option value="FR">France (+33)</option>
              <option value="DE">Germany (+49)</option>
              <option value="ES">Spain (+34)</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Indirizzo e civico:</Form.Label>
            <Form.Control style={{fontSize: "0.8vw", flex: "1"}}
              type="text"
              placeholder="Via e numero civico"
              value={newCustomerAddress}
              onChange={(e) => setNewCustomerAddress(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Comune:</Form.Label>
            <Form.Control style={{fontSize: "0.8vw", flex: "1"}}
              type="text"
              placeholder="Comune"
              value={newCustomerCity}
              onChange={(e) => setNewCustomerCity(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>CAP:</Form.Label>
            <Form.Control style={{fontSize: "0.8vw", flex: "1"}}
              type="text"
              placeholder="CAP"
              value={newCustomerPostalCode}
              onChange={(e) => setNewCustomerPostalCode(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Provincia:</Form.Label>
            <Form.Control style={{fontSize: "0.8vw", flex: "1"}}
              type="text"
              placeholder="Provincia"
              value={newCustomerProvince}
              onChange={(e) => setNewCustomerProvince(e.target.value)}
            />
          </Form.Group>
          
          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Telefono:</Form.Label>
            <div style={{ display: 'flex', flex: 1, gap: '8px', alignItems: 'center' }}>
              <Form.Select
                value={newCustomerPhonePrefix}
                onChange={(e) => setNewCustomerPhonePrefix(e.target.value)}
                aria-label="Prefisso internazionale"
                style={{ width: '110px', fontSize: '0.8vw' }}
              >
                <option value="">Prefisso</option>
                <option value="+39">+39 (IT)</option>
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+33">+33 (FR)</option>
                <option value="+49">+49 (DE)</option>
                <option value="+34">+34 (ES)</option>
              </Form.Select>

              <Form.Control style={{fontSize: "0.8vw", flex: "1"}}
                type="tel"
                placeholder="123 456 7890"
                value={newCustomerPhone}
                onChange={(e) => setNewCustomerPhone(e.target.value)}
              />
            </div>
          </Form.Group>
          
          <hr style={{ border: '1px solid #D6AD42', margin: '15px 0' }} />

          <div className="d-flex justify-content-center">
            <Button type="submit" style={{
                width: "60%",
                fontWeight: "bold",
                color: "#39300D",
                background: "#D6AD42",
                borderRadius: "5px",
                borderColor: "#D6AD42",
                fontSize: "0.8vw",
            }}>
              Aggiungi Cliente
            </Button>
          </div>
        </Form>
      </div>
    </div>
    </>
  );
}

function SingleCustomer(props){
  return (
    <div
      className="create-order product-card"
      style={{ cursor: "pointer", background: props.targetSelect ? "#D6AD42" : "" }}
      onClick={() => props.selectCustomerList(props.customer.id)}
    >
      <div className="order-info product-card-inner" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="product-title">{props.customer.displayName || "Undefined"}</div>
          <div className="product-price" style={{ fontSize: '0.8em', color: '#666' }}>
            {props.customer.defaultEmailAddress ? props.customer.defaultEmailAddress.emailAddress : "No email"}
          </div>
        </div>
        
        <i className="bi bi-person-circle" style={{ fontSize: '1.5em', color: '#D6AD42', marginLeft: '10px' }}></i>

      </div>
    </div>
  );
}


export {RequestCustomer};