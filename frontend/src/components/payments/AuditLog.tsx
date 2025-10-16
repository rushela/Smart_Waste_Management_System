import React from 'react'
import { ClockIcon, UserIcon } from 'lucide-react'
interface LogEntry {
  action: string
  user: string
  timestamp: string
}
interface AuditLogProps {
  logs: LogEntry[]
}
export const AuditLog: React.FC<AuditLogProps> = ({ logs }) => {
  return (
    <div className="overflow-hidden bg-white rounded-lg">
      <div className="bg-[#A5D6A7] px-6 py-4">
        <h2 className="text-xl font-semibold text-[#263238]">Audit Log</h2>
      </div>
      <div className="p-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {logs.map((log, index) => (
              <li key={index}>
                <div className="relative pb-8">
                  {index < logs.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    ></span>
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-[#2E7D32] flex items-center justify-center">
                        {log.action === 'Created' ? (
                          <ClockIcon className="w-4 h-4 text-white" />
                        ) : (
                          <UserIcon className="w-4 h-4 text-white" />
                        )}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-[#263238]">
                          <span className="font-medium">{log.action}</span> by{' '}
                          <span className="font-medium">{log.user}</span>
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        <time dateTime={log.timestamp}>{log.timestamp}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
