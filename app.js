// Urban Wellbeing Intelligence Platform - JavaScript

// Application Data
const appData = {
  "city_metrics": {
    "city": "Delhi",
    "population": "32.9 million",
    "area_sqkm": 1484,
    "overall_aqi": 287,
    "overall_livability": 52,
    "water_security_index": 45,
    "green_cover_percentage": 19,
    "last_updated": "2025-09-24T14:51:21.398700",
    "recommendations": [
      "Increase green cover by 20% in Connaught Place area",
      "Install rainwater harvesting systems in East Delhi",
      "Implement odd-even vehicle scheme during peak pollution days",
      "Create more pedestrian zones to reduce vehicular emissions",
      "Establish air purification towers in high AQI areas"
    ]
  },
  "air_quality": [
    {
      "district": "Connaught Place",
      "aqi": 307,
      "pm25": 192,
      "pm10": 157,
      "category": "Hazardous",
      "color": "#7e0023",
      "coordinates": {"lat": 28.540, "lng": 77.546},
      "timestamp": "2025-09-24T14:51:21.398700"
    },
    {
      "district": "Karol Bagh",
      "aqi": 234,
      "pm25": 145,
      "pm10": 201,
      "category": "Very Unhealthy",
      "color": "#8f3f97",
      "coordinates": {"lat": 28.645, "lng": 77.190},
      "timestamp": "2025-09-24T14:51:21.398700"
    },
    {
      "district": "Lajpat Nagar",
      "aqi": 189,
      "pm25": 98,
      "pm10": 165,
      "category": "Unhealthy",
      "color": "#ff0000",
      "coordinates": {"lat": 28.565, "lng": 77.243},
      "timestamp": "2025-09-24T14:51:21.398700"
    },
    {
      "district": "Dwarka",
      "aqi": 167,
      "pm25": 89,
      "pm10": 142,
      "category": "Unhealthy",
      "color": "#ff0000",
      "coordinates": {"lat": 28.582, "lng": 77.046},
      "timestamp": "2025-09-24T14:51:21.398700"
    },
    {
      "district": "Rohini",
      "aqi": 203,
      "pm25": 123,
      "pm10": 178,
      "category": "Very Unhealthy",
      "color": "#8f3f97",
      "coordinates": {"lat": 28.745, "lng": 77.117},
      "timestamp": "2025-09-24T14:51:21.398700"
    }
  ],
  "water_data": [
    {
      "area": "Yamuna Floodplains",
      "flood_risk": "Very High",
      "water_stress": "High",
      "flood_risk_score": 87,
      "water_availability": 32,
      "risk_color": "#ff0000",
      "stress_color": "#ff7f00",
      "coordinates": {"lat": 28.656, "lng": 77.241}
    },
    {
      "area": "East Delhi",
      "flood_risk": "Medium",
      "water_stress": "Critical",
      "flood_risk_score": 54,
      "water_availability": 23,
      "risk_color": "#ffff00",
      "stress_color": "#8b0000",
      "coordinates": {"lat": 28.631, "lng": 77.298}
    },
    {
      "area": "South Delhi",
      "flood_risk": "Low",
      "water_stress": "Medium",
      "flood_risk_score": 23,
      "water_availability": 67,
      "risk_color": "#00ff00",
      "stress_color": "#ffff00",
      "coordinates": {"lat": 28.524, "lng": 77.206}
    }
  ],
  "green_spaces": [
    {
      "zone": "Central Park Area",
      "green_cover_percent": 67,
      "ndvi_value": 0.642,
      "livability_score": 78,
      "health_index": 70.7,
      "tree_count": 1456,
      "park_area_sqkm": 2.3,
      "coordinates": {"lat": 28.613, "lng": 77.209}
    },
    {
      "zone": "Lodhi Gardens",
      "green_cover_percent": 82,
      "ndvi_value": 0.751,
      "livability_score": 89,
      "health_index": 84.2,
      "tree_count": 1876,
      "park_area_sqkm": 3.1,
      "coordinates": {"lat": 28.593, "lng": 77.217}
    },
    {
      "zone": "India Gate",
      "green_cover_percent": 45,
      "ndvi_value": 0.432,
      "livability_score": 71,
      "health_index": 56.3,
      "tree_count": 789,
      "park_area_sqkm": 1.8,
      "coordinates": {"lat": 28.613, "lng": 77.229}
    }
  ]
};

// Global variables for maps
let dashboardMap, airQualityMap, waterRiskMap, greenSpacesMap;
let charts = {};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupTabNavigation();
    populateRecommendations();
    initializeDashboardMap();
    populateAirQualityCards();
    populateWaterCards();
    populateGreenCards();
    setupCharts();
}

// Tab Navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Initialize maps when tabs are switched
            setTimeout(() => {
                switch(targetTab) {
                    case 'air-quality':
                        if (!airQualityMap) initializeAirQualityMap();
                        break;
                    case 'water-risk':
                        if (!waterRiskMap) initializeWaterRiskMap();
                        break;
                    case 'green-spaces':
                        if (!greenSpacesMap) initializeGreenSpacesMap();
                        break;
                    case 'analytics':
                        if (Object.keys(charts).length === 0) setupCharts();
                        break;
                }
            }, 100);
        });
    });
}

