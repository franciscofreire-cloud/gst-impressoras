# Sistema de Controle Patrimonial de Impressoras - PCCE

Este é um sistema desenvolvido para a Polícia Civil do Ceará (PCCE) para gerenciar o patrimônio de impressoras, monitorar a coleta de dados e centralizar informações de IP, SELB e números de série.

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
   - Copie o arquivo `.env.example` para um novo arquivo chamado `.env`:
     ```bash
     cp .env.example .env
     ```
   - Preencha as chaves do **Supabase** no arquivo `.env`.

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

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
