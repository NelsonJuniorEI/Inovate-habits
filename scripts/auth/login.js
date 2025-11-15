document.addEventListener("DOMContentLoaded", () => {
  const SUPABASE_URL = "https://avvwtenmextqyxgejujj.supabase.co";
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2dnd0ZW5tZXh0cXl4Z2VqdWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1Mzc1MzMsImV4cCI6MjA3MTExMzUzM30.PT3I_pSoCit_d8n7L5cqNZg8Vujxx5RmFsX9v6it7ok";

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const form = document.getElementById("auth-form");
  const emailInput = document.querySelector("input[type='email']");
  const passwordInput = document.querySelector("input[type='password']");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      if (!emailInput.value || !passwordInput.value) {
        alert("Preencha todos os campos");
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput.value,
        password: passwordInput.value,
      });

      if (error) throw error;
      localStorage.setItem("user_data", JSON.stringify(data.user));
      localStorage.setItem("session_data", JSON.stringify(data.session));
      alert("Login realizado com sucesso!");
      window.location.href = "/pages/dashboard.html";
    } catch (error) {
      alert(error.message);
    } finally {
      setTimeout(() => form.reset(), 2000);
    }
  });
});
