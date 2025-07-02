// js/auth.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-client-form');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        e.stopPropagation();

        // Lectura valores desde los inputs
        const name = document.getElementById('client-name').value.trim();
        const email = document.getElementById('client-email').value.trim();
        const password = document.getElementById('client-pass').value;
        const msg = document.getElementById('register-client-msg');

        // Envía al endpoint
        try {
            const res = await fetch('/api/register/client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            // Respuesta
            if (res.ok) {
                msg.textContent = '¡Registrado correctamente! Volviendo al inicio…';
                msg.style.color = 'green';
                form.reset();
                // Redirige al inicio
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 2000);

            } else {
                const { error } = await res.json();
                msg.textContent = error || 'Error al registrar cliente.';
                msg.style.color = 'red';
            }
        } catch (err) {
            console.error('❌ Error conexión registro-client:', err);
            msg.textContent = 'No se pudo conectar al servidor.';
            msg.style.color = 'red';
        }
    });
});

// Login de clientes
document.addEventListener('DOMContentLoaded', () => {
    const loginClientForm = document.getElementById('login-client-form');
    if (loginClientForm) {
        loginClientForm.addEventListener('submit', async e => {
            e.preventDefault(); e.stopPropagation();

            const email = document.getElementById('login-client-email').value.trim();
            const password = document.getElementById('login-client-pass').value;
            const msg = document.getElementById('login-client-msg');

            try {
                const res = await fetch('/api/login/client', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const body = await res.json();

                if (res.ok) {
                    // Guarda el nombre y redirige al index
                    localStorage.setItem('clientName', body.name);
                    window.location.href = '../index.html';
                } else {
                    msg.textContent = body.error || 'Credenciales inválidas.';
                    msg.style.color = 'red';
                }
            } catch (err) {
                console.error('Error conexión login-client:', err);
                msg.textContent = 'Fallo de conexión.';
                msg.style.color = 'red';
            }
        });
    }
});
