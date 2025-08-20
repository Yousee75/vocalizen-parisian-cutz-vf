/*
 * Module Carte - Vocalizen Parisian Cutz
 * Gestion de la carte Leaflet avec concurrents
 */

import { MAP_CONFIG } from '../config.js';

export class MapManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.isLoaded = false;
        this.competitors = [];
        
        this.init();
    }

    async init() {
        // Écouter l'événement de chargement de carte
        document.addEventListener('loadMap', () => {
            this.loadMap();
        });

        // Charger les données des concurrents
        await this.loadCompetitors();
    }

    async loadCompetitors() {
        try {
            const response = await fetch('/assets/data/competitors.json');
            if (response.ok) {
                this.competitors = await response.json();
            } else {
                // Données de fallback
                this.competitors = this.getFallbackCompetitors();
            }
        } catch (error) {
            console.warn('Impossible de charger competitors.json, utilisation des données par défaut');
            this.competitors = this.getFallbackCompetitors();
        }
    }

    getFallbackCompetitors() {
        return [
            {
                name: "LAKAUNI",
                coords: [48.8892, 2.3208],
                distance: 47,
                rating: 5.0,
                reviews: 156,
                services: ["Coupe", "Barbe", "Coloration"],
                phone: "01 42 XX XX XX"
            },
            {
                name: "Barbershop XVIII",
                coords: [48.8885, 2.3195],
                distance: 120,
                rating: 4.8,
                reviews: 89,
                services: ["Coupe", "Barbe"],
                phone: "01 43 XX XX XX"
            },
            {
                name: "Salon Elite",
                coords: [48.8900, 2.3220],
                distance: 180,
                rating: 4.6,
                reviews: 203,
                services: ["Coupe", "Coloration", "Soins"],
                phone: "01 44 XX XX XX"
            }
        ];
    }

    loadMap() {
        if (this.isLoaded || !window.L) {
            return;
        }

        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            console.warn('Container de carte non trouvé');
            return;
        }

        try {
            // Initialiser la carte
            this.map = L.map('map').setView(MAP_CONFIG.center, MAP_CONFIG.zoom);

            // Ajouter les tuiles
            L.tileLayer(MAP_CONFIG.tileServer || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: MAP_CONFIG.attribution,
                maxZoom: MAP_CONFIG.maxZoom
            }).addTo(this.map);

            // Ajouter le marqueur du salon
            this.addSalonMarker();

            // Ajouter les marqueurs des concurrents
            this.addCompetitorMarkers();

            // Configurer les contrôles
            this.setupMapControls();

            this.isLoaded = true;
            
            // Déclencher événement de carte chargée
            const mapLoadedEvent = new CustomEvent('mapLoaded');
            document.dispatchEvent(mapLoadedEvent);

        } catch (error) {
            console.error('Erreur lors du chargement de la carte:', error);
            this.showMapError();
        }
    }

    addSalonMarker() {
        // Icône personnalisée pour le salon
        const salonIcon = L.divIcon({
            className: 'salon-marker',
            html: `
                <div class="marker-salon">
                    <div class="marker-icon">💇‍♂️</div>
                    <div class="marker-pulse"></div>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });

        const salonMarker = L.marker(MAP_CONFIG.center, { icon: salonIcon })
            .addTo(this.map);

        // Popup du salon
        const salonPopup = `
            <div class="map-popup salon-popup">
                <h3>🏆 Parisian Cutz</h3>
                <div class="popup-rating">
                    <span class="stars">⭐⭐⭐⭐⭐</span>
                    <span class="rating-value">4.9/5</span>
                    <span class="rating-count">(192 avis)</span>
                </div>
                <div class="popup-services">
                    <span class="service-tag">Coupe 27€</span>
                    <span class="service-tag">Coupe+Barbe 42€</span>
                </div>
                <div class="popup-team">
                    <strong>👨‍🦲 Morgan</strong> - Dégradés américains<br>
                    <strong>👨‍🦱 Leta</strong> - Barbes & coupes modernes
                </div>
                <div class="popup-hours">
                    📍 15 Rue Brochant, 75017<br>
                    ⏰ Ouvert: 11h-20h
                </div>
            </div>
        `;

        salonMarker.bindPopup(salonPopup, {
            maxWidth: 300,
            className: 'custom-popup'
        }).openPopup();

        this.markers.push(salonMarker);
    }

    addCompetitorMarkers() {
        this.competitors.forEach((competitor, index) => {
            // Icône des concurrents
            const competitorIcon = L.divIcon({
                className: 'competitor-marker',
                html: `
                    <div class="marker-competitor">
                        <div class="marker-icon">✂️</div>
                        <div class="marker-distance">${competitor.distance}m</div>
                    </div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 30]
            });

            const marker = L.marker(competitor.coords, { icon: competitorIcon })
                .addTo(this.map);

            // Popup du concurrent
            const competitorPopup = `
                <div class="map-popup competitor-popup">
                    <h4>${competitor.name}</h4>
                    <div class="popup-rating">
                        <span class="stars">${'⭐'.repeat(Math.floor(competitor.rating))}</span>
                        <span class="rating-value">${competitor.rating}/5</span>
                        <span class="rating-count">(${competitor.reviews} avis)</span>
                    </div>
                    <div class="popup-distance">
                        📍 À ${competitor.distance}m de vous
                    </div>
                    <div class="popup-services">
                        ${competitor.services.map(service => 
                            `<span class="service-tag">${service}</span>`
                        ).join('')}
                    </div>
                    ${competitor.phone ? `<div class="popup-phone">📞 ${competitor.phone}</div>` : ''}
                </div>
            `;

            marker.bindPopup(competitorPopup, {
                maxWidth: 250,
                className: 'custom-popup competitor'
            });

            this.markers.push(marker);
        });
    }

    setupMapControls() {
        // Ajouter contrôle de zoom personnalisé
        const customZoom = L.Control.extend({
            onAdd: function(map) {
                const container = L.DomUtil.create('div', 'custom-zoom-control');
                container.innerHTML = `
                    <button class="zoom-btn zoom-in" title="Zoom avant">+</button>
                    <button class="zoom-btn zoom-out" title="Zoom arrière">-</button>
                    <button class="zoom-btn zoom-reset" title="Vue d'ensemble">🎯</button>
                `;

                // Événements des boutons
                container.querySelector('.zoom-in').onclick = () => map.zoomIn();
                container.querySelector('.zoom-out').onclick = () => map.zoomOut();
                container.querySelector('.zoom-reset').onclick = () => {
                    map.setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
                };

                return container;
            }
        });

        new customZoom({ position: 'topright' }).addTo(this.map);

        // Contrôle de filtres
        this.addFilterControl();
    }

    addFilterControl() {
        const filterControl = L.Control.extend({
            onAdd: function(map) {
                const container = L.DomUtil.create('div', 'map-filter-control');
                container.innerHTML = `
                    <div class="filter-header">Filtres</div>
                    <label>
                        <input type="checkbox" id="show-competitors" checked>
                        Concurrents
                    </label>
                    <label>
                        <input type="checkbox" id="show-distances" checked>
                        Distances
                    </label>
                `;

                // Événements des filtres
                container.querySelector('#show-competitors').onchange = (e) => {
                    this.toggleCompetitors(e.target.checked);
                };

                container.querySelector('#show-distances').onchange = (e) => {
                    this.toggleDistances(e.target.checked);
                };

                return container;
            }.bind(this)
        });

        new filterControl({ position: 'topleft' }).addTo(this.map);
    }

    toggleCompetitors(show) {
        this.markers.forEach((marker, index) => {
            if (index > 0) { // Skip salon marker (index 0)
                if (show) {
                    marker.addTo(this.map);
                } else {
                    this.map.removeLayer(marker);
                }
            }
        });
    }

    toggleDistances(show) {
        const distanceElements = document.querySelectorAll('.marker-distance');
        distanceElements.forEach(el => {
            el.style.display = show ? 'block' : 'none';
        });
    }

    showMapError() {
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div class="map-error">
                    <div class="error-icon">🗺️</div>
                    <h3>Carte temporairement indisponible</h3>
                    <p>Nous travaillons à résoudre ce problème.</p>
                    <button onclick="location.reload()" class="btn-retry">
                        Réessayer
                    </button>
                </div>
            `;
        }
    }

    // Méthodes publiques
    focusOnSalon() {
        if (this.map) {
            this.map.setView(MAP_CONFIG.center, MAP_CONFIG.zoom);
        }
    }

    addCustomMarker(coords, content, options = {}) {
        if (!this.map) return null;

        const marker = L.marker(coords, options).addTo(this.map);
        if (content) {
            marker.bindPopup(content);
        }
        this.markers.push(marker);
        return marker;
    }

    removeAllMarkers() {
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers = [];
    }

    destroy() {
        if (this.map) {
            this.map.remove();
            this.map = null;
            this.isLoaded = false;
        }
    }
}