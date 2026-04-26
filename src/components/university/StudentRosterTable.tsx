import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataNotice } from './DataNotice'

export interface StudentRecord {
  id: string
  full_name: string
  applications_count: number
  credentials_earned: number
  joined_at: string
  active_placements: number
}

interface StudentRosterTableProps {
  students: StudentRecord[]
}

const getExperienceLevel = (credentialsCount: number) => {
  if (credentialsCount === 0) return { label: 'Novice', className: 'bg-slate-100 text-slate-600' }
  if (credentialsCount < 3) return { label: 'Entry Level', className: 'bg-blue-50 text-blue-700' }
  if (credentialsCount < 10) return { label: 'Professional', className: 'bg-emerald-50 text-emerald-700' }
  return { label: 'Expert', className: 'bg-primary/10 text-primary border-primary/20' }
}

export function StudentRosterTable({ students }: StudentRosterTableProps) {
  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Active Placements</TableHead>
              <TableHead>Experience Level</TableHead>
              <TableHead>Credentials</TableHead>
              <TableHead>Registration Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => {
              const level = getExperienceLevel(student.credentials_earned)
              return (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.full_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.active_placements}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${level.className} font-medium border-transparent`}>
                      {level.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-purple-100 text-purple-800 border-transparent">
                      {student.credentials_earned}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(student.joined_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <div className="p-4 border-t">
        <DataNotice 
          message="Experience Levels are dynamically calculated based on total verified credentials earned by each student." 
        />
      </div>
    </>
  )
}
