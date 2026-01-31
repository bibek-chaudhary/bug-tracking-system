import { useState } from "react";
import type React from "react";

interface Props {
  onFilterChange: (filters: any) => void;
}

const BugFilter: React.FC<Props> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false); 
  return (
    <div className="bg-white rounded-2xl shadow mb-6">
      {/* Mobile toggle button */}
      <div className="flex justify-between items-center p-4 md:hidden">
        <h3 className="text-lg font-semibold text-gray-700">Filters</h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {isOpen ? "Hide" : "Show"}
        </button>
      </div>

      <div
        className={`p-4 flex flex-wrap gap-4 items-end transition-all duration-300
        ${isOpen ? "block" : "hidden"} md:flex md:p-4`}
      >
        <div className="flex-1 min-w-[220px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by title..."
            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            onChange={(e) => onFilterChange({ title: e.target.value })}
          />
        </div>

        <div className="min-w-[160px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Status
          </label>
          <select
            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
            onChange={(e) => onFilterChange({ status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="Open">Open</option>
            <option value="InProgress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="min-w-[160px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Severity
          </label>
          <select
            className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white"
            onChange={(e) => onFilterChange({ severity: e.target.value })}
          >
            <option value="">All Severity</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BugFilter;
