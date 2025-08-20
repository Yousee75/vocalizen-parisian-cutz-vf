/*
 * Module Conversations - Vocalizen Parisian Cutz
 * Gestion des démonstrations de conversations
 */

export class ConversationsManager {
    constructor() {
        this.conversations = {};
        this.isPlaying = {};
        this.intervals = {};
        
        this.init();
    }

    async init() {
        await this.loadConversations();
        this.setupEventListeners();
        
        // Écouter l'événement d'initialisation des démos
        document.addEventListener('initDemos', () => {
            this.initializeDemos();
        });
    }

    async loadConversations() {
        try {
            const response = await fetch('/assets/data/conversations.json');
            if (response.ok) {
                this.conversations = await response.json();
            } else {
                this.conversations = this.getDefaultConversations();
            }
        } catch (error) {
            console.warn('Chargement conversations.json échoué, utilisation des données par défaut');
            this.conversations = this.getDefaultConversations();
        }
    }

    getDefaultConversations() {
        return {
            1: {
                title: "Nouveau Client - Prise de RDV",
                duration: 27,
                messages: [
                    {type: 'bot', text: 'Bonjour, Parisian Cutz, comment puis-je vous aider ?', time: 0.3},
                    {type: 'user', text: 'Oui bonjour, j\'aimerais prendre RDV pour une coupe samedi', time: 2},
                    {type: 'bot', text: 'Parfait ! Samedi nous avons de la disponibilité. Vous préférez matin ou après-midi ?', time: 3},
                    {type: 'user', text: 'Plutôt le matin si possible', time: 5},
                    {type: 'bot', text: 'J\'ai 9h, 10h30 ou 11h30 samedi matin. Quelle heure vous arrange ?', time: 7},
                    {type: 'user', text: '10h30 c\'est parfait', time: 9},
                    {type: 'bot', text: 'Excellent ! Puis-je avoir votre nom ?', time: 11},
                    {type: 'user', text: 'Martin Leroy', time: 13},
                    {type: 'bot', text: 'Merci M. Leroy. Souhaitez-vous une coupe simple à 27€ ou ajouter la barbe pour 42€ au total ?', time: 15},
                    {type: 'user', text: 'Juste la coupe', time: 17},
                    {type: 'bot', text: 'Parfait ! Votre numéro pour la confirmation SMS ?', time: 19},
                    {type: 'user', text: '06 12 34 56 78', time: 21},
                    {type: 'bot', text: 'C\'est noté ! RDV samedi 10h30 pour une coupe avec Morgan. Vous recevez le SMS de confirmation. À samedi M. Leroy !', time: 23},
                    {type: 'user', text: 'Merci, bonne journée', time: 25},
                    {type: 'bot', text: 'Bonne journée à vous !', time: 27}
                ],
                actions: [
                    {time: 0, desc: '📞 Appel détecté → Décrochage'},
                    {time: 0.3, desc: '🎤 Activation reconnaissance vocale'},
                    {time: 2, desc: '🧠 NLP : "RDV" + "coupe" + "samedi"'},
                    {time: 3, desc: '📅 Check Planity : 12 créneaux samedi'},
                    {time: 5, desc: '🔍 Filtrage : 5 créneaux matin only'},
                    {time: 7, desc: '💡 Sélection : 3 meilleurs créneaux'},
                    {time: 11, desc: '👤 Création profil : Martin Leroy'},
                    {time: 15, desc: '💰 Calcul : Opportunité upsell détectée'},
                    {time: 19, desc: '📱 Validation format : 06XXXXXXXX ✓'},
                    {time: 21, desc: '✅ Création RDV dans Planity'},
                    {time: 21.5, desc: '✅ Sync Google Calendar Morgan'},
                    {time: 22, desc: '📨 SMS envoyé via Twilio'},
                    {time: 23, desc: '📊 Analytics : +1 conversion'},
                    {time: 25, desc: '💾 Conversation sauvegardée'},
                    {time: 27, desc: '📈 Stats : 27s, conversion réussie'}
                ]
            },
            2: {
                title: "Client Régulier - Modification RDV",
                duration: 20,
                messages: [
                    {type: 'bot', text: 'Bonjour Parisian Cutz, comment puis-je vous aider ?', time: 0.3},
                    {type: 'user', text: 'Bonjour, c\'est David Chen, j\'ai RDV demain 14h mais je dois reporter', time: 2},
                    {type: 'bot', text: 'Bonjour M. Chen ! Je vois votre RDV demain 14h avec Leta. Quand souhaitez-vous le reporter ?', time: 4},
                    {type: 'user', text: 'Est-ce que jeudi même heure c\'est possible ?', time: 6},
                    {type: 'bot', text: 'Je vérifie... Jeudi 14h Leta est pris, mais j\'ai 14h30 ou 15h30. Ou préférez-vous un autre jour ?', time: 8},
                    {type: 'user', text: '14h30 jeudi c\'est bien', time: 10},
                    {type: 'bot', text: 'Parfait ! Je déplace votre RDV coupe + barbe de demain à jeudi 14h30, toujours avec Leta', time: 12},
                    {type: 'user', text: 'Super merci', time: 14},
                    {type: 'bot', text: 'C\'est modifié ! Vous recevez la confirmation SMS. Voulez-vous que j\'active un rappel la veille ?', time: 16},
                    {type: 'user', text: 'Oui s\'il vous plaît', time: 18},
                    {type: 'bot', text: 'C\'est noté ! Rappel mercredi soir. À jeudi M. Chen !', time: 20}
                ],
                actions: [
                    {time: 0, desc: '📞 Appel entrant : 06 XX XX XX XX'},
                    {time: 0.5, desc: '✨ Client reconnu : David Chen (12 visites)'},
                    {time: 2, desc: '🔍 RDV trouvé : Demain 14h, Leta, C+B'},
                    {time: 4, desc: '📅 Check disponibilité jeudi PM'},
                    {time: 6, desc: '⚠️ Conflit : 14h occupé'},
                    {time: 6.5, desc: '🔄 Alternatives : 14h30, 15h30, 16h30'},
                    {time: 8, desc: '💡 Proposition 2 meilleurs créneaux'},
                    {time: 12, desc: '🔄 Annulation RDV demain'},
                    {time: 12.5, desc: '✅ Création nouveau RDV jeudi'},
                    {time: 13, desc: '📱 SMS modification envoyé'},
                    {time: 14, desc: '📧 Email modification envoyé'},
                    {time: 16, desc: '⏰ Programmation rappel J-1'},
                    {time: 18, desc: '📊 Stats : Client fidèle maintenu'},
                    {time: 20, desc: '💾 Historique mis à jour'}
                ]
            }
        };
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.play-demo-btn')) {
                const demoId = parseInt(e.target.getAttribute('data-demo'));
                this.playDemo(demoId);
            }
            
