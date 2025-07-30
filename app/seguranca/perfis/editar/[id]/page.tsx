import { DashboardLayout } from "@/components/dashboard-layout"
import { EditarPerfilContent } from "@/components/editar-perfil-content"

interface EditarPerfilPageProps {
  params: {
    id: string
  }
}

export default function EditarPerfilPage({ params }: EditarPerfilPageProps) {
  return (
    <DashboardLayout>
      <EditarPerfilContent perfilId={params.id} />
    </DashboardLayout>
  )
}