const localeStorageKey = 'otsugua.locale.preference';
const supportedLocales = ['en', 'pt-BR'];
const untranslatedSelector = 'script, style, svg, canvas, code, pre, [data-no-localize]';
const originalAttributes = new WeakMap();

const ptBR = {
    'Otsugua, the portfolio of Guilherme Augusto. Full-stack Laravel work with technical notes and clean presentation.': 'Otsugua, o portfólio de Guilherme Augusto. Trabalho full-stack em Laravel com notas técnicas e apresentação limpa.',
    'Switch language to Brazilian Portuguese': 'Mudar idioma para português do Brasil',
    'Switch language to English': 'Mudar idioma para inglês',
    'Current language: English. Switch to Brazilian Portuguese': 'Idioma atual: inglês. Mudar para português do Brasil',
    'Idioma atual: português do Brasil. Mudar para inglês': 'Idioma atual: português do Brasil. Mudar para inglês',
    Projects: 'Projetos',
    Contact: 'Contato',
    'You can find me here': 'Você pode me encontrar aqui',
    'Laravel / Product engineering / Full-stack': 'Laravel / Engenharia de produtos / Full-stack',
    "Hi! I'm Guilherme Augusto, a full-stack Laravel developer who designs software around principles that keep products clear, testable, and coherent as they grow.": 'Olá! Sou Guilherme Augusto, desenvolvedor full-stack de Laravel que constrói software a partir de princípios que mantêm produtos claros, testáveis e coerentes enquanto crescem.',
    'How I work': 'Como eu construo',
    'Current Focus': 'Foco atual',
    'Thinking / Building': 'Pensando / Construindo',
    'Agentic development': 'Desenvolvimento com agentes',
    'I am studying how agent loops, scoped delegation, and acceptance-driven workflows keep AI-assisted product work inspectable instead of noisy.': 'Estou estudando como ciclos de agentes, delegação bem delimitada e fluxos guiados por critérios de aceite mantêm o trabalho de produto com IA inspecionável ao invés de "ruidoso" (baixa legibilidade).',
    Theory: 'Teoria',
    'Building effective agents': 'Construindo agentes efetivos',
    Repository: 'Repositório',
    'Capability demonstrations': 'Demonstrações de capacidade',
    'Here’s How I Shape Products': 'Como Estruturo Produtos',
    'Pricing / Finance capability demo': 'Demo de Pricing / Finanças',
    'Harbor Ledger': 'Harbor Ledger',
    'A release-control workspace for finance teams where settlement reviews, approval paths, exception handling, and treasury sign-off have to stay precise before funds move.': 'Um workspace de controle de liberação para equipes financeiras, onde revisão de liquidação, caminhos de aprovação, tratamento de exceções e aceite de tesouraria precisam permanecer precisos antes de qualquer movimentação.',
    'Executable rules': 'Regras executáveis',
    'Scenario coverage': 'Cobertura de cenários',
    'Approval flow': 'Fluxo de aprovação',
    'Design Notes': 'Notas de design',
    'Hide note': 'Ocultar nota',
    'TDD keeps this finance workspace dependable by making approval rules, exception paths, and verification states explicit before anyone trusts the release flow, following Kent Beck\'s test-first discipline from his book By Example (2002).': 'TDD mantém esse workspace financeiro confiável ao tornar explícitas as regras de aprovação, caminhos de exceção e estados de verificação antes que alguém confie no fluxo de liberação, seguindo a disciplina test-first de Kent Beck no seu livro By Example (2002).',
    'Principle:': 'Princípio:',
    'Test Driven Development': 'Test Driven Development',
    'Learning operations capability demo': 'Demo de operações educacionais',
    'Northline Learning Ops': 'Northline Learning Ops',
    'A learning operations platform built around shared domain language, teacher-facing views, and coordinated classroom support workflows.': 'Uma plataforma de operações educacionais construída em torno de linguagem de domínio compartilhada, experiência dos professores e fluxos coordenados e manejo de turmas.',
    'Shared language': 'Linguagem compartilhada',
    'Teacher views': 'Visões do professor',
    'Classroom support': 'Suporte em sala',
    'DDD keeps this learning operations slice coherent by giving attendance, assessment, and classroom follow-up work a shared language across teacher-facing views, in the spirit of Eric Evans in his book Domain-Driven Design (2003).': 'DDD mantém essa interface de operações educacionais coerente ao dar uma linguagem compartilhada para presença, avaliações e acompanhamento de sala nas visões do professor, no espírito de Eric Evans no seu livro Domain-Driven Design (2003).',
    'Domain Driven Design': 'Domain Driven Design',
    'Creative studio portal capability demo': 'Demo de portal de estúdio criativo',
    'Studio Current': 'Studio Current',
    'A branded client portal for creative review, approval, and delivery.': 'Um portal de cliente com branding próprio para revisão criativa, aprovação e entrega.',
    'Review cycles': 'Revisões em rodadas',
    'Asset delivery': 'Entrega de assets',
    'Brand feedback': 'Feedback de marca',
    'The Portal': 'O Portal',
    Workspaces: 'Espaços',
    'Interaction design shapes this portal by using feedback cues and review moments to guide clients through approvals without adding friction, following a product-minded approach to digital interaction.': 'Design de interação molda esse portal ao usar sinais de feedback e momentos de revisão para guiar clientes por aprovações sem adicionar atrito, seguindo uma abordagem de produto para interação digital.',
    'Interaction Design': 'Design de interação',
    'Review Queue': 'Fila de revisão',
    'Compliance Workbench v2.4': 'Workbench de compliance v2.4',
    Active: 'Ativos',
    '14 Active': '14 ativos',
    '2m ago': 'há 2min',
    '14m ago': 'há 14min',
    '42m ago': 'há 42min',
    'Search batch or ID...': 'Buscar lote ou ID...',
    Flagged: 'Sinalizado',
    FLAGGED: 'SINALIZADO',
    Pending: 'Pendente',
    PENDING: 'PENDENTE',
    Error: 'Erro',
    ERROR: 'ERRO',
    'System Trace': 'Rastro do sistema',
    'Sync and event logs for the current workbench state': 'Sincronização e logs de evento do estado atual do workbench',
    'Transaction': 'Transação',
    'High Risk Review': 'Revisão de alto risco',
    'HIGH RISK REVIEW': 'REVISÃO DE ALTO RISCO',
    'PENDING REVIEW': 'REVISÃO PENDENTE',
    'SETTLEMENT ERROR': 'ERRO DE LIQUIDAÇÃO',
    'TRANSACTION #TRX-9902 HIGH RISK REVIEW': 'TRANSAÇÃO #TRX-9902 REVISÃO DE ALTO RISCO',
    Initiated: 'Iniciado',
    'Initiated 2023-10-27 08:14:02': 'Iniciado em 2023-10-27 08:14:02',
    Agent: 'Agente',
    'Agent: Sarah Ross': 'Agente: Sarah Ross',
    Source: 'Fonte',
    'Source: NORTH-04': 'Fonte: NORTH-04',
    'Asset Value': 'Valor do ativo',
    Currency: 'Moeda',
    Counterparty: 'Contraparte',
    'Risk Score': 'Pontuação de risco',
    'Request Docs': 'Requisitar docs',
    'REQUEST DOCS': 'REQUISITAR DOCS',
    Approve: 'Aprovar',
    APPROVE: 'APROVAR',
    'Compliance Lead': 'Líder de compliance',
    'Flagged for manual review due to unexpected volume from NORTH-04 terminal. Historical daily average is $120k. This release is $450k.': 'Sinalizado para revisão manual devido ao volume inesperado vindo do terminal NORTH-04. A média diária histórica é US$120 mil. Esta liberação é de US$450 mil.',
    'System: AML check completed. No hits found on sanctioned entities list for HSBC_LONDON_VAULT.': 'Sistema: verificação AML concluída. Nenhuma ocorrência encontrada na lista de entidades sancionadas para HSBC_LONDON_VAULT.',
    'Audit Officer': 'Auditor',
    'Operations Associate': 'Associado de operações',
    'Settlement Supervisor': 'Supervisor de liquidação',
    'Verified with North-04 desk manager. They confirmed this is a quarterly rebalancing event. Documents uploaded to the batch summary. Safe to proceed once treasury signs off.': 'Verificado com o gerente da mesa North-04. Eles confirmaram que este é um evento trimestral de rebalanceamento. Documentos enviados ao resumo do lote. Seguro prosseguir após aceite da tesouraria.',
    'Verified with North-04 desk manager. They confirmed this is a quarterly rebalancing event. Documents uploaded to the batch summary. Safe to proceed.': 'Verificado com o gerente da mesa North-04. Eles confirmaram que este é um evento trimestral de rebalanceamento. Documentos enviados ao resumo do lote. Seguro prosseguir.',
    'Treasury requested a tighter approval chain because the receiving desk changed within the last 30 days.': 'A tesouraria solicitou uma cadeia de aprovação mais rígida porque a mesa recebedora mudou nos últimos 30 dias.',
    'Queued for secondary review while Zurich confirms vault transfer sequencing. No anomaly detected yet, but the release cannot move until the handoff reference is reconciled.': 'Enfileirado para revisão secundária enquanto Zurich confirma a sequência da transferência de custódia. Nenhuma anomalia detectada ainda, mas a liberação não pode avançar até a referência de handoff ser reconciliada.',
    'Reviewed the routing notes. This one looks operational rather than suspicious. Leave it pending until the Zurich desk returns the missing settlement reference.': 'Revisei as notas de roteamento. Este caso parece operacional, não suspeito. Deixe pendente até a mesa de Zurich retornar a referência de liquidação ausente.',
    'System: Settlement failed after the receiving ledger rejected the destination hash. Automatic retry disabled until manual confirmation is attached.': 'Sistema: a liquidação falhou depois que o ledger recebedor rejeitou o hash de destino. Retentativa automática desativada até a confirmação manual ser anexada.',
    'This is a hard stop. The destination wallet reference differs from the approved instruction set. Freeze release until treasury signs off on a corrected settlement target.': 'Este é um bloqueio total. A referência da carteira de destino difere do conjunto de instruções aprovado. Congele a liberação até a tesouraria aprovar um destino de liquidação corrigido.',
    'Audit has logged the exception under the batch event trail. No release action should proceed until the corrected destination appears in both the approval memo and the ledger packet.': 'A auditoria registrou a exceção na trilha de eventos do lote. Nenhuma ação de liberação deve prosseguir até que o destino corrigido apareça no memorando de aprovação e no pacote do ledger.',
    'Show review queue': 'Mostrar fila de revisão',
    'Hide review queue': 'Ocultar fila de revisão',
    'Show batch summary': 'Mostrar resumo do lote',
    'Hide batch summary': 'Ocultar resumo do lote',
    'Add commentary or tag a teammate...': 'Adicionar comentário ou marcar colega...',
    Send: 'Enviar',
    SEND: 'ENVIAR',
    Summary: 'Resumo',
    'Batch Summary': 'Resumo do lote',
    'Batch Health': 'Saúde do lote',
    'Verification Rate': 'Taxa de verificação',
    Approved: 'Aprovado',
    Waiting: 'Aguardando',
    'Total Batch Value': 'Valor total do lote',
    'USD equivalent': 'Equivalente em USD',
    'Audit Documents': 'Documentos de auditoria',
    'Upload Proof': 'Enviar comprovante',
    '+ UPLOAD PROOF': '+ ENVIAR COMPROVANTE',
    'Execute Batch': 'Executar lote',
    'EXECUTE BATCH': 'EXECUTAR LOTE',
    'FREEZE ALL': 'CONGELAR TUDO',
    'Teacher Workspace': 'Área do professor',
    'Live Roster': 'Turma ao vivo',
    Dashboard: 'Painel',
    Classes: 'Turmas',
    Documents: 'Documentos',
    Exams: 'Provas',
    Students: 'Alunos',
    'Find student or class...': 'Buscar aluno ou turma...',
    'Class A': 'Turma A',
    'Class B': 'Turma B',
    'Class C': 'Turma C',
    'World History Seminar': 'Seminário de História Mundial',
    'Modern European History': 'História Europeia Moderna',
    'Civic Thought & Revolutions': 'Pensamento Cívico & Revoluções',
    'Return Northline to the dashboard': 'Voltar Northline ao painel',
    'Teacher workspace': 'Área do professor',
    Notifications: 'Notificações',
    "Teacher's Task & Grading Center": 'Central de tarefas do professor',
    'Class management, grading activity, and classroom follow-up for the current seminar.': 'Gestão da turma, correções e acompanhamento da sala para o seminário atual.',
    'Grading & Submission Status': 'Status de correção e entregas',
    'Midterm Paper': 'Trabalho bimestral',
    'Pending Grade': 'Correções pendentes',
    '68% reviewed': '68% revisado',
    '68% done': '68% concluído',
    'Late Submits': 'Atrasadas',
    'Follow-up ready': 'Análise pronta',
    'Due Soon': 'Próximas',
    'Due soon': 'Próximas',
    'DUE SOON': 'VENCE EM BREVE',
    'Planning active': 'Planejamento ativo',
    'Checks OK': 'Checks OK',
    'Check-ins to review': 'Consultas para revisar',
    'Go to alerts': 'Ir para alertas',
    'Teacher Workflow Actions': 'Ações de fluxo do professor',
    'Post Materials': 'Publicar materiais',
    'Create Exam': 'Criar prova',
    'Bulk Grading': 'Correção em lote',
    'Bulk grading': 'Correção em lote',
    'Class Message': 'Mensagem para turma',
    'Class message': 'Mensagem para turma',
    'Actionable Items': 'Itens acionáveis',
    'Pending Grading Queue': 'Fila de correções',
    '1 item to review': '1 item para revisar',
    '2 items to review': '2 itens para revisar',
    '24h left': '24h restantes',
    '24h Left': '24h restantes',
    '24H LEFT': '24H RESTANTES',
    '18 students remaining': '18 alunos restantes',
    'Debate Reflection': 'Reflexão sobre debate',
    'Review 4pm': 'Revisar 16h',
    '9 students remaining': '9 alunos restantes',
    'Upcoming Class Events': 'Próximos eventos da turma',
    'Next 7 days': 'Próximos 7 dias',
    'Outline Review Conference': 'Conferência de revisão do roteiro',
    Today: 'Hoje',
    'Feedback tables open after the seminar.': 'Tabelas de feedback abrem após o seminário.',
    'Primary Source Packet': 'Pacote de fontes primárias',
    Tomorrow: 'Amanhã',
    'Share the annotated packet before tomorrow morning.': 'Compartilhe o pacote anotado antes de amanhã de manhã.',
    'Student Check-ins': 'Consultas | Turma',
    'Student Check-Ins': 'Consultas | Turma',
    'STUDENT CHECK-INS': 'CONSULTAS | TURMA',
    'Attendance Update': 'Presença',
    'Attendance update': 'Presença',
    'ATTENDANCE UPDATE': 'PRESENÇA',
    '12m ago': 'há 12min',
    'Leo Grant may need a check-in': 'Leo Grant pode precisar de uma consulta',
    'LEO GRANT MAY NEED A CHECK-IN': 'LEO GRANT PODE PRECISAR DE UMA CONSULTA',
    'Participation slipped this week. A quick follow-up is recommended.': 'A participação caiu esta semana. Um acompanhamento rápido é recomendado.',
    'Participation slipped this week. A quick follow-up after class would help confirm whether support is needed.': 'A participação caiu esta semana. Um acompanhamento rápido após a aula ajudaria a confirmar se há necessidade de suporte.',
    'Draft Reminder': 'Rascunho',
    'Draft reminder': 'Rascunho',
    'DRAFT REMINDER': 'RASCUNHO',
    '1h ago': 'há 1h',
    '1H AGO': 'HÁ 1H',
    'Outline follow-up ready': 'Retorno pronto para checagem manual',
    'OUTLINE FOLLOW-UP READY': 'RETORNO PRONTO PARA CHECAGEM MANUAL',
    'Five students still need outline feedback before tomorrow morning. A short class message would catch them all at once.': 'Cinco alunos ainda precisam de feedback no roteiro antes de amanhã de manhã. Uma mensagem curta para a turma alcançaria todos de uma vez.',
    'Review check-ins': 'Revisar consultas',
    'Review Check-Ins': 'Revisar consultas',
    'REVIEW CHECK-INS': 'REVISAR CONSULTAS',
    'Classroom Reach': 'Alcance da turma',
    Steady: 'Estável',
    'One class may need a quick check-in.': 'Uma turma pode precisar de uma consulta rápida.',
    '148 present today': '148 presentes hoje',
    '9 check-ins suggested': '9 consultas sugeridas',
    'Assessment pacing, materials, and classroom support for the current history block.': 'Ritmo de avaliações, materiais e suporte em sala para o bloco atual.',
    'Current-class planning, grading, and student support for civic history work.': 'Planejamento, correção e apoio aos alunos para história cívica.',
    '54% done': '54% concluído',
    '59% done': '59% concluído',
    'Comparison Essay': 'Ensaio comparativo',
    'Manifesto Essay': 'Ensaio manifesto',
    '11 students remaining': '11 alunos restantes',
    '13 students remaining': '13 alunos restantes',
    'Needs one note on argument structure.': 'Precisa de uma nota sobre estrutura do argumento.',
    'Needs one note on evidence balance.': 'Precisa de uma nota sobre equilíbrio das evidências.',
    'Submitted 21m ago': 'Enviado há 21min',
    'Submitted 9m ago': 'Enviado há 9min',
    'Constitutional reform and public protest': 'Reforma constitucional e protesto público',
    'Constitutional reform and public protest kept pushing each other forward during the period.': 'Reforma constitucional e protesto público seguiram impulsionando um ao outro no período.',
    'My main point is that reform lasted when protest made it impossible to ignore.': 'Meu ponto principal é que a reforma durou quando o protesto a tornou impossível de ignorar.',
    'I should connect the two case studies more clearly in the final paragraph.': 'Devo conectar os dois estudos de caso com mais clareza no parágrafo final.',
    'Manifesto response on civic responsibility': 'Resposta do manifesto sobre responsabilidade cívica',
    'The manifesto presents responsibility as an action, not just a feeling.': 'O manifesto apresenta responsabilidade como ação, não apenas sentimento.',
    'I focused on how duty changes once it is tied to local organizing and public conflict.': 'Foquei em como o dever muda quando se liga à organização local e ao conflito público.',
    'The closing example should connect the evidence back to civic responsibility more directly.': 'O exemplo final deve reconectar as evidências à responsabilidade cívica de forma mais direta.',
    'Reading Brief Release': 'Envio do resumo de leitura',
    'Prep note for the reform seminar goes out this evening.': 'Nota de preparo para o seminário de reforma sai hoje à noite.',
    'Discussion Circle Setup': 'Configuração dos círculos',
    'Seat groups need the final prompt sheet before first period.': 'Grupos precisam da folha final antes do primeiro período.',
    'Discussion Prep Sheet': 'Folha de preparo',
    'Share before the revolutions roundtable opens.': 'Compartilhe antes da mesa sobre revoluções abrir.',
    'Outline Window Opens': 'Janela do roteiro abre',
    'Students can start submitting evidence plans tomorrow morning.': 'Alunos podem enviar planos de evidências amanhã de manhã.',
    'Reading follow-up': 'Retorno de leitura',
    '18m ago': 'há 18min',
    '18M AGO': 'HÁ 18MIN',
    'Archive packet reminder ready': 'Lembrete do pacote pronto',
    'Three students still need the archive packet before tomorrow. A quick class message would close the gap.': 'Três alunos ainda precisam do pacote antes de amanhã. Uma mensagem rápida fecha a lacuna.',
    '50m ago': 'há 50min',
    '50M AGO': 'HÁ 50MIN',
    'Check in with Elena Petrov': 'Checar Elena Petrov',
    'Elena has been present but quiet during the last two discussions. A soft follow-up could help.': 'Elena esteve presente, mas quieta nas duas últimas discussões. Um retorno leve pode ajudar.',
    'Participation note': 'Nota de participação',
    '16m ago': 'há 16min',
    '16M AGO': 'HÁ 16MIN',
    'Amira Noor may need a quick follow-up': 'Amira Noor pode precisar de retorno',
    'Written work is strong, but she has been quieter than usual during discussions this week.': 'A escrita está forte, mas ela ficou mais quieta que o normal nas discussões desta semana.',
    'Submission follow-up': 'Retorno de entrega',
    'Two reflection logs still missing': 'Dois registros ainda faltam',
    'A short class message would likely close the remaining reflection gap before the afternoon block.': 'Uma mensagem curta deve fechar a lacuna restante antes do bloco da tarde.',
    Strong: 'Forte',
    Watchlist: 'Atenção',
    'Most students are pacing well this week.': 'A maioria mantém bom ritmo nesta semana.',
    'A few students may need a lighter-touch reminder.': 'Alguns alunos podem precisar de um lembrete leve.',
    '121 present today': '121 presentes hoje',
    '103 present today': '103 presentes hoje',
    '4 follow-ups suggested': '4 retornos sugeridos',
    '7 follow-ups suggested': '7 retornos sugeridos',
    'Reform Brief Sheet': 'Resumo de reforma',
    'Roundtable Guide': 'Guia da mesa',
    'Discussion Guide': 'Guia de discussão',
    'Ready for class': 'Pronto para aula',
    'Ready for discussion': 'Pronto para debate',
    'Updated 42m ago': 'Atualizado há 42min',
    'Updated 25m ago': 'Atualizado há 25min',
    'Facilitator guide for the discussion circles.': 'Guia de facilitação para os círculos de discussão.',
    'Prompt sheet for the revolutions roundtable with discussion norms.': 'Folha de prompts da mesa de revoluções com normas de debate.',
    'Share with class': 'Compartilhar',
    Download: 'Baixar',
    'Replace file': 'Trocar arquivo',
    'Review Notes': 'Notas de revisão',
    'Teacher Notes': 'Notas do professor',
    'Teacher draft': 'Rascunho docente',
    'Planning draft': 'Rascunho de plano',
    'Saved 1h ago': 'Salvo há 1h',
    'Saved 45m ago': 'Salvo há 45min',
    'Seminar notes for the next lecture sequence.': 'Notas do seminário para a próxima sequência.',
    'Facilitation Note': 'Nota de facilitação',
    'Planning note for the facilitation cues and pacing.': 'Nota de plano para condução e ritmo.',
    'Industrialization Essay Check': 'Checagem do ensaio industrial',
    'Evidence Outline Check': 'Checagem do roteiro',
    'Due tomorrow morning': 'Prazo amanhã cedo',
    'Opens tomorrow': 'Abre amanhã',
    'Thesis statement and evidence plan are due in the morning.': 'Tese e plano de evidências vencem pela manhã.',
    'Evidence outlines for the manifesto essay are due in the next class block.': 'Roteiros de evidência do manifesto vencem no próximo bloco.',
    'Reminder timing is still adjustable for this class.': 'O horário do lembrete ainda pode ser ajustado.',
    'The reminder cadence can still be adjusted before publish.': 'A cadência do lembrete ainda pode ser ajustada antes de publicar.',
    'Open exam setup': 'Abrir configuração',
    'Send reminder': 'Enviar lembrete',
    'Review submissions': 'Revisar entregas',
    'Border Shift Map Check': 'Checagem do mapa',
    'Key Concepts Quiz': 'Quiz de conceitos-chave',
    'Unpublished draft': 'Rascunho não publicado',
    'Draft pending': 'Rascunho pendente',
    'Low-stakes map check for the next unit transition.': 'Checagem leve de mapa para a próxima unidade.',
    'Short quiz on civic vocabulary and reform movements.': 'Quiz curto sobre vocabulário cívico e reformas.',
    'Question pool is ready but not yet published.': 'Banco de questões pronto, mas ainda não publicado.',
    'Question prompts are saved as draft and need a publish time.': 'Prompts salvos como rascunho e precisam de horário.',
    'Create exam': 'Criar prova',
    Preview: 'Prévia',
    'Assign date': 'Definir data',
    'Present today': 'Presente hoje',
    'No late work': 'Sem atrasos',
    'Quiet in discussion': 'Quieto no debate',
    'Discussion follow-up': 'Retorno do debate',
    'A short check-in after class could help Elena rejoin the discussion flow.': 'Uma conversa rápida após a aula pode ajudar Elena a retomar o debate.',
    'A quick conversation after class would help confirm whether she needs more discussion support.': 'Uma conversa rápida após a aula ajuda a confirmar se ela precisa de apoio.',
    'Schedule check-in': 'Agendar consulta',
    'Message student': 'Mensagem ao aluno',
    'View submission': 'Ver entrega',
    'On track': 'No ritmo',
    '1 late submission': '1 entrega atrasada',
    'Reminder ready': 'Lembrete pronto',
    'Late submission': 'Entrega atrasada',
    'One archive response came in late. A quick reminder and release of feedback should be enough.': 'Uma resposta do arquivo atrasou. Lembrete rápido e feedback devem bastar.',
    'One late reflection is still open. A reminder and feedback release should keep him on pace.': 'Uma reflexão atrasada segue aberta. Lembrete e feedback devem mantê-lo no ritmo.',
    'Open roster note': 'Abrir nota da turma',
    'Creative Client Portal': 'Portal de cliente criativo',
    'Where studio work': 'Onde o estúdio',
    'meets the client': 'encontra o cliente',
    'A calm, branded space for reviewing creative proofs, approving deliveries, and moving projects forward — without the noise.': 'Um espaço calmo e com marca própria para revisar provas criativas, aprovar entregas e avançar projetos sem ruído.',
    'Request Access': 'Solicitar acesso',
    'See the portal': 'Ver o portal',
    'Built for independent studios and the clients who deserve better.': 'Criado para estúdios independentes e clientes que merecem uma experiência melhor.',
    Explore: 'Explorar',
    'Brand Identity Review': 'Revisão de Branding',
    'Asset Delivery': 'Entrega de assets',
    'Proof Approval': 'Aprovação de Assets',
    'Version Control': 'Controle de versão',
    'Client Workspaces': 'Workspaces de cliente',
    'Feedback Threads': 'Threads de feedback',
    Presentation: 'Apresentação',
    'Presentation Mode': 'Modo apresentação',
    'PRESENTATION MODE': 'MODO APRESENTAÇÃO',
    'Design Handoff': 'Handoff de design',
    'DESIGN HANDOFF': 'HANDOFF DE DESIGN',
    'Portal Branding': 'Marca do portal',
    'PORTAL BRANDING': 'MARCA DO PORTAL',
    'Round-by-round Reviews': 'Revisões em rodadas',
    'Round-by-round Review': 'Revisões em rodadas',
    'Round-by-Round Reviews': 'Revisões em rodadas',
    'Round-by-Round Review': 'Revisões em rodadas',
    'ROUND-BY-ROUND REVIEWS': 'REVISÕES EM RODADAS',
    'ROUND-BY-ROUND REVIEW': 'REVISÕES EM RODADAS',
    Review: 'Revisão',
    'Every proof,': 'Cada prova,',
    'in the right light': 'na luz certa',
    'Share creative work in a dedicated space that makes the context obvious — round number, scope, and what needs a response.': 'Compartilhe trabalho criativo em um espaço dedicado que deixa o contexto evidente: rodada, escopo e o que precisa de resposta.',
    'Round-by-round version tracking': 'Rastreamento de versões por rodada',
    'Inline comment threads per proof': 'Threads de comentários em cada prova',
    'One-click approval with audit trail': 'Aprovação em um clique com trilha de auditoria',
    'Brand Identity · Round 2': 'Branding · Rodada 2',
    'BRAND IDENTITY · ROUND 2': 'BRANDING · RODADA 2',
    'Awaiting approval': 'Aguardando aprovação',
    'Awaiting Review': 'Aguardando revisão',
    'AWAITING REVIEW': 'AGUARDANDO REVISÃO',
    'Website direction · v2 revision': 'Direção do site · revisão v2',
    'Shared 2 hours ago': 'Compartilhado há 2 horas',
    '10m ago': 'há 10min',
    '2h ago': 'há 2h',
    'SR · 2h ago': 'SR · há 2h',
    'Feedback Thread': 'Thread de feedback',
    'FEEDBACK THREAD': 'THREAD DE FEEDBACK',
    '4 replies': '4 respostas',
    '"The spacing feels wide — intentional?"': '"O espaçamento parece amplo — intencional?"',
    You: 'Você',
    '"Yes, let it breathe. Will send v4."': '"Sim, deixa respirar. Envio a v4."',
    'Reply…': 'Responder…',
    'Delivery Package': 'Pacote de entrega',
    'DELIVERY PACKAGE': 'PACOTE DE ENTREGA',
    'Files & Assets': 'Arquivos e assets',
    'Type Styles': 'Estilos tipográficos',
    'Brand Guide': 'Guia de marca',
    'Open Portal': 'Abrir portal',
    'OPEN PORTAL': 'ABRIR PORTAL',
    'Version History': 'Histórico de versões',
    'VERSION HISTORY': 'HISTÓRICO DE VERSÕES',
    'Spacing refined': 'Espaçamento refinado',
    CURRENT: 'ATUAL',
    Current: 'Atual',
    'Colour updated': 'Cor atualizada',
    'Type adjusted': 'Tipo ajustado',
    'First draft': 'Primeiro rascunho',
    'Brand Identity · Round 3': 'Branding · Rodada 3',
    'BRAND IDENTITY · ROUND 3': 'BRANDING · RODADA 3',
    'Marauder · Regular': 'Marauder · Regular',
    '"Looks exactly right — the weight feels intentional."': '"Ficou exatamente certo — o peso ficou magnífico."',
    '"Love the weight — feels considered."': '"Adorei o peso — projeta intenção."',
    comments: 'comentários',
    '3 comments': '3 comentários',
    Revise: 'Revisar',
    Delivery: 'Entrega',
    'The handoff,': 'A entrega,',
    'finally finished': 'finalmente finalizada',
    'Deliver final assets in an organized, branded package. No more email threads or shared drive confusion.': 'Entregue assets finais em um pacote organizado e com marca. Chega de threads de email e confusão em drives compartilhados.',
    'Organized file packages by project': 'Pacotes de arquivos organizados por projeto',
    'Format tagging and size summaries': 'Tags de formato e resumos de tamanho',
    'Download access managed by the studio': 'Acesso a downloads gerenciado pelo estúdio',
    Deliverables: 'Entregáveis',
    'Midnight Brand · Final': 'Midnight Brand · Final',
    'All approved': 'Tudo aprovado',
    'Logo Suite': 'Suite de logo',
    Ink: 'Tinta',
    Mist: 'Névoa',
    Stone: 'Pedra',
    Paper: 'Papel',
    Typography: 'Tipografia',
    'Brand Guidelines': 'Guia de marca',
    'Motion Assets': 'Assets de movimento',
    'Download Package': 'Baixar pacote',
    Portal: 'Portal',
    'A portal that': 'Um portal que',
    'carries your brand': 'carrega sua marca',
    'Your clients access work through a space that feels like yours — calm, considered, and free of platform noise.': 'Seus clientes acessam o trabalho por um espaço que parece seu: calmo, cuidadoso e livre de ruído de plataforma.',
    'Custom subdomain and studio branding': 'Subdomínio próprio e identidade do estúdio',
    'Real-time project status at a glance': 'Status do projeto em tempo real, de relance',
    'Invitation-only access per project': 'Acesso por convite em cada projeto',
    'Client Portal': 'Portal do cliente',
    'Active Proofs': 'Provas ativas',
    'Active proofs': 'Provas ativas',
    'Awaiting Approval': 'Aguardando aprovação',
    Delivered: 'Entregues',
    'Homepage concept shared': 'Conceito da homepage compartilhado',
    'Logo v3 approved': 'Logo v3 aprovado',
    'Brand guide delivered': 'Guia de marca entregue',
    Yesterday: 'Ontem',
    'A portal built for': 'Um portal feito para',
    'the work you care about': 'o trabalho que importa pra você',
    'Currently available to a limited number of independent studios. Access is by invitation.': 'Disponível no momento pra um número limitado de estúdios independentes. O acesso é por convite.',
    'Studio Current — Built with intention': 'Studio Current — Construído com intenção',
    'From system thinking to working software.': 'Do pensamento sistêmico ao software funcional.',
    'Laravel Certified Developer': 'Certificado Sênior de Laravel',
    'Certification for Laravel': 'Certificação para Laravel',
    'Laravel certification with a public verification record.': 'Certificação Laravel com registro público de verificação.',
    'View certificate': 'Ver certificado',
    'View online certificate': 'Ver certificado online',
    'Email copied': 'Email copiado',
    'Copy email': 'Copiar email',
    'Technical note': 'Nota técnica',
    'Hover / Tap': 'Passe / toque',
    'Project note': 'Nota do projeto',
    'Principle-led': 'Guiado por princípio',
    'All students': 'Todos os alunos',
    'Late submissions': 'Entregas atrasadas',
    'Student alerts': 'Alertas de alunos',
    'Class Materials & Documents': 'Materiais e documentos da turma',
    'Publish, replace, and share the current class materials without leaving Northline.': 'Publique, substitua e compartilhe os materiais atuais da turma sem sair do Northline.',
    'Assessment Planning': 'Planejamento de avaliações',
    'Upcoming due work for the current class.': 'Atividades próximas do prazo para a turma atual.',
    'Create, schedule, and review assessments for the current class.': 'Crie, agende e revise avaliações para a turma atual.',
    'Roster & Student Support': 'Lista e suporte aos alunos',
    'Students with late submissions for the current class, ready for a quick follow-up.': 'Alunos com entregas atrasadas na turma atual, prontos para um acompanhamento rápido.',
    'Current alerts and check-in suggestions for the selected class.': 'Alertas atuais e sugestões de consulta para a turma selecionada.',
    'Track attendance, support notes, and follow-up actions for the current class roster.': 'Acompanhe presença, notas de suporte e ações de acompanhamento da lista atual.',
    'Class roster': 'Lista da turma',
    Roster: 'Lista',
    'Roster filter': 'Filtro da lista',
    'Student support': 'Suporte ao aluno',
    'No student selected': 'Nenhum aluno selecionado',
    'Student snapshot': 'Resumo do aluno',
    'Select a student to review support details.': 'Selecione um aluno para revisar detalhes de suporte.',
    Attendance: 'Presença',
    'Late work': 'Trabalhos atrasados',
    'Next step': 'Próximo passo',
    'Open the attached document to review the full submission.': 'Abra o documento anexado para revisar a entrega completa.',
    'Submission review workbench': 'Workbench de revisão de entrega',
    'Submission Review Workbench': 'Workbench de revisão de entrega',
    'Close grading workbench': 'Fechar workbench de correção',
    'Student submission': 'Entrega do aluno',
    'Download submission': 'Baixar entrega',
    'Grade selected submission': 'Corrigir entrega selecionada',
    'Feedback note': 'Nota de feedback',
    'Add a short note': 'Adicionar uma nota curta',
    'Save draft': 'Salvar rascunho',
    'Submit grade': 'Enviar nota',
    'Grade selected submission': 'Corrigir entrega selecionada',
    Assignment: 'Atividade',
    Student: 'Aluno',
    'Submission preview': 'Prévia da entrega',
    'Pending submission': 'Entrega pendente',
    'Open document': 'Abrir documento',
    Grade: 'Nota',
    'Quick note': 'Nota rápida',
    'One clear feedback note': 'Uma nota clara de feedback',
    'Close class message composer': 'Fechar compositor de mensagem',
    Close: 'Fechar',
    'Send a message to the current class': 'Enviar uma mensagem para a turma atual',
    Subject: 'Assunto',
    Message: 'Mensagem',
    'Send to class': 'Enviar para turma',
    'Post materials': 'Publicar materiais',
    'Create exam': 'Criar prova',
};

