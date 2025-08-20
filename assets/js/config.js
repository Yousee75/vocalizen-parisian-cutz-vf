/*
 * Configuration - Vocalizen Parisian Cutz
 * Variables globales et paramètres de l'application
 */

export const CONFIG = {
    // Informations salon
    SALON: {
        name: 'Parisian Cutz',
        address: '15 Rue Brochant, 75017 Paris',
        phone: '01 42 26 XX XX',
        coordinates: [48.8888, 2.3206],
        hours: {
            monday: 'Fermé',
            tuesday: '11h-20h',
            wednesday: '11h-20h',
            thursday: '11h-20h',
            friday: '11h-20h',
            saturday: '10h-20h',
            sunday: '11h-18h'
        }
    },

    // Services et tarifs
    SERVICES: {
        coupe: { name: 'Coupe Classic', price: 27, duration: 30 },
        coupeBarbe: { name: 'Coupe + Barbe', price: 42, duration: 45 },
        barbe: { name: 'Barbe seule', price: 20, duration: 20 },
        soin: { name: 'Soin visage', price: 35, duration: 30 }
    },

    // Équipe
    TEAM: {
        morgan: {
            name: 'Morgan',
            speciality: 'Dégradés américains',
            availability: 'Mardi au samedi'
        },
        leta: {
            name: 'Leta',
            speciality: 'Barbes et coupes modernes',
            availability: 'Mercredi au dimanche'
        }
    },

    // Animation et UX
    ANIMATION: {
        scrollRevealDelay: 100,
        typewriterSpeed: 50,
        counterAnimationDuration: 2000
    },

    // API et services externes
    API: {
        leafletTiles: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        planityWebhook: 'https://api.planity.com/webhook',
        vocalAI: 'https://api.vocalizen.com/v1'
    },

    // Seuils et limites
    THRESHOLDS: {
        roiCalculator: {
            minCallsPerDay: 1,
            maxCallsPerDay: 100,
            averageCallValue: 35,
            conversionRate: 0.65
        },
        charts: {
            maxDataPoints: 30,
            refreshInterval: 60000
        }
    },

    // Couleurs pour les graphiques
    CHART_COLORS: {
        primary: '#7B3FF2',
        secondary: '#FFD700',
        success: '#00D084',
        warning: '#FFA726',
        danger: '#FF3366',
        info: '#00B4D8'
    }
};

// Messages par défaut pour l'IA
export const DEFAULT_MESSAGES = {
    welcome: "Bonjour, Parisian Cutz, comment puis-je vous aider ?",
    morgan: "Morgan est notre expert en dégradés américains, disponible du mardi au samedi",
    leta: "Leta est spécialiste des barbes et coupes modernes, présent du mercredi au dimanche",
    upsell: "Voulez-vous ajouter le soin barbe à {price}€ ?",
    confirmation: "Parfait ! RDV {day} {time} pour {service} avec {stylist}. Vous recevez le SMS de confirmation.",
    reminder: "Parisian Cutz vous rappelle votre RDV demain à {time}. À bientôt !"
};

// Règles métier par défaut
export const BUSINESS_RULES = {
    maxSlotProposals: 3,
    minSlotSpacing: 30, // minutes
    suggestUpsell: true,
    autoReminder: true,
    priorityRegularClients: true,
    workingHours: {
        start: 10,
        end: 20
    }
};

// Configuration de la carte
export const MAP_CONFIG = {
    center: [48.8888, 2.3206],
    zoom: 16,
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors',
    markers: {
        salon: {
            coords: [48.8888, 2.3206],
            title: 'Parisian Cutz',
            icon: '💇‍♂️'
        },
        competitors: [
            {
                name: 'LAKAUNI',
                coords: [48.8892, 2.3208],
                distance: 47,
                rating: 5.0,
                icon: '✂️'
            }
            // Autres concurrents seront chargés depuis competitors.json
        ]
    }
};