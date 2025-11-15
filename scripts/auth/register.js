document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://avvwtenmextqyxgejujj.supabase.co";
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2dnd0ZW5tZXh0cXl4Z2VqdWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1Mzc1MzMsImV4cCI6MjA3MTExMzUzM30.PT3I_pSoCit_d8n7L5cqNZg8Vujxx5RmFsX9v6it7ok";

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const form = document.getElementById("register-form");
  const emailInput = document.querySelector("input[type='email']");
  const passwordInput = document.querySelector("input[type='password']");
  const usernameInput = document.querySelector("input[type='text']");
  const button = document.querySelector("button");


  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      if (!emailInput.value || !passwordInput.value || !usernameInput.value) {
        alert("Preencha todos os campos");
        return;
      }
      button.disabled = true;

      const { data, error } = await supabase.auth.signUp({
        email: emailInput.value,
        password: passwordInput.value,
        options: {
          data: {
            username: usernameInput.value,
          },
        },
      });

      if (error) throw error;
      window.location.href = "login.html";
      alert("Cadastro realizado com sucesso !");
      
    } catch (error) {
      alert(error.message);
    } finally {
      button.disabled = false;
      setTimeout(() => form.reset(), 2000);
    }
  });
});
