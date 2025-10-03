import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Alert,Navbar , Container, Image, Button, Badge,InputGroup,Form, Col,Row} from 'react-bootstrap';

function SingleProduct(props){
  return (
    <div
      className="create-order product-card"
      style={{ cursor: "pointer", background: props.targetSelect ? "#D6AD42" : "" }}
      onClick={() => props.selectProdList(props.prod.id)}
    >
      <div className="order-info product-card-inner" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Image
          src={props.prod.media.nodes[0] ? props.prod.media.nodes[0].preview.image.url : "/hustle_name.png"}
          alt="Product"
          rounded
          style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px' }}
        />
        
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="product-title">{props.prod.title || "Undefined"}</div>
          <div className="product-price">
            {props.prod.variants.nodes[0].price || "Undefined"} € &nbsp;
            {props.prod.status === "ACTIVE" 
              ? <i className="bi bi-circle-fill" style={{ color: "#28a745" }}></i>
              : <i className="bi bi-circle-fill" style={{ color: "#8b0000" }}></i>}
            <div>
              {/*props.prod.variants.nodes[0].inventoryQuantity>=0 ? "Quantità:"+props.prod.variants.nodes[0].inventoryQuantity : ""*/}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


function RequestProduct(props){

  const [errorMessage, setErrorMessage] = useState('');
  const [products,setProducts]=useState([]);
  const [searchProduct,setSearchProduct]=useState("");

  const [selectProd, setSelectProd]=useState("");

  const [valueProd, setValueProd] = useState(1);

  const [valuePersonalized, setValuePersonalized] = useState(1);
  const [namePersonalized, setNamePersonalized] = useState("");
  const [pricePersonalized, setPricePersonalized] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  useEffect(() => {
    setProducts(props.productList)
  }, [props.productList]);


  const handleSearch = () => {
    let risultati=[]
    if (searchProduct==""){
      risultati=props.productList
    }else{
      risultati = products.filter(item =>
        item.title.toLowerCase().includes(searchProduct.toLowerCase())
      );
    }
    
    setProducts(risultati)
  }

  const selectProdList=(id)=>{

    if (id==selectProd){
      setSelectProd("")
    }else{
      setSelectProd(id)
    }

  }


  const handleSubmitProd = (e) => {
    e.preventDefault();

    const product = props.productList.find(p => p.id === selectProd);
    
    if (valueProd<=product.variants.nodes[0].inventoryQuantity ){
      props.addProduct(
        {
          id:product.variants.nodes[0].id ? product.variants.nodes[0].id : "Undefined",
          title:product.title ? product.title : "Undefined",
          price: product.variants.nodes[0].price 
            ? (parseFloat(product.variants.nodes[0].price) * valueProd).toFixed(2).toString() 
            : "Undefined",
          quantity:valueProd
        })
      
      setValueProd(1)
      setSelectProd("")
      setSearchProduct("")
    }else{
      setErrorMessage("Quantità non consentita")
    }

  };

  const handleSubmitPersonalized = (e) => {
    e.preventDefault();

    props.addProduct(
      {
        id:"Personalized",
        title:namePersonalized ? namePersonalized : "Undefined",
        price: pricePersonalized 
          ? (pricePersonalized * valuePersonalized).toFixed(2).toString() 
          : "Undefined",
        quantity:valuePersonalized
      })
    
    setValuePersonalized(1)
    setNamePersonalized("")
    setPricePersonalized("")

  };

  return(
    <>
    <div className="product-box">
      <div className='order-info'>
        <InputGroup style={{marginBottom:'10px'}}>
          <InputGroup.Text onClick={handleSearch} style={{background: '#D6AD42', cursor: "pointer"}} ><i className="bi bi-search"></i></InputGroup.Text>
          <Form.Control type="text" placeholder="Cerca prodotto" onKeyDown={handleKeyDown} value={searchProduct} onChange={ev => setSearchProduct(ev.target.value) }/>
        </InputGroup>
        {errorMessage ? <Alert variant='danger' dismissible onClick={()=>setErrorMessage('')}>{errorMessage}</Alert> : ''}
        <Form onSubmit={handleSubmitProd} onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}>
          <div className="d-flex justify-content-between align-items-center">

            <div className="d-flex align-items-center">
              <Form.Label className="me-2 mb-0" style={{fontSize: "0.8vw", width:'60%'}}>Quantità:</Form.Label>
              <Form.Control
                type="number"
                value={valueProd}
                onChange={(e)=>{setValueProd(parseInt(e.target.value) || 1)}}
                min={1}
                max={100}
                step={1}
                style={{ width: "4vw", height:'4vh',textAlign: "center" }}
              />
            </div>

            <Button type="submit" style={{ 
                  width:'50%',
                  fontWeight: 'bold', 
                  color: '#39300D',
                  textAlign: 'center',
                  background: '#D6AD42',
                  borderRadius: '5px',
                  borderColor:'#D6AD42',
                  fontSize: "0.8vw"
              }}>
              Aggiungi al carello
            </Button>
          </div>
        </Form>
              <div className='order-create' style={{
              background: '#39300D',
              color: '#39300D',
              borderRadius: '8px',
              padding: '15px',
              border: '3px solid #D6AD42',
              height: '40vh',
              overflowY: 'auto',
          }}>

            {products.map(e => (<SingleProduct key={e.id} targetSelect={selectProd==e.id ? true : false} prod={e} selectProdList={selectProdList} /> ))}

        </div>
      </div>
    </div>
    
    <div className="product-box" style={{height:'27vh'}}>
      <div className='order-info'>
        <div style={{ color: '#39300D', fontSize: "1.1vw",fontWeight:'bold'}}>Crea Articolo Personalizzato</div>
        <Form onSubmit={handleSubmitPersonalized}>
          <Form.Group className="d-flex align-items-center" style={{ height: "5vh", textAlign: "center" }}>
            <Form.Label className="me-2 mb-0" style={{fontSize: "0.8vw"}}>Articolo</Form.Label>
            <Form.Control style={{fontSize: "0.8vw"}}
              type="text"
              placeholder="Inserisci il nome dell'articolo"
              value={namePersonalized}
              onChange={(e)=>{setNamePersonalized(e.target.value)}}
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-between align-items-center">
          <Form.Group className="d-flex align-items-center">
            <Form.Label className="me-2 mb-0" style={{fontSize: "0.8vw"}}>Prezzo</Form.Label>
            <InputGroup style={{ width: "6vw", height: "4vh", textAlign: "center" }}>
              <InputGroup.Text>€</InputGroup.Text>
              <Form.Control type="number" required className="no-spinners"
                value={pricePersonalized}                  // <-- bind allo stato
                onChange={(e) => setPricePersonalized(parseFloat(e.target.value) || 0)} // <-- converte in numero
              />
            </InputGroup>
          </Form.Group>
          <div className="d-flex align-items-center">
              <Form.Label className="me-2 mb-0" style={{fontSize: "0.8vw", width:'60%'}}>Quantità:</Form.Label>
              <Form.Control
                type="number"
                value={valuePersonalized}
                onChange={(e)=>{setValuePersonalized(parseInt(e.target.value) || 1)}}
                min={1}
                max={100}
                step={1}
                style={{ width: "4vw", height:'4vh',textAlign: "center" }}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <Button
              type="submit"
              style={{
                width: "50%",
                fontWeight: "bold",
                color: "#39300D",
                textAlign: "center",
                background: "#D6AD42",
                borderRadius: "5px",
                borderColor: "#D6AD42",
                fontSize: "0.8vw",
              }}
            >
              Aggiungi al carrello
            </Button>
          </div>
        </Form>
      </div>
    </div>
    </>
  );

}



export {RequestProduct};