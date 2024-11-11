import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

const URL = "http://localhost:3000"

export const Dashboard = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<String>("");
  const [errorType, setErrorType] = useState<"destructive" | "default" | null | undefined>("destructive")
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function api() {
      try {
        const response = await axios.get(URL + "/api/check-token", {
          withCredentials: true
        });
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/csrf");
        }
      }
    }
    api();
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); 

    try {
      const response = await axios.get(URL + "/api/changepass", { params: {
        oldPassword, newPassword
      }, withCredentials: true
      });
      if (response.status === 200) {
        setErrorType("default");
        setError(response.data.message);
      } else {
        setErrorType("destructive");
        setError(response.data.message);
      }
    } catch (error) {
      setErrorType("destructive");
      setError("Unknown error");
    }
  };

  return (
    <div className="mt-10 flex h-screen w-screen flex-col items-center justify-start gap-10 bg-slate-100">
        <Card className="w-2/5 shadow-lg">
            <CardHeader>
                <p className="text-lg font-bold">Lažiranje zahtjeva na drugom sjedištu - Dashboard</p>
            </CardHeader>
            <CardContent>
      <span>Ovo je primjer stranice kojoj može pristupiti samo prijavljeni korisnik. Kao prijavljeni korisnik možete promjenit svoju lozinku ili za test ranjivosti možete si poslati mail sa malicioznom poveznicom koja će to napraviti za Vas. Implementirana zaštita traži i staru lozinku kako bi se dodao element koji napadačeva stranica ne može znati. Također je moguće koristiti CSRF tokene.</span>
            </CardContent>
        </Card>
      <Card className="w-96 shadow-lg">
        <CardHeader>
          <p className="text-xl font-semibold">Promjena lozinke</p>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && <Alert variant={errorType}>{error}</Alert>}
            {!checked && <div>
              <label className="block text-slate-700">Stara lozinka</label>
              <Input
                type="password"
                placeholder="Enter old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>}
            <div>
              <label className="block text-slate-700">Nova lozinka</label>
              <Input
                type="password"
                placeholder="Enter password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="checked" checked={checked} onCheckedChange={(newCheck) => {
                setChecked(newCheck);
                axios.post(URL + "/api/set-csrf", { checked: newCheck }, {withCredentials: true});
              }}/>
              <label htmlFor="checked" className="text-slate-700">Ranjivo</label>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" variant="default" className="w-full">
              Promjeni
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

