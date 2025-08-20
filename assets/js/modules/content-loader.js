/*
 * Module Content Loader - Vocalizen Parisian Cutz
 * Chargement dynamique des sections HTML
 */

export class ContentLoader {
    constructor() {
        this.loadedSections = new Map();
        this.isLoading = false;
        this.fallbackContent = this.getFallbackContent();
        
        this.init();
    }

    init() {
        // Charger immédiatement la section d'accueil
        this.loadInitialContent();
        
        // Écouter les changements d'onglets
        document.addEventListener('tabChange', (e) => {
            this.loadSection(e.detail.tabId);
        });
    }

    async loadInitialContent() {
        // Remplacer le loader par le contenu complet du site
        const appContainer = document.getElementById('app');
        
        try {
            // Insérer le contenu HTML complet depuis le backup
            const content = await this.getFullContent();
            appContainer.innerHTML = content;
            
            // Masquer le loader
            const loader = document.getElementById('tab-loader');
            if (loader) loader.style.display = 'none';
            
            // Déclencher l'événement de contenu chargé
            const contentLoadedEvent = new CustomEvent('contentLoaded');
            document.dispatchEvent(contentLoadedEvent);
            
        } catch (error) {
            console.error('Erreur lors du chargement du contenu:', error);
            this.showErrorFallback(appContainer);
        }
    }

    async getFullContent() {
        // Pour cette version, on va charger le contenu depuis le fichier de backup
        // Dans une vraie implémentation, ce serait des fichiers HTML séparés
        
        return `
            <!-- Tab Content: Accueil -->
            <div id="accueil" class="tab-content active">
                <!-- Hero Section -->
                <section class="hero">
                    <div class="hero-content">
                        <h1>Vocalizen pour Parisian Cutz</h1>
                        <p class="hero-subtitle">
                            L'Agent IA Vocal qui ne dort jamais et transforme chaque appel en RDV
                        </p>
                        <div class="hero-stats">
                            <div class="hero-stat">
                                <span class="hero-stat-number" data-target="100">0</span>%
                                <span class="hero-stat-label">Appels décrochés</span>
                            </div>
                            <div class="hero-stat">
                                <span class="hero-stat-number" data-target="0.3">0</span>s
                                <span class="hero-stat-label">Temps de réponse</span>
                            </div>
                            <div class="hero-stat">
                                <span class="hero-stat-number" data-target="65">0</span>%
                                <span class="hero-stat-label">Taux de conversion</span>
                            </div>
                        </div>
                        <div class="cta-buttons">
                            <button class="btn btn-primary">Essayer gratuitement</button>
                            <button class="btn btn-secondary">Voir la démo</button>
                        </div>
                    </div>
                </section>

                <!-- Section de présentation -->
                <section class="section bg-section">
                    <div class="container">
                        <h2 class="section-title">Pourquoi Parisian Cutz a besoin de Vocalizen</h2>
                        <div class="features-grid">
                            <div class="feature-card">
                                <div class="feature-icon">📞</div>
                                <h3>Appels 24/7</h3>
                                <p>Vos clients appellent même quand vous dormez. L'IA répond toujours.</p>
                            </div>
                            <div class="feature-card">
                                <div class="feature-icon">🧠</div>
                                <h3>IA Ultra-Réaliste</h3>
                                <p>Personne ne sait que c'est une IA. Ton parisien authentique inclus.</p>
                            </div>
                            <div class="feature-card">
                                <div class="feature-icon">💰</div>
                                <h3>ROI Immédiat</h3>
                                <p>Rentabilité dès le premier mois avec zéro appel perdu.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Tab Content: Avis -->
            <div id="avis" class="tab-content">
                <section class="section">
                    <div class="container">
                        <h2 class="section-title">Ce que disent vos clients</h2>
                        <div class="avis-grid">
                            <div class="avis-card five-stars">
                                <div class="avis-author">Marc D.</div>
                                <div class="avis-rating">⭐⭐⭐⭐⭐</div>
                                <div class="avis-text">"Morgan fait des miracles ! Meilleur barbier du 17ème."</div>
                            </div>
                            <div class="avis-card five-stars">
                                <div class="avis-author">Sarah L.</div>
                                <div class="avis-rating">⭐⭐⭐⭐⭐</div>
                                <div class="avis-text">"Leta m'a redonné confiance avec une coupe parfaite."</div>
                            </div>
                            <div class="avis-card five-stars">
                                <div class="avis-author">Thomas R.</div>
                                <div class="avis-rating">⭐⭐⭐⭐⭐</div>
                                <div class="avis-text">"Ambiance top, service impeccable. Je recommande !"</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Tab Content: Concurrents -->
            <div id="concurrents" class="tab-content">
                <section class="section">
                    <div class="container">
                        <h2 class="section-title">Analyse de la Concurrence</h2>
                        <p class="section-subtitle">59 concurrents vous entourent dans le 17ème. Voici comment vous démarquer.</p>
                        <div class="chart-container">
                            <canvas id="competitorsChart"></canvas>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Tab Content: Quartier -->
            <div id="quartier" class="tab-content">
                <section class="section">
                    <div class="container">
                        <h2 class="section-title">Le Quartier Brochant en Chiffres</h2>
                        <div class="map-container" style="height: 400px; margin: 2rem 0;">
                            <div id="map"></div>
                        </div>
                        <div class="quartier-stats">
                            <div class="stat-card">
                                <div class="stat-number">5,247</div>
                                <div class="stat-label">Habitants dans un rayon de 500m</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">252</div>
                                <div class="stat-label">Commerces de proximité</div>
                            </div>
                            <div class="stat-card">
                                <div class="stat-number">5</div>
                                <div class="stat-label">Stations de métro à moins de 200m</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Tab Content: Comment ça marche -->
            <div id="comment-ca-marche" class="tab-content">
                <section class="process-section">
                    <div class="container">
                        <div class="process-hero">
                            <h1 class="process-title">De l'Appel au RDV en 30 Secondes ⚡</h1>
                            <p class="process-subtitle">L'IA qui ne dort jamais et parle comme un vrai Parisien</p>
                            
                            <div class="process-stats">
                                <div class="process-stat">
                                    <span class="stat-number" data-target="0.3">0</span>s
                                    <span class="stat-label">Pour décrocher</span>
                                </div>
                                <div class="process-stat">
                                    <span class="stat-number" data-target="15">0</span>s
                                    <span class="stat-label">Conversation moyenne</span>
                                </div>
                                <div class="process-stat">
                                    <span class="stat-number" data-target="100">0</span>%
                                    <span class="stat-label">Disponibilité</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <!-- Tab Content: Conversations Test -->
            <div id="conversations-test" class="tab-content">
                <section class="conversations-section">
                    <div class="container">
                        <div class="conversations-header">
                            <h1 class="conversations-title">Démonstrations Live</h1>
                            <p class="conversations-subtitle">Écoutez Vocalizen en action avec de vrais scénarios</p>
                        </div>

                        <div class="conversation-demo" id="demo-1">
                            <h2 class="demo-title">Test 1 : Nouveau Client - Prise de RDV</h2>
                            <div class="demo-container">
                                <div class="dialogue-column">
                                    <h3>💬 Conversation</h3>
                                    <div class="chat-container" id="chat-1"></div>
                                    <button class="play-demo-btn" data-demo="1">▶ Lancer la démo</button>
                                </div>
                                
                                <div class="system-column">
                                    <h3>⚙️ Actions Système</h3>
                                    <div class="system-log" id="system-1"></div>
                                </div>
                            </div>
                            
                            <div class="demo-timeline">
                                <div class="timeline-progress" id="progress-1"></div>
                                <div class="timeline-time">0s / 27s</div>
                            </div>
                        </div>

                        <div class="conversation-demo" id="demo-2">
                            <h2 class="demo-title">Test 2 : Client Régulier - Modification RDV</h2>
                            <div class="demo-container">
                                <div class="dialogue-column">
                                    <h3>💬 Conversation</h3>
                                    <div class="chat-container" id="chat-2"></div>
                                    <button class="play-demo-btn" data-demo="2">▶ Lancer la démo</button>
                                </div>
                                
                                <div class="system-column">
                                    <h3>⚙️ Actions Système</h3>
                                    <div class="system-log" id="system-2"></div>
                                </div>
                            </div>
                            
                            <div class="demo-timeline">
                                <div class="timeline-progress" id="progress-2"></div>
                                <div class="timeline-time">0s / 20s</div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        `;
    }

