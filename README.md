# Sistema de Controle Patrimonial de Impressoras - PCCE

Este é um sistema desenvolvido para gerenciar o patrimônio de impressoras, monitorar a coleta de dados e centralizar informações de IP, SELB e números de série.

## Tecnologias Utilizadas

- **React** com **TypeScript**
- **Vite** para o build system
- **Tailwind CSS** para estilização
- **Supabase** para backend e autenticação
- **Lucide React** para ícones
- **XLSX** para exportação/importação de dados
- **Recharts** para o dashboard

## Como Executar o Projeto

1. **Clone o repositório:**
   ```bash
   git clone [url-do-repositorio]
   cd selbetti---sistema-de-controle-patrimonial-de-impressoras
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   - Crie um arquivo chamado `.env.local` na raiz do projeto.
   - Adicione as seguintes chaves com seus respectivos valores do Supabase:
     ```env
     VITE_SUPABASE_URL=sua-url-do-supabase
     VITE_SUPABASE_ANON_KEY=sua-chave-anon-do-supabase
     ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## Deploy na Vercel

O projeto está pronto para ser hospedado na **Vercel**. Para fazer o deploy:

1. Importe o repositório do GitHub na Vercel.
2. Nas configurações de **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. A Vercel detectará automaticamente o framework (Vite) e o comando de build (`npm run build`).

## Segurança

O arquivo `.env` está incluído no `.gitignore` para garantir que chaves sensíveis não sejam enviadas ao repositório público. **Nunca compartilhe as chaves do Supabase em commits.**

## Funcionalidades

- Dashboard com métricas de monitoramento.
- Inventário de impressoras com visualização em lista e grade.
- Cadastro e edição de ativos.
- Importação em massa via planilha Excel.
- Backup de dados (Exportação para Excel).
- Gestão de acessos (Administradores e Usuários).
- Trilha de auditoria (Histórico de alterações).