            if (e.target.matches('.stop-demo-btn')) {
                const demoId = parseInt(e.target.getAttribute('data-demo'));
                this.stopDemo(demoId);
            }
        });
    }

    initializeDemos() {
        // Réinitialiser tous les containers de démo
        Object.keys(this.conversations).forEach(demoId => {
            this.resetDemo(demoId);
        });
    }

    playDemo(demoId) {
        const demo = this.conversations[demoId];
        if (!demo || this.isPlaying[demoId]) return;

        const chatContainer = document.getElementById(`chat-${demoId}`);
        const systemContainer = document.getElementById(`system-${demoId}`);
        const progressBar = document.getElementById(`progress-${demoId}`);
        const playButton = document.querySelector(`[data-demo="${demoId}"]`);

        if (!chatContainer || !systemContainer || !progressBar) {
            console.warn(`Containers pour la démo ${demoId} non trouvés`);
            return;
        }

        // Marquer comme en cours
        this.isPlaying[demoId] = true;
        
        // Changer le bouton
        playButton.textContent = '⏸️ Pause';
        playButton.classList.add('playing');

        // Reset containers
        this.resetDemo(demoId);

        let messageIndex = 0;
        let actionIndex = 0;
        let currentTime = 0;
        const totalTime = demo.duration;
        const updateInterval = 100; // ms

        this.intervals[demoId] = setInterval(() => {
            currentTime += updateInterval / 1000; // Convertir en secondes

            // Mettre à jour la barre de progression
            const progress = (currentTime / totalTime) * 100;
            progressBar.style.width = `${Math.min(progress, 100)}%`;
            
            // Mettre à jour le temps
            const timeDisplay = progressBar.parentElement.querySelector('.timeline-time');
            if (timeDisplay) {
                timeDisplay.textContent = `${currentTime.toFixed(1)}s / ${totalTime}s`;
            }

            // Ajouter les messages
            while (messageIndex < demo.messages.length && 
                   demo.messages[messageIndex].time <= currentTime) {
                this.addMessage(chatContainer, demo.messages[messageIndex]);
                messageIndex++;
            }

            // Ajouter les actions système
            while (actionIndex < demo.actions.length && 
                   demo.actions[actionIndex].time <= currentTime) {
                this.addAction(systemContainer, demo.actions[actionIndex]);
                actionIndex++;
            }

            // Vérifier la fin
            if (currentTime >= totalTime) {
                this.stopDemo(demoId);
            }
        }, updateInterval);
    }

    stopDemo(demoId) {
        if (!this.isPlaying[demoId]) return;

        // Arrêter l'intervalle
        if (this.intervals[demoId]) {
            clearInterval(this.intervals[demoId]);
            delete this.intervals[demoId];
        }

        // Marquer comme arrêté
        this.isPlaying[demoId] = false;

        // Remettre le bouton
        const playButton = document.querySelector(`[data-demo="${demoId}"]`);
        if (playButton) {
            playButton.textContent = '▶️ Lancer la démo';
            playButton.classList.remove('playing');
        }
    }

    resetDemo(demoId) {
        const chatContainer = document.getElementById(`chat-${demoId}`);
        const systemContainer = document.getElementById(`system-${demoId}`);
        const progressBar = document.getElementById(`progress-${demoId}`);

        if (chatContainer) chatContainer.innerHTML = '';
        if (systemContainer) systemContainer.innerHTML = '';
        if (progressBar) {
            progressBar.style.width = '0%';
            const timeDisplay = progressBar.parentElement.querySelector('.timeline-time');
            if (timeDisplay) {
                const demo = this.conversations[demoId];
                timeDisplay.textContent = `0s / ${demo ? demo.duration : 0}s`;
            }
        }
    }

    addMessage(container, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${message.type}`;
        messageDiv.innerHTML = `
            <div class="message-bubble">${message.text}</div>
            <div class="message-time">${message.time}s</div>
        `;
        
        // Animation d'apparition
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(20px)';
        container.appendChild(messageDiv);
        
        // Trigger animation
        requestAnimationFrame(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
            messageDiv.style.transition = 'all 0.3s ease';
        });

        // Scroll vers le bas
        container.scrollTop = container.scrollHeight;
    }

    addAction(container, action) {
        const actionDiv = document.createElement('div');
        actionDiv.className = 'system-action';
        actionDiv.innerHTML = `
            <div class="action-time">[${action.time}s]</div>
            <div class="action-desc">${action.desc}</div>
        `;
        
        // Animation d'apparition
        actionDiv.style.opacity = '0';
        actionDiv.style.transform = 'translateX(20px)';
        container.appendChild(actionDiv);
        
        // Trigger animation
        requestAnimationFrame(() => {
            actionDiv.style.opacity = '1';
            actionDiv.style.transform = 'translateX(0)';
            actionDiv.style.transition = 'all 0.3s ease';
        });

        // Scroll vers le bas
        container.scrollTop = container.scrollHeight;
    }

    // Méthodes publiques
    pauseDemo(demoId) {
        if (this.intervals[demoId]) {
            clearInterval(this.intervals[demoId]);
            delete this.intervals[demoId];
            this.isPlaying[demoId] = false;
            
            const playButton = document.querySelector(`[data-demo="${demoId}"]`);
            if (playButton) {
                playButton.textContent = '▶️ Reprendre';
            }
        }
    }

    addCustomDemo(demoId, demoData) {
        this.conversations[demoId] = demoData;
    }

    getDemoStatus(demoId) {
        return {
            isPlaying: this.isPlaying[demoId] || false,
            hasDemo: !!this.conversations[demoId]
        };
    }

    destroy() {
        // Arrêter toutes les démos en cours
        Object.keys(this.intervals).forEach(demoId => {
            this.stopDemo(demoId);
        });
    }
}