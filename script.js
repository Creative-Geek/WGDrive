// JavaScript for the project showcase demo
document.addEventListener('DOMContentLoaded', () => {
    // Existing DOM elements
    const qrModal = document.getElementById('qr-modal');
    const loginButton = document.getElementById('login-button');
    const closeModalButton = document.querySelector('#qr-modal .close-button');
    const qrCodeImage = document.getElementById('qr-code-image');
    const qrFactText = document.getElementById('qr-fact-text');
    
    const simulateLoginButton = document.getElementById('simulate-login-button');
    const dashboardInitialView = document.getElementById('dashboard-initial-view');
    const dashboardLoggedinView = document.getElementById('dashboard-loggedin-view');
    const phoneNumbersListDiv = document.getElementById('phone-numbers-list');
    const logsTerminalDiv = document.getElementById('logs-terminal');

    const programmingFacts = [
        "The first computer programmer was Ada Lovelace, an English mathematician.",
        "The first actual computer 'bug' was a moth found trapped in a relay of the Harvard Mark II computer in 1947.",
        "JavaScript was created by Brendan Eich at Netscape in just 10 days in May 1995.",
        "Python was named after the British comedy group Monty Python, not the snake.",
        "The term 'algorithm' is derived from the name of the 9th-century Persian mathematician Muhammad ibn Musa al-Khwarizmi.",
        "There are currently over 700 programming languages. Some of the most popular include Python, JavaScript, Java, C++, and C#.",
        "The first video game, 'Tennis for Two', was created by physicist William Higinbotham in 1958.",
        "FORTRAN (Formula Translation), developed by IBM in the 1950s, is one of the oldest programming languages still in use, especially for scientific and engineering applications.",
        "The 'Hello, World!' program is traditionally the first program learners write in a new language.",
        "Grace Hopper is credited with popularizing the term 'debugging' for fixing computer glitches."
    ];

    const predefinedPhoneNumbers = [
        '+1 555 0100 (Demo User 1)', 
        '+44 20 7946 0000 (Demo User 2)', 
        '+91 22 6601 9000 (Demo User 3)',
        '+81 3 1234 5678 (Demo User 4)',
        '+49 30 98765432 (Demo User 5)'
    ];

    function addLogMessage(message, terminal) {
        const p = document.createElement('p');
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        p.textContent = `[${timestamp}] ${message}`;
        p.style.margin = '2px 0';
        p.style.fontSize = '0.9em';
        terminal.appendChild(p);
        terminal.scrollTop = terminal.scrollHeight;
    }

    if (loginButton) {
        loginButton.addEventListener('click', () => {
            const randomFact = programmingFacts[Math.floor(Math.random() * programmingFacts.length)];
            qrFactText.textContent = `Programming Fact: ${randomFact}`;
            const qrData = encodeURIComponent(randomFact);
            qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}&ecc=L&margin=10`;
            if (qrModal) qrModal.classList.add('modal-visible');
        });
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', () => {
            if (qrModal) qrModal.classList.remove('modal-visible');
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === qrModal) {
            if (qrModal) qrModal.classList.remove('modal-visible');
        }
    });

    if (simulateLoginButton) {
        simulateLoginButton.addEventListener('click', () => {
            if (qrModal) qrModal.classList.remove('modal-visible'); // Updated here
            if (dashboardInitialView) dashboardInitialView.style.display = 'none';
            if (dashboardLoggedinView) dashboardLoggedinView.style.display = 'block';

            if (phoneNumbersListDiv) {
                phoneNumbersListDiv.innerHTML = '';
                predefinedPhoneNumbers.forEach(num => {
                    const p = document.createElement('p');
                    p.textContent = num;
                    p.style.margin = '5px 0';
                    p.style.padding = '3px';
                    p.style.borderBottom = '1px solid #eee';
                    phoneNumbersListDiv.appendChild(p);
                });
            }

            if (logsTerminalDiv) {
                addLogMessage("User successfully logged in via QR simulation.", logsTerminalDiv);
                addLogMessage("Fetching contacts...", logsTerminalDiv);
                addLogMessage(`Loaded ${predefinedPhoneNumbers.length} contacts.`, logsTerminalDiv);
            }
        });
    }

    // --- New code for File Drop and WhatsApp UI ---
    const dropZone = document.getElementById('drop-zone');
    const rightPaneContent = document.getElementById('right-pane-content');
    // phoneNumbersListDiv is already defined and fetched above
    // The displayWhatsAppGui function is defined outside DOMContentLoaded in the current file.
    // This is fine as long as it's called correctly.

    if (dropZone && rightPaneContent) { // Make sure both dropZone and rightPaneContent exist
        dropZone.addEventListener('dragover', (event) => {
            event.preventDefault(); 
            dropZone.classList.add('dragover');
            // dropZone.style.backgroundColor = '#f0f8ff'; // This can be kept if .dragover doesn't handle it or removed if it does
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
            // dropZone.style.backgroundColor = ''; // Reset background
        });

        dropZone.addEventListener('drop', (event) => {
            event.preventDefault();
            dropZone.classList.remove('dragover');
            // dropZone.style.backgroundColor = ''; // Reset background

            if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
                const file = event.dataTransfer.files[0];
                const fileName = file.name;
                
                // Check if user is "logged in" (i.e., if phone numbers are displayed)
                // phoneNumbersListDiv is already fetched
                if (phoneNumbersListDiv && phoneNumbersListDiv.children.length > 0) {
                    displayWhatsAppGui(fileName, phoneNumbersListDiv, rightPaneContent);
                    if (logsTerminalDiv) { // Add a log message for file drop
                        addLogMessage(`File "${fileName}" dropped. Displaying WhatsApp simulation.`, logsTerminalDiv);
                    }
                } else {
                    alert("Please log in first to simulate sending a file.");
                    if (logsTerminalDiv) { // Add a log message for failed attempt
                        addLogMessage(`File drop attempt failed: User not logged in.`, logsTerminalDiv);
                    }
                }
            }
        });
    }
}); // End of DOMContentLoaded

// The displayWhatsAppGui function is defined below, outside of DOMContentLoaded.
// This is consistent with the current state of script.js as read.
// No changes are needed to its definition or placement based on the current subtask.

function displayWhatsAppGui(fileName, phoneNumbersListDiv, rightPaneContent) {
    let recipientName = "Selected Contact"; // Default
    if (phoneNumbersListDiv && phoneNumbersListDiv.firstChild && phoneNumbersListDiv.firstChild.textContent) {
        recipientName = phoneNumbersListDiv.firstChild.textContent.split('(')[0].trim(); // Get the number part
    }

    rightPaneContent.innerHTML = ''; // Clear previous content (Google Drive sim)

    const header = document.createElement('div');
    header.className = 'whatsapp-header';
    header.style.backgroundColor = '#ededed';
    header.style.padding = '10px 15px';
    header.style.borderBottom = '1px solid #ccc';
    header.innerHTML = `<h3 id="whatsapp-recipient" style="margin: 0; font-size: 16px;">${recipientName}</h3>`;

    const chatArea = document.createElement('div');
    chatArea.className = 'whatsapp-chat-area';
    chatArea.style.padding = '20px'; 
    chatArea.style.height = 'calc(100% - 120px)'; // Adjust based on header/footer (approx 60px header, 60px input)
    chatArea.style.overflowY = 'auto';
    chatArea.style.backgroundImage = 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")';
    chatArea.style.backgroundRepeat = 'repeat';
    chatArea.style.boxSizing = 'border-box';


    const messageSentDiv = document.createElement('div');
    messageSentDiv.className = 'message sent';
    messageSentDiv.style.backgroundColor = '#dcf8c6';
    messageSentDiv.style.padding = '8px 12px';
    messageSentDiv.style.borderRadius = '7px';
    messageSentDiv.style.marginBottom = '10px';
    messageSentDiv.style.maxWidth = '60%';
    messageSentDiv.style.marginLeft = 'auto'; 
    messageSentDiv.style.textAlign = 'left';
    messageSentDiv.style.boxShadow = '0 1px 1px rgba(0,0,0,0.05)';
    messageSentDiv.style.wordWrap = 'break-word'; // Ensure long file names wrap
    messageSentDiv.innerHTML = `
        <p style="margin: 0 0 5px 0; color: #333; font-size: 13px; font-weight: 500;">You</p>
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
            <span style="font-size: 28px; margin-right: 10px; line-height: 1;">📄</span> 
            <span id="whatsapp-filename" style="color: #303030; font-size: 14px;">${fileName}</span>
        </div>
        <p style="margin: 0; text-align: right; font-size: 11px; color: #888;">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
    `;

    chatArea.appendChild(messageSentDiv);

    const inputArea = document.createElement('div');
    inputArea.className = 'whatsapp-input-area';
    inputArea.style.padding = '10px';
    inputArea.style.borderTop = '1px solid #ccc';
    inputArea.style.backgroundColor = '#f0f0f0';
    inputArea.style.boxSizing = 'border-box';
    inputArea.innerHTML = '<input type="text" placeholder="Type a message (simulation only)" style="width: 100%; padding: 10px; border-radius: 20px; border: 1px solid #ddd; box-sizing: border-box;" disabled>';
    
    rightPaneContent.appendChild(header);
    rightPaneContent.appendChild(chatArea);
    rightPaneContent.appendChild(inputArea);
}
