# EduVaga

Rede social focada em divulgação de vagas educacionais.

## Tecnologias

### Frontend
- Vue.js 3, TypeScript, Vue Router, Vite

### Backend
- Node.js, TypeScript, Express.js, Prisma ORM, JWT, bcryptjs, Cloudinary, Nodemailer

### Banco de Dados
- SQLite via Prisma

## Como Executar

### Backend
cd backend
npm install
npx prisma migrate dev
npm run dev
Servidor em: http://localhost:3000

### Frontend
cd frontend
npm install
npm run dev
Frontend em: http://localhost:5173

## Funcionalidades
- Cadastro e login com JWT
- Feed com filtros por modalidade e nivel
- Criar, editar e excluir posts
- Curtir e descurtir publicacoes
- Comentar posts
- Seguir e deixar de seguir usuarios
- Perfil com foto, bio e seguidores
- Upload de avatar via Cloudinary
- Recuperacao de senha por e-mail

## Autor
Desenvolvido por Everton Correia - Desafio de Rede Social
