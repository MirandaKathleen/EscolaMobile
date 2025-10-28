import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import axios from 'axios'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const uri = import.meta.env.VITE_API_URI || 'http:// 10.87.202.141:3000'
axios.defaults.baseURL = uri

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [alertData, setAlertData] = useState<{ title: string; message: string } | null>(null)

  function handleLogin() {
    axios.post('/login', { email, senha })
      .then(response => { return { status: response.status, response: response.data } })
      .then(({ status, response }) => {
        if (status === 200) {
          setAlertData({ title: 'Sucesso', message: 'Login realizado com sucesso!' })
          window.localStorage.setItem('professor', JSON.stringify(response))
          setTimeout(() => {
            navigate('/home')
          }, 1000)
        }
      })
      .catch((error) => {
        const status = error?.response?.status
        if (status === 401) {
          setAlertData({ title: 'Erro', message: 'Falha no login. Verifique suas credenciais.' })
          return
        }
        setAlertData({ title: 'Erro', message: 'Erro ao conectar com o servidor. Tente novamente mais tarde.' })
      })
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#89CFF0' }}>
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="w-full max-w-md">
        <Card className="w-full border-[#000000] border-2 shadow-md bg-white dark:bg-black dark:border-[#89CFF0] dark:text-[#89CFF0]">
          <CardHeader className='text-center'>
            <CardTitle className="text-[#000000] dark:text-[#89CFF0]">Bem vindo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alertData && (
              <Alert className="bg-[#89CFF0] border-[#000000] text-[#000000] dark:bg-black dark:border-[#89CFF0] dark:text-[#89CFF0]">
                <AlertTitle>{alertData.title}</AlertTitle>
                <AlertDescription>{alertData.message}</AlertDescription>
              </Alert>
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full border-[#000000] focus:ring-2 focus:ring-[#000000] bg-white text-[#000000] placeholder:text-[#000000]/70 dark:bg-black dark:border-[#89CFF0] dark:text-[#89CFF0] dark:placeholder:text-[#89CFF0]/70"
              required
            />
            <Input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value)}
              className="w-full border-[#000000] focus:ring-2 focus:ring-[#000000] bg-white text-[#000000] placeholder:text-[#000000]/70 dark:bg-black dark:border-[#89CFF0] dark:text-[#89CFF0] dark:placeholder:text-[#89CFF0]/70"
              required
            />
            <Button
              type="submit"
              className="w-full bg-[#000000] text-[#89CFF0] hover:bg-[#111111] transition-colors duration-300"
            >
              Entrar
            </Button>
          </CardContent>
        </Card>
      </form>
    </main>
  )
}

export default Login
