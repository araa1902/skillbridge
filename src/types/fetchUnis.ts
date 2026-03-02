export interface University {
    name: string;
}

// Parse CSV and extract organisations
function parseUniversitiesFromCSV(csvContent: string): University[] {
    return csvContent
        .split("\n")
        .slice(1) // Skip header row
        .filter((line: string) => line.trim())
        .map((line: string) => {
            const [organisation] = line.split(",");
            return { name: organisation.trim() };
        });
}

let universities: University[] = [];

// Fetch and parse CSV on load
async function loadUniversities() {
    try {
        const response = await fetch("/universities.csv");
        const csvContent = await response.text();
        universities = parseUniversitiesFromCSV(csvContent);
    } catch (error) {
        console.error("Failed to load universities from CSV:", error);
    }
}

// Load universities on import
loadUniversities();

export { universities };
