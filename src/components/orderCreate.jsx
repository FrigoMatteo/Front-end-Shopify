import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Navbar , Container, Image, Button, Badge,InputGroup,Form, Col,Row} from 'react-bootstrap';
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
  
    <div className="create-order">
      <div className="order-info">
        <div>{props.prod.title ? props.prod.title : "Undefined"}</div>
        <div>{props.prod.variants.nodes[0].price ? props.prod.variants.nodes[0].price : "Undefined"} € &nbsp;
          {props.prod.status=="ACTIVE" ? <i className="bi bi-circle-fill" style={{ color: "#28a745" }}></i> :<i className="bi bi-circle-fill" style={{color:"#8b0000"}}></i>}</div>
      </div>
    </div>

  );
}

function RequestProduct(props){

  const [products,setProducts]=useState(productslist.products.nodes);
  const [searchProduct,setSearchProduct]=useState("");

  const [value, setValue] = useState(1); // valore iniziale

  const handleChangeQuantity = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Quantità inviata: ${value}`);
  };

  return(
    <>
    <div className="product-box">
      <div className='order-info'>
        <InputGroup style={{marginBottom:'10px'}}>
          <InputGroup.Text style={{background: '#D6AD42'}}><i className="bi bi-search"></i></InputGroup.Text>
          <Form.Control type="text" placeholder="Cerca prodotto" value={searchProduct} onChange={ev => setSearchProduct(ev.target.value)}/>
        </InputGroup>
        <Form onSubmit={handleSubmit}>
          <div className="d-flex justify-content-between align-items-center">
            {/* Label + input a sinistra */}
            <div className="d-flex align-items-center">
              <Form.Label className="me-2 mb-0">Quantità:</Form.Label>
              <Form.Control
                type="number"
                value={value}
                onChange={handleChangeQuantity}
                min={1}
                max={100}
                step={1}
                style={{ width: "80px", textAlign: "center" }}
              />
            </div>

            {/* Bottone allineato a destra */}
            <Button type="submit" style={{ 
                  fontWeight: 'bold', 
                  color: '#39300D',
                  textAlign: 'center',
                  background: '#D6AD42',
                  borderRadius: '5px',
                  borderColor:'#D6AD42'
              }}>
              Aggiungi al carello
            </Button>
          </div>
        </Form>
      </div>
    </div>

    <div className='order-create' style={{
              background: '#39300D',
              color: '#39300D',
              borderRadius: '8px',
              padding: '15px',
              border: '3px solid #D6AD42',
              height: '40vh',
              overflowY: 'auto',
          }}>
        
        {products.map(e => (<SingleProduct key={e.id} prod={e}/> ))}

    </div>
    
    </>
  );

}



function ShowFormOrder(props){
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
      
      <div style={containerStyle}>
        <div style={{ borderRight: "4px solid black", padding: "1rem" }}>
          <RequestProduct/>
        </div>
          <SummaryCosts/>
        <div style={{ padding: "1rem" }}>
            <p>Colonna 3 (35%)</p>
        </div>
      </div>
      
    
    </>
  );

}


const productslist={
  "products": {
    "nodes": [
      {
        "id": "gid://shopify/Product/11",
        "title": "Social Media Advertising – Black (3 Release)",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "inventoryQuantity": 30,
              "price": "22.99"
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
              "inventoryQuantity": 14,
              "price": "44.99"
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
              "inventoryQuantity": 20,
              "price": "32.99"
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
              "inventoryQuantity": 9,
              "price": "59.99"
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
              "inventoryQuantity": 25,
              "price": "17.99"
            }
          ]
        }
      },
      {
        "id": "gid://shopify/Product/16",
        "title": "Occhiali da Vista",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "inventoryQuantity": 6,
              "price": "39.99"
            }
          ]
        }
      },
      {
        "id": "gid://shopify/Product/17",
        "title": "Borsa Tracolla",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "inventoryQuantity": 11,
              "price": "49.99"
            }
          ]
        }
      },
      {
        "id": "gid://shopify/Product/18",
        "title": "Giacca a Vento",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "inventoryQuantity": 8,
              "price": "64.99"
            }
          ]
        }
      },
      {
        "id": "gid://shopify/Product/19",
        "title": "Cintura Sportiva",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "inventoryQuantity": 19,
              "price": "21.99"
            }
          ]
        }
      },
      {
        "id": "gid://shopify/Product/20",
        "title": "Orologio Elegante",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "inventoryQuantity": 4,
              "price": "129.99"
            }
          ]
        }
      },
      {
        "id": "gid://shopify/Product/1",
        "title": "T-Shirt Basic",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "inventoryQuantity": 25,
              "price": "19.99"
            }
          ]
        }
      },
      {
        "id": "gid://shopify/Product/2",
        "title": "Jeans Slim Fit",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "inventoryQuantity": 10,
              "price": "49.99"
            }
          ]
        }
      },
      {
        "id": "gid://shopify/Product/3",
        "title": "Felpa con Cappuccio",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "inventoryQuantity": 15,
              "price": "34.99"
            }
          ]
        }
      },
      {
        "id": "gid://shopify/Product/4",
        "title": "Sneakers Running",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "inventoryQuantity": 5,
              "price": "69.99"
            }
          ]
        }
      },
      {
        "id": "gid://shopify/Product/5",
        "title": "Cappello Baseball",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "inventoryQuantity": 20,
              "price": "14.99"
            }
          ]
        }
      },
      {
        "id": "gid://shopify/Product/6",
        "title": "Occhiali da Sole",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "inventoryQuantity": 8,
              "price": "29.99"
            }
          ]
        }
      },
      {
        "id": "gid://shopify/Product/7",
        "title": "Zaino Casual",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "inventoryQuantity": 12,
              "price": "39.99"
            }
          ]
        }
      },
      {
        "id": "gid://shopify/Product/8",
        "title": "Giacca Leggera",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "inventoryQuantity": 7,
              "price": "59.99"
            }
          ]
        }
      },
      {
        "id": "gid://shopify/Product/9",
        "title": "Cintura in Pelle",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "inventoryQuantity": 18,
              "price": "24.99"
            }
          ]
        }
      },
      {
        "id": "gid://shopify/Product/10",
        "title": "Orologio Sportivo",
        "status": "ACTIVE",
        "variants": {
          "nodes": [
            {
              "inventoryQuantity": 3,
              "price": "99.99"
            }
          ]
        }
      }
    ]
  }
}


export {ShowFormOrder};