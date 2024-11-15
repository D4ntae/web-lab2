import { useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const URL = "http://localhost:3000"

export const Csrf = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<String>("");
  const [errorType, setErrorType] = useState<"destructive" | "default" | null | undefined>("destructive")
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await axios.post(URL + "/api/login", { username, password, checked: false}, {
        withCredentials: true
      });
      if (response.status === 200) {
        // Handle successful login (e.g., redirect, store token, etc.)
        console.log(response.headers)
        navigate("/dashboard");
        setErrorType("default");
        setError("Login successful");
      } else {
        setErrorType("destructive");
        setError("Wrong username or password");
      }
    } catch (error) {
      setErrorType("destructive");
      setError("Wrong username or password");
    }
  };

  return (
    <div className="mt-10 flex h-screen w-screen flex-col items-center justify-start gap-10 bg-slate-100">
        <Card className="w-2/5 shadow-lg">
            <CardHeader>
                <p className="text-lg font-bold">Lažiranje zahtjeva na drugom sjedištu</p>
            </CardHeader>
            <CardContent>
      <span>Lažiranje zahtjeva na drugom sjedištu (CSRF) je ranjivost koja se temelji na iskorištavanju aktivne sesije koju korisnik ima prema aplikaciji kako bi se izvršila akcija u ime korisnika. Primjer akcije će biti promjena lozinke, a kako je CSRF ranjivost koja se dešava prijavljenim korisnicima, potrebno je prijaviti se u aplikaciju. Vjerodajnice su csrfuser:password</span>
            </CardContent>
        </Card>
      <Card className="w-96 shadow-lg">
        <CardHeader>
          <p className="text-xl font-semibold">Login</p>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && <Alert variant={errorType}>{error}</Alert>}
            <div>
              <label className="block text-slate-700">Username</label>
              <Input
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-slate-700">Password</label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" variant="default" className="w-full">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