function normalizeText(value) {
    return value.replace(/\s+/g, ' ').trim();
}

function splitBoundaryWhitespace(value) {
    return {
        leading: value.match(/^\s*/)?.[0] ?? '',
        trailing: value.match(/\s*$/)?.[0] ?? '',
    };
}

function detectVisitorLocale() {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language].filter(Boolean);
    const hasPortuguesePreference = languages.some((language) => language.toLowerCase().startsWith('pt'));
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    const isLocalHost = ['localhost', '127.0.0.1', 'twelveo-cc.test'].includes(window.location.hostname);

    if (hasPortuguesePreference || (!isLocalHost && timeZone === 'America/Sao_Paulo')) {
        return 'pt-BR';
    }

    return 'en';
}

function readStoredLocale() {
    try {
        const storedLocale = window.localStorage.getItem(localeStorageKey);

        return supportedLocales.includes(storedLocale) ? storedLocale : null;
    } catch {
        return null;
    }
}

function writeStoredLocale(locale) {
    try {
        window.localStorage.setItem(localeStorageKey, locale);
    } catch {
        // Ignore storage failures; the in-memory switch still works.
    }
}

function getOriginalText(node) {
    if (node.__otsuguaOriginalText === undefined) {
        node.__otsuguaOriginalText = node.nodeValue;
    }

    return node.__otsuguaOriginalText;
}

