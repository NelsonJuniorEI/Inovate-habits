document.addEventListener("DOMContentLoaded", async () => {
  const SUPABASE_URL = "https://avvwtenmextqyxgejujj.supabase.co";
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2dnd0ZW5tZXh0cXl4Z2VqdWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1Mzc1MzMsImV4cCI6MjA3MTExMzUzM30.PT3I_pSoCit_d8n7L5cqNZg8Vujxx5RmFsX9v6it7ok";

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  const formHabito = document.getElementById("formHabito");
  const modalHabito = new bootstrap.Modal(
    document.getElementById("modalHabito")
  );
  const modalEditarHabito = new bootstrap.Modal(
    document.getElementById("modalEditarHabito")
  );
  const listaHabitos = document.getElementById("listahabitos");
  const searchInput = document.getElementById("searchInput");
  const user = JSON.parse(localStorage.getItem("user_data"));
  const userId = user?.id;

  let allHabits = [];
  let editItemId = null;

  if (!userId) {
    window.location.href = "/login.html";
    return;
  }
  const alertError = (msg, e) => console.error(`${msg}:`, e);

  const supa = {
    insert: (data) => supabase.from("habits").insert(data).select().single(),
    update: (id, data) =>
      supabase.from("habits").update(data).eq("id", id).select().single(),
    delete: (id) => supabase.from("habits").delete().eq("id", id),
    fetch: () =>
      supabase
        .from("habits")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    getById: (id) => supabase.from("habits").select("*").eq("id", id).single(),
  };

  async function adicionarHabitos(e) {
    e.preventDefault();
    const name = document.getElementById("habitoNome").value.trim();
    const category = document.getElementById("habitoCategoria").value;
    const description = document.getElementById("habitoDescricao").value.trim();
    const frequency = document.getElementById("habitoFrequencia").value;
    const archived = document.getElementById("habitoArquivado").value;

    if (!name) return alert("Preencha os campos obrigatórios.");

    const novoHabito = {
      name: name,
      category: category,
      description: description,
      frequency: frequency,
      archived: archived,
      user_id: userId,
    };

    const { data, error } = await supa.insert(novoHabito);
    if (error) return alertError("Erro ao adicionar hábito", error);

    allHabits.unshift(data);
    renderHabitos(allHabits);
    updateSummary();
    modalHabito.hide();
    formHabito.reset();
  }

  const renderHabitos = (habitosParaRenderizar) => {
    listaHabitos.innerHTML = "";

    if (!habitosParaRenderizar || habitosParaRenderizar.length === 0) {
      const searchTerm = searchInput.value.trim();
      const message = searchTerm
        ? `Nenhum resultado encontrado para "${searchTerm}"`
        : "Nenhum hábito encontrado. Adicione o primeiro!";
      listaHabitos.innerHTML = `<tr><td colspan="5" class="text-center text-muted p-4">${message}</td></tr>`;
      return;
    }

    habitosParaRenderizar.forEach((habito) => {
      const dataFormatada = new Date(habito.created_at).toLocaleDateString(
        "pt-BR"
      );
      const statusBadge = habito.archived
        ? '<span class="badge bg-secondary">Arquivado</span>'
        : '<span class="badge bg-success">Ativo</span>';

      const row = `
        <tr id="habito-${habito.id}">
          <td>${habito.name}</td>
          <td>${habito.description || "-"}</td>
          <td class="text-center">${statusBadge}</td>
          <td class="text-center">${dataFormatada}</td>
          <td class="text-center">
            <button class="btn btn-sm btn-light border" title="Editar" 
                    data-bs-toggle="modal" data-bs-target="#modalEditarHabito" 
                    onclick="preencherModalEdicao(${habito.id})">
              <i class="bi bi-pencil"></i>
            </button>
            ${
              habito.archived
                ? `<button class="btn btn-sm btn-light border" title="Desarquivar" onclick="toggleArquivarHabito(${habito.id})"><i class="bi bi-box-arrow-up"></i></button>`
                : `<button class="btn btn-sm btn-light border" title="Arquivar" onclick="toggleArquivarHabito(${habito.id})"><i class="bi bi-archive"></i></button>`
            }
          </td>
        </tr>
      `;
      listaHabitos.innerHTML += row;
    });
  };

  const updateSummary = () => {
    const total = allHabits.length;
    const arquivados = allHabits.filter((h) => h.archived).length;
    const ativos = total - arquivados;

    document.getElementById("totalhabitosDisplay").textContent = total
      .toString()
      .padStart(2, "0");
    document.getElementById("totalPendenteDisplay").textContent = ativos
      .toString()
      .padStart(2, "0");
    document.getElementById("totalConcluidoDisplay").textContent = arquivados
      .toString()
      .padStart(2, "0");
  };

  async function listarHabitos() {
    const { data, error } = await supa.fetch();
    if (error) return alertError("Erro ao listar hábitos", error);

    allHabits = data || [];
    renderHabitos(allHabits);
    updateSummary();
  }

  window.preencherModalEdicao = async (id) => {
    const { data, error } = await supa.getById(id);
    if (error) return alertError("Erro ao carregar hábito para edição", error);

    document.getElementById("habitoNomeEdit").value = data.name;
    document.getElementById("habitoCategoriaEdit").value = data.category;
    document.getElementById("habitoDescricaoEdit").value = data.description;
    document.getElementById("habitoFrequenciaEdit").value = data.frequency;
    document.getElementById("habitoArquivadoEdit").value = data.archived;

    editItemId = data.id;
  };

  async function salvarEdicaoHabito() {
    if (!editItemId) return;

    const updatedData = {
      name: document.getElementById("habitoNomeEdit").value.trim(),
      category: document.getElementById("habitoCategoriaEdit").value,
      description: document.getElementById("habitoDescricaoEdit").value.trim(),
      frequency: document.getElementById("habitoFrequenciaEdit").value,
      archived: document.getElementById("habitoArquivadoEdit").value,
    };

    const { data, error } = await supa.update(editItemId, updatedData);
    if (error) return alertError("Erro ao atualizar hábito", error);

    const index = allHabits.findIndex((h) => h.id === editItemId);
    if (index !== -1) {
      allHabits[index] = data;
    }

    renderHabitos(allHabits);
    updateSummary();
    modalEditarHabito.hide();
    editItemId = null;
  }

  window.toggleArquivarHabito = async (id) => {
    const habito = allHabits.find((h) => h.id === id);
    if (!habito) return;

    const novoEstadoArquivado = !habito.archived;
    const acao = novoEstadoArquivado ? "arquivar" : "desarquivar";

    if (!confirm(`Tem certeza que deseja ${acao} este hábito?`)) return;

    const { data, error } = await supa.update(id, {
      archived: novoEstadoArquivado,
    });

    if (error) return alertError(`Erro ao ${acao} hábito`, error);

    const index = allHabits.findIndex((h) => h.id === id);
    if (index !== -1) {
      allHabits[index] = data;
    }
    renderHabitos(allHabits);
    updateSummary();
  };

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredHabits = allHabits.filter(
      (habito) =>
        habito.name.toLowerCase().includes(searchTerm) ||
        (habito.description &&
          habito.description.toLowerCase().includes(searchTerm)) ||
        (habito.category && habito.category.toLowerCase().includes(searchTerm))
    );
    renderHabitos(filteredHabits);
  });

  formHabito.addEventListener("submit", adicionarHabitos);
  document
    .getElementById("btnSalvarHabito")
    ?.addEventListener("click", adicionarHabitos);

  document
    .getElementById("btnAtualizarHabito")
    ?.addEventListener("click", salvarEdicaoHabito);

  listarHabitos();
});
