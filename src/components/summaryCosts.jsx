import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Alert,Navbar , Container, Image, Button, Badge,InputGroup,Form, Col,Row} from 'react-bootstrap';

function SummaryCosts(props){
  const summaryProd=props.summaryProd || [];
  const selectedCustomer=props.selectedCustomer || null;
  // build a single address line combining address, city+postal, province
  const combinedAddress = selectedCustomer ? (() => {
    const parts = [];
    if (selectedCustomer.address) parts.push(selectedCustomer.address);
    const cityPostal = [selectedCustomer.city, selectedCustomer.postalCode].filter(Boolean).join(' ');
    if (cityPostal) parts.push(cityPostal);
    if (selectedCustomer.province) parts.push(selectedCustomer.province);
    return parts.join(', ');
  })() : '';
  const combinedPhone = selectedCustomer ? (() => {
    const parts = [];
    if (selectedCustomer.phonePrefix) parts.push(selectedCustomer.phonePrefix);
    if (selectedCustomer.phone) parts.push(selectedCustomer.phone);
    return parts.join(' ');
  })() : '';

  return(
    <div style={{ borderRight: "4px solid black", padding: "1rem" }}>
      {/* Selected Customer summary */}
      {selectedCustomer && (
            <div style={{
              background: '#39300D',
              color: '#FEF4B1',
              borderRadius: '8px',
              padding: '15px',
              border: '3px solid #D6AD42',
              marginBottom: '15px'
            }}>
              <h5 style={{ color: '#D6AD42', textAlign: 'center', marginBottom: '10px' }}>Cliente Selezionato</h5>
              <div><strong>Nome:</strong> {selectedCustomer.name} {selectedCustomer.surname || ''}</div>
              <div><strong>Email:</strong> {selectedCustomer.email}</div>
              {combinedAddress && <div><strong>Indirizzo:</strong> {combinedAddress}</div>}
              {(selectedCustomer.countryName || selectedCustomer.countryCode) && <div><strong>Paese:</strong> {selectedCustomer.countryName || selectedCustomer.countryCode}</div>}
              {combinedPhone && <div><strong>Telefono:</strong> {combinedPhone}</div>}
              {selectedCustomer.fiscalCode && <div><strong>Codice Fiscale:</strong> {selectedCustomer.fiscalCode}</div>}
              <div><strong>Newsletter:</strong> {selectedCustomer.spam ? 'Sì' : 'No'}</div>
            </div>
          )}

      {/* Products in cart - styled like selected customer */}
      <div style={{
        background: '#39300D',
        color: '#D6AD42',
        borderRadius: '8px',
        padding: '12px',
        border: '3px solid #D6AD42',
        marginBottom: '12px'
      }}>
        <h5 style={{ color: '#D6AD42', textAlign: 'center', marginBottom: '8px' }}>Carrello</h5>
        <div style={{ maxHeight: '42vh', overflowY: 'auto', background: '#FEF4B1', border: '2px solid #D6AD42', borderRadius: '6px', padding: '8px' }}>
          {summaryProd.length === 0 ? (
            <div style={{ color: '#666' }}>Nessun prodotto aggiunto</div>
          ) : (
            summaryProd.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 4px', borderBottom: '1px dashed rgba(0,0,0,0.05)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: '#39300D' }}>{p.title}</div>
                  <div style={{ fontWeight: '700', color: '#39300D' }}>{p.price ? p.price + '€' : '0.0€'}</div>
                  <div style={{ fontSize: '0.85em', color: '#39300D' }}>Qty: {p.quantity}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  
                  <button
                    type="button"
                    onClick={() => props.removeProduct && props.removeProduct(idx)}
                    title="Rimuovi"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#c0392b',
                      cursor: 'pointer',
                      fontSize: '1.0rem'
                    }}
                  >
                    <i className="bi bi-trash" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* payment section */}
      <h3 style={{ color: '#39300D', textAlign: 'center', marginBottom: '12px' }}>Pagamento</h3>
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

export { SummaryCosts };