// Populate Recommendations
function populateRecommendations() {
    const recommendationsList = document.getElementById('recommendations-list');
    appData.city_metrics.recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        recommendationsList.appendChild(li);
    });
}

// Map Initialization Functions
function initializeDashboardMap() {
    dashboardMap = L.map('dashboard-map').setView([28.6139, 77.2090], 10);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(dashboardMap);
    
    // Add markers for all data points
    addAirQualityMarkers(dashboardMap);
    addWaterRiskMarkers(dashboardMap);
    addGreenSpaceMarkers(dashboardMap);
}

function initializeAirQualityMap() {
    airQualityMap = L.map('air-quality-map').setView([28.6139, 77.2090], 10);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(airQualityMap);
    
    addAirQualityMarkers(airQualityMap);
}

function initializeWaterRiskMap() {
    waterRiskMap = L.map('water-risk-map').setView([28.6139, 77.2090], 10);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(waterRiskMap);
    
    addWaterRiskMarkers(waterRiskMap);
}

function initializeGreenSpacesMap() {
    greenSpacesMap = L.map('green-spaces-map').setView([28.6139, 77.2090], 10);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(greenSpacesMap);
    
    addGreenSpaceMarkers(greenSpacesMap);
}

// Marker Functions
function addAirQualityMarkers(map) {
    appData.air_quality.forEach(data => {
        const marker = L.circleMarker([data.coordinates.lat, data.coordinates.lng], {
            color: data.color,
            fillColor: data.color,
            fillOpacity: 0.7,
            radius: Math.max(8, data.aqi / 30)
        }).addTo(map);
        
        const popupContent = `
            <strong>${data.district}</strong><br>
            AQI: <span style="color: ${data.color}; font-weight: bold;">${data.aqi}</span><br>
            Category: ${data.category}<br>
            PM2.5: ${data.pm25} μg/m³<br>
            PM10: ${data.pm10} μg/m³
        `;
        
        marker.bindPopup(popupContent);
    });
}

function addWaterRiskMarkers(map) {
    appData.water_data.forEach(data => {
        const marker = L.circleMarker([data.coordinates.lat, data.coordinates.lng], {
            color: data.risk_color,
            fillColor: data.stress_color,
            fillOpacity: 0.7,
            radius: data.flood_risk_score / 5
        }).addTo(map);
        
        const popupContent = `
            <strong>${data.area}</strong><br>
            Flood Risk: <span style="color: ${data.risk_color}; font-weight: bold;">${data.flood_risk}</span><br>
            Water Stress: <span style="color: ${data.stress_color}; font-weight: bold;">${data.water_stress}</span><br>
            Risk Score: ${data.flood_risk_score}/100<br>
            Water Availability: ${data.water_availability}%
        `;
        
        marker.bindPopup(popupContent);
    });
}

function addGreenSpaceMarkers(map) {
    appData.green_spaces.forEach(data => {
        const greenIntensity = Math.min(255, Math.floor(data.green_cover_percent * 2.55));
        const color = `rgb(0, ${greenIntensity}, 0)`;
        
        const marker = L.circleMarker([data.coordinates.lat, data.coordinates.lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.7,
            radius: data.livability_score / 5
        }).addTo(map);
        
        const popupContent = `
            <strong>${data.zone}</strong><br>
            Green Cover: ${data.green_cover_percent}%<br>
            NDVI: ${data.ndvi_value}<br>
            Livability Score: ${data.livability_score}<br>
            Trees: ${data.tree_count.toLocaleString()}<br>
            Park Area: ${data.park_area_sqkm} km²
        `;
        
        marker.bindPopup(popupContent);
    });
}

// Card Population Functions
function populateAirQualityCards() {
    const container = document.getElementById('district-cards');
    
    appData.air_quality.forEach(data => {
        const card = createDistrictCard(data);
        container.appendChild(card);
    });
}

function createDistrictCard(data) {
    const card = document.createElement('div');
    card.className = 'district-card';
    
    const categoryClass = data.category.toLowerCase().replace(/\s+/g, '-');
    
    card.innerHTML = `
        <div class="card-title">
            ${data.district}
            <span class="status-badge ${categoryClass}">${data.category}</span>
        </div>
        <div class="card-metrics">
            <div class="metric">
                <span class="metric-name">AQI</span>
                <span class="metric-value-display" style="color: ${data.color}; font-weight: bold;">${data.aqi}</span>
            </div>
            <div class="metric">
                <span class="metric-name">PM2.5</span>
                <span class="metric-value-display">${data.pm25} μg/m³</span>
            </div>
            <div class="metric">
                <span class="metric-name">PM10</span>
                <span class="metric-value-display">${data.pm10} μg/m³</span>
            </div>
            <div class="metric">
                <span class="metric-name">Updated</span>
                <span class="metric-value-display">${new Date(data.timestamp).toLocaleTimeString()}</span>
            </div>
        </div>
    `;
    
    return card;
}

