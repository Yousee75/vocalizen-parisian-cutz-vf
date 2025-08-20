/*
 * Application Principal - Vocalizen Parisian Cutz
 * Point d'entrée et orchestration des modules
 */

import { CONFIG } from './config.js';
import { NavigationManager } from './modules/navigation.js';
import { MapManager } from './modules/map.js';
import { ConversationsManager } from './modules/conversations.js';

class VocalizenApp {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        console.log('🚀 Initialisation Vocalizen App');
        
        try {
            // Initialiser les modules principaux
            await this.initializeModules();
            
            // Configuration de l'application
            this.setupGlobalEventListeners();
            this.setupAnimations();
            this.setupUtilities();
            
            // Marquer comme initialisé
            this.isInitialized = true;
            
            // Déclencher l'événement d'initialisation
            this.dispatchAppReady();
            
            console.log('✅ Application initialisée avec succès');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            this.handleInitError(error);
        }
    }

    async initializeModules() {
        // Navigation (prioritaire)
        this.modules.navigation = new NavigationManager();
        
        // Carte (lazy loading)
        this.modules.map = new MapManager();
        
        // Conversations (lazy loading)
        this.modules.conversations = new ConversationsManager();
        
        // Autres modules peuvent être ajoutés ici
        await this.loadAdditionalModules();
    }

    async loadAdditionalModules() {
        // Calculateur ROI (si présent)
        try {
            const { CalculatorManager } = await import('./modules/calculator.js');
            this.modules.calculator = new CalculatorManager();
        } catch (error) {
            console.warn('Module calculateur non disponible');
        }

        // Gestionnaire d'animations (si présent)
        try {
            const { AnimationsManager } = await import('./modules/animations.js');
            this.modules.animations = new AnimationsManager();
        } catch (error) {
            console.warn('Module animations non disponible');
        }

        // Gestionnaire de graphiques (si présent)
        try {
            const { ChartsManager } = await import('./modules/charts.js');
            this.modules.charts = new ChartsManager();
        } catch (error) {
            console.warn('Module graphiques non disponible');
        }
    }

    setupGlobalEventListeners() {
        // Gestion des erreurs globales
        window.addEventListener('error', (e) => {
            console.error('Erreur JavaScript:', e.error);
            this.handleError(e.error);
        });

        // Gestion des erreurs de ressources
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promise rejetée:', e.reason);
            this.handleError(e.reason);
        });

        // Changement de taille de fenêtre
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });

        // Événements de visibilité de la page
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.handlePageVisible();
            } else {
                this.handlePageHidden();
            }
        });

        // Navigation avec historique
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.tab) {
                this.modules.navigation?.goToTab(e.state.tab);
            }
        });
    }

    setupAnimations() {
        // Intersection Observer pour les animations au scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Animations spécifiques
                    this.handleElementAnimation(entry.target);
                }
            });
        }, observerOptions);

        // Observer tous les éléments avec la classe 'reveal'
        document.querySelectorAll('.reveal, .card, .timeline-step').forEach(el => {
            animationObserver.observe(el);
        });

        // Animation des compteurs
        document.addEventListener('animateCounters', () => {
            this.animateCounters();
        });
    }

    setupUtilities() {
        // Smooth scroll pour les liens d'ancrage
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (link && link.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });

        // Gestion des formulaires (si présents)
        this.setupForms();
        
        // Gestion du clavier
        this.setupKeyboardShortcuts();
        
        // Performance monitoring
        this.setupPerformanceMonitoring();
    }

    setupForms() {
        // Validation des formulaires de contact/configuration
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        });

        // Configuration IA - Sauvegarde automatique
        const configInputs = document.querySelectorAll('input[type="range"], textarea, input[type="checkbox"]');
        configInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.saveConfiguration(input);
            });
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Raccourcis pour la navigation
            if (e.altKey) {
                const shortcuts = {
                    '1': 'accueil',
                    '2': 'avis',
                    '3': 'concurrents',
                    '4': 'quartier',
                    '5': 'comment-ca-marche',
                    '6': 'conversations-test'
                };

                if (shortcuts[e.key]) {
                    e.preventDefault();
                    this.modules.navigation?.goToTab(shortcuts[e.key]);
                }
            }
        });
    }

    setupPerformanceMonitoring() {
        // Mesurer les performances critiques
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                    
                    if (loadTime > 3000) { // Plus de 3 secondes
                        console.warn(`⚠️ Temps de chargement lent: ${loadTime}ms`);
                    }
                }, 1000);
            });
        }
    }

    handleElementAnimation(element) {
        // Animations spécifiques par type d'élément
        if (element.classList.contains('process-stats')) {
            this.animateCounters();
        }
        
        if (element.classList.contains('chart-container')) {
            const chartEvent = new CustomEvent('loadChart', {
                detail: { element }
            });
            document.dispatchEvent(chartEvent);
        }
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        counters.forEach(counter => {
            if (counter.classList.contains('animated')) return;
            
            const target = parseFloat(counter.getAttribute('data-target'));
            const duration = CONFIG.ANIMATION.counterAnimationDuration;
            const increment = target / (duration / 16);
            let current = 0;

            counter.classList.add('animated');

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = current.toFixed(target < 10 ? 1 : 0);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }

    validateForm(form) {
        // Validation basique des formulaires
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    saveConfiguration(input) {
        // Sauvegarder la configuration en localStorage
        const key = input.id || input.name;
        const value = input.type === 'checkbox' ? input.checked : input.value;
        
        try {
            localStorage.setItem(`vocalizen_${key}`, JSON.stringify(value));
        } catch (error) {
            console.warn('Impossible de sauvegarder la configuration:', error);
        }
    }

    loadConfiguration() {
        // Charger la configuration sauvegardée
        const inputs = document.querySelectorAll('input[type="range"], textarea, input[type="checkbox"]');
        inputs.forEach(input => {
            const key = input.id || input.name;
            try {
                const saved = localStorage.getItem(`vocalizen_${key}`);
                if (saved !== null) {
                    const value = JSON.parse(saved);
                    if (input.type === 'checkbox') {
                        input.checked = value;
                    } else {
                        input.value = value;
                    }
                }
            } catch (error) {
                console.warn('Erreur lors du chargement de la configuration:', error);
            }
        });
    }

    handleResize() {
        // Réajustements nécessaires lors du redimensionnement
        if (this.modules.map && this.modules.map.map) {
            this.modules.map.map.invalidateSize();
        }

        // Réajuster les graphiques si présents
        if (this.modules.charts) {
            this.modules.charts.resize();
        }
    }

    handlePageVisible() {
        // Actions quand la page redevient visible
        console.log('Page visible');
    }

    handlePageHidden() {
        // Actions quand la page est cachée
        console.log('Page cachée');
        
        // Pause des démos en cours
        if (this.modules.conversations) {
            Object.keys(this.modules.conversations.isPlaying).forEach(demoId => {
                if (this.modules.conversations.isPlaying[demoId]) {
                    this.modules.conversations.pauseDemo(demoId);
                }
            });
        }
    }

    handleError(error) {
        // Gestion centralisée des erreurs
        const errorInfo = {
            message: error.message || 'Erreur inconnue',
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Log local pour debugging
        console.error('Erreur capturée:', errorInfo);

        // Optionnel: Envoyer à un service de monitoring
        // this.sendErrorReport(errorInfo);
    }

    handleInitError(error) {
        // Affichage d'erreur pour les problèmes d'initialisation
        const errorDiv = document.createElement('div');
        errorDiv.className = 'init-error';
        errorDiv.innerHTML = `
            <div class="error-content">
                <h2>🚨 Erreur d'initialisation</h2>
                <p>Une erreur s'est produite lors du chargement de l'application.</p>
                <button onclick="location.reload()" class="btn-retry">
                    Recharger la page
                </button>
                <details style="margin-top: 1rem;">
                    <summary>Détails techniques</summary>
                    <pre>${error.message}\n${error.stack}</pre>
                </details>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }

    dispatchAppReady() {
        const appReadyEvent = new CustomEvent('appReady', {
            detail: {
                modules: Object.keys(this.modules),
                config: CONFIG,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(appReadyEvent);
    }

    // API publique
    getModule(name) {
        return this.modules[name];
    }

    isReady() {
        return this.isInitialized;
    }

    destroy() {
        // Nettoyage lors de la destruction
        Object.values(this.modules).forEach(module => {
            if (module.destroy && typeof module.destroy === 'function') {
                module.destroy();
            }
        });
    }
}

// Initialisation automatique
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.vocalizenApp = new VocalizenApp();
    });
} else {
    window.vocalizenApp = new VocalizenApp();
}

// Export pour utilisation externe
export default VocalizenApp;