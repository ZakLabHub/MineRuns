// ⚡ login.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ⚡ Supabase config
const supabaseUrl = 'https://cesmjxusnkaymfuubwgl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlc21qeHVzbmtheW1mdXVid2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NzA4MDIsImV4cCI6MjA3MTM0NjgwMn0.Ksyn8lOlIsrhpmb7n4Pd7SJmv1qPaPe3vipqPaCe1Bc';
const supabase = createClient(supabaseUrl, supabaseKey);

// ⚡ Supabase Function URL (resend-email)
const functionUrl = "https://cesmjxusnkaymfuubwgl.supabase.co/functions/v1/resend-email";

// Variables
let verificationCode = '';
let codeExpiry = 0;
let timerInterval;

// ⚡ Elements
const sendBtn = document.getElementById('sendCodeBtn');
const doneBtn = document.getElementById('doneBtn');
const form = document.getElementById('signupForm');
const codeSection = document.getElementById('codeSection');
const timerEl = document.getElementById('timer');

// ⚡ Send Verification Code
sendBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    if (!email) return alert("Enter your email first");

    verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    codeExpiry = 5*60;

    codeSection.style.display = 'block';
    timerEl.textContent = '05:00';

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        let min = Math.floor(codeExpiry / 60);
        let sec = codeExpiry % 60;
        timerEl.textContent = `${min.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
        codeExpiry--;
        if(codeExpiry < 0){
            clearInterval(timerInterval);
            alert("Verification code expired");
        }
        checkForm();
    }, 1000);

    try {
        const res = await fetch(functionUrl, {
            method:'POST',
            headers:{ 'Content-Type':'application/json' },
            body: JSON.stringify({ email, code: verificationCode })
        });
        const data = await res.json();
        if(data.status === "ok"){
            alert("Verification code sent! Check your email.");
        } else {
            alert("Error sending verification code");
        }
    } catch(e) {
        alert("Error connecting to email service");
        console.error(e);
    }
});

// ⚡ Check form validity
function checkForm() {
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const code = document.getElementById('codeInput').value;
    const cgu = document.getElementById('cgu').checked;

    if(email && username && password && code === verificationCode && codeExpiry>0 && cgu){
        doneBtn.classList.add('enabled');
        doneBtn.disabled = false;
    } else {
        doneBtn.classList.remove('enabled');
        doneBtn.disabled = true;
    }
}

// ⚡ Form submit
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const { data: existing } = await supabase.from('users').select('username').eq('username', username);
    if(existing.length > 0) { alert("Username already taken"); return; }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if(error){ alert(error.message); return; }

    await supabase.from('users').insert([{ id:data.user.id, email, username, accepted_cgu:true }]);
    alert("Signup successful! Check your email to confirm.");
    window.location.href = "home.html";
});

// ⚡ Redirection si déjà connecté
supabase.auth.getSession().then(({data:{session}})=>{
    if(session) window.location.href="home.html";
});

// ⚡ Vérification en direct
form.addEventListener('input', checkForm);
