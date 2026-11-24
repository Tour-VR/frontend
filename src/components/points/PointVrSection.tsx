import type { Point } from '../../types';
import { ConnectionsEditor } from './ConnectionsEditor';
import { PanoramaField } from './PanoramaField';

interface PointVrSectionProps {
  point: Point;
  onSaved: (point: Point) => void;
}

/** Secao "Modo VR" da edicao do ponto (plano 019): panorama 360° e conexoes. */
export function PointVrSection({ point, onSaved }: PointVrSectionProps) {
  return (
    <section
      aria-labelledby="vr-title"
      className="mt-6 max-w-3xl space-y-6 rounded-lg border border-gray-200 bg-white p-6"
    >
      <h2 id="vr-title" className="text-lg font-semibold text-gray-900">
        Modo VR
      </h2>
      <PanoramaField point={point} onSaved={onSaved} />
      <ConnectionsEditor point={point} onSaved={onSaved} />
    </section>
  );
}
