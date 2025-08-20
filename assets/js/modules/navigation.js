/*
 * Module Navigation - Vocalizen Parisian Cutz
 * Gestion de la navigation entre onglets et du menu mobile
 */

export class NavigationManager {
    constructor() {
        this.tabs = document.querySelectorAll('.nav-tab');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.hamburger = document.querySelector('.hamburger');
        this.navTabs = document.querySelector('.nav-tabs');
        this.currentTab = 'accueil';
        
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupMobileMenu();
        this.setupScrollEffect();
        this.setupKeyboardNavigation();
        
        // Activer le premier onglet au chargement
        this.showTab(this.currentTab);
    }

    setupTabNavigation() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = tab.getAttribute('data-tab');
                this.showTab(targetId);
                this.updateURL(targetId);
                
                // Fermer le menu mobile si ouvert
                if (this.navTabs.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            });
        });
    }

    setupMobileMenu() {
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Fermer le menu en cliquant en dehors
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container') && 
                this.navTabs.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });

        // Fermer le menu avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navTabs.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }

    setupScrollEffect() {
        let lastScrollY = window.scrollY;
        const navContainer = document.querySelector('.nav-container');

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Effet de transparence
            if (currentScrollY > 50) {
                navContainer.style.background = 'rgba(12, 14, 27, 0.98)';
                navContainer.style.backdropFilter = 'blur(15px)';
            } else {
                navContainer.style.background = 'rgba(12, 14, 27, 0.95)';
                navContainer.style.backdropFilter = 'blur(10px)';
            }

            // Auto-hide sur mobile scroll
            if (window.innerWidth <= 768) {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    navContainer.style.transform = 'translateY(-100%)';
                } else {
                    navContainer.style.transform = 'translateY(0)';
                }
            }

            lastScrollY = currentScrollY;
        });
    }

    setupKeyboardNavigation() {
        this.tabs.forEach((tab, index) => {
            tab.addEventListener('keydown', (e) => {
                let targetIndex = index;

                switch(e.key) {
                    case 'ArrowRight':
                        targetIndex = (index + 1) % this.tabs.length;
                        break;
                    case 'ArrowLeft':
                        targetIndex = index === 0 ? this.tabs.length - 1 : index - 1;
                        break;
                    case 'Home':
                        targetIndex = 0;
                        break;
                    case 'End':
                        targetIndex = this.tabs.length - 1;
                        break;
                    default:
                        return;
                }

                e.preventDefault();
                this.tabs[targetIndex].focus();
                this.tabs[targetIndex].click();
            });
        });
    }

    showTab(targetId) {
        // Vérifier que l'onglet existe
        const targetContent = document.getElementById(targetId);
        if (!targetContent) {
            console.warn(`Tab content with id "${targetId}" not found`);
            return;
        }

        // Désactiver tous les onglets et contenus
        this.tabs.forEach(t => t.classList.remove('active'));
        this.tabContents.forEach(tc => tc.classList.remove('active'));

        // Activer l'onglet cliqué
        const activeTab = document.querySelector(`[data-tab="${targetId}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Afficher le contenu correspondant
        targetContent.classList.add('active');
        
        // Mettre à jour le titre de la page
        this.updatePageTitle(targetId);
        
        // Scroll vers le haut
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Déclencher événements personnalisés
        this.triggerTabChangeEvents(targetId);
        
        this.currentTab = targetId;
    }

    toggleMobileMenu() {
        this.navTabs.classList.toggle('active');
        this.hamburger.classList.toggle('active');
        
        // Accessibility
        const isOpen = this.navTabs.classList.contains('active');
        this.hamburger.setAttribute('aria-expanded', isOpen);
        
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu() {
        this.navTabs.classList.remove('active');
        this.hamburger.classList.remove('active');
        this.hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    updateURL(tabId) {
        if (history.pushState) {
            const newUrl = `${window.location.pathname}#${tabId}`;
            history.pushState({ tab: tabId }, '', newUrl);
        }
    }

    updatePageTitle(tabId) {
        const titles = {
            'accueil': 'Vocalizen pour Parisian Cutz - Agent IA Vocal',
            'avis': 'Avis Clients - Vocalizen',
            'concurrents': 'Analyse Concurrence - Vocalizen',
            'quartier': 'Le Quartier Brochant - Vocalizen',
            'comment-ca-marche': 'Comment ça marche - Vocalizen',
            'conversations-test': 'Démos Live - Vocalizen'
        };

        document.title = titles[tabId] || 'Vocalizen pour Parisian Cutz';
    }

    triggerTabChangeEvents(tabId) {
        // Événement global
        const tabChangeEvent = new CustomEvent('tabChange', {
            detail: { 
                tabId: tabId,
                previousTab: this.currentTab
            }
        });
        document.dispatchEvent(tabChangeEvent);

        // Événements spécifiques par onglet
        switch(tabId) {
            case 'quartier':
                this.loadMapIfNeeded();
                break;
            case 'comment-ca-marche':
                this.startProcessAnimations();
                break;
            case 'conversations-test':
                this.initConversationDemos();
                break;
        }
    }

    loadMapIfNeeded() {
        const mapContainer = document.getElementById('map');
        if (mapContainer && !mapContainer.hasChildNodes()) {
            const mapLoadEvent = new CustomEvent('loadMap');
            document.dispatchEvent(mapLoadEvent);
        }
    }

    startProcessAnimations() {
        const processStats = document.querySelector('.process-stats');
        if (processStats && !processStats.classList.contains('animated')) {
            processStats.classList.add('animated');
            const animateEvent = new CustomEvent('animateCounters');
            document.dispatchEvent(animateEvent);
        }
    }

    initConversationDemos() {
        const demoButtons = document.querySelectorAll('.play-demo-btn');
        if (demoButtons.length > 0) {
            const initDemoEvent = new CustomEvent('initDemos');
            document.dispatchEvent(initDemoEvent);
        }
    }

    // Méthodes publiques pour usage externe
    getCurrentTab() {
        return this.currentTab;
    }

    goToTab(tabId) {
        this.showTab(tabId);
    }

    addTab(tabId, tabLabel, content) {
        // Créer un nouvel onglet dynamiquement
        const newTab = document.createElement('a');
        newTab.href = `#${tabId}`;
        newTab.className = 'nav-tab';
        newTab.setAttribute('data-tab', tabId);
        newTab.textContent = tabLabel;

        // Créer le contenu
        const newContent = document.createElement('div');
        newContent.id = tabId;
        newContent.className = 'tab-content';
        newContent.innerHTML = content;

        // Ajouter au DOM
        this.navTabs.appendChild(newTab);
        document.body.appendChild(newContent);

        // Réinitialiser les événements
        this.tabs = document.querySelectorAll('.nav-tab');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.setupTabNavigation();
    }
}

// Initialisation automatique si le DOM est chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.navigationManager = new NavigationManager();
    });
} else {
    window.navigationManager = new NavigationManager();
}