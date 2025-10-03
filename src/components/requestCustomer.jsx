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
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerAddress, setNewCustomerAddress] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
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
    if (id === selectCustomer) {
      setSelectCustomer("");
    } else {
      setSelectCustomer(id);
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
    
    if (!newCustomerName || !newCustomerEmail) {
      setErrorMessage("Name and Email are required.");
      return;
    }

    const newCustomer = {
      id: "gid://shopify/Customer/" + Date.now(),
      name: newCustomerName,
      email: newCustomerEmail,
      address: newCustomerAddress,
      phone: newCustomerPhone,
      fiscalCode: newCustomerFiscalCode
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
        <div className="d-flex justify-content-end">
            <Button
              onClick={()=>{console.log("Selezionami e portami nel carrello. id:",selectCustomer)}}
              style={{
                width: "40%",
                fontWeight: "bold",
                color: "#39300D",
                textAlign: "center",
                background: "#D6AD42",
                borderRadius: "5px",
                borderColor: "#D6AD42",
                fontSize: "0.8vw",
              }}
            >
              Seleziona cliente
            </Button>
          </div>
      </div>
    </div>
    
    <div className="product-box" style={{height:'47vh', alignItems: 'flex-start', display: 'block'}}>
      <div className='order-info'>
        <div style={{ color: '#39300D', fontSize: "1.1vw", fontWeight:'bold', marginBottom: '10px'}}>Aggiungi Nuovo Cliente</div>
        
        <Form onSubmit={handleAddNewCustomer}>
          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Nome:</Form.Label>
            <Form.Control style={{fontSize: "0.8vw", flex: "1"}}
              type="text"
              placeholder="Nome completo"
              value={newCustomerName}
              onChange={(e) => setNewCustomerName(e.target.value)}
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
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Indirizzo:</Form.Label>
            <Form.Control style={{fontSize: "0.8vw", flex: "1"}}
              type="text"
              placeholder="Via, città, CAP"
              value={newCustomerAddress}
              onChange={(e) => setNewCustomerAddress(e.target.value)}
            />
          </Form.Group>
          
          <Form.Group className="mb-2 d-flex align-items-center">
            <Form.Label style={{fontSize: "0.8vw", width: "30%", marginBottom: "0", marginRight: "10px"}}>Telefono:</Form.Label>
            <Form.Control style={{fontSize: "0.8vw", flex: "1"}}
              type="tel"
              placeholder="+39 123 456 7890"
              value={newCustomerPhone}
              onChange={(e) => setNewCustomerPhone(e.target.value)}
            />
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