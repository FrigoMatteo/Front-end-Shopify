import { useState,useEffect, useMemo } from 'react'
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

  // helper to render price considering per-item discount (p.discount in percent)
  const renderPrice = (item) => {
    const raw = parseFloat(item.price);
    const price = Number.isFinite(raw) ? raw : 0;
    const disc = item && (item.discount !== undefined && item.discount !== null) ? parseFloat(item.discount) || 0 : 0;
    if (disc > 0) {
      const discounted = item.discountType == "FIXED_AMOUNT" ? Math.max(0, price - disc) : price * (1 - disc / 100);
      // formatted discount label
      const discountLabel = item.discountType == "FIXED_AMOUNT" ? `-${Number(disc).toFixed(2)}€` : `-${Number(disc).toFixed(2)}%`;
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#39300D' }}>
          <div style={{ textDecoration: 'line-through', opacity: 0.7 }}>{price.toFixed(2)}€</div>
          <div aria-hidden style={{ fontWeight: '700' }}>→</div>
          <div style={{ fontWeight: '800' }}>{discounted.toFixed(2)}€</div>
          <div style={{ fontWeight: '600', fontSize: '0.9em', color: '#39300D' }}>({discountLabel})</div>
        </div>
      );
    }
    return (
      <div style={{ fontWeight: '700', color: '#39300D' }}>{price.toFixed(2)}€</div>
    );
  };

  // global cart discount (percentage 0-100)
  const { cartDiscount, setCartDiscount, discountType, setDiscountType } = props;

  const handleCartDiscountChange = (val) => {
    let n = parseFloat(val);
    if (Number.isNaN(n)) n = 0;
    if (n < 0) n = 0;

    // store as integer or float as user types
    setCartDiscount(n);
  };


  // compute subtotal: sum of (price after per-item discount) * quantity
  const subtotal = useMemo(() => {
    if (!Array.isArray(summaryProd) || summaryProd.length === 0) return 0;
    return summaryProd.reduce((acc, item) => {
      const raw = parseFloat(item.price);
      const price = Number.isFinite(raw) ? raw : 0;
      const disc = item && (item.discount !== undefined && item.discount !== null) ? parseFloat(item.discount) || 0 : 0;
      const unit = item.discountType=="FIXED_AMOUNT" ? price - disc : price * (1 - disc / 100);
      //const qty = Number(item.quantity) || 1;
      //console.log("accumulate:", acc, "Item:", item, "price:", price, "discount:", disc, "Unit price after discount:", unit, "Qty:", qty);
      return acc + unit;
    }, 0);
  }, [summaryProd]);

  // pure helper to compute final total given subtotal and a percentage discount (0-100)
  const computeFinalTotal = (sub, disc,type) => {
    const s = Number.isFinite(sub) ? sub : 0;
    let d = parseFloat(disc);
    if (Number.isNaN(d)) d = 0;
    if (d < 0) d = 0;
    return type=="FIXED_AMOUNT" ? s - d : s * (1 - d / 100);
  };

  const finalTotal = useMemo(() => computeFinalTotal(subtotal, cartDiscount,discountType), [subtotal, cartDiscount,discountType]);

  return(
    <div style={{ 
      padding: "1rem",
      width: props.selectDraft==0 ? "100%" : "50%",         
      margin: "0 auto",
      }}>
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
              <div><strong style={{ color: '#D6AD42' }}>Nome:</strong> {selectedCustomer.name} {selectedCustomer.surname || ''}</div>
              <div><strong style={{ color: '#D6AD42' }}>Email:</strong> {selectedCustomer.email}</div>
              {combinedAddress && <div><strong style={{ color: '#D6AD42' }}>Indirizzo:</strong> {combinedAddress}</div>}
              {(selectedCustomer.countryName || selectedCustomer.countryCode) && <div><strong style={{ color: '#D6AD42' }}>Paese:</strong> {selectedCustomer.countryName || selectedCustomer.countryCode}</div>}
              {combinedPhone && <div><strong style={{ color: '#D6AD42' }}>Telefono:</strong> {combinedPhone}</div>}
              {selectedCustomer.fiscalCode && <div><strong style={{ color: '#D6AD42' }}>Codice Fiscale:</strong> {selectedCustomer.fiscalCode}</div>}
              <div><strong style={{ color: '#D6AD42' }}>Newsletter:</strong> {selectedCustomer.spam ? 'Sì' : 'No'}</div>
            </div>
          ) ||
          <div style={{
              background: '#39300D',
              color: '#FEF4B1',
              borderRadius: '8px',
              padding: '15px',
              border: '3px solid #D6AD42',
              marginBottom: '15px'
            }}>
              <h5 style={{ color: '#D6AD42', textAlign: 'center', marginBottom: '10px' }}>Nessun cliente Selezionato</h5>

            </div>
          
          
          }

      {/* Products in cart */}
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
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 4px', borderBottom: '2px dashed rgba(0,0,0,0.3)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', color: '#39300D' }}>{p.title}</div>
                  {renderPrice(p)}
                  <div style={{ fontSize: '0.85em', color: '#39300D' }}>Qty: {p.quantity}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  
                  {
                    props.selectDraft==0 ? 
                    <button
                      type="button"
                      onClick={() => props.removeProduct && props.removeProduct(idx)}
                      title="Rimuovi"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#c0392b',
                        cursor: 'pointer',
                        fontSize: '1.6rem'
                      }}
                    >
                      <i className="bi bi-trash" />
                    </button>
                    :
                    ""
                  }
                </div>
              </div>
            ))
          )}
        </div>

        {/* Global cart discount */}
        {
          props.selectDraft==0 ? 
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '25%', fontSize: '0.85em', color: '#D6AD42', fontWeight: '600' }}>Sconto:</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Form.Select style={{fontSize: "0.8vw", width:"8vw",height:'35px', marginRight:"1vw"}}
              required
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
            >
              <option value="FIXED_AMOUNT">Importo</option>
              <option value="PERCENTAGE">Percentuale</option>
            </Form.Select>
            <Form.Control
              type="number"
              min={0}
              max={discountType == "PERCENTAGE" ? 100 : Number(subtotal) || 0}
              step={1}
              value={cartDiscount}
              onChange={(e) => {
                let val = parseFloat(e.target.value) || 0;
                const max = discountType === "PERCENTAGE" ? 100 : Number(subtotal);
                if (val > max) val = max;
                handleCartDiscountChange(val);
              }}
              style={{ fontSize: '0.9em', maxWidth: '120px', height:'35px',marginRight:"1vw" }}
            />
            <div style={{ marginLeft: '8px', color: '#39300D', fontWeight: '600' }}>%</div>
          </div>
        </div>
          :
          null
        }
      </div>

      {/* payment section - styled like other summary boxes */}
      <div style={{
        background: '#39300D',
        color: '#FEF4B1',
        borderRadius: '8px',
        padding: '12px',
        border: '3px solid #D6AD42',
        marginBottom: '12px'
      }}>
        <h5 style={{ color: '#D6AD42', textAlign: 'center', marginBottom: '8px' }}>Pagamento</h5>

        <div style={{ background: '#FEF4B1', color: '#39300D', border: '2px solid #D6AD42', borderRadius: '6px', padding: '12px' }}>
          <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
            Subtotale: <span style={{ float: 'right' }}>{subtotal.toFixed(2)}€</span>
          </div>

          <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
            Sconto ({Number(cartDiscount).toFixed(2)}){discountType=="PERCENTAGE" ? "%":"€"}: <span style={{ float: 'right' }}>-
            {discountType=="FIXED_AMOUNT" ? 
            Number(cartDiscount).toFixed(2) : 
            ((subtotal / 100) * Number(cartDiscount)).toFixed(2)}
            €</span>
          </div>

          <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
            Spese di Spedizione: <span style={{ float: 'right' }}>0.00€</span>
          </div>

          <div style={{ marginBottom: '15px', fontWeight: 'bold' }}>
            IT IVA 22% (Inclusa): <span style={{ float: 'right' }}>{(finalTotal * 0.22).toFixed(2)}€</span>
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
            Totale: {finalTotal.toFixed(2)}€
          </div>
        </div>
      </div>
    </div>
  );
}

export { SummaryCosts };