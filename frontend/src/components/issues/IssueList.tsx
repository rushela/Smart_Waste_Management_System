import { Clock, CheckCircle, AlertTriangle, MapPin } from 'lucide-react';

interface Issue {
  _id: string;
  category: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  location?: {
    city?: string;
    area?: string;
    address?: string;
  };
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

interface IssueListProps {
  issues: Issue[];
  loading?: boolean;
  onIssueClick?: (issue: Issue) => void;
}

const statusConfig = {
  Pending: {
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: AlertTriangle,
    iconColor: 'text-red-600'
  },
  'In Progress': {
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: Clock,
    iconColor: 'text-orange-600'
  },
  Resolved: {
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-600'
  }
};

const categoryIcons: Record<string, string> = {
  collection: '🗑️',
  bin: '♻️',
  payment: '💳',
  sensor: '📡',
  other: '📝'
};

export function IssueList({ issues, loading, onIssueClick }: IssueListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (issues.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">📭</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Issues Found</h3>
        <p className="text-gray-600">You haven't reported any issues yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {issues.map(issue => {
        const StatusIcon = statusConfig[issue.status].icon;
        const formattedDate = new Date(issue.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        return (
          <div
            key={issue._id}
            onClick={() => onIssueClick?.(issue)}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{categoryIcons[issue.category] || '📝'}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800 capitalize">
                      {issue.category.replace('_', ' ')} Issue
                    </h3>
                    <p className="text-xs text-gray-500">{formattedDate}</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-3 line-clamp-2">{issue.description}</p>

                {issue.location && (issue.location.city || issue.location.area) && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
                    <MapPin size={14} />
                    <span>
                      {[issue.location.area, issue.location.city].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}

                {issue.resolutionNotes && issue.status === 'Resolved' && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-sm text-green-800">
                      <strong>Resolution:</strong> {issue.resolutionNotes}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig[issue.status].color}`}>
                  <StatusIcon size={14} className={statusConfig[issue.status].iconColor} />
                  {issue.status}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