function populateWaterCards() {
    const container = document.getElementById('water-cards');
    
    appData.water_data.forEach(data => {
        const card = createWaterCard(data);
        container.appendChild(card);
    });
}

function createWaterCard(data) {
    const card = document.createElement('div');
    card.className = 'water-card';
    
    const riskClass = data.flood_risk.toLowerCase().replace(/\s+/g, '-');
    const stressClass = data.water_stress.toLowerCase();
    
    card.innerHTML = `
        <div class="card-title">
            ${data.area}
        </div>
        <div class="card-metrics">
            <div class="metric">
                <span class="metric-name">Flood Risk</span>
                <span class="metric-value-display">
                    ${data.flood_risk}
                    <span class="status-badge ${riskClass}">${data.flood_risk_score}</span>
                </span>
            </div>
            <div class="metric">
                <span class="metric-name">Water Stress</span>
                <span class="metric-value-display">
                    ${data.water_stress}
                    <span class="status-badge ${stressClass}">${data.water_availability}%</span>
                </span>
            </div>
        </div>
    `;
    
    return card;
}

function populateGreenCards() {
    const container = document.getElementById('green-cards');
    
    appData.green_spaces.forEach(data => {
        const card = createGreenCard(data);
        container.appendChild(card);
    });
}

function createGreenCard(data) {
    const card = document.createElement('div');
    card.className = 'green-card';
    
    card.innerHTML = `
        <div class="card-title">
            ${data.zone}
            <span class="status-badge good">${data.livability_score}</span>
        </div>
        <div class="card-metrics">
            <div class="metric">
                <span class="metric-name">Green Cover</span>
                <span class="metric-value-display">${data.green_cover_percent}%</span>
            </div>
            <div class="metric">
                <span class="metric-name">NDVI</span>
                <span class="metric-value-display">${data.ndvi_value}</span>
            </div>
            <div class="metric">
                <span class="metric-name">Trees</span>
                <span class="metric-value-display">${data.tree_count.toLocaleString()}</span>
            </div>
            <div class="metric">
                <span class="metric-name">Area</span>
                <span class="metric-value-display">${data.park_area_sqkm} km²</span>
            </div>
        </div>
    `;
    
    return card;
}

// Chart Setup
function setupCharts() {
    setupAQIChart();
    setupGreenLivabilityChart();
    setupWaterRiskChart();
}

function setupAQIChart() {
    const ctx = document.getElementById('aqi-chart').getContext('2d');
    
    charts.aqiChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: appData.air_quality.map(d => d.district),
            datasets: [{
                label: 'AQI Values',
                data: appData.air_quality.map(d => d.aqi),
                backgroundColor: appData.air_quality.map(d => d.color),
                borderColor: appData.air_quality.map(d => d.color),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'AQI Value'
                    }
                }
            }
        }
    });
}

function setupGreenLivabilityChart() {
    const ctx = document.getElementById('green-livability-chart').getContext('2d');
    
    charts.greenChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Green Cover vs Livability',
                data: appData.green_spaces.map(d => ({
                    x: d.green_cover_percent,
                    y: d.livability_score
                })),
                backgroundColor: '#1FB8CD',
                borderColor: '#1FB8CD'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Green Cover Percentage'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Livability Score'
                    }
                }
            }
        }
    });
}

function setupWaterRiskChart() {
    const ctx = document.getElementById('water-risk-chart').getContext('2d');
    
    charts.waterChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: appData.water_data.map(d => d.area),
            datasets: [{
                label: 'Flood Risk Scores',
                data: appData.water_data.map(d => d.flood_risk_score),
                backgroundColor: ['#FFC185', '#B4413C', '#5D878F']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Export Functionality
function exportReport() {
    const reportData = {
        city: appData.city_metrics.city,
        generated_on: new Date().toISOString(),
        overall_metrics: appData.city_metrics,
        air_quality_summary: {
            districts: appData.air_quality.length,
            average_aqi: Math.round(appData.air_quality.reduce((sum, d) => sum + d.aqi, 0) / appData.air_quality.length),
            hazardous_areas: appData.air_quality.filter(d => d.category === 'Hazardous').length
        },
        water_risk_summary: {
            areas_assessed: appData.water_data.length,
            high_risk_areas: appData.water_data.filter(d => d.flood_risk === 'Very High' || d.flood_risk === 'High').length,
            average_water_availability: Math.round(appData.water_data.reduce((sum, d) => sum + d.water_availability, 0) / appData.water_data.length)
        },
        green_spaces_summary: {
            zones_analyzed: appData.green_spaces.length,
            average_green_cover: Math.round(appData.green_spaces.reduce((sum, d) => sum + d.green_cover_percent, 0) / appData.green_spaces.length),
            total_trees: appData.green_spaces.reduce((sum, d) => sum + d.tree_count, 0)
        }
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `delhi_urban_wellbeing_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    alert('Report exported successfully! Check your downloads folder.');
}

// Utility Functions
function formatTimestamp(timestamp) {
    return new Date(timestamp).toLocaleString();
}

function getAQICategory(aqi) {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
}