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
        if (!response.ok) {
            console.error("Failed to load universities: response not OK");
            return;
        }
        const contentType = response.headers.get("content-type");
        const csvContent = await response.text();

        // Robust check: if it looks like HTML, don't parse it
        if (csvContent.trim().startsWith("<") || (contentType && contentType.includes("text/html"))) {
            console.error("Failed to load universities: received HTML instead of CSV", { contentType, preview: csvContent.slice(0, 100) });
            return;
        }

        universities = parseUniversitiesFromCSV(csvContent);
    } catch (error) {
        console.error("Failed to load universities from CSV:", error);
    }
}

// Load universities on import
loadUniversities();

export { universities };
