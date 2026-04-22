import type { SelectedObject } from '../types';

interface InfoPanelProps {
  selectedObject: SelectedObject;
  language: 'en' | 'ur';
  onClose: () => void;
  onLaunchNuke: (targetName: string) => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ selectedObject, language, onClose, onLaunchNuke }) => {
  if (!selectedObject) return null;

  const isUrdu = language === 'ur';

  return (
    <div className={`info-panel ${isUrdu ? 'rtl' : ''}`}>
      <button className="close-button" onClick={onClose}>X</button>
      <h2>{isUrdu ? selectedObject.nameUrdu : selectedObject.name}</h2>
      <p>{isUrdu ? selectedObject.descriptionUrdu : selectedObject.description}</p>
      
      {'diameterKm' in selectedObject && selectedObject.diameterKm && (
        <p>{isUrdu ? 'قطر' : 'Diameter'}: {selectedObject.diameterKm.toLocaleString()} km</p>
      )}

      <h3>{isUrdu ? 'دلچسپ حقائق:' : 'Fun Facts:'}</h3>
      <ul>
        {(isUrdu ? selectedObject.funFactsUrdu : selectedObject.funFacts).map((fact, index) => (
          <li key={index}>{fact}</li>
        ))}
      </ul>

      <button 
        className="nuke-button" 
        onClick={() => onLaunchNuke(selectedObject.name)}
        style={{ 
          marginTop: '20px', 
          padding: '10px 20px', 
          backgroundColor: '#ff4444', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer',
          fontWeight: 'bold',
          width: '100%'
        }}
      >
        {isUrdu ? 'نیوک ماریں!' : 'LAUNCH NUKE!'} 🚀
      </button>
    </div>
  );
};

export default InfoPanel;
