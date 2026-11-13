interface QrDownloadLinkProps {
  dataUrl: string;
  slug: string;
}

/** Link que salva o QR Code do ponto como `qr-<slug>.png`. Some na impressao. */
export function QrDownloadLink({ dataUrl, slug }: QrDownloadLinkProps) {
  return (
    <a
      href={dataUrl}
      download={`qr-${slug}.png`}
      className="mt-4 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 print:hidden"
    >
      Baixar PNG
    </a>
  );
}
