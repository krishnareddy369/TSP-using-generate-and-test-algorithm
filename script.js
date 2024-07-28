const cities = [];
const canvas = document.getElementById('tspCanvas');
const ctx = canvas.getContext('2d');
const pathCostElement = document.getElementById('pathCost');
const currentPathElement = document.getElementById('currentPath');
let bestPath = [];
let bestDistance = Infinity;

function addCity(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    cities.push({ x, y });
    drawCities();
}

function drawCities() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    cities.forEach(city => {
        ctx.beginPath();
        ctx.arc(city.x, city.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawArrow(fromX, fromY, toX, toY) {
    const headlen = 10; // length of head in pixels
    const angle = Math.atan2(toY - fromY, toX - fromX);
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle - Math.PI / 6), toY - headlen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headlen * Math.cos(angle + Math.PI / 6), toY - headlen * Math.sin(angle + Math.PI / 6));
}

function drawPath(path, color = 'blue') {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    for (let i = 0; i < path.length; i++) {
        const startCity = cities[path[i]];
        const endCity = cities[path[(i + 1) % path.length]];
        ctx.beginPath();
        drawArrow(startCity.x, startCity.y, endCity.x, endCity.y);
        ctx.stroke();
    }
}

function distance(city1, city2) {
    return Math.sqrt(Math.pow(city1.x - city2.x, 2) + Math.pow(city1.y - city2.y, 2));
}

function totalDistance(path) {
    let dist = 0;
    for (let i = 0; i < path.length - 1; i++) {
        dist += distance(cities[path[i]], cities[path[i + 1]]);
    }
    dist += distance(cities[path[path.length - 1]], cities[path[0]]);
    return dist;
}

function generatePermutations(array) {
    function permute(arr, m = []) {
        if (arr.length === 0) {
            permutations.push(m);
        } else {
            for (let i = 0; i < arr.length; i++) {
                let curr = arr.slice();
                let next = curr.splice(i, 1);
                permute(curr.slice(), m.concat(next));
            }
        }
    }

    let permutations = [];
    permute(array);
    return permutations;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function solveTSP() {
    if (cities.length < 2) {
        alert('Please add at least 2 cities.');
        return;
    }

    bestPath = [];
    bestDistance = Infinity;
    const permutations = generatePermutations([...Array(cities.length).keys()]);

    for (let i = 0; i < permutations.length; i++) {
        const path = permutations[i];
        const dist = totalDistance(path);
        currentPathElement.textContent = `Current Path: ${path.join(' -> ')}`;
        pathCostElement.textContent = `Path Cost: ${dist.toFixed(2)}`;
        drawCities();
        drawPath(path, 'red');
        await sleep(1000); // Pause to show the current path

        if (dist < bestDistance) {
            bestDistance = dist;
            bestPath = path;
        }
    }

    pathCostElement.textContent = `Path Cost: ${bestDistance.toFixed(2)}`;
    drawCities();
    drawPath(bestPath, 'blue');
}
