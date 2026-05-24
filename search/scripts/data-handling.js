// fetch data from JSON file
async function fetchData() {
    // const response = await fetch('contenido/palabras-y-frases.json');
    const now = new Date();
    const timestamp = now.getTime();
    const response = await fetch(`contenido/palabras-y-frases.json?timestamp=${timestamp}`);
    const data = await response.json();
    return data;
}