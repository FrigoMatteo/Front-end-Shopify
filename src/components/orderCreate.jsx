import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Alert,Navbar , Container, Image, Button, Badge,InputGroup,Form, Col,Row} from 'react-bootstrap';
import { getProducts } from '../api/posts';
import '../css/orderCreate.css';


function SummaryCosts(props){

  return(
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
        </div>
  );
}




function SingleProduct(props){
  return (
    <div
      className="create-order product-card"
      style={{ cursor: "pointer", background: props.targetSelect ? "#D6AD42" : "" }}
      onClick={() => props.selectProdList(props.prod.id)}
    >
      <div className="order-info product-card-inner" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

        <Image
          src="https://cdn.shopify.com/s/files/1/0947/5866/6563/files/Copia_di_hustle_community_1280_x_720_px_Post_Instagram_13.png?v=1759160207"
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



function ShowFormOrder(props){

  const [summaryProd,setSummaryProd]=useState([])
  const [productList,setProductList]=useState([])

  const [errorMessage,setErrorMessage]=useState("")

  const addProduct = (prod) => {
    setSummaryProd(prev => [...prev, prod]); 
  };

  useEffect(() => {
    const update=async()=>{

        const res=await getProducts()

        if (res?.error){
            setErrorMessage("Error submiting the edit. Contact the administrator")
        }else{
            setProductList(res.products.nodes)
        }
      }
    update()
    
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
    overflowY: 'auto',
    borderRadius: '8px',
  };

  return (
    <>
      
      <div style={containerStyle} className='order-create'>
        <div style={{ borderRight: "4px solid black", padding: "1rem" }}>
          <RequestProduct addProduct={addProduct} productList={productList}/>
        </div>
          <SummaryCosts/>
        <div style={{ padding: "1rem" }}>
          <p>Colonna 3 (35%)</p>
        </div>
      </div>
      
    
    </>
  );

}


const productslist = {
  "products": {
    "nodes": [
      {
        "id": "gid://shopify/Product/11",
        "title": "Social Media Advertising – Black (3 Release)",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "id": "gid://shopify/ProductVariant/11-1",
              "inventoryQuantity": 30,
              "price": "22.99"
            }
          ]
        },
        "images": {
          "nodes": [
            {
              "id": "gid://shopify/ProductImage/11-1",
              "originalSrc": "https://cdn.shopify.com/s/files/1/0947/5866/6563/files/Copia_di_hustle_community_1280_x_720_px_Post_Instagram_13.png?v=1759160207"
            }
          ]
        }
      },
      {
        "id": "gid://shopify/Product/12",
        "title": "Pantaloni Cargo",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "id": "gid://shopify/ProductVariant/12-1",
              "inventoryQuantity": 0,
              "price": "44.99"
            }
          ]
        },
        "images": {
          "nodes": [
            {
              "id": "gid://shopify/ProductImage/12-1",
              "originalSrc": "https://example.com/images/product12.jpg"
            }
          ]
        }
      },
      {
        "id": "gid://shopify/Product/13",
        "title": "Felpa Girocollo",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "id": "gid://shopify/ProductVariant/13-1",
              "inventoryQuantity": -1,
              "price": "32.99"
            }
          ]
        },
        "images": {
          "nodes": [
            {
              "id": "gid://shopify/ProductImage/13-1",
              "originalSrc": "https://example.com/images/product13.jpg"
            }
          ]
        }
      },
      {
        "id": "gid://shopify/Product/14",
        "title": "Scarpe Casual",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "id": "gid://shopify/ProductVariant/14-1",
              "inventoryQuantity": 9,
              "price": "59.99"
            }
          ]
        },
        "images": {
          "nodes": [
            {
              "id": "gid://shopify/ProductImage/14-1",
              "originalSrc": "https://example.com/images/product14.jpg"
            }
          ]
        }
      },
      {
        "id": "gid://shopify/Product/15",
        "title": "Berretto Invernale",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "id": "gid://shopify/ProductVariant/15-1",
              "inventoryQuantity": 25,
              "price": "17.99"
            }
          ]
        },
        "images": {
          "nodes": [
            {
              "id": "gid://shopify/ProductImage/15-1",
              "originalSrc": "https://example.com/images/product15.jpg"
            }
          ]
        }
      }
    ]
  }
};




export {ShowFormOrder};