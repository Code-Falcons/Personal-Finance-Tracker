import React, { useState } from "react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function onSubmit(e) {
    e.preventDefault();        
    setSent(true);
    e.target.reset();
    setTimeout(() => setSent(false), 2500);
  }

  return (
    <div className="card">
      <h2>Contact</h2>
      <p className="muted" style={{marginTop: 8}}>
        Have feedback or ideas? Send us a note below.
      </p>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginTop:16}}>
        {/* Contact info */}
        <div style={{border:"1px solid #e5e7eb", borderRadius:12, padding:12}}>
          <h3>Contact Information</h3>
          <p><strong>Email:</strong> <a href="mailto:support@pft.demo">support@pft.demo</a></p>
          <p><strong>Phone:</strong> 05970000</p>
          <p><strong>Address:</strong>Ramallah, Palestine</p>
          <div className="muted" style={{marginTop:8}}>
            Find us on:
            <ul style={{paddingLeft:18, lineHeight:1.9}}>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">GitHub</a></li>
            </ul>
          </div>
        </div>

        {/* Simple form */}
        <div style={{border:"1px solid #e5e7eb", borderRadius:12, padding:12}}>
          <h3>Send a Message</h3>
          {sent && <p style={{color:"#16a34a", marginBottom:8}}>Message sent! (demo)</p>}
          <form onSubmit={onSubmit} noValidate>
            <label>Name</label>
            <input type="text" placeholder="Your full name" required />

            <label style={{marginTop:8}}>Email</label>
            <input type="email" placeholder="you@example.com" required />

            <label style={{marginTop:8}}>Subject</label>
            <input type="text" placeholder="What is this about?" required />

            <label style={{marginTop:8}}>Message</label>
            <textarea rows={5} placeholder="Write your message…" required />

            <button type="submit" style={{marginTop:10}}>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
