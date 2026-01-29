import type React from "react";

interface Props {
  onFilterChange: (filters: any) => void;
}

const BugFilter: React.FC<Props> = ({ onFilterChange }) => {
  return (
    <div className="flex gap-4 mb-4">
      <input
        type="text"
        placeholder="Search title"
        className="border p-2 rounded"
        onChange={(e) => onFilterChange({ title: e.target.value })}
      />

      <select
        className="border p-2 rounded"
        onChange={(e) => onFilterChange({ status: e.target.value })}
      >
        <option value="">All Status</option>
        <option value="Open">Open</option>
        <option value="InProgress">In Progress</option>
        <option value="Resolved">Resolved</option>
        <option value="Closed">Closed</option>
      </select>

      <select
        className="border p-2 rounded"
        onChange={(e) => onFilterChange({ severity: e.target.value })}
      >
        <option value="">All Severity</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>
  );
};

export default BugFilter;
