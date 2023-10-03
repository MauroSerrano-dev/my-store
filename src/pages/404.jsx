import Link from 'next/link';

export default function Custom404() {
    return (
        <div>
            <h1>404 - Página não encontrada</h1>
            <p>A página que você está procurando não foi encontrada.</p>
            <Link href="/">
                Voltar para a página inicial
            </Link>
        </div>
    );
}