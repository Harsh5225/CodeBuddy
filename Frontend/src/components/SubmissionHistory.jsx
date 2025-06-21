import { useState } from "react";
import { useGetSubmissionsByProblemIdQuery } from "../features/submission/submissionApi";

const SubmissionHistory = ({ problemId }) => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const {
    data: submissions,
    isLoading,
    isError,
    error,
  } = useGetSubmissionsByProblemIdQuery(problemId);

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "badge-success";
      case "wrong":
        return "badge-error";
      case "error":
        return "badge-warning";
      case "pending":
        return "badge-info";
      default:
        return "badge-neutral";
    }
  };

  const formatMemory = (memory) =>
    memory < 1024 ? `${memory} kB` : `${(memory / 1024).toFixed(2)} MB`;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <div>
          <span>{error?.data?.message || "Error fetching submissions"}</span>
        </div>
      </div>
    );
  }

  if (submissions === "No Submission is persent") {
    return (
      <div className="alert alert-info shadow-lg">
        <span>No submissions found for this problem</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Submission History
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Language</th>
              <th>Status</th>
              <th>Runtime</th>
              <th>Memory</th>
              <th>Test Cases</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub, index) => (
              <tr key={sub._id}>
                <td>{index + 1}</td>
                <td className="font-mono">{sub.language}</td>
                <td>
                  <span className={`badge ${getStatusColor(sub.status)}`}>
                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                  </span>
                </td>
                <td className="font-mono">{sub.runtime}sec</td>
                <td className="font-mono">{formatMemory(sub.memory)}</td>
                <td className="font-mono">
                  {sub.testCasesPassed}/{sub.testCasesTotal}
                </td>
                <td>{formatDate(sub.createdAt)}</td>
                <td>
                  <button
                    className="btn btn-s btn-outline"
                    onClick={() => setSelectedSubmission(sub)}
                  >
                    Code
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Code same as before */}
      {selectedSubmission && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-lg mb-4">
              Submission Details: {selectedSubmission.language}
            </h3>

            <pre className="p-4 bg-gray-900 text-gray-100 rounded overflow-x-auto">
              <code>{selectedSubmission.code}</code>
            </pre>

            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;
