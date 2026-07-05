document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('numberInput');
    const checkBtn = document.getElementById('checkBtn');
    const resultsContainer = document.getElementById('resultsContainer');
    const errorMsg = document.getElementById('errorMsg');
    
    // Modal elements
    const treeModal = document.getElementById('treeModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const treeContainer = document.getElementById('treeContainer');
    const modalTitle = document.getElementById('modalTitle');

    // Đóng modal
    closeModalBtn.addEventListener('click', () => {
        treeModal.classList.add('hidden');
    });
    
    // Đóng modal khi click ra ngoài
    treeModal.addEventListener('click', (e) => {
        if (e.target === treeModal) {
            treeModal.classList.add('hidden');
        }
    });

    // Sự kiện khi bấm nút
    checkBtn.addEventListener('click', processInput);

    // Sự kiện khi nhấn Enter trong ô input
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            processInput();
        }
    });

    function processInput() {
        const rawInput = inputField.value.trim();
        resultsContainer.innerHTML = ''; // Xóa kết quả cũ
        errorMsg.classList.add('hidden');
        inputField.classList.remove('shake');

        if (rawInput === '') return;

        // Tách các số bằng dấu phẩy
        const stringParts = rawInput.split(',');
        const numbers = [];

        // Kiểm tra định dạng đầu vào
        let isValid = true;
        for (let part of stringParts) {
            const cleanStr = part.trim();
            if (cleanStr === '') continue; // Bỏ qua phần trống do người dùng gõ dư dấu phẩy
            
            const num = Number(cleanStr);
            if (!Number.isInteger(num) || isNaN(num) || num < 0) {
                isValid = false;
                break;
            }
            numbers.push(num);
        }

        if (!isValid || numbers.length === 0) {
            inputField.classList.add('shake');
            errorMsg.classList.remove('hidden');
            // Xóa class shake sau khi animation kết thúc để có thể rung lại lần sau
            setTimeout(() => {
                inputField.classList.remove('shake');
            }, 500);
            return;
        }

        // Xử lý từng số và tạo thẻ
        let allPrimes = true;

        numbers.forEach((num, index) => {
            const checkResult = isPrime(num);
            if (!checkResult.isPrime) allPrimes = false;
            
            // Tạo độ trễ nhỏ (stagger effect) khi hiện các thẻ
            setTimeout(() => {
                createResultCard(num, checkResult);
            }, index * 100); 
        });

        // Bắn pháo giấy nếu tất cả đều là số nguyên tố
        if (allPrimes && numbers.length > 0) {
            setTimeout(fireConfetti, numbers.length * 100 + 300);
        }
    }

    // Hàm kiểm tra số nguyên tố
    function isPrime(num) {
        if (num === 0 || num === 1) {
            return { isPrime: false, reason: "0 và 1 không phải là số nguyên tố đâu nhé, hãy thử từ số 2 trở lên!", special: true };
        }
        if (num === 2) {
            return { isPrime: true, reason: "Số 2 là số nguyên tố chẵn duy nhất trên đời! Hiếm lắm đó!", special: true };
        }
        if (num % 2 === 0) {
            return { isPrime: false, reason: `Không phải số nguyên tố, vì nó chia hết cho 2 mất rồi!` };
        }
        
        const limit = Math.sqrt(num);
        for (let i = 3; i <= limit; i += 2) {
            if (num % i === 0) {
                return { isPrime: false, reason: `Không phải số nguyên tố, vì nó chia hết cho ${i} mất rồi!` };
            }
        }
        return { isPrime: true, reason: "Tuyệt vời! Một số nguyên tố đích thực!" };
    }

    // Hàm tạo giao diện thẻ
    function createResultCard(num, checkResult) {
        const card = document.createElement('div');
        card.className = 'card';
        
        if (checkResult.special) {
            card.classList.add('special');
        } else if (checkResult.isPrime) {
            card.classList.add('prime');
        } else {
            card.classList.add('not-prime');
        }

        const title = document.createElement('h2');
        title.textContent = num;

        const status = document.createElement('p');
        status.textContent = checkResult.isPrime ? "Là Số Nguyên Tố" : "Không Phải Số Nguyên Tố";

        const reason = document.createElement('p');
        reason.className = 'reason';
        reason.textContent = checkResult.reason;

        card.appendChild(title);
        card.appendChild(status);
        card.appendChild(reason);
        
        // Thêm sự kiện click để mở modal
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            openTreeModal(num);
        });

        resultsContainer.appendChild(card);
    }

    // Hàm bắn pháo giấy
    function fireConfetti() {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#39ff14', '#b026ff', '#ffffff']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#39ff14', '#b026ff', '#ffffff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    // --- Modal và Cây phân tích ---
    function openTreeModal(num) {
        modalTitle.textContent = `Phân tích số ${num}`;
        treeContainer.innerHTML = generateTreeHTML(num);
        treeModal.classList.remove('hidden');
    }

    function getFactors(num) {
        if (num <= 3) return null;
        for (let i = Math.floor(Math.sqrt(num)); i >= 2; i--) {
            if (num % i === 0) {
                return [i, num / i]; // Trả về 2 thừa số (ví dụ 45 -> [5, 9])
            }
        }
        return null; // Là số nguyên tố
    }

    function generateTreeHTML(num) {
        if (num <= 1) {
            return `<div class="tree-node-wrapper"><div class="tree-node-value">${num}</div></div>`;
        }
        const factors = getFactors(num);
        if (!factors) {
            // Số nguyên tố (hiển thị luôn 2 ước là 1 và chính nó)
            return `
                <div class="tree-node-wrapper">
                    <div class="tree-node-value prime-node">${num}</div>
                    <div class="tree-children">
                        <div class="tree-node-wrapper"><div class="tree-node-value">1</div></div>
                        <div class="tree-node-wrapper"><div class="tree-node-value prime-node">${num}</div></div>
                    </div>
                </div>
            `;
        }
        // Hợp số (tiếp tục chia nhánh)
        return `
            <div class="tree-node-wrapper">
                <div class="tree-node-value">${num}</div>
                <div class="tree-children">
                    ${generateTreeHTML(factors[0])}
                    ${generateTreeHTML(factors[1])}
                </div>
            </div>
        `;
    }
});
