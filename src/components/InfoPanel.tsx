import type { SelectedObject } from '../types';

interface InfoPanelProps {
  selectedObject: SelectedObject;
  onClose: () => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ selectedObject, onClose }) => {
  if (!selectedObject) return null;

  return (
    <div className="info-panel">
      <button className="close-button" onClick={onClose}>X</button>
      <h2>{selectedObject.name}</h2>
      <p>{selectedObject.description}</p>
      {selectedObject.diameterKm && <p>Diameter: {selectedObject.diameterKm.toLocaleString()} km</p>}
      <h3>Fun Facts:</h3>
      <ul>
        {selectedObject.funFacts.map((fact, index) => (
          <li key={index}>{fact}</li>
        ))}
      </ul>
    </div>
  );
};

export default InfoPanel;
