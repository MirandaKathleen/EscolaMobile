import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
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

const uri = import.meta.env.VITE_API_URI || 'http://10.87.202.141:3000'
axios.defaults.baseURL = uri

function Atividades() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const id = state?.turmaId || ''
  const turma = state?.nome || ''
  const professor = JSON.parse(window.localStorage.getItem('professor') ?? '{}')

  const [atividades, setAtividades] = useState<Array<{ id: number; descricao: string }>>([])
  const [open, setOpen] = useState(false)
  const [descricao, setDescricao] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!professor.id) {
      window.localStorage.removeItem('professor')
      sair()
      return
    }
    loadAtividades()
  }, [])

  function loadAtividades() {
    axios.get('/atividade/' + id)
      .then(response => setAtividades(response.data))
      .catch(error => console.error('Erro ao buscar atividades:', error))
  }

  function sair() {
    navigate('/home')
  }

  return (
    <>
      <header className="w-full bg-blue-200 text-gray-800 flex flex-row items-center justify-between px-8 h-16 shadow-md">
        <h1 className="font-bold text-lg">{professor.nome}</h1>
        <Button
          variant="destructive"
          className="bg-gray-400 hover:bg-gray-300 text-black font-medium px-4 rounded-lg transition-all"
          onClick={sair}
        >
          Voltar
        </Button>
      </header>

      <main className="min-h-screen flex items-start justify-center p-6" style={{ backgroundColor: '#bbe1fa' }}>
        <div className="w-full max-w-4xl space-y-6">

          <div className="w-full flex justify-end">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-100 hover:bg-blue-50 text-gray-800 font-medium rounded-lg shadow-sm transition-all">
                  + Nova Atividade
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl shadow-lg border border-gray-300">
                <DialogHeader>
                  <DialogTitle className="text-gray-800 text-lg font-semibold">Nova atividade</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Digite a descrição da atividade para adicioná-la à turma.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const turmaId = Number(id)
                    if (!turmaId) {
                      console.error('turmaId inválido')
                      return
                    }
                    setSubmitting(true)
                    axios.post('/atividade', { descricao, turmaId })
                      .then(() => {
                        setDescricao("")
                        setOpen(false)
                        loadAtividades()
                      })
                      .catch(error => console.error('Erro ao cadastrar atividade:', error))
                      .finally(() => setSubmitting(false))
                  }}
                  className="space-y-4"
                >
                  <Input
                    type="text"
                    placeholder="Descrição da atividade"
                    value={descricao}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescricao(e.target.value)}
                    className="border-gray-300 focus:ring-2 focus:ring-blue-200 rounded-lg"
                    required
                  />
                  <DialogFooter>
                    <Button
                      type="submit"
                      disabled={submitting || !descricao.trim()}
                      className="bg-blue-200 hover:bg-blue-100 text-gray-800 rounded-lg transition-all"
                    >
                      {submitting ? 'Enviando...' : 'Salvar'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <h2 className="text-gray-800 font-semibold text-xl">
            <b>Turma:</b> {turma}
          </h2>

          {atividades.length === 0 ? (
            <p className="text-gray-700 italic">Nenhuma atividade cadastrada ainda.</p>
          ) : (
            <ul className="space-y-3">
              {atividades.map(atividade => (
                <li
                  key={atividade.id}
                  className="w-full flex justify-between items-center px-5 py-3 bg-gray-100 border border-gray-300 rounded-2xl shadow-sm hover:shadow-md transition-all"
                >
                  <span className="text-gray-800 font-medium">
                    {atividade.id} — {atividade.descricao}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  )
}

export default Atividades