function getOriginalAttribute(element, attributeName) {
    if (!originalAttributes.has(element)) {
        originalAttributes.set(element, new Map());
    }

    const elementAttributes = originalAttributes.get(element);

    if (!elementAttributes.has(attributeName)) {
        elementAttributes.set(attributeName, element.getAttribute(attributeName) ?? '');
    }

    return elementAttributes.get(attributeName);
}

function translateValue(value, locale) {
    const normalizedValue = normalizeText(value);

    if (locale === 'en' || !normalizedValue) {
        return value;
    }

    const translatedValue = ptBR[normalizedValue];

    if (translatedValue) {
        const { leading, trailing } = splitBoundaryWhitespace(value);

        return `${leading}${translatedValue}${trailing}`;
    }

    const dynamicTranslation = translateDynamicValue(normalizedValue);

    if (!dynamicTranslation) {
        return value;
    }

    const { leading, trailing } = splitBoundaryWhitespace(value);

    return `${leading}${dynamicTranslation}${trailing}`;
}

function translateDynamicValue(value) {
    const transactionMatch = value.match(/^TRANSACTION #(.*)$/);

    if (transactionMatch) {
        return `TRANSAÇÃO #${transactionMatch[1]}`;
    }

    const initiatedMatch = value.match(/^Initiated (.*)$/);

    if (initiatedMatch) {
        return `Iniciado em ${initiatedMatch[1]}`;
    }

    const agentMatch = value.match(/^Agent: (.*)$/);

    if (agentMatch) {
        return `Agente: ${agentMatch[1]}`;
    }

    const sourceMatch = value.match(/^Source: (.*)$/);

    if (sourceMatch) {
        return `Fonte: ${sourceMatch[1]}`;
    }

    const gradingItemMatch = value.match(/^Open grading item: (.*)$/);

    if (gradingItemMatch) {
        return `Abrir correção: ${ptBR[gradingItemMatch[1]] ?? gradingItemMatch[1]}`;
    }

    const eventMatch = value.match(/^Open event: (.*)$/);

    if (eventMatch) {
        return `Abrir evento: ${ptBR[eventMatch[1]] ?? eventMatch[1]}`;
    }

    return null;
}

function localizeTextNode(node, locale) {
    const originalText = getOriginalText(node);
    const translatedText = translateValue(originalText, locale);

    if (node.nodeValue !== translatedText) {
        node.nodeValue = translatedText;
    }
}

function localizeAttributes(element, locale) {
    ['aria-label', 'title', 'placeholder', 'content', 'data-project-note-label-open', 'data-project-note-label-closed', 'data-project-note-inline-label'].forEach((attributeName) => {
        if (!element.hasAttribute(attributeName)) {
            return;
        }

        const originalValue = getOriginalAttribute(element, attributeName);
        const translatedValue = translateValue(originalValue, locale);

        if (element.getAttribute(attributeName) !== translatedValue) {
            element.setAttribute(attributeName, translatedValue);
        }
    });
}

function localizeRoot(root, locale) {
    const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode(node) {
                const parent = node.parentElement;

                if (!parent || parent.closest(untranslatedSelector)) {
                    return NodeFilter.FILTER_REJECT;
                }

                return normalizeText(node.nodeValue).length > 0
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT;
            },
        },
    );

    const textNodes = [];

    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }

    textNodes.forEach((node) => localizeTextNode(node, locale));

    const attributeRoot = root.nodeType === Node.ELEMENT_NODE ? root : document.body;
    attributeRoot.querySelectorAll?.('[aria-label], [title], [placeholder], [content], [data-project-note-label-open], [data-project-note-label-closed], [data-project-note-inline-label]').forEach((element) => {
        if (!element.closest(untranslatedSelector)) {
            localizeAttributes(element, locale);
        }
    });
}

