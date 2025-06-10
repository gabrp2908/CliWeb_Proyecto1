document.addEventListener('DOMContentLoaded', function() {
    let matrixSize = 2;
    let matrixA = [];
    let matrixB = [];
    
    // Elementos del DOM
    const sizeInput = document.getElementById('matrix-size');
    const applySizeBtn = document.getElementById('apply-size');
    const randomFillBtn = document.getElementById('random-fill');
    const clearBtn = document.getElementById('clear-matrices');
    const exampleBtn = document.getElementById('load-example');
    const matrixAGrid = document.getElementById('grid-a');
    const matrixBGrid = document.getElementById('grid-b');
    const resultMatrix = document.getElementById('result-matrix');
    const resultScalar = document.getElementById('result-scalar');
    const errorMessage = document.getElementById('error-message');
    
    // Inicialización
    initMatrixGrids();
    
    // Event listeners
    applySizeBtn.addEventListener('click', function() {
        const newSize = parseInt(sizeInput.value);
        if (newSize >= 2 && newSize <= 10) {
            matrixSize = newSize;
            initMatrixGrids();
            clearResults();
        } else {
            showError('El tamaño de la matriz debe estar entre 2 y 10');
        }
    });
    
    randomFillBtn.addEventListener('click', fillMatricesRandomly);
    clearBtn.addEventListener('click', clearMatrices);
    exampleBtn.addEventListener('click', loadExample);

    document.querySelectorAll('.operation-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const operation = this.getAttribute('data-op');
            executeOperation(operation);
        });
    });

    function initMatrixGrids() {
        matrixAGrid.innerHTML = '';
        matrixBGrid.innerHTML = '';
        
        matrixA = createEmptyMatrix(matrixSize);
        matrixB = createEmptyMatrix(matrixSize);
        
        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
                // Matriz A
                const inputA = document.createElement('input');
                inputA.type = 'number';
                inputA.value = '0';
                inputA.dataset.row = i;
                inputA.dataset.col = j;
                inputA.addEventListener('input', function() {
                    matrixA[i][j] = parseFloat(this.value) || 0;
                });
                matrixAGrid.appendChild(inputA);
                
                // Matriz B
                const inputB = document.createElement('input');
                inputB.type = 'number';
                inputB.value = '0';
                inputB.dataset.row = i;
                inputB.dataset.col = j;
                inputB.addEventListener('input', function() {
                    matrixB[i][j] = parseFloat(this.value) || 0;
                });
                matrixBGrid.appendChild(inputB);
            }
        }
        
        // Ajustar el grid
        matrixAGrid.style.gridTemplateColumns = `repeat(${matrixSize}, 1fr)`;
        matrixBGrid.style.gridTemplateColumns = `repeat(${matrixSize}, 1fr)`;
    }

    function createEmptyMatrix(size) {
        return Array(size).fill().map(() => Array(size).fill(0));
    }
   
    function fillMatricesRandomly() {
        const inputsA = matrixAGrid.querySelectorAll('input');
        const inputsB = matrixBGrid.querySelectorAll('input');
        
        inputsA.forEach(input => {
            const value = Math.floor(Math.random() * 21) - 10; // -10 a 10
            input.value = value;
            matrixA[parseInt(input.dataset.row)][parseInt(input.dataset.col)] = value;
        });
        
        inputsB.forEach(input => {
            const value = Math.floor(Math.random() * 21) - 10; // -10 a 10
            input.value = value;
            matrixB[parseInt(input.dataset.row)][parseInt(input.dataset.col)] = value;
        });
        
        clearResults();
    }
    
    function clearMatrices() {
        const inputsA = matrixAGrid.querySelectorAll('input');
        const inputsB = matrixBGrid.querySelectorAll('input');
        
        inputsA.forEach(input => {
            input.value = '0';
            matrixA[parseInt(input.dataset.row)][parseInt(input.dataset.col)] = 0;
        });
        
        inputsB.forEach(input => {
            input.value = '0';
            matrixB[parseInt(input.dataset.row)][parseInt(input.dataset.col)] = 0;
        });
        
        clearResults();
    }
    
    function loadExample() {
        // Ejemplo de matrices 2x2
        if (matrixSize === 2) {
            const exampleA = [[1, 2], [3, 4]];
            const exampleB = [[5, 6], [7, 8]];
            
            const inputsA = matrixAGrid.querySelectorAll('input');
            const inputsB = matrixBGrid.querySelectorAll('input');
            
            inputsA.forEach((input, index) => {
                const row = Math.floor(index / matrixSize);
                const col = index % matrixSize;
                input.value = exampleA[row][col];
                matrixA[row][col] = exampleA[row][col];
            });
            
            inputsB.forEach((input, index) => {
                const row = Math.floor(index / matrixSize);
                const col = index % matrixSize;
                input.value = exampleB[row][col];
                matrixB[row][col] = exampleB[row][col];
            });
        } else {
            showError('El ejemplo está configurado solo para matrices 2x2. Cambia el tamaño a 2 para verlo.');
        }
    }

    
});