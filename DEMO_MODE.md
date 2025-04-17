# Modo de Demonstração - SysGym

Este documento explica as configurações do modo de demonstração do SysGym, implementado para facilitar a visualização do sistema sem a necessidade de credenciais de acesso.

## Funcionalidades do Modo de Demonstração

- **Acesso Automático**: O sistema detecta automaticamente quando está sendo executado em ambiente de demonstração (Vercel ou ambiente de desenvolvimento) e realiza login automático.

- **Sem Tela de Login**: O usuário é redirecionado diretamente para o Dashboard ao acessar o sistema.

- **Botão de Login Simplificado**: Caso o usuário seja redirecionado para a tela de login, um único botão permite acesso imediato ao sistema sem a necessidade de credenciais.

- **Sem Logout**: O botão de logout foi removido e substituído por um indicador de "Modo de Demonstração" para evitar que visitantes saiam acidentalmente do sistema.

- **Acesso Administrativo**: O usuário de demonstração tem privilégios de administrador, permitindo visualizar todas as funcionalidades do sistema.

## Como Funciona

O modo de demonstração é ativado automaticamente quando:

1. O site está hospedado em um domínio Vercel (\*.vercel.app)
2. O ambiente é de desenvolvimento (NODE_ENV=development)

Nestes casos, o sistema:

- Usa um usuário pré-configurado com perfil de administrador
- Mantém o acesso ativo durante toda a sessão
- Permite a navegação em todas as áreas do sistema

## Usuário de Demonstração

Os detalhes do usuário de demonstração são:

- **Nome**: Usuário Demo
- **Email**: admin@demo.com
- **Perfil**: Administrador

Este usuário tem acesso completo a todas as funcionalidades, incluindo:

- Dashboard
- Gestão de Alunos
- Treinos
- Gestão Financeira
- Relatórios
- Gerenciamento de Usuários

## Personalização da Interface

Em modo de demonstração, a interface apresenta:

- Um indicador "Modo de Demonstração" no rodapé da barra lateral
- Uma mensagem explicativa na tela de login (caso o usuário seja redirecionado para ela)
- Acesso a todas as funcionalidades sem restrições de permissão

## Para Desenvolvedores

Se você está fazendo um fork deste projeto e deseja modificar o comportamento do modo de demonstração, os principais arquivos a serem verificados são:

- `src/App.js`: Contém a lógica de detecção do modo de demonstração e auto-login
- `src/components/Login.js`: Interface simplificada de login
- `src/components/Sidebar.js`: Remove o botão de logout e adiciona o indicador de demonstração
- `src/data/users.js`: Contém o usuário de demonstração pré-configurado

Para desativar o modo de demonstração em desenvolvimento local, você pode modificar a função `isDemoMode()` em `src/App.js` e `src/components/Sidebar.js`.
