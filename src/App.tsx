import React, { useState } from 'react';
import { Building2, Trash2 } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import html2pdf from 'html2pdf.js';

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
}

function App() {
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [clientName, setClientName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [gst, setGst] = useState(0);
  const [adjustment, setAdjustment] = useState(0);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), description: '', quantity: 0, unitPrice: 0 },
    ]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const gstAmount = (subtotal * gst) / 100;
    return subtotal + gstAmount - adjustment;
  };

  const generatePDF = () => {
    const element = document.getElementById('invoice');
    const opt = {
      margin: 1,
      filename: `invoice-${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="container ">  
    {/* this is taken from px-5 my-5 */}
      <div id="invoice" className="bg-white p-4  shadow rounded">
          <div className="row mb-4">
            <div className="col-sm-12 text-center">
              <Building2 size={32} className="me-2" />
              <h2 className="mb-0">Rashid Engineering Works</h2>
              <p className="text-muted">Excellence in Engineering</p>
            </div>
            <div className="  mb-3 text-center">
            <p >
              Old Motor Market, Near Office 1122
              <br />
              Jhang Road Faisalabad
            </p>
            <p>
              Phone: +921 300 7627914
              <br />
              NTN: 50328573
              <br />
              CNIC No: 33102-7295483-7
            </p>
            </div>
          </div>
        {/* <div className="row mb-4"> */}
            <h4>Invoice</h4>
          <div className="col-6 text-end">
            <div className="mb-3">
              <label className="form-label">Invoice Number</label>
              <input
                type="text"
                className="form-control text-end"
                value="INV-2024-001"
              />
            </div>
            </div>
            <div className='col-6 text-end'>
            <div className="mb-3">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control text-end"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        {/* </div>   */}

        <div className="row mb-4">
          <div className="col-12">
            <h5>Invoice For</h5>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Client Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter client name"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Address</label>
              <textarea
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter client address"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="table-responsive mb-4">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Description</th>
                <th style={{ width: '120px' }}>Quantity</th>
                <th style={{ width: '150px' }}>Unit Price</th>
                <th style={{ width: '150px' }}>Total</th>
                <th style={{ width: '50px' }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="text"
                      className="form-control border-0"
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, 'description', e.target.value)
                      }
                      placeholder="Enter item description"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control border-0"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          'quantity',
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control border-0"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          'unitPrice',
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </td>
                  <td className="text-end">
                    Rs. {(item.quantity * item.unitPrice).toFixed(2)}
                  </td>
                  <td>
                    <button
                      className="btn btn-link text-danger p-0"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-light" onClick={addItem}>
            Add Item
          </button>
        </div>

        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="border rounded p-3">
              <h6>Bank Account</h6>
              <p className="mb-1">Bank: UBL Bank</p>
              <p className="mb-1">Account Title: Rashid Engineering Works</p>
              <p className="mb-1">Account Number: 1652291722694</p>
              <p className="mb-0">IBAN: PK45UNIL0109000291722694</p>
            </div>
            <div className="mt-3">
              <label className="form-label">Notes</label>
              <textarea
                className="form-control"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes or payment terms"
                rows={3}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="bg-light p-3 rounded">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>Rs. {calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="mb-2">
                <div className="d-flex justify-content-between align-items-center">
                  <span>GST (%):</span>
                  <input
                    type="text"
                    placeholder='GST'
                    className="form-control ms-2"
                    style={{ width: '80px' }}
                    value={gst}
                    onChange={(e) => setGst(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Adjustment:</span>
                  <input
                    type="text"
                    className="form-control ms-2"
                    style={{ width: '120px' }}
                    value={adjustment}
                    onChange={(e) =>
                      setAdjustment(parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between border-top pt-2">
                <strong>Total:</strong>
                <strong>Rs. {calculateTotal().toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          className="btn btn-outline-primary"
          onClick={() => window.print()}
        >
          Preview
        </button>
        <button className="btn btn-primary" onClick={generatePDF}>
          Generate PDF
        </button>
      </div>
    </div>
  );
}

export default App;
