import NationalSecurityActDocument from './NationalSecurityActDocument';
import RoswellIncident1Document from './RoswellIncident1Document';
import TechnicalDiagramDocument from './TechnicalDiagramDocument';

export default function NewlyDeclassifiedDocs() {
  return (
    <div className="p-4 space-y-8 bg-neutral-900 overflow-auto">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="transform scale-90 origin-top mx-auto"><NationalSecurityActDocument /></div>
        <div className="transform scale-90 origin-top mx-auto"><RoswellIncident1Document /></div>
        <div className="transform scale-90 origin-top mx-auto"><TechnicalDiagramDocument /></div>
      </div>
    </div>
  );
}
