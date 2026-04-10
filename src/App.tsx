import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Analytics from "./pages/Analytics";
import Payments from "./pages/Payments";
import PaymentDetail from "./pages/PaymentDetail";

function App() {
  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<Analytics />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/payment/:id" element={<PaymentDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
