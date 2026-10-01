import { NextRequest, NextResponse } from 'next/server';

const telas = new Set(['entrada', 'mesario', 'configurar-urna', 'apuracao', 'grafico']);

export function middleware(request: NextRequest) {
  const partes = request.nextUrl.pathname.split('/').filter(Boolean);
  const cidade = partes[0];
  const tela = partes[1];

  if ((cidade === 'jatai' || cidade === 'goiania') && tela && telas.has(tela)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${tela}`;
    url.searchParams.set('cidade', cidade);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/jatai/:path*', '/goiania/:path*'],
};
