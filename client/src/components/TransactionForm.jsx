// src/components/TransationForm.jsx
import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import TransactionForm from "./TransactionForm";

export default function Transactions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState({ q: "", type: "all", month: currentMonth() });

  function currentMonth() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
  }

  async function load() {
    setLoading(true);
    try {
      // to make a filter by month
      const data = await api.listTx({ month: filter.month, q: filter.q, type: filter.type });
      setItems(data?.transactions || data || []);
    } catch (e) {
      console.error(e);
      alert(e.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [filter.month, filter.q, filter.type]);

  const total = useMemo(() => {
    const inc = items.filter(i => i.type === "income").reduce((s,i)=>s+Number(i.amount||0),0);
    const exp = items.filter(i => i.type === "expense").reduce((s,i)=>s+Number(i.amount||0),0);
    return { income: inc, expense: exp, balance: inc - exp };
  }, [items]);

  async function createTx(data) {
    await api.createTx(data);
    await load();
  }

  async function updateTx(id, data) {
    await api.updateTx(id, data);
    setEditing(null);
    await load();
  }

  async function deleteTx(id) {
    if (!confirm("Delete this transaction?")) return;
    await api.deleteTx(id);
    await load();
  }

  return (
    <div className="card">
      <h2>Transactions</h2>

      {/* Filters */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:12 }}>
        <input placeholder="Search description/category…" value={filter.q} onChange={e=>setFilter(f=>({...f,q:e.target.value}))}/>
        <select value={filter.type} onChange={e=>setFilter(f=>({...f,type:e.target.value}))}>
          <option value="all">All</option>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input type="month" value={filter.month} onChange={e=>setFilter(f=>({...f,month:e.target.value}))}/>
      </div>

      {/* Summary */}
      <div style={{ display:"flex", gap:16, marginBottom:16 }}>
        <strong>Income: {total.income.toFixed(2)}</strong>
        <strong>Expense: {total.expense.toFixed(2)}</strong>
        <strong>Balance: {total.balance.toFixed(2)}</strong>
      </div>

      {/* Create / Edit form */}
      <div style={{ marginBottom:16 }}>
        <h3 style={{ marginTop:0 }}>{editing ? "Edit transaction" : "Add transaction"}</h3>
        <TransactionForm
          initial={editing || undefined}
          onSubmit={(data)=> editing ? updateTx(editing._id, data) : createTx(data)}
          onCancel={editing ? ()=>setEditing(null) : undefined}
        />
      </div>

      {/* List */}
      {loading ? <p>Loading…</p> : (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr>
                <th style={th}>Date</th>
                <th style={th}>Description</th>
                <th style={th}>Category</th>
                <th style={th}>Type</th>
                <th style={th}>Amount</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map(tx => (
                <tr key={tx._id || `${tx.date}-${tx.description}-${tx.amount}`}>
                  <td style={td}>{tx.date?.slice(0,10)}</td>
                  <td style={td}>{tx.description}</td>
                  <td style={td}>{tx.category}</td>
                  <td style={td}>{tx.type}</td>
                  <td style={td}>{Number(tx.amount).toFixed(2)}</td>
                  <td style={td}>
                    <button onClick={()=>setEditing(tx)}>Edit</button>
                    <button onClick={()=>deleteTx(tx._id)} style={{ marginLeft:8 }}>Delete</button>
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr><td style={td} colSpan="6">No transactions found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th = { textAlign:"left", borderBottom:"1px solid #e5e7eb", padding:"8px" };
const td = { borderBottom:"1px solid #f1f5f9", padding:"8px" };
