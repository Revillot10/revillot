import { Navigate } from 'react-router-dom';

// La página de financiamiento fue integrada en /buy
export default function Finance() {
  return <Navigate to="/buy" replace />;
}
