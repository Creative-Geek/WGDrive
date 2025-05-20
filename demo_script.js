// script.js
document.addEventListener('DOMContentLoaded', () => {
    const qrCodeModalEl = document.getElementById('qrCodeModal');
    const qrCodeImage = document.getElementById('qr-code-image');
    const qrFactText = document.getElementById('qr-fact-text');
    // const connectWhatsAppBtn = document.getElementById('connect-whatsapp-btn'); // Not strictly needed for QR generation if using modal events
    const simulateLoginBtn = document.getElementById('simulate-login-btn');
    const dashboardInitialView = document.getElementById('dashboard-initial-view');
    const dashboardLoggedinView = document.getElementById('dashboard-loggedin-view');

    // New DOM Elements for file drop and WhatsApp view
    const dropZoneEl = document.getElementById('gdrive-drop-zone'); // Updated ID here
    const driveViewWrapper = document.getElementById('drive-view-wrapper');
    const whatsappViewWrapper = document.getElementById('whatsapp-view-wrapper');
    const whatsappRecipientNameEl = document.getElementById('whatsapp-recipient-name');
    const whatsappChatAreaEl = document.getElementById('whatsapp-chat-area');
    const phoneNumbersList = document.getElementById('phone-numbers-list'); // Used to get recipient name


    const marketingFacts = [
        "Did you know? Our app boosts productivity by an average of 40%!",
        "Over 10,000 businesses trust us to streamline their workflow.",
        "Get seamlessly integrated with your existing tools in just minutes.",
        "Our dedicated 24/7 customer support is always here to help you succeed.",
        "Unlock exclusive insights and data analytics with our premium features.",
        "Experience the future of collaboration with our innovative platform.",
        "Simplify complex tasks with our intuitive and user-friendly interface.",
        "Join a growing community of innovators and industry leaders."
    ];

    if (qrCodeModalEl) {
        qrCodeModalEl.addEventListener('show.bs.modal', () => {
            const randomFact = marketingFacts[Math.floor(Math.random() * marketingFacts.length)];
            qrFactText.textContent = randomFact;
            
            const qrData = encodeURIComponent(randomFact);
            // Using a slightly different QR server URL for variety if the other has issues, or stick to api.qrserver.com
            // For this example, let's use qrserver.com as it's known to work.
            qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrData}&format=png&qzone=1&margin=0&color=335eea&bgcolor=ffffff`;
            // Added color and bgcolor to match a blue primary, white background
        });
    }

    if (simulateLoginBtn) {
        simulateLoginBtn.addEventListener('click', () => {
            const modalInstance = bootstrap.Modal.getInstance(qrCodeModalEl);
            if (modalInstance) {
                modalInstance.hide();
            }

            if (dashboardInitialView && dashboardLoggedinView) {
                dashboardInitialView.classList.add('d-none');
                dashboardLoggedinView.classList.remove('d-none');
                // Call function to populate the logged-in view
                populateLoggedInDashboard(); 
            }
        });
    }

    function populateLoggedInDashboard() {
        const phoneNumbersListDiv = document.getElementById('phone-numbers-list');
        const logsTerminalDiv = document.getElementById('logs-terminal');

        // Simulated contact names
        const contacts = [
            'Lead Developer @ ProjectX', 
            'Marketing Head @ InnovateCorp', 
            'CEO @ Future Solutions', 
            'Valued Client Alpha', 
            'Support Team Contact'
        ];

        if (phoneNumbersListDiv) {
            phoneNumbersListDiv.innerHTML = ''; // Clear previous contacts
            contacts.forEach(contactName => {
                const listItem = document.createElement('a');
                listItem.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center py-2';
                listItem.href = '#'; // Prevent page jump
                listItem.addEventListener('click', (e) => e.preventDefault()); // Prevent page jump
                listItem.innerHTML = `${contactName} <span class="material-icons text-secondary" style="font-size: 1.1rem;">chat_bubble_outline</span>`;
                phoneNumbersListDiv.appendChild(listItem);
            });
        }

        const addLogMessage = (message, terminal) => {
            if (!terminal) return;
            const logEntry = document.createElement('div');
            logEntry.style.marginBottom = '3px';
            logEntry.innerHTML = `<span class="text-muted">[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span> ${message}`;
            terminal.appendChild(logEntry);
            terminal.scrollTop = terminal.scrollHeight;
        };

        if (logsTerminalDiv) {
            logsTerminalDiv.innerHTML = ''; // Clear previous logs
            addLogMessage("System initialized successfully. Welcome, Demo User!", logsTerminalDiv);
            addLogMessage("<span class='text-success-emphasis'>Secure connection established to WhatsApp services.</span>", logsTerminalDiv);
            addLogMessage("User 'Demo User' authenticated via simulated QR scan.", logsTerminalDiv);
            addLogMessage("Fetching contact list... <span class='text-info'>5 contacts loaded.</span>", logsTerminalDiv);
            addLogMessage("Monitoring for incoming file transfers...", logsTerminalDiv);
            addLogMessage("System Performance: <span class='text-success-emphasis'>Optimal</span>. Engagement metrics: <span class='text-info'>Up by 15% this week!</span>", logsTerminalDiv);
            addLogMessage("Ready to showcase file sharing capabilities.", logsTerminalDiv);
        }
    }

    // Drag and Drop functionality
    if (dropZoneEl) {
        dropZoneEl.addEventListener('dragover', (event) => {
            event.preventDefault();
            dropZoneEl.classList.add('dragover');
        });

        dropZoneEl.addEventListener('dragleave', () => {
            dropZoneEl.classList.remove('dragover');
        });

        dropZoneEl.addEventListener('drop', (event) => {
            event.preventDefault();
            dropZoneEl.classList.remove('dragover');

            // Check if user is "logged in" (i.e., initial dashboard view is hidden)
            if (dashboardInitialView.classList.contains('d-none') === false) {
                alert("Please 'Connect WhatsApp' (simulate login) first to enable file sharing!");
                return;
            }

            const file = event.dataTransfer.files[0];
            if (file) {
                const fileName = file.name;
                if (driveViewWrapper && whatsappViewWrapper) {
                    driveViewWrapper.style.opacity = '0'; // Start fading out Drive view

                    setTimeout(() => {
                        driveViewWrapper.classList.add('d-none'); // Hide Drive view
                        // Optional: Reset Drive view opacity if it could be shown again without a full page interaction
                        // driveViewWrapper.style.opacity = '1'; 

                        whatsappViewWrapper.classList.remove('d-none'); // Make WhatsApp view part of layout (it's opacity 0 from CSS)
                        
                        // Trigger reflow to ensure the opacity 0 is applied before transitioning to 1
                        void whatsappViewWrapper.offsetHeight; 

                        whatsappViewWrapper.style.opacity = '1'; // Start fading in WhatsApp view
                        
                        displayWhatsAppMessage(fileName);

                        // Log this action to the dashboard's terminal
                    const logsTerminalDiv = document.getElementById('logs-terminal'); 
                    // Re-define addLogMessage or ensure it's globally available.
                    // For this integration, we'll assume it might not be global and define a local version
                    // or rely on the check `typeof localAddLogMessage === 'function'`
                    const localAddLogMessage = (message, terminal) => {
                        if (!terminal) return;
                        const logEntry = document.createElement('div');
                        logEntry.style.marginBottom = '3px';
                        // Note: Using textContent for messages to avoid XSS if file names could be malicious & rendered as HTML
                        // However, the specific request uses innerHTML for formatting, so proceed with caution.
                        logEntry.innerHTML = `<span class="text-muted">[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span> ${message}`;
                        terminal.appendChild(logEntry);
                        terminal.scrollTop = terminal.scrollHeight;
                    };

                    if (logsTerminalDiv && typeof localAddLogMessage === 'function') { 
                        const firstContactEl = phoneNumbersList ? phoneNumbersList.querySelector('.list-group-item') : null;
                        const recipientLogName = firstContactEl ? firstContactEl.textContent.split(' <span')[0].trim() : 'Selected Contact';
                        // Escape fileName for security if it's directly put into HTML via innerHTML in addLogMessage
                        const safeFileName = fileName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        localAddLogMessage(`File <span class="text-info">'${safeFileName}'</span> sent to <span class="text-warning">${recipientLogName}</span>.`, logsTerminalDiv);
                    }
                }
            } else {
                console.warn("No file dropped or file access error.");
            }
        });
    }

    function displayWhatsAppMessage(fileName) {
        if (!whatsappRecipientNameEl || !whatsappChatAreaEl) return;

        const firstContactEl = phoneNumbersList ? phoneNumbersList.querySelector('.list-group-item') : null;
        const recipientName = firstContactEl ? firstContactEl.textContent.split(' <span')[0].trim() : 'Selected Contact'; 
        whatsappRecipientNameEl.textContent = 'Chat with ' + recipientName;

        whatsappChatAreaEl.innerHTML = ''; // Clear "Drop a file..." or previous messages

        const messageDiv = document.createElement('div');
        messageDiv.className = 'd-flex justify-content-end mb-3'; 
        // Sanitize fileName before inserting into HTML to prevent XSS if file names are user-controlled and could contain HTML
        const safeFileName = fileName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        messageDiv.innerHTML = `
            <div class="p-2 rounded shadow-sm" style="background-color: #e2ffc7; max-width: 75%; border: 1px solid #c8e6c9;">
                <div class="fw-bold small" style="color: #007bff;">You</div>
                <div class="d-flex align-items-center my-1">
                    <span class="material-icons me-2 text-secondary" style="font-size: 2.2rem;">insert_drive_file</span>
                    <span class="text-break">${safeFileName}</span>
                </div>
                <div class="text-muted small text-end mt-1">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        `;
        whatsappChatAreaEl.appendChild(messageDiv);
        whatsappChatAreaEl.scrollTop = whatsappChatAreaEl.scrollHeight;
    }
});
