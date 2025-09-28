// Medical Studies App - JavaScript com correções críticas APLICADAS
class MedicalStudiesApp {
    constructor() {
        this.data = {
            studies: [],
            disciplines: [
                {
                    id: 1,
                    nome: "Cardiologia",
                    assuntos: ["Arritmias", "Insuficiência Cardíaca", "Coronariopatias", "Hipertensão", "Valvopatias"],
                    isCustom: false
                },
                {
                    id: 2,
                    nome: "Pneumologia", 
                    assuntos: ["Asma", "DPOC", "Pneumonias", "Derrame Pleural", "Embolia Pulmonar"],
                    isCustom: false
                },
                {
                    id: 3,
                    nome: "Gastroenterologia",
                    assuntos: ["DRGE", "Úlcera Péptica", "Hepatites", "Cirrose", "Pancreatite"],
                    isCustom: false
                },
                {
                    id: 4,
                    nome: "Neurologia",
                    assuntos: ["AVC", "Epilepsia", "Cefaléias", "Demências", "Parkinson"],
                    isCustom: false
                },
                {
                    id: 5,
                    nome: "Endocrinologia",
                    assuntos: ["Diabetes", "Tireoidopatias", "Obesidade", "Osteoporose", "Adrenal"],
                    isCustom: false
                }
            ],
            customDisciplines: []
        };
        
        this.charts = {};
        this.init();
    }

    init() {
        this.loadData();
        this.populateDisciplineSelects();
        this.initNavigation();
        this.initForms();
        this.initCharts();
        this.updateDashboard();
        this.updateReviews();
        this.updateHistory();
        this.updateSettings();
        
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        const studyDateInput = document.getElementById('studyDate');
        if (studyDateInput) {
            studyDateInput.value = today;
        }
    }

    // CORREÇÃO CRÍTICA: Função saveData() robusta com verificação completa
    saveData() {
        try {
            // Verificar se localStorage está disponível
            if (typeof(Storage) === "undefined") {
                this.showToast('Erro', 'Armazenamento local não disponível no seu navegador', 'error');
                return false;
            }

            // Preparar dados para salvar
            const dataToSave = JSON.stringify({
                studies: this.data.studies,
                customDisciplines: this.data.customDisciplines
            });

            // Tentar salvar os dados
            localStorage.setItem('medicalStudiesData', dataToSave);
            
            // CRÍTICO: Verificar se os dados foram realmente salvos
            const savedData = localStorage.getItem('medicalStudiesData');
            if (!savedData) {
                this.showToast('Erro', 'Falha ao salvar dados no armazenamento local', 'error');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Erro ao salvar dados:', error);
            if (error.name === 'QuotaExceededError') {
                this.showToast('Erro', 'Espaço de armazenamento insuficiente. Considere exportar seus dados.', 'error');
            } else {
                this.showToast('Erro', `Erro ao salvar dados: ${error.message}`, 'error');
            }
            return false;
        }
    }

    loadData() {
        try {
            const savedData = localStorage.getItem('medicalStudiesData');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                this.data.studies = parsedData.studies || [];
                this.data.customDisciplines = parsedData.customDisciplines || [];
            }
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            this.showToast('Aviso', 'Erro ao carregar dados salvos', 'warning');
        }
    }

