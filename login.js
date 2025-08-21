async function checkBeforeSending() {
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // ⚡ Validation avant envoi
    if(!validateEmail(email)) return alert("Email invalide");
    if(username.length < 3) return alert("Nom trop court");
    if(password.length < 6) return alert("Mot de passe trop court");

    // ⚡ Vérifie si username déjà pris
    const { data: existing } = await supabase.from('users').select('username').eq('username', username);
    if(existing.length>0) return alert("Nom déjà pris");

    // ✅ Si tout ok, envoie le code
    sendVerificationCode(email);
}

async function sendVerificationCode(email) {
    verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    codeExpiry = 5*60;

    // Affiche seulement après validation complète
    document.getElementById('codeSection').style.display = 'block';
    document.getElementById('timer').textContent = '05:00';

    // ⚡ Timer
    clearInterval(timerInterval);
    timerInterval = setInterval(()=>{ 
        codeExpiry--;
        const min = Math.floor(codeExpiry/60);
        const sec = codeExpiry % 60;
        document.getElementById('timer').textContent = `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
        if(codeExpiry < 0) {
            clearInterval(timerInterval);
            alert("Code expiré");
        }
        checkForm();
    }, 1000);

    // ⚡ Envoi du mail via Supabase Function
    try {
        const res = await fetch(functionUrl, {
            method:'POST',
            headers:{ 'Content-Type':'application/json' },
            body: JSON.stringify({ email, code: verificationCode })
        });
        const data = await res.json();
        if(data.status !== "ok") alert("Erreur envoi code");
    } catch(e) {
        alert("Error connecting to email service");
        console.error(e);
    }
}