    async loadSection(sectionId) {
        if (this.loadedSections.has(sectionId)) {
            return; // Déjà chargé
        }

        try {
            // Dans une vraie implémentation, on chargerait depuis des fichiers séparés
            // const response = await fetch(\`components/html/sections/\${sectionId}.html\`);
            // const html = await response.text();
            
            // Pour cette version de démonstration, le contenu est déjà chargé
            this.loadedSections.set(sectionId, true);
            
        } catch (error) {
            console.error(\`Erreur lors du chargement de la section \${sectionId}:\`, error);
            this.showSectionError(sectionId);
        }
    }

    showSectionError(sectionId) {
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
            sectionElement.innerHTML = `
                <div class="section-error">
                    <h2>⚠️ Erreur de chargement</h2>
                    <p>Impossible de charger cette section.</p>
                    <button onclick="location.reload()" class="btn btn-primary">
                        Recharger
                    </button>
                </div>
            `;
        }
    }

    showErrorFallback(container) {
        container.innerHTML = `
            <div class="error-fallback">
                <div class="error-content">
                    <h1>🚨 Erreur de chargement</h1>
                    <p>Nous ne pouvons pas charger le contenu pour le moment.</p>
                    <div class="error-actions">
                        <button onclick="location.reload()" class="btn btn-primary">
                            Recharger la page
                        </button>
                        <button onclick="window.contentLoader.loadFallbackContent()" class="btn btn-secondary">
                            Version simplifiée
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    loadFallbackContent() {
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = this.fallbackContent;
    }

    getFallbackContent() {
        return `
            <div class="fallback-content">
                <header class="fallback-header">
                    <h1>Vocalizen pour Parisian Cutz</h1>
                    <p>L'Agent IA Vocal pour votre salon</p>
                </header>
                
                <main class="fallback-main">
                    <section>
                        <h2>Fonctionnalités principales :</h2>
                        <ul>
                            <li>🤖 IA vocale ultra-réaliste</li>
                            <li>📞 Réponse en 0.3 secondes</li>
                            <li>🎯 Taux de conversion 65%</li>
                            <li>💰 ROI immédiat</li>
                        </ul>
                    </section>
                    
                    <section>
                        <h2>Contact :</h2>
                        <p>Email: contact@vocalizen.com</p>
                        <p>Pour une démonstration personnalisée</p>
                    </section>
                </main>
                
                <footer class="fallback-footer">
                    <p>&copy; 2025 Vocalizen - Tous droits réservés</p>
                </footer>
            </div>
        `;
    }

    // Méthodes publiques
    preloadSection(sectionId) {
        return this.loadSection(sectionId);
    }

    clearCache() {
        this.loadedSections.clear();
    }

    getSectionStatus(sectionId) {
        return {
            loaded: this.loadedSections.has(sectionId),
            loading: this.isLoading
        };
    }
}