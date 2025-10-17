// Mock notification service: logs to console and returns a promise
exports.sendIssueCreated = async (user, issue) => {
  console.log(`📬 [mock] Issue created email to ${user?.email || user}: #${issue._id} (${issue.category})`);
};

exports.sendIssueUpdated = async (user, issue) => {
  console.log(`📬 [mock] Issue updated email to ${user?.email || user}: #${issue._id} → ${issue.status}`);
};
