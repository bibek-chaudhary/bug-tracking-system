import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { bugsApi } from "../api/bug.api";
import { getImageUrl } from "../utils/getImageUrl";
import { usersApi } from "../api/users.api";

const BugDetailsPage: React.FC = () => {
  const { id } = useParams();
  console.log("id", id);
  const [bug, setBug] = useState<any>(null);

  useEffect(() => {
    bugsApi.getBugDetails(id!).then((res) => setBug(res.data));
  }, [id]);

  console.log("bug", bug);

  const [developers, setDevelopers] = useState<any[]>([]);
  const [selectedDev, setSelectedDev] = useState("");

  useEffect(() => {
    usersApi.getDevelopers().then((res) => setDevelopers(res.data));
  }, []);

  if (!bug) return <p>Loading...</p>;

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold">{bug.data.title}</h1>
      <p>{bug.data.description}</p>

      <div className="flex gap-4">
        <span>Status: {bug.data.status}</span>
        <span>Severity: {bug.data.severity}</span>
      </div>

      {bug.data.assignedToUserId === null && (
        <div className="mt-4">
          <select
            value={selectedDev}
            onChange={(e) => setSelectedDev(e.target.value)}
            className="border p-2 mr-2"
          >
            <option value="">Select Developer</option>
            {developers.map((dev) => (
              <option key={dev.id} value={dev.id}>
                {dev.name}
              </option>
            ))}
          </select>

          <button
            disabled={!selectedDev}
            onClick={() => bugsApi.assignBugToDeveloper(bug.data.id, selectedDev)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Assign
          </button>
        </div>
      )}

      {bug.data.attachments?.length > 0 && (
        <div>
          <h3 className="font-semibold">Attachments</h3>
          <ul>
            {bug.data.attachments.map((a: any) => (
              <li key={a.id}>
                <a href={getImageUrl(a.filePath)} target="_blank">
                  View
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BugDetailsPage;
