import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  className?: string;
}

/** Icone de carregamento girando. */
export function Spinner({ className = 'h-5 w-5' }: SpinnerProps) {
  return <Loader2 aria-label="Carregando" role="img" className={`animate-spin ${className}`} />;
}
