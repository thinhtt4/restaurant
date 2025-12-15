import type { LucideIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface StatCardProps {
  title: string
  value: number
  icon: LucideIcon
  bgColor: string
  link?: string
}

export default function StatCard({ title, value, icon: Icon, bgColor, link }: StatCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (link) {
      navigate(link);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
      onClick={handleClick}>
      <div className={`${bgColor} p-4 rounded-lg text-white`}>
        <Icon size={32} />
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}
