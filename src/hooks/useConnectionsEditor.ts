import { useEffect, useState } from 'react';
import { CONNECTION_LABEL_MAX_LENGTH, MAX_CONNECTIONS, VR_MESSAGES } from '../constants/points';
import { listPoints, updatePoint } from '../services/points';
import type { Point, PointConnection } from '../types';
import { apiErrorMessage } from '../utils/apiError';

const EMPTY_ROW: PointConnection = { target_slug: '', label: '', yaw_degrees: 0 };

function isComplete(row: PointConnection): boolean {
  const label = row.label.trim();
  return row.target_slug !== '' && label.length > 0 && label.length <= CONNECTION_LABEL_MAX_LENGTH;
}

/** Destinos possiveis: todos os pontos, menos o proprio. */
function useTargets(pointId: string) {
  const [targets, setTargets] = useState<Point[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    listPoints()
      .then((points) => {
        if (active) setTargets(points.filter((item) => item.id !== pointId));
      })
      .catch((err: unknown) => {
        if (active) setLoadError(apiErrorMessage(err));
      });
    return () => {
      active = false;
    };
  }, [pointId]);

  return { targets, loadError };
}

/** Lista de conexoes do ponto (modo VR); grava tudo de uma vez no botao "Salvar conexoes". */
export function useConnectionsEditor(point: Point, onSaved: (point: Point) => void) {
  const { targets, loadError } = useTargets(point.id);
  const [rows, setRows] = useState<PointConnection[]>(() => point.connections);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function change(index: number, changes: Partial<PointConnection>) {
    setNotice(null);
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...changes } : row)));
  }

  /** Troca o destino; o rotulo acompanha o nome do destino enquanto nao for editado. */
  function setTarget(index: number, slug: string) {
    const row = rows[index];
    const nameOf = (value: string) => targets.find((item) => item.slug === value)?.name ?? '';
    const keepLabel = row.label !== '' && row.label !== nameOf(row.target_slug);
    change(index, { target_slug: slug, label: keepLabel ? row.label : nameOf(slug) });
  }

  async function save() {
    setError(null);
    setNotice(null);
    if (!rows.every(isComplete)) {
      setError(VR_MESSAGES.connectionIncomplete);
      return;
    }
    setBusy(true);
    try {
      const connections = rows.map((row) => ({ ...row, label: row.label.trim() }));
      const saved = await updatePoint(point.id, { connections });
      setRows(saved.connections);
      onSaved(saved);
      setNotice(VR_MESSAGES.connectionsSaved);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return {
    rows,
    targets,
    busy,
    error: error ?? loadError,
    notice,
    limitReached: rows.length >= MAX_CONNECTIONS,
    add: () => {
      setRows((current) => [...current, EMPTY_ROW]);
    },
    remove: (index: number) => {
      setRows((current) => current.filter((_, i) => i !== index));
    },
    setTarget,
    setLabel: (index: number, label: string) => {
      change(index, { label });
    },
    setYaw: (index: number, yaw: number) => {
      change(index, { yaw_degrees: yaw });
    },
    save,
  };
}

export type ConnectionsEditorState = ReturnType<typeof useConnectionsEditor>;