function updateLocaleToggle(locale) {
    const toggle = document.querySelector('[data-locale-toggle]');

    if (!toggle) {
        return;
    }

    const nextLocale = locale === 'pt-BR' ? 'en' : 'pt-BR';
    const label = locale === 'pt-BR' ? 'BR' : 'EN';
    const flagPath = locale === 'pt-BR' ? '/flags/br.svg' : '/flags/us.svg';
    const flagAlt = locale === 'pt-BR' ? 'Brazil' : 'United States';

    toggle.innerHTML = `<span>${label}</span><img class="locale-toggle__flag" src="${flagPath}" alt="${flagAlt} flag">`;
    toggle.dataset.localeTarget = nextLocale;
    toggle.setAttribute('aria-pressed', String(locale === 'pt-BR'));
    toggle.setAttribute(
        'aria-label',
        locale === 'pt-BR'
            ? 'Idioma atual: português do Brasil. Mudar para inglês'
            : 'Current language: English. Switch to Brazilian Portuguese',
    );
}

export function initializeLocalization() {
    let currentLocale = readStoredLocale() ?? detectVisitorLocale();

    const applyLocale = (locale) => {
        currentLocale = locale;
        document.documentElement.lang = locale === 'pt-BR' ? 'pt-BR' : 'en';
        document.documentElement.dataset.locale = locale;
        localizeRoot(document.body, locale);
        updateLocaleToggle(locale);
        document.dispatchEvent(new CustomEvent('otsugua:localechange', { detail: { locale } }));
    };

    applyLocale(currentLocale);

    document.addEventListener('click', (event) => {
        const toggle = event.target.closest?.('[data-locale-toggle]');

        if (!toggle) {
            return;
        }

        const nextLocale = currentLocale === 'pt-BR' ? 'en' : 'pt-BR';

        writeStoredLocale(nextLocale);
        applyLocale(nextLocale);
    });

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                    localizeTextNode(node, currentLocale);

                    return;
                }

                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (!node.closest(untranslatedSelector)) {
                        localizeAttributes(node, currentLocale);
                        localizeRoot(node, currentLocale);
                    }
                }
            });

            if (mutation.type === 'characterData') {
                localizeTextNode(mutation.target, currentLocale);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
    });
}
