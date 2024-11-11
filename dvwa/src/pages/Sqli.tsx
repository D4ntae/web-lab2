import React, { useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const URL = "http://localhost:3000"

export const Sqli = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<String>("");
  const [errorType, setErrorType] = useState<"destructive" | "default" | null | undefined>("destructive")
  const [checked, setChecked] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await axios.post(URL + "/api/login", { username, password, checked });
      if (response.status === 200) {
        // Handle successful login (e.g., redirect, store token, etc.)
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
                <p className="text-lg font-bold">Ubacivanje SQL koda</p>
            </CardHeader>
            <CardContent>
      <span>Ova stranica prikazuje tipičan scenariji ubacanjivanja SQL koda. Ako je ranjivost uključena, server kod će pokušati napraviti SQL upit prema bazi tako da ubaci korisničko ime i lozinku u upit konkatinacijom. Ovo omogućava korisnicima da upišu neki SQL kod (primjerice 'OR 1=1 --) kojim naprave upit automatski istinit bez da znaju vjerodajnice korisnika.</span>
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
            <div className="flex items-center space-x-2">
              <Checkbox id="checked" checked={checked} onCheckedChange={(newCheck) => setChecked(newCheck)}/>
              <label htmlFor="checked" className="text-slate-700">Ranjivo</label>
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
