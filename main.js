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

    function executeOperation(operation) {
        clearResults();
        
        try {
            let result;
            
            switch(operation) {
                case 'add':
                    result = addMatrices(matrixA, matrixB);
                    displayMatrixResult(result, 'A + B =');
                    break;
                case 'subtract-ab':
                    result = subtractMatrices(matrixA, matrixB);
                    displayMatrixResult(result, 'A - B =');
                    break;
                case 'subtract-ba':
                    result = subtractMatrices(matrixB, matrixA);
                    displayMatrixResult(result, 'B - A =');
                    break;
                case 'multiply':
                    result = multiplyMatrices(matrixA, matrixB);
                    displayMatrixResult(result, 'A × B =');
                    break;
                case 'scalar-a':
                    const scalarA = prompt('Ingrese el valor escalar para multiplicar la matriz A:');
                    if (scalarA !== null) {
                        const k = parseFloat(scalarA);
                        if (!isNaN(k)) {
                            result = scalarMultiply(k, matrixA);
                            displayMatrixResult(result, `${k} × A =`);
                        } else {
                            showError('Por favor ingrese un número válido');
                        }
                    }
                    break;
                case 'scalar-b':
                    const scalarB = prompt('Ingrese el valor escalar para multiplicar la matriz B:');
                    if (scalarB !== null) {
                        const k = parseFloat(scalarB);
                        if (!isNaN(k)) {
                            result = scalarMultiply(k, matrixB);
                            displayMatrixResult(result, `${k} × B =`);
                        } else {
                            showError('Por favor ingrese un número válido');
                        }
                    }
                    break;
                case 'transpose-a':
                    result = transposeMatrix(matrixA);
                    displayMatrixResult(result, 'A<sup>T</sup> =');
                    break;
                case 'transpose-b':
                    result = transposeMatrix(matrixB);
                    displayMatrixResult(result, 'B<sup>T</sup> =');
                    break;
                case 'determinant-a':
                    const detA = calculateDeterminant(matrixA);
                    displayScalarResult(detA, 'det(A) =');
                    break;
                case 'determinant-b':
                    const detB = calculateDeterminant(matrixB);
                    displayScalarResult(detB, 'det(B) =');
                    break;
                case 'inverse-a':
                    result = inverseMatrix(matrixA);
                    if (result) {
                        displayMatrixResult(result, 'A<sup>-1</sup> =');
                    } else {
                        showError('La matriz A no tiene inversa (determinante = 0)');
                    }
                    break;
                case 'inverse-b':
                    result = inverseMatrix(matrixB);
                    if (result) {
                        displayMatrixResult(result, 'B<sup>-1</sup> =');
                    } else {
                        showError('La matriz B no tiene inversa (determinante = 0)');
                    }
                    break;
                case 'identity':
                    result = createIdentityMatrix(matrixSize);
                    displayMatrixResult(result, 'I<sub>n</sub> =');
                    break;
            }
        } catch (error) {
            showError(error.message);
        }
    }

    //Operaciones
    function addMatrices(a, b) {
        if (a.length !== b.length || a[0].length !== b[0].length) {
            throw new Error('Las matrices deben tener las mismas dimensiones para sumarse');
        }
        
        const result = createEmptyMatrix(a.length);
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < a[0].length; j++) {
                result[i][j] = a[i][j] + b[i][j];
            }
        }
        return result;
    }
    
    function subtractMatrices(a, b) {
        if (a.length !== b.length || a[0].length !== b[0].length) {
            throw new Error('Las matrices deben tener las mismas dimensiones para restarse');
        }
        
        const result = createEmptyMatrix(a.length);
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < a[0].length; j++) {
                result[i][j] = a[i][j] - b[i][j];
            }
        }
        return result;
    }
    
    function multiplyMatrices(a, b) {
        if (a[0].length !== b.length) {
            throw new Error('El número de columnas de A debe coincidir con el número de filas de B');
        }
        
        const result = createEmptyMatrix(a.length);
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < b[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < a[0].length; k++) {
                    sum += a[i][k] * b[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }

    function displayMatrixResult(matrix, label) {
        resultMatrix.innerHTML = `<p><strong>${label}</strong></p>`;
        resultMatrix.style.gridTemplateColumns = `repeat(${matrix.length}, 1fr)`;
        
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                const cell = document.createElement('div');
                cell.textContent = matrix[i][j].toFixed(4);
                resultMatrix.appendChild(cell);
            }
        }
    }

    function displayScalarResult(value, label) {
        resultScalar.innerHTML = `<p><strong>${label}</strong> ${value}</p>`;
    }

    function clearResults() {
        resultMatrix.innerHTML = '';
        resultScalar.innerHTML = '';
        errorMessage.textContent = '';
    }
    
});