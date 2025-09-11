import React from "react";

export default function About() {
  return (
    <div className="card">
      <h2>About Us</h2>
      <p className="muted" style={{ marginTop: 8 }}>
        Personal Finance Tracker helps you record income and expenses and see a quick summary.
      </p>

      <div style={{ marginTop: 16 }}>
        <h3>Our Mission</h3>
        <p>
          Make money tracking simple for everyone: clear screens, fast actions,
          and information you can understand at a glance.
        </p>
      </div>

      <div style={{ marginTop: 16 }}>
        <h3>What you can do</h3>
        <ul style={{ paddingLeft: 18, lineHeight: 1.9 }}>
          <li>Add transactions (income or expense).</li>
          <li>Filter by month and type.</li>
          <li>See totals: income, expense, and balance.</li>
          <li>Budgets and reports (planned).</li>
        </ul>
      </div>

      <div style={{ marginTop: 16 }}>
        <h3>Team</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
            gap: 12,
          }}
        >
          <div style={memberCard}>
            <div style={avatar} />
            <strong>Mariam Hasanat</strong>
          </div>
          <div style={memberCard}>
            <div style={avatar} />
            <strong>Bahaa Abbas</strong>
          </div>
          <div style={memberCard}>
            <div style={avatar} />
            <strong>Baseel Fares</strong>
          </div>
          <div style={memberCard}>
            <div style={avatar} />
            <strong>Noor Moqady</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

const memberCard = {
  border: "1px solid #e5e7eb",
  borderRadius: 12,
  padding: 12,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
};

const avatar = {
  width: 56,
  height: 56,
  borderRadius: "50%",
  background: "#e5e7eb",
  marginBottom: 6,
};
