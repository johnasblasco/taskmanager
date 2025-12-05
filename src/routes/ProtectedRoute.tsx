import { useAuthContext } from "@/context/AuthContext";

export default function ProtectedRoute({ children }: any) {
    const { user } = useAuthContext();
    return user ? children : <div>You must login first.</div>;
}
