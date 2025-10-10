import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Alert,Navbar , Container, Image, Button, Badge,InputGroup,Form, Col,Row,Spinner} from 'react-bootstrap';
import {postClient} from '../api/posts';
import { GrUpdate } from 'react-icons/gr';



function RequestCustomer(props){
  
  const [customers, setCustomers] = useState([]);
  const [searchCustomer, setSearchCustomer] = useState("");
  const { selectCustomer, setSelectCustomer } = props;
  
  // New customer form states
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerSurname, setNewCustomerSurname] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerSpam, setNewCustomerSpam] = useState(false);
  const [newCustomerCountry, setNewCustomerCountry] = useState("IT");
  const [newCustomerCompany, setNewCustomerCompany] = useState("");
  const [newCustomerAddress, setNewCustomerAddress] = useState("");
  const [newCustomerCity, setNewCustomerCity] = useState("");
  const [newCustomerPostalCode, setNewCustomerPostalCode] = useState("");
  const [newCustomerProvince, setNewCustomerProvince] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerPhonePrefix, setNewCustomerPhonePrefix] = useState("");
  const [newCustomerFiscalCode, setNewCustomerFiscalCode] = useState("");
  
  const [confirm, setConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  useEffect(() => {
    setCustomers(props.customerList);
  }, [props.customerList]);

  const handleSearch = () => {
    let risultati = [];
    if (searchCustomer === "") {
      risultati = props.customerList;
    } else {
      risultati = props.customerList.filter(item =>
        item.displayName?.toLowerCase().includes(searchCustomer.toLowerCase()) ||
        item.defaultEmailAddress?.emailAddress?.toLowerCase().includes(searchCustomer.toLowerCase())
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
        const fullPhone = found.defaultAddress?.phone || "";

        const normalized = {
          id: found.id,
          name: found.name || found.displayName || found.firstName || "",
          surname: found.surname || found.lastName || "",
          email: (found.email) || (found.defaultEmailAddress && found.defaultEmailAddress.emailAddress) || "",
          company: found.defaultAddress?.company || found.organization || "",
          address: found.address || (found.defaultAddress && (found.defaultAddress.address1 || found.defaultAddress.formatted)) || "",
          city: found.city || (found.defaultAddress && found.defaultAddress.city) || "",
          postalCode: found.postalCode || (found.defaultAddress && found.defaultAddress.zip) || "",
          province: found.province || (found.defaultAddress && found.defaultAddress.province) || "",
          countryCode: found.countryCode || found.country || (found.defaultAddress && found.defaultAddress.provinceCode) || "",
          countryName: found.defaultAddress.country || "",
          phone: fullPhone,
          fiscalCode: found.defaultAddress?.address2 || "",
          countryCodeV2:found.defaultAddress?.countryCodeV2 || "",
          spam: typeof found.spam === 'boolean' ? found.spam : !!found.acceptsMarketing || false
        };
        props.setSelectedCustomer(normalized);
      } else {
        props.setSelectedCustomer(null);
      }
    }
  }

  const handleAddNewCustomer = async (e) => {
    e.preventDefault();

    const session = await props.getSes();
    if (!session) {
      console.warn("Sessione non valida, interrompo operazione");
      props.setNeedLogin(true)
      return; // blocca l’esecuzione se non c’è sessione valida
    }

    if (!newCustomerName || !newCustomerSurname || !newCustomerEmail ||
       !newCustomerAddress || !newCustomerPhone || !newCustomerFiscalCode ||
        !newCustomerCity || !newCustomerPostalCode ||
         !newCustomerProvince || !newCustomerPhonePrefix) {
      setErrorMessage("Campi obbligatori.");
      return;
    }

    const fullPhone = `${newCustomerPhonePrefix}${newCustomerPhone}`;

    const newCustomer = {
      name: newCustomerName,
      surname: newCustomerSurname,
      email: newCustomerEmail,
      phone: fullPhone,
      fiscalCode: newCustomerFiscalCode,
      company: newCustomerCompany,
      country: newCustomerCountry,
      city: newCustomerCity,
      address: newCustomerAddress,
      postalCode: newCustomerPostalCode,
      province: newCustomerProvince,
      spam: newCustomerSpam,
    };

    const addClient = async (newCustomer) => {
      
      setConfirm(true)
      const res=await postClient(newCustomer)

      setConfirm(false)
      if (res?.error){
          setErrorMessage(res.error)
      }else{
          await props.updateClients()

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
          setNewCustomerCountry("IT");
          setNewCustomerSurname("");


          setSelectCustomer(res.id);


          const fullPhone = res.defaultAddress?.phone || "";

          const normalized = {
            id: res.id,
            name: res.name || res.displayName || res.firstName || "",
            surname: res.surname || res.lastName || "",
            email: (res.email) || (res.defaultEmailAddress && res.defaultEmailAddress.emailAddress) || "",
            company: res.defaultAddress?.company || res.organization || "",
            address: res.address || (res.defaultAddress && (res.defaultAddress.address1 || res.defaultAddress.formatted)) || "",
            city: res.city || (res.defaultAddress && res.defaultAddress.city) || "",
            postalCode: res.postalCode || (res.defaultAddress && res.defaultAddress.zip) || "",
            province: res.province || (res.defaultAddress && res.defaultAddress.province) || "",
            countryCode: res.countryCode || res.country || (res.defaultAddress && res.defaultAddress.provinceCode) || "",
            countryName: res.defaultAddress.country || "",
            phone: fullPhone,
            fiscalCode: res.defaultAddress.address2 || "",
            countryCodeV2:res.defaultAddress?.countryCodeV2 || "",
            spam: typeof res.spam === 'boolean' ? res.spam : !!res.acceptsMarketing || false
          };

          props.setSelectedCustomer(normalized);
          // Reset form
          
      }

    };

    addClient(newCustomer)


    // Ho cambiato che elimina quello che magari c'era scritto nella ricerca del cliente
    // E ricarica la ricerca in modo tale da mostrare tutti
    setSearchCustomer("")
    //handleSearch()
  };

  return(
    <>
    <div className="product-box">
      <div className='order-info'>
        {errorMessage ? <Alert variant='danger' dismissible onClick={()=>setErrorMessage('')}>{errorMessage}</Alert> : ''}
        <div style={{ color: '#39300D', fontSize: "1.1vw", fontWeight:'bold', marginBottom: '10px' }}>Seleziona Cliente</div>
        <InputGroup style={{marginBottom:'10px'}}>
          <InputGroup.Text onClick={handleSearch} style={{background: '#D6AD42', cursor: "pointer"}} ><i className="bi bi-search"></i></InputGroup.Text>
          <Form.Control type="text" placeholder="Cerca cliente" onKeyDown={handleKeyDown} value={searchCustomer} onChange={ev => setSearchCustomer(ev.target.value) }/>
        </InputGroup>
        
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
          {/*
            <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Newsletter:</Form.Label>
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
          */}

          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Codice Fiscale:</Form.Label>
            <Form.Control style={{fontSize: "0.8vw", flex: "1"}}     
              type="text"
              placeholder="RSSMRA80A01H501U"
              value={newCustomerFiscalCode}
              onChange={(e) => setNewCustomerFiscalCode(e.target.value.toUpperCase())}
              required
            />
          </Form.Group>

          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Azienda:</Form.Label>
            <Form.Control style={{fontSize: "0.8vw", flex: "1"}}
              type="text"
              placeholder="Company srl"
              value={newCustomerCompany}
              onChange={(e) => setNewCustomerCompany(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Paese:</Form.Label>
            <Form.Select style={{fontSize: "0.8vw", flex: "1"}}
              value={newCustomerCountry}
              onChange={(e) => setNewCustomerCountry(e.target.value)}
              required
            >
              <option value="">Seleziona paese</option>
              <option value="IT">Italia (IT)</option>
              <option value="GB">United Kingdom (GB)</option>
              <option value="DE">Deutschland (DE)</option>
              <option value="FR">France (FR)</option>
              <option value="ES">España (ES)</option>
              <option value="NL">Netherlands (NL)</option>
              <option value="BE">Belgium (BE)</option>
              <option value="PT">Portugal (PT)</option>
              <option value="SE">Sweden (SE)</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Indirizzo e civico:</Form.Label>
            <Form.Control style={{fontSize: "0.8vw", flex: "1"}}
              type="text"
              placeholder="Via e numero civico"
              value={newCustomerAddress}
              required
              onChange={(e) => setNewCustomerAddress(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Comune:</Form.Label>
            <Form.Control style={{fontSize: "0.8vw", flex: "1"}}
              type="text"
              placeholder="Comune"
              value={newCustomerCity}
              required
              onChange={(e) => setNewCustomerCity(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>CAP:</Form.Label>
            <Form.Control style={{fontSize: "0.8vw", flex: "1"}}
              type="text"
              placeholder="CAP"
              value={newCustomerPostalCode}
              required
              onChange={(e) => setNewCustomerPostalCode(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Provincia:</Form.Label>
            <Form.Control style={{fontSize: "0.8vw", flex: "1"}}
              type="text"
              placeholder="Provincia"
              value={newCustomerProvince}
              required
              onChange={(e) => setNewCustomerProvince(e.target.value)}
            />
          </Form.Group>
          
          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Telefono:</Form.Label>
            <div style={{ display: 'flex', flex: 1, gap: '8px', alignItems: 'center' }}>
              <Form.Control style={{fontSize: "0.8vw", flex: "1", maxWidth: "70px"}}
                type="text"
                value={newCustomerPhonePrefix}
                required
                onChange={(e) => setNewCustomerPhonePrefix(e.target.value)}
                placeholder="+39"
              >
                
              </Form.Control>

              <Form.Control style={{fontSize: "0.8vw", flex: "1"}}
                type="tel"
                placeholder="123 456 7890"
                value={newCustomerPhone}
                required
                onChange={(e) => setNewCustomerPhone(e.target.value)}
              />
            </div>
          </Form.Group>
          
          <hr style={{ border: '1px solid #D6AD42', margin: '15px 0' }} />

          <div className="d-flex justify-content-center">
            {!confirm ? 
            <Button type="submit" style={{
                width: "60%",
                fontWeight: "bold",
                color: "#39300D",
                background: "#D6AD42",
                borderRadius: "5px",
                borderColor: "#D6AD42",
                fontSize: "0.8vw",
            }}>
              Aggiungi cliente
            </Button>
            :
            <Button type="submit" disabled style={{
                width: "60%",
                fontWeight: "bold",
                color: "#39300D",
                background: "#D6AD42",
                borderRadius: "5px",
                borderColor: "#D6AD42",
                fontSize: "0.8vw",
            }}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </Button>
            
          }
            
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