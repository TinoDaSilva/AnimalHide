// Animal Hide Agent - JavaScript functionality
class AnimalHideAgent {
    constructor() {
        this.animalData = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadStoredData();
    }

    bindEvents() {
        document.getElementById('fetchData').addEventListener('click', () => this.fetchAnimalData());
        document.getElementById('clearData').addEventListener('click', () => this.clearData());
    }

    async fetchAnimalData() {
        this.showLoading();
        this.hideError();
        this.hideDataContainer();

        try {
            // Simulate fetching animal data from multiple sources
            const animalData = await this.getAnimalData();
            this.animalData = animalData;
            this.displayData(animalData);
            this.updateStats();
            this.storeData();
        } catch (error) {
            console.error('Error fetching data:', error);
            this.showError();
        }
    }

    async getAnimalData() {
        // Simulate API calls with different animal data sources
        const animals = [
            {
                id: 1,
                name: "African Elephant",
                habitat: "Savannas and forests of Africa",
                population: "415,000",
                conservationStatus: "Endangered",
                description: "The largest land mammal, known for its intelligence and complex social structures.",
                image: "🐘",
                threat: "Habitat loss and poaching"
            },
            {
                id: 2,
                name: "Bengal Tiger",
                habitat: "Mangrove swamps and grasslands of India",
                population: "2,500",
                conservationStatus: "Endangered",
                description: "One of the most majestic big cats, known for its distinctive orange coat with black stripes.",
                image: "🐅",
                threat: "Habitat destruction and poaching"
            },
            {
                id: 3,
                name: "Giant Panda",
                habitat: "Bamboo forests in central China",
                population: "1,864",
                conservationStatus: "Vulnerable",
                description: "A beloved symbol of wildlife conservation, primarily feeds on bamboo.",
                image: "🐼",
                threat: "Habitat fragmentation"
            },
            {
                id: 4,
                name: "Blue Whale",
                habitat: "Deep ocean waters worldwide",
                population: "10,000-25,000",
                conservationStatus: "Endangered",
                description: "The largest animal ever known to have lived on Earth.",
                image: "🐋",
                threat: "Ocean pollution and climate change"
            },
            {
                id: 5,
                name: "Snow Leopard",
                habitat: "High mountains of Central and South Asia",
                population: "4,000-6,500",
                conservationStatus: "Vulnerable",
                description: "A beautiful and elusive big cat adapted to life in extreme mountain environments.",
                image: "🐆",
                threat: "Climate change and human conflict"
            }
        ];

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        return animals;
    }

    displayData(data) {
        const container = document.getElementById('animalData');
        container.innerHTML = '';

        data.forEach(animal => {
            const animalCard = document.createElement('div');
            animalCard.className = 'animal-card';
            animalCard.innerHTML = `
                <h3>${animal.image} ${animal.name}</h3>
                <p><strong>Habitat:</strong> ${animal.habitat}</p>
                <p><strong>Population:</strong> ${animal.population}</p>
                <p><strong>Conservation Status:</strong> ${animal.conservationStatus}</p>
                <p><strong>Description:</strong> ${animal.description}</p>
                <p><strong>Main Threat:</strong> ${animal.threat}</p>
            `;
            container.appendChild(animalCard);
        });

        this.showDataContainer();
    }

    updateStats() {
        document.getElementById('totalCount').textContent = this.animalData.length;
        document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }

    showDataContainer() {
        this.hideLoading();
        document.getElementById('dataContainer').classList.remove('hidden');
    }

    hideDataContainer() {
        document.getElementById('dataContainer').classList.add('hidden');
    }

    showError() {
        this.hideLoading();
        document.getElementById('error').classList.remove('hidden');
    }

    hideError() {
        document.getElementById('error').classList.add('hidden');
    }

    clearData() {
        this.animalData = [];
        this.hideDataContainer();
        this.hideError();
        document.getElementById('animalData').innerHTML = '';
        document.getElementById('totalCount').textContent = '0';
        document.getElementById('lastUpdated').textContent = 'Never';
        localStorage.removeItem('animalHideAgentData');
    }

    storeData() {
        localStorage.setItem('animalHideAgentData', JSON.stringify({
            data: this.animalData,
            timestamp: new Date().toISOString()
        }));
    }

    loadStoredData() {
        const stored = localStorage.getItem('animalHideAgentData');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                this.animalData = parsed.data;
                if (parsed.data.length > 0) {
                    this.displayData(parsed.data);
                    this.updateStats();
                }
            } catch (error) {
                console.error('Error loading stored data:', error);
            }
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimalHideAgent();
});

// Add some interactive features
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const fetchBtn = document.getElementById('fetchData');
        if (fetchBtn && document.activeElement !== fetchBtn) {
            fetchBtn.click();
        }
    }
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        document.getElementById('clearData').click();
    }
});
