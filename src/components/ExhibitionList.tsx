import React, { useState } from "react";
import { useExhibition } from "./ExhibitionContext";
import { Link } from "react-router-dom";

const ExhibitionList: React.FC = () => {
  const { exhibitions, createNewExhibition } = useExhibition();
  const [newExhibitionName, setNewExhibitionName] = useState("");

  const handleCreateExhibition = () => {
    if (newExhibitionName.trim()) {
      createNewExhibition(newExhibitionName);
      setNewExhibitionName("");
    }
  };

  return (
    <div className="exhibition-list">
      <h2>Exhibitions</h2>
      <div>
        <input
          type="text"
          value={newExhibitionName}
          onChange={(e) => setNewExhibitionName(e.target.value)}
          placeholder="Enter exhibition name"
        />
        <button onClick={handleCreateExhibition}>Create New Exhibition</button>
      </div>
      {exhibitions.length === 0 ? (
        <p>No exhibitions created yet.</p>
      ) : (
        <ul>
          {exhibitions.map((exhibition) => (
            <li key={exhibition.id}>
              <Link to={`/exhibitions/${exhibition.id}`}>
                {exhibition.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExhibitionList;
