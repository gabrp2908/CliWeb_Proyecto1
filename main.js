document.addEventListener('DOMContentLoaded', function() {
    let matrixSize = 2;
    let matrixA = [];
    let matrixB = [];
    
    // Selectores del DOM
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
    
    //Asignación de eventos a botones
    randomFillBtn.addEventListener('click', fillMatricesRandomly);
    clearBtn.addEventListener('click', clearMatrices);
    exampleBtn.addEventListener('click', loadExample);

    document.querySelectorAll('.operation-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const operation = this.getAttribute('data-op');
            executeOperation(operation);
        });
    });

    //Inicialización de cuadriculas de matrices
    function initMatrixGrids() {
        matrixAGrid.innerHTML = '';
        matrixBGrid.innerHTML = '';
        
        matrixA = createEmptyMatrix(matrixSize);
        matrixB = createEmptyMatrix(matrixSize);
        
        //Creación de inputs para las celdas de las matrices
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

    //Matriz vacia para especificar tamaño
    function createEmptyMatrix(size) {
        return Array(size).fill().map(() => Array(size).fill(0));
    }
   
    //Llenado aleatorio de matrices
    function fillMatricesRandomly() {
        const inputsA = matrixAGrid.querySelectorAll('input');
        const inputsB = matrixBGrid.querySelectorAll('input');
        
        //Matriz A
        inputsA.forEach(input => {
            const value = Math.floor(Math.random() * 21) - 10; // -10 a 10
            input.value = value;
            matrixA[parseInt(input.dataset.row)][parseInt(input.dataset.col)] = value;
        });
        
        //Matriz B
        inputsB.forEach(input => {
            const value = Math.floor(Math.random() * 21) - 10; // -10 a 10
            input.value = value;
            matrixB[parseInt(input.dataset.row)][parseInt(input.dataset.col)] = value;
        });
        
        clearResults();
    }
    
    //Limpieza de matrices
    function clearMatrices() {
        const inputsA = matrixAGrid.querySelectorAll('input');
        const inputsB = matrixBGrid.querySelectorAll('input');
        
        //Matriz A
        inputsA.forEach(input => {
            input.value = '0';
            matrixA[parseInt(input.dataset.row)][parseInt(input.dataset.col)] = 0;
        });
        
        //MatrizB
        inputsB.forEach(input => {
            input.value = '0';
            matrixB[parseInt(input.dataset.row)][parseInt(input.dataset.col)] = 0;
        });
        
        clearResults();
    }
    
    //Creación de matrices de ejemplo
    function loadExample() {
        const exampleA = createEmptyMatrix(matrixSize);
        const exampleB = createEmptyMatrix(matrixSize);
        
        for (let i = 0; i < matrixSize; i++) {
            for (let j = 0; j < matrixSize; j++) {
                exampleA[i][j] = i * matrixSize + j + 1;
                exampleB[i][j] = (i * matrixSize + j + 1) * 2;
            }
        }
        
        const inputsA = matrixAGrid.querySelectorAll('input');
        const inputsB = matrixBGrid.querySelectorAll('input');
        
        //Matriz A
        inputsA.forEach((input, index) => {
            const row = Math.floor(index / matrixSize);
            const col = index % matrixSize;
            input.value = exampleA[row][col];
            matrixA[row][col] = exampleA[row][col];
        });
        
        //Matriz B
        inputsB.forEach((input, index) => {
            const row = Math.floor(index / matrixSize);
            const col = index % matrixSize;
            input.value = exampleB[row][col];
            matrixB[row][col] = exampleB[row][col];
        });
        
        clearResults();
    }

    //Operaciones Matriciales
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
                        const verification = multiplyMatrices(matrixA, result);
                        displayVerificationMatrix(verification, 'Verificación (A × A<sup>-1</sup> = I):');
                    } else {
                        showError('La matriz A no tiene inversa (determinante = 0)');
                    }
                    break;
                case 'inverse-b':
                    result = inverseMatrix(matrixB);
                    if (result) {
                        displayMatrixResult(result, 'B<sup>-1</sup> =');
                        const verification = multiplyMatrices(matrixB, result);
                        displayVerificationMatrix(verification, 'Verificación (B × B<sup>-1</sup> = I):');
                    } else {
                        showError('La matriz B no tiene inversa (determinante = 0)');
                    }
                    break;
                case 'identity':
                    result = createIdentityMatrix(matrixSize);
                    displayMatrixResult(result, 'I<sub>n</sub> =', true);
                    break;
            }
        } catch (error) {
            showError(error.message);
        }
    }

    //Suma
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
    
    //Resta
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
    
    //Multiplicación
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

    //Multiplicación por escalar
    function scalarMultiply(k, matrix) {
        const result = createEmptyMatrix(matrix.length);
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                result[i][j] = k * matrix[i][j];
            }
        }
        return result;
    }
    
    //Matriz Transpuesta
    function transposeMatrix(matrix) {
        const result = createEmptyMatrix(matrix[0].length);
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                result[j][i] = matrix[i][j];
            }
        }
        return result;
    }
    
    //Determinante
    function calculateDeterminant(matrix) {
        if (matrix.length !== matrix[0].length) {
            throw new Error('La matriz debe ser cuadrada para calcular el determinante');
        }
        
        // Caso base para matriz 2x2
        if (matrix.length === 2) {
            return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
        }
        
        let det = 0;
        // Expansión por cofactores a lo largo de la primera fila
        for (let j = 0; j < matrix.length; j++) {
            const minor = getMinor(matrix, 0, j);
            det += matrix[0][j] * Math.pow(-1, j) * calculateDeterminant(minor);
        }
        
        return parseFloat(det.toFixed(4));
    }
    
    function getMinor(matrix, row, col) {
        return matrix.filter((_, i) => i !== row)
                    .map(row => row.filter((_, j) => j !== col));
    }
    
    //Matriz inversa
    function inverseMatrix(matrix) {
        const det = calculateDeterminant(matrix);
        if (det === 0) return null;
        
        // Para matrices 2x2
        if (matrix.length === 2) {
            const a = matrix[0][0], b = matrix[0][1];
            const c = matrix[1][0], d = matrix[1][1];
            
            const inverse = [
                [d / det, -b / det],
                [-c / det, a / det]
            ];
            return inverse.map(row => row.map(val => parseFloat(val.toFixed(4))));
        }
        
        // Para matrices más grandes (método de Gauss-Jordan)
        const n = matrix.length;
        const augmented = matrix.map((row, i) => 
            [...row, ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)]
        );
        
        // Eliminación gaussiana
        for (let i = 0; i < n; i++) {
            const diagVal = augmented[i][i];
            for (let j = 0; j < 2 * n; j++) {
                augmented[i][j] /= diagVal;
            }
            
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const factor = augmented[k][i];
                    for (let j = 0; j < 2 * n; j++) {
                        augmented[k][j] -= factor * augmented[i][j];
                    }
                }
            }
        }
        
        // Extraer la parte derecha (inversa)
        const inverse = augmented.map(row => row.slice(n).map(val => parseFloat(val.toFixed(4))));
        return inverse;
    }

    //Matriz Identidad
    function createIdentityMatrix(size) {
        const matrix = createEmptyMatrix(size);
        for (let i = 0; i < size; i++) {
            matrix[i][i] = 1;
        }
        return matrix;
    }

    //Visualización de Matriz de Verificación
    function displayVerificationMatrix(matrix, label) {
        const verificationDiv = document.createElement('div');
        verificationDiv.className = 'verification-matrix';
        verificationDiv.innerHTML = `<p><strong>${label}</strong></p>`;
        verificationDiv.style.display = 'grid';
        verificationDiv.style.gridTemplateColumns = `repeat(${matrix.length}, 1fr)`;
        verificationDiv.style.marginTop = '20px';
        
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                const cell = document.createElement('div');
                cell.textContent = i === j ? '1' : '0';
                
                // Resaltar la diagonal
                if (i === j) {
                    cell.style.backgroundColor = '#DEBDFF';
                    cell.style.fontWeight = 'bold';
                }
                
                verificationDiv.appendChild(cell);
            }
        }
        
        resultMatrix.appendChild(verificationDiv);
    }

    //Visualización de Matriz Resultante
    function displayMatrixResult(matrix, label, isIdentity = false) {
        resultMatrix.innerHTML = `<p><strong>${label}</strong></p>`;
        resultMatrix.style.display='grid';
        resultMatrix.style.gridTemplateColumns = `repeat(${matrix.length}, 1fr)`;
        
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[0].length; j++) {
                const cell = document.createElement('div');
                cell.textContent = matrix[i][j];
                
                // Si es matriz identidad y el elemento está en la diagonal
                if (isIdentity && i === j) {
                    cell.style.backgroundColor = '#f3e8ff';
                    cell.style.borderColor = '#4A148C'
                    cell.style.fontWeight = 'bold';
                }
                
                resultMatrix.appendChild(cell);
            }
        }
    }

    //Visualización de resultado Escalar
    function displayScalarResult(value, label) {
        resultScalar.innerHTML = `<p><strong>${label}</strong> ${value}</p>`;
    }

    //Limpieza de sección de resultados
    function clearResults() {
        resultMatrix.innerHTML = '';
        resultScalar.innerHTML = '';
        errorMessage.textContent = '';
    }
    
    //Mensajes de error
    function showError(message) {
        errorMessage.textContent = message;
    }
    
});