export default function CheckoutLoading() {
  return (
    <div className="wrap" style={{ padding: "120px 0 80px", textAlign: "center" }}>
      <div className="spinner" style={{ width: 32, height: 32, margin: "0 auto" }} />
      <p style={{ color: "var(--steel)", marginTop: 16, fontSize: 13 }}>Chargement...</p>
    </div>
  );
}
