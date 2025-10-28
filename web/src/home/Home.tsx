import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import axios from 'axios'

const uri = import.meta.env.VITE_API_URI || 'http:// 10.87.202.141:3000'
axios.defaults.baseURL = uri

function Home() {
  const navigate = useNavigate()
  const professor = JSON.parse(window.localStorage.getItem('professor') ?? '{}')
  const [turmas, setTurmas] = useState<Array<{ id: number; nome: string }>>([])
  const [open, setOpen] = useState(false)
  const [nome, setNome] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!professor.id) {
      sair()
      return
    }
    axios.get('/turma/' + professor.id)
      .then(response => { setTurmas(response.data) })
      .catch(error => {
        console.error('Erro ao buscar turmas:', error)
      })
  }, [])

  function sair() {
    window.localStorage.removeItem('professor')
    navigate('/login')
  }

  function excluir(turmaId: number) {
    axios.delete('/turma/' + turmaId)
      .then(response => { return { status: response.status, response: response.data } })
      .then(({ status }) => {
        if (status == 204) {
          setTurmas(turmas.filter(turma => turma.id !== turmaId))
          return
        }
      })
      .catch((error) => {
        const status = error?.response?.status
        if (status === 409) {
          alert(error?.response.data?.message || 'Falha ao excluir turma.')
          return
        }
      })
  }

  return (<>
    {/* Header */}
    <header className="w-full bg-black text-[#89CFF0] flex flex-row items-center justify-between px-8 h-16 shadow-md">
      <h1 className="font-bold text-lg">{professor.nome}</h1>
      <Button
        variant="destructive"
        className="bg-[#89CFF0] hover:bg-[#6ebbe0] text-black font-medium px-4 rounded-lg transition-all"
        onClick={sair}
      >
        Sair
      </Button>
    </header>

    {/* Main content */}
    <main className="min-h-screen flex items-start justify-center p-6" style={{ backgroundColor: '#89CFF0' }}>
      <div className="w-full max-w-4xl space-y-6">
        {/* Botão de cadastro */}
        <div className="w-full flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-gray-900 text-[#89CFF0] font-medium rounded-lg transition-all shadow-sm">
                + Nova Turma
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#89CFF0] rounded-2xl shadow-lg border border-black text-black dark:bg-black dark:text-[#89CFF0] dark:border-[#89CFF0]">
              <DialogHeader>
                <DialogTitle className="text-black text-lg font-semibold dark:text-[#89CFF0]">Cadastrar nova turma</DialogTitle>
                <DialogDescription className="text-black/80 dark:text-[#89CFF0]/80">
                  Informe o nome da turma para adicioná-la à sua lista.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault()
                const professorId = Number(professor?.id)
                if (!professorId) {
                  alert('Professor inválido. Faça login novamente.')
                  return
                }
                setSubmitting(true)
                axios.post('/turma', { nome, professorId })
                  .then(() => {
                    setNome("")
                    setOpen(false)
                    return axios.get('/turma/' + professorId)
                  })
                  .then((response) => {
                    if (response) setTurmas(response.data)
                  })
                  .catch((error) => {
                    console.error('Erro ao cadastrar turma:', error)
                    alert(error?.response?.data?.message || 'Erro ao cadastrar turma')
                  })
                  .finally(() => setSubmitting(false))
              }} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Nome da turma"
                  value={nome}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNome(e.target.value)}
                  className="border-black focus:ring-2 focus:ring-black rounded-lg bg-white text-black placeholder:text-black/60"
                  required
                />
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={submitting || !nome.trim()}
                    className="bg-black hover:bg-gray-900 text-[#89CFF0] rounded-lg transition-all"
                  >
                    {submitting ? 'Enviando...' : 'Salvar'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de turmas */}
        <section>
          <h2 className="font-semibold text-black text-xl mb-3 dark:text-[#89CFF0]">Suas Turmas</h2>
          {turmas.length === 0 ? (
            <p className="text-black/80 italic dark:text-[#89CFF0]/80">Nenhuma turma cadastrada ainda.</p>
          ) : (
            <ul className="space-y-3">
              {turmas.map(turma => (
                <li
                  key={turma.id}
                  className="w-full flex justify-between items-center px-5 py-3 bg-white border border-black rounded-2xl shadow-sm hover:shadow-md transition-all dark:bg-black dark:border-[#89CFF0] dark:text-[#89CFF0]"
                >
                  <span className="text-black font-medium dark:text-[#89CFF0]">{turma.id} — {turma.nome}</span>
                  <div className="flex space-x-2">
                    <Button
                      className="bg-black hover:bg-gray-900 text-[#89CFF0] rounded-lg transition-all border border-[#89CFF0]"
                      onClick={() => excluir(turma.id)}>
                      Excluir
                    </Button>
                    <Button
                      className="bg-[#89CFF0] hover:bg-[#6ebbe0] text-black rounded-lg transition-all border border-black"
                      onClick={() => {
                        navigate('/atividades', {
                          state: { turmaId: turma.id, nome: turma.nome }
                        })
                      }}>
                      Visualizar
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  </>)
}

export default Home