    // CORREÇÃO CRÍTICA: Navigation System corrigido
    initNavigation() {
        // Desktop navigation - CORRIGIDO
        const navTabs = document.querySelectorAll('.nav__tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = e.target.getAttribute('data-tab');
                if (targetTab) {
                    this.switchTab(targetTab);
                }
            });
        });

        // Mobile navigation - CORRIGIDO
        const bottomNavItems = document.querySelectorAll('.bottom-nav__item');
        bottomNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = e.currentTarget.getAttribute('data-tab');
                if (targetTab) {
                    this.switchTab(targetTab);
                }
            });
        });
    }

    // CORREÇÃO CRÍTICA: switchTab corrigido
    switchTab(tabName) {
        if (!tabName) return;
        
        // Update tab content - CORRIGIDO
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetContent = document.getElementById(tabName);
        if (targetContent) {
            targetContent.classList.add('active');
        }

        // Update navigation states - CORRIGIDO
        document.querySelectorAll('.nav__tab, .bottom-nav__item').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelectorAll(`[data-tab="${tabName}"]`).forEach(tab => {
            tab.classList.add('active');
        });

        // Update content based on tab
        switch(tabName) {
            case 'inicio':
                this.updateDashboard();
                break;
            case 'revisoes':
                this.updateReviews();
                break;
            case 'historico':
                this.updateHistory();
                break;
            case 'configuracoes':
                this.updateSettings();
                break;
        }
    }

    // CORREÇÃO CRÍTICA: Form Initialization corrigido
    initForms() {
        const studyForm = document.getElementById('studyForm');
        if (studyForm) {
            studyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleStudySubmission();
            });
        }

        // CORREÇÃO CRÍTICA: Event listeners para dropdowns
        const disciplineSelect = document.getElementById('discipline');
        if (disciplineSelect) {
            disciplineSelect.addEventListener('change', (e) => {
                console.log('Disciplina selecionada:', e.target.value);
                this.updateTopicOptions();
            });
        }

        const topicSelect = document.getElementById('topic');
        if (topicSelect) {
            topicSelect.addEventListener('change', (e) => {
                this.handleTopicChange();
            });
        }

        // Settings form handlers
        const addDisciplineBtn = document.getElementById('addDisciplineBtn');
        if (addDisciplineBtn) {
            addDisciplineBtn.addEventListener('click', () => {
                this.addCustomDiscipline();
            });
        }

        // Data management handlers
        const exportBtn = document.getElementById('exportDataBtn');
        const importBtn = document.getElementById('importDataBtn');
        const clearBtn = document.getElementById('clearDataBtn');
        const importInput = document.getElementById('importFileInput');

        if (exportBtn) exportBtn.addEventListener('click', () => this.exportData());
        if (importBtn) importBtn.addEventListener('click', () => importInput?.click());
        if (importInput) importInput.addEventListener('change', (e) => this.importData(e));
        if (clearBtn) clearBtn.addEventListener('click', () => this.clearAllData());
    }

    // CORREÇÃO CRÍTICA: Validação melhorada com mensagens específicas e completa
    validateStudyForm() {
        let isValid = true;
        const errors = {};

        // Limpar erros anteriores
        document.querySelectorAll('.error-message').forEach(elem => {
            elem.textContent = '';
        });

        // CORREÇÃO: Usar optional chaining para acesso seguro aos elementos
        const disciplineSelect = document.getElementById('discipline');
        const topicSelect = document.getElementById('topic');
        const customTopicInput = document.getElementById('customTopic');
        const correctAnswersInput = document.getElementById('correctAnswers');
        const totalQuestionsInput = document.getElementById('totalQuestions');
        const studyDateInput = document.getElementById('studyDate');

        const discipline = disciplineSelect?.value || '';
        const topic = topicSelect?.value || '';
        const customTopic = customTopicInput?.value?.trim() || '';
        const correctAnswers = correctAnswersInput?.value || '';
        const totalQuestions = totalQuestionsInput?.value || '';
        const studyDate = studyDateInput?.value || '';

        // Validar disciplina
        if (!discipline) {
            errors.discipline = 'Por favor, selecione uma disciplina';
            isValid = false;
        }

        // CORREÇÃO: Validação específica para o campo assunto
        if (!topic) {
            errors.topic = 'Por favor, selecione um assunto';
            isValid = false;
        } else if (topic === 'custom' && !customTopic) {
            errors.topic = 'Por favor, digite o assunto customizado';
            isValid = false;
        }

        // CORREÇÃO CRÍTICA: Validação melhorada para questões certas
        if (!correctAnswers) {
            errors.correctAnswers = 'Por favor, informe o número de questões certas';
            isValid = false;
        } else {
            const correctNum = parseInt(correctAnswers);
            if (isNaN(correctNum) || correctNum < 0) {
                errors.correctAnswers = 'O número de questões certas deve ser um número válido e não negativo';
                isValid = false;
            }
        }

        // CORREÇÃO CRÍTICA: Validação melhorada para total de questões
        if (!totalQuestions) {
            errors.totalQuestions = 'Por favor, informe o total de questões';
            isValid = false;
        } else {
            const totalNum = parseInt(totalQuestions);
            if (isNaN(totalNum) || totalNum <= 0) {
                errors.totalQuestions = 'O total de questões deve ser um número válido maior que zero';
                isValid = false;
            } else if (correctAnswers && parseInt(correctAnswers) > totalNum) {
                errors.correctAnswers = 'O número de questões certas não pode ser maior que o total de questões';
                isValid = false;
            }
        }

        // Validar data do estudo
        if (!studyDate) {
            errors.studyDate = 'Por favor, selecione a data do estudo';
            isValid = false;
        } else {
            const selectedDate = new Date(studyDate);
            const today = new Date();
            today.setHours(23, 59, 59, 999);
            
            if (selectedDate > today) {
                errors.studyDate = 'A data do estudo não pode ser no futuro';
                isValid = false;
            }
        }

        // CORREÇÃO: Exibir erros específicos
        Object.keys(errors).forEach(field => {
            const errorElement = document.getElementById(field + 'Error');
            if (errorElement) {
                errorElement.textContent = errors[field];
            }
        });

        return isValid;
    }

    // CORREÇÃO CRÍTICA: handleStudySubmission melhorada
    handleStudySubmission() {
        if (!this.validateStudyForm()) {
            this.showToast('Erro de Validação', 'Por favor, corrija os erros no formulário', 'error');
            return;
        }

        // CORREÇÃO: Acesso seguro aos elementos do DOM
        const disciplineSelect = document.getElementById('discipline');
        const topicSelect = document.getElementById('topic');
        const customTopicInput = document.getElementById('customTopic');
        const correctAnswersInput = document.getElementById('correctAnswers');
        const totalQuestionsInput = document.getElementById('totalQuestions');
        const studyDateInput = document.getElementById('studyDate');
        const observationsInput = document.getElementById('observations');

        const formData = {
            discipline: disciplineSelect?.value || '',
            topic: topicSelect?.value === 'custom' ? (customTopicInput?.value?.trim() || '') : (topicSelect?.value || ''),
            correctAnswers: parseInt(correctAnswersInput?.value || '0'),
            totalQuestions: parseInt(totalQuestionsInput?.value || '0'),
            studyDate: studyDateInput?.value || '',
            observations: observationsInput?.value?.trim() || ''
        };

        const study = {
            id: Date.now(),
            ...formData,
            percentage: Math.round((formData.correctAnswers / formData.totalQuestions) * 100),
            createdAt: new Date().toISOString(),
            nextReview: this.calculateNextReview(formData.correctAnswers / formData.totalQuestions)
        };

        this.data.studies.push(study);

        // CORREÇÃO CRÍTICA: Verificar se salvamento foi bem-sucedido antes de limpar formulário
        const saved = this.saveData();
        if (saved) {
            this.showToast('Sucesso', 'Estudo registrado com sucesso!', 'success');
            this.resetForm(); // CORREÇÃO: Reset apenas após salvamento bem-sucedido
            this.updateDashboard();
            this.updateReviews();
            this.updateHistory();
        } else {
            // CORREÇÃO: Remover estudo dos dados se salvamento falhou
            this.data.studies.pop();
            this.showToast('Erro', 'Falha ao salvar o estudo. Verifique o armazenamento e tente novamente.', 'error');
        }
    }

    resetForm() {
        const studyForm = document.getElementById('studyForm');
        if (studyForm) {
            studyForm.reset();
            
            // Reset custom topic field
            const customTopicInput = document.getElementById('customTopic');
            if (customTopicInput) {
                customTopicInput.classList.add('hidden');
                customTopicInput.value = '';
            }
            
            // Clear error messages
            document.querySelectorAll('.error-message').forEach(elem => {
                elem.textContent = '';
            });
            
            // Reset topic dropdown
            const topicSelect = document.getElementById('topic');
            if (topicSelect) {
                topicSelect.innerHTML = '<option value="">Primeiro selecione uma disciplina</option>';
            }
            
            // Set today's date again
            const today = new Date().toISOString().split('T')[0];
            const studyDateInput = document.getElementById('studyDate');
            if (studyDateInput) {
                studyDateInput.value = today;
            }
        }
    }

    // CORREÇÃO CRÍTICA: Discipline and Topic Management corrigido
    populateDisciplineSelects() {
        const selects = ['discipline', 'historyFilter'];
        const allDisciplines = [...this.data.disciplines, ...this.data.customDisciplines];
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                const currentValue = select.value;
                
                if (selectId === 'historyFilter') {
                    select.innerHTML = '<option value="all">Todas as Disciplinas</option>';
                } else {
                    select.innerHTML = '<option value="">Selecione uma disciplina</option>';
                }
                
                allDisciplines.forEach(discipline => {
                    const option = document.createElement('option');
                    option.value = discipline.id.toString();
                    option.textContent = discipline.nome;
                    select.appendChild(option);
                });
                
                // Only restore value if it still exists
                if (currentValue && allDisciplines.find(d => d.id.toString() === currentValue)) {
                    select.value = currentValue;
                }
            }
        });
    }

    // CORREÇÃO CRÍTICA: updateTopicOptions corrigido e com debug
    updateTopicOptions() {
        const disciplineSelect = document.getElementById('discipline');
        const topicSelect = document.getElementById('topic');
        
        if (!disciplineSelect || !topicSelect) {
            console.log('Elementos não encontrados');
            return;
        }

        const disciplineId = disciplineSelect.value;
        console.log('Discipline ID selecionado:', disciplineId);
        
        // Clear current options
        topicSelect.innerHTML = '<option value="">Selecione um assunto</option>';
        
        if (!disciplineId) {
            topicSelect.innerHTML = '<option value="">Primeiro selecione uma disciplina</option>';
            return;
        }

        // Find the selected discipline
        const allDisciplines = [...this.data.disciplines, ...this.data.customDisciplines];
        const selectedDiscipline = allDisciplines.find(d => d.id.toString() === disciplineId);
        
        console.log('Disciplina encontrada:', selectedDiscipline);
        
        if (selectedDiscipline && selectedDiscipline.assuntos) {
            selectedDiscipline.assuntos.forEach(assunto => {
                const option = document.createElement('option');
                option.value = assunto;
                option.textContent = assunto;
                topicSelect.appendChild(option);
            });
            console.log('Assuntos adicionados:', selectedDiscipline.assuntos);
        }
        
        // Add custom option
        const customOption = document.createElement('option');
        customOption.value = 'custom';
        customOption.textContent = 'Outro (especificar)';
        topicSelect.appendChild(customOption);
        
        // Hide custom topic input when changing disciplines
        const customTopicInput = document.getElementById('customTopic');
        if (customTopicInput) {
            customTopicInput.classList.add('hidden');
            customTopicInput.value = '';
        }
    }

    handleTopicChange() {
        const topicSelect = document.getElementById('topic');
        const customTopicInput = document.getElementById('customTopic');
        
        if (!topicSelect || !customTopicInput) return;

        if (topicSelect.value === 'custom') {
            customTopicInput.classList.remove('hidden');
            customTopicInput.focus();
        } else {
            customTopicInput.classList.add('hidden');
            customTopicInput.value = '';
        }
    }

    // SM-2 Spaced Repetition Algorithm
    calculateNextReview(performance) {
        const today = new Date();
        let interval;
        
        if (performance >= 0.8) {
            interval = 7;
        } else if (performance >= 0.6) {
            interval = 3;
        } else if (performance >= 0.4) {
            interval = 1;
        } else {
            interval = 1;
        }
        
        const nextReview = new Date(today);
        nextReview.setDate(today.getDate() + interval);
        return nextReview.toISOString().split('T')[0];
    }

    // Dashboard and Statistics
    updateDashboard() {
        this.updateHeaderStats();
        this.updateCharts();
        this.updateRecentActivities();
    }

    updateHeaderStats() {
        const totalStudiesEl = document.getElementById('totalStudies');
        const averagePerformanceEl = document.getElementById('averagePerformance');
        const pendingReviewsEl = document.getElementById('pendingReviews');
        
        if (totalStudiesEl) {
            totalStudiesEl.textContent = this.data.studies.length;
        }
        
        if (averagePerformanceEl) {
            const avgPerformance = this.calculateAveragePerformance();
            averagePerformanceEl.textContent = `${avgPerformance}%`;
        }
        
        if (pendingReviewsEl) {
            const pendingCount = this.getPendingReviewsCount();
            pendingReviewsEl.textContent = pendingCount;
        }
    }

    calculateAveragePerformance() {
        if (this.data.studies.length === 0) return 0;
        
        const total = this.data.studies.reduce((sum, study) => sum + study.percentage, 0);
        return Math.round(total / this.data.studies.length);
    }

    getPendingReviewsCount() {
        const today = new Date().toISOString().split('T')[0];
        return this.data.studies.filter(study => study.nextReview <= today).length;
    }

    // Charts Initialization
    initCharts() {
        this.initDisciplineChart();
        this.initTimeChart();
    }

    initDisciplineChart() {
        const ctx = document.getElementById('disciplineChart');
        if (!ctx) return;

        const disciplineData = this.getDisciplinePerformanceData();
        
        this.charts.discipline = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: disciplineData.labels,
                datasets: [{
                    label: 'Performance Média (%)',
                    data: disciplineData.data,
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                    borderColor: ['#32a8a1', '#e6a066', '#964325', '#d4d3c7', '#4a6d73'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    initTimeChart() {
        const ctx = document.getElementById('timeChart');
        if (!ctx) return;

        const timeData = this.getTimePerformanceData();
        
        this.charts.time = new Chart(ctx, {
            type: 'line',
            data: {
                labels: timeData.labels,
                datasets: [{
                    label: 'Performance (%)',
                    data: timeData.data,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    getDisciplinePerformanceData() {
        const allDisciplines = [...this.data.disciplines, ...this.data.customDisciplines];
        const performanceByDiscipline = {};
        
        this.data.studies.forEach(study => {
            const discipline = allDisciplines.find(d => d.id.toString() === study.discipline);
            if (discipline) {
                if (!performanceByDiscipline[discipline.nome]) {
                    performanceByDiscipline[discipline.nome] = [];
                }
                performanceByDiscipline[discipline.nome].push(study.percentage);
            }
        });
        
        const labels = Object.keys(performanceByDiscipline);
        const data = labels.map(discipline => {
            const performances = performanceByDiscipline[discipline];
            return Math.round(performances.reduce((sum, p) => sum + p, 0) / performances.length);
        });
        
        return { labels, data };
    }

    getTimePerformanceData() {
        const sortedStudies = [...this.data.studies]
            .sort((a, b) => new Date(a.studyDate) - new Date(b.studyDate))
            .slice(-10);
        
        const labels = sortedStudies.map(study => {
            const date = new Date(study.studyDate);
            return date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
        });
        
        const data = sortedStudies.map(study => study.percentage);
        
        return { labels, data };
    }

    updateCharts() {
        if (this.charts.discipline) {
            const disciplineData = this.getDisciplinePerformanceData();
            this.charts.discipline.data.labels = disciplineData.labels;
            this.charts.discipline.data.datasets[0].data = disciplineData.data;
            this.charts.discipline.update();
        }
        
        if (this.charts.time) {
            const timeData = this.getTimePerformanceData();
            this.charts.time.data.labels = timeData.labels;
            this.charts.time.data.datasets[0].data = timeData.data;
            this.charts.time.update();
        }
    }

    updateRecentActivities() {
        const container = document.getElementById('recentActivities');
        if (!container) return;

        const recentStudies = [...this.data.studies]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        if (recentStudies.length === 0) {
            container.innerHTML = '<p class="text-center">Nenhum estudo registrado ainda.</p>';
            return;
        }

        container.innerHTML = recentStudies.map(study => {
            const allDisciplines = [...this.data.disciplines, ...this.data.customDisciplines];
            const discipline = allDisciplines.find(d => d.id.toString() === study.discipline);
            const performanceClass = this.getPerformanceClass(study.percentage);
            
            return `
                <div class="activity-item">
                    <div class="activity-content">
                        <h4>${discipline?.nome || 'Disciplina'} - ${study.topic}</h4>
                        <p>${study.correctAnswers}/${study.totalQuestions} questões</p>
                    </div>
                    <div class="activity-score">
                        <div class="activity-percentage ${performanceClass}">${study.percentage}%</div>
                        <div class="activity-date">${new Date(study.studyDate).toLocaleDateString('pt-BR')}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getPerformanceClass(percentage) {
        if (percentage >= 80) return 'performance-excellent';
        if (percentage >= 60) return 'performance-good';
        if (percentage >= 40) return 'performance-average';
        return 'performance-poor';
    }

    // Reviews Management
    updateReviews() {
        const today = new Date().toISOString().split('T')[0];
        
        const overdue = this.data.studies.filter(study => study.nextReview < today);
        const todayReviews = this.data.studies.filter(study => study.nextReview === today);
        const upcoming = this.data.studies.filter(study => study.nextReview > today).slice(0, 5);
        
        this.renderReviewList('overdueReviews', overdue, 'Nenhuma revisão atrasada');
        this.renderReviewList('todayReviews', todayReviews, 'Nenhuma revisão para hoje');
        this.renderReviewList('upcomingReviews', upcoming, 'Nenhuma revisão próxima');
    }

    renderReviewList(containerId, reviews, emptyMessage) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (reviews.length === 0) {
            container.innerHTML = `<p class="text-center">${emptyMessage}</p>`;
            return;
        }

        const allDisciplines = [...this.data.disciplines, ...this.data.customDisciplines];
        
        container.innerHTML = reviews.map(review => {
            const discipline = allDisciplines.find(d => d.id.toString() === review.discipline);
            return `
                <div class="review-item">
                    <h4>${discipline?.nome || 'Disciplina'} - ${review.topic}</h4>
                    <p>Performance anterior: ${review.percentage}%</p>
                    <p>Data da revisão: ${new Date(review.nextReview).toLocaleDateString('pt-BR')}</p>
                </div>
            `;
        }).join('');
    }

    // History Management
    updateHistory() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;

        const filterSelect = document.getElementById('historyFilter');
        const selectedDiscipline = filterSelect?.value || 'all';
        
        let filteredStudies = [...this.data.studies];
        
        if (selectedDiscipline !== 'all') {
            filteredStudies = filteredStudies.filter(study => 
                study.discipline === selectedDiscipline
            );
        }
        
        filteredStudies.sort((a, b) => new Date(b.studyDate) - new Date(a.studyDate));
        
        if (filteredStudies.length === 0) {
            historyList.innerHTML = '<p class="text-center">Nenhum estudo encontrado</p>';
            return;
        }
        
        const allDisciplines = [...this.data.disciplines, ...this.data.customDisciplines];
        
        historyList.innerHTML = filteredStudies.map(study => {
            const discipline = allDisciplines.find(d => d.id.toString() === study.discipline);
            const performanceClass = this.getPerformanceClass(study.percentage);
            
            return `
                <div class="history-item">
                    <div class="history-item-header">
                        <div class="history-item-title">${discipline?.nome || 'Disciplina'} - ${study.topic}</div>
                        <div class="history-item-date">${new Date(study.studyDate).toLocaleDateString('pt-BR')}</div>
                    </div>
                    <div class="history-item-content">
                        <div class="history-item-stat">
                            <span class="history-item-stat-value">${study.correctAnswers}</span>
                            <span class="history-item-stat-label">Certas</span>
                        </div>
                        <div class="history-item-stat">
                            <span class="history-item-stat-value">${study.totalQuestions}</span>
                            <span class="history-item-stat-label">Total</span>
                        </div>
                        <div class="history-item-stat">
                            <span class="history-item-stat-value ${performanceClass}">${study.percentage}%</span>
                            <span class="history-item-stat-label">Performance</span>
                        </div>
                        <div class="history-item-stat">
                            <span class="history-item-stat-value">${new Date(study.nextReview).toLocaleDateString('pt-BR')}</span>
                            <span class="history-item-stat-label">Próxima revisão</span>
                        </div>
                    </div>
                    ${study.observations ? `<div class="history-item-notes">${study.observations}</div>` : ''}
                </div>
            `;
        }).join('');
    }

    // Settings Management
    updateSettings() {
        this.updateCustomDisciplinesList();
        
        const historyFilter = document.getElementById('historyFilter');
        if (historyFilter) {
            historyFilter.addEventListener('change', () => {
                this.updateHistory();
            });
        }
    }

    addCustomDiscipline() {
        const input = document.getElementById('newDisciplineName');
        if (!input) return;

        const name = input.value.trim();
        if (!name) {
            this.showToast('Aviso', 'Por favor, digite o nome da disciplina', 'warning');
            return;
        }

        const allDisciplines = [...this.data.disciplines, ...this.data.customDisciplines];
        if (allDisciplines.some(d => d.nome.toLowerCase() === name.toLowerCase())) {
            this.showToast('Aviso', 'Disciplina já existe', 'warning');
            return;
        }

        const newDiscipline = {
            id: Date.now(),
            nome: name,
            assuntos: ['Geral'],
            isCustom: true
        };

        this.data.customDisciplines.push(newDiscipline);
        
        if (this.saveData()) {
            input.value = '';
            this.updateCustomDisciplinesList();
            this.populateDisciplineSelects();
            this.showToast('Sucesso', 'Disciplina adicionada com sucesso!', 'success');
        }
    }

    updateCustomDisciplinesList() {
        const container = document.getElementById('customDisciplinesList');
        if (!container) return;

        if (this.data.customDisciplines.length === 0) {
            container.innerHTML = '<p class="text-center">Nenhuma disciplina customizada</p>';
            return;
        }

        container.innerHTML = this.data.customDisciplines.map(discipline => `
            <div class="custom-discipline-item">
                <span>${discipline.nome}</span>
                <button type="button" class="btn btn--sm btn--secondary" 
                        onclick="app.removeCustomDiscipline(${discipline.id})">
                    Remover
                </button>
            </div>
        `).join('');
    }

    removeCustomDiscipline(disciplineId) {
        this.data.customDisciplines = this.data.customDisciplines.filter(d => d.id !== disciplineId);
        
        if (this.saveData()) {
            this.updateCustomDisciplinesList();
            this.populateDisciplineSelects();
            this.showToast('Sucesso', 'Disciplina removida com sucesso!', 'success');
        }
    }

    // Data Import/Export
    exportData() {
        const dataToExport = {
            studies: this.data.studies,
            customDisciplines: this.data.customDisciplines,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `estudos-medicos-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Sucesso', 'Dados exportados com sucesso!', 'success');
    }

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (importedData.studies && Array.isArray(importedData.studies)) {
                    this.data.studies = importedData.studies;
                }
                
                if (importedData.customDisciplines && Array.isArray(importedData.customDisciplines)) {
                    this.data.customDisciplines = importedData.customDisciplines;
                }

                if (this.saveData()) {
                    this.updateDashboard();
                    this.populateDisciplineSelects();
                    this.updateHistory();
                    this.updateSettings();
                    this.showToast('Sucesso', 'Dados importados com sucesso!', 'success');
                }
            } catch (error) {
                this.showToast('Erro', 'Arquivo inválido', 'error');
            }
        };
        
        reader.readAsText(file);
        event.target.value = '';
    }

    clearAllData() {
        if (!confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
            return;
        }

        this.data.studies = [];
        this.data.customDisciplines = [];
        
        if (this.saveData()) {
            this.updateDashboard();
            this.populateDisciplineSelects();
            this.updateReviews();
            this.updateHistory();
            this.updateSettings();
            this.showToast('Sucesso', 'Todos os dados foram limpos', 'success');
        }
    }

    // CORREÇÃO: Sistema de toast melhorado para feedback do usuário
    showToast(title, message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        
        toast.innerHTML = `
            <div class="toast__header">
                <h4 class="toast__title">${title}</h4>
                <button class="toast__close">&times;</button>
            </div>
            <p class="toast__message">${message}</p>
        `;

        container.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Auto remove after 5 seconds
        const autoRemoveTimeout = setTimeout(() => {
            this.removeToast(toast);
        }, 5000);

        // Close button handler
        const closeBtn = toast.querySelector('.toast__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                clearTimeout(autoRemoveTimeout);
                this.removeToast(toast);
            });
        }
    }

    removeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
}

// Initialize the application
const app = new MedicalStudiesApp();