"use client";

type Props = { cores: string[] };

export default function MapaIgreja({ cores }: Props) {
  const rooms = [
    { id: 1, label: '1', x: 45, y: 35, w: 205, h: 92 },
    { id: 1, label: '1', x: 45, y: 137, w: 205, h: 82 },
    { id: 2, label: '2', x: 260, y: 35, w: 245, h: 92 },
    { id: 2, label: '2', x: 260, y: 137, w: 245, h: 82 },
    { id: 3, label: '3', x: 520, y: 35, w: 205, h: 92 },
    { id: 3, label: '3', x: 520, y: 137, w: 205, h: 82 },
    { id: 4, label: '4', x: 45, y: 245, w: 205, h: 115 },
    { id: 5, label: '5', x: 45, y: 385, w: 330, h: 230 },
    { id: 6, label: '6', x: 400, y: 245, w: 170, h: 145 },
    { id: 6, label: '6', x: 400, y: 405, w: 170, h: 120 },
    { id: 7, label: '7', x: 610, y: 245, w: 285, h: 280 },
    { id: 7, label: '7', x: 610, y: 545, w: 285, h: 70 },
  ];
  return <svg viewBox="0 0 940 650" style={{ width: '100%', height: 'min(58vh, 520px)', display: 'block' }} role="img" aria-label="Planta estilizada da igreja com regiões dos discipulados"><title>Planta da igreja colorida por discipulado</title><rect x="20" y="15" width="900" height="620" rx="8" fill="#0b1228" stroke="#dbeafe" strokeWidth="5" /><g>{rooms.map((room, index) => <g key={`${room.id}-${index}`}><rect x={room.x} y={room.y} width={room.w} height={room.h} fill={cores[room.id - 1]} fillOpacity=".82" stroke="#dbeafe" strokeWidth="3" style={{ transition: 'fill 1s, fill-opacity 1s', filter: `drop-shadow(0 0 7px ${cores[room.id - 1]})` }} /><text x={room.x + room.w / 2} y={room.y + room.h / 2 + 8} textAnchor="middle" fill="#fff" fontSize="24" fontWeight="800" style={{ paintOrder: 'stroke', stroke: '#111827', strokeWidth: 5 }}>{room.label}</text></g>)}</g><rect x="395" y="535" width="175" height="80" fill={cores[5]} fillOpacity=".82" stroke="#dbeafe" strokeWidth="3" /><text x="482" y="580" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700">PÁTIO</text><text x="208" y="500" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800" style={{ paintOrder: 'stroke', stroke: '#111827', strokeWidth: 5 }}>TEMPLO</text><text x="482" y="330" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700" style={{ paintOrder: 'stroke', stroke: '#111827', strokeWidth: 5 }}>BANHEIROS</text><text x="752" y="375" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800" style={{ paintOrder: 'stroke', stroke: '#111827', strokeWidth: 5 }}>SALÃO</text></svg>;
}
