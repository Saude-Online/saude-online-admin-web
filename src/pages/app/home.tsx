import { useQuery } from '@tanstack/react-query'
import {
  BadgeDollarSign,
  CalendarHeart,
  Cross,
  NotebookPen,
  UsersRound,
} from 'lucide-react'
import { Helmet } from 'react-helmet-async'

import { getUser } from '@/api/get-user'
import { FeatureCard } from '@/components/feature-card'

export function Home() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser({ userId: '' }),
    staleTime: Infinity,
  })

  return (
    <>
      <Helmet title="Home" />

      <div className="p-8">
        <h1 className="text-2xl font-semibold tracking-tight lg:pl-20">
          O que você precisa hoje?
        </h1>
        <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-20">
          <FeatureCard
            icon={CalendarHeart}
            title="Agenda"
            description="Organize e acompanhe seus compromissos diários de forma eficiente."
            to="schedule"
          />
          <FeatureCard
            icon={BadgeDollarSign}
            title="Financeiro"
            description="Monitore suas finanças, controle suas receitas e despesas em um só lugar."
            to="financial"
          />
          <FeatureCard
            icon={UsersRound}
            title="Pacientes"
            description="Mantenha registros detalhados e organizados dos seus pacientes."
            to="patients"
          />
          {user?.crm && (
            <FeatureCard
              icon={Cross}
              title="Anamnese"
              description="Registre e acesse facilmente os históricos médicos dos seus pacientes."
              to="anamnesis"
            />
          )}
          <FeatureCard
            icon={NotebookPen}
            title="Receituário"
            description="Crie, gerencie e emita receitas médicas de forma prática e segura."
            to="prescription"
          />
        </div>
      </div>
    </>
  )
}
